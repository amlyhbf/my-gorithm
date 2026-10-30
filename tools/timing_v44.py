"""V4.3 motion speeds remain unchanged. Only entrances and response onset differ."""
SHIFT=24
JOIN=90
SLIDERS=[(492,546),(633,699)]
OLD_RESPONSES=[(537,579),(690,759)]
RESPONSES=[(532,574),(678,747)]
# Frame guards include the negligible cubic fitting tails, not extra choreography.
PATCH_WINDOWS=[(517,615),(663,795)]
CHANGED=[(0,89),*PATCH_WINDOWS]
REUSE=[(90,516,-24),(616,662,-24),(796,959,0)]
SCENES=[(0,90),(90,234),(234,474),(474,798),(798,960)]
