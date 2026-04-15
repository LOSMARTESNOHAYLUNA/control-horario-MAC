const CACHE_NAME = 'control-horario-v1';

// Install: cache shell
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Listen for messages from the main app to show notifications
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: e.data.icon || undefined,
      badge: e.data.icon || undefined,
      tag: e.data.tag || 'control-horario',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data: { url: self.location.origin }
    });
  }
});

// Click notification -> open the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes(self.location.origin) && 'focus' in c) return c.focus();
      }
      return clients.openWindow(self.location.origin);
    })
  );
});
