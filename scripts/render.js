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
   Letterboxd Theme Widget (Upgraded)
   ========================================== */
.lb-theme-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s ease, transform 0.2s ease;
}

.lb-theme-card:hover {
  border-color: var(--border-bright);
}

.lb-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.lb-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.lb-dots {
  display: flex;
  gap: 3.5px;
}

.lb-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.dot-orange { background-color: #ff8000; }
.dot-green { background-color: #00e054; }
.dot-blue { background-color: #40bcf4; }

/* كبسولة الرابط متطابقة مع vibe-badge */
.lb-all-link {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 99px;
  border: 1px solid var(--border-bright);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.lb-all-link:hover {
  background: var(--text-primary);
  color: var(--bg);
}

.lb-poster-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.lb-film-item {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.lb-poster-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.lb-film-item:hover .lb-poster-frame {
  border-color: #00e054;
  box-shadow: 0 6px 16px rgba(0, 224, 84, 0.18);
  transform: translateY(-3px);
}

.lb-poster-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-hover-title {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10, 12, 14, 0.95) 0%, rgba(20, 24, 28, 0.5) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 10px 6px;
  text-align: center;
  font-size: 11.5px;
  font-weight: 500;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.lb-film-item:hover .lb-hover-title {
  opacity: 1;
}

/* شريط النجوم والتاريخ أسفل البوستر */
.lb-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 7px;
  font-size: 12px;
  line-height: 1;
}

.lb-stars-group {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #00e054;
}

.lb-like {
  color: #ff8000;
  font-size: 10px;
}

.lb-date-ago {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
}

/* صندوق المراجعة المطور مع البوستر المصغر */
.lb-review-pill {
  margin-top: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-left: 3px solid #40bcf4;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.lb-review-pill:hover {
  border-color: var(--border-bright);
  border-left-color: #00e054;
}

.lb-review-thumb {
  width: 36px;
  height: 54px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.lb-review-body {
  flex: 1;
  min-width: 0;
}

.lb-review-header {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.lb-review-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0;
}

.lb-review-text strong {
  color: var(--text-primary);
  font-weight: 500;
}

@media (max-width: 480px) {
  .lb-poster-grid { gap: 8px; }
  .lb-date-ago { display: none; }
}
