#!/usr/bin/env python3
"""Refine V4 motion only. The original UI, state changes, themes and final scene are retained."""
from pathlib import Path
import sys,copy,json,math,hashlib,datetime,xml.etree.ElementTree as E
import numpy as np
from scipy.interpolate import CubicSpline
from motion_v41 import Rig,q5
from zoneinfo import ZoneInfo
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-1';BASE=R/'animation/intro-v4'
PROPS=['x','y','inRotation','outRotation','inDistance','outDistance']
root=E.parse(BASE/'scene.rml').getroot()
for f in ['Pretendard-600.ttf','Pretendard-800.ttf','FONT-LICENSE.txt','logic-snapshots.json','design-tokens.json']:
 import shutil;shutil.copy(BASE/f,P/f)
serial=max(int(n.get('id','0:0').split(':')[1]) for n in root.iter())+1

def el(p,tag,**a):
 global serial
 a={k:str(v) for k,v in a.items()};a['id']=f'0:{serial}';serial+=1
 return E.SubElement(p,tag,a)

class OldSignal:
 def __init__(self,o,prop,anim):
  self.prop=prop;self.fallback=float(o.get(prop,0));self.obj=o
  self.ko=next((k for k in anim.findall('KeyedObject') if k.get('objectId')==o.get('id') and k.find('KeyedProperty').get('property')==prop),None)
  self.keys=[] if self.ko is None else list(self.ko.find('KeyedProperty'))
  self.keys=[k for k in self.keys if k.tag=='KeyFrameDouble']
 def value(self,frame):
  ks=self.keys
  if not ks:return self.fallback
  if frame<=int(ks[0].get('frame','0')):return float(ks[0].get('value'))
  for a,b in zip(ks,ks[1:]):
   fa,fb=int(a.get('frame','0')),int(b.get('frame','0'))
   if frame<=fb:
    va,vb=float(a.get('value')),float(b.get('value'));u=(frame-fa)/(fb-fa);kind=a.get('interpolationType','hold')
    if kind=='hold':return va
    if kind=='linear':return va+(vb-va)*u
    c=next(iter(a),None)
    if c is None:return va+(vb-va)*u
    x1,y1,x2,y2=[float(c.get(n,d)) for n,d in [('x1','.42'),('y1','0'),('x2','.58'),('y2','1')]]
    lo,hi=0.,1.
    for _ in range(32):
     m=(lo+hi)/2;x=3*(1-m)**2*m*x1+3*(1-m)*m*m*x2+m**3
     if x<u:lo=m
     else:hi=m
    u=(lo+hi)/2
    if c.tag=='CubicValueInterpolator':return (1-u)**3*va+3*(1-u)**2*u*y1+3*(1-u)*u*u*y2+u**3*vb
    q=3*(1-u)**2*u*y1+3*(1-u)*u*u*y2+u**3;return va+(vb-va)*q
  return float(ks[-1].get('value'))

fit_records=[]
def patch(o,prop,spline,anim,tolerance=.2):
 old=OldSignal(o,prop,anim)
 # Endpoint is exactly the old ten-second pose, not merely visually close.
 assert abs(float(spline(10))-old.value(600))<1e-5,(o.get('name'),prop,spline(10),old.value(600))
 knots={0,600}
 def herm(a,b,ts):
  ta,tb=a/60,b/60;h=tb-ta;u=(ts-ta)/h;y0,y1=float(spline(ta)),float(spline(tb));d0,d1=float(spline(ta,1)),float(spline(tb,1))
  return (2*u**3-3*u*u+1)*y0+(u**3-2*u*u+u)*h*d0+(-2*u**3+3*u*u)*y1+(u**3-u*u)*h*d1
 def fit(a,b):
  ts=np.linspace(a/60,b/60,9);err=float(np.max(np.abs(spline(ts)-herm(a,b,ts))))
  if err>tolerance and b-a>1:
   m=(a+b)//2;knots.add(m);fit(a,m);fit(m,b)
 fit(0,600);knots=sorted(knots)
 if old.ko is not None:anim.remove(old.ko)
 ko=el(anim,'KeyedObject',objectId=o.get('id'));kp=el(ko,'KeyedProperty',property=prop)
 maxerr=0.;maxjump=0.
 for j,f in enumerate(knots):
  t=f/60;value=float(spline(t))
  if j==len(knots)-1:
   k=el(kp,'KeyFrameDouble',frame=f,value=f'{value:.9g}',interpolationType='linear')
  else:
   nextt=knots[j+1]/60;h=nextt-t
   k=el(kp,'KeyFrameDouble',frame=f,value=f'{value:.9g}',interpolationType='cubicValue')
   el(k,'CubicValueInterpolator',x1=1/3,y1=f'{value+float(spline(t,1))*h/3:.9g}',x2=2/3,y2=f'{float(spline(nextt))-float(spline(nextt,1))*h/3:.9g}')
   ts=np.linspace(t,nextt,17);maxerr=max(maxerr,float(np.max(np.abs(spline(ts)-herm(f,knots[j+1],ts)))))
 # Exact post-10s UI continuation. V4 plateau segments crossing 600 must be constant.
 before=[k for k in old.keys if int(k.get('frame','0'))<=600]
 after=[k for k in old.keys if int(k.get('frame','0'))>600]
 if before:
  prior=before[-1]
  if int(prior.get('frame','0'))==600:
   k.set('interpolationType',prior.get('interpolationType','hold'))
   for child in prior:k.append(copy.deepcopy(child))
  elif after:
   assert abs(float(prior.get('value'))-float(after[0].get('value')))<1e-7,('Nonconstant suffix split',prop)
 for kf in after:kp.append(copy.deepcopy(kf))
 fit_records.append({'object':o.get('id'),'name':o.get('name'),'property':prop,'native_cubic_segments':len(knots)-1,'fit_max_error':maxerr,'tolerance':tolerance})

rigs=[];tables=[];grid=np.linspace(0,10,601)
# The rig is shared by both palettes. Shape time delays are designed before keyframe fitting.
baseline_board=root.find('Artboard');baseline_anim=baseline_board.find('LinearAnimation')
base_heroes=[n for n in baseline_board.findall('Node/Node') if n.get('name','').endswith('continuous morph material')]
for i,hero in enumerate(base_heroes):
 print(f'Building continuous motion rig {i+1}/4',flush=True);rig=Rig(i);rigs.append(rig)
 poses=np.array([rig.pose(t) for t in grid]);raw=np.array([rig.surface(t) for t in grid])
 verts=hero.findall('Shape/PointsPath/CubicDetachedVertex')
 target=np.array([[OldSignal(v,p,baseline_anim).value(600) for p in PROPS] for v in verts])
 blend=q5((grid-9.35)/.65)
 for j in range(8):
  for k in [2,3]:
   # Unwrap the tangent history first, then align equivalent end angles with V4.
   a=np.unwrap(raw[:,j,k]);a-=round((a[-1]-target[j,k])/(2*math.pi))*2*math.pi;raw[:,j,k]=a
 raw=raw*(1-blend[:,None,None])+target[None,:,:]*blend[:,None,None]
 # Position/rotation arrive at the same old UI pose with zero terminal speed.
 poses[-1]=[210,[536,696,856,1016][i],0]
 tables.append((poses,raw,target))
np.savez_compressed(P/'build/rig-samples.npz',times=grid,poses=np.array([x[0] for x in tables]),surfaces=np.array([x[1] for x in tables]))
for b in root.findall('Artboard'):
 anim=b.find('LinearAnimation');anim.set('name','V4.1 organic refinement 16s')
 heroes=[n for n in b.findall('Node/Node') if n.get('name','').endswith('continuous morph material')]
 stage=next(n for n in b.findall('Node') if n.get('name')=='Cinematic stage')
 for i,hero in enumerate(heroes):
  poses,surfaces,target=tables[i];rig=rigs[i]
  for k,p in enumerate(['x','y','rotation']):
   cs=CubicSpline(grid,poses[:,k],bc_type=((1,0),(1,0)))
   patch(hero,p,cs,anim,.08 if k<2 else .0008)
  for j,v in enumerate(hero.findall('Shape/PointsPath/CubicDetachedVertex')):
   for k,p in enumerate(PROPS):
    cs=CubicSpline(grid,surfaces[:,j,k],bc_type=((1,0),(1,0)))
    patch(v,p,cs,anim,.0033 if k in [2,3] else .6)
  # The separated handle is tethered to the leading end before it reaches its UI position.
  handle=next(n for n in stage.findall('Node') if n.get('name')==['공부','기술','문화','취미'][i]+' separated handle')
  hvals=[]
  for ix,t in enumerate(grid):
   head=(surfaces[ix,2,:2]+surfaces[ix,3,:2])/2
   pose=poses[ix];ca,sa=math.cos(pose[2]),math.sin(pose[2]);world=np.array([pose[0]+ca*head[0]-sa*head[1],pose[1]+sa*head[0]+ca*head[1]])
   blendh=float(q5((t-(8.15+.04*i))/(1.5-.04*i)));goal=np.array([540,[536,696,856,1016][i]])
   hvals.append(world*(1-blendh)+goal*blendh)
  hvals=np.array(hvals);hvals[-1]=[540,[536,696,856,1016][i]]
  for j,p in enumerate(['x','y']):patch(handle,p,CubicSpline(grid,hvals[:,j],bc_type=((1,0),(1,0))),anim,.1)
  # Echoes follow the actual refined path, not the old orbit.
  if i==3:
   fragments=[n for n in stage.findall('Node') if n.get('name')=='Gather fragment']
   offsets=[(-90,-100),(100,-80),(-80,70),(80,90)]
   for j,bit in enumerate(fragments):
    for ax,p in enumerate(['x','y']):
     target_old=OldSignal(bit,p,anim).value(600);arr=[]
     for t in grid:
      q=float(q5((t-(.2+j*.08))/(1.95-j*.08)))
      value=rig.path(min(t,2.3))[ax]+offsets[j][ax]*(1-q)
      restore=float(q5((t-2.5)/.8));arr.append(value*(1-restore)+target_old*restore)
     patch(bit,p,CubicSpline(grid,arr,bc_type=((1,0),(1,0))),anim,.15)
  trails=[n for n in stage.findall('Node') if n.get('name')=='Directional echo']
  trail=trails[i]
  for j,p in enumerate(['x','y']):
   arr=np.array([rig.pose(max(0,t-.09))[j] for t in grid]);arr[-1]=OldSignal(trail,p,anim).value(600)
   blendlast=q5((grid-9.4)/.6);arr=arr*(1-blendlast)+OldSignal(trail,p,anim).value(600)*blendlast
   patch(trail,p,CubicSpline(grid,arr,bc_type=((1,0),(1,0))),anim,.2)
E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode');(P/'rive.yaml').write_text('name: intro-v4-1\n')
(P/'motion-curves.json').write_text(json.dumps({'method':'C2 quintic travel -> derivative-matched native cubicValue Hermite segments; delayed tangent-aware surface; damped orientation','duration_unchanged':16,'scene_cuts_unchanged':[0,3,6,10,13,16],'front_to_tail_delay_seconds':[.23,.19,.27,.24],'fit_records':fit_records},ensure_ascii=False,indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — C2 경로·지연 표면·값 베지어 RML 생성. 기존 10–16초 UI/추천/브랜드 키프레임을 연결 보존.\n')
print('V4.1 authored curves:',len(fit_records),'native segments:',sum(x['native_cubic_segments'] for x in fit_records),flush=True)
