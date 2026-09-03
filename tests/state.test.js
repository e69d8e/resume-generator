import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_STATE, DEFAULT_SECTION_COLUMNS, SECTION_NAMES, CARD_TITLE_CONFIG } from '../src/constants/defaultState.js';
import { mergeState } from '../src/utils/storage.js';

describe('State Management & Schema Defaults', () => {
  let testState;

  beforeEach(() => {
    testState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  });

  describe('DEFAULT_STATE', () => {
    it('should have all required root properties and default configurations', () => {
      expect(testState).toHaveProperty('personal');
      expect(testState.personal).toHaveProperty('name', '张三');
      expect(testState.personal).toHaveProperty('title');
      expect(testState.personal).toHaveProperty('email');
      expect(testState.personal).toHaveProperty('phone');
      expect(testState).toHaveProperty('summary');
      expect(testState).toHaveProperty('experience');
      expect(Array.isArray(testState.experience)).toBe(true);
      expect(testState.experience.length).toBeGreaterThanOrEqual(1);
      expect(testState).toHaveProperty('education');
      expect(Array.isArray(testState.education)).toBe(true);
      expect(testState).toHaveProperty('projects');
      expect(Array.isArray(testState.projects)).toBe(true);
      expect(testState).toHaveProperty('skills');
      expect(Array.isArray(testState.skills)).toBe(true);
      expect(testState.sectionOrder).toEqual(['summary', 'experience', 'projects', 'education', 'skills']);
      expect(testState.theme).toBe('theme-navy');
      expect(testState.font).toBe('font-sans');
      expect(testState.spacing).toBe('spacing-normal');
      expect(testState.template).toBe('modern');
    });
  });

  describe('mergeState', () => {
    it('should return a deep clone of base state if loaded state is invalid or null', () => {
      const merged1 = mergeState(DEFAULT_STATE, null);
      expect(merged1).toEqual(DEFAULT_STATE);
      expect(merged1).not.toBe(DEFAULT_STATE);

      const merged2 = mergeState(DEFAULT_STATE, undefined);
      expect(merged2).toEqual(DEFAULT_STATE);

      const merged3 = mergeState(DEFAULT_STATE, 'invalid json string');
      expect(merged3).toEqual(DEFAULT_STATE);
    });

    it('should correctly merge partial personal info and preserve untouched fields', () => {
      const saved = {
        personal: {
          name: '李四',
          email: 'lisi@test.com'
        },
        template: 'elegant'
      };
      const merged = mergeState(DEFAULT_STATE, saved);
      expect(merged.personal.name).toBe('李四');
      expect(merged.personal.email).toBe('lisi@test.com');
      // Untouched fields must remain from DEFAULT_STATE
      expect(merged.personal.title).toBe(DEFAULT_STATE.personal.title);
      expect(merged.personal.phone).toBe(DEFAULT_STATE.personal.phone);
      expect(merged.template).toBe('elegant');
    });

    it('should guard against prototype pollution attacks', () => {
      const maliciousPayload = JSON.parse('{"personal": {"__proto__": {"polluted": true}, "name": "黑客"}}');
      const merged = mergeState(DEFAULT_STATE, maliciousPayload);
      expect(merged.personal.name).toBe('黑客');
      expect(Object.prototype.polluted).toBeUndefined();
    });

    it('should override list sections if array is provided', () => {
      const saved = {
        experience: [{ id: 'exp-custom', company: '测试科技', role: '前端架构师' }]
      };
      const merged = mergeState(DEFAULT_STATE, saved);
      expect(merged.experience).toHaveLength(1);
      expect(merged.experience[0].company).toBe('测试科技');
      // Other arrays should remain default
      expect(merged.education.length).toBe(DEFAULT_STATE.education.length);
    });
  });

  describe('Section Configurations', () => {
    it('should define display names for all default sections', () => {
      expect(SECTION_NAMES).toHaveProperty('summary', '自我评价');
      expect(SECTION_NAMES).toHaveProperty('experience', '工作经历');
      expect(SECTION_NAMES).toHaveProperty('projects', '项目经验');
      expect(SECTION_NAMES).toHaveProperty('education', '教育背景');
      expect(SECTION_NAMES).toHaveProperty('skills', '专业技能');
    });

    it('should have column assignments for two-column templates', () => {
      expect(DEFAULT_SECTION_COLUMNS.summary).toBe('left');
      expect(DEFAULT_SECTION_COLUMNS.experience).toBe('left');
      expect(DEFAULT_SECTION_COLUMNS.skills).toBe('right');
    });
  });
});
