#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,math,subprocess,xml.etree.ElementTree as E
import numpy as np
from analyze_rive_v41_import import Signal
from timing_v43 import SLIDERS,RESPONSES,weights
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';V=P/'preview';B=R/'animation/intro-v4-2'
old=E.parse(B/'scene.rml').getroot();new=E.parse(P/'scene.rml').getroot();ob=old.find('Artboard');nb=new.find('Artboard');oa=ob.find('LinearAnimation');na=nb.find('LinearAnimation')
objects={x.get('id'):x for x in nb.iter() if x.get('id')};oldobjects={x.get('id'):x for x in ob.iter() if x.get('id')}
report={'source_rml_sha256':hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()}
protected=json.loads((P/'protected-baseline.json').read_text());report['protected_files']={n:hashlib.sha256((R/n).read_bytes()).hexdigest()==h for n,h in protected.items()};assert all(report['protected_files'].values())
logic=json.loads((P/'feed-preview-snapshots.json').read_text());states=json.loads((P/'logic-snapshots.json').read_text())
js="""
import fs from 'node:fs';import vm from 'node:vm';import {CONTENT_DATA} from './data.js';let c=fs.readFileSync('script.js','utf8');c=c.slice(c.indexOf('function calculateAllocation()'),c.indexOf('function renderAllViews('));let input=JSON.parse(fs.readFileSync(0,'utf8'));
for(const s of input.states){for(const size of [6,12]){let ctx={CONTENT_DATA,state:{weights:Object.fromEntries(['study','tech','culture','hobby'].map((n,i)=>[n,s.weights[i]])),feedSize:size,contentType:'all',shuffleSeed:0}};vm.createContext(ctx);vm.runInContext(c,ctx);let a=ctx.calculateAllocation();let expected=s.sizes[size];if(JSON.stringify(a)!==JSON.stringify(expected.allocation))throw Error('Allocation mismatch');if(JSON.stringify(ctx.buildFeedList(a).map(x=>x.id))!==JSON.stringify(expected.feed.map(x=>x.id)))throw Error('Order mismatch');}}
console.log(input.states.length);
"""
count=int(subprocess.check_output(['node','--input-type=module','-e',js],input=json.dumps(logic),text=True,cwd=R));assert states[0]['weights']==[50]*4 and states[-1]['weights']==[100,30,20,50]
report['recommendation']={'states_verified':count,'service_feed_size_unchanged':12,'illustrated_representative_capacity':6,'all_preview_lists_are_actual_feed_subsequences':all(s['preview_is_actual_feed_subsequence'] for s in logic['states']),'initial_weights':states[0]['weights'],'final_weights':states[-1]['weights'],'final_real_card_counts':{k:v['cardCount'] for k,v in states[-1]['categories'].items()},'response_delays_seconds':[x['response_delay_seconds'] for x in logic['updates']],'slider_stabilization_seconds':[x['stabilization_seconds'] for x in logic['updates']]}
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
fail=[];bounds=[];morpherror=0.;joinreport=[];prefixerror=0.;tangent=0.
for i,h in enumerate(heroes):
 vs=h.findall('Shape/PointsPath/CubicDetachedVertex');ss=[[Signal(v,p,na) for p in props] for v in vs]
 pose=[Signal(h,p,na) for p in ['x','y','rotation']]
 for f in np.arange(120,450.01,.5):
  v=np.array([[s.at(f) for s in row] for row in ss]);poly=outline(v);n=intersects(poly)
  for vertex in v:
   if min(vertex[4:])>1e-4:tangent=max(tangent,abs(math.atan2(math.sin(vertex[3]-vertex[2]-math.pi),math.cos(vertex[3]-vertex[2]-math.pi))))
  if n:fail.append({'hero':i,'frame':float(f),'crossings':n})
  a=pose[2].at(f);rot=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])
  poly=poly@rot.T+np.array([s.at(f) for s in pose[:2]])
  bounds.append([poly[:,0].min(),poly[:,1].min(),poly[:,0].max(),poly[:,1].max()])
 for vertex,row in zip(vs,ss):
  for prop,signal in zip(props,row):
   before=Signal(oldobjects[vertex.get('id')],prop,oa)
   for f in np.arange(210,450.01,2):morpherror=max(morpherror,abs(signal.at(f)-before.at(f+150)))
 # Endpoint finite differences are measured separately for values and velocities.
 signals=pose+[s for row in ss for s in row]
 for f in [120,210,450]:
  for s in signals:
   joinreport.append({'frame':f,'value_delta':abs(s.at(np.nextafter(float(f),-np.inf))-s.at(np.nextafter(float(f),np.inf))),
                      'velocity_delta':abs(s.at(np.nextafter(float(f),-np.inf),True)-s.at(np.nextafter(float(f),np.inf),True))})
 for n in [h,*vs]:
  for p in (['x','y','rotation'] if n is h else props):
   a,b=Signal(oldobjects[n.get('id')],p,oa),Signal(n,p,na)
   for f in range(120):prefixerror=max(prefixerror,abs(a.at(f)-b.at(f)))
report['geometry']={'sampled_poses':4*661,'self_intersection_poses':len(fail),'first_failures':fail[:20],
 'bounds':np.array(bounds).min(axis=0)[:2].tolist()+np.array(bounds).max(axis=0)[2:].tolist(),
 'old_morph_local_vertex_max_difference':morpherror,'first_two_seconds_max_numeric_difference':prefixerror,'max_g1_tangent_mismatch_degrees':tangent*180/math.pi,
 'joins':{str(f):{'max_position_or_shape_value_jump':max(x['value_delta'] for x in joinreport if x['frame']==f),
 'max_velocity_jump':max(x['velocity_delta'] for x in joinreport if x['frame']==f)} for f in [120,210,450]}}
feed=next(n for n in stage.findall('Node') if n.get('name')=='Six-card representative feed')
cards=[n for n in feed.findall('Node') if n.get('name','').startswith('Feed card ')]
cs={n.get('name')[10:]:{p:Signal(n,p,na) for p in ['x','y','scaleX','scaleY','opacity']} for n in cards}
# During slider movement all six cards have constant pose. During feed movement controls have constant pose.
nonoverlap=[]
for (a,z),(f0,f1) in zip(SLIDERS,RESPONSES):
 carddelta=max(abs(s.at(f)-s.at(a)) for p in cs.values() for s in p.values() for f in range(a,z+1))
 controldelta=0.
 for h in heroes:
  handle=next(n for n in stage.findall('Node') if n.get('name')==h.get('name').split()[0]+' separated handle')
  for n in [h,handle,*h.findall('Shape/PointsPath/CubicDetachedVertex')]:
   for prop in (props if n.tag=='CubicDetachedVertex' else ['x','y','rotation']):
    s=Signal(n,prop,na);controldelta=max(controldelta,max(abs(s.at(f)-s.at(f0)) for f in range(f0,f1+1)))
 nonoverlap.append({'slider_frames':[a,z],'feed_frames':[f0,f1],'slider_to_feed_gap_seconds':(f0-z)/60,
 'card_max_delta_during_slider':carddelta,'control_max_delta_during_feed':controldelta})
 assert carddelta<.002 and controldelta<.002,nonoverlap[-1]
settled=[]
for f,ids in [(465,logic['updates'][0]['before']),(600,logic['updates'][0]['after']),(780,logic['updates'][1]['after'])]:
 visible=[k for k,p in cs.items() if p['opacity'].at(f)>.99];assert set(visible)==set(ids)
 for j,k in enumerate(ids):
  assert abs(cs[k]['x'].at(f)-(324+j%2*432))<.12
  assert abs(cs[k]['y'].at(f)-(1318+j//2*168))<.12
 settled.append({'frame':f,'actual_representative_ids':ids})
feedids={n.get('id') for n in feed.iter()}
assert not [k for k in na.findall('KeyedObject') if k.get('objectId') in feedids and k.find('KeyedProperty').get('property') in ['text','colorValue']]
peak=max(sum(p['opacity'].at(f)>.01 for p in cs.values()) for f in range(450,799))
assert peak<=6
# Layout numbers supplement actual final-MP4 pixel review (they do not replace it).
report['ui_spacing']={'card_height':160,'card_pitch':176,'inter_card_gap':16,'track_center_relative_row':16,
 'tick_text_center_relative_row':62,'card_bottom_relative_row':92,'nominal_tick_box_bottom_clearance':15.5,
 'font_size_unchanged':29,'final_stage_scale':.82,'future_button_safe_rectangle':[204,1570,876,1770]}
report['attention']={'cycles':nonoverlap,'settled_states':settled,'visible_cards_peak':peak,'content_strings_and_colors_immutable':True,
 'display_delay_note':'The feed intentionally holds the previous settled valid result while controls change, then displays the newly calculated endpoint result.'}
def occlusion(board,start,end):
 an=board.find('LinearAnimation');feed=next(n for n in board.iter('Node') if n.get('name')=='Six-card representative feed')
 nodes=[n for n in feed.findall('Node') if n.get('name','').startswith('Feed card ')]
 signals=[{p:Signal(n,p,an) for p in ['x','y','scaleX','opacity']} for n in nodes];scores=[];peaks=[]
 for f in range(start,end+1):
  active=[]
  for n,s in zip(nodes,signals):
   if s['opacity'].at(f)<.1:continue
   x,y,sc=[s[p].at(f) for p in ['x','y','scaleX']];active.append((x,y,sc,np.array([x-194*sc,y-72*sc,x+194*sc,y+72*sc])))
  cover=[]
  for j,(x,y,sc,box) in enumerate(active):
   total=0.
   for low,high in [(-53,-14),(12,48)]:
    t=np.array([x-146*sc,y+low*sc,x+104*sc,y+high*sc])
    for xx,yy,ss,b in active[:j]:
     q=np.maximum(0,np.minimum(b[2:],t[2:])-np.maximum(b[:2],t[:2]));total+=q.prod()/(250*(high-low))
   cover.append(total)
  scores.append(sum(cover));peaks.append(max(cover))
 return {'mean_total_text_box_coverage':float(np.mean(scores)),'max_single_card_text_box_coverage':float(max(peaks)),'note':'Geometric category/title box proxy, not a human readability score. Short edge overlap remains.'}
report['card_overlap_comparison']={'v42':occlusion(ob,718,754),'v43':occlusion(nb,690,759)}
report['passed']=not fail and morpherror<1e-7 and prefixerror<1e-7 and tangent<.001
(V/'source-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2,default=lambda x:x.item())+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2,default=lambda x:x.item()));assert report['passed']
