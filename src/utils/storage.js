import { DEFAULT_STATE } from '../constants/defaultState.js';

const STORAGE_KEY = 'resumify_state';

export function mergeState(baseState, loadedState) {
  if (!loadedState || typeof loadedState !== 'object') {
    return JSON.parse(JSON.stringify(baseState));
  }
  const result = JSON.parse(JSON.stringify(baseState));

  if (loadedState.personal && typeof loadedState.personal === 'object') {
    result.personal = { ...result.personal, ...loadedState.personal };
    delete result.personal.__proto__;
  }

  if (typeof loadedState.summary === 'string') {
    result.summary = loadedState.summary;
  }

  ['experience', 'education', 'projects', 'skills'].forEach(sec => {
    if (Array.isArray(loadedState[sec])) {
      result[sec] = loadedState[sec];
    }
  });

  if (Array.isArray(loadedState.sectionOrder) && loadedState.sectionOrder.length > 0) {
    result.sectionOrder = [...loadedState.sectionOrder];
  }

  if (loadedState.sectionVisibility && typeof loadedState.sectionVisibility === 'object') {
    result.sectionVisibility = { ...result.sectionVisibility, ...loadedState.sectionVisibility };
    delete result.sectionVisibility.__proto__;
  }

  if (loadedState.sectionColumns && typeof loadedState.sectionColumns === 'object') {
    result.sectionColumns = { ...result.sectionColumns, ...loadedState.sectionColumns };
    delete result.sectionColumns.__proto__;
  }

  if (typeof loadedState.theme === 'string') result.theme = loadedState.theme;
  if (typeof loadedState.font === 'string') result.font = loadedState.font;
  if (typeof loadedState.spacing === 'string') result.spacing = loadedState.spacing;
  if (typeof loadedState.template === 'string') result.template = loadedState.template;

  return result;
}

export function loadStateFromLocalStorage() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return DEFAULT_STATE;
    const parsed = JSON.parse(item);
    return mergeState(DEFAULT_STATE, parsed);
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveStateToLocalStorage(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportStateAsJSON(state) {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${state.personal.name || 'resume'}_data.json`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
