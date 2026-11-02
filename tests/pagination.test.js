import { describe, it, expect, beforeEach } from 'vitest';
import {
  MeasurementCache,
  measurementCache,
  getPageContentHeight,
  getSpacingPad,
  paginateSectionsIntoPages,
  paginateComplexLayout,
  renderFullResumeHTML,
  renderSectionItemsHTML
} from '../src/utils/pagination.js';
import { DEFAULT_STATE } from '../src/constants/defaultState.js';

// 假测量器：按 data-h 累加高度；页头(leadingHTML)与列内容一起量，与真实实现一致
const weigh = (html) => [...html.matchAll(/data-h="(\d+)"/g)].reduce((sum, m) => sum + Number(m[1]), 0);
const measurePage = (html, _columnClass, leadingHTML = '') => weigh(html) + weigh(leadingHTML || '');

describe('Pagination Engine & Measurement Cache', () => {
  beforeEach(() => {
    measurementCache.clear();
  });

  describe('MeasurementCache', () => {
    it('should set and retrieve cached height values correctly', () => {
      const cache = new MeasurementCache(10);
      const html = '<div class="test-item">工作经历条目内容</div>';
      
      expect(cache.get('modern', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html)).toBeUndefined();

      cache.set('modern', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html, 120);

      expect(cache.get('modern', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html)).toBe(120);
    });

    it('should differentiate cache keys by template, font, spacing and columnClass', () => {
      const cache = new MeasurementCache(10);
      const html = '<div>内容</div>';

      cache.set('modern', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html, 100);
      cache.set('sidebar', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html, 200);
      cache.set('modern', 'theme-navy', 'font-serif', 'spacing-normal', 'main-col', html, 110);
      cache.set('modern', 'theme-navy', 'font-sans', 'spacing-compact', 'main-col', html, 80);

      expect(cache.get('modern', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html)).toBe(100);
      expect(cache.get('sidebar', 'theme-navy', 'font-sans', 'spacing-normal', 'main-col', html)).toBe(200);
      expect(cache.get('modern', 'theme-navy', 'font-serif', 'spacing-normal', 'main-col', html)).toBe(110);
      expect(cache.get('modern', 'theme-navy', 'font-sans', 'spacing-compact', 'main-col', html)).toBe(80);
    });

    it('should evict oldest entry when max capacity is reached', () => {
      const smallCache = new MeasurementCache(3);
      smallCache.set('t', 'th', 'f', 's', 'c', 'html-1', 10);
      smallCache.set('t', 'th', 'f', 's', 'c', 'html-2', 20);
      smallCache.set('t', 'th', 'f', 's', 'c', 'html-3', 30);

      expect(smallCache.get('t', 'th', 'f', 's', 'c', 'html-1')).toBe(10);

      smallCache.set('t', 'th', 'f', 's', 'c', 'html-4', 40);

      expect(smallCache.get('t', 'th', 'f', 's', 'c', 'html-4')).toBe(40);
      expect(smallCache.get('t', 'th', 'f', 's', 'c', 'html-2')).toBeUndefined();
    });

    it('should completely clear all cached entries on clear()', () => {
      const cache = new MeasurementCache(10);
      cache.set('t', 'th', 'f', 's', 'c', 'item', 50);
      expect(cache.get('t', 'th', 'f', 's', 'c', 'item')).toBe(50);
      cache.clear();
      expect(cache.get('t', 'th', 'f', 's', 'c', 'item')).toBeUndefined();
    });
  });

  describe('Page Height Calculations', () => {
    it('should calculate page content height subtracting double spacing padding from A4 height', () => {
      expect(getSpacingPad('spacing-normal')).toBe(20);
      expect(getPageContentHeight('spacing-normal')).toBe(1123 - (20 * 2));

      expect(getSpacingPad('spacing-compact')).toBe(16);
      expect(getPageContentHeight('spacing-compact')).toBe(1123 - (16 * 2));

      expect(getSpacingPad('spacing-comfortable')).toBe(26);
      expect(getPageContentHeight('spacing-comfortable')).toBe(1123 - (26 * 2));
    });
  });

  describe('Multi-Page Content Splitting', () => {
    // 用一个"按 data-h 累加高度"的假测量器：整页候选内容的高度 = 各段高度之和，
    // 与真实排版（整页标记一次测量）的行为一致
    const makeSection = (title, height, items = []) => ({
      outerHTML: `<section class="resume-section" data-h="${height}"><div class="resume-section-title">${title}</div><div class="resume-items-list">${items.join('')}</div></section>`,
      className: 'resume-section',
      querySelectorAll: () => [],
      querySelector: () => null
    });

    it('should split overflowing sections across multiple pages', () => {
      const sections = [makeSection('Section 1', 600), makeSection('Section 2', 600)];
      const pages = paginateSectionsIntoPages(sections, {
        pagePrefixHTML: '<header data-h="200"></header>',
        continuationPrefixHTML: '<div data-h="40"></div>',
        pageContentHeight: 1000,
        cachedMeasure: measurePage
      });

      expect(pages.length).toBe(2);
      expect(pages[0]).toHaveLength(1);
      expect(pages[1]).toHaveLength(1);
    });

    it('should measure the candidate page as a whole so inter-section spacing is counted', () => {
      // 两段各 480px + 页头 50px = 1010 > 1000：整页候选必须溢出到第 2 页
      const sections = [makeSection('A', 480), makeSection('B', 480)];
      const pages = paginateSectionsIntoPages(sections, {
        pagePrefixHTML: '<header data-h="50"></header>',
        continuationPrefixHTML: '',
        pageContentHeight: 1000,
        cachedMeasure: measurePage
      });

      expect(pages.length).toBe(2);
      expect(weigh(pages[0].join(''))).toBeLessThanOrEqual(1000 - 50);
    });

    it('should move remaining items of a long list to the next page', () => {
      const items = Array.from({ length: 6 }, () => '<div class="resume-item" data-h="200"></div>');
      const section = {
        outerHTML: `<section class="resume-section section-experience" data-h="${6 * 200}"><div class="resume-section-title">工作</div><div class="resume-items-list">${items.join('')}</div></section>`,
        className: 'resume-section section-experience',
        querySelectorAll: () => items.map((html) => ({ outerHTML: html })),
        querySelector: () => ({ outerHTML: '<div class="resume-section-title">工作</div>' })
      };

      const pages = paginateSectionsIntoPages([section], {
        pagePrefixHTML: '',
        continuationPrefixHTML: '',
        pageContentHeight: 500,
        cachedMeasure: weigh
      });

      expect(pages.length).toBe(3);
      pages.forEach((page) => expect(weigh(page.join(''))).toBeLessThanOrEqual(500));
    });

    it('should generate full resume HTML with all sections and renderHeaderTemplateHTML', () => {
      const mockState = {
        template: 'modern',
        personal: { name: '张三', title: '前端工程师', avatarShape: 'circle' },
        summary: '这是自我评价',
        sectionOrder: ['summary'],
        sectionColumns: { summary: 'left' }
      };

      const { headerHTML, bodyHTML } = renderFullResumeHTML(mockState);
      expect(headerHTML).toContain('张三');
      expect(headerHTML).toContain('前端工程师');
      expect(bodyHTML).toContain('这是自我评价');
    });
  });

  describe('Edge Cases', () => {
    it('should split a text-only section (自我评价) instead of clipping it', () => {
      // 用真实 DOM 节点，走"按文本二分切分"的分支
      const sectionEl = document.createElement('section');
      sectionEl.className = 'resume-section section-summary';
      sectionEl.innerHTML = '<div class="resume-section-title"><span>自我评价</span></div><div class="resume-summary">' + '一段很长的自我评价。'.repeat(60) + '</div>';

      // 假测量：每个字符 10px，页高 1000px
      const measure = (html) => {
        const text = /<div class="resume-summary">([\s\S]*?)<\/div>/.exec(html)?.[1] || '';
        return text.length * 10 + 40;
      };

      const pages = paginateSectionsIntoPages([sectionEl], {
        pagePrefixHTML: '',
        continuationPrefixHTML: '',
        pageContentHeight: 1000,
        cachedMeasure: measure
      });

      expect(pages.length).toBeGreaterThan(1);
      const rebuilt = pages.map((page) => page.join('')).join('').match(/<div class="resume-summary">([\s\S]*?)<\/div>/g);
      // 文本必须全部保留，不能被裁掉
      expect(rebuilt.length).toBe(pages.length);
      pages.forEach((page) => expect(measure(page.join(''))).toBeLessThanOrEqual(1000));
    });

    it('should place an oversized item-less section on its own page without looping', () => {
      const sections = [
        {
          outerHTML: '<section class="resume-section section-skills" data-h="5000"><div>技能</div></section>',
          querySelectorAll: () => [],
          querySelector: () => null,
          className: 'resume-section section-skills'
        },
        {
          outerHTML: '<section class="resume-section section-education" data-h="100"><div>教育</div></section>',
          querySelectorAll: () => [],
          querySelector: () => null,
          className: 'resume-section section-education'
        }
      ];
      const pages = paginateSectionsIntoPages(sections, {
        pagePrefixHTML: '<div data-h="40"></div>',
        continuationPrefixHTML: '',
        pageContentHeight: 1083,
        cachedMeasure: measurePage
      });

      expect(pages.length).toBe(2);
      expect(pages[0].join('')).toContain('技能');
      expect(pages[1].join('')).toContain('教育');
    });

    it('should split an oversized single item by its description instead of clipping it', () => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'resume-section section-experience';
      sectionEl.innerHTML = `
        <div class="resume-section-title"><span>工作经历</span></div>
        <div class="resume-items-list">
          <div class="resume-item">
            <div class="resume-item-header"><span>某公司</span></div>
            <div class="resume-item-sub"><span>PM</span></div>
            <div class="resume-item-description">${'很长的职责描述。'.repeat(300)}</div>
          </div>
        </div>`;

      // 每个字符 10px，页高 1000px
      const measure = (html) => {
        const text = /<div class="resume-item-description">([\s\S]*?)<\/div>/.exec(html)?.[1] || '';
        return text.length * 10 + 60;
      };

      const pages = paginateSectionsIntoPages([sectionEl], {
        pagePrefixHTML: '',
        continuationPrefixHTML: '',
        pageContentHeight: 1000,
        cachedMeasure: measure
      });

      expect(pages.length).toBeGreaterThan(1);
      pages.forEach((page) => expect(measure(page.join(''))).toBeLessThanOrEqual(1000));
      // 每块都要保留条目头（公司名），否则续页上看不出是谁的经历
      pages.forEach((page) => expect(page.join('')).toContain('某公司'));
    });

    it('should keep column static content (avatar/contacts) on the first page', () => {
      const bodyHTML = `
        <div class="resume-body">
          <div class="sidebar-col">
            <div class="avatar-container" data-h="100">头像</div>
            <div class="sidebar-contacts" data-h="120">联系方式</div>
            <section class="resume-section section-skills" data-h="900">技能</section>
          </div>
          <div class="main-col">
            <h1 class="resume-name" data-h="60">张三</h1>
            <section class="resume-section section-experience" data-h="900">经历</section>
          </div>
        </div>`;

      const pages = paginateComplexLayout('<header data-h="100"></header>', bodyHTML, 1000, '', measurePage, { template: 'sidebar' });

      expect(pages.length).toBe(2);
      expect(pages[0].body).toContain('avatar-container');
      expect(pages[0].body).toContain('sidebar-contacts');
      expect(pages[0].body).toContain('张三');
      // 第 2 页不再重复静态头像/联系方式
      expect(pages[1].body).not.toContain('avatar-container');
    });

    it('should render skill tags with 4-segment data-path for preview editing', () => {
      const state = {
        ...DEFAULT_STATE,
        sectionOrder: ['skills'],
        sectionVisibility: { skills: true },
        sectionColumns: {},
        skills: [{ id: 'skill-9', category: '前端', tags: 'React, Vue' }]
      };
      const html = renderSectionItemsHTML('skills', state);
      expect(html).toContain('data-path="skills.skill-9.tags.0"');
      expect(html).toContain('data-path="skills.skill-9.tags.1"');
      expect(html).toContain('React');
      expect(html).toContain('Vue');
    });

    it('should hide sections whose visibility is explicitly false', () => {
      const state = {
        ...DEFAULT_STATE,
        sectionOrder: ['summary', 'skills'],
        sectionVisibility: { summary: false, skills: true },
        sectionColumns: {},
        template: 'minimal'
      };
      const { bodyHTML } = renderFullResumeHTML(state);
      expect(bodyHTML).not.toContain('自我评价');
      expect(bodyHTML).toContain('专业技能');
    });
  });
});
