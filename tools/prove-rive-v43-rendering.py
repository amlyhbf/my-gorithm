#!/usr/bin/env python3
"""Prove frame-windowed native rendering and the unchanged 0–2s cache.

Only the bracketing keys are retained in render-only copies. Easing/value
evaluation and rasterization are still performed by the official Rive CLI.
The editable project and built final .riv retain the complete 960-frame timeline.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from bisect import bisect_right
from PIL import Image,ImageChops
import copy,hashlib,json,os,shutil,subprocess,xml.etree.ElementTree as E
import numpy as np
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';V=P/'preview';B=R/'animation/intro-v4-2'
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
env=dict(os.environ);env['LP_NUM_THREADS']='1'
def capture(theme,frame,windowed,scale=1):
 d=P/'build'/f'proof-{theme}-{frame}-{windowed}';d.mkdir(parents=True,exist_ok=True)
 root=E.parse(P/'scene.rml').getroot()
 for b in list(root.findall('Artboard')):
  if b.get('name')!=theme:root.remove(b)
 if windowed:
  for kp in root.findall('.//KeyedProperty'):
   if kp.find('KeyFrameDouble') is None:continue
   keys=list(kp);j=max(0,bisect_right([int(k.get('frame','0')) for k in keys],frame)-1);kp[:]=keys[j:j+2]
 E.ElementTree(root).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text('name: proof\n')
 for p in P.glob('*.ttf'):shutil.copyfile(p,d/p.name)
 dest=d/'native.png'
 if dest.exists() and not windowed:return dest
 with (d/'capture.log').open('w') as log:subprocess.run([str(R/'tools/rive'),str(d),f'--advance={frame+1}',f'--screenshot={dest}',f'--scale={scale}'],env=env,cwd=R,stdout=log,stderr=log,check=True)
 return dest
def same(a,b):
 with Image.open(a) as x,Image.open(b) as y:return ImageChops.difference(x.convert('RGB'),y.convert('RGB')).getbbox() is None
def windowcheck(job):
 theme,f=job;a=capture(theme,f,False,.5);b=capture(theme,f,True,.5)
 with Image.open(a) as x,Image.open(b) as y:diff=np.abs(np.asarray(x.convert('RGB'),dtype=int)-np.asarray(y.convert('RGB'),dtype=int))
 changed=int(np.any(diff,axis=2).sum());ratio=changed/(540*960);mean=float(diff.mean())
 # Native floating-point/edge coverage can differ after changing the runtime history.
 # Record that difference; never claim a bit-identical frame when it is not.
 assert ratio<.0001 and mean<.002,(theme,f,ratio,mean)
 return {'theme':theme,'frame':f,'full_and_windowed_rgb_equal':changed==0,'different_pixels':changed,
         'different_pixel_ratio':ratio,'max_channel_difference':int(diff.max()),'mean_channel_difference':mean,'within_recorded_edge_tolerance':True}
def reusecheck(job):
 theme,f=job;a=capture(theme,f,False);b=B/'preview'/f'frames-final-{theme.lower()}'/f'{f:04d}.png'
 assert b.exists();equal=same(a,b);assert equal,(theme,f)
 return {'theme':theme,'frame':f,'v42_native_rgb_equal':equal}
with ThreadPoolExecutor(max_workers=2) as pool:
 windows=list(pool.map(windowcheck,[(t,f) for t in ['Dark','Light'] for f in [165,420,550,725,959]]))
 reused=list(pool.map(reusecheck,[(t,f) for t in ['Dark','Light'] for f in [60,119]]))
out={'passed':True,'assets_sha256':assets,'source_rml_sha256':assets['scene.rml'],'windowed_native_ab':windows,'native_rgb_ab':reused,
 'allowed_reuse_intervals':[[0,119]],'method':'Original interpolation segments, absolute frame clocks and official CLI --advance; only irrelevant keys omitted in disposable render copies. No Python/FFmpeg rasterization, video speed-up or low-FPS interpolation.'}
(V/'unchanged-intervals.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
