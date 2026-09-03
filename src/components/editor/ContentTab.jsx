import React from 'react';
import PersonalForm from './PersonalForm.jsx';
import SummaryForm from './SummaryForm.jsx';
import DynamicListForm from './DynamicListForm.jsx';

export default function ContentTab() {
  return (
    <div id="tab-content" className="tab-content active">
      <div className="forms-container">
        <PersonalForm />
        <SummaryForm />
        <DynamicListForm sectionType="experience" />
        <DynamicListForm sectionType="education" />
        <DynamicListForm sectionType="projects" />
        <DynamicListForm sectionType="skills" />
      </div>
    </div>
  );
}
