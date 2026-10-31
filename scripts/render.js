let siteData = null;

async function loadContent() {
  try {
    const res = await fetch('data/content.json');
    siteData = await res.json();

    // 1. تحديث الهيرو والحالة
    document.getElementById('status-text').textContent = siteData.status;
    document.getElementById('hero-title').textContent = siteData.hero.quietTitle;
    document.getElementById('hero-bio').textContent = siteData.hero.bio;

    // 2. رسم المشاريع بأسلوب النظيف
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

    // تفعيل فتح النافذة المنزلقة عند الضغط على أي مشروع
    document.querySelectorAll('.project-item').forEach(el => {
      el.addEventListener('click', () => openProjectDrawer(el.dataset.id));
    });

    // 3. رسم العوالم الفرعية (Archive & MCU)
    const worldsContainer = document.getElementById('worlds-list');
    worldsContainer.innerHTML = siteData.worlds.map(w => `
      <a href="${w.url}" target="_blank" rel="noopener" class="world-card">
        <span class="world-domain">${w.domain}</span>
        <div class="world-title">${w.title}</div>
        <p class="world-desc">${w.description}</p>
      </a>
    `).join('');

    // 4. رسم الاهتمامات (On Rotation)
    const interestsContainer = document.getElementById('interests-list');
    interestsContainer.innerHTML = siteData.interests.map(item => `
      <div>
        <div class="project-header">
          <span class="project-title">${item.title}</span>
          <span class="mono-meta">${item.category}</span>
        </div>
        <p class="project-summary">${item.note}</p>
      </div>
    `).join('');

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

  const drawer = document.getElementById('project-drawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

document.addEventListener('DOMContentLoaded', loadContent);

