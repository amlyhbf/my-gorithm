#!/usr/bin/env python3
"""Mobile-first native Rive scene. Reads website tokens; never writes website code."""
from pathlib import Path
import re,json,subprocess,math,xml.etree.ElementTree as E
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'.rive-tools/python'))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v3'
css=(R/'style.css').read_text()
def tokens(selector):
 block=re.search(selector+r'\s*\{(.*?)\}',css,re.S).group(1)
 return dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})\s*;',block))
light=tokens(':root');dark={**light,**tokens(r'body\.dark-mode')}
meta=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {CATEGORY_META} from './data.js'; console.log(JSON.stringify(CATEGORY_META))"],cwd=R,text=True))
words='내맘대로 알고리즘 나의 관심이 나의 기준 내 관심으로 만드는 피드 실시간 추천 비율 공부 기술 문화 취미 피드 0123456789%() 제외'
for weight in [600,800]:
 font=TTFont(P/'assets/PretendardVariable.woff2');font=instantiateVariableFont(font,{'wght':weight},inplace=True)
 sub=subset.Subsetter();sub.populate(text=words);sub.subset(font);font.flavor=None;font.save(P/f'Pretendard-{weight}-subset.ttf')
root=E.Element('Rive',version='1',kind='fragment');counter=10

def el(p,tag,**a):
 global counter
 a={k:str(v) for k,v in a.items()};a.setdefault('id',f'0:{counter}');counter+=1
 return E.SubElement(p,tag,a)
regular=el(root,'FontAsset',name='Pretendard 600 subset',file='Pretendard-600-subset.ttf')
bold=el(root,'FontAsset',name='Pretendard 800 subset',file='Pretendard-800-subset.ttf')

def values(frame):
 # Actual site controls are independent 0..100 sliders with step=5.
 out=[]
 for i,(start,end,target) in enumerate([(132,164,80),(153,184,65),(174,206,35),(132,206,50)]):
  t=max(0,min(1,(frame-start)/(end-start)));t=t*t*(3-2*t)
  out.append(5*math.floor((50+(target-50)*t)/5+.5))
 return out

def board(theme):
 c=dark if theme=='Dark' else light
 def col(key):return 'FF'+c[key].lstrip('#')
 b=el(root,'Artboard',name=theme,width=1080,height=1920,x=0 if theme=='Dark' else 1250,y=0)
 style=el(b,'LayoutComponentStyle');b.set('styleId',style.get('id'))
 fill=el(b,'Fill');el(fill,'SolidColor',colorValue=col('bg-page'))
 anim=el(b,'LinearAnimation',name='Welcome V3 4.5s',duration=270,fps=60,loopValue='oneShot')
 def key(obj,prop,vs,kind='double',smooth=True):
  ko=el(anim,'KeyedObject',objectId=obj.get('id'));kp=el(ko,'KeyedProperty',property=prop)
  # Consecutive identical values are retained for faithful stepped native range controls.
  for frame,value in vs:
   if kind=='string':el(kp,'KeyFrameString',frame=frame,value=value,interpolationType='hold')
   elif kind=='color':el(kp,'KeyFrameColor',frame=frame,value=value,interpolationType='linear')
   else:
    k=el(kp,'KeyFrameDouble',frame=frame,value=round(value,5),interpolationType='cubic' if smooth else 'linear')
    if smooth:el(k,'CubicEaseInterpolator',x1=.16,y1=1,x2=.3,y2=1)
 def group(parent,name,opacity=1):return el(parent,'Node',name=name,opacity=opacity)
 def fade(n,start,end):key(n,'opacity',[(0,0),(start,0),(end,1)])
 def rect(parent,name,x,y,w,h,r,color,stroke=None,ellipse=False):
  sh=el(parent,'Shape',name=name,x=x,y=y)
  path=el(sh,'Ellipse' if ellipse else 'Rectangle',width=w,height=h,**({} if ellipse else {'cornerRadiusTL':r}))
  f=el(sh,'Fill');paint=el(f,'SolidColor',colorValue=color)
  if stroke:
   st=el(sh,'Stroke',thickness=2);el(st,'SolidColor',colorValue=stroke)
  return sh,path,paint
 def text(parent,s,x,y,size=44,color=None,heavy=False):
  t=el(parent,'Text',name=s,x=x,y=y,sizingValue='autoWidth',originX=.5,originY=.5)
  st=el(t,'TextStylePaint',fontSize=size,fontAssetId=(bold if heavy else regular).get('id'))
  f=el(st,'Fill');el(f,'SolidColor',colorValue=color or col('text-main'))
  run=el(t,'TextValueRun',styleId=st.get('id'),text=s)
  return t,run
 def line(parent,name,points,color,width=5):
  sh=el(parent,'Shape',name=name);pp=el(sh,'PointsPath',isClosed='false')
  for x,y in points:el(pp,'StraightVertex',x=x,y=y)
  st=el(sh,'Stroke',thickness=width,cap='round',join='round');el(st,'SolidColor',colorValue=color)
  return sh
 def icon(parent,i,color):
  if i==0:
   line(parent,'Open book left',[(-32,-24),(-4,-18),(0,-12),(0,28),(-8,22),(-32,18),(-32,-24)],color)
   line(parent,'Open book right',[(0,-12),(5,-18),(32,-24),(32,18),(8,22),(0,28)],color)
  elif i==1:
   rect(parent,'Chip core',0,0,44,44,8,color)
   for side in [-1,1]:
    for p in [-14,0,14]:
     line(parent,'Chip pin',[(side*26,p),(side*38,p)],color,4)
     line(parent,'Chip pin',[(p,side*26),(p,side*38)],color,4)
  elif i==2:
   line(parent,'Music stem',[(-12,20),(-12,-25),(26,-32),(26,12)],color,6)
   rect(parent,'Music note',-23,24,25,18,9,color,ellipse=True);rect(parent,'Music note',15,16,25,18,9,color,ellipse=True)
  else:
   line(parent,'Leaf',[(0,28),(0,-28),(28,-20),(28,0),(0,18),(-28,0),(-28,-20),(0,-28)],color,5)
   line(parent,'Leaf veins',[(-20,-14),(0,5),(20,-14)],color,4)
 # First on top: brand and copy are in generous mobile safe space.
 title=group(b,'Brand completion',0);fade(title,198,210)
 text(title,'내맘대로 알고리즘',540,392,76,heavy=True)
 key(title,'y',[(0,18),(198,18),(210,0)])
 sub=group(b,'Brand promise',0);fade(sub,201,212)
 text(sub,'나의 관심이 나의 기준',540,489,48,col('text-muted'))
 opening=group(b,'Opening title',0)
 text(opening,'내 관심으로 만드는 피드',540,410,64,heavy=True)
 key(opening,'opacity',[(0,0),(12,1),(165,1),(194,0)])
 # Informational gauge, never represented as the draggable input.
 gauge=group(b,'Computed recommendation gauge',0);fade(gauge,112,132)
 text(gauge,'실시간 추천 비율',540,574,38,col('text-muted'))
 trackleft=178;trackwidth=724
 rows=[770,960,1150,1340];starts=[(320,720),(760,720),(320,1090),(760,1090)]
 for i,(cat,m) in enumerate(meta.items()):
  color='FF'+m['color'].lstrip('#');rY=rows[i]
  # Actual round white thumb with category border, matching WebKit CSS.
  ui=group(b,m['name']+' native-style range UI',0);fade(ui,111+i*2,130+i*2)
  thumb=group(ui,m['name']+' handle')
  rect(thumb,'White thumb',0,0,54,54,27,'FFFFFFFF',stroke=color,ellipse=True)
  # Native CSS uses 3px border at 22px; Rive is scaled for full-HD mobile output.
  thumb.find('Shape/Stroke').set('thickness','7')
  key(thumb,'x',[(0,540)]+[(f,trackleft+trackwidth*values(f)[i]/100) for f in range(132,208)],smooth=False)
  key(thumb,'y',[(0,rY+10)])
  t,run=text(ui,'50% (피드 25%)',744,rY-48,37,heavy=True)
  key(run,'text',[(0,'50% (피드 25%)')]+[(f,f'{values(f)[i]}% (피드 {math.floor(values(f)[i]/sum(values(f))*100+.5)}%)') for f in range(132,208)],kind='string')
  text(ui,m['name'],236,rY-48,46,heavy=True)
  rect(ui,'Category left marker',165,rY-48,10,40,5,color)
  # Thumb goes above filled portion and neutral remaining track.
  fillshape,fillpath,_=rect(ui,'Colored range fill',trackleft,rY+10,trackwidth*.5,16,8,color)
  fillpath.set('originX','0')
  key(fillpath,'width',[(0,trackwidth*.5)]+[(f,trackwidth*values(f)[i]/100) for f in range(132,208)],smooth=False)
  rect(ui,'Remaining range track',540,rY+10,trackwidth,16,8,col('bg-subtle'))
  for j in range(5):
   tick,_=text(ui,'0%(제외)' if j==0 else f'{j*25}%',trackleft+trackwidth*j/4,rY+64,30,col('text-muted'))
   if j in (0,4):tick.set('originX','0' if j==0 else '1')
  # Soft, transient feedback limited to completion; exact category RGB with alpha.
  feedback=group(b,m['name']+' completion feedback',0)
  key(feedback,'opacity',[(0,0),(204,0),(214,.5),(232,0)])
  sh=el(feedback,'Shape',x=540,y=rY)
  el(sh,'Ellipse',width=920,height=250);f=el(sh,'Fill');g=el(f,'RadialGradient',startX=0,startY=0,endX=470,endY=0)
  el(g,'GradientStop',position=0,colorValue='18'+m['color'][1:]);el(g,'GradientStop',position=1,colorValue='00'+m['color'][1:])
  # The original symbolic object becomes its row's card by changing width, height, radius, and color.
  sx,sy=starts[i];entrances=[(-200,sy),(1280,sy),(sx,2070),(sx,-200)]
  eX,eY=entrances[i];delay=i*5
  iconnode=group(b,m['name']+' icon',0)
  icon(iconnode,i,'FFFFFFFF')
  key(iconnode,'opacity',[(0,0),(delay+8,0),(delay+22,1),(88,1),(114,0)])
  for n in [iconnode]:
   key(n,'x',[(0,eX),(delay,eX),(delay+36,sx),(78,sx),(128,540)])
   key(n,'y',[(0,eY),(delay,eY),(delay+36,sy),(78,sy),(128,rY)])
   key(n,'rotation',[(0,[-.22,.18,-.15,.2][i]),(delay+36,0),(128,0)])
  lab=group(b,m['name']+' introductory label',0)
  text(lab,m['name'],sx,sy+140,46)
  key(lab,'opacity',[(0,0),(delay+21,0),(delay+38,1),(60,1),(74,0)])
  card,path,paint=rect(b,m['name']+' shape to channel card',sx,sy,136,136,[16,18,68,42][i],color,stroke=col('border-color'))
  key(card,'opacity',[(0,0),(delay,0),(delay+22,1)])
  key(card,'x',[(0,eX),(delay,eX),(delay+36,sx),(78,sx),(128,540)])
  key(card,'y',[(0,eY),(delay,eY),(delay+36,sy),(78,sy),(128,rY)])
  key(card,'rotation',[(0,[-.22,.18,-.15,.2][i]),(delay+36,0),(128,0)])
  key(path,'width',[(0,136),(75,136),(99,245),(128,840)])
  key(path,'height',[(0,136),(75,136),(104,130),(128,180)])
  key(path,'cornerRadiusTL',[(0,[16,18,68,42][i]),(75,[16,18,68,42][i]),(128,30)])
  key(paint,'colorValue',[(0,color),(86,color),(128,col('bg-card'))],kind='color')
  # Gauge uses exactly the site's weight/sum normalization; no forced sum-100 input model.
  seg,gpath,_=rect(gauge,m['name']+' gauge segment',trackleft,624,181,16,0,color)
  gpath.set('originX','0')
  key(seg,'x',[(0,trackleft+trackwidth*i/4)]+[(f,trackleft+trackwidth*sum(values(f)[:i])/sum(values(f))) for f in range(132,208)],smooth=False)
  key(gpath,'width',[(0,181)]+[(f,trackwidth*values(f)[i]/sum(values(f))) for f in range(132,208)],smooth=False)
 # Short connections come forward during the 1.0–2.2s assembly, then dissolve into UI.
 connections=group(b,'Four fields connect',0);connections.set('x','540');connections.set('y','920')
 key(connections,'opacity',[(0,0),(53,0),(73,.6),(93,.6),(119,0)])
 for i,pts in enumerate([[(320,800),(320,920),(760,920),(760,1010)],[(390,720),(540,720),(540,1090),(690,1090)]]):
  l=line(connections,'System connection',[(x-540,y-920) for x,y in pts],col('text-muted'),4)
  key(l,'scaleY',[(0,.2),(60,.2),(89,1)])
 # One state machine per theme, a single play then static final state.
 sm=el(b,'StateMachine',name='Intro V3');b.set('defaultStateMachineId',sm.get('id'))
 layer=el(sm,'StateMachineLayer',name='Welcome')
 el(layer,'AnyState',x=200,y=-120);el(layer,'ExitState',x=400,y=-120)
 entry=el(layer,'EntryState');state=el(layer,'AnimationState',x=200,y=0,animationId=anim.get('id'))
 el(entry,'StateTransition',stateToId=state.get('id'))
board('Dark');board('Light')
E.indent(root,space='  ');E.ElementTree(root).write(P/'scene.rml',encoding='unicode')
(P/'rive.yaml').write_text('name: intro-v3\n')
audit={'sources':['style.css :root / body.dark-mode','script.js renderOnboarding / calculateAllocation / theme toggle','index.html onboarding markup','data.js CATEGORY_META'],'dark':dark,'light':light,'categories':meta,'range':{'min':0,'max':100,'step':5,'independent':True},'themeStorageKey':'mamgorithm_theme_v2','themeClass':'body.dark-mode','finalWeights':values(270),'finalFeedPercent':[math.floor(v/sum(values(270))*100+.5) for v in values(270)],'safeContentBounds':[120,340,960,1440]}
(P/'design-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
