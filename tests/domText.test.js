import { describe, it, expect } from 'vitest';
import { readEditableText } from '../src/utils/domText.js';

function el(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('readEditableText', () => {
  it('should keep line breaks produced by <br> when editing in preview', () => {
    expect(readEditableText(el('第一行<br>第二行'))).toBe('第一行\n第二行');
    expect(readEditableText(el('第一行<br><br>第三行'))).toBe('第一行\n\n第三行');
  });

  it('should treat block children (div/p/li) as line breaks', () => {
    // Chrome 在 contenteditable 里回车常生成 <div>，textContent 会丢掉换行
    expect(readEditableText(el('<div>第一行</div><div>第二行</div>'))).toBe('第一行\n第二行');
    expect(readEditableText(el('<p>段落一</p><p>段落二</p>'))).toBe('段落一\n段落二');
    expect(readEditableText(el('<ul><li>a</li><li>b</li></ul>'))).toBe('a\nb');
  });

  it('should preserve existing newlines in text nodes', () => {
    expect(readEditableText(el('一\n二\n三'))).toBe('一\n二\n三');
  });

  it('should normalize nbsp and trailing breaks', () => {
    expect(readEditableText(el('a\u00a0b<br>'))).toBe('a b');
    expect(readEditableText(el('只有一行<br><br>'))).toBe('只有一行');
  });

  it('should handle empty and missing roots', () => {
    expect(readEditableText(null)).toBe('');
    expect(readEditableText(el(''))).toBe('');
  });

  it('should not swallow inline spans (skill tags / dates)', () => {
    expect(readEditableText(el('2023-03 ~ <span>至今</span>'))).toBe('2023-03 ~ 至今');
  });
});
