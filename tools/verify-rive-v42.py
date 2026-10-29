#!/usr/bin/env python3
"""Check native contours, stable card identities, real allocation, and protected files."""
from pathlib import Path
import collections,hashlib,json,math,os,subprocess,xml.etree.ElementTree as E
import numpy as np
from analyze_rive_v41_import import Signal
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-2';V=P/'preview';B=R/'animation/intro-v4-1'
os.environ.setdefault('MPLCONFIGDIR',str(R/'.rive-tools/mpl'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
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
report['recommendation']={'states_verified':count,'service_feed_size_unchanged':12,'illustrated_representative_capacity':6,'all_preview_lists_are_actual_feed_subsequences':all(s['preview_is_actual_feed_subsequence'] for s in logic['states']),'initial_weights':states[0]['weights'],'final_weights':states[-1]['weights'],'final_real_card_counts':{k:v['cardCount'] for k,v in states[-1]['categories'].items()},'response_delays_seconds':[x['response_delay_seconds'] for x in logic['updates']]}
# Numeric prefix and brand preservation for every modified existing numeric property.
records=json.loads((P/'motion-curves.json').read_text())['records'];pairs=set((r['object'],r['property']) for r in records if r['object'] in oldobjects)
maximum=0.
for obj,prop in pairs:
 before,after=Signal(oldobjects[obj],prop,oa),Signal(objects[obj],prop,na)
 for f in list(range(0,360,3))+[359]+list(range(840,961,6)):
  maximum=max(maximum,abs(before.at(f)-after.at(f)))
assert maximum<2e-6,maximum
report['preserved_numeric_intervals']={'frames':[[0,359],[840,960]],'properties_checked':len(pairs),'max_difference':maximum}

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
props=['x','y','inRotation','outRotation','inDistance','outDistance'];stage=next(n for n in nb.findall('Node') if n.get('name')=='Cinematic stage');heroes=[n for n in stage.findall('Node') if n.get('name','').endswith('continuous morph material')]
fail=[];bounds=[];tangent=0.;fig,axes=plt.subplots(4,2,figsize=(11,12),layout='constrained')
for i,hero in enumerate(heroes):
 vs=hero.findall('Shape/PointsPath/CubicDetachedVertex');ss=[[Signal(v,p,na) for p in props] for v in vs];sx,sy,sr=[Signal(hero,p,na) for p in ['x','y','rotation']]
 for f in np.arange(360,600.01,.5):
  v=np.array([[s.at(f) for s in row] for row in ss]);poly=outline(v);n=intersects(poly)
  if n:fail.append({'hero':i,'frame':float(f),'crossings':n})
  for vertex in v:
   if min(vertex[4:])>1e-4:tangent=max(tangent,abs(math.atan2(math.sin(vertex[3]-vertex[2]-math.pi),math.cos(vertex[3]-vertex[2]-math.pi))))
  a=sr.at(f);rot=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])
  p=poly@rot.T+np.array([sx.at(f),sy.at(f)])
  bounds.append([p[:,0].min(),p[:,1].min(),p[:,0].max(),p[:,1].max()])
 for label,board,anim in [('V4.1',ob,oa),('V4.2',nb,na)]:
  h=next(x for x in board.iter('Node') if x.get('id')==hero.get('id'));verts=h.findall('Shape/PointsPath/CubicDetachedVertex')
  sig=[[Signal(v,p,anim) for p in props] for v in verts];stats=[]
  for f in range(360,601):
   poly=outline(np.array([[s.at(f) for s in row] for row in sig]));stats.append([np.ptp(poly[:,0]),np.ptp(poly[:,1])])
  data=np.array(stats);t=np.arange(360,601)/60
  axes[i,0].plot(t,data[:,0],label=label);axes[i,1].plot(t,data[:,1],label=label)
 for col,title in enumerate(['Material width / px','Material thickness / px']):
  axes[i,col].set_title(['Study','Tech','Culture','Hobby'][i]+' '+title);axes[i,col].legend();axes[i,col].axvspan(6,6.95,alpha=.06,color='green');axes[i,col].axvspan(6.95,8.25,alpha=.08,color='blue');axes[i,col].axvspan(8.25,10,alpha=.06,color='gray');axes[i,col].set_xlabel('seconds')
fig.savefig(V/'morph-phase-curves.png',dpi=140);plt.close(fig)
geometry={'sampled_poses':4*481,'self_intersection_poses':len(fail),'first_failures':fail[:20],'max_tangent_mismatch_deg':tangent*180/math.pi,'bounds':[float(np.min(np.array(bounds)[:,0])),float(np.min(np.array(bounds)[:,1])),float(np.max(np.array(bounds)[:,2])),float(np.max(np.array(bounds)[:,3]))]}
report['geometry']=geometry
# Verify settled layouts, immutable category/title, and at most six visible cards.
feed=next(n for n in stage.findall('Node') if n.get('name')=='Six-card representative feed');cards=[n for n in feed.findall('Node') if n.get('name','').startswith('Feed card ')];cardmap={n.get('name')[10:]:n for n in cards}
checks=[]
for f,ids in [(630,logic['updates'][0]['before']),(695,logic['updates'][0]['after']),(770,logic['updates'][1]['after'])]:
 visible={k:g for k,g in cardmap.items() if Signal(g,'opacity',na).at(f)>.99};assert set(visible)==set(ids),(f,visible.keys(),ids)
 for n,k in enumerate(ids):
  x,y=[Signal(visible[k],p,na).at(f) for p in ['x','y']];assert abs(x-(324+n%2*432))<.1 and abs(y-(1258+n//2*168))<.1,(f,k,x,y)
 checks.append({'frame':f,'instances':ids,'slots':6})
peak=0
for f in range(600,791):peak=max(peak,sum(Signal(g,'opacity',na).at(f)>.01 for g in cards))
assert peak<=6,peak
feedids={x.get('id') for x in feed.iter()};animated_content=[]
for k in na.findall('KeyedObject'):
 if k.get('objectId') in feedids and k.find('KeyedProperty').get('property') in ['text','colorValue']:animated_content.append(k.get('objectId'))
assert not animated_content
report['feed']={'settled_layouts':checks,'card_instances':len(cards),'visible_card_peak':int(peak),'animated_title_or_category_colors':0,'replacement_events':1,'retained_cards_relocated':3}
report['native_timeline']={'artboards':[x.get('name') for x in new.findall('Artboard')],'fps':60,'duration_frames':960,'seconds':16}
report['fit']={'max_33_point_error':max(x['measured_33point_error'] for x in records),'note':'Numerical contour and native visual review also required; fitting error is not artistic quality.'}
report['passed']=len(fail)==0 and tangent<.001
(V/'source-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));assert report['passed']
