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

document.addEventListener('DOMContentLoaded', loadContent);/* ==========================================
   Letterboxd RSS Fetcher (Instant Update)
   ========================================== */
async function fetchLetterboxdActivity() {
  const username = "w19r"; // حسابك
  // إضافة توقيت للرابط لمنع الكاش وجلب التحديث فوراً
  const rssUrl = `https://letterboxd.com/${username}/rss/?t=${Date.now()}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
  
  const grid = document.getElementById("lb-grid");
  const reviewBanner = document.getElementById("lb-review-banner");
  
  if (!grid) return;

  try {
    const response = await fetch(proxyUrl, { cache: "no-store" });
    const proxyData = await response.json();
    
    // تحويل النص المسترجع إلى صيغة XML ليتمكن المتصفح من قراءته
    const parser = new DOMParser();
    const xml = parser.parseFromString(proxyData.contents, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    
    grid.innerHTML = "";

    // 1. عرض آخر 4 أفلام
    items.slice(0, 4).forEach(item => {
      const fullTitle = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "#";
      const desc = item.querySelector("description")?.textContent || "";

      const [filmTitle, stars = ""] = fullTitle.split(" - ");
      const posterMatch = desc.match(/src="([^"]+)"/);
      const poster = posterMatch ? posterMatch[1] : "";
      
      const guid = item.querySelector("guid")?.textContent || "";
      const hasReview = guid.includes("letterboxd-review");

      const card = document.createElement("a");
      card.className = "lb-film-item";
      card.href = link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      
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

    // 2. البحث عن أحدث مراجعة نصية
    const latestReview = items.find(item => 
      (item.querySelector("guid")?.textContent || "").includes("letterboxd-review")
    );
    
    if (latestReview && reviewBanner) {
      const fullTitle = latestReview.querySelector("title")?.textContent || "";
      const link = latestReview.querySelector("link")?.textContent || "#";
      const desc = latestReview.querySelector("description")?.textContent || "";
      
      const [filmName, rating = ""] = fullTitle.split(" - ");
      const text = desc.replace(/<[^>]+>/g, "").trim();

      reviewBanner.style.display = "block";
      reviewBanner.innerHTML = `
        <div class="lb-review-header">
          <span>LATEST REVIEW</span>
          <span style="color: #00e054;">${rating}</span>
        </div>
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="lb-review-link">
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

document.addEventListener('DOMContentLoaded', () => {
  fetchLetterboxdActivity();
});
