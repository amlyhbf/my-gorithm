#!/usr/bin/env python3
"""Compare old/new at their native speeds; explicit end holds only in comparisons."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-4';V=P/'preview';B=R/'animation/intro-v4-3/preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
big=ImageFont.truetype(font,27,index=1);small=ImageFont.truetype(font,19,index=1)
def run(args):subprocess.run(args,cwd=R,check=True)
def make(name,oldstart,oldframes,newstart,newframes,duration,labels):
 header=Image.new('RGB',(1080,80),'#090D16');d=ImageDraw.Draw(header)
 for j,(title,sub) in enumerate(labels):
  d.text((j*540+18,5),title,font=big,fill='#F8FAFC');d.text((j*540+18,44),sub,font=small,fill='#94A3B8')
 hp=P/'build'/f'{name}-header.png';header.save(hp)
 fc=f'[0:v]trim=start_frame={oldstart}:end_frame={oldstart+oldframes},setpts=PTS-STARTPTS,scale=540:960:flags=lanczos,tpad=stop_mode=clone:stop_duration={duration},trim=duration={duration}[a];[1:v]trim=start_frame={newstart}:end_frame={newstart+newframes},setpts=PTS-STARTPTS,scale=540:960:flags=lanczos,tpad=stop_mode=clone:stop_duration={duration},trim=duration={duration}[b];[a][b]hstack=inputs=2[body];[2:v][body]vstack=inputs=2,fps=60,setpts=N/(60*TB)[out]'
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(B/'intro-v4-3-dark.mp4'),'-i',str(V/'intro-v4-4-dark.mp4'),'-loop','1','-framerate','60','-i',str(hp),'-filter_complex',fc,'-map','[out]','-t',str(duration),'-frames:v',str(round(duration*60)),'-r','60','-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(V/(name+'.mp4'))])
make('compare-a-entrance',0,246,0,246,4.1,[('V4.3 · 기존 등장','0–4.1초 · 원래 속도'),('V4.4 · 연쇄 진입','0–4.1초 · 원래 속도')])
make('compare-b-response',468,306,492,306,5.1,[('V4.3 · 조절 후 대기','7.8–12.9초 · 조절 시작을 맞춘 비교'),('V4.4 · 끝부분에 바로 반응','8.2–13.3초 · 카드 이동 속도는 동일')])
(V/'comparison-method.json').write_text(json.dumps({'left':'V4.3','right':'V4.4','playback_speed_multiplier':1,'compare_a_seconds':4.1,'compare_b_seconds':5.1,'compare_b_slider_start_aligned':True,'old_clip_frames':[468,774],'new_clip_frames':[492,798],'note':'Both inputs are original60FPS at original speed. Opening comparison uses the same absolute start; response comparison aligns the two slider starts to expose the shorter response delay.'},ensure_ascii=False,indent=2)+'\n')
print('Comparison A/B complete')
