#!/usr/bin/env python3
"""V4.3 temporal refinement. Reuses V4.2 materials, immutable cards and site functions."""
from pathlib import Path
import copy, datetime, hashlib, json, math, shutil, subprocess, sys, xml.etree.ElementTree as E
from zoneinfo import ZoneInfo
import numpy as np
from scipy.interpolate import CubicSpline, PchipInterpolator
from analyze_rive_v41_import import Signal
from motion_v41 import q5
from motion_v42 import Rig, ROWS
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'.rive-tools/python'))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';BASE=R/'animation/intro-v4-2'
root=E.parse(BASE/'scene.rml').getroot();serial=max(int(x.get('id','0:0').split(':')[1]) for x in root.iter())+1

def el(p,tag,**attrs):
 global serial
 attrs={k:str(v) for k,v in attrs.items()};attrs['id']=f'0:{serial}';serial+=1
 return E.SubElement(p,tag,attrs)

def ko_for(obj,prop,anim):
 return next((x for x in anim.findall('KeyedObject') if x.get('objectId')==obj.get('id') and x.find('KeyedProperty').get('property')==prop),None)

records=[]
def curves(obj,prop,cs,anim,start=0,end=960,tol=.08,seeds=None,preserve=False):
 old=Signal(obj,prop,anim);prior=ko_for(obj,prop,anim)
 original=[] if prior is None else list(prior.find('KeyedProperty'))
 knots=set([start,end]+list(seeds or range(start,end,30)))
 def hv(a,b,ts):
  ta,tb=a/60,b/60;h=tb-ta;u=(ts-ta)/h
  return (2*u**3-3*u*u+1)*cs(ta)+(u**3-2*u*u+u)*h*cs(ta,1)+(-2*u**3+3*u*u)*cs(tb)+(u**3-u*u)*h*cs(tb,1)
 def refine(a,b):
  ts=np.linspace(a/60,b/60,17);error=np.max(np.abs(cs(ts)-hv(a,b,ts)))
  if error>tol and b-a>1:
   m=(a+b)//2;knots.add(m);refine(a,m);refine(m,b)
 first=sorted(knots)
 for a,b in zip(first,first[1:]):refine(a,b)
 knots=sorted(knots)
 if prior is not None:anim.remove(prior)
 ko=el(anim,'KeyedObject',objectId=obj.get('id'));kp=el(ko,'KeyedProperty',property=prop)
 prefix=[copy.deepcopy(k) for k in original if int(k.get('frame','0'))<start] if preserve else []
 if prefix:
  last=prefix[-1];fa=int(last.get('frame','0'))
  # Split the original native value cubic exactly at the splice boundary.
  if last.get('interpolationType')!='hold' and not any(int(k.get('frame','0'))==start for k in original):
   assert next(iter(last),None) is None or next(iter(last)).tag=='CubicValueInterpolator',(obj.get('name'),prop)
   last.set('interpolationType','cubicValue')
   for c in list(last):last.remove(c)
   h=(start-fa)/60
   el(last,'CubicValueInterpolator',x1=1/3,x2=2/3,y1=f'{old.at(fa)+old.at(fa,True)*h/3:.14g}',y2=f'{old.at(start)-old.at(start,True)*h/3:.14g}')
  kp.extend(prefix)
 maximum=0.
 for j,f in enumerate(knots):
  t=f/60;val=float(cs(t));k=el(kp,'KeyFrameDouble',frame=f,value=f'{val:.14g}',interpolationType='linear')
  if j<len(knots)-1:
   z=knots[j+1];h=(z-f)/60;k.set('interpolationType','cubicValue')
   el(k,'CubicValueInterpolator',x1=1/3,x2=2/3,y1=f'{val+float(cs(t,1))*h/3:.14g}',y2=f'{float(cs(z/60))-float(cs(z/60,1))*h/3:.14g}')
   ts=np.linspace(t,z/60,33);maximum=max(maximum,float(np.max(np.abs(cs(ts)-hv(f,z,ts)))))
 if preserve:
  boundary=next((x for x in original if int(x.get('frame','0'))==end),None)
  if boundary is not None:
   k.set('interpolationType',boundary.get('interpolationType','hold'))
   for c in boundary:k.append(copy.deepcopy(c))
  after=[copy.deepcopy(x) for x in original if int(x.get('frame','0'))>end]
  if boundary is None and after:assert abs(old.at(end)-float(after[0].get('value')))<1e-7
  kp.extend(after)
 records.append({'object':obj.get('id'),'name':obj.get('name'),'property':prop,'frames':[start,end],'segments':len(knots)-1,'nominal_target':tol,'measured_33point_error':maximum})

# Use the actual website functions for both the unchanged 12-card feed and the 6-card representative view.
legacy_states=json.loads((BASE/'logic-snapshots.json').read_text())
from timing_v43 import weights as demo_weights, SLIDERS, RESPONSES
state_frames=[0,450]+[f for f in range(451,781) if demo_weights(f)!=demo_weights(f-1)]
states=[{'frame':f,'weights':demo_weights(f)} for f in state_frames]
js="""
import fs from 'node:fs';import vm from 'node:vm';import {CONTENT_DATA,CATEGORY_META} from './data.js';
let code=fs.readFileSync('script.js','utf8');code=code.slice(code.indexOf('function calculateAllocation()'),code.indexOf('function renderAllViews('));
const states=JSON.parse(fs.readFileSync(0,'utf8'));let result=[];
for(const s of states){let sizes={};for(const size of [12,6]){
let ctx={CONTENT_DATA,state:{weights:Object.fromEntries(['study','tech','culture','hobby'].map((n,i)=>[n,s.weights[i]])),feedSize:size,contentType:'all',shuffleSeed:0}};
vm.createContext(ctx);vm.runInContext(code,ctx);let a=ctx.calculateAllocation();sizes[size]={allocation:a,feed:ctx.buildFeedList(a).map(x=>({id:x.id,category:x.category,title:x.title,type:x.type}))};
}result.push({frame:s.frame,weights:s.weights,sizes});}
console.log(JSON.stringify({meta:CATEGORY_META,states:result}));
"""
logic=json.loads(subprocess.check_output(['node','--input-type=module','-e',js],input=json.dumps(states),text=True,cwd=R))
meta=logic['meta']
def identified(feed):
 counts={};out=[]
 for item in feed:
  x=copy.deepcopy(item);counts[x['id']]=counts.get(x['id'],0)+1;x['instance']=x['id']+'#'+str(counts[x['id']]);out.append(x)
 return out
for old,s in zip(states,logic['states']):
 full=s['sizes']['12'];small=s['sizes']['6']
 old['categories']=full['allocation']['categories'];old['feed']=[{k:x[k] for k in ['id','category','title']} for x in full['feed']]
 full['feed']=identified(full['feed']);small['feed']=identified(small['feed'])
 fullkeys=[x['instance'] for x in full['feed']];at=-1
 for item in small['feed']:at=fullkeys.index(item['instance'],at+1)
 s['preview_is_actual_feed_subsequence']=True
(P/'logic-snapshots.json').write_text(json.dumps(states,ensure_ascii=False,indent=2)+'\n')
selected=[logic['states'][0]]
for s in logic['states'][1:]:
 if [x['instance'] for x in s['sizes']['6']['feed']]!=[x['instance'] for x in selected[-1]['sizes']['6']['feed']]:selected.append(s)
assert len(selected)==3,[(s['frame'],s['weights']) for s in selected]
plans=[]
for j,(prev,s) in enumerate(zip(selected,selected[1:])):
 start,end=RESPONSES[j];finish=SLIDERS[j][1]
 before=[x['instance'] for x in prev['sizes']['6']['feed']];after=[x['instance'] for x in s['sizes']['6']['feed']]
 endpoint=next(x for x in reversed(logic['states']) if x['frame']<=finish)
 assert [x['instance'] for x in endpoint['sizes']['6']['feed']]==after
 plans.append({'source_frame':s['frame'],'slider_start_frame':SLIDERS[j][0],'slider_settled_frame':finish,'response_start_frame':start,'settled_frame':end,'stabilization_seconds':(start-finish)/60,'response_delay_seconds':(start-s['frame'])/60,'before':before,'after':after,'enter':[x for x in after if x not in before],'exit':[x for x in before if x not in after],'relocate':[x for x in after if x in before and before.index(x)!=after.index(x)]})
logic['preview_note']='Six representative cards using the actual allocator at capacity 6, selected from the real default-12 output in the same relative order. Video-only summary; app feed size remains 12.'
logic['updates']=plans
(P/'feed-preview-snapshots.json').write_text(json.dumps(logic,ensure_ascii=False,indent=2)+'\n')

from scipy.interpolate import BPoly
def split_key(first,following,f):
 """Exact de Casteljau split, including non-linear TIME easing handles."""
 a,b=int(first.get('frame','0')),int(following.get('frame','0'))
 u=(f-a)/(b-a);value0,value1=float(first.get('value')),float(following.get('value'))
 left,right=copy.deepcopy(first),copy.deepcopy(first)
 right.set('frame',str(f))
 child=next(iter(first),None)
 if child is None or first.get('interpolationType')=='hold':
  right.set('value',str(value0 if first.get('interpolationType')=='hold' else value0+(value1-value0)*u))
  return left,right
 c=np.array([[0,value0 if child.tag=='CubicValueInterpolator' else 0],
             [float(child.get('x1')),float(child.get('y1'))],
             [float(child.get('x2')),float(child.get('y2'))],
             [1,value1 if child.tag=='CubicValueInterpolator' else 1]])
 lo,hi=0.,1.
 for _ in range(45):
  z=(lo+hi)/2;x=(1-z)**3*c[0,0]+3*(1-z)**2*z*c[1,0]+3*(1-z)*z*z*c[2,0]+z**3
  if x<u:lo=z
  else:hi=z
 z=(lo+hi)/2;d=c[:-1]*(1-z)+c[1:]*z;e=d[:-1]*(1-z)+d[1:]*z;cut=e[0]*(1-z)+e[1]*z
 val=cut[1] if child.tag=='CubicValueInterpolator' else value0+(value1-value0)*cut[1]
 right.set('value',f'{val:.15g}')
 for key,pts,isright in [(left,np.array([c[0],d[0],e[0],cut]),False),(right,np.array([cut,e[1],d[2],c[3]]),True)]:
  xs=(pts[:,0]-(u if isright else 0))/((1-u) if isright else u)
  ys=pts[:,1]
  if child.tag!='CubicValueInterpolator':ys=(ys-(cut[1] if isright else 0))/max(1e-15,(1-cut[1]) if isright else cut[1])
  cc=next(iter(key));cc.set('x1',f'{xs[1]:.15g}');cc.set('x2',f'{xs[2]:.15g}');cc.set('y1',f'{ys[1]:.15g}');cc.set('y2',f'{ys[2]:.15g}')
 return left,right

def splice_early(obj,prop,anim):
 """Keep 0–2s; remove the old repeated orbit; join 2–3.5s to old 6s.
 Old 6–10s native vector keys are translated exactly, not sped up.
 """
 prior=ko_for(obj,prop,anim);ks=list(prior.find('KeyedProperty'));old=Signal(obj,prop,anim)
 prefix=[copy.deepcopy(k) for k in ks if int(k.get('frame','0'))<120]
 if prefix:
  last=prefix[-1];a=int(last.get('frame','0'))
  nextold=next((k for k in ks if int(k.get('frame','0'))>a),None)
  if nextold is not None and int(nextold.get('frame','0'))>120:prefix[-1]=split_key(last,nextold,120)[0]
 # Match values and speed; quintic endpoint accelerations are estimated from the original scalar curve.
 def acc(f):return (old.at(f+.05,True)-old.at(f-.05,True))/.1*60
 poly=BPoly.from_derivatives([2,3.5],[[old.at(120),old.at(120,True),acc(120)],[old.at(360),old.at(360,True),acc(360)]])
 if obj.tag=='CubicDetachedVertex':
  # Local handles should not inherit the large acceleration of a removed orbit.
  # Preserve endpoint speed, then dissipate it locally; the central blend stays bounded.
  ts=np.linspace(2,3.5,181);u=(ts-2)/1.5
  v0,v1=old.at(120,True),old.at(360,True)
  values=old.at(120)+(old.at(360)-old.at(120))*q5(u)
  values+=v0*(ts-2)*(1-q5((ts-2)/.18))+v1*(ts-3.5)*(1-q5((3.5-ts)/.18))
  poly=CubicSpline(ts,values,bc_type=((1,v0),(1,v1)))
 curves(obj,prop,poly,anim,120,210,.00025 if 'Rotation' in prop or prop=='rotation' else .025,preserve=False)
 kp=ko_for(obj,prop,anim).find('KeyedProperty');generated=list(kp)
 kp[:]=prefix+generated
 exact=next((k for k in ks if int(k.get('frame','0'))==360),None)
 if exact is None:
  before=[k for k in ks if int(k.get('frame','0'))<360];after=[k for k in ks if int(k.get('frame','0'))>360]
  if before and after:exact=split_key(before[-1],after[0],360)[1]
 if exact is not None:
  final=kp[-1];final.set('interpolationType',exact.get('interpolationType','hold'))
  for c in list(final):final.remove(c)
  for c in exact:final.append(copy.deepcopy(c))
 for k in ks:
  if int(k.get('frame','0'))>360:
   k=copy.deepcopy(k);k.set('frame',str(int(k.get('frame','0'))-150));kp.append(k)


fonts={int(x.get('name').split()[-1]):x.get('id') for x in root.findall('FontAsset')}
short={'study-1':'메타인지의 비밀','study-2':'생각의 아카이빙','study-5':'경제 흐름 읽기','tech-2':'애플뮤직 모션','tech-1':'추천 시스템','culture-3':'슬로우 재즈','hobby-1':'달리기의 기초'}

for board in root.findall('Artboard'):
 theme=board.get('name');tokens=json.loads((P/'design-tokens.json').read_text())[theme.lower()]
 def color(token):return 'FF'+tokens[token][1:]
 anim=board.find('LinearAnimation');anim.set('name','V4.3 sliders lead feed follows 16s')
 stage=next(n for n in board.findall('Node') if n.get('name')=='Cinematic stage')
 oldfeed=next(n for n in stage.findall('Node') if n.get('name')=='Six-card representative feed')
 ids={n.get('id') for n in oldfeed.iter()};stage.remove(oldfeed)
 for k in list(anim):
  if k.tag=='KeyedObject' and k.get('objectId') in ids:anim.remove(k)
 objects={n.get('id'):n for n in board.iter() if n.get('id')}
 # All original moving materials, echoes and connection curves receive the same editorial splice.
 for ko in list(anim.findall('KeyedObject')):
  kp=ko.find('KeyedProperty')
  if kp.find('KeyFrameDouble') is not None:splice_early(objects[ko.get('objectId')],kp.get('property'),anim)
 def simple(obj,prop,keys):
  prior=ko_for(obj,prop,anim)
  if prior is not None:anim.remove(prior)
  ko=el(anim,'KeyedObject',objectId=obj.get('id'));kp=el(ko,'KeyedProperty',property=prop)
  for j,(f,v) in enumerate(keys):
   k=el(kp,'KeyFrameDouble',frame=f,value=v,interpolationType='cubic')
   if j<len(keys)-1:el(k,'CubicEaseInterpolator',x1=.16,y1=0,x2=.3,y2=1)
 # Restore a calm, later finale; no competing feed motion during the brand reveal.
 for prop,end in [('x',97.2),('y',550),('scaleX',.82),('scaleY',.82)]:
  if prop in ['scaleX','scaleY']:simple(stage,prop,[(0,1),(798,1),(858,end),(960,end)])
  else:
   old=Signal(stage,prop,anim);p=ko_for(stage,prop,anim);prefix=[copy.deepcopy(k) for k in p.find('KeyedProperty') if int(k.get('frame','0'))<450]
   simple(stage,prop,[(450,0),(798,0),(858,end),(960,end)])
   kp=ko_for(stage,prop,anim).find('KeyedProperty');kp[:]=prefix+list(kp)
 brand=next(n for n in board.findall('Node') if n.get('name')=='Brand finale')
 simple(brand,'opacity',[(0,0),(798,0),(852,1),(960,1)])
 simple(brand,'y',[(0,32),(798,32),(852,0),(960,0)])
 heading=next(n for n in stage.findall('Node') if n.get('name')=='Control heading')
 simple(heading,'opacity',[(0,0),(400,0),(440,1),(798,1),(846,0),(960,0)])
 heroes=[n for n in stage.findall('Node') if n.get('name','').endswith('continuous morph material')]
 props=['x','y','inRotation','outRotation','inDistance','outDistance']
 for i,hero in enumerate(heroes):
  handle=next(n for n in stage.findall('Node') if n.get('name')==meta[list(meta)[i]]['name']+' separated handle')
  # The extra row pitch is introduced only during settling, with zero velocity at either end.
  for obj in [hero,handle]:
   sig=Signal(obj,'y',anim)
   def shifted(t,nu=0,sig=sig,i=i):
    tt=np.asarray(t);q=np.clip((tt-5.75)/1.75,0,1)
    extra=16*i*(q5(q) if nu==0 else np.where((tt>5.75)&(tt<7.5),30*q*q*(1-q)**2/1.75,0))
    flat=tt.ravel();vals=np.array([sig.at(x*60,nu==1) for x in flat]).reshape(tt.shape)
    return vals+extra
   if i:curves(obj,'y',shifted,anim,345,450,.02,preserve=True)
  if i==3:continue
  pts=[(449,50),(450,50)]+[(s['frame'],s['weights'][i]) for j,s in enumerate(states) if s['frame']>450 and s['weights'][i]!=states[j-1]['weights'][i]]
  pts=sorted(dict(pts+[(f,demo_weights(f)[i]) for pair in SLIDERS for f in pair]).items())
  if pts[-1][0]!=780:pts.append((780,states[-1]['weights'][i]))
  wp=PchipInterpolator(np.array([f for f,w in pts])/60,[w for f,w in pts]);final=states[-1]['weights'][i]
  targets=[]
  for vertex in hero.findall('Shape/PointsPath/CubicDetachedVertex'):
   for prop in props:
    s=Signal(vertex,prop,anim);a,b=s.at(450),s.at(630)
    if abs(a-b)>1e-8:targets.append((vertex,prop,a,b))
  hs=Signal(handle,'x',anim);targets.append((handle,'x',hs.at(450),hs.at(630)))
  for obj,prop,a,b in targets:
   factor=(b-a)/(final-50)
   def fn(t,nu=0,a=a,factor=factor,wp=wp):return (a-factor*50 if nu==0 else 0)+factor*wp(t,nu)
   curves(obj,prop,fn,anim,450,780,.01,preserve=True)
 labels=next(n for n in stage.findall('Node') if n.get('name')=='Actual service controls')
 texts=labels.findall('Text');runs=[n.find('TextValueRun') for n in texts if '피드' in n.find('TextValueRun').get('text','')]
 for i,run in enumerate(runs):
  old=ko_for(run,'text',anim)
  if old is not None:anim.remove(old)
  ko=el(anim,'KeyedObject',objectId=run.get('id'));kp=el(ko,'KeyedProperty',property='text')
  for s in states:el(kp,'KeyFrameString',frame=s['frame'],value=f"{s['weights'][i]}% (피드 {s['categories'][list(meta)[i]]['displayPct']}%)",interpolationType='hold')
 # 160px card height +176px pitch: keep font size and 46px track-to-tick spacing.
 for n in texts:
  y=float(n.get('y'));i=min(range(4),key=lambda j:abs(y-(520+j*160)))
  n.set('y',str(y+16*i))
 shells=next(n for n in stage.findall('Node') if n.get('name')=='Control shells')
 for n in shells.findall('Shape'):
  y=float(n.get('y'));i=min(range(4),key=lambda j:abs(y-(520+j*160)))
  n.set('y',str(y+16*i+(12 if n.get('name')=='Channel card' else 0)))
  if n.get('name')=='Channel card':n.find('Rectangle').set('height','160')


 def text(parent,value,x,y,size,weight=600,token='text-main',left=False):
  n=el(parent,'Text',name=value,x=x,y=y,originX=0 if left else .5,originY=.5,sizingValue='autoWidth')
  st=el(n,'TextStylePaint',fontAssetId=fonts[weight],fontSize=size);f=el(st,'Fill');el(f,'SolidColor',colorValue=color(token));el(n,'TextValueRun',text=value,styleId=st.get('id'))
  return n
 def rect(parent,name,x,y,w,h,r,fill,outline=None):
  sh=el(parent,'Shape',name=name,x=x,y=y);el(sh,'Rectangle',width=w,height=h,cornerRadiusTL=r)
  f=el(sh,'Fill');el(f,'SolidColor',colorValue=fill)
  if outline:st=el(sh,'Stroke',thickness=2);el(st,'SolidColor',colorValue=outline)
  return sh
 feed=el(stage,'Node',name='Six-card representative feed',opacity=0)
 simple(feed,'opacity',[(0,0),(400,0),(440,1),(798,1),(846,0),(960,0)])
 text(feed,'맞춤 피드',540,1204,48,800)
 # One short response signal between the controls and the feed; never continuous particles.
 rect(feed,'Control-to-feed connector',540,1168,3,24,1,color('border-color'))
 for j,plan in enumerate(plans):
  signal=el(feed,'Node',name=f'Input response {j+1}',opacity=0)
  c='FF'+meta['study' if j==0 else 'hobby']['color'][1:]
  rect(signal,'Response light',0,0,8,13,4,c);signal.set('x','540')
  a=plan['response_start_frame']-7;z=plan['response_start_frame']
  simple(signal,'opacity',[(0,0),(a,0),(a+2,.8),(z+4,0),(960,0)])
  simple(signal,'y',[(0,1154),(a,1154),(z+4,1182),(960,1182)])
 # Card identities and text are stable objects. Retained cards move, not recolor.
 feeds=[x['sizes']['6']['feed'] for x in selected]
 byid={x['instance']:x for f in feeds for x in f}
 layouts=[[x['instance'] for x in f] for f in feeds]
 def slot(n):return np.array([324+(n%2)*432,1318+(n//2)*168],float)
 frames=np.arange(961);times=frames/60
 # Promoted hobby is in front during the compact three-card circulation.
 order=sorted(byid,key=lambda k:({'hobby-1#1':0,'culture-3#1':1,'tech-2#1':2}.get(k,3),k))
 for ident in order:
  item=byid[ident];g=el(feed,'Node',name='Feed card '+ident,opacity=0)
  initial=ident in layouts[0];initialslot=layouts[0].index(ident) if initial else layouts[1].index(ident)
  xy=np.repeat(slot(initialslot)[None,:],961,axis=0);opacity=np.ones(961) if initial else np.zeros(961);scale=np.ones(961)
  # Staggered, restrained initial entrance.
  if initial:
   q=q5((frames-(408+initialslot*3))/30)
   xy[:,1]+=20*(1-q);opacity=q;scale=.98+.02*q
  for eventidx,plan in enumerate(plans):
   before,after=plan['before'],plan['after'];start,end=plan['response_start_frame'],plan['settled_frame']
   active=frames>=start
   if ident in before and ident not in after:
    q=q5((frames-start)/16);base=slot(before.index(ident))
    xy[active]=base+np.stack([24*q[active],16*q[active]],axis=1);opacity[active]=1-q[active];scale[active]=1-.035*q[active]
   elif ident in after and ident not in before:
    q=q5((frames-(start+16))/(end-start-16));base=slot(after.index(ident))
    xy[active]=base+np.stack([np.zeros(np.sum(active)),26*(1-q[active])],axis=1);opacity[active]=q[active];scale[active]=.97+.03*q[active]
   elif ident in before and ident in after:
    src,dest=slot(before.index(ident)),slot(after.index(ident));delay=0
    if not np.all(src==dest):delay={'tech-2#1':0,'culture-3#1':5,'hobby-1#1':4}.get(ident,0)
    duration={'tech-2#1':61,'culture-3#1':58,'hobby-1#1':44}.get(ident,end-start-delay) if eventidx==1 else end-start-delay
    q=q5((frames-start-delay)/max(1,duration));arc=np.sin(np.pi*q)
    base=src[None,:]*(1-q[:,None])+dest[None,:]*q[:,None]
    if not np.all(src==dest):
     base[:,1]+={'tech-2#1':25,'culture-3#1':55,'hobby-1#1':78}.get(ident,-12)*arc
     base[:,0]+={'tech-2#1':-43,'culture-3#1':84,'hobby-1#1':36}.get(ident,0)*arc
     scale[active]=1-.04*arc[active]
    elif eventidx==0 and item['category']=='study':
     base[:,1]-=9*arc;scale[active]=1+.012*arc[active]
    xy[active]=base[active]
  for j,prop in enumerate(['x','y']):curves(g,prop,CubicSpline(times,xy[:,j],bc_type='clamped'),anim,tol=.08)
  for prop,arr in [('opacity',opacity),('scaleX',scale),('scaleY',scale)]:curves(g,prop,CubicSpline(times,arr,bc_type='clamped'),anim,tol=.0008)
  text(g,meta[item['category']]['name'],-146,-33,40,800,left=True)
  text(g,'영상' if item['type']=='video' else '기사',142,-33,26,600,token='text-muted')
  text(g,short[item['id']],-146,30,34,600,left=True)
  c='FF'+meta[item['category']]['color'][1:]
  rect(g,'Category stripe',-177,0,7,90,3,c)
  rect(g,'Feed card surface',0,0,388,144,26,color('bg-card'),color('border-color'))
  rect(g,'Feed card shadow',0,6,388,144,26,'33000000' if theme=='Dark' else '0D0F172A')


# Spliced keys may share an original easing child; keys/interpolators have no external references.
# Give their authored copies unique IDs while retaining all drawable and animation IDs.
for board in root.findall('Artboard'):
 for ko in board.findall('LinearAnimation/KeyedObject'):
  for n in ko.iter():n.set('id',f'0:{serial}');serial+=1
E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode');(P/'rive.yaml').write_text('name: intro-v4-3\n')
(P/'motion-curves.json').write_text(json.dumps({'duration':16,'fps':60,'scenes':[[0,3.5],[3.5,7.5],[7.5,13.3],[13.3,16]],'editorial_splice':{'unchanged_intro_seconds':[0,2],'new_endpoint_matched_connection':[2,3.5],'removed_old_orbit_seconds':[2,6],'old_morph_seconds':[6,10],'new_morph_seconds':[3.5,7.5],'speed_multiplier':1},'morph_phases':[[3.5,4.45],[4.45,5.75],[5.75,7.5]],'slider_intervals_frames':SLIDERS,'feed_intervals_frames':RESPONSES,'records':records},ensure_ascii=False,indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — 0–2초 보존, 2–3.5초 값·속도 연결 경로, 기존 4초 모핑을 배속 없이 이동. 슬라이더/피드 2회 분리와 0.25초 안정 구간. 눈금 글꼴 유지/카드160px/행176px, 피드60px 하향.\n')
print(json.dumps({'project':str(P),'curves':len(records),'segments':sum(x['segments'] for x in records),'updates':plans},ensure_ascii=False,indent=2))
