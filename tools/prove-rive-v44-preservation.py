#!/usr/bin/env python3
"""Native evidence for reused V4.3 frames and render-only key-window copies."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from bisect import bisect_right
from PIL import Image
import copy,hashlib,json,os,shutil,subprocess,xml.etree.ElementTree as E
import numpy as np
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-4';V=P/'preview';B=R/'animation/intro-v4-3/preview'
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
env=dict(os.environ);env['LP_NUM_THREADS']='1'
def capture(theme,f,window=False,scale=1):
 d=P/'build'/f'proof-{theme}-{f}-{window}-{scale}';d.mkdir(parents=True,exist_ok=True);dest=d/'native.png';stamp=d/'source.json'
 if dest.exists() and stamp.exists() and json.load(open(stamp))==assets:return dest
 root=E.parse(P/'scene.rml').getroot()
 for b in list(root.findall('Artboard')):
  if b.get('name')!=theme:root.remove(b)
 if window:
  for kp in root.findall('.//KeyedProperty'):
   if kp.find('KeyFrameDouble') is None:continue
   ks=list(kp);j=max(0,bisect_right([int(k.get('frame','0')) for k in ks],f)-1);kp[:]=ks[j:j+2]
 E.ElementTree(root).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text('name: proof-v44\n')
 for font in P.glob('*.ttf'):shutil.copyfile(font,d/font.name)
 with (d/'capture.log').open('w') as log:subprocess.run([str(R/'tools/rive'),str(d),f'--screenshot={dest}',f'--advance={f+1}',f'--scale={scale}'],cwd=R,env=env,stdout=log,stderr=log,check=True)
 stamp.write_text(json.dumps(assets,indent=2)+'\n');return dest
def diff(a,b):
 with Image.open(a) as x,Image.open(b) as y:
  d=np.abs(np.asarray(x.convert('RGB'),dtype=int)-np.asarray(y.convert('RGB'),dtype=int))
 return {'identical_rgb':bool(not np.any(d)),'different_pixels':int(np.any(d>0,axis=2).sum()),'pixel_ratio':float(np.any(d>0,axis=2).mean()),'mean_channel_difference':float(d.mean()),'max_channel_difference':int(d.max())}
def reused(job):
 theme,f,old=job;new=capture(theme,f);oldfile=B/f'frames-final-{theme.lower()}'/f'{old:04d}.png';d=diff(new,oldfile)
 # Same keys and values can produce a few edge-coverage pixels after a changed float clock history.
 assert d['pixel_ratio']<.0005 and d['mean_channel_difference']<.02,(theme,f,d)
 return {'theme':theme,'new_frame':f,'v43_frame':old,**d}
def windowed(job):
 theme,f=job;a=capture(theme,f,False,.5);b=capture(theme,f,True,.5);d=diff(a,b)
 assert d['pixel_ratio']<.0005 and d['mean_channel_difference']<.02,(theme,f,d)
 return {'theme':theme,'frame':f,**d}
with ThreadPoolExecutor(max_workers=2) as pool:
 cached=list(pool.map(reused,[(t,f,o) for t in ['Dark','Light'] for f,o in [(90,66),(150,126),(300,276),(500,476),(640,616),(840,840),(959,959)]]))
 windows=list(pool.map(windowed,[('Dark',30),('Dark',550),('Dark',708),('Light',30)]))
report={'passed':True,'assets_sha256':assets,'source_rml_sha256':assets['scene.rml'],'reused_native_ab':cached,'full_vs_windowed_native_ab':windows,
 'note':'Preserved vectors/keys/speeds checked independently. Actual pixel differences are recorded, never declared RGB-identical unless zero. Native cache remains original 1080×1920 60FPS PNGs; no low-FPS interpolation.'}
(V/'native-preservation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
