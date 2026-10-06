import React from 'react';
import { Edit3, Layout } from 'lucide-react';
import { useResumeUI } from '../../context/ResumeContext.jsx';

export default function EditorTabs() {
  const { activeTab, setActiveTab } = useResumeUI();

  return (
    <div className="editor-tabs" role="tablist" aria-label="编辑器标签页">
      <button
        className={`tab-btn ${activeTab === 'tab-content' ? 'active' : ''}`}
        role="tab"
        aria-selected={activeTab === 'tab-content'}
        aria-controls="tab-content"
        title="编辑简历数据内容"
        onClick={() => setActiveTab('tab-content')}
      >
        <Edit3 size={16} />
        <span>内容编辑</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'tab-layout' ? 'active' : ''}`}
        role="tab"
        aria-selected={activeTab === 'tab-layout'}
        aria-controls="tab-layout"
        title="定制简历外观排版"
        onClick={() => setActiveTab('tab-layout')}
      >
        <Layout size={16} />
        <span>排版与板块</span>
      </button>
    </div>
  );
}
