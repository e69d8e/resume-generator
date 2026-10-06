import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DEFAULT_STATE } from '../src/constants/defaultState.js';
import {
  mergeState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage
} from '../src/utils/storage.js';

const STORAGE_KEY = 'resumify_state';

function clone(state) {
  return JSON.parse(JSON.stringify(state));
}

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should return DEFAULT_STATE when storage is empty', () => {
    expect(loadStateFromLocalStorage()).toEqual(DEFAULT_STATE);
  });

  it('should round-trip state through save/load with version wrapper', () => {
    const state = clone(DEFAULT_STATE);
    state.personal.name = '版本化测试';
    expect(saveStateToLocalStorage(state)).toBe(true);

    // 存储格式为 { version, data }
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(raw.version).toBe(1);
    expect(raw.data.personal.name).toBe('版本化测试');

    const loaded = loadStateFromLocalStorage();
    expect(loaded.personal.name).toBe('版本化测试');
    expect(loaded.experience).toEqual(state.experience);
  });

  it('should still load legacy raw-state format without version field', () => {
    const legacy = clone(DEFAULT_STATE);
    legacy.personal.name = '旧格式数据';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

    const loaded = loadStateFromLocalStorage();
    expect(loaded.personal.name).toBe('旧格式数据');
  });

  it('should report failure instead of silently swallowing quota errors', () => {
    const quotaError = Object.assign(new Error('QuotaExceededError'), { name: 'QuotaExceededError' });
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw quotaError; },
      removeItem: () => {},
      clear: () => {}
    });

    expect(saveStateToLocalStorage(clone(DEFAULT_STATE))).toBe(false);
  });

  it('should return DEFAULT_STATE when stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadStateFromLocalStorage()).toEqual(DEFAULT_STATE);
  });

  it('should sanitize loaded state through mergeState', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      personal: { name: '<img src=x onerror="alert(1)">' }
    }));
    const loaded = loadStateFromLocalStorage();
    // 名称被保留，但渲染层会转义；此处验证 merge 层不丢字段
    expect(loaded.personal.name).toBe('<img src=x onerror="alert(1)">');
    expect(loaded.personal.title).toBe(DEFAULT_STATE.personal.title);
  });
});
