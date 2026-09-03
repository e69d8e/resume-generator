import React from 'react';
import { Edit3, Layout } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';

export default function EditorTabs() {
  const { activeTab, setActiveTab } = useResume();

  return (
    <div className="editor-tabs">
      <button
        className={`tab-btn ${activeTab === 'tab-content' ? 'active' : ''}`}
        title="编辑简历数据内容"
        onClick={() => setActiveTab('tab-content')}
      >
        <Edit3 size={16} />
        <span>内容编辑</span>
      </button>
      <button
        className={`tab-btn ${activeTab === 'tab-layout' ? 'active' : ''}`}
        title="定制简历外观排版"
        onClick={() => setActiveTab('tab-layout')}
      >
        <Layout size={16} />
        <span>排版与板块</span>
      </button>
    </div>
  );
}
