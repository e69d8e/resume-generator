import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useResume } from '../../context/ResumeContext.jsx';
import ResumePage from './ResumePage.jsx';
import { renderFullResumeHTML, paginateContent } from '../../utils/pagination.js';

export default function ResumeContainer({ onPageCountChange }) {
  const { zoom, setZoom, fitScreen, setFitScreen, state, updatePersonal, updateSummary, updateSubitem } = useResume();
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const [pages, setPages] = useState(() => {
    try {
      const { headerHTML, bodyHTML } = renderFullResumeHTML(state);
      return paginateContent(headerHTML, bodyHTML, state);
    } catch {
      return [{ header: '', body: '' }];
    }
  });

  // Calculate pagination whenever resume state changes
  useEffect(() => {
    try {
      const { headerHTML, bodyHTML } = renderFullResumeHTML(state);
      const computedPages = paginateContent(headerHTML, bodyHTML, state);
      setPages(computedPages);
      if (onPageCountChange) {
        onPageCountChange(computedPages.length);
      }
    } catch (err) {
      console.warn('Pagination calculation error, falling back to single page:', err);
      const { headerHTML, bodyHTML } = renderFullResumeHTML(state);
      setPages([{ header: headerHTML, body: bodyHTML }]);
      if (onPageCountChange) {
        onPageCountChange(1);
      }
    }
  }, [state, onPageCountChange]);

  // Fit screen logic
  useEffect(() => {
    if (!fitScreen) return;

    const calculateFit = () => {
      if (!wrapperRef.current) return;
      const wrapperWidth = wrapperRef.current.clientWidth - 48;
      const a4WidthPx = 794; // 210mm at 96 DPI
      if (wrapperWidth > 0) {
        const targetZoom = Math.min(1.2, Math.max(0.4, wrapperWidth / a4WidthPx));
        setZoom(Math.round(targetZoom * 100) / 100);
      }
    };

    calculateFit();
    window.addEventListener('resize', calculateFit);
    return () => window.removeEventListener('resize', calculateFit);
  }, [fitScreen, setZoom]);

  // Ctrl / Cmd + Wheel zoom
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setFitScreen(false);
        if (e.deltaY < 0) {
          setZoom(prev => Math.min(1.5, Math.round((prev + 0.05) * 100) / 100));
        } else {
          setZoom(prev => Math.max(0.4, Math.round((prev - 0.05) * 100) / 100));
        }
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [setZoom, setFitScreen]);

  const handleContentEditableBlur = useCallback((e) => {
    const target = e.target;
    const path = target.getAttribute('data-path');
    if (!path) return;
    const val = target.textContent || '';
    const parts = path.split('.');
    if (parts.length === 2 && parts[0] === 'personal') {
      updatePersonal(parts[1], val);
    } else if (parts[0] === 'summary') {
      updateSummary(val);
    } else if (parts.length === 3) {
      updateSubitem(parts[0], parts[1], parts[2], val);
    }
  }, [updatePersonal, updateSummary, updateSubitem]);

  return (
    <div ref={wrapperRef} className="preview-container">
      <div
        id="resume-container"
        ref={containerRef}
        className="resume-container"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onBlur={handleContentEditableBlur}
      >
        {pages.map((p, index) => (
          <ResumePage key={index} pageNumber={index + 1}>
            <div
              className="resume-page-inner"
              dangerouslySetInnerHTML={{ __html: (p.header || '') + (p.body || '') }}
            />
          </ResumePage>
        ))}
      </div>
    </div>
  );
}
