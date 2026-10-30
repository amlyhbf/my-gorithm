#!/usr/bin/env python3
from pathlib import Path
import os
R=Path(__file__).resolve().parent.parent;os.environ.setdefault('MPLCONFIGDIR',str(R/'.rive-tools/mpl'))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
fp=FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
fig,axes=plt.subplots(2,1,figsize=(14,8),layout='constrained',facecolor='#090D16')
for ax,title,cuts,inputs,feeds in [
 (axes[0],'V4.2 · 조절과 피드 움직임이 겹침',[0,6,10,13,16],[(10,11.1),(11.6,754/60)],[(649/60,679/60),(718/60,754/60)]),
 (axes[1],'V4.3 · 슬라이더 먼저, 피드 나중',[0,3.5,7.5,13.3,16],[(7.8,8.7),(10.15,11.25)],[(8.95,9.65),(11.5,12.65)])]:
 ax.set_facecolor('#090D16');ax.set_title(title,fontproperties=fp,color='#F8FAFC',loc='left',fontsize=18)
 for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
  ax.broken_barh([(a,b-a)],(2.25,.52),facecolors=['#334155','#4F46E5','#0284C7','#059669'][i]);ax.text((a+b)/2,2.51,['등장·교차','모핑','관심도·피드','브랜드'][i],ha='center',va='center',fontproperties=fp,color='white',fontsize=12)
 for a,b in inputs:ax.broken_barh([(a,b-a)],(1.3,.5),facecolors='#589CFF')
 for a,b in feeds:ax.broken_barh([(a,b-a)],(.35,.5),facecolors='#059669')
 if 'V4.3' in title:
  for (_,z),(a,b) in zip(inputs,feeds):
   ax.axvspan(z,a,color='white',alpha=.1);ax.annotate('0.25초 정착',((z+a)/2,1.04),xytext=(z-.7,.95),fontproperties=fp,color='#CBD5E1',fontsize=10)
 ax.set_yticks([.6,1.55,2.51],['피드 재구성','슬라이더 조절','장면'],fontproperties=fp,color='#F8FAFC');ax.set_xlim(0,16);ax.set_ylim(0,3.1);ax.set_xticks(range(17));ax.tick_params(axis='x',colors='#94A3B8');ax.grid(axis='x',alpha=.1,color='white');ax.set_xlabel('영상 재생 시간 (초)',fontproperties=fp,color='#94A3B8')
 for spine in ax.spines.values():spine.set_visible(False)
fig.savefig(R/'animation/intro-v4-3/preview/timeline-before-after.png',dpi=140)
