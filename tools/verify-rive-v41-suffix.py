#!/usr/bin/env python3
"""Prove that the unchanged V4 UI, recommendation timing and finale remain identical."""
from pathlib import Path
from PIL import Image,ImageChops
import xml.etree.ElementTree as E,copy,subprocess,json,hashlib,os
from analyze_rive_v41_import import Signal
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-1';V=P/'preview';BASE=R/'animation/intro-v4'
old=E.parse(BASE/'scene.rml').getroot();new=E.parse(P/'scene.rml').getroot();env=dict(os.environ);env.setdefault('LP_NUM_THREADS','1')
# Component tree, poses, colors and fonts are unchanged; only animation curve objects differ.
def components(root):
 out={}
 for n in root.iter():
  if n.tag in ('KeyedObject','KeyedProperty','KeyFrameDouble','KeyFrameColor','KeyFrameString','CubicEaseInterpolator','CubicValueInterpolator'):continue
  if n.tag=='LinearAnimation':continue
  if n.get('id'):out[n.get('id')]=(n.tag,dict(n.attrib))
 return out
assert components(old)==components(new),'Visible component or design attributes changed'
frames=list(range(600,961,5));maxerror=0.
for theme in ['Dark','Light']:
 ob=next(b for b in old.findall('Artboard') if b.get('name')==theme);nb=next(b for b in new.findall('Artboard') if b.get('name')==theme)
 oa,na=ob.find('LinearAnimation'),nb.find('LinearAnimation');objs={x.get('id'):x for x in nb.iter() if x.get('id')}
 origobjs={x.get('id'):x for x in ob.iter() if x.get('id')}
 for ko in na.findall('KeyedObject'):
  p=ko.find('KeyedProperty');prop=p.get('property')
  if not p.findall('KeyFrameDouble'):continue
  obj=objs[ko.get('objectId')];before=Signal(origobjs[obj.get('id')],prop,oa);after=Signal(obj,prop,na)
  for f in frames:maxerror=max(maxerror,abs(before.at(f)-after.at(f)))
assert maxerror<1e-5,maxerror
checks=[]
for theme in ['Dark','Light']:
 for frame in [600,720,840,959]:
  dst=P/'build'/f'suffix-{theme}-{frame}.png';log=P/'build'/f'suffix-{theme}-{frame}.log'
  with log.open('w') as output:
   subprocess.run([str(R/'tools/rive'),str(P),f'--artboard={theme}',f'--advance={frame+1}',f'--screenshot={dst}'],cwd=R,env=env,stdout=output,stderr=output,check=True)
  orig=BASE/'preview'/f'frames-final-{theme.lower()}'/f'{frame:04d}.png'
  if not orig.exists():
   # Rebuild only baseline proof stills in a V4.1-owned temporary project.
   import shutil
   baseline=P/'build/baseline-proof';baseline.mkdir(parents=True,exist_ok=True)
   for f in [BASE/'scene.rml',BASE/'rive.yaml',*BASE.glob('*.ttf')]:shutil.copyfile(f,baseline/f.name)
   orig=baseline/f'{theme}-{frame}.png'
   with log.open('a') as output:
    subprocess.run([str(R/'tools/rive'),str(baseline),f'--artboard={theme}',f'--advance={frame+1}',f'--screenshot={orig}'],cwd=R,env=env,stdout=output,stderr=output,check=True)
  diff=ImageChops.difference(Image.open(dst).convert('RGB'),Image.open(orig).convert('RGB'));box=diff.getbbox()
  checks.append({'theme':theme,'time_seconds':frame/60,'different_pixels_bbox':box})
  assert box is None,(theme,frame,box)
result={'passed':True,'source_rml_sha256':hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest(),'components_identical':True,'max_numeric_property_difference_after_10s':maxerror,'native_rgb_ab':checks,'retained_native_frames':[600,959],'note':'Retained V4 suffix consists of original 60-FPS native Rive frames, not upsampled video.'}
(V/'suffix-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
