/* ════════════════════════════════════════════════════════════
   Rodrigo Matos — Portfolio  ·  interactions
   ════════════════════════════════════════════════════════════ */
(function () {
  const root = document.documentElement;
  const KEYS = { theme: 'pf-theme', accent: 'pf-accent', hero: 'pf-hero', font: 'pf-font' };
  const ATTR = { theme: 'data-theme', accent: 'data-accent', hero: 'data-hero', font: 'data-font' };

  /* ---- shared state ---- */
  function apply(key, val) {
    if (!val) return;
    root.setAttribute(ATTR[key], val);
    try { localStorage.setItem(KEYS[key], val); } catch (e) {}
    document.dispatchEvent(new CustomEvent('pf-change', { detail: { key, val } }));
  }
  function get(key) {
    let v = null;
    try { v = localStorage.getItem(KEYS[key]); } catch (e) {}
    return v || root.getAttribute(ATTR[key]);
  }
  // hydrate from storage
  Object.keys(KEYS).forEach(k => { const v = get(k); if (v) root.setAttribute(ATTR[k], v); });

  window.PF = { apply, get, KEYS };

  /* ---- theme toggle ---- */
  const themeBtn = document.getElementById('themeToggle');
  themeBtn && themeBtn.addEventListener('click', () => {
    apply('theme', root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  /* ---- hero switcher ---- */
  const heroSwitch = document.getElementById('heroSwitch');
  function syncHeroButtons() {
    const h = root.getAttribute('data-hero');
    heroSwitch && heroSwitch.querySelectorAll('button').forEach(b =>
      b.classList.toggle('active', b.dataset.h === h));
  }
  heroSwitch && heroSwitch.querySelectorAll('button').forEach(b =>
    b.addEventListener('click', () => { apply('hero', b.dataset.h); }));
  syncHeroButtons();
  document.addEventListener('pf-change', e => { if (e.detail.key === 'hero') syncHeroButtons(); });

  /* ---- nav stuck + hide hero switch past hero ---- */
  const nav = document.getElementById('nav');
  const heroEl = document.getElementById('hero');
  function onScroll() {
    nav.classList.toggle('stuck', window.scrollY > 40);
    if (heroEl) document.body.classList.toggle('scrolled-past', window.scrollY > heroEl.offsetHeight * 0.72);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer ---- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  burger && burger.addEventListener('click', () => drawer.classList.toggle('open'));
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

  /* ---- marquee ---- */
  const mq = document.getElementById('mqTrack');
  if (mq) {
    const items = ['React Native', 'TypeScript', 'Kotlin', 'Java', 'Android', 'Swift',
      'Node.js', 'Firebase', 'AWS', 'Docker', 'Spring Boot', 'GitHub Actions'];
    const make = () => items.map(t =>
      `<div class="mq-item"><span class="star">✦</span><span>${t}</span></div>`).join('');
    mq.innerHTML = make() + make(); // duplicate for seamless loop
  }

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  // hero reveals immediately
  setTimeout(() => document.querySelectorAll('#hero .rv').forEach(el => el.classList.add('in')), 80);

  /* ---- count-up ---- */
  function countUp(el) {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    const dur = 1300; let t0;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * to) + (p >= 1 ? suf : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---- contact form ---- */
  const cform = document.getElementById('cform');
  cform && cform.addEventListener('submit', e => {
    e.preventDefault();
    cform.classList.add('done');
    cform.querySelectorAll('input,textarea,button').forEach(el => el.disabled = true);
  });
})();
