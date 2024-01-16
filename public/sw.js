importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
  );
  
  const {setCatchHandler, setDefaultHandler,registerRoute} = workbox.routing;
  const {NetworkOnly} = workbox.strategies;
  
  const pageFallback = 'offline.html';
  const imageFallback = "./bro-logo.png";
  const fontFallback = false;
   
  setDefaultHandler(new NetworkOnly());

  self.addEventListener('notificationclick', (event) => {
    event.notification.close(); 
    var fullPath = self.location.origin + event.notification.data.path; 
    clients.openWindow(fullPath); 
  });
  // self.addEventListener('sync', event => {
  //   if (event.tag === 'database-sync') {
  //     event.waitUntil(console.log("syncing bro"))
  //   }
  // });
  function doTheWork(){
    console.log("you got offline bro")
    self.registration.showNotification('you got offline bro', {
      body: 'idk why am i sending notification',
      icon: './android/android-launchericon-144-144.png',
    })
    // let not = new Notification("you got offline bro")
  }
  
  self.addEventListener("offline",(events)=>{
    console.log(events);
    self.sync.register('offlines')
  })
  
  self.addEventListener('sync', event => {
    if (event.tag === 'offlines') {
        event.waitUntil(
          doTheWork()
          );
    }
  });
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'offlines') {
    }
    // Check for correct tag on the periodicSyncPermissionsync event.
  });
  self.addEventListener('install', event => {
    const files = [pageFallback,"/sw.js"];
    if (imageFallback) {
      files.push(imageFallback);
    }
    if (fontFallback) {
      files.push(fontFallback);
    }
  
    event.waitUntil(
      self.caches
        .open('workbox-offline-fallbacks')
        .then(cache => cache.addAll(files))
    );
  });
  self.addEventListener('message', (event) => {
    if (event.data.type === 'workbox-offline-fallbacks') {
        event.waitUntil(
            caches.open("workbox-offline-fallbacks")
                .then( (cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});
  const handler = async options => {
    const dest = options.request.destination;
    const cache = await self.caches.open('workbox-offline-fallbacks');
  
    if (dest === 'document') {
      return (await cache.match(pageFallback)) || Response.error();
    }
  
    if (dest === 'image' && imageFallback !== false) {
      return (await cache.match(imageFallback)) || Response.error();
    }
  
    if (dest === 'font' && fontFallback !== false) {
      return (await cache.match(fontFallback)) || Response.error();
    }
  
    return Response.error();
  };
  
  setCatchHandler(handler);