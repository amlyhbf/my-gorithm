"""Shared authored timing, not a speed multiplier applied to an old movie."""
import math
from motion_v41 import q5
FPS=60
SLIDERS=[(468,522),(609,675)]
RESPONSES=[(537,579),(690,759)]
SCENES=[(0,210),(210,450),(450,798),(798,960)]
def weights(f):
    study=50+5*math.floor(10*float(q5((f-468)/54))+.5)
    q=float(q5((f-609)/66))
    if q<=.08:tech=culture=50
    else:
        tech=50-5*max(1,math.floor(4*q+.5))
        culture=50-5*max(1,math.floor(6*q+.5))
    return [study,tech,culture,50]
