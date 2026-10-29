#!/usr/bin/env python3
"""Official Rive per-frame rendering; FFmpeg only encodes these frames."""
from pathlib import Path
import subprocess,json,hashlib
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v3/preview';P.mkdir(parents=True,exist_ok=True)
rive=str(R/'tools/rive')
def run(args,**kw):return subprocess.run(args,cwd=R,check=True,**kw)
run([rive,'animation/intro-v3','--verify'])
run([rive,'inspect','animation/intro-v3','--summary'])
with (P/'render.log').open('w') as log:
 for theme,count,step in [('Dark',270,1),('Light',90,3)]:
  d=P/f'frames-{theme.lower()}';d.mkdir(exist_ok=True)
  for i in range(count):
   f=270 if i==count-1 else max(1,i*step+1)
   run([rive,'animation/intro-v3',f'--artboard={theme}',f'--advance={f}',f'--screenshot={d/f"{i:04d}.png"}']+(['--scale=0.5'] if theme=='Light' else []),stdout=log,stderr=log)
   if (i+1)%30==0:print(f'{theme}: {i+1}/{count} native frames rendered',flush=True)
  if theme=='Dark':
   run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','60','-i',str(d/'%04d.png'),'-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(P/'intro-v3-dark.mp4')])
   vf='fps=20,scale=540:960:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a'
  else:vf='split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a'
  run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','60' if theme=='Dark' else '20','-i',str(d/'%04d.png'),'-vf',vf,'-loop','-1',str(P/f'intro-v3-{theme.lower()}.gif')])
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,r_frame_rate,duration,nb_frames,nb_read_frames,bit_rate:format=duration,size,bit_rate','-of','json',str(P/'intro-v3-dark.mp4')],text=True))
probe['sha256']=hashlib.sha256((P/'intro-v3-dark.mp4').read_bytes()).hexdigest();(P/'media-info.json').write_text(json.dumps(probe,indent=2)+'\n');print(json.dumps(probe,indent=2),flush=True)
