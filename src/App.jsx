import React, { useState } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { useResume } from './context/ResumeContext.jsx';
import EditorHeader from './components/editor/EditorHeader.jsx';
import EditorTabs from './components/editor/EditorTabs.jsx';
import ContentTab from './components/editor/ContentTab.jsx';
import LayoutTab from './components/editor/LayoutTab.jsx';
import PreviewToolbar from './components/preview/PreviewToolbar.jsx';
import ResumeContainer from './components/preview/ResumeContainer.jsx';
import ToastContainer from './components/common/Toast.jsx';
import AvatarCropModal from './components/common/AvatarCropModal.jsx';

export default function App() {
  const { activeTab, setFitScreen } = useResume();
  const [pageCount, setPageCount] = useState(1);
  const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'

  const handleMobileSwitch = (view) => {
    setMobileView(view);
    if (view === 'preview') {
      setFitScreen(true);
    }
  };

  return (
    <div className={`app-container ${mobileView === 'preview' ? 'active-preview' : ''}`}>
      {/* Left Panel: Editor */}
      <aside className="editor-panel">
        <EditorHeader />
        <EditorTabs />
        {activeTab === 'tab-content' ? <ContentTab /> : <LayoutTab />}
      </aside>

      {/* Right Panel: Live Preview */}
      <main className="preview-panel">
        <PreviewToolbar pageCount={pageCount} />
        <ResumeContainer onPageCountChange={setPageCount} />
      </main>

      {/* Mobile Navigation Bar */}
      <div className="mobile-nav">
        <button
          type="button"
          className={`mobile-nav-btn ${mobileView === 'edit' ? 'active' : ''}`}
          onClick={() => handleMobileSwitch('edit')}
        >
          <Edit3 size={16} />
          <span>编辑内容</span>
        </button>
        <button
          type="button"
          className={`mobile-nav-btn ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => handleMobileSwitch('preview')}
        >
          <Eye size={16} />
          <span>预览简历</span>
        </button>
      </div>

      {/* Overlays */}
      <ToastContainer />
      <AvatarCropModal />
    </div>
  );
}
