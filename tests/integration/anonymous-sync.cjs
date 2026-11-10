const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),runtime=fs.readFileSync(path.join(root,'integration/runtime.js'),'utf8');
const cards=JSON.parse(fs.readFileSync(path.join(root,'content/cards.json')));
function setup(remote){
 const writes=[],storage=new Map();let requestCount=0,anonymousError=false;
 const sandbox={console,setTimeout,clearTimeout,Date,JSON,Map,Set,Number,Promise,
   CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail}},
   document:{getElementById(){return null},addEventListener(){}},window:{dispatchEvent(){},addEventListener(){}},
   localStorage:{setItem(k,v){storage.set(k,v)},getItem(k){return storage.get(k)||null}},
   Jt:{buildFullTelemetrySnapshot(){return{personalInfo:{},behavior:{cardClickCount:2}}},totalDwellSec:4,cardClickCount:2,cardDwellMap:{}},
   Et:null,Oe:{},Ki:{},U:{weights:{study:50,tech:50,culture:50,hobby:50},savedIds:new Set(['tech-13'])},
   mt:{WEIGHTS:'weights',SAVED_IDS:'saved'},sn:{BEHAVIOR:'behavior'},Zn(){return'ko'},sB(){return cards},Dp(){},bp(){},tt(){},
   yu(db,collection,uid){return{collection,uid}},async Rm(ref,data){writes.push({ref,data})},
   async C_(){return{exists:()=>!!remote,data:()=>remote||{}}},
   async Ym(){requestCount++;if(anonymousError)throw Error('offline');return{user:{uid:'anonymous-fixture',isAnonymous:true}}}
 };
 const context=vm.createContext(sandbox);vm.runInContext(runtime,context);
 return{context,writes,storage,requests:()=>requestCount,setAnonymousError(v){anonymousError=v}};
}
(async()=>{
 const checks=[];let q=setup(null);await q.context.Jt.syncToFirestore();assert.equal(q.writes.length,0);assert(q.storage.has('behavior'));
 checks.push('No invented local UID is used for a database write before Firebase authentication');
 const one=q.context.mergeEnsureAnonymous(),two=q.context.mergeEnsureAnonymous();assert.equal(one,two);await one;assert.equal(q.requests(),1);
 checks.push('Concurrent initialization creates only one anonymous sign-in request');
 q=setup(null);q.setAnonymousError(true);await q.context.mergeEnsureAnonymous();q.setAnonymousError(false);await q.context.mergeEnsureAnonymous();assert.equal(q.requests(),2);
 checks.push('Failed anonymous authentication can retry without blocking local use');
 q=setup({weights:{study:80,tech:20,culture:0,hobby:0},savedIds:['culture-20','invalid-id']});q.context.Et={uid:'anonymous-fixture',isAnonymous:true};await q.context.mergeHandleAuth(q.context.Et);
 assert.equal(q.context.U.weights.study,80);assert.deepEqual([...q.context.U.savedIds],['culture-20']);
 assert(q.writes.some(w=>w.data.weights?.study===80));assert(q.writes.some(w=>w.data.personalInfo?.userId==='anonymous-fixture'));
 q.context.U.savedIds.clear();await q.context.mergeSaveCloud();assert.equal(q.writes.at(-1).data.savedIds.length,0);
 checks.push('Anonymous identities restore cloud state, collect telemetry and preserve bookmark deletions');
 q=setup(null);let resolveRead;q.context.C_=()=>new Promise(resolve=>resolveRead=resolve);
 q.context.Et={uid:'old-fixture',isAnonymous:true};const pending=q.context.mergeHandleAuth(q.context.Et);
 q.context.Et=null;await q.context.mergeHandleAuth(null);resolveRead({exists:()=>true,data:()=>({weights:{study:100,tech:0,culture:0,hobby:0},savedIds:[]})});await pending;
 assert.equal(q.context.U.weights.study,50);assert(q.context.U.savedIds.has('tech-13'));assert.equal(q.writes.length,0);
 checks.push('A delayed response after logout cannot overwrite preferences or write to the previous UID');
 q=setup(null);q.context.C_=async()=>{throw Error('permission-denied')};q.context.Et={uid:'write-only-fixture',isAnonymous:true};await q.context.mergeHandleAuth(q.context.Et);
 assert(q.writes.some(w=>w.data.personalInfo?.userId==='write-only-fixture'));assert(!q.writes.some(w=>w.data.weights));
 checks.push('A failed settings read preserves local preferences and still attempts telemetry without overwriting cloud settings');
 q.context.Et=null;await q.context.mergeHandleAuth(null);const count=q.writes.length;await q.context.Jt.syncToFirestore();await q.context.mergeSaveCloud();assert.equal(q.writes.length,count);
 checks.push('Invalidated authentication blocks subsequent writes until a new authenticated UID is ready');
 const result={passed:true,checks,backend:'in-memory race/error tests',productionWrites:0};fs.writeFileSync(path.join(root,'docs/firebase-integration/anonymous-sync-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
})().catch(error=>{console.error(error);process.exit(1)});
