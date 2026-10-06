import React, { useState, useEffect } from 'react';
import { FileText, DownloadCloud, Minus, Plus, Maximize2, Loader } from 'lucide-react';
import { useResumeUI } from '../../context/ResumeContext.jsx';
import { useExportPDF } from '../../hooks/useExportPDF.js';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '../../constants/defaultState.js';

export default function PreviewToolbar({ pageCount = 1 }) {
  const { isSyncing, zoom, setZoom, fitScreen, setFitScreen } = useResumeUI();
  const { isExporting, handleExportPDF } = useExportPDF();
  const [zoomInputValue, setZoomInputValue] = useState(`${Math.round(zoom * 100)}%`);

  useEffect(() => {
    setZoomInputValue(`${Math.round(zoom * 100)}%`);
  }, [zoom]);

  const handleZoomIn = () => {
    setFitScreen(false);
    setZoom(prev => Math.min(ZOOM_MAX, Math.round((prev + ZOOM_STEP) * 100) / 100));
  };

  const handleZoomOut = () => {
    setFitScreen(false);
    setZoom(prev => Math.max(ZOOM_MIN, Math.round((prev - ZOOM_STEP) * 100) / 100));
  };

  const handleFitScreen = () => {
    setFitScreen(prev => !prev);
  };

  // 解析"50%"或"50"形式的输入，非法值回退为当前缩放
  const applyZoomInput = () => {
    const raw = zoomInputValue.replace('%', '').trim();
    const num = Number.parseInt(raw, 10);
    const minPercent = Math.round(ZOOM_MIN * 100);
    const maxPercent = Math.round(ZOOM_MAX * 100);
    if (!Number.isNaN(num) && num >= minPercent && num <= maxPercent) {
      setFitScreen(false);
      setZoom(num / 100);
    } else {
      setZoomInputValue(`${Math.round(zoom * 100)}%`);
    }
  };

  const handleZoomInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyZoomInput();
      e.target.blur();
    }
  };

  return (
    <div className="preview-toolbar">
      <div className="toolbar-left">
        <span className="status-indicator">
          <span className={`pulse-dot ${isSyncing ? 'syncing' : ''}`} />
          {isSyncing ? '同步中...' : '实时同步中'}
        </span>

        <span
          id="page-count"
          className={`page-count-badge ${pageCount > 1 ? 'multi-page' : ''}`}
          title={pageCount > 1 ? `当前简历共 ${pageCount} 页，建议精简内容以适配单页` : '当前简历页数'}
        >
          <FileText size={14} />
          <span>{pageCount} 页</span>
        </span>

        <button
          id="btn-print-preview"
          className="btn btn-primary btn-print-preview"
          title="免打印直接下载，支持中文不乱码且排版一致"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader className="animate-spin" size={14} style={{ marginRight: 6 }} />
              <span>正在导出...</span>
            </>
          ) : (
            <>
              <DownloadCloud size={14} />
              <span>导出 PDF</span>
            </>
          )}
        </button>
      </div>

      <div className="toolbar-right">
        <button
          id="btn-zoom-out"
          className="toolbar-btn"
          title="缩小"
          onClick={handleZoomOut}
        >
          <Minus size={16} />
        </button>
        <input
          type="text"
          id="zoom-value"
          value={zoomInputValue}
          onChange={(e) => setZoomInputValue(e.target.value)}
          onKeyDown={handleZoomInputKeyDown}
          onBlur={applyZoomInput}
          aria-label="缩放比例"
          title="输入缩放比例后回车确认"
        />
        <button
          id="btn-zoom-in"
          className="toolbar-btn"
          title="放大"
          onClick={handleZoomIn}
        >
          <Plus size={16} />
        </button>
        <div className="divider" />
        <button
          id="btn-fit-screen"
          className={`toolbar-btn ${fitScreen ? 'active' : ''}`}
          title="适应屏幕"
          onClick={handleFitScreen}
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
