#!/usr/bin/env python3
"""Read-only comparison of authored Rive control states with actual website JS."""
from pathlib import Path
import xml.etree.ElementTree as E
import re,json,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v3'
root=E.parse(P/'scene.rml').getroot();b=next(x for x in root.findall('Artboard') if x.get('name')=='Dark');anim=b.find('LinearAnimation')
ids=[]
for cat in ['공부','기술','문화','취미']:
 node=next(n for n in b.findall('Node') if n.get('name')==cat+' native-style range UI')
 run=next(t.find('TextValueRun') for t in node.findall('Text') if t.get('name')=='50% (피드 25%)')
 ko=next(k for k in anim.findall('KeyedObject') if k.get('objectId')==run.get('id'))
 ids.append({int(k.get('frame')):k.get('value') for k in ko.findall('KeyedProperty/KeyFrameString')})
light=next(x for x in root.findall('Artboard') if x.get('name')=='Light')
la=light.find('LinearAnimation')
for i,cat in enumerate(['공부','기술','문화','취미']):
 node=next(n for n in light.findall('Node') if n.get('name')==cat+' native-style range UI')
 run=next(t.find('TextValueRun') for t in node.findall('Text') if t.get('name')=='50% (피드 25%)')
 ko=next(k for k in la.findall('KeyedObject') if k.get('objectId')==run.get('id'))
 assert {int(k.get('frame')):k.get('value') for k in ko.findall('KeyedProperty/KeyFrameString')}==ids[i]
states=[]
for f in range(132,208):
 labels=[k[f] for k in ids];weights=[int(re.match(r'(\d+)%',x).group(1)) for x in labels]
 assert all(v%5==0 and 0<=v<=100 for v in weights)
 states.append({'frame':f,'weights':weights,'labels':labels})
js="""
const fs=require('fs'),vm=require('vm');let src=fs.readFileSync('script.js','utf8');src=src.slice(src.indexOf('function calculateAllocation()'),src.indexOf('function seededShuffle('));
let states=JSON.parse(fs.readFileSync(0,'utf8'));let names=['study','tech','culture','hobby'];
for(let s of states){let ctx={state:{weights:Object.fromEntries(names.map((n,i)=>[n,s.weights[i]])),feedSize:12}};vm.createContext(ctx);vm.runInContext(src,ctx);let a=ctx.calculateAllocation();s.actual=names.map((n,i)=>`${s.weights[i]}% (피드 ${a.categories[n].displayPct}%)`)}console.log(JSON.stringify(states));
"""
actual=json.loads(subprocess.check_output(['node','-e',js],input=json.dumps(states),text=True,cwd=R))
for s in actual:assert s['labels']==s['actual'],s
out={'website_js_states_matched':len(actual),'range_min':0,'range_max':100,'range_step':5,'final':actual[-1],'both_themes':['Dark','Light'],'theme_label_sequences_identical':True,'note':'Read-only website calculateAllocation invoked in Node vm, with isolated mock state; no application storage or Firebase calls.'}
(P/'preview/behavior-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2))
