/* ===== NAV TOGGLE + ACTIVE LINK + OUTSIDE-CLICK CLOSE ===== */
const body   = document.body;
const toggle = document.querySelector('.nav-toggle');
const nav    = document.querySelector('.main-nav');

/* ---------- mobile menu ---------- */
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  body.classList.toggle('no-scroll', open);
});

/* ---------- active link ---------- */
(() => {
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === cur) a.classList.add('active');
  });
})();

/* ---------- close on outside click ---------- */
document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('no-scroll');
    }
  }
});