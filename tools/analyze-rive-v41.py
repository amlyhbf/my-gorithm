#!/usr/bin/env python3
"""Analyze exported native RML curves and actual cubic outlines; never writes app files."""
from pathlib import Path
import json,math,xml.etree.ElementTree as E
import numpy as np
import os
os.environ.setdefault('MPLCONFIGDIR',str(Path(__file__).resolve().parent.parent/'.rive-tools/mpl'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-1';V=P/'preview'

class Signal:
 def __init__(self,obj,prop,anim):
  self.const=float(obj.get(prop,0));ko=next((k for k in anim.findall('KeyedObject') if k.get('objectId')==obj.get('id') and k.find('KeyedProperty').get('property')==prop),None)
  ks=[] if ko is None else ko.findall('KeyedProperty/KeyFrameDouble');self.frames=np.array([int(k.get('frame','0')) for k in ks]);self.v=np.array([float(k.get('value')) for k in ks]);self.seg=[]
  for k in ks:
   child=next(iter(k),None);kind=k.get('interpolationType','hold')
   if child is None:self.seg.append((kind,None))
   else:self.seg.append((child.tag,[float(child.get(n,d)) for n,d in [('x1','.42'),('y1','0'),('x2','.58'),('y2','1')]]))
 def at(self,f,derivative=False):
  if len(self.frames)==0:return 0. if derivative else self.const
  if f<self.frames[0]:return 0. if derivative else self.v[0]
  if f>=self.frames[-1]:return 0. if derivative else self.v[-1]
  j=int(np.searchsorted(self.frames,f,side='right')-1);a,b=self.frames[j:j+2];va,vb=self.v[j:j+2];u=(f-a)/(b-a);kind,c=self.seg[j]
  if kind=='hold':return 0. if derivative else va
  if c is None:return (vb-va)/(b-a)*60 if derivative else va+(vb-va)*u
  x1,y1,x2,y2=c
  if abs(x1-1/3)>1e-9 or abs(x2-2/3)>1e-9:
   lo,hi=0.,1.;target=u
   for _ in range(28):
    u=(lo+hi)/2;x=3*(1-u)**2*u*x1+3*(1-u)*u*u*x2+u**3
    if x<target:lo=u
    else:hi=u
   u=(lo+hi)/2
  if kind=='CubicValueInterpolator':
   if derivative:
    dy=3*(1-u)**2*(y1-va)+6*(1-u)*u*(y2-y1)+3*u*u*(vb-y2)
   else:return (1-u)**3*va+3*(1-u)**2*u*y1+3*(1-u)*u*u*y2+u**3*vb
  else:
   if derivative:dy=(vb-va)*(3*(1-u)**2*y1+6*(1-u)*u*(y2-y1)+3*u*u*(1-y2))
   else:return va+(vb-va)*(3*(1-u)**2*u*y1+3*(1-u)*u*u*y2+u**3)
  dx=3*(1-u)**2*x1+6*(1-u)*u*(x2-x1)+3*u*u*(1-x2)
  return dy/max(1e-12,dx)/(b-a)*60

def load(path):
 r=E.parse(path).getroot();b=r.find('Artboard');a=b.find('LinearAnimation');h=[n for n in b.findall('Node/Node') if n.get('name','').endswith('continuous morph material')]
 return b,a,h

def outline(v):
 points=[];u=np.linspace(0,1,13)[:-1,None]
 for i in range(8):
  j=(i+1)%8;p=v[i,:2];q=v[j,:2]
  c=p+np.array([math.cos(v[i,3]),math.sin(v[i,3])])*v[i,5]
  d=q+np.array([math.cos(v[j,2]),math.sin(v[j,2])])*v[j,4]
  part=(1-u)**3*p+3*(1-u)**2*u*c+3*(1-u)*u*u*d+u**3*q
  points.extend(part)
 pts=np.array(points);keep=np.linalg.norm(pts-np.roll(pts,1,axis=0),axis=1)>1e-5
 return pts[keep]

def crossings(p):
 a=p;b=np.roll(p,-1,axis=0);n=len(p);ii,jj=np.triu_indices(n,k=2);good=~((ii==0)&(jj==n-1));ii,jj=ii[good],jj[good]
 A,B,C,D=a[ii],b[ii],a[jj],b[jj]
 def cr(x,y):return x[:,0]*y[:,1]-x[:,1]*y[:,0]
 q1=cr(B-A,C-A);q2=cr(B-A,D-A);q3=cr(D-C,A-C);q4=cr(D-C,B-C)
 return int(np.count_nonzero((q1*q2<-1e-7)&(q3*q4<-1e-7)))

old=load(R/'animation/intro-v4/scene.rml');new=load(P/'scene.rml');report={'method':'Derivatives from exported native RML, topology from flattened native cubic contours','velocity':[],'geometry':{}}
plt.rcParams.update({'font.size':9});fig,axes=plt.subplots(4,2,figsize=(11,12),layout='constrained')
for i,name in enumerate(['Study','Tech','Culture','Hobby']):
 results=[]
 for label,(b,a,h) in [('V4',old),('V4.1',new)]:
  sx,sy=Signal(h[i],'x',a),Signal(h[i],'y',a);ts=np.linspace(0,360,721)
  pos=np.array([[sx.at(f),sy.at(f)] for f in ts]);vel=np.array([[sx.at(f,True),sy.at(f,True)] for f in ts])
  knots=sorted(set(int(f) for f in list(sx.frames)+list(sy.frames) if 0<f<360));jumps=[]
  for f in knots:
   before=np.array([sx.at(f-1e-7,True),sy.at(f-1e-7,True)]);after=np.array([sx.at(f+1e-7,True),sy.at(f+1e-7,True)]);jumps.append(np.linalg.norm(after-before))
  results.append({'version':label,'join_count':len(knots),'max_join_speed_jump_px_s':float(max(jumps,default=0)),'peak_speed_px_s':float(np.linalg.norm(vel,axis=1).max())})
  axes[i,0].plot(pos[:,0],pos[:,1],label=label,alpha=.85);axes[i,1].plot(ts/60,np.linalg.norm(vel,axis=1),label=label,alpha=.85)
 report['velocity'].append({'hero':name,'results':results});axes[i,0].set_title(name+' path / 0-6s');axes[i,0].invert_yaxis();axes[i,0].set_aspect('equal',adjustable='datalim');axes[i,1].set_title(name+' native speed / px per second');axes[i,1].set_xlabel('seconds');axes[i,0].legend();axes[i,1].legend()
fig.savefig(V/'motion-curves-comparison.png',dpi=150);plt.close(fig)
b,a,h=new;stage=next(n for n in b.findall('Node') if n.get('name')=='Cinematic stage');stagex=Signal(stage,'x',a);stagey=Signal(stage,'y',a)
props=['x','y','inRotation','outRotation','inDistance','outDistance'];fail=[];bounds=[];max_angle=0.
for i,hero in enumerate(h):
 vs=hero.findall('Shape/PointsPath/CubicDetachedVertex');signals=[[Signal(v,p,a) for p in props] for v in vs];sx,sy,sr=[Signal(hero,p,a) for p in ['x','y','rotation']];opacity=Signal(hero,'opacity',a)
 for frame in range(0,601):
  verts=np.array([[s.at(frame) for s in row] for row in signals]);poly=outline(verts);n=crossings(poly)
  if n:fail.append({'hero':i,'frame':frame,'crossings':n})
  for v in verts:
   if min(v[4:])>1e-4:
    angle=abs(math.atan2(math.sin(v[3]-v[2]-math.pi),math.cos(v[3]-v[2]-math.pi)));max_angle=max(max_angle,angle)
  if opacity.at(frame)>.01:
   rot=sr.at(frame);M=np.array([[math.cos(rot),-math.sin(rot)],[math.sin(rot),math.cos(rot)]])
   world=poly@M.T+np.array([sx.at(frame)+stagex.at(frame),sy.at(frame)+stagey.at(frame)])
   bounds.append((world[:,0].min(),world[:,1].min(),world[:,0].max(),world[:,1].max()))
report['geometry']={'poses_checked':4*601,'self_intersection_poses':len(fail),'first_failures':fail[:12],'max_tangent_mismatch_deg':max_angle*180/math.pi,'visible_bounds_scope':'All sampled 0..10s hero contours with opacity > 0.01; not text or glow bounds','visible_path_bounds':[float(np.min(np.array(bounds)[:,0])),float(np.min(np.array(bounds)[:,1])),float(np.max(np.array(bounds)[:,2])),float(np.max(np.array(bounds)[:,3]))]}
fits=json.loads((P/'motion-curves.json').read_text())['fit_records']
report['fit']={'sampling':'17-point per-segment check after 9-point adaptive fitting; measured error, not an exact global bound','max_absolute_error_px_or_property_units':max(x['fit_max_error'] for x in fits),'by_property':{p:max(x['fit_max_error'] for x in fits if x['property']==p) for p in sorted(set(x['property'] for x in fits))},'above_nominal_search_target_count':sum(x['fit_max_error']>x['tolerance'] for x in fits)}
(V/'motion-analysis.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
