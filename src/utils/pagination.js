import { SPACING_MAP } from '../constants/defaultState.js';

export class MeasurementCache {
  constructor(maxSize = 800) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  _generateKey(template, theme, font, spacing, columnClass, html) {
    const len = html ? html.length : 0;
    const prefix = html ? html.slice(0, 80) : '';
    const suffix = html && len > 80 ? html.slice(-80) : '';
    return `${template}|${theme}|${font}|${spacing}|${columnClass || ''}|${len}|${prefix}|${suffix}`;
  }

  get(template, theme, font, spacing, columnClass, html) {
    const key = this._generateKey(template, theme, font, spacing, columnClass, html);
    const val = this.cache.get(key);
    if (val !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, val);
      return val;
    }
    return undefined;
  }

  set(template, theme, font, spacing, columnClass, html, height) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    const key = this._generateKey(template, theme, font, spacing, columnClass, html);
    this.cache.set(key, height);
  }

  clear() {
    this.cache.clear();
  }
}

export const measurementCache = new MeasurementCache();

export function getSpacingPad(spacing = 'spacing-normal') {
  return SPACING_MAP[spacing] || 20;
}

export function getPageContentHeight(spacing = 'spacing-normal') {
  const pad = getSpacingPad(spacing);
  return 1123 - (pad * 2); // 297mm ≈ 1123px at 96 DPI
}

export function measureContentHeight(htmlContent, columnClass = '', state = {}) {
  if (typeof document === 'undefined' || !htmlContent) return 0;

  const currentTemplate = state.template || 'modern';
  const currentTheme = state.theme || 'theme-navy';
  const currentFont = state.font || 'font-sans';
  const currentSpacing = state.spacing || 'spacing-normal';

  const cached = measurementCache.get(currentTemplate, currentTheme, currentFont, currentSpacing, columnClass, htmlContent);
  if (cached !== undefined) return cached;

  const measureDiv = document.createElement('div');
  measureDiv.className = `resume-measure-sandbox ${currentTheme} ${currentFont} ${currentSpacing} template-${currentTemplate}`;
  const pad = getSpacingPad(currentSpacing);
  measureDiv.style.setProperty('--pad', `${pad}px`);
  measureDiv.style.padding = `0 ${pad}px`;

  if (columnClass) {
    let wrapHTML = '';
    if (currentTemplate === 'modern') {
      if (columnClass === 'main-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;"></div><div class="side-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      }
    } else if (currentTemplate === 'sidebar') {
      if (columnClass === 'sidebar-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;"></div><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      }
    } else {
      wrapHTML = htmlContent;
    }
    measureDiv.innerHTML = wrapHTML;
  } else {
    measureDiv.innerHTML = htmlContent;
  }

  document.body.appendChild(measureDiv);
  const height = measureDiv.scrollHeight;
  document.body.removeChild(measureDiv);

  measurementCache.set(currentTemplate, currentTheme, currentFont, currentSpacing, columnClass, htmlContent, height);
  return height;
}

// Brand SVG icons for contact items
const BRAND_ICONS = {
  github: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`
};

export function buildContactItemsHTML(p = {}, format = 'icon') {
  if (!p || typeof p !== 'object') return [];
  const items = [];
  if (format === 'label') {
    const labelContacts = [
      ['age', '年 龄：'], ['gender', '性 别：'], ['phone', '电 话：'],
      ['email', '邮 箱：'], ['location', '地 区：'], ['arrivalTime', '到 岗：'],
      ['github', 'GitHub：'], ['linkedin', 'LinkedIn：'], ['website', '网 站：']
    ];
    labelContacts.forEach(([field, label]) => {
      if (p[field]) items.push(`<div class="contact-item"><span class="contact-label">${label}</span><span contenteditable="true" data-path="personal.${field}">${p[field]}</span></div>`);
    });
  } else {
    const iconContacts = [
      ['age', 'calendar'], ['gender', 'user'], ['arrivalTime', 'clock'],
      ['phone', 'phone'], ['email', 'mail'], ['location', 'map-pin'], ['website', 'globe'],
      ['github', 'github'], ['linkedin', 'linkedin']
    ];
    iconContacts.forEach(([field, icon]) => {
      if (p[field]) {
        const iconHTML = BRAND_ICONS[field] || `<span class="contact-icon-dot">•</span>`;
        items.push(`<div class="contact-item">${iconHTML}<span contenteditable="true" data-path="personal.${field}">${p[field]}</span></div>`);
      }
    });
  }
  return items;
}

export function renderHeaderTemplateHTML(state) {
  const p = state.personal || {};
  const shape = p.avatarShape || 'circle';
  const avatarHTML = p.avatar ? `<div class="avatar-container shape-${shape}"><img src="${p.avatar}" alt="${p.name || ''}" class="avatar-img shape-${shape}" /></div>` : '';

  if (state.template === 'sidebar') {
    // Sidebar template renders header inside body
    return '';
  }

  if (state.template === 'elegant') {
    const contactsList = buildContactItemsHTML(p, 'icon');
    const hasAvatarClass = p.avatar ? 'has-avatar' : 'no-avatar';
    return `
      <header class="resume-header ${hasAvatarClass}">
        ${avatarHTML}
        <div class="header-text-container">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts">${contactsList.join('')}</div>
        </div>
      </header>
    `;
  }

  if (state.template === 'geek') {
    const contactsList = buildContactItemsHTML(p, 'label');
    return `
      <header class="resume-header geek-header">
        <div class="header-info-main">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts-grid">${contactsList.join('')}</div>
        </div>
        ${avatarHTML}
      </header>
    `;
  }

  if (state.template === 'creative') {
    const contactsList = buildContactItemsHTML(p, 'icon');
    return `
      <header class="resume-header creative-header">
        <div class="creative-header-content">
          ${avatarHTML}
          <div class="header-info-main">
            <div class="creative-name-wrap">
              <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
              <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
            </div>
            <div class="header-contacts">${contactsList.join('')}</div>
          </div>
        </div>
      </header>
    `;
  }

  if (state.template === 'compact') {
    const contactsList = buildContactItemsHTML(p, 'icon');
    const hasAvatarClass = p.avatar ? 'has-avatar' : 'no-avatar';
    return `
      <header class="resume-header compact-header ${hasAvatarClass}">
        <div class="compact-header-top">
          <div class="header-info-main">
            <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
            <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
            <div class="header-contacts">${contactsList.join('')}</div>
          </div>
          ${avatarHTML}
        </div>
        <div class="compact-divider-rule"></div>
      </header>
    `;
  }

  // Modern & Minimal (default)
  const contactsList = buildContactItemsHTML(p, 'icon');
  return `
    <header class="resume-header">
      <div class="header-info-main">
        <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
        <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
        <div class="header-contacts">${contactsList.join('')}</div>
      </div>
      ${avatarHTML}
    </header>
  `;
}

export function renderSectionItemsHTML(sectionKey, state) {
  if (sectionKey === 'summary') {
    if (!state.summary) return '';
    return `
      <section class="resume-section section-summary">
        <div class="resume-section-title"><span>自我评价</span></div>
        <div class="resume-summary" contenteditable="true" data-path="summary">${state.summary}</div>
      </section>`;
  }

  if (sectionKey === 'experience') {
    const list = state.experience?.filter(item => item.company || item.role) || [];
    if (list.length === 0) return '';
    const itemsHTML = list.map(item => `
      <div class="resume-item">
        <div class="resume-item-header">
          <span contenteditable="true" data-path="experience.${item.id}.company">${item.company}</span>
          <span class="resume-item-date">
            <span contenteditable="true" data-path="experience.${item.id}.startDate">${item.startDate}</span> ~
            <span contenteditable="true" data-path="experience.${item.id}.endDate">${item.endDate}</span>
          </span>
        </div>
        <div class="resume-item-sub">
          <span contenteditable="true" data-path="experience.${item.id}.role">${item.role}</span>
        </div>
        <div class="resume-item-description" contenteditable="true" data-path="experience.${item.id}.description">${item.description}</div>
      </div>
    `).join('');
    return `
      <section class="resume-section section-experience">
        <div class="resume-section-title"><span>工作经历</span></div>
        <div class="resume-items-list">${itemsHTML}</div>
      </section>`;
  }

  if (sectionKey === 'education') {
    const list = state.education?.filter(item => item.institution) || [];
    if (list.length === 0) return '';
    const itemsHTML = list.map(item => `
      <div class="resume-item">
        <div class="resume-item-header">
          <span contenteditable="true" data-path="education.${item.id}.institution">${item.institution}</span>
          <span class="resume-item-date" contenteditable="true" data-path="education.${item.id}.startDate">${item.startDate}</span>
        </div>
        <div class="resume-item-sub">
          <span contenteditable="true" data-path="education.${item.id}.degree">${item.degree}</span> -
          <span contenteditable="true" data-path="education.${item.id}.major">${item.major}</span>
        </div>
        ${item.description ? `<div class="resume-item-description" contenteditable="true" data-path="education.${item.id}.description">${item.description}</div>` : ''}
      </div>
    `).join('');
    return `
      <section class="resume-section section-education">
        <div class="resume-section-title"><span>教育背景</span></div>
        <div class="resume-items-list">${itemsHTML}</div>
      </section>`;
  }

  if (sectionKey === 'projects') {
    const list = state.projects?.filter(item => item.name) || [];
    if (list.length === 0) return '';
    const itemsHTML = list.map(item => {
      const dateHTML = (item.startDate || item.endDate) ? `
        <span class="resume-item-date">
          <span contenteditable="true" data-path="projects.${item.id}.startDate">${item.startDate || ''}</span>
          ${(item.startDate && item.endDate) ? ' ~ ' : ''}
          <span contenteditable="true" data-path="projects.${item.id}.endDate">${item.endDate || ''}</span>
        </span>` : '';
      const techHTML = item.techStack ? `<div class="project-tech-stack"><strong class="tech-stack-label">技术栈：</strong><span class="tech-stack-val" contenteditable="true" data-path="projects.${item.id}.techStack">${item.techStack}</span></div>` : '';
      const linkHTML = item.link ? `<span class="project-link-label"><span class="link-icon">🔗</span> <span>链接:</span> <span contenteditable="true" data-path="projects.${item.id}.link" class="project-link-url">${item.link}</span></span>` : '';
      const subHTML = (techHTML || linkHTML) ? `<div class="resume-item-sub">${techHTML}${linkHTML}</div>` : '';
      return `
        <div class="resume-item">
          <div class="resume-item-header">
            <span class="project-name-role">
              <span contenteditable="true" data-path="projects.${item.id}.name" style="font-weight: 700;">${item.name}</span>
              <span class="project-role-sep">·</span>
              <span contenteditable="true" data-path="projects.${item.id}.role" class="project-role">${item.role}</span>
            </span>
            ${dateHTML}
          </div>
          ${subHTML}
          <div class="resume-item-description" contenteditable="true" data-path="projects.${item.id}.description">${item.description}</div>
        </div>`;
    }).join('');
    return `
      <section class="resume-section section-projects">
        <div class="resume-section-title"><span>项目经验</span></div>
        <div class="resume-items-list">${itemsHTML}</div>
      </section>`;
  }

  if (sectionKey === 'skills') {
    const list = state.skills?.filter(item => item.category) || [];
    if (list.length === 0) return '';
    const itemsHTML = list.map(item => {
      const tags = (item.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const tagsHTML = tags.map((tag, tagIdx) => `<span class="resume-skill-tag" contenteditable="true" data-path="skills.${item.id}.tags.${tagIdx}">${tag}</span>`).join('');
      return `
        <div class="resume-skill-cat">
          <div class="resume-skill-cat-name" contenteditable="true" data-path="skills.${item.id}.category">${item.category}</div>
          <div class="resume-skill-tags">${tagsHTML}</div>
        </div>`;
    }).join('');
    return `
      <section class="resume-section section-skills">
        <div class="resume-section-title"><span>专业技能</span></div>
        <div class="resume-skills-grid">${itemsHTML}</div>
      </section>`;
  }

  return '';
}

export function renderSectionsHTML(sectionsList, state) {
  let sectionsHTML = '';
  (sectionsList || []).forEach(secKey => {
    if (state.sectionVisibility?.[secKey] === false) return;
    sectionsHTML += renderSectionItemsHTML(secKey, state);
  });
  return sectionsHTML;
}

export function renderFullResumeHTML(state) {
  const currentTemplate = state.template || 'modern';
  const headerHTML = renderHeaderTemplateHTML(state);
  let bodyHTML = '';

  if (currentTemplate === 'modern') {
    const leftSections = (state.sectionOrder || []).filter(s => (state.sectionColumns?.[s] || 'left') === 'left');
    const rightSections = (state.sectionOrder || []).filter(s => (state.sectionColumns?.[s] || 'left') === 'right');
    bodyHTML = `<div class="resume-body">
      <div class="main-col">${renderSectionsHTML(leftSections, state)}</div>
      <div class="side-col">${renderSectionsHTML(rightSections, state)}</div>
    </div>`;
  } else if (currentTemplate === 'sidebar') {
    const mainSections = (state.sectionOrder || []).filter(s => (state.sectionColumns?.[s] || 'left') === 'left');
    const sideSections = (state.sectionOrder || []).filter(s => (state.sectionColumns?.[s] || 'left') === 'right');
    const p = state.personal || {};
    const shape = p.avatarShape || 'circle';
    const avatarHTML = p.avatar ? `<div class="avatar-container shape-${shape}"><img src="${p.avatar}" alt="${p.name || ''}" class="avatar-img shape-${shape}" /></div>` : '';
    const contactsList = buildContactItemsHTML(p, 'icon');
    bodyHTML = `<div class="resume-body">
      <div class="sidebar-col">${avatarHTML}<div class="sidebar-contacts">${contactsList.join('')}</div>${renderSectionsHTML(sideSections, state)}</div>
      <div class="main-col"><h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1><div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>${renderSectionsHTML(mainSections, state)}</div>
    </div>`;
  } else {
    bodyHTML = `<div class="resume-body">${renderSectionsHTML(state.sectionOrder, state)}</div>`;
  }

  return { headerHTML, bodyHTML };
}

// Split section elements into multiple page arrays
export function paginateSectionsIntoPages(sectionEls, initialHeight, pageContentHeight, continuationHeaderHeight, columnClass, cachedMeasure) {
  const pages = [];
  let currentPage = [];
  let currentHeight = initialHeight;

  for (const section of sectionEls) {
    const sectionHTML = section.outerHTML;
    const sectionHeight = cachedMeasure(sectionHTML, columnClass);

    if (currentHeight + sectionHeight <= pageContentHeight) {
      currentPage.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    const items = section.querySelectorAll('.resume-item, .resume-skill-cat');
    if (items.length === 0) {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = continuationHeaderHeight;
      }
      currentPage.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    const titleEl = section.querySelector('.resume-section-title');
    const titleHTML = titleEl ? titleEl.outerHTML : '';
    const titleHeight = titleHTML ? cachedMeasure(titleHTML, columnClass) : 0;
    const sectionClass = section.className;

    const firstItem = items[0];
    const firstItemHeight = firstItem ? cachedMeasure(firstItem.outerHTML, columnClass) : 0;
    const canStartOnCurrentPage = (currentHeight + titleHeight + firstItemHeight <= pageContentHeight);

    if (!canStartOnCurrentPage && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = continuationHeaderHeight;
    }

    let itemGroup = [];
    let itemGroupHeight = currentHeight + titleHeight;

    for (const item of items) {
      const itemHTML = item.outerHTML;
      const itemHeight = cachedMeasure(itemHTML, columnClass);

      if (itemGroupHeight + itemHeight > pageContentHeight && itemGroup.length > 0) {
        currentPage.push(`<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`);
        pages.push(currentPage);
        currentPage = [];
        itemGroup = [];
        itemGroupHeight = continuationHeaderHeight + titleHeight;
      }

      itemGroup.push(itemHTML);
      itemGroupHeight += itemHeight;
    }

    if (itemGroup.length > 0) {
      currentPage.push(`<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`);
      currentHeight = itemGroupHeight;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export function paginateComplexLayout(headerHTML, bodyHTML, headerHeight, sectionsHeight, pageContentHeight, continuationHeaderHeight, cachedMeasure, state) {
  if (headerHeight + sectionsHeight <= pageContentHeight) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHTML;
  const mainCol = tempDiv.querySelector('.main-col');
  const sideCol = tempDiv.querySelector('.side-col') || tempDiv.querySelector('.sidebar-col');
  const bodyClass = tempDiv.querySelector('.resume-body')?.className || 'resume-body';

  if (!mainCol) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const mainSections = Array.from(mainCol.querySelectorAll('.resume-section'));
  const sideSections = sideCol ? Array.from(sideCol.querySelectorAll('.resume-section')) : [];

  const mainColClone = mainCol.cloneNode(true);
  mainColClone.querySelectorAll('.resume-section').forEach(el => el.remove());
  const mainColHeaderHeight = cachedMeasure(mainColClone.innerHTML, 'main-col');

  let sideColHeaderHeight = 0;
  if (sideCol) {
    const sideColClone = sideCol.cloneNode(true);
    sideColClone.querySelectorAll('.resume-section').forEach(el => el.remove());
    sideColHeaderHeight = cachedMeasure(sideColClone.innerHTML, state.template === 'sidebar' ? 'sidebar-col' : 'side-col');
  }

  const mainPages = paginateSectionsIntoPages(mainSections, headerHeight + mainColHeaderHeight, pageContentHeight, continuationHeaderHeight, 'main-col', cachedMeasure);
  const sidePages = paginateSectionsIntoPages(
    sideSections,
    headerHeight + sideColHeaderHeight,
    pageContentHeight,
    continuationHeaderHeight,
    state.template === 'sidebar' ? 'sidebar-col' : 'side-col',
    cachedMeasure
  );

  const maxPages = Math.max(mainPages.length, sidePages.length);
  const pages = [];

  for (let i = 0; i < maxPages; i++) {
    const mainContent = mainPages[i] || [];
    const sideContent = sidePages[i] || [];

    let pageBody = '';
    if (state.template === 'sidebar') {
      pageBody = `<div class="${bodyClass}">
        ${sideCol ? `<div class="${sideCol.className}">${sideContent.join('')}</div>` : ''}
        <div class="main-col">${mainContent.join('')}</div>
      </div>`;
    } else {
      pageBody = `<div class="${bodyClass}">
        <div class="main-col">${mainContent.join('')}</div>
        ${sideCol ? `<div class="${sideCol.className}">${sideContent.join('')}</div>` : ''}
      </div>`;
    }

    pages.push({
      header: i === 0 ? headerHTML : '',
      body: pageBody
    });
  }

  return pages;
}

export function paginateContent(headerHTML, bodyHTML, state) {
  const pageContentHeight = getPageContentHeight(state.spacing);

  const measureCache = new Map();
  function cachedMeasure(html, colClass) {
    const key = `${html.length}|${colClass || ''}|${html.slice(0, 100)}`;
    let h = measureCache.get(key);
    if (h === undefined) {
      h = measureContentHeight(html, colClass, state);
      measureCache.set(key, h);
    }
    return h;
  }

  const headerHeight = cachedMeasure(headerHTML);
  const continuationHeaderHTML = `<div class="resume-continuation-header"><span class="continuation-name">${state.personal?.name || ''}</span><span class="continuation-divider">·</span><span class="continuation-page">第 2 页</span></div>`;
  const continuationHeaderHeight = cachedMeasure(continuationHeaderHTML);

  if (state.template === 'modern' || state.template === 'sidebar') {
    const sectionsHeight = cachedMeasure(bodyHTML);
    if (headerHeight + sectionsHeight <= pageContentHeight) {
      return [{ header: headerHTML, body: bodyHTML }];
    }
    return paginateComplexLayout(headerHTML, bodyHTML, headerHeight, sectionsHeight, pageContentHeight, continuationHeaderHeight, cachedMeasure, state);
  }

  // Single-column templates
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHTML;
  const sectionEls = Array.from(tempDiv.querySelectorAll('.resume-section'));

  if (sectionEls.length === 0) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const sectionsHeight = cachedMeasure(bodyHTML);
  if (headerHeight + sectionsHeight <= pageContentHeight) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const pages = paginateSectionsIntoPages(sectionEls, headerHeight, pageContentHeight, continuationHeaderHeight, '', cachedMeasure);

  return pages.map((sections, i) => ({
    header: i === 0 ? headerHTML : '',
    body: `<div class="resume-body">${sections.join('')}</div>`
  }));
}
