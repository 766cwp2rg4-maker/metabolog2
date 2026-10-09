const VERSION='metabolog-cache-v4.0.0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('metabolog-cache-')&&n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 // Always prefer fresh HTML for update; cached offline fallback.
 if(e.request.mode==='navigate'||new URL(e.request.url).pathname.endsWith('/index.html')){
   e.respondWith(fetch(e.request).then(r=>{if(r.ok){const clone=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',clone));}return r;}).catch(()=>caches.match('./index.html')));
 }else{e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const clone=r.clone();caches.open(VERSION).then(c=>c.put(e.request,clone));}return r;})));}
});
