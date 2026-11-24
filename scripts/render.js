let siteData = null;

async function loadContent() {
  try {
    const res = await fetch('data/content.json', { cache: 'no-cache' });
    siteData = await res.json();
    window.siteData = siteData; // إتاحة البيانات لملف app.js لتبديل العنوان

    // 1. الهيرو والحالة
    if (siteData.status) {
      document.getElementById('status-text').textContent = siteData.status;
    }
    if (siteData.hero) {
      document.getElementById('hero-title').textContent = siteData.hero.quietTitle;
      document.getElementById('hero-bio').textContent = siteData.hero.bio;
    }

    // 2. رسم المشاريع (Craft)
    const projectsContainer = document.getElementById('projects-list');
    if (projectsContainer && siteData.projects) {
      projectsContainer.innerHTML = siteData.projects.map(proj => `
        <article class="project-item" data-id="${proj.id}">
          <div class="project-header">
            <span class="project-title">${proj.title}</span>
            <span class="mono-meta">${proj.date}</span>
          </div>
          <p class="project-summary">${proj.summary}</p>
        </article>
      `).join('');

      // النافذة المنزلقة للمشاريع
      document.querySelectorAll('.project-item').forEach(el => {
        el.addEventListener('click', () => openProjectDrawer(el.dataset.id));
      });
    }

    // 3. تحديث قسم Now
    if (siteData.now) {
      const nowLabel = document.getElementById('now-label');
      const nowText = document.getElementById('now-text');
      if (nowLabel) nowLabel.textContent = siteData.now.date;
      if (nowText) nowText.textContent = siteData.now.text;
    }

  } catch (err) {
    console.error('Error loading site data:', err);
  }
}

function buildDeviceMockupHTML() {
  return `
    <div class="mockup-stage" aria-hidden="true">
      <div class="mockup-desktop">
        <div class="mk-topbar">
          <span class="mk-dot"></span>
          <span class="mk-dot"></span>
          <span class="mk-dot"></span>
          <span class="mk-url">archive.abdallahalaydi.com</span>
        </div>
        <div class="mk-desktop-body">
          <div class="mk-hero-bar">
            <span class="mk-pill-line"></span>
            <span class="mk-pill-tag"></span>
          </div>
          <div class="mk-grid">
            <div class="mk-card"><div class="mk-card-thumb"></div><div class="mk-card-line"></div></div>
            <div class="mk-card"><div class="mk-card-thumb"></div><div class="mk-card-line"></div></div>
            <div class="mk-card"><div class="mk-card-thumb"></div><div class="mk-card-line"></div></div>
          </div>
        </div>
      </div>
      <div class="mockup-phone">
        <div class="mk-notch"></div>
        <div class="mk-phone-photo"></div>
        <div class="mk-phone-drawer">
          <div class="mk-cm-row short"></div>
          <div class="mk-cm-row"></div>
          <div class="mk-cm-row"></div>
        </div>
      </div>
    </div>
  `;
}

function openProjectDrawer(projectId) {
  if (!siteData || !siteData.projects) return;
  const proj = siteData.projects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById('drawer-date').textContent = proj.date;
  document.getElementById('drawer-title').textContent = proj.title;
  document.getElementById('drawer-description').textContent = proj.fullDescription;
  document.getElementById('drawer-tags').innerHTML = (proj.stack || []).map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('drawer-live').href = proj.liveUrl;
  document.getElementById('drawer-repo').href = proj.repoUrl;

  const statusEl = document.getElementById('drawer-status');
  if (statusEl) {
    statusEl.textContent = proj.status || '';
    statusEl.style.display = proj.status ? 'inline-flex' : 'none';
  }

  const highlightsEl = document.getElementById('drawer-highlights');
  if (highlightsEl) {
    if (proj.highlights && proj.highlights.length) {
      highlightsEl.innerHTML = proj.highlights.map(h => `<li>${h}</li>`).join('');
      highlightsEl.style.display = 'flex';
    } else {
      highlightsEl.innerHTML = '';
      highlightsEl.style.display = 'none';
    }
  }

  const caseStudyBtn = document.getElementById('drawer-case-study');
  if (caseStudyBtn) {
    if (proj.caseStudyUrl) {
      caseStudyBtn.href = proj.caseStudyUrl;
      caseStudyBtn.style.display = 'inline-flex';
    } else {
      caseStudyBtn.style.display = 'none';
    }
  }

  const mockupEl = document.getElementById('drawer-mockup');
  const drawerImgWrapper = document.getElementById('drawer-image-wrapper');
  const drawerImg = document.getElementById('drawer-image');

  if (proj.mockup && mockupEl) {
    mockupEl.innerHTML = buildDeviceMockupHTML();
    mockupEl.style.display = 'block';
    drawerImgWrapper.style.display = 'none';
  } else if (proj.image) {
    if (mockupEl) mockupEl.style.display = 'none';
    drawerImg.src = proj.image;
    drawerImgWrapper.style.display = 'block';
  } else {
    if (mockupEl) mockupEl.style.display = 'none';
    drawerImg.src = '';
    drawerImgWrapper.style.display = 'none';
  }

  const drawer = document.getElementById('project-drawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', loadContent);

/* ==========================================
   Letterboxd Fetcher (Fast Worker + SWR Cache)
   ========================================== */
// استبدل الرابط التالي برابط الـ Worker الخاص بك
const LB_WORKER_URL = "https://letterboxd-rss.balaydy069.workers.dev/";
const LB_CACHE_KEY = "lb_activity_cache_v1";

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getRelativeTime(dateString) {
  const ts = new Date(dateString).getTime();
  if (Number.isNaN(ts)) return "";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return mins <= 1 ? "now" : `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

function parseLetterboxdXml(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  const nodes = Array.from(doc.querySelectorAll("item"))
    .filter(node => {
      const guid = node.querySelector("guid")?.textContent || "";
      return guid.includes("letterboxd-watch") || guid.includes("letterboxd-review");
    })
    .slice(0, 8);

  return nodes.map(node => {
    const fullTitle = node.querySelector("title")?.textContent?.trim() || "";
    const match = fullTitle.match(/^(.*?)(?:\s+-\s+([★½]+))?$/);
    const filmTitle = match ? match[1].trim() : fullTitle;
    const stars = match && match[2] ? match[2] : "";

    const link = node.querySelector("link")?.textContent?.trim() || "#";
    const guid = node.querySelector("guid")?.textContent || "";
    const pubDate = node.querySelector("pubDate")?.textContent || "";
    const descHtml = node.querySelector("description")?.textContent || "";

    const descDoc = new DOMParser().parseFromString(descHtml, "text/html");
    const poster = descDoc.querySelector("img")?.getAttribute("src") || "";
    descDoc.querySelectorAll("p").forEach(p => {
      if (p.querySelector("img")) p.remove();
    });
    const reviewText = descDoc.body.textContent.trim();

    return {
      filmTitle,
      stars,
      link,
      poster,
      hasReview: guid.includes("letterboxd-review"),
      pubDate,
      reviewText
    };
  });
}

function renderLetterboxdUI(items) {
  const grid = document.getElementById("lb-grid");
  const reviewBanner = document.getElementById("lb-review-banner");
  if (!grid || !items?.length) return;

  grid.innerHTML = "";

  items.slice(0, 4).forEach(item => {
    const timeAgo = getRelativeTime(item.pubDate);
    const card = document.createElement("a");
    card.className = "lb-film-item";
    card.href = item.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    card.innerHTML = `
      <div class="lb-poster-frame">
        <img src="${escapeHtml(item.poster)}" alt="${escapeHtml(item.filmTitle)}" loading="lazy">
        <div class="lb-hover-title">${escapeHtml(item.filmTitle)}</div>
      </div>
      <div class="lb-meta-row">
        <div class="lb-stars-group">
          <span>${escapeHtml(item.stars)}</span>
          ${item.hasReview ? '<span class="lb-review-badge">≡</span>' : ''}
        </div>
        <span class="lb-date-ago">${escapeHtml(timeAgo)}</span>
      </div>
    `;
    grid.appendChild(card);
  });

  const latestReview = items.find(i => i.hasReview && i.reviewText);
  if (latestReview && reviewBanner) {
    reviewBanner.style.display = "flex";
    reviewBanner.innerHTML = `
      <img src="${escapeHtml(latestReview.poster)}" alt="${escapeHtml(latestReview.filmTitle)}" class="lb-review-thumb" loading="lazy">
      <div class="lb-review-body">
        <div class="lb-review-header">
          <span>LATEST REVIEW</span>
          <span style="color: #00e054;">${escapeHtml(latestReview.stars)}</span>
        </div>
        <p class="lb-review-text">
          <strong>${escapeHtml(latestReview.filmTitle)}</strong> — "${escapeHtml(latestReview.reviewText)}"
        </p>
      </div>
    `;
  } else if (reviewBanner) {
    reviewBanner.style.display = "none";
  }
}

async function fetchLetterboxdActivity() {
  const grid = document.getElementById("lb-grid");
  if (!grid) return;

  // 1. عرض النسخة المحفوظة فوراً (0ms)
  try {
    const cached = JSON.parse(localStorage.getItem(LB_CACHE_KEY) || "null");
    if (cached?.length) renderLetterboxdUI(cached);
  } catch {}

  // 2. جلب التحديث الأحدث في الخلفية من الـ Worker
  try {
    const response = await fetch(LB_WORKER_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Worker HTTP ${response.status}`);
    const xmlText = await response.text();
    const items = parseLetterboxdXml(xmlText);

    if (items.length) {
      localStorage.setItem(LB_CACHE_KEY, JSON.stringify(items));
      renderLetterboxdUI(items);
    }
  } catch (error) {
    console.error("Letterboxd Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchLetterboxdActivity);