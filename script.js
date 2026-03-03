/**
 * script.js – ITZFIZZ "Car Reveals Text" Scroll Animation
 *
 * Effect:
 * • Car is visible at x:0 (left edge) from page load – no entry animation
 * • "WELCOME ITZFIZZ" headline is hidden initially via clip-path
 * • As user scrolls → car moves right + headline clip-path wipes left→right
 * • Car sits on top of text (z-index), so text appears to emerge from behind the car
 */

/* ─────────────────────────────────────────────────────────────
   0.  Prevent browser scroll restore on refresh
───────────────────────────────────────────────────────────── */
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

/* ─────────────────────────────────────────────────────────────
   1.  Register GSAP plugins
───────────────────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   2.  Set initial states (all via GSAP – no CSS conflicts)
───────────────────────────────────────────────────────────── */

// Nav hidden, will slide in on load
gsap.set('#nav', { opacity: 0, y: -16 });

// Car: VISIBLE at x:0 (left edge) from the start – no slide-in
gsap.set('#car-image', { x: 0, opacity: 1 });

// Headline: fully hidden via clip-path (right side fully clipped)
// Scroll will wipe it open left→right in sync with car movement
gsap.set('#headline-wrap', { clipPath: 'inset(0 100% 0 0)' });

// Make individual letters visible (clip-path on parent handles the hide)
gsap.set('.letter', { opacity: 1, y: 0 });

// Sub-headline and stats hidden – fade in on load
gsap.set('#hero-sub', { opacity: 0, y: 16 });
gsap.set('.stat-card', { opacity: 0, y: 20 });
gsap.set('#scroll-cue', { opacity: 0 });

/* ─────────────────────────────────────────────────────────────
   3.  LOAD ANIMATION
       Car is already in place – just reveal UI chrome elements.
       onComplete → starts ScrollTrigger so they never conflict.
───────────────────────────────────────────────────────────── */
const loadTl = gsap.timeline({
  delay: 0.2,
  defaults: { ease: 'power3.out' },
  onComplete: initScrollAnimation,
});

// Nav slides down
loadTl.to('#nav', { opacity: 1, y: 0, duration: 0.7 }, 0);

// Sub-headline fades up
loadTl.to('#hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.3);

// Stats stagger up
loadTl.to('.stat-card', {
  opacity: 1, y: 0,
  stagger: 0.1, duration: 0.7,
  ease: 'power2.out',
}, 0.4);

// Scroll cue appears last
loadTl.to('#scroll-cue', { opacity: 1, duration: 0.6 }, 0.9);


/* ─────────────────────────────────────────────────────────────
   4.  SCROLL ANIMATION
       Created AFTER load animation finishes (via onComplete).
       Two things happen in perfect sync as user scrolls:
         a) Car moves RIGHT  (x: 0 → CAR_TRAVEL)
         b) Headline REVEALS (clipPath right edge: 100% → 0%)
       Car z-index > headline z-index → car stays on top,
       so text appears to emerge from BEHIND the car.
───────────────────────────────────────────────────────────── */
function initScrollAnimation() {

  const car = document.getElementById('car-image');
  const hero = document.querySelector('.hero');

  // Distance car travels (responsive, recalculated on resize/refresh)
  const CAR_TRAVEL = () => window.innerWidth * 0.72;

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: 1.4,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // a) Car slides right across viewport
  scrollTl.to(car, {
    x: () => CAR_TRAVEL(),
    scale: 1.04,
    ease: 'none',
  }, 0);

  // b) Headline wipe-reveals from left to right in EXACT sync with car
  //    clip-path inset(0 RIGHT 0 0): RIGHT goes 100%→0% as car moves
  scrollTl.to('#headline-wrap', {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'none',         // linear – perfectly tied to scroll
  }, 0);

  // c) Scroll cue fades out on first scroll
  scrollTl.to('#scroll-cue', {
    opacity: 0,
    ease: 'power2.in',
  }, 0);

  // d) Nav gets glass effect on scroll
  scrollTl.to('#nav', {
    background: 'rgba(10,10,15,0.86)',
    backdropFilter: 'blur(14px)',
    ease: 'none',
  }, 0);

  // Recalculate on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}
