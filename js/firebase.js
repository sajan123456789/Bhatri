 <!-- login -->
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js";
 
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
 
const firebaseConfig = {
  apiKey: "AIzaSyBm-B0nhpfBt776iDZJuQRplNrOhy9xdiY",
  authDomain: "careersteps-afa5d.firebaseapp.com",
  projectId: "careersteps-afa5d",
  storageBucket: "careersteps-afa5d.firebasestorage.app",
  messagingSenderId: "197033973372",
  appId: "1:197033973372:web:b5c6ad50bf8f68aee5dbf9",
  measurementId: "G-90SZVYJ200"
};

// Unique variable names to prevent identifier collision errors
const csApp = initializeApp(firebaseConfig);
const csAuth = getAuth(csApp);
const messaging = getMessaging(csApp);
const db = getFirestore(csApp);
const provider = new GoogleAuthProvider();

// Popup Login function
window.googleLogin = () => {
  signInWithPopup(csAuth, provider)
    .then((result) => {
      console.log("Logged in user:", result.user);
      window.location.reload(); 
    })
    .catch((error) => {
      alert("Sign-in Error: " + error.message);
      console.error(error);
    });
};

window.googleLogout = () => {
  signOut(csAuth).then(() => {
    window.location.reload();
  });
};

// Dono areas (Desktop aur Mobile) ko handle karne ka sahi logic
onAuthStateChanged(csAuth, (user) => {
  const authDesktop = document.getElementById("auth-area-desktop");
  const authMobile = document.getElementById("auth-area-mobile");

  if (user) {
    // Notification aur FCM Token logic
    Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: "BOjvZHxTatfLyyJTa-s-ey-3qQfsv2JSLgjD0twb4VWTnX6wN0Ux3GXJ7UYcnR7rnAeGzg4ZDFsDkd_2ZBq7VsU"
          });
          console.log("FCM Token:", token);

          if (csAuth.currentUser) {
            await setDoc(
              doc(db, "fcmTokens", csAuth.currentUser.uid),
              {
                uid: csAuth.currentUser.uid,
                token: token,
                updatedAt: new Date().toISOString()
              }
            );
          }
        } catch (err) {
          console.error("FCM Token Error:", err);
        }
      }
    });

    // 1. Desktop HTML Render - Added width/height and alt labels to avoid CLS & a11y flags
    if (authDesktop) {
      authDesktop.innerHTML = `
        <div class="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <img src="${user.photoURL}" alt="User Profile Image" width="28" height="28" class="w-7 h-7 rounded-full border border-blue-500 object-cover">
          <span class="hidden lg:block text-white text-xs font-semibold max-w-[100px] truncate">${user.displayName}</span>
          <button aria-label="Logout" onclick="googleLogout()"
            class="bg-red-600/90 hover:bg-red-500 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white transition">
            Logout
          </button>
        </div>
      `;
    }

    // 2. Mobile Menu HTML Render
    if (authMobile) {
      authMobile.innerHTML = `
        <div class="flex flex-col items-center gap-3 w-full max-w-[200px]">
          <div class="flex items-center gap-2">
            <img src="${user.photoURL}" alt="User Profile Image" width="32" height="32" class="w-8 h-8 rounded-full border border-blue-500 object-cover">
            <span class="text-white text-sm font-semibold truncate max-w-[120px]">${user.displayName}</span>
          </div>
          <button aria-label="Logout" onclick="googleLogout()"
            class="w-full bg-red-600 hover:bg-red-500 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white transition">
            Logout
          </button>
        </div>
      `;
    }
  } else {
    // Agar login nahi hai toh dono jagah Sign In ka proper button dikhao
    const signInBtnDesktop = `
      <button aria-label="Sign In via Google" onclick="googleLogin()"
        class="bg-white text-black px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-gray-200 transition shadow-md whitespace-nowrap">
        Sign In
      </button>
    `;
    const signInBtnMobile = `
      <button aria-label="Sign In via Google" onclick="googleLogin()"
        class="bg-white text-black px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-gray-200 transition shadow-md whitespace-nowrap w-full">
        Sign In
      </button>
    `;

    if (authDesktop) authDesktop.innerHTML = signInBtnDesktop;
    if (authMobile) authMobile.innerHTML = signInBtnMobile;
  }
});
 
const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("newsletterEmail").value.trim();

    if (!email) return;

    try {
      // 1. Firestore me save
      await addDoc(collection(db, "newsletter"), {
        email: email,
        createdAt: serverTimestamp()
      });

      // 2. Send Welcome Email via EmailJS safely (without blocking the success flow)
      try {
        await window.emailjs.send(
          "service_vl0mhsj",
          "template_1e97eiq",
          {
            to_name: "CareerSteps User",
            to_email: email,
          }
        );
      } catch (emailErr) {
        console.error("EmailJS Error: Failed to send welcome email.", emailErr);
      }
     
      trackCTA("Newsletter_Signup", "conversion");
      alert("Thanks for subscribing!");
      newsletterForm.reset();

    } catch (err) {
      console.error("Firestore Error: Failed to save email.", err);
      alert("Something went wrong. Please try again later.");
    }
  });
}
</script>
