import React, { useState, useEffect } from 'react';
import { FileText, DownloadCloud, Minus, Plus, Maximize2, Loader } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { exportToPDF } from '../../utils/pdfExport.js';

export default function PreviewToolbar({ pageCount = 1 }) {
  const { isSyncing, zoom, setZoom, fitScreen, setFitScreen, state, showToast } = useResume();
  const [isExporting, setIsExporting] = useState(false);
  const [zoomInputValue, setZoomInputValue] = useState(`${Math.round(zoom * 100)}%`);

  useEffect(() => {
    setZoomInputValue(`${Math.round(zoom * 100)}%`);
  }, [zoom]);

  const handleZoomIn = () => {
    setFitScreen(false);
    setZoom(prev => Math.min(1.5, Math.round((prev + 0.05) * 100) / 100));
  };

  const handleZoomOut = () => {
    setFitScreen(false);
    setZoom(prev => Math.max(0.4, Math.round((prev - 0.05) * 100) / 100));
  };

  const handleFitScreen = () => {
    setFitScreen(prev => !prev);
  };

  const handleZoomInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const raw = zoomInputValue.replace('%', '').trim();
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num >= 40 && num <= 150) {
        setFitScreen(false);
        setZoom(num / 100);
      } else {
        setZoomInputValue(`${Math.round(zoom * 100)}%`);
      }
      e.target.blur();
    }
  };

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const container = document.getElementById('resume-container');
      if (!container) return;
      await exportToPDF(container, state.personal.name);
      showToast('PDF 导出成功！');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF 导出失败，请重试！', 'error');
    } finally {
      setIsExporting(false);
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
