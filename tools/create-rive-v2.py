#!/usr/bin/env python3
"""Build a separate, editable V2 RML from V1's Rive scene structure.
No browser animation or script-driven drawing: all motion is native Rive keyframes.
"""
from pathlib import Path
import xml.etree.ElementTree as E
import copy, json, subprocess, shutil
from fontTools import subset
from fontTools.ttLib import TTFont
ROOT=Path(__file__).resolve().parent.parent
P=ROOT/'animation/intro-v2'
meta=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {CATEGORY_META} from './data.js'; console.log(JSON.stringify(CATEGORY_META))"],cwd=ROOT,text=True))
words='내맘대로 알고리즘 나의 관심이 나의 기준 내가 정하는 추천의 균형 나의 알고리즘 직접 조절 공부 기술 문화 취미 0123456789%'
f=TTFont('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',fontNumber=1)
s=subset.Subsetter();s.populate(text=words);s.subset(f);f.save(P/'NotoSansKR-V2.otf')
shutil.copy(ROOT/'animation/intro/FONT-LICENSE.txt',P/'FONT-LICENSE.txt')
root=E.Element('Rive',version='1',kind='fragment')
E.SubElement(root,'FontAsset',id='0:900',name='Noto Sans KR V2',file='NotoSansKR-V2.otf')
next_id=1000

def el(parent,tag,**attrs):
 global next_id
 attrs={k:str(v) for k,v in attrs.items()};attrs.setdefault('id',f'0:{next_id}');next_id+=1
 return E.SubElement(parent,tag,attrs)

def board(mobile=False):
 global next_id
 # Retain the V1 artboard/style/state-machine/timeline graph and replace its visual scene.
 old=E.parse(ROOT/'animation/intro/scene.rml').getroot().find('Artboard')
 b=copy.deepcopy(old)
 for child in list(b):
  if child.tag not in ('LayoutComponentStyle','StateMachine','LinearAnimation','Fill'):b.remove(child)
 for node in b.iter():
  for k in list(node.attrib):
   if k=='id' or k.endswith('Id'):
    # V1 graph ids are disjoint from all newly generated ids.
    if ':' in node.attrib[k]:node.attrib[k]=f'0:{int(node.attrib[k].split(":")[1])+ (20000 if mobile else 10000)}'
 b.set('x','2100' if mobile else '0');b.set('y','0');b.set('name','Mobile' if mobile else 'Desktop');b.set('width','1080' if mobile else '1920');b.set('height','1920' if mobile else '1080')
 b.find('Fill/SolidColor').set('colorValue','FF0B1020')
 anim=b.find('LinearAnimation');anim.clear();anim.attrib.update(id=f'0:{20006 if mobile else 10006}',name='Welcome V2 3.4s',fps='60',duration='204',loopValue='oneShot')
 root.append(b)
 cx=540 if mobile else 960;cy=815 if mobile else 470
 trackw=800 if mobile else 940;left=cx-trackw/2
 cardw=940 if mobile else 1100
 textsize=46 if mobile else 32
 def key(obj,prop,values,kind='double',linear=False):
  ko=E.SubElement(anim,'KeyedObject',objectId=obj.get('id'));kp=E.SubElement(ko,'KeyedProperty',property=prop)
  for frame,value in values:
   if kind=='string':E.SubElement(kp,'KeyFrameString',frame=str(frame),value=str(value),interpolationType='hold')
   else:
    k=E.SubElement(kp,'KeyFrameDouble',frame=str(frame),value=str(round(value,5)),interpolationType='linear' if linear else 'cubic')
    if not linear:E.SubElement(k,'CubicEaseInterpolator',x1='0.32',y1='0',x2='0.18',y2='1')
 def node(name,opacity=1):return el(b,'Node',name=name,opacity=opacity)
 def fade(n,start,end):key(n,'opacity',[(0,0),(start,0),(end,1)])
 def rect(parent,name,x,y,w,h,r,color,glow=False,stroke=None,gradient=False):
  shape=el(parent,'Shape',name=name,x=x,y=y)
  path=el(shape,'Rectangle',width=w,height=h,cornerRadiusTL=r)
  if glow:
   pass # Feather renders as a hard halo in this headless backend; use native radial companions below.
  fill=el(shape,'Fill')
  if gradient:
   g=el(fill,'LinearGradient',startX=0,startY=-h/2,endX=0,endY=h/2)
   el(g,'GradientStop',position=0,colorValue=color);el(g,'GradientStop',position=1,colorValue='FF10192D')
  else:el(fill,'SolidColor',colorValue=color)
  if stroke:
   st=el(shape,'Stroke',thickness=1.5);el(st,'SolidColor',colorValue=stroke)
  return shape,path
 def text(parent,content,x,y,size,color):
  n=el(parent,'Text',name=content,x=x,y=y,originX=.5,originY=.5,sizingValue='autoWidth')
  style=el(n,'TextStylePaint',fontSize=size,fontAssetId='0:900')
  fill=el(style,'Fill');el(fill,'SolidColor',colorValue=color)
  run=el(n,'TextValueRun',styleId=style.get('id'),text=content)
  return n,run
 states=[(124,[25,25,25,25]),(151,[40,30,15,15]),(175,[15,25,35,25]),(193,[30,25,20,25])]
 def ratios(frame):
  for (a,av),(z,zv) in zip(states,states[1:]):
   if a<=frame<=z:
    t=(frame-a)/(z-a);t=t*t*(3-2*t)
    return [v+(w-v)*t for v,w in zip(av,zv)]
  return states[0][1] if frame<124 else states[-1][1]
 def geom(frame,i):
  rr=ratios(frame);w=trackw*rr[i]/100
  return left+trackw*sum(rr[:i])/100+w/2,w-8
 # Frontmost details on a shared handle group, above the colored segments.
 handle=node('Interactive-looking handle',0);fade(handle,116,131)
 grip,unused=rect(handle,'Handle grip',0,0,5,22,2.5,'FF0B1020')
 rect(handle,'Handle highlight',-10,-28,18,2,1,'FFFFFFFF')
 rect(handle,'Handle face',0,0,38,76,16,'FFEAF2FF',glow=True,stroke='FFFFFFFF')
 # small contact shadow below the handle
 shadow=node('Handle contact shadow',0);fade(shadow,116,131)
 rect(shadow,'Handle shadow',3,8,50,78,18,'90040A17',glow=False)
 for n in (handle,shadow):
  key(n,'x',[(0,cx)]+[(t,left+trackw*sum(ratios(t)[:2])/100) for t in range(124,194)],linear=True)
  key(n,'y',[(0,cy),(124,cy),(151,cy-3),(175,cy+2),(193,cy)])
 # Bright typography on the final frame; mobile has a separate layout, not a landscape crop.
 title=node('Final service title',0);fade(title,135,162)
 title_y=1230 if mobile else 748
 text(title,'내맘대로 알고리즘',cx,title_y,78 if mobile else 66,'FFF2F6FF')
 key(title,'y',[(0,24),(135,24),(162,0)])
 sub=node('Final promise',0);fade(sub,151,179)
 text(sub,'나의 관심이 나의 기준',cx,title_y+98 if mobile else title_y+82,48 if mobile else 32,'FFB9C9E6')
 # Final card labels, kept outside saturated fills for legibility.
 labels=node('Ratios and categories',0);fade(labels,112,130)
 colors=[m['color'].lstrip('#') for m in meta.values()]
 cats=[m['name'] for m in meta.values()]
 for i,(cat,col) in enumerate(zip(cats,colors)):
  x=left+trackw*(i+.5)/4
  text(labels,cat,x,cy+100,textsize,'FFD4DFF2')
  n,run=text(labels,'25%',x,cy+158,textsize+4,'FFF2F6FF')
  vals=[]
  for t in range(124,194):
   rr=ratios(t);rounded=[int(v) for v in rr]
   for j in sorted(range(4),key=lambda j:rr[j]-rounded[j],reverse=True)[:100-sum(rounded)]:rounded[j]+=1
   vals.append((t,f'{rounded[i]}%'))
  key(run,'text',[(0,'25%')]+vals,kind='string')
  rect(labels,cat+' marker',x-44 if not mobile else x-65,cy+100,8,8,4,'FF'+col)
 header=node('Mixer header',0);fade(header,90,116)
 text(header,'나의 알고리즘',cx-250 if mobile else cx-337,cy-110,42 if mobile else 30,'FFE7EEFC')
 text(header,'직접 조절',cx+260 if mobile else cx+350,cy-110,34 if mobile else 24,'FF9AC4FF')
 rect(header,'Control status',cx+260 if mobile else cx+350,cy-110,190 if mobile else 148,58 if mobile else 42,24,'FF162B4A',stroke='40589CFF')
 # Each original V1 object is represented by a rounded parametric path with keyed dimensions and corners.
 # This preserves native Rive editability while creating genuine shape changes rather than uniform scaling.
 for i,(cat,col) in enumerate(zip(cats,colors)):
  midx=left+trackw*(i+.5)/4
  entry=[(-220,cy-260),(cx-150,220 if mobile else -100),(1080+180 if mobile else 2100,cy-100),(cx+180,2050 if mobile else 1180)][i]
  resty=cy-10+[0,-28,10,-12][i]
  w,h,r,rot=[(100,132,10,-.14),(104,104,14,.7854),(118,118,59,.1),(128,100,35,-.24)][i]
  sh,path=rect(b,cat+' morphing segment',midx,resty,w,h,r,'FF'+col,glow=True,stroke='30FFFFFF')
  delay=4+i*6
  key(sh,'opacity',[(0,0),(delay,0),(delay+22,1)])
  key(sh,'x',[(0,entry[0]),(delay,entry[0]),(delay+36,midx+(-14 if i%2 else 14)),(76,midx),(100,midx+(-12 if i%2 else 12)),(124,geom(124,i)[0])]+[(t,geom(t,i)[0]) for t in range(125,194)])
  key(sh,'y',[(0,entry[1]),(delay,entry[1]),(delay+36,resty),(76,resty-12),(98,resty+6),(124,cy)])
  key(sh,'rotation',[(0,rot+(-.8 if i%2 else .7)),(delay+36,rot),(82,rot+(-.10 if i%2 else .10)),(124,0)])
  key(path,'width',[(0,w),(84,w),(108,w*1.28),(124,geom(124,i)[1])]+[(t,geom(t,i)[1]) for t in range(125,194)])
  key(path,'height',[(0,h),(84,h),(104,76),(124,44)])
  key(path,'cornerRadiusTL',[(0,r),(84,r),(108,25),(124,16)])
  # Native radial glow companion; copy transforms and dimensions so it follows the morph.
  halo=el(b,'Shape',name=cat+' soft radial glow',x=midx,y=resty,opacity=0)
  hp=el(halo,'Ellipse',width=w+100,height=h+100)
  hf=el(halo,'Fill');hg=el(hf,'RadialGradient',startX=0,startY=0,endX=1,endY=0)
  # Scale the gradient into an ellipse along with its path dimensions.
  hg.set('endX',str((w+100)/2))
  el(hg,'GradientStop',position=0,colorValue='30'+col)
  el(hg,'GradientStop',position=.4,colorValue='18'+col)
  el(hg,'GradientStop',position=1,colorValue='00'+col)
  for ko in list(anim):
   if ko.get('objectId') in (sh.get('id'),path.get('id')):
    clone=copy.deepcopy(ko);ispath=ko.get('objectId')==path.get('id')
    clone.set('objectId',hp.get('id') if ispath else halo.get('id'))
    prop=clone.find('KeyedProperty').get('property')
    if ispath and prop not in ('width','height'):continue
    for k in clone.iter('KeyFrameDouble'):
     if ispath:k.set('value',str(float(k.get('value'))+100))
    anim.append(clone)
  # Slight reflective rim on the crisp object keeps the exact website fill colors.

  # Category labels during the entrance clarify the four abstract symbols.
  lab=node(cat+' entrance label',0)
  text(lab,cat,midx,cy+116,textsize,'FFCAD7EE')
  key(lab,'opacity',[(0,0),(delay+22,0),(delay+39,1),(78,1),(103,0)])
 # Dark, recessed trough and control card sit behind the morphing segments.
 trough=node('Recessed track',0);fade(trough,88,117)
 rect(trough,'Track lip',cx,cy,trackw+30,70,30,'FF071020',stroke='FF293955')
 ticks=node('Subtle ratio ticks',0);fade(ticks,92,122)
 for i in range(21):rect(ticks,'Tick',left+trackw*i/20,cy+45,2,7 if i%5 else 12,1,'FF4C5D7A')
 card=node('Mixer card',0);fade(card,78,113)
 key(card,'y',[(0,25),(78,25),(116,0)])
 rect(card,'Card rim',cx,cy+32,cardw,360 if mobile else 338,36,'FF16233B',stroke='FF2B3C59',gradient=True)
 glow=node('Card ambient blue',0);fade(glow,80,125)
 rect(glow,'Ambient light',cx,cy+45,cardw-10,330,45,'00000000',glow=False)
 # Restrained accent and an eyebrow remain above the card.
 eyebrow=node('Opening eyebrow',0);fade(eyebrow,4,35)
 ey=350 if mobile else 210
 text(eyebrow,'내가 정하는 추천의 균형',cx,ey,42 if mobile else 28,'FF9DAFCE')
 rect(eyebrow,'Accent dash',cx,ey-70,48,4,2,'FF589CFF',glow=True)
 # Soft background light; preserves the requested base background, with no particles.
 amb=el(b,'Shape',name='Soft ambient blue',x=cx,y=cy)
 path=el(amb,'Ellipse',width=cardw+200,height=700)
 fill=el(amb,'Fill');rg=el(fill,'RadialGradient',startX=0,startY=0,endX=700,endY=0)
 el(rg,'GradientStop',position=0,colorValue='10589CFF');el(rg,'GradientStop',position=1,colorValue='00589CFF')
 return b
board(False);board(True)
E.indent(root,space='  ')
E.ElementTree(root).write(P/'scene.rml',encoding='unicode')
(P/'rive.yaml').write_text('name: intro-v2\n')
