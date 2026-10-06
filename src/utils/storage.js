import {
  DEFAULT_STATE,
  FORM_CONFIGS,
  SECTION_NAMES,
  TEMPLATES,
  COLOR_PRESETS,
  FONTS,
  SPACINGS,
  AVATAR_SHAPES
} from '../constants/defaultState.js';
import { generateId } from './id.js';

const STORAGE_KEY = 'resumify_state';
const STORAGE_VERSION = 1;

const SECTION_KEYS = Object.keys(SECTION_NAMES);
const VALID_TEMPLATES = TEMPLATES.map(t => t.id);
const VALID_THEMES = COLOR_PRESETS.map(t => t.id);
const VALID_FONTS = FONTS.map(f => f.id);
const VALID_SPACINGS = SPACINGS.map(s => s.id);
const VALID_AVATAR_SHAPES = AVATAR_SHAPES.map(s => s.id);

function coerceText(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function pickEnum(value, validIds, fallback) {
  return validIds.includes(value) ? value : fallback;
}

// 导入数据不可信：只保留已知字段并强制转字符串，字段缺失时保留默认值
function sanitizePersonal(loadedPersonal, basePersonal) {
  const personal = { ...basePersonal };
  Object.keys(basePersonal).forEach(field => {
    if (!(field in loadedPersonal)) return;
    if (field === 'avatarShape') {
      personal.avatarShape = pickEnum(loadedPersonal[field], VALID_AVATAR_SHAPES, basePersonal.avatarShape);
    } else {
      personal[field] = coerceText(loadedPersonal[field]);
    }
  });
  return personal;
}

// 数组条目过滤非对象元素、补齐缺失或重复的 id，避免 data-path / React key 出现 undefined
function sanitizeSection(loadedItems, sectionKey) {
  if (!Array.isArray(loadedItems)) return null;
  const config = FORM_CONFIGS[sectionKey];
  const fields = config ? Object.keys(config.newItem) : null;
  const seenIds = new Set();
  const items = [];
  loadedItems.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
    const item = {};
    if (fields) {
      fields.forEach(f => { item[f] = coerceText(raw[f]); });
    } else {
      Object.keys(raw).forEach(f => { item[f] = coerceText(raw[f]); });
    }
    const rawId = typeof raw.id === 'string' ? raw.id : '';
    item.id = rawId && !seenIds.has(rawId) ? rawId : generateId(config ? config.idPrefix : sectionKey);
    seenIds.add(item.id);
    items.push(item);
  });
  return items;
}

export function mergeState(baseState, loadedState) {
  if (!loadedState || typeof loadedState !== 'object') {
    return JSON.parse(JSON.stringify(baseState));
  }
  const result = JSON.parse(JSON.stringify(baseState));

  if (loadedState.personal && typeof loadedState.personal === 'object' && !Array.isArray(loadedState.personal)) {
    result.personal = sanitizePersonal(loadedState.personal, result.personal);
  }

  if (typeof loadedState.summary === 'string') {
    result.summary = loadedState.summary;
  }

  ['experience', 'education', 'projects', 'skills'].forEach(sec => {
    const sanitized = sanitizeSection(loadedState[sec], sec);
    if (sanitized !== null) {
      result[sec] = sanitized;
    }
  });

  if (Array.isArray(loadedState.sectionOrder)) {
    const order = [...new Set(loadedState.sectionOrder.filter(key => SECTION_KEYS.includes(key)))];
    if (order.length > 0) {
      result.sectionOrder = order;
    }
  }

  if (loadedState.sectionVisibility && typeof loadedState.sectionVisibility === 'object') {
    const visibility = { ...result.sectionVisibility };
    SECTION_KEYS.forEach(key => {
      if (key in loadedState.sectionVisibility) {
        visibility[key] = loadedState.sectionVisibility[key] !== false;
      }
    });
    result.sectionVisibility = visibility;
  }

  if (loadedState.sectionColumns && typeof loadedState.sectionColumns === 'object') {
    const columns = { ...result.sectionColumns };
    SECTION_KEYS.forEach(key => {
      if (key in loadedState.sectionColumns) {
        columns[key] = loadedState.sectionColumns[key] === 'right' ? 'right' : 'left';
      }
    });
    result.sectionColumns = columns;
  }

  result.theme = pickEnum(loadedState.theme, VALID_THEMES, result.theme);
  result.font = pickEnum(loadedState.font, VALID_FONTS, result.font);
  result.spacing = pickEnum(loadedState.spacing, VALID_SPACINGS, result.spacing);
  result.template = pickEnum(loadedState.template, VALID_TEMPLATES, result.template);

  return result;
}

export function loadStateFromLocalStorage() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return DEFAULT_STATE;
    const parsed = JSON.parse(item);
    // v1 起存储格式为 { version, data }；旧格式（裸 state 对象）继续兼容读取
    const loadedState = parsed && parsed.version === STORAGE_VERSION ? parsed.data : parsed;
    return mergeState(DEFAULT_STATE, loadedState);
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveStateToLocalStorage(state) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, data: state }));
    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

export function exportStateAsJSON(state) {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (state?.personal?.name || 'resume').replace(/[\\/:*?"<>|]/g, '_').trim() || 'resume';
  a.download = `${safeName}_data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
