import React, { useState } from 'react';
import { Sliders, Layers, ChevronDown } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { TEMPLATES, COLOR_PRESETS, FONTS, SPACINGS } from '../../constants/defaultState.js';
import SectionSorter from './SectionSorter.jsx';

export default function LayoutTab() {
  const { state, setTemplate, setTheme, setFont, setSpacing } = useResume();
  const [customizerCollapsed, setCustomizerCollapsed] = useState(false);
  const [orderCollapsed, setOrderCollapsed] = useState(false);

  return (
    <div id="tab-layout" className="tab-content active">
      <div className="layout-container" style={{ padding: '16px 24px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Customization Panel */}
        <section className={`control-card customization-card ${customizerCollapsed ? 'collapsed' : ''}`}>
          <div className="section-header" onClick={() => setCustomizerCollapsed(!customizerCollapsed)}>
            <div className="header-title">
              <Sliders size={18} />
              <h2>排版与主题定制</h2>
            </div>
            <ChevronDown className="toggle-icon" size={18} />
          </div>

          <div className="section-content">
            {/* Templates */}
            <div className="control-group">
              <label>简历模板</label>
              <div className="template-selector">
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`template-btn ${state.template === tpl.id ? 'active' : ''}`}
                    onClick={() => setTemplate(tpl.id)}
                  >
                    <span className={`preview-dot ${tpl.dotClass}`} />
                    <span>{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Themes */}
            <div className="control-group">
              <label>主题配色</label>
              <div className="color-presets">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`color-preset-btn ${state.theme === preset.id ? 'active' : ''}`}
                    style={{ '--preset-color': preset.color, '--preset-accent': preset.accent }}
                    title={preset.name}
                    onClick={() => setTheme(preset.id)}
                  />
                ))}
              </div>
            </div>

            {/* Fonts & Spacing */}
            <div className="control-row">
              <div className="control-subgroup">
                <label htmlFor="select-font">字体选择</label>
                <select
                  id="select-font"
                  value={state.font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  {FONTS.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-subgroup">
                <label htmlFor="select-spacing">排版间距</label>
                <select
                  id="select-spacing"
                  value={state.spacing}
                  onChange={(e) => setSpacing(e.target.value)}
                >
                  {SPACINGS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section Reordering Card */}
        <section className={`control-card sections-order-card ${orderCollapsed ? 'collapsed' : ''}`}>
          <div className="section-header" onClick={() => setOrderCollapsed(!orderCollapsed)}>
            <div className="header-title">
              <Layers size={18} />
              <h2>模块顺序与显示</h2>
            </div>
            <ChevronDown className="toggle-icon" size={18} />
          </div>

          <div className="section-content">
            <SectionSorter />
          </div>
        </section>
      </div>
    </div>
  );
}
