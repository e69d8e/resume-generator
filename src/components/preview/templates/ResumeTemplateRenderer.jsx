import React from 'react';
import { useResume } from '../../../context/ResumeContext.jsx';
import ContactItems from './ContactItems.jsx';
import SectionView from './SectionView.jsx';

export default function ResumeTemplateRenderer() {
  const { state, updatePersonal } = useResume();
  const p = state.personal || {};
  const tpl = state.template || 'modern';
  const order = state.sectionOrder || [];
  const cols = state.sectionColumns || {};

  const handlePersonalUpdate = (field, val) => {
    updatePersonal(field, val);
  };

  const avatarShape = p.avatarShape || 'circle';
  const avatarElement = p.avatar ? (
    <div className={`avatar-container shape-${avatarShape}`}>
      <img src={p.avatar} alt={p.name} className={`avatar-img shape-${avatarShape}`} />
    </div>
  ) : null;

  // Modern template (two-column)
  if (tpl === 'modern') {
    const leftSections = order.filter(s => (cols[s] || 'left') === 'left');
    const rightSections = order.filter(s => (cols[s] || 'left') === 'right');

    return (
      <>
        <header className="resume-header">
          <div className="header-info-main">
            <h1
              className="resume-name"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.name"
              onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
            >
              {p.name || ''}
            </h1>
            <div
              className="resume-title"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.title"
              onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
            >
              {p.title || ''}
            </div>
            <div className="header-contacts">
              <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
            </div>
          </div>
          {avatarElement}
        </header>

        <div className="resume-body">
          <div className="main-col">
            {leftSections.map(s => <SectionView key={s} sectionKey={s} />)}
          </div>
          <div className="side-col">
            {rightSections.map(s => <SectionView key={s} sectionKey={s} />)}
          </div>
        </div>
      </>
    );
  }

  // Sidebar template (left dark sidebar)
  if (tpl === 'sidebar') {
    const mainSections = order.filter(s => (cols[s] || 'left') === 'left');
    const sideSections = order.filter(s => (cols[s] || 'left') === 'right');

    return (
      <div className="resume-body">
        <div className="sidebar-col">
          {avatarElement}
          <div className="sidebar-contacts">
            <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
          </div>
          {sideSections.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
        <div className="main-col">
          <h1
            className="resume-name"
            contentEditable
            suppressContentEditableWarning
            data-path="personal.name"
            onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
          >
            {p.name || ''}
          </h1>
          <div
            className="resume-title"
            contentEditable
            suppressContentEditableWarning
            data-path="personal.title"
            onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
          >
            {p.title || ''}
          </div>
          {mainSections.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </div>
    );
  }

  // Elegant template (centered single column)
  if (tpl === 'elegant') {
    return (
      <>
        <header className={`resume-header ${p.avatar ? 'has-avatar' : 'no-avatar'}`}>
          {avatarElement}
          <div className="header-text-container">
            <h1
              className="resume-name"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.name"
              onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
            >
              {p.name || ''}
            </h1>
            <div
              className="resume-title"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.title"
              onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
            >
              {p.title || ''}
            </div>
            <div className="header-contacts">
              <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
            </div>
          </div>
        </header>

        <div className="resume-body">
          {order.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </>
    );
  }

  // Geek template (grid-based contacts)
  if (tpl === 'geek') {
    return (
      <>
        <header className="resume-header geek-header">
          <div className="header-info-main">
            <h1
              className="resume-name"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.name"
              onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
            >
              {p.name || ''}
            </h1>
            <div
              className="resume-title"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.title"
              onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
            >
              {p.title || ''}
            </div>
            <div className="header-contacts-grid">
              <ContactItems personal={p} format="label" onUpdate={handlePersonalUpdate} />
            </div>
          </div>
          {avatarElement}
        </header>

        <div className="resume-body">
          {order.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </>
    );
  }

  // Minimal template
  if (tpl === 'minimal') {
    return (
      <>
        <header className="resume-header">
          <div className="header-info-main">
            <h1
              className="resume-name"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.name"
              onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
            >
              {p.name || ''}
            </h1>
            <div
              className="resume-title"
              contentEditable
              suppressContentEditableWarning
              data-path="personal.title"
              onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
            >
              {p.title || ''}
            </div>
            <div className="header-contacts">
              <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
            </div>
          </div>
          {avatarElement}
        </header>

        <div className="resume-body">
          {order.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </>
    );
  }

  // Creative template
  if (tpl === 'creative') {
    return (
      <>
        <header className="resume-header creative-header">
          <div className="creative-header-content">
            {avatarElement}
            <div className="header-info-main">
              <div className="creative-name-wrap">
                <h1
                  className="resume-name"
                  contentEditable
                  suppressContentEditableWarning
                  data-path="personal.name"
                  onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
                >
                  {p.name || ''}
                </h1>
                <div
                  className="resume-title"
                  contentEditable
                  suppressContentEditableWarning
                  data-path="personal.title"
                  onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
                >
                  {p.title || ''}
                </div>
              </div>
              <div className="header-contacts">
                <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
              </div>
            </div>
          </div>
        </header>

        <div className="resume-body">
          {order.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </>
    );
  }

  // Compact template
  if (tpl === 'compact') {
    return (
      <>
        <header className={`resume-header compact-header ${p.avatar ? 'has-avatar' : 'no-avatar'}`}>
          <div className="compact-header-top">
            <div className="header-info-main">
              <h1
                className="resume-name"
                contentEditable
                suppressContentEditableWarning
                data-path="personal.name"
                onBlur={(e) => handlePersonalUpdate('name', e.currentTarget.textContent)}
              >
                {p.name || ''}
              </h1>
              <div
                className="resume-title"
                contentEditable
                suppressContentEditableWarning
                data-path="personal.title"
                onBlur={(e) => handlePersonalUpdate('title', e.currentTarget.textContent)}
              >
                {p.title || ''}
              </div>
              <div className="header-contacts">
                <ContactItems personal={p} format="icon" onUpdate={handlePersonalUpdate} />
              </div>
            </div>
            {avatarElement}
          </div>
          <div className="compact-divider-rule" />
        </header>

        <div className="resume-body">
          {order.map(s => <SectionView key={s} sectionKey={s} />)}
        </div>
      </>
    );
  }

  // Default fallback
  return (
    <div className="resume-body">
      {order.map(s => <SectionView key={s} sectionKey={s} />)}
    </div>
  );
}
