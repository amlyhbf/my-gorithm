#!/usr/bin/env python3
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from zoneinfo import ZoneInfo
import hashlib,json,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';D=Path('/tmp/rive-v43-download-check');D.mkdir(exist_ok=True)
base='https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-3/animation/intro-v4-3/'
names=['preview/intro-v4-3-dark.mp4','preview/intro-v4-3-light.mp4','preview/compare-a-intro.mp4','preview/compare-b-cause-effect.mp4','preview/compare-c-final-ui-dark.png','preview/compare-c-final-ui-light.png','scene.rml','build/intro-v4-3.riv']
def check(name):
 url=base+name;dest=D/name.replace('/','-');status=subprocess.check_output(['curl','--fail','--location','--silent','--show-error','--retry','2','--retry-delay','1','--output',str(dest),'--write-out','%{http_code}',url],text=True)
 source=P/name;actual=hashlib.sha256(dest.read_bytes()).hexdigest();expected=hashlib.sha256(source.read_bytes()).hexdigest();assert status=='200' and actual==expected
 return {'file':name,'url':url,'http_status':200,'bytes':dest.stat().st_size,'sha256':actual,'local_sha256_equal':True}
with ThreadPoolExecutor(max_workers=2) as pool:checks=list(pool.map(check,names))
report={'checked_at':datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds'),'artifact_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip(),'repository':'amlyhbf/my-gorithm','branch':'feat/rive-intro-v4-3','all_passed':True,'checks':checks}
(P/'github-download-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'all_passed':True,'files':len(checks),'bytes':sum(c['bytes'] for c in checks)},indent=2))
