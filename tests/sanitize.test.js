import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_STATE } from '../src/constants/defaultState.js';
import { mergeState } from '../src/utils/storage.js';
import { escapeHTML, measurementCache, renderFullResumeHTML } from '../src/utils/pagination.js';

// XSS 载荷：导入 JSON 或手动输入的用户数据不得以 HTML 形式进入预览
const XSS_PAYLOAD = '<img src=x onerror="alert(1)">';

describe('XSS escaping & import sanitization', () => {
  beforeEach(() => {
    measurementCache.clear();
  });

  describe('escapeHTML', () => {
    it('should escape all HTML-significant characters', () => {
      expect(escapeHTML('<img src=x onerror="a">')).toBe('&lt;img src=x onerror=&quot;a&quot;&gt;');
      expect(escapeHTML("it's a & b < c > d")).toBe('it&#39;s a &amp; b &lt; c &gt; d');
    });

    it('should handle null and undefined safely', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
    });
  });

  describe('renderFullResumeHTML escaping', () => {
    const maliciousState = {
      ...DEFAULT_STATE,
      personal: {
        ...DEFAULT_STATE.personal,
        name: XSS_PAYLOAD,
        title: `"><script>alert(1)</script>`,
        avatar: `x" onerror="alert(1)`,
        email: XSS_PAYLOAD
      },
      summary: XSS_PAYLOAD,
      experience: [
        {
          id: `exp" data-x="1`,
          company: XSS_PAYLOAD,
          role: XSS_PAYLOAD,
          startDate: XSS_PAYLOAD,
          endDate: XSS_PAYLOAD,
          description: XSS_PAYLOAD
        }
      ],
      skills: [{ id: 'skill-1', category: XSS_PAYLOAD, tags: `${XSS_PAYLOAD}, React` }],
      sectionOrder: ['summary', 'experience', 'skills'],
      sectionColumns: {},
      sectionVisibility: {},
      template: 'modern'
    };

    it('should not emit raw HTML from user data in header', () => {
      const { headerHTML } = renderFullResumeHTML(maliciousState);
      expect(headerHTML).not.toContain('<img src=x');
      expect(headerHTML).not.toContain('<script>');
      expect(headerHTML).not.toContain('onerror="alert(1)"');
      expect(headerHTML).toContain('&lt;img');
    });

    it('should not emit raw HTML from user data in body sections', () => {
      const { bodyHTML } = renderFullResumeHTML(maliciousState);
      expect(bodyHTML).not.toContain('<img src=x');
      expect(bodyHTML).not.toContain('<script>');
      // data-path 属性中的 id 引号被转义，不会逃逸出属性
      expect(bodyHTML).not.toContain('data-path="exp" data-x="1"');
      expect(bodyHTML).toContain('&lt;img');
    });
  });

  describe('mergeState sanitization', () => {
    it('should drop non-object entries and coerce item fields to strings', () => {
      const merged = mergeState(DEFAULT_STATE, {
        experience: [
          'not an object',
          null,
          42,
          { id: 'exp-ok', company: '正常公司', role: 123, startDate: true, extra: 'should be dropped' }
        ]
      });
      expect(merged.experience).toHaveLength(1);
      const item = merged.experience[0];
      expect(item.id).toBe('exp-ok');
      expect(item.company).toBe('正常公司');
      expect(item.role).toBe('123');
      expect(item.startDate).toBe('true');
      expect(item).not.toHaveProperty('extra');
      expect(item.description).toBe('');
    });

    it('should generate ids for items missing them and dedupe duplicate ids', () => {
      const merged = mergeState(DEFAULT_STATE, {
        education: [
          { institution: '无 ID 学校' },
          { id: 'dup', institution: '第一所' },
          { id: 'dup', institution: '第二所' }
        ]
      });
      expect(merged.education).toHaveLength(3);
      const ids = merged.education.map(item => item.id);
      expect(new Set(ids).size).toBe(3);
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBe('dup');
      expect(ids[2]).not.toBe('dup');
    });

    it('should fall back to defaults for invalid theme/template/font/spacing/avatarShape', () => {
      const merged = mergeState(DEFAULT_STATE, {
        theme: 'theme-javascript:alert(1)',
        template: '<script>',
        font: { evil: true },
        spacing: 'spacing-huge',
        personal: { name: '张三', avatarShape: 'blob' }
      });
      expect(merged.theme).toBe(DEFAULT_STATE.theme);
      expect(merged.template).toBe(DEFAULT_STATE.template);
      expect(merged.font).toBe(DEFAULT_STATE.font);
      expect(merged.spacing).toBe(DEFAULT_STATE.spacing);
      expect(merged.personal.avatarShape).toBe(DEFAULT_STATE.personal.avatarShape);
      expect(merged.personal.name).toBe('张三');
    });

    it('should keep only valid sections in sectionOrder and coerce visibility/columns', () => {
      const merged = mergeState(DEFAULT_STATE, {
        sectionOrder: ['experience', 'evil-section', 'experience', 'skills'],
        sectionVisibility: { experience: false, skills: 'yes', summary: 0 },
        sectionColumns: { experience: 'right', skills: 'center' }
      });
      expect(merged.sectionOrder).toEqual(['experience', 'skills']);
      expect(merged.sectionVisibility.experience).toBe(false);
      expect(merged.sectionVisibility.skills).toBe(true);
      // 语义与消费方一致：仅严格等于 false 才视为隐藏
      expect(merged.sectionVisibility.summary).toBe(true);
      expect(merged.sectionColumns.experience).toBe('right');
      expect(merged.sectionColumns.skills).toBe('left');
    });

    it('should keep default personal fields untouched when not provided', () => {
      const merged = mergeState(DEFAULT_STATE, { personal: { name: '李四' } });
      expect(merged.personal.name).toBe('李四');
      expect(merged.personal.title).toBe(DEFAULT_STATE.personal.title);
      expect(merged.personal.avatar).toBe(DEFAULT_STATE.personal.avatar);
    });
  });
});
