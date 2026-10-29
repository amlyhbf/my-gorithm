#!/usr/bin/env python3
"""Aligned V4.1/V4.2 comparisons, using the official native-rendered videos."""
from pathlib import Path
import argparse,json,subprocess
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-2';V=P/'preview'
p=argparse.ArgumentParser();p.add_argument('mode',choices=['tests','final']);a=p.parse_args()
for name,start,end in [('morph-6-10',6,10),('feed-9-6-13-2',9.6,13.2)]:
 test=a.mode=='tests';fps=30 if test else 60;w,h,pad=(360,640,64) if test else (540,960,80)
 base=R/'animation/intro-v4-1/preview/intro-v4-1-dark.mp4';new=V/(f'test-{name}.mp4' if test else 'intro-v4-2-dark.mp4')
 def side(i,s,e,label):
  return f"[{i}:v]trim=start={s}:end={e},setpts=PTS-STARTPTS,fps={fps},scale={w}:{h}:flags=lanczos,pad={w}:{h+pad}:0:{pad}:color=0x090D16,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='{label}':x=18:y=18:fontsize={24 if test else 34}:fontcolor=white"
 filters=side(0,start,end,'V4.1 - BEFORE')+'[a];'+side(1,0 if test else start,end-start if test else end,'V4.2 - REFINED')+'[b];[a][b]hstack=inputs=2[v]'
 out=V/f'{"test-" if test else ""}compare-{name}.mp4'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(base),'-i',str(new),'-filter_complex',filters,'-map','[v]','-an','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],check=True)
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,nb_frames,nb_read_frames:format=duration,size,bit_rate','-of','json',str(out)],text=True));(V/(out.name+'.json')).write_text(json.dumps(info,indent=2)+'\n');print(out.name,info['format'],flush=True)
