// 一次性脚本：生成莫兰迪灰调的内置默认头像 PNG（128x128，圆头+肩部剪影），
// 以 dataURL 形式写入 defaultState.js，替代 unsplash 外链（PDF 导出/离线不再依赖第三方 CORS）
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 128, H = 128;
const px = Buffer.alloc(W * H * 4);

function put(x, y, r, g, b, a = 255) {
  const i = (y * W + x) * 4;
  px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    // 背景竖向渐变：#ECE7E1 -> #DDD6CE（暖灰）
    const t = y / (H - 1);
    put(x, y, lerp(236, 221, t), lerp(231, 214, t), lerp(225, 206, t));
  }
}

// 头部圆（中心 64,52 半径 24），颜色 #A89F94
const head = { cx: 64, cy: 52, r: 24 };
const col = [168, 159, 148];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dh = Math.hypot(x - head.cx, y - head.cy);
    // 肩部：椭圆弧，中心 64,120，rx 44, ry 44 的上半部分
    const ds = Math.hypot((x - 64) / 44, (y - 122) / 46);
    const inShape = dh <= head.r || (ds <= 1 && y > 88);
    if (inShape) put(x, y, col[0], col[1], col[2]);
  }
}

// PNG 编码
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // RGBA
const raw = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 4 + 1)] = 0; // filter none
  px.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const dataUrl = `data:image/png;base64,${png.toString('base64')}`;
const target = path.join(__dirname, '..', 'src', 'constants', 'defaultState.js');
let content = fs.readFileSync(target, 'utf8');
const oldUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
if (!content.includes(oldUrl)) {
  console.error('ERROR: unsplash URL not found in defaultState.js');
  process.exit(1);
}
content = content.replace(oldUrl, dataUrl);
fs.writeFileSync(target, content);
console.log('OK, avatar dataURL length:', dataUrl.length);
