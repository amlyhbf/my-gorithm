#!/usr/bin/env python3
"""Inspect actual final MP4s, extract final frames and produce mobile/comparison sheets."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import hashlib,json,subprocess,shutil,datetime
from zoneinfo import ZoneInfo
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';V=P/'preview';B=R/'animation/intro-v4-2/preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';ft=ImageFont.truetype(font,24,index=1);small=ImageFont.truetype(font,19,index=1);big=ImageFont.truetype(font,32,index=1)
def extract(path,f,dest):
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(path),'-vf',f'select=eq(n\\,{f})','-frames:v','1',str(dest)],check=True)
 return dest
def im(path,size=None):
 with Image.open(path) as x:
  x=x.convert('RGB');return x if size is None else x.resize(size,Image.Resampling.LANCZOS)
def frame(theme,f):return V/f'frames-final-{theme}'/f'{f:04d}.png'
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();plan=json.load(open(V/'capture-plan.json'));assert plan['render_completed'] and plan['source_rml_sha256']==source
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
assert json.load(open(V/'test-review.json'))['assets_sha256']==assets
assert json.load(open(V/'unchanged-intervals.json'))['assets_sha256']==assets
media={}
for name,secs,dims in [('intro-v4-3-dark.mp4',16,(1080,1920)),('intro-v4-3-light.mp4',16,(1080,1920)),('compare-a-intro.mp4',6.5,(1080,1040)),('compare-b-cause-effect.mp4',5.8,(1080,1040))]:
 path=V/name;d=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(path)],text=True));s=d['streams'][0]
 assert (s['width'],s['height'])==dims and s['r_frame_rate']==s['avg_frame_rate']=='60/1'
 assert int(s['nb_read_frames'])==int(s['nb_frames'])==round(secs*60) and abs(float(d['format']['duration'])-secs)<1e-6
 stamps=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',str(path)],text=True))['frames'];err=max(abs(float(x['best_effort_timestamp_time'])-j/60) for j,x in enumerate(stamps));assert err<1e-6
 d.update({'source_rml_sha256':source,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'decoded_frames':len(stamps),'max_timestamp_error_seconds':err});media[name]=d;(V/(name+'.json')).write_text(json.dumps(d,indent=2)+'\n')
(P/'final-media-verification.json').write_text(json.dumps(media,indent=2)+'\n')
audit={'source_rml_sha256':source,'capture_plan':plan,'native_renderer':'Official Rive CLI 1.8.0','step_seconds':1/60,'themes':{}}
scenes=[('등장과 교차',1.0),('짧아진 연결',2.75),('보존한 모핑',5.2),('조절 먼저',8.5),('피드 교체',9.4),('두 번째 조절',10.7),('피드 재배치',12.0),('브랜드·여백',15.5)]
for theme in ['dark','light']:
 files=sorted((V/f'frames-final-{theme}').glob('*.png'));assert [f.name for f in files]==[f'{j:04d}.png' for j in range(960)]
 hs=[]
 for f in files:
  with Image.open(f) as x:assert x.size==(1080,1920)
  hs.append(hashlib.sha256(f.read_bytes()).hexdigest())
 for a,z in plan['preserved_intervals']:assert all(files[j].read_bytes()==(B/f'frames-final-{theme}'/files[j].name).read_bytes() for j in range(a,z+1))
 audit['themes'][theme]={'native_frames':960,'size':[1080,1920],'distinct_png_hashes':len(set(hs)),'unique_morph_frames':len(set(hs[210:450])),'unique_control_feed_frames':len(set(hs[450:798])),'brand_hold_distinct_frames':len(set(hs[858:960]))}
 bg,fg,muted=('#090D16','#F8FAFC','#94A3B8') if theme=='dark' else ('#F8FAFC','#0F172A','#64748B')
 sheet=Image.new('RGB',(1080,1112),bg);d=ImageDraw.Draw(sheet)
 for j,(label,t) in enumerate(scenes):
  f=round(t*60);dest=V/f'scene-{theme}-{j+1:02d}.png';shutil.copyfile(frame(theme,f),dest)
  x=j%4*270;y=j//4*556;sheet.paste(im(dest,(270,480)),(x,y));d.text((x+10,y+488),label,font=ft,fill=fg);d.text((x+10,y+526),f'{t:.2f}s',font=small,fill=muted)
 sheet.save(V/f'storyboard-{theme}.png')
 # Actual decoded last MP4 frame, not just the source/native poster.
 poster=extract(V/f'intro-v4-3-{theme}.mp4',959,V/f'poster-{theme}-from-mp4.png')
 for w,h in [(360,640),(390,844),(430,932)]:
  for label,path in [('final',poster),('feed',frame(theme,780))]:
   s=min(w/1080,h/1920);nw,nh=round(1080*s),round(1920*s);out=Image.new('RGB',(w,h),bg);out.paste(im(path,(nw,nh)),((w-nw)//2,(h-nh)//2));out.save(V/f'phone-{theme}-{label}-{w}x{h}.png')
 oldposter=extract(B/f'intro-v4-2-{theme}.mp4',959,P/'build'/f'old-final-{theme}.png')
 # Same-sized full final frames plus an unscaled crop of the upper channel card.
 out=Image.new('RGB',(1080,1360),bg);d=ImageDraw.Draw(out)
 for j,(label,path) in enumerate([('V4.2 · 기존',oldposter),('V4.3 · 여백 보정',poster)]):
  d.text((j*540+20,12),label,font=big,fill=fg);out.paste(im(path,(540,960)),(j*540,64))
  crop=im(path).crop((190,906,890,1076));out.paste(crop.resize((540,131),Image.Resampling.LANCZOS),(j*540,1060))
  d.text((j*540+20,1210),'같은 크기 · 실제 MP4 마지막 프레임',font=small,fill=muted)
  d.text((j*540+20,1250),'눈금 중심–카드 하단: '+('6px' if j==0 else '30px')+' (원본 좌표)',font=small,fill=muted)
 out.save(V/f'compare-c-final-ui-{theme}.png')
(V/'frame-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
(V/'mobile-layout-check.json').write_text(json.dumps({'viewports':[[360,640],[390,844],[430,932]],'method':'Contain-fit actual decoded MP4 final frames and native settled-feed stills. No cropping; static image review, not a physical-device/browser performance test.','themes':['dark','light'],'final_tick_nominal_font_px_at_width':{str(w):29*.82*w/1080 for w in [360,390,430]},'caveat':'Final ticks are auxiliary small print (about 8–9.5 px). Padding is corrected without reducing the V4.2 font; physical-phone viewing remains a design approval check.','future_button_safe_rectangle_native':[204,1570,876,1770]},indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as f:f.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — 1,920장 PNG·실제 MP4 디코딩 프레임/시각 검사, 두 비교 영상, 마지막 MP4 프레임 추출 및 모바일 시안 생성.\n')
print(json.dumps({k:d['format'] for k,d in media.items()},indent=2))
