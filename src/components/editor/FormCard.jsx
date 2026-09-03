import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { CARD_TITLE_CONFIG } from '../../constants/defaultState.js';

function getCardTitle(sectionType, item) {
  const cfg = CARD_TITLE_CONFIG[sectionType];
  if (!cfg) return '条目';
  return cfg.map(part =>
    Array.isArray(part) ? (item[part[0]] || part[1]) : part
  ).join('');
}

export default function FormCard({
  sectionType,
  item,
  index,
  totalItems,
  fields,
  onUpdateField,
  onDelete,
  onMove
}) {
  const [collapsed, setCollapsed] = useState(false);
  const title = getCardTitle(sectionType, item);

  return (
    <div className={`item-card ${collapsed ? 'collapsed' : ''}`} data-id={item.id}>
      <div className="item-card-header" onClick={() => setCollapsed(!collapsed)}>
        <span className="item-card-title">{title}</span>
        <div className="item-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="order-btn"
            title="上移"
            disabled={index === 0}
            onClick={() => onMove(sectionType, index, 'up')}
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            className="order-btn"
            title="下移"
            disabled={index === totalItems - 1}
            onClick={() => onMove(sectionType, index, 'down')}
          >
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => onDelete(sectionType, item.id)}
          >
            删除
          </button>
          <ChevronDown className="chevron-toggle" size={16} />
        </div>
      </div>

      <div className="item-card-content">
        <div className="form-grid">
          {fields.map(f => {
            const val = item[f.name] || '';
            const isFullWidth = f.fullWidth ? ' full-width' : '';

            if (f.type === 'textarea') {
              return (
                <div key={f.name} className={`input-group${isFullWidth}`}>
                  <label>{f.label}</label>
                  <textarea
                    rows={f.rows || 3}
                    placeholder={f.placeholder || ''}
                    value={val}
                    onChange={(e) => onUpdateField(sectionType, item.id, f.name, e.target.value)}
                  />
                </div>
              );
            }

            return (
              <div key={f.name} className={`input-group${isFullWidth}`}>
                <label>{f.label}</label>
                <input
                  type="text"
                  placeholder={f.placeholder || ''}
                  value={val}
                  onChange={(e) => onUpdateField(sectionType, item.id, f.name, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
