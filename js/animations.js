(function(){
  'use strict';

  const supportsIO = 'IntersectionObserver' in window;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Generic rAF-throttle helper — ensures handlers run at most once per frame,
     preventing scroll/mousemove jank from firing dozens of times per second. */
  function rafThrottle(fn){
    let ticking = false;
    return function(...args){
      if(!ticking){
        ticking = true;
        requestAnimationFrame(()=>{
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  }

  /* Remove will-change once a transition finishes, so the browser can free the
     GPU compositing layer instead of holding it for the rest of the page's life
     (persistent will-change on many elements is itself a common Android jank cause). */
  function clearWillChangeOnEnd(el){
    const done = ()=>{
      el.style.willChange = 'auto';
      el.removeEventListener('transitionend', done);
    };
    el.addEventListener('transitionend', done);
  }

  /* 1. Reading Progress Bar — rAF-throttled + passive listener */
  const progressBar = document.getElementById('progressBar');
  function updateProgressBar(){
    if(!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  const onScrollProgress = rafThrottle(updateProgressBar);
  window.addEventListener('scroll', onScrollProgress, { passive:true });
  window.addEventListener('resize', onScrollProgress, { passive:true });
  updateProgressBar();

  /* 2. Scroll Reveal (major sections) — CSS handles the card stagger now,
     so this only ever toggles one class per section (cheap, no per-card
     style writes = no layout thrash while scrolling). */
  const revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function activateReveal(el){
    if(el.classList.contains('active')) return;
    el.classList.add('active');
    clearWillChangeOnEnd(el);
    el.querySelectorAll('.card-box').forEach(clearWillChangeOnEnd);
  }

  function revealAllImmediately(){
    revealEls.forEach(activateReveal);
  }

  if(!supportsIO || prefersReducedMotion){
    // Older/limited mobile browsers or reduced-motion users: show everything now.
    revealAllImmediately();
  } else {
    const revealObserver = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          activateReveal(entry.target);
          obs.unobserve(entry.target); // run once
        }
      });
    }, { threshold: [0, 0.1, 0.25], rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el=> revealObserver.observe(el));

    /* Safety-net fallback: some Android WebViews / in-app browsers (older
       Facebook/Instagram/Samsung webviews) fire IntersectionObserver late or
       inconsistently, which is the classic "section stays blank until refresh"
       bug. This lightweight, passive, rAF-throttled scroll check tops up any
       section the observer missed, and stops once nothing is left to check. */
    let pending = revealEls.slice();
    function sweepPending(){
      if(pending.length === 0) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(el=>{
        if(el.classList.contains('active')) return false;
        const rect = el.getBoundingClientRect();
        const visible = rect.top < vh * 0.95 && rect.bottom > 0;
        if(visible){
          activateReveal(el);
          return false;
        }
        return true;
      });
      if(pending.length === 0){
        window.removeEventListener('scroll', throttledSweep);
        window.removeEventListener('resize', throttledSweep);
      }
    }
    const throttledSweep = rafThrottle(sweepPending);
    window.addEventListener('scroll', throttledSweep, { passive:true });
    window.addEventListener('resize', throttledSweep, { passive:true });
    // Run once after layout settles (fonts/images can shift positions right after load).
    window.addEventListener('load', ()=> requestAnimationFrame(sweepPending), { once:true });
    setTimeout(sweepPending, 400);
  }

  /* 3. Animated Number Counter */
  const counterEls = Array.prototype.slice.call(document.querySelectorAll('[data-counter]'));

  function animateCounter(el){
    const target = parseFloat(el.getAttribute('data-target')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';

    if(prefersReducedMotion){
      el.textContent = target + suffix;
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function tick(now){
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;

      if(progress < 1){
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if(!supportsIO){
    counterEls.forEach(animateCounter);
  } else {
    const counterObserver = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCounter(entry.target);
          obs.unobserve(entry.target); // run once
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -5% 0px' });

    counterEls.forEach(el=> counterObserver.observe(el));
  }

  /* 8. Mouse Parallax on Hero Background — lazy-initialized (only wired up
     once the browser is idle / hero is actually in view) and rAF-throttled
     so it never runs more than 60x per second even on very fast mice. */
  function initHeroParallax(){
    const heroSection = document.getElementById('heroSection');
    const heroParallax = document.getElementById('heroParallax');
    if(!heroSection || !heroParallax) return;
    if(!window.matchMedia('(pointer: fine)').matches) return; // skip entirely on touch/Android
    if(prefersReducedMotion) return;

    const onMove = rafThrottle((e)=>{
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const moveX = x * 25;
      const moveY = y * 25;
      heroParallax.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    heroSection.addEventListener('mousemove', onMove, { passive:true });
    heroSection.addEventListener('mouseleave', ()=>{
      heroParallax.style.transform = 'translate3d(0px, 0px, 0)';
    }, { passive:true });
  }

  if('requestIdleCallback' in window){
    requestIdleCallback(initHeroParallax, { timeout: 2000 });
  } else {
    setTimeout(initHeroParallax, 200);
  }

  /* 9. Smooth Scroll for anchor links (in addition to CSS scroll-behavior) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block:'start' });
        }
      }
    });
  });

})();
