import React, { useRef, useState } from 'react';
import { Sparkles, Upload, Download, DownloadCloud, Loader } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { exportStateAsJSON, mergeState } from '../../utils/storage.js';
import { exportToPDF } from '../../utils/pdfExport.js';
import { DEFAULT_STATE } from '../../constants/defaultState.js';

export default function EditorHeader() {
  const { state, setState, showToast } = useResume();
  const fileInputRef = useRef(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const merged = mergeState(DEFAULT_STATE, parsed);
        setState(merged);
        showToast('数据导入成功！');
      } catch (err) {
        console.error('Import failed:', err);
        showToast('JSON 文件解析失败，请检查格式！', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
    exportStateAsJSON(state);
    showToast('数据导出成功！');
  };

  const handleExportPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    try {
      const container = document.getElementById('resume-container');
      if (!container) {
        showToast('未找到简历预览区域！', 'error');
        return;
      }
      await exportToPDF(container, state.personal.name);
      showToast('PDF 导出成功！');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('PDF 导出失败，请重试！', 'error');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <header className="editor-header">
      <div className="logo">
        <Sparkles className="logo-icon" size={24} />
        <h1>Resumify</h1>
      </div>
      <div className="header-actions">
        <button
          id="btn-import"
          className="btn btn-secondary"
          title="导入 JSON 数据"
          onClick={handleImportClick}
        >
          <Upload size={16} />
          <span>导入</span>
        </button>
        <button
          id="btn-export"
          className="btn btn-secondary"
          title="导出 JSON 数据"
          onClick={handleExportJSON}
        >
          <Download size={16} />
          <span>保存数据</span>
        </button>
        <button
          id="btn-print"
          className="btn btn-primary"
          title="免打印直接下载，支持中文不乱码且排版一致"
          onClick={handleExportPDF}
          disabled={isExportingPDF}
        >
          {isExportingPDF ? (
            <>
              <Loader className="animate-spin" size={16} style={{ marginRight: 6 }} />
              <span>正在导出...</span>
            </>
          ) : (
            <>
              <DownloadCloud size={16} />
              <span>导出 PDF</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
}
