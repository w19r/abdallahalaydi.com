document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // استرجاع الثيم المحفوظ
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }

  // التبديل بين وضع Craft ووضع Vibe
  const btnCraft = document.getElementById('btn-craft');
  const btnVibe = document.getElementById('btn-vibe');
  const craftView = document.getElementById('craft-view');
  const vibeView = document.getElementById('vibe-view');

  if (btnCraft && btnVibe) {
    btnCraft.addEventListener('click', () => {
      btnCraft.classList.add('active');
      btnVibe.classList.remove('active');
      vibeView.classList.remove('active-view');
      craftView.classList.add('active-view');
    });

    btnVibe.addEventListener('click', () => {
      btnVibe.classList.add('active');
      btnCraft.classList.remove('active');
      craftView.classList.remove('active-view');
      vibeView.classList.add('active-view');
    });
  }

  // إغلاق النافذة المنزلقة للمشروع
  const drawer = document.getElementById('project-drawer');
  document.getElementById('drawer-close').addEventListener('click', () => {
    drawer.classList.remove('open');
  });
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.classList.remove('open');
  });

  // نسخ الإيميل
  const emailBtn = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailBtn.dataset.email);
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }
});
