"""Three distinct morph phases; same native eight-vertex material as V4.1."""
import math
import numpy as np
from motion_v41 import Rig as LegacyRig, Travel, FREE, ROWS, q5


def pulse(t,start,end):
    return math.sin(math.pi*float(q5((t-start)/(end-start))))**2


class JoinedPath:
    def __init__(self,old,new):self.old,self.new=old,new
    def __call__(self,t,order=0):
        if t<=6:return self.old(t,order)
        if t>=6.5:return self.new(t,order)
        u=(t-6)/.5;g=float(q5(u));gp=30*u*u*(1-u)**2/.5;gpp=60*u*(1-u)*(1-2*u)/.25
        a,b=self.old(t),self.new(t)
        if order==0:return a+g*(b-a)
        av,bv=self.old(t,1),self.new(t,1)
        if order==1:return av+g*(bv-av)+gp*(b-a)
        aa,ba=self.old(t,2),self.new(t,2)
        return aa+g*(ba-aa)+2*gp*(bv-av)+gpp*(b-a)


class Rig:
    def __init__(self,i):
        self.i=i;self.legacy=LegacyRig(i);ry=ROWS[i]
        cluster=[(445,795),(640,815),(460,1020),(635,1000)][i]
        suffix=[(6.78,*cluster),(7.52,[565,550,555,535][i],ry+[5,-5,8,-7][i]),
                (8.24,[430,458,420,443][i],ry+4),(9.02,373,ry-1),(9.5,375,ry),(10,375,ry)]
        self.path=JoinedPath(self.legacy.path,Travel(FREE[i]+suffix,[.83,.74,.88,.77][i]))
    def angle(self,t):
        return float(self.legacy.angle(t))*(1-float(q5((t-6.45)/1.6)))+[-.14,.12,-.06,.1][self.i]*pulse(t,6.25,7.85)
    def offset(self,t):return 165*float(q5((t-6.8)/2.35))
    def pose(self,t):
        if t<=6:return self.legacy.pose(t)
        a=self.angle(t);c=self.path(t);off=self.offset(t)
        return np.array([c[0]-math.cos(a)*off,c[1]-math.sin(a)*off,a])
    def material(self,t):
        if t<=6:return self.legacy.material(t)
        speed=np.linalg.norm(self.path(t,1));i=self.i
        freeL=[118,120,32,100][i]*(1+.22*np.tanh(speed/850))
        freeH=[138,144,168,152][i]/math.sqrt(1+.17*math.tanh(speed/900))
        squeeze=pulse(t,6.12,7.12)
        phase=[0,.09,.05,.16][i]
        spread=float(q5((t-(6.98+phase))/1.17))
        one_pull=[320,275,180,300][i]*pulse(t,6.94+phase,8.28+phase)
        L=freeL*(1-.32*squeeze)*(1-spread)+314*spread+one_pull
        flatten=float(q5((t-(6.95+phase))/1.3))
        H=freeH*(1+.14*squeeze)*(1-flatten)+16*flatten
        cap=[19,26,70,43][i]*(1+.10*squeeze)*(1-flatten)+8*flatten
        return L,H/2,cap
    def surface(self,t):
        if t<=6:return self.legacy.surface(t)
        i=self.i;a=self.angle(t);rot=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])
        lag=[.21,.24,.16,.25][i]*(1-float(q5((t-8.05)/.95)))
        tail=self.material(t-lag);head=self.material(t-.012)
        r0,r1=tail[1],head[1];cap0,cap1=tail[2],head[2]
        # Technology unfolds right-to-left. Other materials have a leading right edge.
        if i==1:r0,r1,cap0,cap1=r1,r0,cap1,cap0
        hist=rot.T@(self.path(max(0,t-lag))-self.path(t));L=(tail[0]+head[0])/2
        gate=1-float(q5((t-7.9)/.7));off=self.offset(t)
        tx=.12*L*math.tanh(hist[0]/max(1,.12*L))*gate
        ty=.045*L*math.tanh(hist[1]/max(1,.045*L))*gate
        xs=off-tail[0]/2+tx;xe=off+head[0]/2;dx=xe-xs
        ph=[0,.09,.05,.16][i];beat=pulse(t,6.92+ph,8.08+ph)
        A=[145,-95,0,160][i]*beat*gate
        B=[350,0,0,-260][i]*beat*gate
        norm=2*math.sqrt(A*A+1e-8)+6*math.sqrt(B*B+1e-8)
        budget=.32*dx*dx/(math.sqrt(r0*r0+r1*r1)+4)
        v=norm/max(1e-6,budget);saturation=math.tanh(v)/v;A*=saturation;B*=saturation
        def center(u):return np.array([xs+dx*u,ty*(1-u)+A*u*(1-u)+B*u*(1-u)*(2*u-1)])
        def data(u):
            d=np.array([dx,-ty+A*(1-2*u)+B*(-6*u*u+6*u-1)])
            dd=np.array([0.,-2*A+B*(-12*u+6)])
            length=np.linalg.norm(d);T=d/length;Tp=(dd-T*np.dot(T,dd))/length
            N=np.array([-T[1],T[0]]);Np=np.array([-Tp[1],Tp[0]])
            r=r0+(r1-r0)*float(q5(u));rp=(r1-r0)*30*u*u*(1-u)**2
            return T,N,d,Np,r,rp
        def deriv(u,side):
            T,N,d,Np,r,rp=data(u);return d+side*(Np*r+N*rp)
        c0,c1=center(0),center(1);T0,N0,*_=data(0);T1,N1,*_=data(1);k=.5522847498
        points=[c0-N0*r0,c1-N1*r1,c1+T1*cap1,c1+T1*cap1,c1+N1*r1,c0+N0*r0,c0-T0*cap0,c0-T0*cap0]
        ih=[-T0*k*cap0,-deriv(1,-1)/3,-N1*k*r1,np.zeros(2),T1*k*cap1,deriv(0,1)/3,N0*k*r0,np.zeros(2)]
        oh=[deriv(0,-1)/3,T1*k*cap1,np.zeros(2),N1*k*r1,-deriv(1,1)/3,-T0*k*cap0,np.zeros(2),-N0*k*r0]
        out=np.zeros((8,6))
        for j in range(8):
            out[j,:2]=points[j]
            out[j,2]=math.atan2(ih[j][1],ih[j][0]);out[j,3]=math.atan2(oh[j][1],oh[j][0])
            out[j,4]=np.linalg.norm(ih[j]);out[j,5]=np.linalg.norm(oh[j])
        return out
