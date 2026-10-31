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
   Letterboxd Upgraded Fetcher
   ========================================== */
function getRelativeTime(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "1d";
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

async function fetchLetterboxdActivity() {
  const username = "w19r";
  const rssUrl = `https://letterboxd.com/${username}/rss/`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  
  const grid = document.getElementById("lb-grid");
  const reviewBanner = document.getElementById("lb-review-banner");
  if (!grid) return;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.status !== "ok") throw new Error("RSS Error");
    
    grid.innerHTML = "";

    data.items.slice(0, 4).forEach(item => {
      const [filmTitle, stars = ""] = item.title.split(" - ");
      const poster = item.thumbnail || (item.description.match(/src="([^"]+)"/) || [])[1];
      const hasReview = item.guid.includes("letterboxd-review");
      const timeAgo = getRelativeTime(item.pubDate.replace(" ", "T") + "Z");

      const card = document.createElement("a");
      card.className = "lb-film-item";
      card.href = item.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      
      card.innerHTML = `
        <div class="lb-poster-frame">
          <img src="${poster}" alt="${filmTitle}" loading="lazy">
          <div class="lb-hover-title">${filmTitle}</div>
        </div>
        <div class="lb-meta-row">
          <div class="lb-stars-group">
            <span>${stars}</span>
            ${hasReview ? '<span class="lb-review-badge">≡</span>' : ''}
          </div>
          <span class="lb-date-ago">${timeAgo}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    const latestReview = data.items.find(i => i.guid.includes("letterboxd-review"));
    if (latestReview && reviewBanner) {
      const [filmName, rating = ""] = latestReview.title.split(" - ");
      const reviewPoster = latestReview.thumbnail || (latestReview.description.match(/src="([^"]+)"/) || [])[1];
      const text = latestReview.description.replace(/<[^>]+>/g, "").trim();

      reviewBanner.style.display = "flex";
      reviewBanner.innerHTML = `
        <img src="${reviewPoster}" alt="${filmName}" class="lb-review-thumb" loading="lazy">
        <div class="lb-review-body">
          <div class="lb-review-header">
            <span>LATEST REVIEW</span>
            <span style="color: #00e054;">${rating}</span>
          </div>
          <p class="lb-review-text">
            <strong>${filmName}</strong> — "${text}"
          </p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Letterboxd Error:", error);
  }
}

document.addEventListener('DOMContentLoaded', fetchLetterboxdActivity);
