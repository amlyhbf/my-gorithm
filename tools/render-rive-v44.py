#!/usr/bin/env python3
"""Official Rive captures: stills, short tests, then native 60-FPS finals."""
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from zoneinfo import ZoneInfo
import argparse,copy,hashlib,json,os,shutil,subprocess,threading,xml.etree.ElementTree as E
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-4';V=P/'preview'
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
 E.ElementTree(out).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text(f'name: v44-{theme}-{part}\n')
 for f in P.glob('*.ttf'):shutil.copyfile(f,d/f.name)
 channels=[]
 for kp in out.findall('.//KeyedProperty'):
  if kp.find('KeyFrameDouble') is None:continue
  keys=list(kp);channels.append((kp,keys,[int(k.get('frame','0')) for k in keys]))
 dest=V/folder;dest.mkdir(exist_ok=True)
 stamp=dest/'source.json'
 signature={'assets':assets,'scale':scale,'theme':theme}
 with lock:
  if stamp.exists():assert json.loads(stamp.read_text())==signature, 'Stale cache: use a new folder after source edits'
  else:stamp.write_text(json.dumps(signature,indent=2)+'\n')
 with (d/'capture.log').open('w') as log:
  for j,f in enumerate(frames):
   existing=dest/f'{f:04d}.png'
   if existing.exists():
    try:
     with Image.open(existing) as png:
      assert png.size==(round(1080*scale),round(1920*scale));png.verify()
     continue
    except (OSError,AssertionError):existing.unlink()
   if os.environ.get('RIVE_V44_FRAME_WINDOW','1')=='1':
    from bisect import bisect_right
    for kp,keys,clock in channels:
     j0=max(0,bisect_right(clock,f)-1);kp[:]=keys[j0:j0+2]
    E.ElementTree(out).write(d/'scene.rml',encoding='unicode')
   run([str(R/'tools/rive'),str(d),f'--screenshot={dest/f"{f:04d}.png"}',f'--advance={f+1}',f'--scale={scale}'],stdout=log,stderr=log)
   if (j+1)%30==0:print(f'{mode}/{theme}/{part}: {j+1}/{len(frames)}',flush=True)
def encode(folder,frames,fps,name):
 previous=V/(name+'.json')
 if (V/name).exists() and previous.exists():
  prior=json.loads(previous.read_text())
  if prior.get('source_rml_sha256')==source and prior.get('sha256')==hashlib.sha256((V/name).read_bytes()).hexdigest():
   stream=prior['streams'][0]
   if stream['avg_frame_rate']==f'{fps}/1' and int(stream['nb_read_frames'])==len(frames):
    record('검증된 기존 MP4 재사용: '+name);return
 fl=V/folder/'encode.txt';fl.write_text(''.join(f"file '{f:04d}.png'\nduration {1/fps:.12f}\n" for f in frames))
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-r',str(fps),'-i',str(fl),'-frames:v',str(len(frames)),'-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(V/name)])
 data=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(V/name)],text=True))
 data['source_rml_sha256']=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();data['sha256']=hashlib.sha256((V/name).read_bytes()).hexdigest()
 (V/(name+'.json')).write_text(json.dumps(data,indent=2)+'\n');record('실제 렌더/인코딩 완료: '+name+' / '+json.dumps(data['format']));print(name,data['format'],flush=True)
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();record('렌더 시작: '+mode+' / '+source)
from timing_v44 import CHANGED,REUSE
cache=R/'animation/intro-v4-3/preview'
def baseline_frame(f):
 for a,z,offset in REUSE:
  if a<=f<=z:return f+offset
 return None

def prepare_cached(theme,frames,folder,scale):
 dest=V/folder;dest.mkdir(exist_ok=True)
 for f in frames:
  old=baseline_frame(f)
  if old is None:continue
  existing=dest/f'{f:04d}.png'
  if existing.exists():continue
  path=cache/f'frames-final-{theme.lower()}'/f'{old:04d}.png'
  assert path.exists(),f'Missing verified V4.3 native frame: {path}'
  if scale==1:shutil.copyfile(path,existing)
  else:
   with Image.open(path) as png:png.resize((round(1080*scale),round(1920*scale)),Image.Resampling.LANCZOS).save(existing)

def capture_set(theme,frames,folder,scale):
 prepare_cached(theme,frames,folder,scale)
 changed=[f for f in frames if baseline_frame(f) is None]
 with ThreadPoolExecutor(max_workers=int(os.environ.get('RIVE_V44_WORKERS','4'))) as pool:
  jobs=[pool.submit(capture,theme,k,changed[k::4],folder,scale) for k in range(4)]
  for j in jobs:j.result()

if mode=='stills':
 frames=[0,6,15,22,29,35,41,48,60,72,80,90,234,474,532,536,554,574,633,678,684,717,747,858,959]
 capture_set('Dark',frames,'test-stills-dark',.5)
 capture_set('Light',[6,29,48,72,90,532,678,747,959],'test-stills-light',.5)
elif mode=='tests':
 frames=list(range(0,246,2))+list(range(474,798,2))
 capture_set('Dark',frames,'test-frames',.5)
 encode('test-frames',list(range(0,246,2)),30,'test-a-kinetic-entrance.mp4')
 encode('test-frames',list(range(474,798,2)),30,'test-b-feed-response.mp4')
else:
 verification=json.load(open(V/'source-verification.json'));assert verification['passed'] and verification['source_rml_sha256']==source
 proof=json.load(open(V/'native-preservation.json'));assert proof['passed'] and proof['assets_sha256']==assets
 test=json.load(open(V/'test-review.json'));assert test['final_ready'] and test['assets_sha256']==assets
 run([str(R/'tools/rive'),str(P),'--once'])
 plan={'source_rml_sha256':source,'assets_sha256':assets,'new_native_frames_per_theme':sum(z-a+1 for a,z in CHANGED),'preserved_native_frames_per_theme':960-sum(z-a+1 for a,z in CHANGED),'preserved_intervals':REUSE,'changed_intervals':CHANGED,'render_completed':False}
 (V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
 for theme in ['Dark','Light']:
  capture_set(theme,list(range(960)),f'frames-final-{theme.lower()}',1)
  encode(f'frames-final-{theme.lower()}',list(range(960)),60,f'intro-v4-4-{theme.lower()}.mp4')
  # Each complete theme can be safely saved before the second finishes.
  plan[theme.lower()+'_completed']=True;(V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
 plan['render_completed']=True;(V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
