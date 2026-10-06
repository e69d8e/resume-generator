import { describe, it, expect } from 'vitest';
import { updateTagInTagsString } from '../src/utils/skills.js';
import { generateId } from '../src/utils/id.js';

describe('updateTagInTagsString', () => {
  it('should replace the tag at the given index', () => {
    expect(updateTagInTagsString('React, Vue, Angular', 1, 'Svelte')).toBe('React, Svelte, Angular');
  });

  it('should remove the tag when value is empty', () => {
    expect(updateTagInTagsString('React, Vue, Angular', 1, '')).toBe('React, Angular');
    expect(updateTagInTagsString('React, Vue', 0, '   ')).toBe('Vue');
  });

  it('should append when index is out of range', () => {
    expect(updateTagInTagsString('React', 5, 'Vue')).toBe('React, Vue');
  });

  it('should trim tags and normalize separators', () => {
    expect(updateTagInTagsString(' React ,  Vue ,, Angular ', 2, 'Go')).toBe('React, Vue, Go');
  });

  it('should handle empty input', () => {
    expect(updateTagInTagsString('', 0, 'React')).toBe('React');
    expect(updateTagInTagsString(null, 0, 'React')).toBe('React');
    expect(updateTagInTagsString('', 0, '')).toBe('');
  });
});

describe('generateId', () => {
  it('should generate unique ids even within the same millisecond', () => {
    const ids = Array.from({ length: 100 }, () => generateId('exp'));
    expect(new Set(ids).size).toBe(100);
  });

  it('should include the given prefix', () => {
    expect(generateId('skill')).toMatch(/^skill-/);
  });
});
