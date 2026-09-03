import React, { useState } from 'react';
import { Briefcase, GraduationCap, FolderGit2, CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { FORM_CONFIGS } from '../../constants/defaultState.js';
import FormCard from './FormCard.jsx';

const SECTION_ICONS = {
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderGit2,
  skills: CheckCircle2
};

const SECTION_DESCS = {
  experience: '工作经历 (Experience)',
  education: '教育背景 (Education)',
  projects: '项目经验 (Projects)',
  skills: '专业技能 (Skills)'
};

export default function DynamicListForm({ sectionType }) {
  const { state, addSubitem, updateSubitem, deleteSubitem, moveSubitem } = useResume();
  const [collapsed, setCollapsed] = useState(false);

  const config = FORM_CONFIGS[sectionType];
  if (!config) return null;

  const items = state[sectionType] || [];
  const Icon = SECTION_ICONS[sectionType] || Briefcase;
  const label = SECTION_DESCS[sectionType] || config.title;

  return (
    <section className={`control-card form-section ${collapsed ? 'collapsed' : ''}`} data-section-id={sectionType}>
      <div className="section-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="header-title">
          <Icon size={18} />
          <h2>{label}</h2>
        </div>
        <ChevronDown className="toggle-icon" size={18} />
      </div>

      <div className="section-content">
        <div className="items-list" id={`${sectionType}-items`}>
          {items.map((item, index) => (
            <FormCard
              key={item.id}
              sectionType={sectionType}
              item={item}
              index={index}
              totalItems={items.length}
              fields={config.fields}
              onUpdateField={updateSubitem}
              onDelete={deleteSubitem}
              onMove={moveSubitem}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btn-outline full-width"
          id={`add-${config.idPrefix}-btn`}
          onClick={() => addSubitem(sectionType)}
        >
          <Plus size={16} />
          <span>添加{config.title}</span>
        </button>
      </div>
    </section>
  );
}
