#!/usr/bin/env python3
"""Native RGB proof before reusing V4.1's unaffected 60-FPS frames."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image,ImageChops
import copy,hashlib,json,os,shutil,subprocess,xml.etree.ElementTree as E
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-2';B=R/'animation/intro-v4-1';V=P/'preview'
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()
report=json.loads((V/'source-verification.json').read_text());assert report['passed'] and report['source_rml_sha256']==source
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
env=dict(os.environ);env['LP_NUM_THREADS']='1'
def check(job):
 theme,frame=job;d=P/'build'/f'proof-{theme}-{frame}';d.mkdir(parents=True,exist_ok=True)
 root=E.parse(P/'scene.rml').getroot();out=E.Element('Rive',version='1',kind='fragment')
 for n in root:
  if n.tag!='Artboard' or n.get('name')==theme:out.append(copy.deepcopy(n))
 E.ElementTree(out).write(d/'scene.rml',encoding='unicode');(d/'rive.yaml').write_text(f'name: proof-v42-{theme}-{frame}\n')
 for p in P.glob('*.ttf'):shutil.copyfile(p,d/p.name)
 dest=d/'native.png'
 with (d/'capture.log').open('w') as log:
  subprocess.run([str(R/'tools/rive'),str(d),f'--advance={frame+1}',f'--screenshot={dest}'],cwd=R,env=env,stdout=log,stderr=log,check=True)
 base=B/'preview'/f'frames-final-{theme.lower()}'/f'{frame:04d}.png'
 if not base.exists():
  baseline=d/'baseline';baseline.mkdir(exist_ok=True)
  for p in [B/'scene.rml',B/'rive.yaml',*B.glob('*.ttf')]:shutil.copyfile(p,baseline/p.name)
  base=baseline/'native.png'
  subprocess.run([str(R/'tools/rive'),str(baseline),f'--artboard={theme}',f'--advance={frame+1}',f'--screenshot={base}'],cwd=R,env=env,check=True,stdout=subprocess.DEVNULL)
 bbox=ImageChops.difference(Image.open(dest).convert('RGB'),Image.open(base).convert('RGB')).getbbox()
 assert bbox is None,(theme,frame,bbox)
 return {'theme':theme,'frame':frame,'seconds':frame/60,'different_pixels_bbox':bbox}
with ThreadPoolExecutor(max_workers=4) as pool:checks=list(pool.map(check,[(t,f) for t in ['Dark','Light'] for f in [72,359,840,959]]))
out={'passed':True,'source_rml_sha256':source,'assets_sha256':assets,'numeric_property_max_difference':report['preserved_numeric_intervals']['max_difference'],'native_rgb_ab':checks,'allowed_reuse_intervals':[[0,359],[840,959]],'note':'Original V4.1 native 60-FPS PNGs, never low-FPS video duplication.'}
(V/'unchanged-intervals.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
