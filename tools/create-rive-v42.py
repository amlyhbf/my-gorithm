#!/usr/bin/env python3
"""Targeted V4.2 refinement. Reads V4.1 and app data; writes only the new project."""
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
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-2';BASE=R/'animation/intro-v4-1'
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
def demo_weights(frame):
 study=50+5*math.floor(10*float(q5((frame-600)/66))+.5)
 q=float(q5((frame-696)/58))
 if q<=.08:tech=culture=50
 else:
  tech=50-5*max(1,math.floor(4*q+.5))
  culture=50-5*max(1,math.floor(6*q+.5))
 return [study,tech,culture,50]
state_frames=[0,600]+[f for f in range(601,781) if demo_weights(f)!=demo_weights(f-1)]
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
for prev,s,delay in [(selected[0],selected[1],6),(selected[1],selected[2],8)]:
 start=s['frame']+delay;end=start+(30 if prev is selected[0] else 36)
 before=[x['instance'] for x in prev['sizes']['6']['feed']];after=[x['instance'] for x in s['sizes']['6']['feed']]
 plans.append({'source_frame':s['frame'],'response_start_frame':start,'settled_frame':end,'response_delay_seconds':(start-s['frame'])/60,'before':before,'after':after,'enter':[x for x in after if x not in before],'exit':[x for x in before if x not in after],'relocate':[x for x in after if x in before and before.index(x)!=after.index(x)]})
logic['preview_note']='Six representative cards using the actual allocator at capacity 6, selected from the real default-12 output in the same relative order. Video-only summary; app feed size remains 12.'
logic['updates']=plans
(P/'feed-preview-snapshots.json').write_text(json.dumps(logic,ensure_ascii=False,indent=2)+'\n')

# The visible short titles summarize existing content; card identities come from the actual selected content.
short={'study-1':'메타인지의 비밀','study-2':'생각의 아카이빙','study-5':'경제 흐름 읽기','tech-2':'애플뮤직 모션','tech-1':'추천 시스템','culture-3':'슬로우 재즈','hobby-1':'달리기의 기초'}
words='맞춤 피드 영상 기사 '+''.join(short.values())
for n in root.iter():
 if n.tag=='TextValueRun':words+=n.get('text','')
 if n.tag=='KeyFrameString':words+=n.get('value','')
for weight in [600,800]:
 font=instantiateVariableFont(TTFont(R/'animation/intro-v3/assets/PretendardVariable.woff2'),{'wght':weight},inplace=True)
 sub=subset.Subsetter();sub.populate(text=words);sub.subset(font);font.flavor=None;font.save(P/f'Pretendard-{weight}.ttf')
fonts={int(x.get('name').split()[-1]):x.get('id') for x in root.findall('FontAsset')}

# Authored scalar curves change only the 6..10s material window.
grid=np.arange(360,601)/60;props=['x','y','inRotation','outRotation','inDistance','outDistance']
rigs=[Rig(i) for i in range(4)]
for board in root.findall('Artboard'):
 theme=board.get('name');tokens=json.loads((P/'design-tokens.json').read_text())[theme.lower()]
 def color(token):return 'FF'+tokens[token][1:]
 anim=board.find('LinearAnimation');anim.set('name','V4.2 focused morph and feed 16s')
 stage=next(n for n in board.findall('Node') if n.get('name')=='Cinematic stage')
 heroes=[n for n in stage.findall('Node') if n.get('name','').endswith('continuous morph material')]
 for i,hero in enumerate(heroes):
  rig=rigs[i];verts=hero.findall('Shape/PointsPath/CubicDetachedVertex')
  poses=np.array([rig.pose(t) for t in grid]);surfaces=np.array([rig.surface(t) for t in grid])
  pose_signals=[Signal(hero,p,anim) for p in ['x','y','rotation']]
  surface_signals=[[Signal(v,p,anim) for p in props] for v in verts]
  oldposes=np.array([[s.at(t*60) for s in pose_signals] for t in grid])
  oldsurfaces=np.array([[[s.at(t*60) for s in row] for row in surface_signals] for t in grid])
  # End-align tangent winding; local path order is identical to the legacy material.
  for j in range(8):
   for k in [2,3]:
    a=np.unwrap(surfaces[:,j,k]);a-=round((a[-1]-oldsurfaces[-1,j,k])/(2*math.pi))*2*math.pi;surfaces[:,j,k]=a
  ingress=q5((grid-6)/.5);settle=q5((grid-8.85)/.65)
  poses=oldposes*(1-ingress[:,None])+poses*ingress[:,None]
  surfaces=oldsurfaces*(1-ingress[:,None,None])+surfaces*ingress[:,None,None]
  poses=poses*(1-settle[:,None])+oldposes[-1]*settle[:,None]
  surfaces=surfaces*(1-settle[:,None,None])+oldsurfaces[-1]*settle[:,None,None]
  for j,prop in enumerate(['x','y','rotation']):
   s=Signal(hero,prop,anim)
   cs=CubicSpline(grid,poses[:,j],bc_type=((1,s.at(360,True)),(1,0)))
   curves(hero,prop,cs,anim,360,600,.05 if j<2 else .0005,preserve=True)
  for j,v in enumerate(verts):
   for k,prop in enumerate(props):
    s=Signal(v,prop,anim);cs=CubicSpline(grid,surfaces[:,j,k],bc_type=((1,s.at(360,True)),(1,0)))
    curves(v,prop,cs,anim,360,600,.002 if k in [2,3] else .35,preserve=True)
  handle=next(n for n in stage.findall('Node') if n.get('name')==meta[list(meta)[i]]['name']+' separated handle')
  hp=[]
  for n,t in enumerate(grid):
   j=6 if i==1 else 2;point=surfaces[n,j,:2];a=poses[n,2]
   world=poses[n,:2]+np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])@point
   blend=float(q5((t-(7.9+.04*i))/(1.25-.04*i)))
   hp.append(world*(1-blend)+np.array([540,ROWS[i]])*blend)
  hp=np.asarray(hp)
  for j,prop in enumerate(['x','y']):
   s=Signal(handle,prop,anim);old=np.array([s.at(t*60) for t in grid]);arr=old*(1-ingress)+hp[:,j]*ingress
   arr=arr*(1-settle)+s.at(600)*settle
   cs=CubicSpline(grid,arr,bc_type=((1,s.at(360,True)),(1,0)))
   curves(handle,prop,cs,anim,360,600,.08,preserve=True)
 # Retiming within the same 10..13s scene makes both feed responses causal and legible.
 # Final weights and the 13..16s UI are identical to V4.1.
 legacy_board=next(b for b in E.parse(BASE/'scene.rml').getroot().findall('Artboard') if b.get('name')==theme)
 legacy_anim=legacy_board.find('LinearAnimation');legacy_objects={x.get('id'):x for x in legacy_board.iter() if x.get('id')}
 for i,hero in enumerate(heroes):
  points=[(599,50),(600,50)]+[(s['frame'],s['weights'][i]) for j,s in enumerate(states) if s['frame']>600 and s['weights'][i]!=states[j-1]['weights'][i]]
  if points[-1][0]!=780:points.append((780,states[-1]['weights'][i]))
  wp=PchipInterpolator(np.array([f for f,w in points])/60,[w for f,w in points])
  if i==3:continue
  initial,final=50,states[-1]['weights'][i]
  targets=[]
  for v in hero.findall('Shape/PointsPath/CubicDetachedVertex'):
   for prop in props:
    before=Signal(legacy_objects[v.get('id')],prop,legacy_anim)
    a,b=before.at(600),before.at(780)
    if abs(a-b)>1e-8:targets.append((v,prop,a,b))
  handle=next(n for n in stage.findall('Node') if n.get('name')==meta[list(meta)[i]]['name']+' separated handle')
  hs=Signal(legacy_objects[handle.get('id')],'x',legacy_anim);targets.append((handle,'x',hs.at(600),hs.at(780)))
  for obj,prop,a,b in targets:
   factor=(b-a)/(final-initial)
   def fn(t,nu=0,a=a,factor=factor,wp=wp):return (a-factor*initial if nu==0 else 0)+factor*wp(t,nu)
   curves(obj,prop,fn,anim,600,780,.02,preserve=True)
 labels=next(n for n in stage.findall('Node') if n.get('name')=='Actual service controls')
 runs=[n.find('TextValueRun') for n in labels.findall('Text') if n.find('TextValueRun') is not None and '피드' in n.find('TextValueRun').get('text','')]
 assert len(runs)==4
 for i,run in enumerate(runs):
  prior=ko_for(run,'text',anim)
  if prior is not None:anim.remove(prior)
  ko=el(anim,'KeyedObject',objectId=run.get('id'));kp=el(ko,'KeyedProperty',property='text')
  for s in states:
   cat=list(meta)[i];value=f"{s['weights'][i]}% (피드 {s['categories'][cat]['displayPct']}%)"
   el(kp,'KeyFrameString',frame=s['frame'],value=value,interpolationType='hold')
 # One connection beat gives way to the straight UI instead of a second wave.
 streams=next(n for n in stage.findall('Node') if n.get('name')=='Ordering streams')
 ss=Signal(streams,'opacity',anim)
 cs=CubicSpline(np.array([360,405,466,512,545])/60,[ss.at(360),.44,.18,0,0],bc_type=((1,ss.at(360,True)),(1,0)))
 # Preserve the original time-eased prefix verbatim (its boundary is an existing key).
 original=ko_for(streams,'opacity',anim);prefix=[copy.deepcopy(k) for k in original.find('KeyedProperty') if int(k.get('frame','0'))<360]
 curves(streams,'opacity',cs,anim,360,545,.002,preserve=False)
 kp=ko_for(streams,'opacity',anim).find('KeyedProperty')
 for k in reversed(prefix):kp.insert(0,k)
 # Remove the old twelve small tiles and their animation targets, only in this new source.
 feed_old=next(n for n in stage.findall('Node') if n.get('name')=='Actual twelve-card recommendation')
 ids={x.get('id') for x in feed_old.iter()}
 stage.remove(feed_old)
 for k in list(anim):
  if k.tag=='KeyedObject' and k.get('objectId') in ids:anim.remove(k)
 def text(parent,value,x,y,size,weight=600,token='text-main',left=False):
  n=el(parent,'Text',name=value,x=x,y=y,originX=0 if left else .5,originY=.5,sizingValue='autoWidth')
  st=el(n,'TextStylePaint',fontAssetId=fonts[weight],fontSize=size);f=el(st,'Fill');el(f,'SolidColor',colorValue=color(token));el(n,'TextValueRun',text=value,styleId=st.get('id'))
  return n
 def rect(parent,name,x,y,w,h,r,fill,outline=None):
  sh=el(parent,'Shape',name=name,x=x,y=y);el(sh,'Rectangle',width=w,height=h,cornerRadiusTL=r)
  f=el(sh,'Fill');el(f,'SolidColor',colorValue=fill)
  if outline:st=el(sh,'Stroke',thickness=2);el(st,'SolidColor',colorValue=outline)
  return sh
 def simple(obj,prop,keys):
  ko=el(anim,'KeyedObject',objectId=obj.get('id'));kp=el(ko,'KeyedProperty',property=prop)
  for j,(f,v) in enumerate(keys):
   k=el(kp,'KeyFrameDouble',frame=f,value=v,interpolationType='cubic')
   if j<len(keys)-1:el(k,'CubicEaseInterpolator',x1=.16,y1=0,x2=.3,y2=1)
 feed=el(stage,'Node',name='Six-card representative feed',opacity=0)
 simple(feed,'opacity',[(0,0),(550,0),(590,1),(790,1),(824,0),(960,0)])
 text(feed,'맞춤 피드',540,1144,48,800)
 # One short response signal between the controls and the feed; never continuous particles.
 rect(feed,'Control-to-feed connector',540,1092,3,38,1,color('border-color'))
 for j,plan in enumerate(plans):
  signal=el(feed,'Node',name=f'Input response {j+1}',opacity=0)
  c='FF'+meta['study' if j==0 else 'hobby']['color'][1:]
  rect(signal,'Response light',0,0,8,13,4,c);signal.set('x','540')
  a=plan['source_frame'];z=plan['response_start_frame']
  simple(signal,'opacity',[(0,0),(a,0),(a+2,.8),(z+4,0),(960,0)])
  simple(signal,'y',[(0,1078),(a,1078),(z+4,1110),(960,1110)])
 # Card identities and text are stable objects. Retained cards move, not recolor.
 feeds=[x['sizes']['6']['feed'] for x in selected]
 byid={x['instance']:x for f in feeds for x in f}
 layouts=[[x['instance'] for x in f] for f in feeds]
 def slot(n):return np.array([324+(n%2)*432,1258+(n//2)*168],float)
 frames=np.arange(961);times=frames/60
 # Promoted hobby is in front during the compact three-card circulation.
 order=sorted(byid,key=lambda k:(k!='hobby-1#1',k!='study-5#1',k))
 for ident in order:
  item=byid[ident];g=el(feed,'Node',name='Feed card '+ident,opacity=0)
  initial=ident in layouts[0];initialslot=layouts[0].index(ident) if initial else layouts[1].index(ident)
  xy=np.repeat(slot(initialslot)[None,:],961,axis=0);opacity=np.ones(961) if initial else np.zeros(961);scale=np.ones(961)
  # Staggered, restrained initial entrance.
  if initial:
   q=q5((frames-(558+initialslot*3))/30)
   xy[:,1]+=20*(1-q);opacity=q;scale=.98+.02*q
  for eventidx,plan in enumerate(plans):
   before,after=plan['before'],plan['after'];start,end=plan['response_start_frame'],plan['settled_frame']
   active=frames>=start
   if ident in before and ident not in after:
    q=q5((frames-start)/12);base=slot(before.index(ident))
    xy[active]=base+np.stack([24*q[active],16*q[active]],axis=1);opacity[active]=1-q[active];scale[active]=1-.035*q[active]
   elif ident in after and ident not in before:
    q=q5((frames-(start+12))/(end-start-12));base=slot(after.index(ident))
    xy[active]=base+np.stack([np.zeros(np.sum(active)),26*(1-q[active])],axis=1);opacity[active]=q[active];scale[active]=.97+.03*q[active]
   elif ident in before and ident in after:
    src,dest=slot(before.index(ident)),slot(after.index(ident));delay=0
    if not np.all(src==dest):delay={'tech-2#1':0,'culture-3#1':6,'hobby-1#1':0}.get(ident,0)
    duration={'tech-2#1':28,'culture-3#1':30,'hobby-1#1':20}.get(ident,end-start-delay) if eventidx==1 else end-start-delay
    q=q5((frames-start-delay)/max(1,duration));arc=np.sin(np.pi*q)
    base=src[None,:]*(1-q[:,None])+dest[None,:]*q[:,None]
    if not np.all(src==dest):
     base[:,1]+={'tech-2#1':-32,'culture-3#1':18,'hobby-1#1':-8}.get(ident,-12)*arc
     base[:,0]+={'tech-2#1':-24,'culture-3#1':18,'hobby-1#1':26}.get(ident,0)*arc
     scale[active]=1+.018*arc[active]
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

E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode');(P/'rive.yaml').write_text('name: intro-v4-2\n')
(P/'motion-curves.json').write_text(json.dumps({'phases':[{'name':'approach and compress','seconds':[6,6.95]},{'name':'single directional unfolding','seconds':[6.95,8.25]},{'name':'asymmetric settling','seconds':[8.25,10]}],'changed_morph_frames':[360,600],'duration':16,'records':records},ensure_ascii=False,indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — 3국면 모핑 및 2회 피드 응답 RML 생성. 실제 함수의 12장 출력·6장 대표 선택 계산. 시작/최종 관심도는 유지하고 10–13초 안의 시연 키만 두 조절 동작으로 재배치. 카드의 내용·색은 고정된 객체로 유지하며 교체 1회/재배치 1회를 설계.\n')
print(json.dumps({'project':str(P),'curves':len(records),'segments':sum(x['segments'] for x in records),'updates':plans},ensure_ascii=False,indent=2))
