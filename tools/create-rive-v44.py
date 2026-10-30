#!/usr/bin/env python3
"""V4.4 focused patch of the approved V4.3 RML; no app code changes."""
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
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-4';BASE=R/'animation/intro-v4-3'
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
  following=next((k for k in original if int(k.get('frame','0'))>fa),None)
  if following is not None and int(following.get('frame','0'))>start:
   prefix[-1]=split_key(last,following,start)[0]
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
  if boundary is None and after:
   before=next(x for x in reversed(original) if int(x.get('frame','0'))<end)
   continuation=split_key(before,after[0],end)[1]
   k.set('interpolationType',continuation.get('interpolationType','hold'))
   for c in list(k):k.remove(c)
   for c in continuation:k.append(copy.deepcopy(c))
  kp.extend(after)
 records.append({'object':obj.get('id'),'name':obj.get('name'),'property':prop,'frames':[start,end],'segments':len(knots)-1,'nominal_target':tol,'measured_33point_error':maximum})


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

from scipy.interpolate import BPoly
from timing_v44 import SHIFT,JOIN,SLIDERS,OLD_RESPONSES,RESPONSES,PATCH_WINDOWS,CHANGED,REUSE

entrances=[
 {'category':'study','start':0,'end':72,'origin':[-38,310],'velocity':[2400,900],
  'knots':[(.25,470,560,1700,500),(.57,800,570,140,-160)],'angle':-.10,'stretch':.075,'character':'stable diagonal / restrained overshoot'},
 {'category':'tech','start':15,'end':80,'origin':[1190,555],'velocity':[-2850,700],
  'knots':[(.52,640,790,-1050,1250),(.88,660,1160,170,590)],'angle':.08,'stretch':.10,'character':'agile opposite crossing'},
 {'category':'culture','start':29,'end':86,'origin':[-115,1560],'velocity':[1550,-280],
  'knots':[(.81,325,1380,650,-850),(1.13,320,1225,-250,-500)],'angle':-.15,'stretch':.035,'character':'soft arc joining the flow'},
 {'category':'hobby','start':41,'end':90,'origin':[930,2035],'velocity':[-1150,-2500],
  'knots':[(.96,665,1500,-400,-1550),(1.23,680,1270,240,-400)],'angle':.13,'stretch':.065,'character':'short upward curve / light follow-through'},
]

def shift_keys(kp,offset=SHIFT):
 byframe={}
 for k in list(kp):
  f=min(960,int(k.get('frame','0'))+offset);k.set('frame',str(f));byframe[f]=k
 kp[:]=[byframe[f] for f in sorted(byframe)]

def signal_array(signal,t,nu=0):
 t=np.asarray(t);return np.asarray([signal.at(float(x)*60,nu==1) for x in t.ravel()]).reshape(t.shape)

def map_signal(signal,start,end,delta,guard,restore,restore_offset=0):
 """Translate the approved active segment exactly; adjust time only in quiet margins."""
 def fn(t,nu=0):
  f=np.asarray(t)*60;q=np.ones_like(f);qp=np.zeros_like(f)
  pre=f<start;post=f>end
  u=np.clip((f-guard)/(start-guard),0,1)
  q=np.where(pre,q5(u),q);qp=np.where(pre,30*u*u*(1-u)**2/(start-guard),qp)
  u=np.clip((f-end)/(restore-end),0,1)
  q=np.where(post,1-q5(u),q);qp=np.where(post,-30*u*u*(1-u)**2/(restore-end),qp)
  mapped=f+delta*q+np.where(post,restore_offset*(1-q),0);vals=signal_array(signal,mapped/60,nu)
  return vals if nu==0 else vals*(1+delta*qp-np.where(post,restore_offset*qp,0))
 return fn

baseline=E.parse(BASE/'scene.rml').getroot()
for board in root.findall('Artboard'):
 theme=board.get('name');anim=board.find('LinearAnimation');anim.set('name','V4.4 kinetic chain and immediate feed 16s')
 oldboard=next(b for b in baseline.findall('Artboard') if b.get('name')==theme);oldanim=oldboard.find('LinearAnimation')
 oldobjects={n.get('id'):n for n in oldboard.iter() if n.get('id')}
 stage=next(n for n in board.findall('Node') if n.get('name')=='Cinematic stage')
 brand=next(n for n in board.findall('Node') if n.get('name')=='Brand finale');brandids={n.get('id') for n in brand.iter()}
 feed=next(n for n in stage.findall('Node') if n.get('name')=='Six-card representative feed')
 heading=next(n for n in stage.findall('Node') if n.get('name')=='Control heading')
 # Existing free movement/morph/inputs get 24 extra frames at the front, never a speed change.
 for ko in anim.findall('KeyedObject'):
  oid=ko.get('objectId');kp=ko.find('KeyedProperty')
  if oid in brandids:continue
  if oid in [stage.get('id'),feed.get('id'),heading.get('id')]:
   for k in kp:
    f=int(k.get('frame','0'))
    if f<780:k.set('frame',str(f+SHIFT))
  else:shift_keys(kp)
 heroes=[n for n in stage.findall('Node') if n.get('name','').endswith('continuous morph material')]
 paths=[]
 for i,(hero,plan) in enumerate(zip(heroes,entrances)):
  f0,f1=plan['start'],plan['end'];t0,t1=f0/60,f1/60
  poses=[Signal(hero,p,anim) for p in ['x','y','rotation']]
  # Match the original shifted path's position, velocity and acceleration at the join.
  knots=[t0]+[k[0] for k in plan['knots']]+[t1];derivatives=[]
  derivatives.append([np.array(plan['origin']),np.array(plan['velocity']),np.zeros(2)])
  for t,x,y,vx,vy in plan['knots']:derivatives.append([np.array([x,y]),np.array([vx,vy]),np.zeros(2)])
  accel=np.array([(s.at(f1+.02,True)-s.at(f1-.02,True))/.04*60 for s in poses[:2]])
  derivatives.append([np.array([s.at(f1) for s in poses[:2]]),np.array([s.at(f1,True) for s in poses[:2]]),accel])
  path=BPoly.from_derivatives(knots,derivatives);paths.append((path,poses))
  for j,p in enumerate(['x','y']):
   def fn(t,nu=0,j=j,path=path,t0=t0,origin=plan['origin']):
    tt=np.asarray(t);out=path(np.maximum(tt,t0),nu)[...,j]
    return np.where(tt<t0,origin[j] if nu==0 else 0,out)
   curves(hero,p,fn,anim,0,f1,.035,preserve=True)
  angle=BPoly.from_derivatives([t0,t1],[[plan['angle'],0],[poses[2].at(f1),poses[2].at(f1,True)]])
  def af(t,nu=0,angle=angle,t0=t0,a=plan['angle']):
   tt=np.asarray(t);return np.where(tt<t0,a if nu==0 else 0,angle(np.maximum(tt,t0),nu))
  curves(hero,'rotation',af,anim,0,f1,.0002,preserve=True)
  # No opacity entrance: the silhouette is already opaque when it crosses the edge.
  old=ko_for(hero,'opacity',anim)
  if old is not None:anim.remove(old)
  hero.set('opacity','1')
  for p,factor in [('scaleX',1),('scaleY',-.5)]:
   hero.set(p,'1')
   def sf(t,nu=0,a=plan['stretch']*factor,t0=t0,t1=t1):
    tt=np.asarray(t);u=np.clip((tt-t0)/(t1-t0),0,1)
    if nu==0:return 1+a*(1-q5(u))
    return np.where((tt>t0)&(tt<t1),-a*30*u*u*(1-u)**2/(t1-t0),0)
   curves(hero,p,sf,anim,0,f1,.0002,preserve=False)
 # Keep V4.3's four small hobby fragments attached to the newly entering hobby.
 # They never pre-appear independently at their old fixed positions.
 hobby=heroes[3];hp,prior=paths[3];end=entrances[3]['end']
 for fragment in [n for n in stage.findall('Node') if n.get('name')=='Gather fragment']:
  for j,p in enumerate(['x','y']):
   old=Signal(fragment,p,anim)
   def fn(t,nu=0,j=j,old=old,hp=hp,prior=prior):
    tt=np.asarray(t);first=entrances[3]['start']/60;out=hp(np.maximum(tt,first),nu)[...,j]
    out=np.where(tt<first,entrances[3]['origin'][j] if nu==0 else 0,out)
    return signal_array(old,tt,nu)+out-signal_array(prior[j],tt,nu)
   curves(fragment,p,fn,anim,0,end,.04,preserve=True)
 # Retain every approved card, title, surface, route, scale and easing; only its clock changes.
 targets=[n for n in feed.findall('Node') if n.get('name','').startswith(('Feed card ','Input response '))]
 for j,((oldstart,oldend),(newstart,newend),(guard,restore)) in enumerate(zip(OLD_RESPONSES,RESPONSES,PATCH_WINDOWS)):
  delta=oldstart+SHIFT-newstart
  for n in targets:
   for prop in ['x','y','scaleX','scaleY','opacity']:
    if ko_for(n,prop,anim) is None:continue
    sig=Signal(n,prop,anim);fn=map_signal(sig,newstart,newend,delta,guard,restore,SHIFT if j==1 else 0)
    if j==1:
     # V4.3's fitted card curves have a tiny settling tail. Restore their exact
     # original absolute clock before the unchanged brand scene instead of shifting that tail.
     current=ko_for(n,prop,anim).find('KeyedProperty')
     original=list(ko_for(oldobjects[n.get('id')],prop,oldanim).find('KeyedProperty'))
     boundary=next((k for k in original if int(k.get('frame','0'))==restore),None)
     if boundary is None:
      left=next(k for k in reversed(original) if int(k.get('frame','0'))<restore)
      right=next(k for k in original if int(k.get('frame','0'))>restore)
      boundary=split_key(left,right,restore)[1]
     current[:]=[k for k in current if int(k.get('frame','0'))<restore]+[copy.deepcopy(boundary)]+[copy.deepcopy(k) for k in original if int(k.get('frame','0'))>restore]
    keys=ko_for(n,prop,anim).find('KeyedProperty');seed={guard,restore,newstart,newend}
    seed.update(int(k.get('frame','0'))-delta for k in keys if guard<=int(k.get('frame','0'))-delta<=restore)
    curves(n,prop,fn,anim,guard,restore,.0003 if prop in ['opacity','scaleX','scaleY'] else .005,seeds=sorted(seed),preserve=True)

# Keyframes have no external references; fresh IDs avoid reused split-interpolator IDs.
for board in root.findall('Artboard'):
 for ko in board.findall('LinearAnimation/KeyedObject'):
  for n in ko.iter():n.set('id',f'0:{serial}');serial+=1
E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode');(P/'rive.yaml').write_text('name: intro-v4-4\n')
for n in ['logic-snapshots.json','feed-preview-snapshots.json']:
 data=json.loads((BASE/n).read_text())
 states=data if isinstance(data,list) else data['states']
 for state in states:
  if state['frame']>0:state['frame']+=SHIFT
 if isinstance(data,dict):
  for old,(start,end) in zip(data['updates'],RESPONSES):
   old['v43_response_start_frame']=old['response_start_frame'];old['v43_settled_frame']=old['settled_frame']
   old['source_frame']+=SHIFT;old['slider_start_frame']+=SHIFT;old['slider_settled_frame']+=SHIFT
   old['response_start_frame']=start;old['settled_frame']=end
   old['response_delay_seconds']=(start-old['source_frame'])/60
   old['authored_overlap_seconds']=(old['slider_settled_frame']-start)/60
   old.pop('stabilization_seconds',None)
 (P/n).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(P/'motion-curves.json').write_text(json.dumps({'duration':16,'fps':60,'entrances':entrances,'shift_frames':SHIFT,'sliders':SLIDERS,'responses':RESPONSES,'changed_ranges_inclusive':CHANGED,'cache_reuse_new_start_end_old_offset':REUSE,'records':records},ensure_ascii=False,indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — V4.3 XML 직접 수정: 0/.25/.483/.683초 연쇄 진입, 1.5초에 원래1.1초 포즈·속도로 합류. 이후 자유 이동·모핑·입력은 24프레임 뒤로 이동(배속 없음). 두 피드만 29/36프레임 앞당김. 카드 경로·UI·브랜드 키 보존.\n')
print(json.dumps({'records':len(records),'segments':sum(x['segments'] for x in records),'responses':RESPONSES,'changed_frames_per_theme':sum(z-a+1 for a,z in CHANGED)},indent=2))

