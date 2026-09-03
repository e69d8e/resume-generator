import { describe, it, expect, beforeEach } from 'vitest';
import {
  MeasurementCache,
  measurementCache,
  getPageContentHeight,
  getSpacingPad,
  paginateSectionsIntoPages,
  renderFullResumeHTML
} from '../src/utils/pagination.js';

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
    it('should split overflowing sections across multiple pages', () => {
      const dummySections = [
        { outerHTML: '<section class="resume-section"><h3>Section 1</h3><div class="resume-item">Item 1</div></section>', querySelectorAll: () => [], querySelector: () => null, className: 'resume-section' },
        { outerHTML: '<section class="resume-section"><h3>Section 2</h3><div class="resume-item">Item 2</div></section>', querySelectorAll: () => [], querySelector: () => null, className: 'resume-section' }
      ];

      // Each section height is 600px, page limit is 1000px, initial height is 200px
      const cachedMeasure = (html) => 600;
      const pages = paginateSectionsIntoPages(dummySections, 200, 1000, 40, '', cachedMeasure);

      expect(pages.length).toBe(2);
      expect(pages[0].length).toBe(1);
      expect(pages[1].length).toBe(1);
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
});
