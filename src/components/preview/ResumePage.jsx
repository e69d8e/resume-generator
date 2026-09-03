import React from 'react';
import { useResume } from '../../context/ResumeContext.jsx';

export default function ResumePage({ pageNumber = 1, children }) {
  const { state } = useResume();
  const templateClasses = `${state.theme} ${state.font} ${state.spacing} template-${state.template}`;

  return (
    <div className={`resume-page ${templateClasses}`} data-page={pageNumber}>
      {pageNumber > 1 && (
        <div className="resume-continuation-header">
          <span className="continuation-name">{state.personal?.name || ''}</span>
          <span className="continuation-divider">·</span>
          <span className="continuation-page">第 {pageNumber} 页</span>
        </div>
      )}
      {children}
    </div>
  );
}
