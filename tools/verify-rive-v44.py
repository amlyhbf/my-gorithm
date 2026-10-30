#!/usr/bin/env python3
from pathlib import Path
import collections,copy,hashlib,json,math,subprocess,sys,xml.etree.ElementTree as E
import numpy as np
from analyze_rive_v41_import import Signal
from timing_v44 import SHIFT,SLIDERS,OLD_RESPONSES,RESPONSES,CHANGED,REUSE
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-4';V=P/'preview';B=R/'animation/intro-v4-3'
old=E.parse(B/'scene.rml').getroot();new=E.parse(P/'scene.rml').getroot();ob=old.find('Artboard');nb=new.find('Artboard');oa=ob.find('LinearAnimation');na=nb.find('LinearAnimation')
objects={n.get('id'):n for n in nb.iter() if n.get('id')};oldobjects={n.get('id'):n for n in ob.iter() if n.get('id')}
report={'source_rml_sha256':hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()}
protected=json.load(open(P/'protected-baseline.json'));report['protected_files_unchanged']={n:hashlib.sha256((R/n).read_bytes()).hexdigest()==h for n,h in protected.items()};assert all(report['protected_files_unchanged'].values())
logic=json.load(open(P/'feed-preview-snapshots.json'));states=json.load(open(P/'logic-snapshots.json'))
js="""
import fs from 'node:fs';import vm from 'node:vm';import {CONTENT_DATA} from './data.js';let c=fs.readFileSync('script.js','utf8');c=c.slice(c.indexOf('function calculateAllocation()'),c.indexOf('function renderAllViews('));let input=JSON.parse(fs.readFileSync(0,'utf8'));
for(const s of input.states){for(const size of [6,12]){let ctx={CONTENT_DATA,state:{weights:Object.fromEntries(['study','tech','culture','hobby'].map((n,i)=>[n,s.weights[i]])),feedSize:size,contentType:'all',shuffleSeed:0}};vm.createContext(ctx);vm.runInContext(c,ctx);let a=ctx.calculateAllocation();let expected=s.sizes[size];if(JSON.stringify(a)!==JSON.stringify(expected.allocation))throw Error('Allocation mismatch');if(JSON.stringify(ctx.buildFeedList(a).map(x=>x.id))!==JSON.stringify(expected.feed.map(x=>x.id)))throw Error('Order mismatch');}}
console.log(input.states.length);
"""
count=int(subprocess.check_output(['node','--input-type=module','-e',js],input=json.dumps(logic),text=True,cwd=R));assert states[0]['weights']==[50]*4 and states[-1]['weights']==[100,30,20,50]
report['recommendation']={'states_verified':count,'service_feed_size_unchanged':12,'illustrated_representative_capacity':6,'all_preview_lists_are_actual_feed_subsequences':all(s['preview_is_actual_feed_subsequence'] for s in logic['states']),'initial_weights':states[0]['weights'],'final_weights':states[-1]['weights'],'final_real_card_counts':{k:v['cardCount'] for k,v in states[-1]['categories'].items()},'response_delays_seconds':[x['response_delay_seconds'] for x in logic['updates']]}
def outline(v):
 out=[];u=np.linspace(0,1,21)[:-1,None]
 for i in range(8):
  j=(i+1)%8;p=v[i,:2];q=v[j,:2]
  c=p+np.array([math.cos(v[i,3]),math.sin(v[i,3])])*v[i,5]
  d=q+np.array([math.cos(v[j,2]),math.sin(v[j,2])])*v[j,4]
  out.extend((1-u)**3*p+3*(1-u)**2*u*c+3*(1-u)*u*u*d+u**3*q)
 out=np.asarray(out);return out[np.linalg.norm(out-np.roll(out,1,axis=0),axis=1)>1e-5]
def intersects(p):
 a=p;b=np.roll(p,-1,axis=0);n=len(p);i,j=np.triu_indices(n,2);keep=~((i==0)&(j==n-1));i,j=i[keep],j[keep]
 A,B,C,D=a[i],b[i],a[j],b[j]
 def cross(x,y):return x[:,0]*y[:,1]-x[:,1]*y[:,0]
 return int(np.sum((cross(B-A,C-A)*cross(B-A,D-A)<-1e-7)&(cross(D-C,A-C)*cross(D-C,B-C)<-1e-7)))

props=['x','y','inRotation','outRotation','inDistance','outDistance']
stage=next(n for n in nb.findall('Node') if n.get('name')=='Cinematic stage')
heroes=[n for n in stage.findall('Node') if n.get('name','').endswith('continuous morph material')]
records=json.load(open(P/'motion-curves.json'));crossings=[];entrance=[]
def signal(n,p,a=na):
 if p in ['scaleX','scaleY'] and n.get(p) is None and not any(k.get('objectId')==n.get('id') and k.find('KeyedProperty').get('property')==p for k in a.findall('KeyedObject')):
  n=copy.copy(n);n.set(p,'1')
 return Signal(n,p,a)
preserve={'free':0.,'morph':0.,'final':0.};joins=[]
for i,(hero,plan) in enumerate(zip(heroes,records['entrances'])):
 pose=[signal(hero,p) for p in ['x','y','rotation','scaleX','scaleY']]
 vs=hero.findall('Shape/PointsPath/CubicDetachedVertex');ss=[[signal(v,p) for p in props] for v in vs]
 for f in np.arange(0,90.01,.5):
  surface=np.array([[s.at(f) for s in row] for row in ss]);poly=outline(surface)
  if intersects(poly):crossings.append({'hero':i,'frame':float(f)})
 f=plan['end'];jumps=[]
 for s in pose:
  lo,hi=np.nextafter(float(f),-np.inf),np.nextafter(float(f),np.inf)
  jumps.append([abs(s.at(lo)-s.at(hi)),abs(s.at(lo,True)-s.at(hi,True))])
 velocity=[pose[j].at(f,True) for j in range(2)]
 entrance.append({'category':plan['category'],'start_frame':plan['start'],'join_frame':f,'join_velocity':velocity,'join_speed':float(np.linalg.norm(velocity)),
 'max_value_jump':max(x[0] for x in jumps),'max_velocity_jump':max(x[1] for x in jumps),'body_opacity_entrance':'1 / opaque edge crossing, no fade-in'})
 assert entrance[-1]['join_speed']>50
 for n in [hero,*vs]:
  for p in (props if n.tag=='CubicDetachedVertex' else ['x','y','rotation','scaleX','scaleY','opacity']):
   a,b=signal(n,p),signal(oldobjects[n.get('id')],p,oa)
   for label,fs in [('free',range(90,234,2)),('morph',range(234,475,2))]:
    preserve[label]=max(preserve[label],max(abs(a.at(f)-b.at(f-SHIFT)) for f in fs))
 assert min(signal(hero,'opacity').at(f) for f in range(90))==1

# All edited existing channels must agree with the approved native frames used as cache.
cache_max=0.
pairs={(x['object'],x['property']) for x in records['records'] if x['object'] in oldobjects}
for oid,p in pairs:
 a,b=signal(objects[oid],p),signal(oldobjects[oid],p,oa)
 for start,end,offset in REUSE:
  for f in list(range(start,end+1,5))+[end]:cache_max=max(cache_max,abs(a.at(f)-b.at(f+offset)))
assert cache_max<.002,cache_max

feed=next(n for n in stage.findall('Node') if n.get('name')=='Six-card representative feed')
cards=[n for n in feed.findall('Node') if n.get('name','').startswith('Feed card ')]
oldfeed=next(n for n in ob.iter('Node') if n.get('name')=='Six-card representative feed')
oldcards={n.get('name'):n for n in oldfeed.findall('Node') if n.get('name','').startswith('Feed card ')}
path_error={'position':0.,'scale_opacity':0.}
for card in cards:
 before=oldcards[card.get('name')]
 # Static text, shape size, border/shadow/category color and painter order remain untouched.
 def canonical(n):return [n.tag,n.attrib,[canonical(c) for c in n]]
 assert canonical(card)==canonical(before)
 for p in ['x','y','scaleX','scaleY','opacity']:
  a,b=signal(card,p),signal(before,p,oa)
  for (oldstart,oldend),(start,end) in zip(OLD_RESPONSES,RESPONSES):
   for f in np.arange(start,end+.01,.5):
    e=abs(a.at(f)-b.at(f+oldstart-start));key='position' if p in ['x','y'] else 'scale_opacity';path_error[key]=max(path_error[key],e)
assert path_error['position']<.02 and path_error['scale_opacity']<.001,path_error

timing=[];handles=[n for n in stage.findall('Node') if n.get('name','').endswith('separated handle')]
for j,((a,z),(f0,f1)) in enumerate(zip(SLIDERS,RESPONSES)):
 moving=[f for f in range(a,z+1) if max(abs(signal(n,'x').at(f)-signal(n,'x').at(f-1)) for n in handles)>.001]
 progress={}
 for n in handles:
  s=signal(n,'x');x0,x1=s.at(a),s.at(z)
  if abs(x1-x0)>1:progress[n.get('name')]=(s.at(f0)-x0)/(x1-x0)
 assert all(.85<=q<=.95 for q in progress.values()),progress
 target=logic['updates'][j]['after'];state=next(x for x in reversed(logic['states']) if x['frame']<=f0)
 assert [x['instance'] for x in state['sizes']['6']['feed']]==target
 timing.append({'slider_frames':[a,z],'feed_frames':[f0,f1],'input_leads_seconds':(f0-a)/60,'slider_progress_at_response':progress,
  'last_handle_motion_frame':max(moving),'feed_minus_last_handle_motion_seconds':(f0-max(moving))/60,
  'v43_wait_seconds':[25/60,30/60][j],'response_advanced_relative_to_same_shifted_input_seconds':(OLD_RESPONSES[j][0]+SHIFT-f0)/60,
  'target_matches_actual_current_recommendation':True,'active_card_motion_duration_unchanged_frames':f1-f0})
assert timing[0]['feed_minus_last_handle_motion_seconds']<0 and timing[1]['feed_minus_last_handle_motion_seconds']<0

# Brand node and every existing channel at the actual final scene are unchanged.
brand=next(n for n in nb.findall('Node') if n.get('name')=='Brand finale');oldbrand=oldobjects[brand.get('id')]
assert E.tostring(brand)==E.tostring(oldbrand)
for ko in na.findall('KeyedObject'):
 kp=ko.find('KeyedProperty');oid=ko.get('objectId');p=kp.get('property')
 if kp.find('KeyFrameDouble') is None or oid not in oldobjects:continue
 a,b=signal(objects[oid],p),signal(oldobjects[oid],p,oa)
 preserve['final']=max(preserve['final'],max(abs(a.at(f)-b.at(f)) for f in range(798,961,2)))
assert max(preserve.values())<1e-7,preserve

report.update({'entrances':entrance,'geometry':{'sampled_entrance_poses':724,'self_intersections':len(crossings),'failures':crossings[:15]},
 'preserved_numeric_max_difference':preserve,'cache_reuse_numeric_max_difference':cache_max,'approved_card_path_max_difference':path_error,
 'timing':timing,'unchanged_final_ui':True,'unchanged_card_static_content_style_order':True,'total_seconds':16,'fps':60,'frames':960})
report['passed']=not crossings and max(x['max_velocity_jump'] for x in entrance)<1e-6
(V/'source-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2,default=lambda x:x.item())+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='protected_files_unchanged'},ensure_ascii=False,indent=2,default=lambda x:x.item()));assert report['passed']

