/* Keep Git source text-only through the connector; release/source ZIPs contain actual media.
   Every remote media byte must match the reviewed SHA256 before it enters the build. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),manifest=require('./assets-manifest.json');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
let fetched=0;
for(const item of manifest){
 const file=path.join(root,'public',item.path);
 if(fs.existsSync(file)&&hash(fs.readFileSync(file))===item.sha256)continue;
 const bytes=execFileSync('curl',['-fsSL','--retry','2','--max-time','45',item.url],{maxBuffer:32*1024*1024});
 if(bytes.length!==item.bytes||hash(bytes)!==item.sha256)throw Error('Reviewed media checksum mismatch: '+item.path);
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);fetched++;
}
console.log('Reviewed media verified:',manifest.length,'files;',fetched,'downloaded.');
