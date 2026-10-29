#!/usr/bin/env python3
"""Deterministic official Rive renderer; tests precede native 60-FPS finals."""
from pathlib import Path
import argparse,os,copy,shutil,datetime,threading,subprocess,xml.etree.ElementTree as E,json,hashlib
from concurrent.futures import ThreadPoolExecutor
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-1';V=P/'preview';V.mkdir(exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['stills','tests','final']);mode=parser.parse_args().mode
loglock=threading.Lock()
def record(msg):
 from zoneinfo import ZoneInfo
 with loglock:
  with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — '+msg+'\n')
record('렌더 모드 시작: '+mode+' / RML SHA-256 '+hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest())
rive=str(R/'tools/rive');env=dict(os.environ);env.setdefault('LP_NUM_THREADS','1')
def run(a,**kw):return subprocess.run(a,cwd=R,check=True,env=env,**kw)
def project(theme,part):
 d=P/'build'/f'render-{mode}-{theme}-{part}';d.mkdir(parents=True,exist_ok=True)
 src=E.parse(P/'scene.rml').getroot();out=E.Element('Rive',version='1',kind='fragment')
 for n in src:
  if n.tag!='Artboard' or n.get('name')==theme:out.append(copy.deepcopy(n))
 E.ElementTree(out).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text(f'name: v41-{theme.lower()}-{part}\n')
 for f in P.glob('*.ttf'):shutil.copy(f,d/f.name)
 return d

def capture(theme,part,frames,folder,scale):
 d=project(theme,part);dest=V/folder;dest.mkdir(exist_ok=True)
 with (d/'capture.log').open('w') as log:
  for j,f in enumerate(frames):
   run([rive,str(d),f'--screenshot={dest/f"{f:04d}.png"}',f'--advance={f+1}',f'--scale={scale}'],stdout=log,stderr=log)
   if (j+1)%30==0:print(f'{mode}/{theme}/worker{part}: {j+1}/{len(frames)}',flush=True)

def encode_seq(folder,frames,fps,output):
 # A concat list with explicit identical durations avoids shell glob or symlink ambiguity.
 fl=V/folder/'encode.txt'
 fl.write_text(''.join(f"file '{f:04d}.png'\nduration {1/fps:.12f}\n" for f in frames))
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-r',str(fps),'-i',str(fl),'-frames:v',str(len(frames)),'-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(V/output)])
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(V/output)],text=True))
 info['sha256']=hashlib.sha256((V/output).read_bytes()).hexdigest();(V/(output+'.json')).write_text(json.dumps(info,indent=2)+'\n');print(output,info['format'],flush=True);record('렌더·인코딩 완료: '+output+' / '+json.dumps(info['format']))

if mode=='stills':
 frames=[72,276,390,450,510,570,600,900]
 with ThreadPoolExecutor(max_workers=4) as pool:
  jobs=[pool.submit(capture,'Dark',k,frames[k::4],'test-stills',.5) for k in range(4)]
  for j in jobs:j.result()
elif mode=='tests':
 # Both are 30-FPS native motion tests, explicitly distinct from final 60-FPS outputs.
 frames=list(range(0,600,2))
 with ThreadPoolExecutor(max_workers=4) as pool:
  jobs=[pool.submit(capture,'Dark',k,frames[k::4],'test-frames',.333333333333) for k in range(4)]
  for j in jobs:j.result()
 encode_seq('test-frames',list(range(0,360,2)),30,'test-v41-motion-0-6.mp4')
 encode_seq('test-frames',list(range(360,600,2)),30,'test-v41-morph-6-10.mp4')
else:
 run([rive,str(P),'--once'])
 # Native V4 suffix may be reused only after separate structural and pixel proof.
 proof=json.loads((V/'suffix-verification.json').read_text());assert proof['passed'] and proof['source_rml_sha256']==hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()
 # A fresh checkout has no ignored PNG cache. In that case render all 960 native frames.
 reuse_suffix=all((R/'animation/intro-v4/preview'/f'frames-final-{t}'/f'{f:04d}.png').exists() for t in ['dark','light'] for f in range(600,960))
 end=600 if reuse_suffix else 960
 plan={'source_rml_sha256':proof['source_rml_sha256'],'new_native_frames_per_theme':end,'preserved_native_frames_per_theme':960-end,'render_completed':False}
 (V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
 with ThreadPoolExecutor(max_workers=4) as pool:
  jobs=[pool.submit(capture,t,k,list(range(k,end,4)),f'frames-final-{t.lower()}',1) for t in ['Dark','Light'] for k in range(4)]
  for j in jobs:j.result()
 for theme in ['dark','light']:
  dest=V/f'frames-final-{theme}';base=R/'animation/intro-v4/preview'/f'frames-final-{theme}'
  if reuse_suffix:
   for f in range(600,960):shutil.copyfile(base/f'{f:04d}.png',dest/f'{f:04d}.png')
  encode_seq(f'frames-final-{theme}',list(range(960)),60,f'intro-v4-1-{theme}.mp4')
 plan['render_completed']=True
 (V/'capture-plan.json').write_text(json.dumps(plan,indent=2)+'\n')
