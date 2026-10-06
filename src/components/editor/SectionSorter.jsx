import React, { useState } from 'react';
import { Eye, EyeOff, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useResumeData } from '../../context/ResumeContext.jsx';
import { SECTION_NAMES } from '../../constants/defaultState.js';

export default function SectionSorter() {
  const { state, reorderSections, toggleSectionVisibility, toggleSectionColumn } = useResumeData();
  const [draggedIndex, setDraggedIndex] = useState(null);

  const isTwoColumn = state.template === 'modern' || state.template === 'sidebar';
  const order = state.sectionOrder || [];

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    // Firefox 规范要求 drag 会话携带数据，否则拖拽不启动
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderSections(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  // 拖到列表外松手或按 Esc 取消时 drop 不会触发，必须靠 dragEnd 复位样式
  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="sortable-list" id="sortable-sections">
      {order.map((section, index) => {
        const isVisible = state.sectionVisibility?.[section] !== false;
        const displayName = SECTION_NAMES[section] || section;
        const isLeft = (state.sectionColumns?.[section] || 'left') === 'left';

        return (
          <div
            key={section}
            className={`sortable-item ${draggedIndex === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="sortable-item-left">
              <span className="drag-handle">
                <GripVertical size={16} />
              </span>
              <button
                type="button"
                className={`visibility-btn ${isVisible ? 'visible' : 'hidden'}`}
                title={isVisible ? '隐藏模块' : '显示模块'}
                aria-label={isVisible ? `隐藏${displayName}` : `显示${displayName}`}
                onClick={() => toggleSectionVisibility(section, !isVisible)}
              >
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <span className={`section-name-text ${isVisible ? '' : 'text-muted'}`}>
                {displayName}
              </span>
            </div>

            <div className="sortable-item-right">
              {isTwoColumn && (
                <button
                  type="button"
                  className={`col-badge ${isLeft ? 'left-col' : 'right-col'}`}
                  title={`切换到${isLeft ? '侧栏 (右栏)' : '主栏 (左栏)'}`}
                  onClick={() => toggleSectionColumn(section)}
                >
                  {isLeft ? '主栏' : '侧栏'}
                </button>
              )}
              {/* 触摸设备不支持 HTML5 拖拽，提供上下移按钮兜底 */}
              <div className="move-btn-group">
                <button
                  type="button"
                  className="move-btn"
                  title="上移"
                  aria-label={`上移${displayName}`}
                  disabled={index === 0}
                  onClick={() => reorderSections(index, index - 1)}
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  className="move-btn"
                  title="下移"
                  aria-label={`下移${displayName}`}
                  disabled={index === order.length - 1}
                  onClick={() => reorderSections(index, index + 1)}
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
