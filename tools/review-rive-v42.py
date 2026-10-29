#!/usr/bin/env python3
"""Create comparison sheets and verify actual native frames and decoded final MP4s."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from datetime import datetime
from zoneinfo import ZoneInfo
import hashlib,json,shutil,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-2';V=P/'preview';OLD=R/'animation/intro-v4-1/preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';small=ImageFont.truetype(font,20,index=1);ft=ImageFont.truetype(font,25,index=1);big=ImageFont.truetype(font,32,index=1)
def frame(base,theme,t):return base/f'frames-final-{theme}'/f'{round(t*60):04d}.png'
def thumb(path,size):
 with Image.open(path) as im:return im.convert('RGB').resize(size,Image.Resampling.LANCZOS)
scenes=[('01 관심사의 탄생',1.2),('02 자유로운 교차',4.6),('03 응집 · 압축',6.8),('03 한 번의 펼침',7.8),('04 재구성된 맞춤 피드',12.7),('05 브랜드 완성',14.8)]
for theme in ['dark','light']:
 bg,fg,muted=('#090D16','#F8FAFC','#94A3B8') if theme=='dark' else ('#F8FAFC','#0F172A','#64748B')
 board=Image.new('RGB',(1080,1456),bg);draw=ImageDraw.Draw(board)
 for j,(label,t) in enumerate(scenes):
  dest=V/f'scene-{theme}-{j+1:02d}.png';shutil.copyfile(frame(V,theme,t),dest)
  x=j%3*360;y=j//3*728;board.paste(thumb(dest,(360,640)),(x,y));draw.text((x+14,y+651),label,font=ft,fill=fg);draw.text((x+14,y+692),f'{t:.1f}s / Rive native 60 FPS',font=small,fill=muted)
 board.save(V/f'storyboard-{theme}.png');shutil.copyfile(frame(V,theme,959/60),V/f'poster-{theme}.png')
 for w,h in [(360,640),(390,844),(430,932)]:
  for label,t in [('feed',12.7),('morph',7.8)]:
   s=min(w/1080,h/1920);nw,nh=round(1080*s),round(1920*s)
   out=Image.new('RGB',(w,h),bg);out.paste(thumb(frame(V,theme,t),(nw,nh)),((w-nw)//2,(h-nh)//2));out.save(V/f'phone-{theme}-{label}-{w}x{h}.png')

def comparison(times,name):
 out=Image.new('RGB',(1080,1152),'#090D16');d=ImageDraw.Draw(out)
 for row,(label,base) in enumerate([('V4.1 · 이전',OLD),('V4.2 · 개선',V)]):
  y=row*576;d.text((18,y+8),label,font=big,fill='#F8FAFC')
  for col,t in enumerate(times):
   path=frame(base,'dark',t)
   # Baseline PNG cache is kept in the production workspace; MP4 is permanently in Git.
   if not path.exists():
    path=P/'build'/f'baseline-{round(t*60):04d}.png'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(OLD/'intro-v4-1-dark.mp4'),'-frames:v','1',str(path)],check=True)
   out.paste(thumb(path,(270,480)),(col*270,y+52));d.text((col*270+16,y+541),f'{t:.1f}s · 같은 영상 시각',font=small,fill='#94A3B8')
 out.save(V/name)
comparison([6.65,7.3,7.8,8.8],'storyboard-morph-before-after.png')
comparison([10.5,11.3,12.15,12.7],'storyboard-feed-before-after.png')
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest();plan=json.loads((V/'capture-plan.json').read_text());assert plan['render_completed'] and plan['source_rml_sha256']==source
assets={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [P/'scene.rml',P/'rive.yaml',*sorted(P.glob('*.ttf'))]}
assert json.loads((V/'unchanged-intervals.json').read_text())['assets_sha256']==assets
assert json.loads((V/'test-review.json').read_text())['assets_sha256']==assets
audit={'source_rml_sha256':source,'assets_sha256':assets,'native_renderer':'Rive CLI 1.8.0','source_step_seconds':1/60,'capture_plan':plan,'no_low_fps_upsampling':True,'themes':{}}
for theme in ['dark','light']:
 files=sorted((V/f'frames-final-{theme}').glob('*.png'));assert [f.name for f in files]==[f'{i:04d}.png' for i in range(960)]
 hashes=[]
 for f in files:
  with Image.open(f) as im:assert im.size==(1080,1920)
  hashes.append(hashlib.sha256(f.read_bytes()).hexdigest())
 for a,b in plan['preserved_intervals']:
  assert all(files[f].read_bytes()==(OLD/f'frames-final-{theme}'/files[f].name).read_bytes() for f in range(a,b+1))
 audit['themes'][theme]={'frames':960,'dimensions':[1080,1920],'distinct_png_hashes':len(set(hashes)),'morph_distinct_frames':len(set(hashes[360:600])),'feed_distinct_frames':len(set(hashes[600:780]))}
(V/'frame-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
media={}
for name,seconds,wh in [('intro-v4-2-dark.mp4',16,(1080,1920)),('intro-v4-2-light.mp4',16,(1080,1920)),('compare-morph-6-10.mp4',4,(1080,1040)),('compare-feed-9-6-13-2.mp4',3.6,(1080,1040))]:
 path=V/name;d=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(path)],text=True));s=d['streams'][0]
 assert (s['width'],s['height'])==wh and s['avg_frame_rate']==s['r_frame_rate']=='60/1'
 assert int(s['nb_frames'])==int(s['nb_read_frames'])==round(seconds*60) and abs(float(d['format']['duration'])-seconds)<1e-6
 timestamps=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',str(path)],text=True))['frames']
 error=max(abs(float(t['best_effort_timestamp_time'])-i/60) for i,t in enumerate(timestamps));assert error<1e-6
 d.update({'source_rml_sha256':source,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'decoded_frames':len(timestamps),'max_timestamp_error_seconds':error})
 media[name]=d;(V/(name+'.json')).write_text(json.dumps(d,indent=2)+'\n')
(P/'final-media-verification.json').write_text(json.dumps(media,indent=2)+'\n')
(V/'mobile-layout-check.json').write_text(json.dumps({'method':'Static contain-fit from actual native frames; not a browser or physical-device runtime test.','themes':['dark','light'],'viewports':[[360,640],[390,844],[430,932]],'reviewed_times':[7.8,12.7],'category_name_nominal_font_at_360px':40/3,'short_title_nominal_font_at_360px':34/3,'no_crop':True,'physical_device_performance_tested':False},indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as log:log.write('- '+datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — 최종 1,920장 크기·출처 및 디코딩 프레임·1/60초 타임스탬프 검사 통과. 두 비교 보드·장면 스틸·3가지 모바일 시안 생성.\n')
print(json.dumps({name:d['format'] for name,d in media.items()},indent=2))
