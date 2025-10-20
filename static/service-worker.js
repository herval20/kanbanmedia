self.addEventListener('install', (event) => {
    console.log('✅ Service Worker installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activated');
  });
  
  self.addEventListener('fetch', (event) => {
    // Optional: add caching later if you want offline mode
  });
  