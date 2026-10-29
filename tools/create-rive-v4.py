#!/usr/bin/env python3
"""Native Rive cinematic V4. No changes to application code or external writes."""
from pathlib import Path
import sys,json,re,math,subprocess,shutil,xml.etree.ElementTree as E
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4'
sys.path.insert(0,str(R/'.rive-tools/python'))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
css=(R/'style.css').read_text()
def tokens(selector):return dict(re.findall(r'--([\w-]+):\s*(#[\da-fA-F]{6});',re.search(selector+r'\s*\{(.*?)\}',css,re.S).group(1)))
light=tokens(':root');dark={**light,**tokens(r'body\.dark-mode')}
meta=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {CATEGORY_META} from './data.js'; console.log(JSON.stringify(CATEGORY_META))"],cwd=R,text=True));cats=list(meta)
def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)
def weights(f):
 vals=[]
 for start,end,v in [(600,684,100),(648,738,30),(690,774,20),(600,774,50)]:
  x=50+(v-50)*smooth((f-start)/(end-start));vals.append(5*math.floor(x/5+.5))
 return vals
frames=[0]+[f for f in range(600,781) if f==600 or weights(f)!=weights(f-1)]
js="""
const fs=require('fs'),vm=require('vm'); const {CONTENT_DATA}=await import('./data.js');const src=fs.readFileSync('script.js','utf8');let code=src.slice(src.indexOf('function calculateAllocation()'),src.indexOf('function renderAllViews('));let states=JSON.parse(fs.readFileSync(0,'utf8'));for(let s of states){let ctx={CONTENT_DATA,state:{weights:Object.fromEntries(['study','tech','culture','hobby'].map((n,i)=>[n,s.weights[i]])),feedSize:12,contentType:'all',shuffleSeed:0}};vm.createContext(ctx);vm.runInContext(code,ctx);const a=ctx.calculateAllocation();s.categories=a.categories;s.feed=ctx.buildFeedList(a).map(x=>({id:x.id,category:x.category,title:x.title}));}console.log(JSON.stringify(states));
"""
states=json.loads(subprocess.check_output(['node','--input-type=module','-e',js.replace("const fs=require('fs'),vm=require('vm');","import fs from 'node:fs';import vm from 'node:vm';")],input=json.dumps([{'frame':f,'weights':weights(f)} for f in frames]),cwd=R,text=True))
(P/'logic-snapshots.json').write_text(json.dumps(states,ensure_ascii=False,indent=2)+'\n')
words='내맘대로 알고리즘 나의 관심이 나의 기준 관심도가 추천을 바꿔요 추천 12장 공부 기술 문화 취미 피드 제외 0123456789%()→·장'
for w in [600,800]:
 f=TTFont(R/'animation/intro-v3/assets/PretendardVariable.woff2');f=instantiateVariableFont(f,{'wght':w},inplace=True);s=subset.Subsetter();s.populate(text=words);s.subset(f);f.flavor=None;f.save(P/f'Pretendard-{w}.ttf')
shutil.copy(R/'animation/intro-v3/assets/Pretendard-LICENSE.txt',P/'FONT-LICENSE.txt')
root=E.Element('Rive',version='1',kind='fragment');serial=10

def el(p,tag,**a):
 global serial
 a={k:str(v) for k,v in a.items()};a.setdefault('id',f'0:{serial}');serial+=1
 return E.SubElement(p,tag,a)
fonts={w:el(root,'FontAsset',name=f'Pretendard {w}',file=f'Pretendard-{w}.ttf').get('id') for w in [600,800]}

def board(theme):
 c=dark if theme=='Dark' else light
 def col(k):return 'FF'+c[k][1:]
 b=el(root,'Artboard',name=theme,width=1080,height=1920,x=0 if theme=='Dark' else 1260,y=0)
 sty=el(b,'LayoutComponentStyle');b.set('styleId',sty.get('id'));f=el(b,'Fill');el(f,'SolidColor',colorValue=col('bg-page'))
 anim=el(b,'LinearAnimation',name='Chaos to my algorithm 16s',fps=60,duration=960,loopValue='oneShot')
 def key(o,prop,vs,kind='double',ease='smooth'):
  # Remove redundant authored keys without changing interpolation or held states.
  if all(v==vs[0][1] for _,v in vs):
   o.set(prop,str(vs[0][1]));return
  held=kind in ('string','id') or ease=='hold'
  if held:vs=[v for j,v in enumerate(vs) if j==0 or v[1]!=vs[j-1][1]]
  else:vs=[v for j,v in enumerate(vs) if j==0 or j==len(vs)-1 or not(vs[j-1][1]==v[1]==vs[j+1][1])]
  ko=el(anim,'KeyedObject',objectId=o.get('id'));kp=el(ko,'KeyedProperty',property=prop)
  for frame,value in vs:
   attrs=dict(frame=round(frame),value=value if kind!='double' else round(value,5),interpolationType='hold' if kind in ('string','id') or ease=='hold' else ('linear' if ease=='linear' else 'cubic'))
   k=el(kp,{'double':'KeyFrameDouble','color':'KeyFrameColor','string':'KeyFrameString','id':'KeyFrameId'}[kind],**attrs)
   if attrs['interpolationType']=='cubic':el(k,'CubicEaseInterpolator',x1=.42,y1=0,x2=.58,y2=1)
 def node(p,name,opacity=1):return el(p,'Node',name=name,opacity=opacity)
 def text(p,s,x,y,size=44,token='text-main',weight=600):
  n=el(p,'Text',name=s,x=x,y=y,originX=.5,originY=.5,sizingValue='autoWidth');st=el(n,'TextStylePaint',fontAssetId=fonts[weight],fontSize=size);f=el(st,'Fill');el(f,'SolidColor',colorValue=col(token));run=el(n,'TextValueRun',text=s,styleId=st.get('id'));return n,run
 def rect(p,name,x,y,w,h,r,color,outline=None,ellipse=False):
  sh=el(p,'Shape',name=name,x=x,y=y);pa=el(sh,'Ellipse' if ellipse else 'Rectangle',width=w,height=h,**({} if ellipse else {'cornerRadiusTL':r}));f=el(sh,'Fill');paint=el(f,'SolidColor',colorValue=color)
  if outline:
   st=el(sh,'Stroke',thickness=2);el(st,'SolidColor',colorValue=outline)
  return sh,pa,paint
 def stroke(p,name,pts,color,width=4):
  sh=el(p,'Shape',name=name);pa=el(sh,'PointsPath',isClosed='false')
  for x,y in pts:el(pa,'StraightVertex',x=x,y=y)
  st=el(sh,'Stroke',thickness=width,cap='round',join='round');el(st,'SolidColor',colorValue=color);return sh,st
 def glow(p,name,x,y,w,h,color):
  sh=el(p,'Shape',name=name,x=x,y=y);el(sh,'Ellipse',width=w,height=h);f=el(sh,'Fill');g=el(f,'RadialGradient',startX=0,startY=0,endX=w/2,endY=0);el(g,'GradientStop',position=0,colorValue='20'+color[-6:]);el(g,'GradientStop',position=.4,colorValue='0C'+color[-6:]);el(g,'GradientStop',position=1,colorValue='00'+color[-6:]);return sh
 # Brand finale sits above the continuously retained UI.
 brand=node(b,'Brand finale',0);key(brand,'opacity',[(0,0),(794,0),(830,1)])
 text(brand,'내맘대로 알고리즘',540,660,82,weight=800);text(brand,'나의 관심이 나의 기준',540,770,48,token='text-muted')
 key(brand,'y',[(0,32),(794,32),(830,0)])
 stage=node(b,'Cinematic stage');key(stage,'x',[(0,0),(180,-16),(270,16),(360,0),(780,0),(840,97.2)])
 key(stage,'y',[(0,0),(180,-18),(300,14),(360,0),(780,0),(840,550)])
 for prop in ['scaleX','scaleY']:key(stage,prop,[(0,1),(780,1),(840,.82)])
 # UI detail lives in front of the same morphing colored material.
 labels=node(stage,'Actual service controls',0);key(labels,'opacity',[(0,0),(504,0),(566,1)])
 heading=node(stage,'Control heading',0);key(heading,'opacity',[(0,0),(550,0),(590,1),(790,1),(830,0)])
 text(heading,'관심도가 추천을 바꿔요',540,310,54,weight=800)
 left=210;tw=660;rowys=[520,680,840,1000]
 for i,(cat,m) in enumerate(meta.items()):
  color='FF'+m['color'][1:];ry=rowys[i]
  # Data label: independent setting value, not normalized allocation.
  text(labels,m['name'],264,ry-36,44,weight=800)
  _,run=text(labels,'50% (피드 25%)',740,ry-36,34,weight=800)
  key(run,'text',[(s['frame'],f"{s['weights'][i]}% (피드 {s['categories'][cat]['displayPct']}%)") for s in states],kind='string')
  for j in range(5):
   n,_=text(labels,'0%(제외)' if j==0 else f'{j*25}%',left+tw*j/4,ry+62,29,token='text-muted')
   if j in (0,4):n.set('originX','0' if j==0 else '1')
 # Recommendation output: exactly the actual buildFeedList order, not an invented algorithm.
 feed=node(stage,'Actual twelve-card recommendation',0);key(feed,'opacity',[(0,0),(566,0),(602,1),(791,1),(840,0)])
 text(feed,'추천 12장',540,1164,42,weight=800)
 for slot in range(12):
  x=250+(slot%3)*290;y=1245+(slot//3)*108
  g=node(feed,f'Recommendation slot {slot+1}');g.set('x',str(x));g.set('y',str(y))
  _,run=text(g,meta[states[0]['feed'][slot]['category']]['name'],0,0,36,weight=800)
  key(run,'text',[(s['frame'],meta[s['feed'][slot]['category']]['name']) for s in states],kind='string')
  mark,_,paint=rect(g,'Category stripe',-103,0,7,48,3,'FF'+meta[states[0]['feed'][slot]['category']]['color'][1:])
  key(paint,'colorValue',[(s['frame'],'FF'+meta[s['feed'][slot]['category']]['color'][1:]) for s in states],kind='color',ease='hold')
  rect(g,'Recommendation card',0,0,258,88,18,col('bg-card'),col('border-color'))
  changes=[s['frame'] for prev,s in zip(states,states[1:]) if prev['feed'][slot]['id']!=s['feed'][slot]['id']]
  # One short native layout pulse for the replacement, no flashes or unrelated particles.
  if changes:
   vals=[(0,1)]
   for f in changes:
    if f<vals[-1][0]+10:continue
    vals.extend([(f,1),(f+3,.95),(f+8,1)])
   key(g,'scaleX',vals)
 # The four hero paths remain visible as the four final colored tracks.
 for i,(cat,m) in enumerate(meta.items()):
  color='FF'+m['color'][1:];phi=i*math.pi/2
  def orbit(t):return 540+326*math.sin(2.2*t+phi),930+470*math.cos(1.65*t+phi)
  start=[(150,380),(850,450),(700,1510),(240,1430)][i];target=orbit(0)
  def pos(f):
   t=f/60
   if t<=3:
    q=smooth(t/3);return start[0]+(target[0]-start[0])*q+70*math.sin(t*2+i)*math.sin(math.pi*t/3),start[1]+(target[1]-start[1])*q
   if t<=6:return orbit(t-3)
   end=orbit(3);q=smooth((t-6)/3)
   x=end[0]+(left-end[0])*q
   envelope=[(360,240,0),(390,330,0),(420,530,0),(450,650,100),(480,500,145),(510,390,165),(540,330,165)]
   w,off=330,165
   for (a,wa,oa),(z,wz,oz) in zip(envelope,envelope[1:]):
    if a<=f<=z:
     u=(f-a)/(z-a);w=wa+(wz-wa)*u;off=oa+(oz-oa)*u;break
   x=max(80+w/2-off,min(1000-w/2-off,x))
   return x,end[1]+(rowys[i]+16-end[1])*q
  hero=node(stage,m['name']+' continuous morph material',0)
  key(hero,'opacity',[(0,0),(i*12,0),(i*12+30,1)])
  motion=list(range(0,361,12))+[390,420,450,480,510,540]
  for axis,index in [('x',0),('y',1)]:key(hero,axis,[(f,pos(f)[index]) for f in motion],ease='linear')
  key(hero,'rotation',[(0,[-.3,.7,-.2,.2][i]),(90,.2+i*.25),(180,[-.3,1.8,.45,-.5][i]),(260,[.5,3,.2,.7][i]),(360,[0,3.4,-.4,.2][i]),(435,[-.12,.12,-.08,.08][i]),(540,0)])
  # Shapes are genuine closed eight-vertex cubic paths, not a swapped Rectangle.
  sh=el(hero,'Shape',name=m['name']+' vector path');pa=el(sh,'PointsPath',isClosed='true')
  verts=[el(pa,'CubicDetachedVertex',name=f'Morph vertex {j}') for j in range(8)]
  f=el(sh,'Fill');el(f,'SolidColor',colorValue=color)
  def geometry(frame):
   if frame<360:
    u=frame/60
    w=180+65*math.sin(u*2.5+i);h=170+60*math.cos(u*2+i)
    if i==0:w+=100*math.sin(u*1.8);h*=.72
    if i==1:w,h=h,w
    rr=min(w,h)*([.16,.23,.5,.38][i]);wave=18*math.sin(u*2+i)
    return w,h,rr,0,wave
   stages=[(360,240,190,65,0,24),(390,330,120,50,0,35),(420,530,90,42,0,65),(450,650,55,27,100,48),(480,500,38,19,145,23),(510,390,22,11,165,7),(540,330,16,8,165,0)]
   return min(stages,key=lambda v:abs(v[0]-frame))[1:]
  def capsule(w,h,r,offset,wave):
   r=min(r,w/2,h/2);k=.55228475*r
   p=[(-w/2+r,-h/2),(w/2-r,-h/2),(w/2,-h/2+r),(w/2,h/2-r),(w/2-r,h/2),(-w/2+r,h/2),(-w/2,h/2-r),(-w/2,-h/2+r)]
   ins=[math.pi,math.pi,-math.pi/2,-math.pi/2,0,0,math.pi/2,math.pi/2]
   outs=[0,0,math.pi/2,math.pi/2,math.pi,math.pi,-math.pi/2,-math.pi/2]
   points=[dict(x=x+offset,y=y+wave*.25*math.sin((x/w+.5)*math.pi*2+i*.3),inRotation=ins[j],outRotation=outs[j],inDistance=k if j%2==0 else 0,outDistance=k if j%2 else 0) for j,(x,y) in enumerate(p)]
   # Long edges carry real cubic S-bends, not only displaced corner vertices.
   span=max(0,w-2*r);reach=min(w*.3,span/2);amp=wave*4*min(1,span/max(1,w*.7));angle=math.atan2(amp,reach);dist=math.hypot(reach,amp)
   points[0].update(outRotation=angle,outDistance=dist)
   points[1].update(inRotation=math.pi+angle,inDistance=dist)
   points[4].update(outRotation=math.pi+angle,outDistance=dist)
   points[5].update(inRotation=angle,inDistance=dist)
   return points
  shape_frames=[0,40,90,135,180,225,270,315,360,390,420,450,480,510,540]
  shapevals={f:capsule(*geometry(f)) for f in shape_frames}
  # After the morph, the same vertices follow native independent weights.
  for s in states:
   if s['frame']>=600:shapevals[s['frame']]=capsule(tw*s['weights'][i]/100,16,8,tw*s['weights'][i]/200,0)
  for j,v in enumerate(verts):
   for prop in ['x','y','inRotation','outRotation','inDistance','outDistance']:
    vals=[(f,ps[j][prop]) for f,ps in sorted(shapevals.items())]
    key(v,prop,vals,ease='linear')
  # Category word follows the material, then yields to the actual row name.
  tag=node(hero,'Category identity');text(tag,m['name'],0,0,42,token='primary-text',weight=800)
  # Website dark primary-text is dark, so colored shapes use the actual white thumb RGB in both themes.
  for sc in tag.iter('SolidColor'):sc.set('colorValue','FFFFFFFF')
  key(tag,'opacity',[(0,0),(34+i*12,0),(60+i*12,1),(353,1),(425,0)]);hero.remove(tag);hero.insert(0,tag)
  # A visible fragment separates from the hero and becomes the circular thumb.
  thumb=node(stage,m['name']+' separated handle',0)
  key(thumb,'opacity',[(0,0),(426+i*4,0),(444+i*4,1)])
  thumbshape,_,thumbpaint=rect(thumb,'Round white thumb',0,0,52,52,26,color,color,ellipse=True)
  thumbshape.find('Stroke').set('thickness','7')
  key(thumbpaint,'colorValue',[(0,color),(435,color),(528,'FFFFFFFF')],kind='color',ease='linear')
  for axis,ind in [('x',0),('y',1)]:
   end=540 if axis=='x' else rowys[i]+16
   vals=[(0,pos(426)[ind]),(426,pos(426)[ind]),(480,(end+pos(426)[ind])/2),(540,end)]
   if axis=='x':vals.extend((s['frame'],left+tw*s['weights'][i]/100) for s in states if s['frame']>=600)
   key(thumb,axis,vals)
  for prop in ['scaleX','scaleY']:key(thumb,prop,[(0,.25),(426,.25),(528,1)])
  # Small gather fragments are reserved for hobby's birth; they join the hero rather than glitter forever.
  if i==3:
   for j in range(4):
    bit=node(stage,'Gather fragment',0);key(bit,'opacity',[(0,0),(18+j*8,0),(40+j*8,1),(114,1),(145,0)])
    rect(bit,'Fragment',0,0,24+j*4,24+j*4,8,color)
    px,py=pos(110)
    key(bit,'x',[(0,start[0]+[-90,100,-80,80][j]),(35,start[0]+[-90,100,-80,80][j]),(132,px)])
    key(bit,'y',[(0,start[1]+[-100,-80,70,90][j]),(35,start[1]+[-100,-80,70,90][j]),(132,py)])
  # Low-alpha echoes indicate direction; not shutter-based motion blur.
  trail=node(stage,'Directional echo',0)
  key(trail,'opacity',[(0,0),(160,0),(180,.12),(290,.12),(355,0)])
  echo,_,_=rect(trail,'Echo capsule',0,0,150,44,22,color)
  for axis,ind in [('x',0),('y',1)]:key(trail,axis,[(f,pos(max(0,f-9))[ind]) for f in range(150,361,12)],ease='linear')
  # Native radial glow is limited to the ordering and completion beats.
  halo=node(stage,'Ordering glow',0);key(halo,'opacity',[(0,0),(360,0),(414,.6),(520,0),(770,0),(795,.4),(830,0)])
  glow(halo,'Soft radial light',540,rowys[i]+16,800,220,color)
 # Recessed neutral tracks and website-like cards emerge behind the transformed paths.
 ui=node(stage,'Control shells',0);key(ui,'opacity',[(0,0),(474,0),(546,1)])
 for i,m in enumerate(meta.values()):
  rect(ui,'Neutral track',540,rowys[i]+16,tw,16,8,col('bg-subtle'))
  rect(ui,'Channel card',540,rowys[i],820,136,30,col('bg-card'),col('border-color'))
 # Curved streams straighten into the channel axes while the same colored matter morphs.
 streams=node(stage,'Ordering streams',0);key(streams,'opacity',[(0,0),(166,0),(210,.2),(360,.4),(480,.3),(545,0)])
 for i,m in enumerate(meta.values()):
  sh=el(streams,'Shape',name=m['name']+' curved stream');pp=el(sh,'PointsPath',isClosed='false')
  vs=[el(pp,'CubicDetachedVertex') for _ in range(3)]
  for j,v in enumerate(vs):
   key(v,'x',[(0,170+j*350),(360,170+j*350),(510,left+j*tw/2)],ease='linear')
   key(v,'y',[(0,600+i*150+(-1)**j*210),(360,600+i*150+(-1)**j*210),(510,rowys[i]+16)])
   for prop in ['inDistance','outDistance']:key(v,prop,[(0,130),(360,150),(510,0)])
   v.set('inRotation',str(math.pi));v.set('outRotation','0')
  st=el(sh,'Stroke',thickness=3,cap='round');el(st,'SolidColor',colorValue='FF'+m['color'][1:]);trim=el(st,'TrimPath',start=0,end=1,modeValue='sequential');key(trim,'end',[(0,0),(170,0),(340,1),(510,1)])
 # First-declared draws on top: handles must sit in front of the continuous tracks.
 for child in list(stage):
  if child.get('name','').endswith(' separated handle'):
   stage.remove(child);stage.insert(0,child)
 sm=el(b,'StateMachine',name='Cinematic V4');b.set('defaultStateMachineId',sm.get('id'));layer=el(sm,'StateMachineLayer',name='Story');el(layer,'AnyState',x=200,y=-120);el(layer,'ExitState',x=400,y=-120);entry=el(layer,'EntryState');state=el(layer,'AnimationState',x=200,y=0,animationId=anim.get('id'));el(entry,'StateTransition',stateToId=state.get('id'))
board('Dark');board('Light');E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode');(P/'rive.yaml').write_text('name: intro-v4\n')
(P/'design-tokens.json').write_text(json.dumps({'dark':dark,'light':light,'categories':meta},ensure_ascii=False,indent=2)+'\n')
