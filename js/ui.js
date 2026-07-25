 // Daily Live Counter
const today = new Date();
const dayKey = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

let savedDay = localStorage.getItem("careerstepsDay");
let savedCount = localStorage.getItem("careerstepsCount");

if (savedDay !== dayKey) {
    savedCount = Math.floor(Math.random() * 31) + 35; // 35-65
    localStorage.setItem("careerstepsDay", dayKey);
    localStorage.setItem("careerstepsCount", savedCount);
}

document.getElementById("liveUsers").innerHTML =
"⏰ Limited Spots: " + savedCount + " students testing today";
 
  // Mobile Menu Toggle Logic
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.onclick = function() {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        // Accessibility Fix: Add aria-expanded
        menuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    };
  }

 // Show Exit Popup only once after 5 seconds
if (!sessionStorage.getItem("exitPopupShown")) {

    setTimeout(() => {

        document.getElementById("exitPopup").classList.remove("hidden");

        sessionStorage.setItem("exitPopupShown", "true");

    }, 5000);

}
