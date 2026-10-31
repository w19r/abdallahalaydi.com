let siteData = null;

async function loadContent() {
  try {
    const res = await fetch('data/content.json');
    siteData = await res.json();

    // 1. تحديث الهيرو والحالة
    document.getElementById('status-text').textContent = siteData.status;
    document.getElementById('hero-title').textContent = siteData.hero.quietTitle;
    document.getElementById('hero-bio').textContent = siteData.hero.bio;

    // 2. رسم المشاريع (Craft)
    const projectsContainer = document.getElementById('projects-list');
    projectsContainer.innerHTML = siteData.projects.map(proj => `
      <article class="project-item" data-id="${proj.id}">
        <div class="project-header">
          <span class="project-title">${proj.title}</span>
          <span class="mono-meta">${proj.date}</span>
        </div>
        <p class="project-summary">${proj.summary}</p>
      </article>
    `).join('');

    // تفعيل النافذة المنزلقة للمشاريع
    document.querySelectorAll('.project-item').forEach(el => {
      el.addEventListener('click', () => openProjectDrawer(el.dataset.id));
    });

    // 3. رسم العوالم (Worlds)
    const worldsContainer = document.getElementById('worlds-list');
    worldsContainer.innerHTML = siteData.worlds.map(w => `
      <a href="${w.url}" target="_blank" rel="noopener" class="world-card">
        <span class="world-domain">${w.domain}</span>
        <div class="world-title">${w.title}</div>
        <p class="world-desc">${w.description}</p>
      </a>
    `).join('');

    // 4. رسم بطاقات الحياة (Vibe Bento Cards) - الكود المحدث!
    const vibeContainer = document.getElementById('vibe-grid');
    if (vibeContainer && siteData.interests) {
      vibeContainer.innerHTML = siteData.interests.map(item => `
        <a href="${item.url || '#'}" ${item.url && item.url !== '#' ? 'target="_blank" rel="noopener"' : ''} class="vibe-card">
          <div class="vibe-card-top">
            <span class="vibe-tag">${item.category}</span>
            ${item.badge ? `<span class="vibe-badge">${item.badge}</span>` : ''}
          </div>
          <div>
            <div class="vibe-card-title">${item.title}</div>
            <p class="vibe-card-sub">${item.note}</p>
          </div>
        </a>
      `).join('');
    }

    // 5. تحديث قسم Now
    document.getElementById('now-label').textContent = siteData.now.date;
    document.getElementById('now-text').textContent = siteData.now.text;

  } catch (err) {
    console.error('Error loading site data:', err);
  }
}

function openProjectDrawer(projectId) {
  const proj = siteData.projects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById('drawer-date').textContent = proj.date;
  document.getElementById('drawer-title').textContent = proj.title;
  document.getElementById('drawer-description').textContent = proj.fullDescription;
  document.getElementById('drawer-tags').innerHTML = proj.stack.map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('drawer-live').href = proj.liveUrl;
  document.getElementById('drawer-repo').href = proj.repoUrl;

  const drawerImgWrapper = document.getElementById('drawer-image-wrapper');
  const drawerImg = document.getElementById('drawer-image');

  if (proj.image) {
    drawerImg.src = proj.image;
    drawerImgWrapper.style.display = 'block';
  } else {
    drawerImg.src = '';
    drawerImgWrapper.style.display = 'none';
  }

  const drawer = document.getElementById('project-drawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', loadContent);
/* ==========================================
   Letterboxd RSS Fetcher
   ========================================== */
async function fetchLetterboxdActivity() {
  const username = "w19r"; // اسم حسابك على Letterboxd
  const rssUrl = `https://letterboxd.com/${username}/rss/`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  
  const grid = document.getElementById("lb-grid");
  const reviewBanner = document.getElementById("lb-review-banner");
  
  if (!grid) return; // تأكد من وجود العنصر في الصفحة

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status !== "ok") throw new Error("RSS Fetch failed");
    
    // تفريغ تأثيرات الـ Skeleton
    grid.innerHTML = "";

    // 1. معالجة وعرض آخر 4 أفلام
    data.items.slice(0, 4).forEach(item => {
      // فصل العنوان عن التقييم بالنجوم
      const [filmTitle, stars = ""] = item.title.split(" - ");
      
      // استخراج رابط البوستر من الوصف أو من الصورة المصغرة
      const poster = item.thumbnail || (item.description.match(/src="([^"]+)"/) || [])[1];
      
      // التحقق مما إذا كان الفيلم يحتوي على مراجعة نصية عبر الـ GUID
      const hasReview = item.guid.includes("letterboxd-review");

      const card = document.createElement("a");
      card.className = "lb-film-item";
      card.href = item.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer"; // أمان أفضل للروابط الخارجية
      
      card.innerHTML = `
        <div class="lb-poster-frame">
          <img src="${poster}" alt="${filmTitle}" loading="lazy">
          <div class="lb-hover-title">${filmTitle}</div>
        </div>
        <div class="lb-meta-row">
          <span>${stars}</span>
          ${hasReview ? '<span class="lb-review-badge">≡</span>' : ''}
        </div>
      `;
      grid.appendChild(card);
    });

    // 2. البحث عن أحدث مراجعة نصية وعرضها بالأسفل
    const latestReview = data.items.find(i => i.guid.includes("letterboxd-review"));
    if (latestReview && reviewBanner) {
      const [filmName, rating = ""] = latestReview.title.split(" - ");
      // إزالة كل وسوم الـ HTML من المراجعة النصية
      const text = latestReview.description.replace(/<[^>]+>/g, "").trim();

      reviewBanner.style.display = "block";
      reviewBanner.innerHTML = `
        <div class="lb-review-header">
          <span>LATEST REVIEW</span>
          <span style="color: #00e054;">${rating}</span>
        </div>
        <a href="${latestReview.link}" target="_blank" rel="noopener noreferrer" class="lb-review-link">
          <strong>${filmName}</strong> — "${text}"
        </a>
      `;
    }
  } catch (error) {
    console.error("Letterboxd Error:", error);
    if (grid) {
      grid.innerHTML = '<p class="muted-paragraph" style="grid-column: 1/-1; text-align: center; font-size: 13px;">تعذر تحميل النشاط الأخير.</p>';
    }
  }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  fetchLetterboxdActivity();
});
