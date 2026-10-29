"""Continuous V4.1 motion rig: C2 quintic travel, causal response, delayed tube surface.
Coordinates are native 1080x1920 units. No app state or renderer is accessed here.
"""
import math
import numpy as np
from scipy.interpolate import CubicSpline


def q5(x):
    x=np.clip(x,0.,1.)
    return x*x*x*(10+x*(-15+6*x))


class Travel:
    """Piecewise quintic Hermite path with shared velocity and acceleration at joins."""
    def __init__(self, knots, strength=.78):
        a=np.asarray(knots,float);self.t=a[:,0];p=a[:,1:];n=len(a)
        v=np.zeros_like(p);acc=np.zeros_like(p)
        for j in range(1,n-1):
            lo,hi=self.t[j]-self.t[j-1],self.t[j+1]-self.t[j]
            v[j]=strength*(p[j+1]-p[j-1])/(lo+hi)
            acc[j]=.45*2*((p[j+1]-p[j])/hi-(p[j]-p[j-1])/lo)/(hi+lo)
        self.co=[]
        for j in range(n-1):
            h=self.t[j+1]-self.t[j];c0=p[j];c1=v[j]*h;c2=acc[j]*h*h/2
            A=p[j+1]-c0-c1-c2;B=v[j+1]*h-c1-2*c2;C=acc[j+1]*h*h-2*c2
            self.co.append(np.array([c0,c1,c2,10*A-4*B+C/2,-15*A+7*B-C,6*A-3*B+C/2]))
    def __call__(self,t,order=0):
        t=float(np.clip(t,self.t[0],self.t[-1]));j=int(np.clip(np.searchsorted(self.t,t,side='right')-1,0,len(self.co)-1))
        h=self.t[j+1]-self.t[j];u=(t-self.t[j])/h;c=self.co[j]
        if order==0:return sum(c[k]*u**k for k in range(6))
        if order==1:return sum(k*c[k]*u**(k-1) for k in range(1,6))/h
        return sum(k*(k-1)*c[k]*u**(k-2) for k in range(2,6))/(h*h)


FREE=[
 [(0,190,400),(.8,760,510),(1.85,490,1180),(2.8,250,1010),(3.55,780,700),(4.5,610,1450),(5.3,260,1000),(6,610,760)],
 [(0,830,430),(1.15,640,1220),(2.1,240,880),(3.05,720,470),(3.85,840,1200),(4.7,380,1410),(5.4,570,680),(6,760,1050)],
 [(0,730,1480),(1.0,280,1230),(2.2,570,470),(3.2,840,750),(4.05,340,1190),(4.95,250,650),(5.55,800,640),(6,460,1200)],
 [(0,250,1420),(1.25,680,1250),(2.5,820,640),(3.3,300,500),(4.25,680,1000),(5.0,810,1410),(5.6,310,1160),(6,330,700)],
]
ROWS=[536,696,856,1016]


class Rig:
    def __init__(self,i):
        self.i=i;ry=ROWS[i]
        suffix=[(6.6,[625,440,610,450][i],ry+[20,110,180,190][i]),(7.45,548,ry-10),
                (8.35,480,ry+6),(9.1,386,ry-3),(9.55,373,ry+1),(10,375,ry)]
        self.path=Travel(FREE[i]+suffix,[.83,.74,.88,.77][i])
        # A restrained damped second-order orientation response, integrated at 240 Hz.
        grid=np.linspace(0,10,2401);y=0.;v=0.;angles=[]
        for t in grid:
            vel=self.path(t,1);acc=self.path(t,2)
            target=.42*np.tanh(vel[1]/750)*np.tanh(vel[0]/300)+.045*np.tanh(acc[0]/1800)
            omega=[13,11,14,10][i];zeta=[.96,.9,1.0,.94][i]
            v+=(omega*omega*(target-y)-2*zeta*omega*v)/240;y+=v/240
            angles.append(y*(1-q5((t-8.0)/1.8)))
        self.angle=CubicSpline(grid,angles,bc_type=((1,0),(1,0)))
    def velocity(self,t):return self.path(max(0,min(10,t)),1)
    def offset(self,t):return 165*float(q5((t-6)/3.55))
    def pose(self,t):
        t=max(0,min(10,float(t)));a=float(self.angle(t));c=self.path(t)
        off=self.offset(t);return np.array([c[0]-math.cos(a)*off,c[1]-math.sin(a)*off,a])
    def material(self,t):
        t=max(0,min(10,float(t)));speed=np.linalg.norm(self.velocity(t))
        freeL=[118,120,32,100][self.i]*(1+.22*np.tanh(speed/850))
        freeH=[138,144,168,152][self.i]/math.sqrt(1+.17*math.tanh(speed/900))
        q=float(q5((t-6)/3.55));flat=float(q5((t-6.25)/3.0))
        pull=355*math.exp(-((t-(7.55+.035*self.i))/.72)**2)*float(q5((t-5.9)/.6))*(1-float(q5((t-8.65)/.7)))
        L=freeL*(1-q)+314*q+pull
        H=freeH*(1-flat)+16*flat
        cap=[19,26,70,43][self.i]*(1-flat)+8*flat
        return L,H/2,cap
    def surface(self,t):
        """Tangent-aware offset of a causal cubic centerline; curvature-radius bounded."""
        t=float(np.clip(t,0,10));a=float(self.angle(t));rot=np.array([[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]])
        lag=[.23,.19,.27,.24][self.i]*(1-float(q5((t-9.35)/.5)))
        tail=self.material(t-lag);head=self.material(t-.015)
        r0,r1=tail[1],head[1];cap0,cap1=tail[2],head[2];off=self.offset(t)
        hist=rot.T@(self.path(max(0,t-lag))-self.path(t));L=(tail[0]+head[0])/2
        gate=1-float(q5((t-9.05)/.5))
        tailX=.15*L*math.tanh(hist[0]/max(1,.15*L))*gate
        tailY=.04*L*math.tanh(hist[1]/max(1,.04*L))*gate
        xs=off-tail[0]/2+tailX;xe=off+head[0]/2;dx=xe-xs
        phase=[0,.10,.05,.18][self.i]
        lead=math.exp(-((t-(7.06+phase))/.5)**2);follow=math.exp(-((t-(7.63+phase))/.57)**2)
        late=math.exp(-((t-(8.25+phase/2))/.32)**2)
        A=([135,-190,95,165][self.i]*(.5*lead+follow)-[40,-30,25,40][self.i]*late)*gate
        B=[620,390,-650,510][self.i]*(lead-.85*follow)*gate
        # Convex curvature bound: kappa*r <= (2|A|+6|B|)*r/dx^2.
        # Smooth saturation avoids hard velocity/shape clamps at the bound.
        norm=2*math.sqrt(A*A+1e-8)+6*math.sqrt(B*B+1e-8)
        budget=.32*dx*dx/(math.sqrt(r0*r0+r1*r1)+4)
        saturation=math.tanh(norm/max(1e-6,budget))/(norm/max(1e-6,budget))
        A*=saturation;B*=saturation
        def center(u):return np.array([xs+dx*u,tailY*(1-u)+A*u*(1-u)+B*u*(1-u)*(2*u-1)])
        def data(u):
            d=np.array([dx,-tailY+A*(1-2*u)+B*(-6*u*u+6*u-1)])
            dd=np.array([0.,-2*A+B*(-12*u+6)])
            length=np.linalg.norm(d);T=d/length;Tp=(dd-T*np.dot(T,dd))/length
            N=np.array([-T[1],T[0]]);Np=np.array([-Tp[1],Tp[0]])
            r=r0+(r1-r0)*float(q5(u));rp=(r1-r0)*30*u*u*(1-u)*(1-u)
            return T,N,d,Np,r,rp
        def derivative(u,side):
            T,N,d,Np,r,rp=data(u);return d+side*(Np*r+N*rp)
        c0,c1=center(0),center(1);T0,N0,*_=data(0);T1,N1,*_=data(1);k=.5522847498
        points=[c0-N0*r0,c1-N1*r1,c1+T1*cap1,c1+T1*cap1,c1+N1*r1,c0+N0*r0,c0-T0*cap0,c0-T0*cap0]
        ih=[-T0*k*cap0,-derivative(1,-1)/3,-N1*k*r1,np.zeros(2),T1*k*cap1,derivative(0,1)/3,N0*k*r0,np.zeros(2)]
        oh=[derivative(0,-1)/3,T1*k*cap1,np.zeros(2),N1*k*r1,-derivative(1,1)/3,-T0*k*cap0,np.zeros(2),-N0*k*r0]
        out=np.zeros((8,6))
        for j in range(8):
            out[j,:2]=points[j];out[j,2]=math.atan2(ih[j][1],ih[j][0]);out[j,3]=math.atan2(oh[j][1],oh[j][0]);out[j,4]=np.linalg.norm(ih[j]);out[j,5]=np.linalg.norm(oh[j])
        return out
