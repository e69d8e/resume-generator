// 一次性脚本：将根目录 styles.css 按主要区段注释拆分到 src/styles/ 下。
// 安全保证：所有文件按序拼接后与原文件字节级一致，且每个文件花括号平衡。
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const lines = source.split('\n');

const ranges = [
  ['base.css', 1, 1299],                     // 编辑器 UI、控件、裁剪模态框、排序器
  ['resume-document.css', 1300, 1732],       // 简历文档基础布局与主题/字体/间距
  ['template-modern.css', 1733, 1929],       // TEMPLATE 1: MODERN
  ['template-elegant-sidebar.css', 1930, 2325], // TEMPLATE 2-3: ELEGANT + SIDEBAR
  ['editor-ux.css', 2326, 2536],             // TAB 导航与文本编辑 UX
  ['template-geek-minimal.css', 2537, 2927], // TEMPLATE 4-5: GEEK + MINIMAL（含技术栈/链接组件）
  ['template-creative-compact.css', 2928, 3293], // TEMPLATE 6-7: CREATIVE + COMPACT
  ['print.css', 3294, 3902],                 // 打印 / PDF 生成
  ['responsive.css', 3903, lines.length]     // 移动端与响应式
];

// 覆盖完整性检查：范围必须首尾相接
for (let i = 1; i < ranges.length; i++) {
  if (ranges[i][1] !== ranges[i - 1][2] + 1) {
    console.error(`RANGE GAP between ${ranges[i - 1][0]} and ${ranges[i][0]}`);
    process.exit(1);
  }
}
if (ranges[ranges.length - 1][2] !== lines.length) {
  console.error('LAST RANGE does not cover EOF');
  process.exit(1);
}

const outDir = path.join(root, 'src', 'styles');
fs.mkdirSync(outDir, { recursive: true });

const parts = [];
for (const [name, start, end] of ranges) {
  const chunk = lines.slice(start - 1, end).join('\n');
  const opens = (chunk.match(/\{/g) || []).length;
  const closes = (chunk.match(/\}/g) || []).length;
  if (opens !== closes) {
    console.error(`BRACE IMBALANCE in ${name}: { ${opens} vs } ${closes}`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(outDir, name), chunk);
  parts.push(chunk);
  console.log(`OK ${name}: lines ${start}-${end} (${end - start + 1} lines, braces balanced)`);
}

const reassembled = parts.join('\n');
if (reassembled !== source) {
  console.error('REASSEMBLY MISMATCH: concatenated output differs from original');
  process.exit(1);
}
console.log('Byte-identical reassembly verified.');
