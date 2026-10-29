#!/usr/bin/env python3
"""Make storyboards from actual final native frames and audit captured files."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import hashlib,json,shutil
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4';V=P/'preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
ft=ImageFont.truetype(font,25,index=1);small=ImageFont.truetype(font,20,index=1)
scenes=[('01 관심사의 탄생',1.2),('02 자유와 교차',4.6),('03 질서의 시작',6.5),('03 패스 모핑',8.0),('04 추천 결과의 변화',12.8),('05 브랜드 완성',14.8)]
for theme in ['dark','light']:
 d=V/f'frames-final-{theme}'
 for j,(name,t) in enumerate(scenes):
  f=d/f'{int(t*60)-1:04d}.png';assert f.exists();shutil.copy(f,V/f'scene-{theme}-{j+1:02d}.png')
 shutil.copy(d/'0959.png',V/f'poster-{theme}.png')
board=Image.new('RGB',(1080,1456),'#090D16');draw=ImageDraw.Draw(board)
for j,(name,t) in enumerate(scenes):
 im=Image.open(V/f'scene-dark-{j+1:02d}.png').convert('RGB').resize((360,640),Image.Resampling.LANCZOS)
 x=j%3*360;y=j//3*728;board.paste(im,(x,y));draw.text((x+16,y+652),name,font=ft,fill='#F8FAFC');draw.text((x+16,y+691),f'{t:.1f}s / native Rive',font=small,fill='#94A3B8')
board.save(V/'storyboard.png')
morph=Image.new('RGB',(1080,560),'#090D16');draw=ImageDraw.Draw(morph)
for j,t in enumerate([6.4,7.2,8.0,8.8]):
 im=Image.open(V/'frames-final-dark'/f'{int(t*60)-1:04d}.png').convert('RGB').resize((270,480),Image.Resampling.LANCZOS);morph.paste(im,(j*270,0));draw.text((j*270+20,501),f'{t:.1f}s / SAME PATH',font=small,fill='#F8FAFC')
morph.save(V/'morph-sequence.png')
# Phone fit checks are static layout checks, not a claim of browser integration.
for w,h in [(360,640),(390,844),(430,932)]:
 im=Image.open(V/'poster-dark.png').convert('RGB');scale=min(w/1080,h/1920);nw,nh=round(1080*scale),round(1920*scale)
 out=Image.new('RGB',(w,h),'#090D16');out.paste(im.resize((nw,nh),Image.Resampling.LANCZOS),((w-nw)//2,(h-nh)//2));out.save(V/f'phone-{w}x{h}.png')
audit={'native_renderer':'Rive CLI 1.8.0','source_rml_sha256':hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest(),'capture_method':'960 explicit --screenshot calls per theme, --advance=frame at 60 Hz; no interpolation or draft-frame reuse','themes':{}}
for theme in ['dark','light']:
 files=sorted((V/f'frames-final-{theme}').glob('*.png'));assert len(files)==960
 dimensions=set();hashes=[]
 for f in files:
  with Image.open(f) as im:dimensions.add(im.size)
  hashes.append(hashlib.sha256(f.read_bytes()).hexdigest())
 assert dimensions=={(1080,1920)}
 audit['themes'][theme]={'captured_frames':len(files),'dimensions':list(dimensions)[0],'distinct_png_hashes':len(set(hashes)),'phases':{name:{'frames':z-a,'distinct_png_hashes':len(set(hashes[a:z]))} for name,a,z in [('birth',0,180),('cross',180,360),('morph',360,600),('control',600,780),('brand',780,960)]}}
(V/'frame-audit.json').write_text(json.dumps(audit,indent=2)+'\n');print(json.dumps(audit,indent=2))
