import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';

export default function SummaryForm() {
  const { state, updateSummary } = useResume();
  const [collapsed, setCollapsed] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [state.summary, collapsed]);

  return (
    <section className={`control-card form-section ${collapsed ? 'collapsed' : ''}`} data-section-id="summary">
      <div className="section-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="header-title">
          <BookOpen size={18} />
          <h2>个人优势 / 自我评价 (Summary)</h2>
        </div>
        <ChevronDown className="toggle-icon" size={18} />
      </div>
      <div className="section-content">
        <div className="input-group full-width">
          <label htmlFor="info-summary">自我评价 (简短有力，3-4句话为佳)</label>
          <textarea
            id="info-summary"
            ref={textareaRef}
            rows={4}
            placeholder="写写你的核心竞争力和经验概括..."
            value={state.summary || ''}
            onChange={(e) => updateSummary(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
