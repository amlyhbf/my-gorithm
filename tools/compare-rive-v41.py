#!/usr/bin/env python3
from pathlib import Path
import argparse,subprocess,json
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4-1';V=P/'preview';BASE=R/'animation/intro-v4/preview/intro-v4-dark.mp4'
a=argparse.ArgumentParser();a.add_argument('mode',choices=['tests','final']);mode=a.parse_args().mode
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
for name,start,end in [('motion-0-6',0,6),('morph-6-10',6,10)]:
 fps=30 if mode=='tests' else 60;w,h=(360,640) if mode=='tests' else (540,960);pad=64 if mode=='tests' else 80
 if mode=='tests':new=V/('test-v41-motion-0-6.mp4' if start==0 else 'test-v41-morph-6-10.mp4');ns=0;ne=end-start
 else:new=V/'intro-v4-1-dark.mp4';ns=start;ne=end
 def side(index,s,e,label):return f"[{index}:v]trim=start={s}:end={e},setpts=PTS-STARTPTS,fps={fps},scale={w}:{h}:flags=lanczos,pad={w}:{h+pad}:0:{pad}:color=0x090D16,drawtext=fontfile={font}:text='{label}':x=20:y=20:fontsize={24 if mode=='tests' else 34}:fontcolor=white"
 filters=side(0,start,end,'V4 - BEFORE')+'[a];'+side(1,ns,ne,'V4.1 - REFINED')+'[b];[a][b]hstack=inputs=2[v]'
 out=V/f'{"test-" if mode=="tests" else ""}compare-{name}.mp4'
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(BASE),'-i',str(new),'-filter_complex',filters,'-map','[v]','-an','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],cwd=R,check=True)
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=width,height,avg_frame_rate,nb_frames:format=duration,size','-of','json',str(out)],text=True));(V/(out.name+'.json')).write_text(json.dumps(info,indent=2)+'\n');print(out.name,info['format'])
