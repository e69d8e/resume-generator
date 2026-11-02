import { SPACING_MAP } from '../constants/defaultState.js';

const HTML_ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// 用户数据拼接进 HTML 模板前必须经过此函数，否则经 dangerouslySetInnerHTML 构成 XSS
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

const esc = escapeHTML;

// 32 位字符串散列（FNV-1a 变体）：只靠"长度+前后缀"做缓存键会让两个等长且首尾
// 相同、仅中段不同的条目撞键并复用到错误高度，导致预览被裁切
function hashString(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export class MeasurementCache {
  constructor(maxSize = 800) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  _generateKey(template, theme, font, spacing, columnClass, html) {
    const text = html || '';
    return `${template}|${theme}|${font}|${spacing}|${columnClass || ''}|${text.length}|${hashString(text)}`;
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

// leadingHTML 渲染在列结构之外（页头 / 续页小标题），保证"页头 + 本页列内容"一起量取时
// 页头的宽度、外边距与真实页面一致
export function measureContentHeight(htmlContent, columnClass = '', state = {}, leadingHTML = '') {
  if (typeof document === 'undefined' || (!htmlContent && !leadingHTML)) return 0;

  const currentTemplate = state.template || 'modern';
  const currentTheme = state.theme || 'theme-navy';
  const currentFont = state.font || 'font-sans';
  const currentSpacing = state.spacing || 'spacing-normal';

  const cached = measurementCache.get(currentTemplate, currentTheme, currentFont, currentSpacing, columnClass, `${leadingHTML}\u0000${htmlContent}`);
  if (cached !== undefined) return cached;

  const measureDiv = document.createElement('div');
  // 必须同时带上 resume-page：主题/间距变量（--accent / --sec-gap / --item-gap …）
  // 都声明在 .resume-paper.theme-x、.resume-page.spacing-x 这类选择器上，缺了这个类，
  // var() 全部失效（border 变 0、间距变 0），量出来的高度会系统性偏小
  measureDiv.className = `resume-page resume-measure-sandbox ${currentTheme} ${currentFont} ${currentSpacing} template-${currentTemplate}`;
  const pad = getSpacingPad(currentSpacing);
  measureDiv.style.setProperty('--pad', `${pad}px`);
  measureDiv.style.padding = `0 ${pad}px`;

  let wrapHTML = htmlContent;
  if (columnClass) {
    // 沙盒必须保留双列结构（被测列 + 空占位列），让模板 CSS 的列宽/grid/flex
    // 规则自然生效。若强制 width:auto，测得的行宽会接近整页宽，行数偏少、
    // 高度系统性低估，最终内容被 .resume-page 的 overflow:hidden 静默裁切
    if (currentTemplate === 'modern') {
      if (columnClass === 'main-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col">${htmlContent}</div><div class="side-col"></div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col"></div><div class="side-col">${htmlContent}</div></div>`;
      }
    } else if (currentTemplate === 'sidebar') {
      if (columnClass === 'sidebar-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col">${htmlContent}</div><div class="main-col"></div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col"></div><div class="main-col">${htmlContent}</div></div>`;
      }
    } else {
      wrapHTML = htmlContent;
    }
  }

  // 与真实页面完全同构：.resume-page > .resume-page-inner > (页头 + 列结构)
  const measuredHTML = `<div class="resume-page-inner">${leadingHTML || ''}${wrapHTML}</div>`;
  measureDiv.innerHTML = measuredHTML;

  document.body.appendChild(measureDiv);
  const height = measureDiv.scrollHeight;
  document.body.removeChild(measureDiv);

  measurementCache.set(currentTemplate, currentTheme, currentFont, currentSpacing, columnClass, `${leadingHTML}\u0000${htmlContent}`, height);
  return height;
}

// Brand SVG icons for contact items
const CONTACT_ICONS = {
  calendar: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  user: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><rect x="2" y="4" width="20" height="16" rx="2"></rect><polyline points="22 6 12 13 2 6"></polyline></svg>`,
  'map-pin': `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="contact-icon-svg"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

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
      if (p[field]) items.push(`<div class="contact-item"><span class="contact-label">${label}</span><span contenteditable="true" data-path="personal.${field}">${esc(p[field])}</span></div>`);
    });
  } else {
    const iconContacts = [
      ['age', 'calendar'], ['gender', 'user'], ['arrivalTime', 'clock'],
      ['phone', 'phone'], ['email', 'mail'], ['location', 'map-pin'], ['website', 'globe'],
      ['github', 'github'], ['linkedin', 'linkedin']
    ];
    iconContacts.forEach(([field, icon]) => {
      if (p[field]) {
        const iconHTML = BRAND_ICONS[field] || CONTACT_ICONS[icon] || `<span class="contact-icon-dot">•</span>`;
        items.push(`<div class="contact-item">${iconHTML}<span contenteditable="true" data-path="personal.${field}">${esc(p[field])}</span></div>`);
      }
    });
  }
  return items;
}

export function renderHeaderTemplateHTML(state) {
  const p = state.personal || {};
  const shape = p.avatarShape || 'circle';
  const avatarHTML = p.avatar ? `<div class="avatar-container shape-${shape}"><img src="${esc(p.avatar)}" alt="${esc(p.name || '')}" class="avatar-img shape-${esc(shape)}" /></div>` : '';

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
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>
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
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>
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
              <h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1>
              <div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>
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
            <h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1>
            <div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>
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
        <h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1>
        <div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>
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
        <div class="resume-summary" contenteditable="true" data-path="summary">${esc(state.summary)}</div>
      </section>`;
  }

  if (sectionKey === 'experience') {
    const list = state.experience?.filter(item => item.company || item.role) || [];
    if (list.length === 0) return '';
    const itemsHTML = list.map(item => `
      <div class="resume-item">
        <div class="resume-item-header">
          <span contenteditable="true" data-path="experience.${esc(item.id)}.company">${esc(item.company)}</span>
          <span class="resume-item-date">
            <span contenteditable="true" data-path="experience.${esc(item.id)}.startDate">${esc(item.startDate)}</span> ~
            <span contenteditable="true" data-path="experience.${esc(item.id)}.endDate">${esc(item.endDate)}</span>
          </span>
        </div>
        <div class="resume-item-sub">
          <span contenteditable="true" data-path="experience.${esc(item.id)}.role">${esc(item.role)}</span>
        </div>
        <div class="resume-item-description" contenteditable="true" data-path="experience.${esc(item.id)}.description">${esc(item.description)}</div>
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
          <span contenteditable="true" data-path="education.${esc(item.id)}.institution">${esc(item.institution)}</span>
          <span class="resume-item-date" contenteditable="true" data-path="education.${esc(item.id)}.startDate">${esc(item.startDate)}</span>
        </div>
        <div class="resume-item-sub">
          <span contenteditable="true" data-path="education.${esc(item.id)}.degree">${esc(item.degree)}</span> -
          <span contenteditable="true" data-path="education.${esc(item.id)}.major">${esc(item.major)}</span>
        </div>
        ${item.description ? `<div class="resume-item-description" contenteditable="true" data-path="education.${esc(item.id)}.description">${esc(item.description)}</div>` : ''}
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
          <span contenteditable="true" data-path="projects.${esc(item.id)}.startDate">${esc(item.startDate || '')}</span>
          ${(item.startDate && item.endDate) ? ' ~ ' : ''}
          <span contenteditable="true" data-path="projects.${esc(item.id)}.endDate">${esc(item.endDate || '')}</span>
        </span>` : '';
      const techHTML = item.techStack ? `<div class="project-tech-stack"><strong class="tech-stack-label">技术栈：</strong><span class="tech-stack-val" contenteditable="true" data-path="projects.${esc(item.id)}.techStack">${esc(item.techStack)}</span></div>` : '';
      const linkHTML = item.link ? `<span class="project-link-label"><span class="link-icon">🔗</span> <span>链接:</span> <span contenteditable="true" data-path="projects.${esc(item.id)}.link" class="project-link-url">${esc(item.link)}</span></span>` : '';
      const subHTML = (techHTML || linkHTML) ? `<div class="resume-item-sub">${techHTML}${linkHTML}</div>` : '';
      return `
        <div class="resume-item">
          <div class="resume-item-header">
            <span class="project-name-role">
              <span contenteditable="true" data-path="projects.${esc(item.id)}.name" style="font-weight: 700;">${esc(item.name)}</span>
              <span class="project-role-sep">·</span>
              <span contenteditable="true" data-path="projects.${esc(item.id)}.role" class="project-role">${esc(item.role)}</span>
            </span>
            ${dateHTML}
          </div>
          ${subHTML}
          <div class="resume-item-description" contenteditable="true" data-path="projects.${esc(item.id)}.description">${esc(item.description)}</div>
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
      const tagsHTML = tags.map((tag, tagIdx) => `<span class="resume-skill-tag" contenteditable="true" data-path="skills.${esc(item.id)}.tags.${tagIdx}">${esc(tag)}</span>`).join('');
      return `
        <div class="resume-skill-cat">
          <div class="resume-skill-cat-name" contenteditable="true" data-path="skills.${esc(item.id)}.category">${esc(item.category)}</div>
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
    const avatarHTML = p.avatar ? `<div class="avatar-container shape-${shape}"><img src="${esc(p.avatar)}" alt="${esc(p.name || '')}" class="avatar-img shape-${esc(shape)}" /></div>` : '';
    const contactsList = buildContactItemsHTML(p, 'icon');
    bodyHTML = `<div class="resume-body">
      <div class="sidebar-col">${avatarHTML}<div class="sidebar-contacts">${contactsList.join('')}</div>${renderSectionsHTML(sideSections, state)}</div>
      <div class="main-col"><h1 class="resume-name" contenteditable="true" data-path="personal.name">${esc(p.name || '')}</h1><div class="resume-title" contenteditable="true" data-path="personal.title">${esc(p.title || '')}</div>${renderSectionsHTML(mainSections, state)}</div>
    </div>`;
  } else {
    bodyHTML = `<div class="resume-body">${renderSectionsHTML(state.sectionOrder, state)}</div>`;
  }

  return { headerHTML, bodyHTML };
}

// ── 分页核心 ─────────────────────────────────────────────────────────────
// 旧实现把"每段各自测量的高度"相加，但真实页面里段与段之间还有 --sec-gap 等间距，
// 误差会随段数累积，最后被 .resume-page 的 overflow:hidden 静默裁掉文字。新实现改为
// 对"本页候选内容"整块测量（页头 + 本页全部 section 的真实标记），高度与真实渲染一致。

// 在字符数组中二分查找"最多能放下多少个字符"
function maxFittingPrefix(chars, fits) {
  let lo = 1;
  let hi = chars.length;
  let best = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (fits(mid)) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  // 尽量在空白/标点处断开，避免把英文单词劈成两半
  if (best > 0 && best < chars.length) {
    for (let i = best - 1; i >= Math.max(0, best - 24); i--) {
      if (/[\s，。、；：！？,.;:!?)\]】]$/.test(chars[i])) {
        best = i + 1;
        break;
      }
    }
  }
  return best;
}

// 长文本切分器：把 hostEl 里指定文字容器的文本截断后重建整块 HTML。
// 既用于无子项的自我评价（.resume-summary），也用于单条就超过整页的经历描述
// （.resume-item-description），保证内容不会被 overflow:hidden 静默裁掉。
function createTextTruncator(hostEl, textSelector) {
  if (!hostEl) return null;
  const textEl = hostEl.querySelector(textSelector);
  if (!textEl) return null;
  const fullText = (textEl.textContent || '').trim();
  if (fullText.length < 2) return null;
  return {
    chars: Array.from(fullText),
    build(text) {
      const clone = hostEl.cloneNode(true);
      const target = clone.querySelector(textSelector);
      if (target) target.textContent = text;
      return clone.outerHTML;
    }
  };
}

// 把 section 列表切成多页；每页是 HTML 字符串数组
export function paginateSectionsIntoPages(sectionEls, options = {}) {
  const {
    pagePrefixHTML = '',
    continuationPrefixHTML = '',
    firstPageContentPrefixHTML = '',
    pageContentHeight = 0,
    columnClass = '',
    cachedMeasure = () => 0
  } = options;

  const pages = [];
  let current = firstPageContentPrefixHTML ? [firstPageContentPrefixHTML] : [];
  let prefixHTML = pagePrefixHTML;

  const pageContent = (extra = '') => current.join('') + extra;
  const fits = (contentHTML) => cachedMeasure(contentHTML, columnClass, prefixHTML) <= pageContentHeight;

  const flush = () => {
    if (current.length > 0) pages.push(current);
    current = [];
    prefixHTML = continuationPrefixHTML;
  };

  for (const section of sectionEls) {
    const sectionHTML = section.outerHTML;

    if (fits(pageContent(sectionHTML))) {
      current.push(sectionHTML);
      continue;
    }

    const items = Array.from(section.querySelectorAll('.resume-item, .resume-skill-cat'));

    // 把一段文字按页切分：wrapHTML 负责把截断后的 HTML 放回当前页结构
    const emitTextChunks = (hostEl, textSelector, wrapHTML) => {
      const truncator = createTextTruncator(hostEl, textSelector);
      if (!truncator) return false;
      let index = 0;
      let guard = 0;
      while (index < truncator.chars.length && guard++ < 400) {
        const tail = truncator.chars.slice(index);
        const limit = maxFittingPrefix(tail, (n) => fits(pageContent(wrapHTML(truncator.build(tail.slice(0, n).join(''))))));
        if (limit === 0) {
          if (current.length > 0) {
            flush();
            continue;
          }
          break;
        }
        current.push(wrapHTML(truncator.build(tail.slice(0, limit).join(''))));
        index += limit;
        if (index < truncator.chars.length) flush();
      }
      if (index < truncator.chars.length) {
        // 极端情况（一个字符都放不下）：保留剩余内容，宁可溢出也不能丢文字
        current.push(wrapHTML(truncator.build(truncator.chars.slice(index).join(''))));
      }
      return true;
    };

    // 没有可切分的条目：尝试按文本切分长段落（自我评价等），否则整段独占新页
    if (items.length === 0) {
      if (emitTextChunks(section, '.resume-summary', (html) => html)) continue;
      flush();
      current.push(sectionHTML);
      continue;
    }

    const titleEl = section.querySelector('.resume-section-title');
    const titleHTML = titleEl ? titleEl.outerHTML : '';
    const sectionClass = section.className;
    const wrap = (groupHTML) => `<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${groupHTML}</div></section>`;

    let group = [];
    for (const item of items) {
      const itemHTML = item.outerHTML;
      if (fits(pageContent(wrap([...group, itemHTML].join(''))))) {
        group.push(itemHTML);
        continue;
      }
      if (group.length > 0) {
        current.push(wrap(group.join('')));
        group = [];
      }
      flush();
      if (fits(wrap(itemHTML))) {
        group = [itemHTML];
      } else if (emitTextChunks(item, '.resume-item-description', (html) => wrap(html))) {
        // 单条自身就超过整页：按描述文本切分（每页重复条目头），避免被静默裁掉
        group = [];
      } else {
        // 没有任何可切分的文字：独占一页，避免死循环
        current.push(wrap(itemHTML));
        flush();
      }
    }
    if (group.length > 0) current.push(wrap(group.join('')));
  }

  flush();
  return pages;
}

export function paginateComplexLayout(headerHTML, bodyHTML, pageContentHeight, continuationHeaderHTML, cachedMeasure, state) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHTML;
  const bodyEl = tempDiv.querySelector('.resume-body');
  const mainCol = tempDiv.querySelector('.main-col');
  const sideCol = tempDiv.querySelector('.side-col') || tempDiv.querySelector('.sidebar-col');

  if (!mainCol) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const bodyClass = bodyEl?.className || 'resume-body';
  const isSidebar = state?.template === 'sidebar';
  const sideColumnClass = isSidebar ? 'sidebar-col' : 'side-col';

  // 列内静态内容（侧栏头像/联系方式、名片姓名等）不属于任何 section，
  // 但必须保留在第 1 页，否则多页时会被整块丢掉
  const collect = (col) => {
    if (!col) return { staticHTML: '', sections: [] };
    const staticNodes = Array.from(col.children).filter((child) => !child.classList.contains('resume-section'));
    return {
      staticHTML: staticNodes.map((child) => child.outerHTML).join(''),
      sections: Array.from(col.querySelectorAll('.resume-section'))
    };
  };

  const main = collect(mainCol);
  const side = collect(sideCol);

  const paginateColumn = (column, columnClass) => paginateSectionsIntoPages(column.sections, {
    pagePrefixHTML: headerHTML,
    continuationPrefixHTML: continuationHeaderHTML,
    firstPageContentPrefixHTML: column.staticHTML,
    pageContentHeight,
    columnClass,
    cachedMeasure
  });

  const mainPages = paginateColumn(main, 'main-col');
  const sidePages = paginateColumn(side, sideColumnClass);

  const maxPages = Math.max(mainPages.length, sidePages.length);
  const pages = [];

  for (let i = 0; i < maxPages; i++) {
    const mainContent = (mainPages[i] || []).join('');
    const sideContent = (sidePages[i] || []).join('');

    // sidebar 模板的侧栏在左，主栏在右
    const columnsHTML = isSidebar
      ? `${sideCol ? `<div class="${sideCol.className}">${sideContent}</div>` : ''}<div class="main-col">${mainContent}</div>`
      : `<div class="main-col">${mainContent}</div>${sideCol ? `<div class="${sideCol.className}">${sideContent}</div>` : ''}`;

    pages.push({
      header: i === 0 ? headerHTML : '',
      body: `<div class="${bodyClass}">${columnsHTML}</div>`
    });
  }

  return pages.length > 0 ? pages : [{ header: headerHTML, body: bodyHTML }];
}

export function paginateContent(headerHTML, bodyHTML, state) {
  const pageContentHeight = getPageContentHeight(state.spacing);

  const measureCache = new Map();
  function cachedMeasure(html, colClass, leadingHTML = '') {
    const key = `${hashString(html)}|${html.length}|${colClass || ''}|${hashString(leadingHTML)}|${leadingHTML.length}`;
    let h = measureCache.get(key);
    if (h === undefined) {
      h = measureContentHeight(html, colClass, state, leadingHTML);
      measureCache.set(key, h);
    }
    return h;
  }

  const continuationHeaderHTML = `<div class="resume-continuation-header"><span class="continuation-name">${esc(state.personal?.name || '')}</span><span class="continuation-divider">·</span><span class="continuation-page">第 2 页</span></div>`;

  // 先用"整页真实标记"判断能否一页放下，避免分块测量求和带来的误差
  if (cachedMeasure(bodyHTML, '', headerHTML) <= pageContentHeight) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  if (state.template === 'modern' || state.template === 'sidebar') {
    return paginateComplexLayout(headerHTML, bodyHTML, pageContentHeight, continuationHeaderHTML, cachedMeasure, state);
  }

  // Single-column templates
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHTML;
  const sectionEls = Array.from(tempDiv.querySelectorAll('.resume-section'));

  if (sectionEls.length === 0) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const pages = paginateSectionsIntoPages(sectionEls, {
    pagePrefixHTML: headerHTML,
    continuationPrefixHTML: continuationHeaderHTML,
    pageContentHeight,
    columnClass: '',
    cachedMeasure
  });

  if (pages.length === 0) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  return pages.map((sections, i) => ({
    header: i === 0 ? headerHTML : '',
    body: `<div class="resume-body">${sections.join('')}</div>`
  }));
}
