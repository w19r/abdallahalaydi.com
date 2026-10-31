document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // استرجاع الثيم المحفوظ أو اعتماد الأسود افتراضياً
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // تغيير الأيقونة بين الهلال والشمس
    if (theme === 'light') {
      themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    } else {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }

  // التبديل بين الجملة الهادئة وجملة الـ Vibe عند الضغط على العنوان
  const heroTitle = document.getElementById('hero-title');
  let isVibe = false;
  heroTitle.addEventListener('click', () => {
    if (!siteData) return;
    isVibe = !isVibe;
    heroTitle.style.opacity = '0';
    setTimeout(() => {
      heroTitle.textContent = isVibe ? siteData.hero.vibeTitle : siteData.hero.quietTitle;
      heroTitle.style.opacity = '1';
    }, 150);
  });

  // إغلاق النافذة المنزلقة للمشروع
  const drawer = document.getElementById('project-drawer');
  document.getElementById('drawer-close').addEventListener('click', () => {
    drawer.classList.remove('open');
  });
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.classList.remove('open');
  });

  // نسخ الإيميل بضغطة واحدة
  const emailBtn = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  emailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailBtn.dataset.email);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  });
});

