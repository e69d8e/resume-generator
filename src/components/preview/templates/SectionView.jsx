import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useResume } from '../../../context/ResumeContext.jsx';

export default function SectionView({ sectionKey }) {
  const { state, updateSummary, updateSubitem } = useResume();

  if (state.sectionVisibility?.[sectionKey] === false) return null;

  if (sectionKey === 'summary') {
    if (!state.summary) return null;
    return (
      <section className="resume-section section-summary">
        <div className="resume-section-title">
          <span>自我评价</span>
        </div>
        <div
          className="resume-summary"
          contentEditable
          suppressContentEditableWarning
          data-path="summary"
          onBlur={(e) => updateSummary(e.currentTarget.textContent)}
        >
          {state.summary}
        </div>
      </section>
    );
  }

  if (sectionKey === 'experience') {
    const list = state.experience?.filter(item => item.company || item.role) || [];
    if (list.length === 0) return null;

    return (
      <section className="resume-section section-experience">
        <div className="resume-section-title">
          <span>工作经历</span>
        </div>
        <div className="resume-items-list">
          {list.map(item => (
            <div key={item.id} className="resume-item">
              <div className="resume-item-header">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`experience.${item.id}.company`}
                  onBlur={(e) => updateSubitem('experience', item.id, 'company', e.currentTarget.textContent)}
                >
                  {item.company}
                </span>
                <span className="resume-item-date">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    data-path={`experience.${item.id}.startDate`}
                    onBlur={(e) => updateSubitem('experience', item.id, 'startDate', e.currentTarget.textContent)}
                  >
                    {item.startDate}
                  </span> ~ <span
                    contentEditable
                    suppressContentEditableWarning
                    data-path={`experience.${item.id}.endDate`}
                    onBlur={(e) => updateSubitem('experience', item.id, 'endDate', e.currentTarget.textContent)}
                  >
                    {item.endDate}
                  </span>
                </span>
              </div>
              <div className="resume-item-sub">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`experience.${item.id}.role`}
                  onBlur={(e) => updateSubitem('experience', item.id, 'role', e.currentTarget.textContent)}
                >
                  {item.role}
                </span>
              </div>
              <div
                className="resume-item-description"
                contentEditable
                suppressContentEditableWarning
                data-path={`experience.${item.id}.description`}
                onBlur={(e) => updateSubitem('experience', item.id, 'description', e.currentTarget.textContent)}
              >
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sectionKey === 'education') {
    const list = state.education?.filter(item => item.institution) || [];
    if (list.length === 0) return null;

    return (
      <section className="resume-section section-education">
        <div className="resume-section-title">
          <span>教育背景</span>
        </div>
        <div className="resume-items-list">
          {list.map(item => (
            <div key={item.id} className="resume-item">
              <div className="resume-item-header">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`education.${item.id}.institution`}
                  onBlur={(e) => updateSubitem('education', item.id, 'institution', e.currentTarget.textContent)}
                >
                  {item.institution}
                </span>
                <span
                  className="resume-item-date"
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`education.${item.id}.startDate`}
                  onBlur={(e) => updateSubitem('education', item.id, 'startDate', e.currentTarget.textContent)}
                >
                  {item.startDate}
                </span>
              </div>
              <div className="resume-item-sub">
                <span
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`education.${item.id}.degree`}
                  onBlur={(e) => updateSubitem('education', item.id, 'degree', e.currentTarget.textContent)}
                >
                  {item.degree}
                </span> - <span
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`education.${item.id}.major`}
                  onBlur={(e) => updateSubitem('education', item.id, 'major', e.currentTarget.textContent)}
                >
                  {item.major}
                </span>
              </div>
              {item.description && (
                <div
                  className="resume-item-description"
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`education.${item.id}.description`}
                  onBlur={(e) => updateSubitem('education', item.id, 'description', e.currentTarget.textContent)}
                >
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (sectionKey === 'projects') {
    const list = state.projects?.filter(item => item.name) || [];
    if (list.length === 0) return null;

    return (
      <section className="resume-section section-projects">
        <div className="resume-section-title">
          <span>项目经验</span>
        </div>
        <div className="resume-items-list">
          {list.map(item => {
            const hasDates = item.startDate || item.endDate;
            return (
              <div key={item.id} className="resume-item">
                <div className="resume-item-header">
                  <span className="project-name-role">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      data-path={`projects.${item.id}.name`}
                      style={{ fontWeight: 700 }}
                      onBlur={(e) => updateSubitem('projects', item.id, 'name', e.currentTarget.textContent)}
                    >
                      {item.name}
                    </span>
                    <span className="project-role-sep">·</span>
                    <span
                      className="project-role"
                      contentEditable
                      suppressContentEditableWarning
                      data-path={`projects.${item.id}.role`}
                      onBlur={(e) => updateSubitem('projects', item.id, 'role', e.currentTarget.textContent)}
                    >
                      {item.role}
                    </span>
                  </span>

                  {hasDates && (
                    <span className="resume-item-date">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        data-path={`projects.${item.id}.startDate`}
                        onBlur={(e) => updateSubitem('projects', item.id, 'startDate', e.currentTarget.textContent)}
                      >
                        {item.startDate || ''}
                      </span>
                      {item.startDate && item.endDate ? ' ~ ' : ''}
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        data-path={`projects.${item.id}.endDate`}
                        onBlur={(e) => updateSubitem('projects', item.id, 'endDate', e.currentTarget.textContent)}
                      >
                        {item.endDate || ''}
                      </span>
                    </span>
                  )}
                </div>

                {(item.techStack || item.link) && (
                  <div className="resume-item-sub">
                    {item.techStack && (
                      <div className="project-tech-stack">
                        <strong className="tech-stack-label">技术栈：</strong>
                        <span
                          className="tech-stack-val"
                          contentEditable
                          suppressContentEditableWarning
                          data-path={`projects.${item.id}.techStack`}
                          onBlur={(e) => updateSubitem('projects', item.id, 'techStack', e.currentTarget.textContent)}
                        >
                          {item.techStack}
                        </span>
                      </div>
                    )}
                    {item.link && (
                      <span className="project-link-label">
                        <ExternalLink size={12} className="link-icon" />
                        <span>链接:</span>{' '}
                        <span
                          className="project-link-url"
                          contentEditable
                          suppressContentEditableWarning
                          data-path={`projects.${item.id}.link`}
                          onBlur={(e) => updateSubitem('projects', item.id, 'link', e.currentTarget.textContent)}
                        >
                          {item.link}
                        </span>
                      </span>
                    )}
                  </div>
                )}

                <div
                  className="resume-item-description"
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`projects.${item.id}.description`}
                  onBlur={(e) => updateSubitem('projects', item.id, 'description', e.currentTarget.textContent)}
                >
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (sectionKey === 'skills') {
    const list = state.skills?.filter(item => item.category) || [];
    if (list.length === 0) return null;

    return (
      <section className="resume-section section-skills">
        <div className="resume-section-title">
          <span>专业技能</span>
        </div>
        <div className="resume-skills-grid">
          {list.map(item => {
            const tags = (item.tags || '').split(',').map(t => t.trim()).filter(t => t.length > 0);
            return (
              <div key={item.id} className="resume-skill-cat">
                <div
                  className="resume-skill-cat-name"
                  contentEditable
                  suppressContentEditableWarning
                  data-path={`skills.${item.id}.category`}
                  onBlur={(e) => updateSubitem('skills', item.id, 'category', e.currentTarget.textContent)}
                >
                  {item.category}
                </div>
                <div className="resume-skill-tags">
                  {tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="resume-skill-tag"
                      contentEditable
                      suppressContentEditableWarning
                      data-path={`skills.${item.id}.tags.${tagIdx}`}
                      onBlur={(e) => {
                        const newTags = [...tags];
                        newTags[tagIdx] = e.currentTarget.textContent.trim();
                        updateSubitem('skills', item.id, 'tags', newTags.filter(Boolean).join(', '));
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return null;
}
