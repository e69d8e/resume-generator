import { useState, useCallback } from 'react';
import { exportToPDF } from '../utils/pdfExport.js';
import { useResumeData, useResumeUI } from '../context/ResumeContext.jsx';

// EditorHeader 与 PreviewToolbar 共用的 PDF 导出逻辑，统一 loading 状态、
// 错误提示与容器缺失提示
export function useExportPDF() {
  const { state } = useResumeData();
  const { showToast } = useResumeUI();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = useCallback(async () => {
    if (isExporting) return;
    const container = document.getElementById('resume-container');
    if (!container) {
      showToast('未找到简历预览区域！', 'error');
      return;
    }
    setIsExporting(true);
    try {
      await exportToPDF(container, state.personal.name);
      showToast('PDF 导出成功！');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF 导出失败，请重试！', 'error');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, state.personal.name, showToast]);

  return { isExporting, handleExportPDF };
}
