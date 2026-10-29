#!/usr/bin/env python3
"""Official Rive captures: stills, short tests, then native 60-FPS finals."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from zoneinfo import ZoneInfo
import argparse,copy,hashlib,json,os,shutil,subprocess,threading,xml.etree.ElementTree as E
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';V=P/'preview'
parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['stills','tests','final']);mode=parser.parse_args().mode
lock=threading.Lock();env=dict(os.environ);env['LP_NUM_THREADS']='1'
def record(msg):
 with lock:
  with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — '+msg+'\n')
def run(args,**kw):return subprocess.run(args,cwd=R,env=env,check=True,**kw)
def capture(theme,part,frames,folder,scale):
 d=P/'build'/f'{mode}-{theme}-{part}';d.mkdir(parents=True,exist_ok=True)
 root=E.parse(P/'scene.rml').getroot();out=E.Element('Rive',version='1',kind='fragment')
 for n in root:
  if n.tag!='Artboard' or n.get('name')==theme:out.append(copy.deepcopy(n))
 E.ElementTree(out).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text(f'name: v43-{theme}-{part}\n')
 for f in P.glob('*.ttf'):shutil.copyfile(f,d/f.name)
 dest=V/folder;dest.mkdir(exist_ok=True)
 stamp=dest/'source.json'
 signature={'assets':assets,'scale':scale,'theme':theme}
 with lock:
  if stamp.exists():assert json.loads(stamp.read_text())==signature, 'Stale cache: use a new folder after source edits'
  else:stamp.write_text(json.dumps(signature,indent=2)+'\n')
 with (d/'capture.log').open('w') as log:
  for j,f in enumerate(frames):
   if (dest/f'{f:04d}.png').exists():continue
   run([str(R/'tools/rive'),str(d),f'--screenshot={dest/f"{f:04d}.png"}',f'--advance={f+1}',f'--scale={scale}'],stdout=log,stderr=log)
   if (j+1)%30==0:print(f'{mode}/{theme}/{part}: {j+1}/{len(frames)}',flush=True)
def encode(folder,frames,fps,name):
 fl=V/folder/'encode.txt';fl.write_text(''.join(f"file '{f:04d}.png'\nduration {1/fps:.12f}\n" for f in frames))
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-r',str(fps),'-i',str(fl),'-frames:v',str(len(frames)),'-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(V/name)])
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(V/name)],text=True))
 data['source_rml_sha256']=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();data['sha256']=hashlib.sha256((V/name).read_bytes()).hexdigest()
 (V/(name+'.json')).write_text(json.dumps(data,indent=2)+'\n');record('실제 렌더/인코딩 완료: '+name+' / '+json.dumps(data['format']));print(name,data['format'],flush=True)
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();record('렌더 시작: '+mode+' / '+source)
if mode=='stills':
 with ThreadPoolExecutor(max_workers=4) as pool:
  frames=[60,135,165,205,210,300,420,460,500,530,550,580,630,680,710,725,740,760,780,900,959]
  jobs=[pool.submit(capture,'Dark',k,frames[k::4],'test-stills-dark',.5) for k in range(4)]
  jobs += [pool.submit(capture,'Light',4,[460,550,725,780,959],'test-stills-light',.5)]
  for j in jobs:j.result()
elif mode=='tests':
 frames=list(range(0,960,3))
 with ThreadPoolExecutor(max_workers=4) as pool:
  jobs=[pool.submit(capture,'Dark',k,frames[k::4],'test-frames',1/3) for k in range(4)]
  for j in jobs:j.result()
 encode('test-frames',list(range(0,450,3)),20,'test-01-intro-morph.mp4')
 encode('test-frames',list(range(450,798,3)),20,'test-02-sliders-feed.mp4')
 encode('test-frames',list(range(798,960,3)),20,'test-03-brand-ui.mp4')
else:
 check=json.loads((V/'source-verification.json').read_text());assert check['passed'] and check['source_rml_sha256']==source
 test=json.loads((V/'test-review.json').read_text());assert test['final_ready'] and test['assets_sha256']==assets
 proof=json.loads((V/'unchanged-intervals.json').read_text());assert proof['passed'] and proof['assets_sha256']==assets
 run([str(R/'tools/rive'),str(P),'--once'])
 cache=R/'animation/intro-v4-2/preview';retained=list(range(120))
 reuse=all((cache/f'frames-final-{t}'/f'{f:04d}.png').exists() for t in ['dark','light'] for f in retained)
 frames=list(range(120,960)) if reuse else list(range(960))
 plan={'source_rml_sha256':source,'assets_sha256':assets,'new_native_frames_per_theme':len(frames),'preserved_native_frames_per_theme':960-len(frames),'preserved_intervals':[[0,119]] if reuse else [],'render_completed':False}
 (V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
 with ThreadPoolExecutor(max_workers=4) as pool:
  jobs=[pool.submit(capture,t,k,frames[k::4],f'frames-final-{t.lower()}',1) for t in ['Dark','Light'] for k in range(4)]
  for j in jobs:j.result()
 for theme in ['dark','light']:
  if reuse:
   for f in retained:shutil.copyfile(cache/f'frames-final-{theme}'/f'{f:04d}.png',V/f'frames-final-{theme}'/f'{f:04d}.png')
  encode(f'frames-final-{theme}',list(range(960)),60,f'intro-v4-3-{theme}.mp4')
 plan['render_completed']=True;(V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
