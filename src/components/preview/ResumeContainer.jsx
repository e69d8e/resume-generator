import React, { useRef, useEffect, useState, useCallback, useDeferredValue } from 'react';
import { useResumeData, useResumeUI } from '../../context/ResumeContext.jsx';
import ResumePage from './ResumePage.jsx';
import { renderFullResumeHTML, paginateContent } from '../../utils/pagination.js';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, ZOOM_FIT_CAP } from '../../constants/defaultState.js';

export default function ResumeContainer({ onPageCountChange }) {
  const { state, updatePersonal, updateSummary, updateSubitem, updateSkillTag } = useResumeData();
  const { zoom, setZoom, fitScreen, setFitScreen } = useResumeUI();
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const pagesJsonRef = useRef(null);

  // 分页计算包含几十次 DOM 挂载测量，成本高：挂载时同步算一次保证首屏正确，
  // 之后跟随 deferred 值低优先级更新，打字不卡输入
  const [pages, setPages] = useState(() => {
    try {
      const { headerHTML, bodyHTML } = renderFullResumeHTML(state);
      const initialPages = paginateContent(headerHTML, bodyHTML, state);
      pagesJsonRef.current = JSON.stringify(initialPages);
      return initialPages;
    } catch {
      return [{ header: '', body: '' }];
    }
  });
  const deferredState = useDeferredValue(state);

  useEffect(() => {
    try {
      const { headerHTML, bodyHTML } = renderFullResumeHTML(deferredState);
      const computedPages = paginateContent(headerHTML, bodyHTML, deferredState);
      // 分页结果未变化时跳过 setState，避免整页 DOM 被无谓重建
      const nextJson = JSON.stringify(computedPages);
      if (nextJson !== pagesJsonRef.current) {
        pagesJsonRef.current = nextJson;
        setPages(computedPages);
      }
      if (onPageCountChange) {
        onPageCountChange(computedPages.length);
      }
    } catch (err) {
      console.warn('Pagination calculation error, falling back to single page:', err);
      const { headerHTML, bodyHTML } = renderFullResumeHTML(deferredState);
      pagesJsonRef.current = null;
      setPages([{ header: headerHTML, body: bodyHTML }]);
      if (onPageCountChange) {
        onPageCountChange(1);
      }
    }
  }, [deferredState, onPageCountChange]);

  // Fit screen logic
  useEffect(() => {
    if (!fitScreen) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const calculateFit = () => {
      const width = wrapper.clientWidth - 48;
      const a4WidthPx = 794; // 210mm at 96 DPI
      if (width > 0) {
        const targetZoom = Math.min(ZOOM_FIT_CAP, Math.max(ZOOM_MIN, width / a4WidthPx));
        setZoom(Math.round(targetZoom * 100) / 100);
      }
    };

    calculateFit();
    // ResizeObserver 同时覆盖窗口缩放与编辑面板宽度变化（tab 切换/折叠）
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calculateFit);
    });
    observer.observe(wrapper);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [fitScreen, setZoom]);

  // Ctrl / Cmd + Wheel zoom
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setFitScreen(false);
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        setZoom(prev => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((prev + delta) * 100) / 100)));
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
    } else if (parts.length === 1 && parts[0] === 'summary') {
      updateSummary(val);
    } else if (parts.length === 3) {
      updateSubitem(parts[0], parts[1], parts[2], val);
    } else if (parts.length === 4 && parts[0] === 'skills' && parts[2] === 'tags') {
      updateSkillTag(parts[1], Number(parts[3]), val);
    }
  }, [updatePersonal, updateSummary, updateSubitem, updateSkillTag]);

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
