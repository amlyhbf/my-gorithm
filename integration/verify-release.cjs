/* A successful build alone must not allow an emulator build to replace the live site. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'release.json')));
assert.equal(manifest.projectId,'my-gorithm');assert.equal(manifest.emulator,false,'Refusing to deploy an emulator build');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
for(const relative of [...html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)].map(m=>m[1]))assert(fs.existsSync(path.join(dist,relative)),'Missing entry asset '+relative);
const cards=JSON.parse(fs.readFileSync(path.join(dist,'data/cards.json')));assert.equal(cards.length,73);assert.equal(new Set(cards.map(c=>c.id)).size,73);
for(const card of cards){assert(!card.reviewMetadata);if(card.imageUrl.startsWith('/'))assert(fs.existsSync(path.join(dist,card.imageUrl)));}
if(fs.existsSync(path.join(__dirname,'assets-manifest.json')))for(const item of require('./assets-manifest.json')){
  const bytes=fs.readFileSync(path.join(dist,item.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256,item.path);
}
for(const file of fs.readdirSync(path.join(dist,'assets')).filter(f=>f.endsWith('.js'))){
 const text=fs.readFileSync(path.join(dist,'assets',file),'utf8');
 assert(!text.includes('demo-mamgorithm-merge'),'Emulator project found in production JS');
 assert(!text.includes('__mamgorithmEmulatorAuth'),'Test-only auth hook found in production JS');
}
console.log('PASS: production Firebase release, 73 cards, reviewed media, complete assets, no emulator configuration.');
