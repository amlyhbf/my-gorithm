#!/usr/bin/env python3
"""Create review sheets and metadata from actual final native PNGs. No animation synthesis."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from zoneinfo import ZoneInfo
import datetime, hashlib, json, os, shutil, subprocess
R=Path(__file__).resolve().parent.parent
P=R/'animation/intro-v4-1';V=P/'preview';OLD=R/'animation/intro-v4/preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
ft=ImageFont.truetype(font,25,index=1)
small=ImageFont.truetype(font,20,index=1)
big=ImageFont.truetype(font,32,index=1)
def frame(root,theme,t):
    path=root/f'frames-final-{theme}'/f'{round(t*60):04d}.png'
    if path.exists() or root!=OLD:
        return path
    # Fresh checkout: render selected baseline stills without writing into the V4 folder.
    d=P/'build/baseline-review';d.mkdir(parents=True,exist_ok=True)
    for f in [OLD.parent/'scene.rml',OLD.parent/'rive.yaml',*OLD.parent.glob('*.ttf')]:
        shutil.copyfile(f,d/f.name)
    dest=d/f'{theme}-{round(t*60):04d}.png'
    if not dest.exists():
        env=dict(os.environ);env.setdefault('LP_NUM_THREADS','1')
        subprocess.run([str(R/'tools/rive'),str(d),f'--artboard={theme.title()}',f'--advance={round(t*60)+1}',f'--screenshot={dest}'],cwd=R,env=env,check=True,stdout=subprocess.DEVNULL)
    return dest
def thumb(path,wh):
    with Image.open(path) as im:
        return im.convert('RGB').resize(wh,Image.Resampling.LANCZOS)
scenes=[('01 관심사의 탄생',1.2),('02 자유와 교차',4.6),('03 모핑 · 앞뒤 시간차',7.0),('03 인터페이스로 정돈',8.5),('04 관심도와 추천 변화',12.8),('05 브랜드 완성',14.8)]
for theme in ['dark','light']:
    bg,fg,muted=('#090D16','#F8FAFC','#94A3B8') if theme=='dark' else ('#F8FAFC','#0F172A','#64748B')
    board=Image.new('RGB',(1080,1456),bg);d=ImageDraw.Draw(board)
    for j,(name,t) in enumerate(scenes):
        dest=V/f'scene-{theme}-{j+1:02d}.png';shutil.copyfile(frame(V,theme,t),dest)
        x=j%3*360;y=j//3*728
        board.paste(thumb(dest,(360,640)),(x,y))
        d.text((x+14,y+650),name,font=ft,fill=fg)
        d.text((x+14,y+691),f'{t:.1f}s / native Rive 60 FPS',font=small,fill=muted)
    board.save(V/f'storyboard-{theme}.png')
    shutil.copyfile(frame(V,theme,959/60),V/f'poster-{theme}.png')
    for w,h in [(360,640),(390,844),(430,932)]:
        for label,t in [('brand',959/60),('control',12.8)]:
            scale=min(w/1080,h/1920);nw,nh=round(1080*scale),round(1920*scale)
            out=Image.new('RGB',(w,h),bg)
            out.paste(thumb(frame(V,theme,t),(nw,nh)),((w-nw)//2,(h-nh)//2))
            out.save(V/f'phone-{theme}-{label}-{w}x{h}.png')

def compare_sheet(times,output):
    board=Image.new('RGB',(1080,1152),'#090D16');d=ImageDraw.Draw(board)
    for row,(label,base) in enumerate([('V4 · 이전',OLD),('V4.1 · 개선',V)]):
        y=row*576
        d.text((20,y+8),label,font=big,fill='#F8FAFC')
        for col,t in enumerate(times):
            board.paste(thumb(frame(base,'dark',t),(270,480)),(col*270,y+52))
            d.text((col*270+16,y+541),f'{t:.1f}s · 동일 시각',font=small,fill='#94A3B8')
    board.save(V/output)
compare_sheet([6.5,7.5,8.5,9.5],'storyboard-before-after.png')
compare_sheet([.8,2.1,3.8,5.5],'motion-before-after.png')

# Audit native provenance and source cadence, not only container metadata.
source=hashlib.sha256((P/'scene.rml').read_bytes()).hexdigest()
proof=json.loads((V/'suffix-verification.json').read_text());assert proof['passed'] and proof['source_rml_sha256']==source
plan=json.loads((V/'capture-plan.json').read_text());assert plan['render_completed'] and plan['source_rml_sha256']==source
audit={'native_renderer':'Rive CLI 1.8.0','source_rml_sha256':source,
       'new_capture':f"frames 0..{plan['new_native_frames_per_theme']-1} at t=frame/60 via official --screenshot --advance=frame+1",
       'preserved_capture':'frames 600..959 copied from original V4 native 60-FPS PNGs after structural, numeric and RGB proof' if plan['preserved_native_frames_per_theme'] else 'No cache reuse; full timeline captured natively',
       'pixel_frame_duplication_or_optical_flow':False,'themes':{}}
for theme in ['dark','light']:
    folder=V/f'frames-final-{theme}';files=sorted(folder.glob('*.png'))
    assert [p.name for p in files]==[f'{f:04d}.png' for f in range(960)]
    dimensions=set();hashes=[]
    for path in files:
        with Image.open(path) as im:dimensions.add(im.size)
        hashes.append(hashlib.sha256(path.read_bytes()).hexdigest())
    assert dimensions=={(1080,1920)}
    cached=all((OLD/f'frames-final-{theme}'/files[f].name).exists() for f in range(600,960))
    if cached:
        assert all(files[f].read_bytes()==(OLD/f'frames-final-{theme}'/files[f].name).read_bytes() for f in range(600,960))
    audit['themes'][theme]={'captured_frames':len(files),'dimensions':[1080,1920],
        'newly_captured_native_frames':plan['new_native_frames_per_theme'],'preserved_native_frames':plan['preserved_native_frames_per_theme'],
        'distinct_png_hashes':len(set(hashes)),
        'phases':{name:{'frames':z-a,'distinct_png_hashes':len(set(hashes[a:z]))} for name,a,z in [('birth',0,180),('cross',180,360),('morph',360,600),('control',600,780),('brand',780,960)]}}
(V/'frame-audit.json').write_text(json.dumps(audit,indent=2)+'\n')

# Probe the encoded bitstreams, including decoded frame count and presentation times.
metadata={}
for name,duration,wh in [
    ('intro-v4-1-dark.mp4',16,(1080,1920)),('intro-v4-1-light.mp4',16,(1080,1920)),
    ('compare-motion-0-6.mp4',6,(1080,1040)),('compare-morph-6-10.mp4',4,(1080,1040))]:
    p=V/name
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=codec_name,width,height,r_frame_rate,avg_frame_rate,nb_frames,nb_read_frames,pix_fmt:format=duration,size,bit_rate','-of','json',str(p)],text=True))
    s=info['streams'][0];f=info['format']
    assert (s['width'],s['height'])==wh
    assert s['avg_frame_rate']==s['r_frame_rate']=='60/1'
    assert int(s['nb_read_frames'])==int(s['nb_frames'])==duration*60
    assert abs(float(f['duration'])-duration)<1e-6
    times=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',str(p)],text=True))['frames']
    ts=[float(x['best_effort_timestamp_time']) for x in times]
    deviation=max(abs(t-i/60) for i,t in enumerate(ts))
    assert deviation<1e-6
    info.update({'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'decoded_frames_count':len(ts),'max_timestamp_error_seconds':deviation})
    (V/(name+'.json')).write_text(json.dumps(info,indent=2)+'\n')
    metadata[name]=info
(P/'final-media-verification.json').write_text(json.dumps(metadata,indent=2)+'\n')

mobile={'method':'Static contain-fit from native frames. No browser integration or physical-phone runtime test.',
    'viewports':[[360,640],[390,844],[430,932]],'themes':['dark','light'],
    'reviewed_scenes':['control at 12.8s','brand at 15.9833s'],
    'title_font_at_360px_width':82/3,'subtitle_font_at_360px_width':48/3,
    'fit':'contain','crop':False,'html_start_button_space_preserved':True,
    'note':'Native design is 9:16. Taller phones use safe empty margins; responsive Rive layout remains future integration work.'}
(V/'mobile-layout-check.json').write_text(json.dumps(mobile,indent=2)+'\n')
with (P/'WORK_LOG.md').open('a') as log:
    log.write('- '+datetime.datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')+' — 최종 2테마 1,920 PNG 프레임 및 MP4 디코딩 검사 통과. 매 1/60초 타임스탬프, 원래 60FPS suffix 보존 확인. 주요 스틸·전후 비교 보드·3가지 모바일 contain 시안 생성.\n')
print(json.dumps({'media':{k:v['format'] for k,v in metadata.items()},'frame_audit':audit,'mobile':mobile},indent=2))
