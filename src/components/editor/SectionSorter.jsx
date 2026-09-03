import React, { useState } from 'react';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { SECTION_NAMES } from '../../constants/defaultState.js';

export default function SectionSorter() {
  const { state, reorderSections, toggleSectionVisibility, toggleSectionColumn } = useResume();
  const [draggedIndex, setDraggedIndex] = useState(null);

  const isTwoColumn = state.template === 'modern' || state.template === 'sidebar';
  const order = state.sectionOrder || [];

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
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
          >
            <div className="sortable-item-left">
              <span className="drag-handle">
                <GripVertical size={16} />
              </span>
              <button
                type="button"
                className={`visibility-btn ${isVisible ? 'visible' : 'hidden'}`}
                title={isVisible ? '隐藏模块' : '显示模块'}
                onClick={() => toggleSectionVisibility(section, !isVisible)}
              >
                {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <span className={`section-name-text ${isVisible ? '' : 'text-muted'}`}>
                {displayName}
              </span>
            </div>

            <div className="sortable-item-right" onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
