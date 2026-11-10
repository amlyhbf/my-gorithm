/* Public static files only. Firebase, Google login and cross-origin media bypass this cache. */
const MERGE_CACHE='mamgorithm-firebase-integrated-20261110-v1';
const SHELL=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(MERGE_CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mamgorithm-')&&key!==MERGE_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok && url.pathname==='/'){const cache=await caches.open(MERGE_CACHE);await cache.put('/index.html',response.clone());}
      return response;
    }).catch(async()=>await caches.match('/index.html')||Response.error()));return;
  }
  // Hash-named JS, CSS and optimized images are immutable. Do not store large intro videos.
  if(!/^\/(assets\/|images\/optimized\/|icon-\d+\.png|favicon|apple-touch-icon)/.test(url.pathname)||request.headers.has('range'))return;
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(async response=>{
    if(response.ok){const cache=await caches.open(MERGE_CACHE);await cache.put(request,response.clone());}return response;
  })));
});
