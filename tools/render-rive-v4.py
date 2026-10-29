#!/usr/bin/env python3
"""Official native Rive capture; isolated build roots, at most three workers on five CPUs."""
from pathlib import Path
import os,subprocess,xml.etree.ElementTree as E,copy,shutil,json,hashlib,argparse
from concurrent.futures import ThreadPoolExecutor
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4';V=P/'preview';V.mkdir(exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['draft','final','refine']);mode=parser.parse_args().mode
rive=str(R/'tools/rive')
def run(cmd,**kw):return subprocess.run(cmd,cwd=R,check=True,**kw)
def prepare(theme,part):
 d=P/'build'/f'render-{theme.lower()}-{part}';d.mkdir(parents=True,exist_ok=True)
 root=E.parse(P/'scene.rml').getroot();nr=E.Element('Rive',version='1',kind='fragment')
 for n in root:
  if n.tag!='Artboard' or n.get('name')==theme:nr.append(copy.deepcopy(n))
 E.ElementTree(nr).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text(f'name: render-{theme.lower()}-{part}\n')
 for f in P.glob('*.ttf'):shutil.copy(f,d/f.name)
 return d

def capture(theme,prefix,fps,scale,part=0,parts=1):
 d=prepare(theme,part);fd=V/f'frames-{prefix}-{theme.lower()}';fd.mkdir(exist_ok=True);count=16*fps
 with (d/'capture.log').open('w') as log:
  limit=480 if mode=='refine' and prefix=='final' else count
  for n,i in enumerate(range(part,limit,parts)):
   advance=960 if i==count-1 else i*(60//fps)+1
   capture_env=dict(os.environ);capture_env.setdefault('LP_NUM_THREADS','1')
   run([rive,str(d),f'--screenshot={fd/f"{i:04d}.png"}',f'--advance={advance}',f'--scale={scale}'],stdout=log,stderr=log,env=capture_env)
   if (n+1)%60==0:print(f'{prefix} {theme} worker {part+1}/{parts}: {n+1} native captures',flush=True)

def encode(theme,prefix,fps):
 fd=V/f'frames-{prefix}-{theme.lower()}'
 assert all((fd/f'{i:04d}.png').exists() for i in range(16*fps))
 output=V/(f'intro-v4-{theme.lower()}.mp4' if prefix=='final' else 'draft-full-dark.mp4')
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate',str(fps),'-i',str(fd/'%04d.png'),'-c:v','libx264','-preset','fast' if prefix=='draft' else 'slow','-crf','20' if prefix=='draft' else '16','-pix_fmt','yuv420p','-movflags','+faststart',str(output)])
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(output)],text=True))
 probe['sha256']=hashlib.sha256(output.read_bytes()).hexdigest();(V/f'{prefix}-{theme.lower()}-info.json').write_text(json.dumps(probe,indent=2)+'\n')
 if prefix=='final':
  run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','60','-i',str(fd/'%04d.png'),'-vf','fps=15,scale=360:640:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a','-loop','-1',str(V/f'intro-v4-{theme.lower()}.gif')])
 print(json.dumps({'mode':prefix,'theme':theme,**probe}),flush=True)
if mode=='draft':
 capture('Dark','draft',15,1/3);encode('Dark','draft',15)
else:
 if mode=='refine':
  from PIL import Image,ImageChops
  manifest=json.loads((V/'cache-verified.json').read_text())
  assert manifest['source_rml_sha256']==hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()
  compared=[]
  for theme in ['Dark','Light']:
   for frame in [480,600,780,960]:
    dst=P/'build'/f'cache-check-{theme}-{frame}.png'
    run([rive,str(P),f'--artboard={theme}',f'--advance={frame}',f'--screenshot={dst}'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    original=V/f'frames-final-{theme.lower()}'/f'{frame-1:04d}.png'
    assert ImageChops.difference(Image.open(dst).convert('RGB'),Image.open(original).convert('RGB')).getbbox() is None
    compared.append({'theme':theme,'frame':frame,'pixel_difference':0})
  manifest['native_ab_comparisons']=compared
  (V/'cache-verified.json').write_text(json.dumps(manifest,indent=2)+'\n')
 run([rive,str(P),'--once'])
 with ThreadPoolExecutor(max_workers=3) as pool:
  jobs=[pool.submit(capture,t,'final',60,1,part,3) for t in ['Dark','Light'] for part in range(3)]
  for job in jobs:job.result()
 for t in ['Dark','Light']:encode(t,'final',60)
