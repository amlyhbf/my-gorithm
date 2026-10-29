#!/usr/bin/env python3
"""Capture every frame with the official Rive CLI, then encode without frame interpolation."""
from pathlib import Path
import subprocess,json,hashlib
ROOT=Path(__file__).resolve().parent.parent
P=ROOT/'animation/intro-v2/preview';frames=P/'frames-desktop';frames.mkdir(parents=True,exist_ok=True)
rive=str(ROOT/'tools/rive')
subprocess.run([rive,'animation/intro-v2','--verify'],cwd=ROOT,check=True)
subprocess.run([rive,'inspect','animation/intro-v2','--summary'],cwd=ROOT,check=True)
with (P/'render.log').open('w') as log:
 for index in range(204):
  # The final frame captures t=3.4 exactly; the remaining samples advance at 1/60 s.
  advance=204 if index==203 else index+1
  subprocess.run([rive,'animation/intro-v2','--artboard=Desktop',f'--screenshot={frames/index.__format__("04d")}.png',f'--advance={advance}'],cwd=ROOT,stdout=log,stderr=log,check=True)
  if (index+1)%24==0:print(f'Rendered {index+1}/204 native Full HD frames',flush=True)
def run(*args):subprocess.run(args,cwd=ROOT,check=True)
run('ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','60','-i',str(frames/'%04d.png'),'-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',str(P/'intro-v2.mp4'))
# GIF delays use centiseconds; 25fps gives exact 4cs timing, unlike 60fps.
run('ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','60','-i',str(frames/'%04d.png'),'-vf','fps=25,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a','-loop','-1',str(P/'intro-v2.gif'))
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_entries','stream=width,height,avg_frame_rate,r_frame_rate,duration,nb_frames,nb_read_frames,bit_rate:format=duration,size,bit_rate','-of','json',str(P/'intro-v2.mp4')],text=True))
probe['sha256']=hashlib.sha256((P/'intro-v2.mp4').read_bytes()).hexdigest()
(P/'media-info.json').write_text(json.dumps(probe,indent=2)+'\n')
print(json.dumps(probe,indent=2),flush=True)
