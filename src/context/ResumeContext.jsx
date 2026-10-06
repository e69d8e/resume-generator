import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DEFAULT_STATE, FORM_CONFIGS, DEFAULT_SECTION_COLUMNS } from '../constants/defaultState.js';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../utils/storage.js';
import { updateTagInTagsString } from '../utils/skills.js';
import { generateId } from '../utils/id.js';

// 数据与 UI 状态拆成两个 Context：简历数据（state 及其操作）变化频率高，
// UI 状态（缩放/tab/toast 等）变化频率低。拆分后编辑文本不会让只关心
// UI 的组件跟着重渲染，反之亦然。所有 action 均为稳定引用。
const DataContext = createContext(null);
const UIContext = createContext(null);

export function ResumeProvider({ children }) {
  const [state, setState] = useState(() => loadStateFromLocalStorage());
  const [zoom, setZoom] = useState(1.0);
  const [fitScreen, setFitScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-content');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cropModal, setCropModal] = useState({ isOpen: false, imageUrl: '' });

  const saveTimerRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const storageWarnedRef = useRef(false);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Debounced auto-save to localStorage
  useEffect(() => {
    setIsSyncing(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      const saved = saveStateToLocalStorage(stateRef.current);
      setIsSyncing(false);
      if (!saved) {
        if (!storageWarnedRef.current) {
          storageWarnedRef.current = true;
          showToast('存储空间不足，最新更改未能保存！请尝试更换更小的头像', 'error');
        }
      } else {
        storageWarnedRef.current = false;
      }
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, showToast]);

  // 关闭/刷新页面时立即落盘，消除防抖窗口内的更改丢失
  useEffect(() => {
    const flushPendingSave = () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
        saveStateToLocalStorage(stateRef.current);
      }
    };
    window.addEventListener('beforeunload', flushPendingSave);
    window.addEventListener('pagehide', flushPendingSave);
    return () => {
      window.removeEventListener('beforeunload', flushPendingSave);
      window.removeEventListener('pagehide', flushPendingSave);
    };
  }, []);

  const openCropModal = useCallback((imageUrl) => {
    setCropModal({ isOpen: true, imageUrl });
  }, []);

  const closeCropModal = useCallback(() => {
    setCropModal({ isOpen: false, imageUrl: '' });
  }, []);

  const resetState = useCallback(() => {
    const reset = JSON.parse(JSON.stringify(DEFAULT_STATE));
    setState(reset);
    saveStateToLocalStorage(reset);
    showToast('已重置为默认数据');
  }, [showToast]);

  const updatePersonal = useCallback((field, value) => {
    setState(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  }, []);

  const updateSummary = useCallback((value) => {
    setState(prev => ({
      ...prev,
      summary: value
    }));
  }, []);

  const addSubitem = useCallback((sectionType) => {
    const config = FORM_CONFIGS[sectionType];
    if (!config) return;
    const newItem = {
      id: generateId(config.idPrefix),
      ...config.newItem
    };
    setState(prev => ({
      ...prev,
      [sectionType]: [...prev[sectionType], newItem]
    }));
  }, []);

  const updateSubitem = useCallback((sectionType, id, field, value) => {
    setState(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const updateSkillTag = useCallback((skillId, tagIndex, value) => {
    setState(prev => ({
      ...prev,
      skills: prev.skills.map(item =>
        item.id === skillId
          ? { ...item, tags: updateTagInTagsString(item.tags, tagIndex, value) }
          : item
      )
    }));
  }, []);

  const deleteSubitem = useCallback((sectionType, id) => {
    setState(prev => ({
      ...prev,
      [sectionType]: prev[sectionType].filter(item => item.id !== id)
    }));
    showToast('已删除条目');
  }, [showToast]);

  const moveSubitem = useCallback((sectionType, index, direction) => {
    setState(prev => {
      const list = [...prev[sectionType]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      return { ...prev, [sectionType]: list };
    });
  }, []);

  const toggleSectionColumn = useCallback((section) => {
    setState(prev => {
      const cols = { ...(prev.sectionColumns || DEFAULT_SECTION_COLUMNS) };
      cols[section] = (cols[section] || 'left') === 'left' ? 'right' : 'left';
      return { ...prev, sectionColumns: cols };
    });
  }, []);

  const toggleSectionVisibility = useCallback((section, isVisible) => {
    setState(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: isVisible
      }
    }));
  }, []);

  const reorderSections = useCallback((fromIndex, toIndex) => {
    setState(prev => {
      const order = [...prev.sectionOrder];
      if (fromIndex < 0 || fromIndex >= order.length || toIndex < 0 || toIndex >= order.length) {
        return prev;
      }
      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
      return { ...prev, sectionOrder: order };
    });
  }, []);

  const setTheme = useCallback((theme) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const setFont = useCallback((font) => {
    setState(prev => ({ ...prev, font }));
  }, []);

  const setSpacing = useCallback((spacing) => {
    setState(prev => ({ ...prev, spacing }));
  }, []);

  const setTemplate = useCallback((template) => {
    setState(prev => ({ ...prev, template }));
  }, []);

  const dataValue = useMemo(() => ({
    state,
    setState,
    resetState,
    updatePersonal,
    updateSummary,
    addSubitem,
    updateSubitem,
    updateSkillTag,
    deleteSubitem,
    moveSubitem,
    toggleSectionColumn,
    toggleSectionVisibility,
    reorderSections,
    setTheme,
    setFont,
    setSpacing,
    setTemplate
  }), [
    state,
    resetState,
    updatePersonal,
    updateSummary,
    addSubitem,
    updateSubitem,
    updateSkillTag,
    deleteSubitem,
    moveSubitem,
    toggleSectionColumn,
    toggleSectionVisibility,
    reorderSections,
    setTheme,
    setFont,
    setSpacing,
    setTemplate
  ]);

  const uiValue = useMemo(() => ({
    zoom,
    setZoom,
    fitScreen,
    setFitScreen,
    activeTab,
    setActiveTab,
    isSyncing,
    toasts,
    showToast,
    dismissToast,
    cropModal,
    openCropModal,
    closeCropModal
  }), [zoom, fitScreen, activeTab, isSyncing, toasts, showToast, dismissToast, cropModal, openCropModal, closeCropModal]);

  return (
    <DataContext.Provider value={dataValue}>
      <UIContext.Provider value={uiValue}>
        {children}
      </UIContext.Provider>
    </DataContext.Provider>
  );
}

export function useResumeData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useResumeData must be used within a ResumeProvider');
  }
  return context;
}

export function useResumeUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useResumeUI must be used within a ResumeProvider');
  }
  return context;
}
