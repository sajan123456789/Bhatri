importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBm-B0nhpfBt776iDZJuQRplNrOhy9xdiY",
  authDomain: "careersteps-afa5d.firebaseapp.com",
  projectId: "careersteps-afa5d",
  storageBucket: "careersteps-afa5d.firebasestorage.app",
  messagingSenderId: "197033973372",
  appId: "1:197033973372:web:b5c6ad50bf8f68aee5dbf9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/android-chrome-192x192.png"
  });
});
