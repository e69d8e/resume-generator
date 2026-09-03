import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_STATE, FORM_CONFIGS, DEFAULT_SECTION_COLUMNS } from '../constants/defaultState.js';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../utils/storage.js';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [state, setState] = useState(() => loadStateFromLocalStorage());
  const [zoom, setZoom] = useState(1.0);
  const [fitScreen, setFitScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-content');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cropModal, setCropModal] = useState({ isOpen: false, imageUrl: '' });

  const saveTimerRef = useRef(null);

  // Debounced auto-save to localStorage
  useEffect(() => {
    setIsSyncing(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStateToLocalStorage(state);
      setIsSyncing(false);
    }, 300);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
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
      id: `${config.idPrefix}-${Date.now()}`,
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

  const value = {
    state,
    setState,
    resetState,
    updatePersonal,
    updateSummary,
    addSubitem,
    updateSubitem,
    deleteSubitem,
    moveSubitem,
    toggleSectionColumn,
    toggleSectionVisibility,
    reorderSections,
    setTheme,
    setFont,
    setSpacing,
    setTemplate,
    zoom,
    setZoom,
    fitScreen,
    setFitScreen,
    activeTab,
    setActiveTab,
    isSyncing,
    toasts,
    showToast,
    cropModal,
    openCropModal,
    closeCropModal
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
