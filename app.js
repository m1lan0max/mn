// ============================================================
//  MNSSA — Shared App Utilities (template from Team Echo)
// ============================================================

function getCurrentPage() {
  const path = window.location.pathname || '';
  if (path.endsWith('about.html')) return 'about';
  if (path.endsWith('teams.html')) return 'teams';
  if (path.endsWith('team.html')) return 'teams';
  return 'home';
}

// ── NAVBAR ──────────────────────────────────────────────────
function renderNavbar() {
  const page = getCurrentPage();
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <div class="logo-icon">M</div>
        <span class="logo-text">MNSSA</span>
      </a>
      <div class="nav-links">
        <a href="index.html" class="nav-link ${page === 'home' ? 'active' : ''}">Home</a>
        <a href="about.html" class="nav-link ${page === 'about' ? 'active' : ''}">About</a>
        <a href="teams.html" class="nav-link ${page === 'teams' ? 'active' : ''}">Teams</a>
      </div>
      <button class="mobile-menu-btn" id="mobileMenuBtn" onclick="toggleMobileMenu()" aria-label="Menu">☰</button>
    </div>
    <div class="mobile-menu" id="mobileMenu" style="display:none;">
      <div class="mobile-menu-inner">
        <a href="index.html" class="mobile-nav-link">Home</a>
        <a href="about.html" class="mobile-nav-link">About</a>
        <a href="teams.html" class="mobile-nav-link">Teams</a>
      </div>
    </div>`;
  document.body.insertBefore(nav, document.body.firstChild);
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('mobileMenuBtn');
  const open = menu.style.display !== 'none';
  menu.style.display = open ? 'none' : 'block';
  btn.textContent   = open ? '☰' : '✕';
}

// ── FOOTER ──────────────────────────────────────────────────
function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="footer-logo-icon">M</div>
            <span class="footer-logo-text">MNSSA</span>
          </div>
          <p class="footer-tagline">Empowering medical and health sciences students through advocacy, education, and community-driven initiatives.</p>
        </div>
        <div>
          <h4 class="footer-heading">Quick Links</h4>
          <div class="footer-links">
            <a href="index.html" class="footer-link">Home</a>
            <a href="about.html" class="footer-link">About</a>
            <a href="teams.html" class="footer-link">Teams</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© ${new Date().getFullYear()} MNSSA. All rights reserved.</p>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

// ── SCROLL ANIMATIONS ────────────────────────────────────────
function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));
}

// ── LOADING SCREEN ────────────────────────────────────────────
function initLoadingScreen() {
  const ls = document.getElementById('loadingScreen');
  if (!ls) return;
  setTimeout(() => {
    ls.classList.add('fade-out');
    setTimeout(() => ls.remove(), 500);
  }, 600);
}

// ── HELPERS ───────────────────────────────────────────────────
function fmtDate(dateStr, opts) {
  return new Date(dateStr).toLocaleDateString('en-US', opts || { month: 'long', day: 'numeric', year: 'numeric' });
}
function fmtDateFull(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
function getParam(name) {
  return decodeURIComponent(new URLSearchParams(window.location.search).get(name) || '');
}

// ── AUTO INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  initScrollAnimations();
  initLoadingScreen();
});
