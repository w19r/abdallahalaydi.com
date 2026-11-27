if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW error:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // 1. استرجاع الثيم المحفوظ وتفعيله
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }

  // 2. التبديل بين وضع Craft ووضع Vibe وتحديث كامل الهيرو من content.json
  const btnCraft = document.getElementById('btn-craft');
  const btnVibe = document.getElementById('btn-vibe');
  const craftView = document.getElementById('craft-view');
  const vibeView = document.getElementById('vibe-view');
  const statusText = document.getElementById('status-text');
  const heroTitle = document.getElementById('hero-title');
  const heroBio = document.getElementById('hero-bio');
  const brandLogo = document.getElementById('brand-logo');

  function switchMode(mode) {
    const isVibe = mode === 'vibe';
    const modeData = window.siteData?.hero?.[isVibe ? 'vibe' : 'craft'];

    btnVibe?.classList.toggle('active', isVibe);
    btnCraft?.classList.toggle('active', !isVibe);
    vibeView?.classList.toggle('active-view', isVibe);
    craftView?.classList.toggle('active-view', !isVibe);

    if (modeData) {
      if (statusText && modeData.status) statusText.textContent = modeData.status;
      if (heroTitle && modeData.title) heroTitle.textContent = modeData.title;
      if (heroBio && modeData.bio) heroBio.textContent = modeData.bio;
    }
  }

  if (btnCraft && btnVibe) {
    btnCraft.addEventListener('click', () => switchMode('craft'));
    btnVibe.addEventListener('click', () => switchMode('vibe'));
  }

  // التبديل أيضاً عند الضغط على العنوان الكبير أو شعار abdallah.
  function toggleCurrentMode() {
    const isVibe = btnVibe?.classList.contains('active');
    switchMode(isVibe ? 'craft' : 'vibe');
  }

  heroTitle?.addEventListener('click', toggleCurrentMode);
  brandLogo?.addEventListener('click', toggleCurrentMode);

  // 3. إغلاق النافذة المنزلقة للمشروع (بالزر أو بالضغط خارجها أو بزر Escape)
  const drawer = document.getElementById('project-drawer');
  const drawerClose = document.getElementById('drawer-close');

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  drawerClose?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 4. نسخ الإيميل وإظهار الإشعار
  const emailBtn = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (emailBtn && toast) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailBtn.dataset.email);
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }
});