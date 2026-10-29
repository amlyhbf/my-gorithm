"""Read-only numeric RML signal evaluator used by V4.1 verification."""
import math
import numpy as np
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
