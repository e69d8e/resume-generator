import React, { useRef } from 'react';
import { Upload, Download, DownloadCloud, Loader, RotateCcw } from 'lucide-react';
import { useResumeData, useResumeUI } from '../../context/ResumeContext.jsx';
import { exportStateAsJSON, parseImportedState } from '../../utils/storage.js';
import { useExportPDF } from '../../hooks/useExportPDF.js';
import SpikeMark from '../common/SpikeMark.jsx';

export default function EditorHeader() {
  const { state, setState, resetState } = useResumeData();
  const { showToast } = useResumeUI();
  const fileInputRef = useRef(null);
  const { isExporting: isExportingPDF, handleExportPDF } = useExportPDF();

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
      let merged = null;
      try {
        merged = parseImportedState(JSON.parse(event.target.result));
      } catch (err) {
        console.error('Import failed:', err);
      }
      if (!merged) {
        // 旧行为：任何 JSON 都能"导入成功"并静默换成默认示例数据，等于丢稿
        showToast('无法识别的简历数据文件，请使用本工具“保存数据”导出的 JSON', 'error');
        return;
      }
      if (!window.confirm('导入会覆盖当前简历内容，建议先“保存数据”备份。确定继续吗？')) return;
      setState(merged);
      showToast('数据导入成功！');
    };
    reader.onerror = () => {
      showToast('文件读取失败，请重试', 'error');
    };
    reader.readAsText(file);
  };

  const handleExportJSON = () => {
    exportStateAsJSON(state);
    showToast('数据导出成功！');
  };

  const handleReset = () => {
    if (window.confirm('确定要清空当前内容并恢复默认示例数据吗？此操作不可撤销。')) {
      resetState();
    }
  };

  return (
    <header className="editor-header">
      <div className="logo">
        <SpikeMark className="logo-icon" size={26} />
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
          id="btn-reset"
          className="btn btn-secondary"
          title="清空当前内容，恢复默认示例数据"
          onClick={handleReset}
        >
          <RotateCcw size={16} />
          <span>重置</span>
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
