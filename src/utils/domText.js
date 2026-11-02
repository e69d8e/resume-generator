// 把 contenteditable 元素的内容还原成纯文本。
// 直接读 textContent 会丢掉回车换行：浏览器在 contenteditable 里用 <br> 或块元素
// 表示换行，textContent 里两者都不产生 "\n"，导致预览内联编辑多行描述时换行被吞。
const BLOCK_TAGS = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DIV', 'DL', 'FIELDSET', 'FIGCAPTION',
  'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR',
  'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TR', 'UL'
]);

export function readEditableText(root) {
  if (!root) return '';

  let out = '';
  const breakLine = () => {
    if (out.length > 0 && !out.endsWith('\n')) out += '\n';
  };

  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        out += child.nodeValue.replace(/\u00a0/g, ' ');
        continue;
      }
      if (child.nodeType !== 1) continue;

      const tag = child.tagName;
      if (tag === 'BR') {
        out += '\n';
        continue;
      }
      if (tag === 'SCRIPT' || tag === 'STYLE') continue;

      const isBlock = BLOCK_TAGS.has(tag);
      if (isBlock) breakLine();
      walk(child);
      if (isBlock) breakLine();
    }
  };

  walk(root);

  return out
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+$/, '');
}
