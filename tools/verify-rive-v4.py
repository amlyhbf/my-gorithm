#!/usr/bin/env python3
"""Read-only checks against the actual recommendation functions and native RML."""
from pathlib import Path
import json,subprocess,xml.etree.ElementTree as E,collections
R=Path(__file__).resolve().parent.parent;P=R/'animation/intro-v4'
states=json.loads((P/'logic-snapshots.json').read_text());root=E.parse(P/'scene.rml').getroot()
for s in states:
 assert len(s['feed'])==12
 assert all(0<=w<=100 and w%5==0 for w in s['weights'])
 counts=collections.Counter(x['category'] for x in s['feed'])
 assert all(counts.get(c,0)==v['cardCount'] for c,v in s['categories'].items())
# Independently rerun the checked-in website source, not the graphics generator.
js="""
import fs from 'node:fs';import vm from 'node:vm';import {CONTENT_DATA} from './data.js';let src=fs.readFileSync('script.js','utf8');src=src.slice(src.indexOf('function calculateAllocation()'),src.indexOf('function renderAllViews('));let states=JSON.parse(fs.readFileSync(0,'utf8'));for(let s of states){let ctx={CONTENT_DATA,state:{weights:Object.fromEntries(['study','tech','culture','hobby'].map((n,i)=>[n,s.weights[i]])),feedSize:12,contentType:'all',shuffleSeed:0}};vm.createContext(ctx);vm.runInContext(src,ctx);let a=ctx.calculateAllocation();if(JSON.stringify(a.categories)!==JSON.stringify(s.categories))throw Error('Allocation mismatch');if(JSON.stringify(ctx.buildFeedList(a).map(x=>x.id))!==JSON.stringify(s.feed.map(x=>x.id)))throw Error('Feed mismatch');}console.log(states.length);
"""
matched=int(subprocess.check_output(['node','--input-type=module','-e',js],input=json.dumps(states),cwd=R,text=True))
boards=[]
for b in root.findall('Artboard'):
 anim=b.find('LinearAnimation');assert anim.get('fps')=='60' and anim.get('duration')=='960'
 heroes=[n for n in b.findall('Node/Node') if n.get('name','').endswith('continuous morph material')];assert len(heroes)==4
 for hero in heroes:
  # The material never fades away after its birth; it becomes the final track.
  op=[k for k in anim.findall('KeyedObject') if k.get('objectId')==hero.get('id') and k.find('KeyedProperty').get('property')=='opacity']
  assert len(op)==1
  ks=op[0].findall('KeyedProperty/KeyFrameDouble')
  assert float(ks[-1].get('value'))==1 and int(ks[-1].get('frame'))<120
  verts=hero.findall('Shape/PointsPath/CubicDetachedVertex');assert len(verts)==8
  for v in verts:
   assert any(k.get('objectId')==v.get('id') for k in anim.findall('KeyedObject'))
 boards.append(b.get('name'))
out={'website_states_verified':matched,'feed_count':12,'initial_card_counts':{k:v['cardCount'] for k,v in states[0]['categories'].items()},'final_card_counts':{k:v['cardCount'] for k,v in states[-1]['categories'].items()},'actual_feed_ids_match':True,'artboards':boards,'continuous_eight_vertex_hero_paths_per_theme':4,'hero_material_never_fades_after_birth':True,'native_timeline_fps':60,'native_timeline_frames':960,'native_timeline_seconds':16,'external_writes':False}
(P/'preview/logic-verification.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
