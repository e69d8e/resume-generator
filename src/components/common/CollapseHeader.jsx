import React from 'react';

// 可折叠卡片头部的统一键盘可访问实现：div + role="button"，
// 支持 Enter/Space 切换并向屏幕阅读器暴露展开状态
export default function CollapseHeader({ collapsed, onToggle, className = 'section-header', label, children }) {
  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-expanded={!collapsed}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {children}
    </div>
  );
}
