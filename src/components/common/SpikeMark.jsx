import React from 'react';

// DESIGN.md 规范的品牌符号：放射状尖刺标记（asterisk-like radial spike），
// 作为品牌字标前缀，米色画布上使用墨色（currentColor 跟随文字色）
export default function SpikeMark({ size = 24, className, style }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {rays.map(angle => (
        <path
          key={angle}
          d="M12 1.6 L13.35 8.8 L12 10.4 L10.65 8.8 Z"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}
