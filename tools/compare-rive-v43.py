#!/usr/bin/env python3
"""Compare old/new at their native speeds; explicit end holds only in comparisons."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-3';V=P/'preview';B=R/'animation/intro-v4-2/preview'
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
big=ImageFont.truetype(font,27,index=1);small=ImageFont.truetype(font,19,index=1)
def run(args):subprocess.run(args,cwd=R,check=True)
def make(name,oldstart,oldframes,newstart,newframes,duration,labels):
 header=Image.new('RGB',(1080,80),'#090D16');d=ImageDraw.Draw(header)
 for j,(title,sub) in enumerate(labels):
  d.text((j*540+18,5),title,font=big,fill='#F8FAFC');d.text((j*540+18,44),sub,font=small,fill='#94A3B8')
 hp=P/'build'/f'{name}-header.png';header.save(hp)
 fc=f'[0:v]trim=start_frame={oldstart}:end_frame={oldstart+oldframes},setpts=PTS-STARTPTS,scale=540:960:flags=lanczos,tpad=stop_mode=clone:stop_duration={duration},trim=duration={duration}[a];[1:v]trim=start_frame={newstart}:end_frame={newstart+newframes},setpts=PTS-STARTPTS,scale=540:960:flags=lanczos,tpad=stop_mode=clone:stop_duration={duration},trim=duration={duration}[b];[a][b]hstack=inputs=2[body];[2:v][body]vstack=inputs=2[out]'
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(B/'intro-v4-2-dark.mp4'),'-i',str(V/'intro-v4-3-dark.mp4'),'-loop','1','-framerate','60','-i',str(hp),'-filter_complex',fc,'-map','[out]','-t',str(duration),'-frames:v',str(round(duration*60)),'-an','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(V/(name+'.mp4'))])
make('compare-a-intro',0,361,0,211,6.5,[('V4.2 · 초반 6초','배속 없음 · 6초 이후 마지막 프레임 유지'),('V4.3 · 초반 3.5초','배속 없음 · 3.5초 이후 마지막 프레임 유지')])
make('compare-b-cause-effect',576,223,450,349,5.8,[('V4.2 · 9.6–13.3초','조절 중 카드 반응 · 이후 마지막 프레임 유지'),('V4.3 · 7.5–13.3초','조절 → 0.25초 정착 → 피드 → 결과 확인')])
(V/'comparison-method.json').write_text(json.dumps({'left':'V4.2','right':'V4.3','playback_speed_multiplier':1,'compare_a_seconds':6.5,'compare_b_seconds':5.8,'note':'Different original durations. The shorter pane visibly holds its last frame; no speed-up or time-normalization. These are comparison montages, not final animation renders.'},ensure_ascii=False,indent=2)+'\n')
print('Comparison A/B complete')
