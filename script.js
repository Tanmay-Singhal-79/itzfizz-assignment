if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

gsap.registerPlugin(ScrollTrigger);

gsap.set('#nav', { opacity: 0, y: -16 });
gsap.set('#car-image', { x: 0, opacity: 1 });
gsap.set('#headline-wrap', { clipPath: 'inset(0 100% 0 0)' });
gsap.set('.letter', { opacity: 1, y: 0 });
gsap.set('#hero-sub', { opacity: 0, y: 16 });
gsap.set('.stat-card', { opacity: 0, y: 20 });
gsap.set('#scroll-cue', { opacity: 0 });

const loadTl = gsap.timeline({
  delay: 0.2,
  defaults: { ease: 'power3.out' },
  onComplete: initScrollAnimation,
});

loadTl.to('#nav', { opacity: 1, y: 0, duration: 0.7 }, 0);
loadTl.to('#hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.3);
loadTl.to('.stat-card', {
  opacity: 1, y: 0,
  stagger: 0.1, duration: 0.7,
  ease: 'power2.out',
}, 0.4);
loadTl.to('#scroll-cue', { opacity: 1, duration: 0.6 }, 0.9);

function initScrollAnimation() {

  const car = document.getElementById('car-image');
  const hero = document.querySelector('.hero');

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

  scrollTl.to(car, {
    x: () => CAR_TRAVEL(),
    scale: 1.04,
    ease: 'none',
  }, 0);

  scrollTl.to('#headline-wrap', {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'none',
  }, 0);

  scrollTl.to('#scroll-cue', {
    opacity: 0,
    ease: 'power2.in',
  }, 0);

  scrollTl.to('#nav', {
    background: 'rgba(10,10,15,0.86)',
    backdropFilter: 'blur(14px)',
    ease: 'none',
  }, 0);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}
