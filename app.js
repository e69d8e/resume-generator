// ==========================================
// RESUMIFY APPLICATION STATE & LOGIC
// ==========================================

// Global state
let state = {
  personal: {
    name: '张三',
    title: '资深项目经理 / 运营主管',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop', // default premium avatar
    email: 'zhangsan@example.com',
    phone: '138-1234-5678',
    location: '杭州',
    website: 'zhangsan.me',
    github: '',
    linkedin: 'linkedin.com/in/zhangsan',
    age: '28岁',
    gender: '男',
    arrivalTime: '随时到岗'
  },
  summary: '拥有 8 年大型互联网与跨国企业项目管理与运营经验，持有 PMP 与 ACP 认证。擅长复杂项目从零到一的规划与落地，具备出色的跨部门沟通、风险管理和资源协调能力。主导过多个千万级业务项目的成功交付，通过敏捷转型与运营流程优化，助力团队研发交付效能提升 30% 以上。',
  experience: [
    {
      id: 'exp-1',
      company: '阿里巴巴（杭州）有限公司',
      role: '资深项目经理 / 运营主管',
      startDate: '2023-03',
      endDate: '至今',
      description: '1. 负责阿里云核心业务线的项目全生命周期管理，制定项目里程碑及风险防控方案，确保项目按时交付率提升至 95%。\n2. 引入 Scrum 敏捷开发流程与 OKR 目标管理体系，主导跨部门 100+ 人团队的高效协同，研发交付周期缩短 25%。\n3. 牵头业务运营流程体系优化，梳理并重构了跨团队协作 SOP，降低了 30% 的沟通损耗，显著提升跨区域团队的作战效能。'
    },
    {
      id: 'exp-2',
      company: '字节跳动',
      role: '项目经理 (PMO)',
      startDate: '2021-07',
      endDate: '2023-02',
      description: '1. 主导抖音电商重点营销活动的落地执行，协调产品、研发、设计与运营等多方资源，成功交付多期 S 级电商大促项目。\n2. 建立项目效能度量看板，利用数据分析定位研发与运营流程瓶颈，推动持续改进，促成团队业务指标（GMV）超额完成 15%。\n3. 组织并主持日常站会、迭代计划会、回顾会及风险评审会，解决项目执行过程中的各类障碍与冲突，保障项目平稳运转。'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: '华中科技大学',
      degree: '硕士',
      major: '工商管理 (MBA)',
      startDate: '2018-09',
      endDate: '2021-06',
      description: '专注于企业战略管理与组织行为学研究。荣获校级优秀研究生、一等学业奖学金，担任 MBA 学生会副主席。'
    },
    {
      id: 'edu-2',
      institution: '武汉大学',
      degree: '学士',
      major: '行政管理',
      startDate: '2014-09',
      endDate: '2018-06',
      description: '连续三年获得校级优秀学生奖学金，全国大学生英语竞赛一等奖，担任院学生会主席。'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: '千万级用户数字化转型项目',
      role: '项目总负责人 / PM',
      link: 'zhangsan.me/project-digital',
      startDate: '2024-04',
      endDate: '2024-09',
      techStack: 'Spring Boot, React, Docker, Redis, MySQL',
      description: '主导传统企业向数字化办公平台迁移的整体规划与实施。协调外部供应商及内部研发共 80 余人，历时 6 个月成功上线，实现全集团 15,000+ 员工无缝切换，运营成本降低 20%。'
    },
    {
      id: 'proj-2',
      name: '跨部门敏捷转型与提效工程',
      role: '敏捷教练 (Agile Coach)',
      link: 'zhangsan.me/project-agile',
      startDate: '2024-10',
      endDate: '2025-03',
      techStack: 'Scrum, Jira, OKRs, Confluence',
      description: '针对研发与运营协同效率低下的痛点，制定并推行了量身定制的敏捷协作方案。通过培训与实战带教，帮助 3 个核心团队建立起高效的自组织工作流，项目交付周期中位数从 21 天缩短至 12 天。'
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: '项目管理核心',
      tags: '项目生命周期管理, 敏捷项目管理 (Scrum/Kanban), 风险评估与控制, 资源协调与预算控制, OKR 目标管理'
    },
    {
      id: 'skill-2',
      category: '运营与数据分析',
      tags: '业务流程优化 (SOP), 数据指标体系建设, 竞品分析, 商业智能 (BI) 工具, 用户行为分析'
    },
    {
      id: 'skill-3',
      category: '职场软实力 & 认证',
      tags: 'PMP 认证, ACP 敏捷认证, 跨部门沟通与冲突解决, 演讲与商业汇报, 团队领导力, 危机处理'
    }
  ],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills'],
  sectionVisibility: {
    personal: true,
    summary: true,
    experience: true,
    education: true,
    projects: true,
    skills: true
  },
  sectionColumns: {
    summary: 'left',
    experience: 'left',
    projects: 'left',
    skills: 'right',
    education: 'right'
  },
  theme: 'theme-navy',
  font: 'font-sans',
  spacing: 'spacing-normal',
  template: 'modern'
};

// UI Config State
let zoom = 1.0;
let fitScreenMode = false;

// Collapsed state trackers
let collapsedCards = {};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Load saved state from LocalStorage if exists
  const savedState = localStorage.getItem('resumify_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      
      // Deep merge parsed state with default state to prevent missing properties
      state = {
        personal: { ...state.personal, ...parsed.personal },
        summary: parsed.summary !== undefined ? parsed.summary : state.summary,
        experience: parsed.experience !== undefined ? parsed.experience : state.experience,
        education: parsed.education !== undefined ? parsed.education : state.education,
        projects: parsed.projects !== undefined ? parsed.projects : state.projects,
        skills: parsed.skills !== undefined ? parsed.skills : state.skills,
        sectionOrder: parsed.sectionOrder !== undefined ? parsed.sectionOrder : state.sectionOrder,
        sectionVisibility: { ...state.sectionVisibility, ...parsed.sectionVisibility },
        sectionColumns: { ...state.sectionColumns, ...parsed.sectionColumns },
        theme: parsed.theme || state.theme,
        font: parsed.font || state.font,
        spacing: parsed.spacing || state.spacing,
        template: parsed.template || state.template
      };
    } catch (e) {
      console.warn('Failed to load saved state from localStorage, using defaults.', e);
    }
  }

  initApp();
});

let debounceSaveTimeout;
function saveStateToLocalStorageDebounced() {
  clearTimeout(debounceSaveTimeout);
  debounceSaveTimeout = setTimeout(() => {
    saveStateToLocalStorage();
  }, 300);
}

let debounceRenderTimeout;
function renderPreviewDebounced() {
  clearTimeout(debounceRenderTimeout);
  debounceRenderTimeout = setTimeout(() => {
    renderPreview();
  }, 400);
}

function initApp() {
  // Bind top-level controls
  bindCustomizerControls();
  bindActions();
  bindFormInputs();
  initAvatarUpload();
  initTabs();
  
  // Render views
  renderSortableSections();
  renderAllForms();
  renderPreview();
  
  // Initialize zoom
  setTimeout(() => {
    updateZoom();
    // Watch window resize for fitScreen mode
    window.addEventListener('resize', () => {
      if (fitScreenMode) updateZoom();
    });
  }, 100);
  
  // Initialize Lucide icons and textareas
  lucide.createIcons();
  initAutoExpandingTextareas();
  setupPreviewEditableListener();
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Activate clicked tab
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
      
      // Re-adjust height of textareas if switching to content tab
      if (tabId === 'tab-content') {
        initAutoExpandingTextareas();
      }
      
      // Re-run Lucide in case tabs had unrendered icons
      lucide.createIcons();
    });
  });
}

// Save state helper
function saveStateToLocalStorage() {
  localStorage.setItem('resumify_state', JSON.stringify(state));
}

// Auto-expanding textareas helpers
function initAutoExpandingTextareas() {
  document.querySelectorAll('textarea').forEach(textarea => {
    adjustTextareaHeight(textarea);
    textarea.removeEventListener('input', handleTextareaInput);
    textarea.addEventListener('input', handleTextareaInput);
  });
}

function handleTextareaInput(e) {
  adjustTextareaHeight(e.target);
}

function adjustTextareaHeight(el) {
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight) + 'px';
}

// Bind editable events on preview paper (Bi-directional sync)
function setupPreviewEditableListener() {
  const container = document.getElementById('resume-container');
  if (!container) return;
  container.addEventListener('input', (e) => {
    const path = e.target.dataset.path;
    if (!path) return;
    const value = e.target.innerText || e.target.textContent;
    syncPreviewToStateAndEditor(path, value);
  });
  container.addEventListener('focusout', (e) => {
    const path = e.target.dataset.path;
    if (!path) return;
    renderPreview();
  });
}

// Toggle collapsible card handler (Main forms)
window.toggleCard = function(headerElement) {
  const card = headerElement.parentElement;
  card.classList.toggle('collapsed');
};

// ==========================================
// FORM DATA BINDING & EVENTS
// ==========================================

function bindFormInputs() {
  // Personal Info Inputs (avatar handled separately by initAvatarUpload)
  const personalFields = ['name', 'title', 'email', 'phone', 'location', 'website', 'github', 'linkedin', 'age', 'gender', 'arrivalTime'];
  personalFields.forEach(field => {
    const input = document.getElementById(`info-${field}`);
    if (input) {
      input.value = state.personal[field] || '';
      input.addEventListener('input', (e) => {
        state.personal[field] = e.target.value;
        saveStateToLocalStorageDebounced();
        syncEditorToPreview(`personal.${field}`, e.target.value);
        renderPreviewDebounced();
      });
    }
  });

  // Summary Input
  const summaryInput = document.getElementById('info-summary');
  if (summaryInput) {
    summaryInput.value = state.summary || '';
    summaryInput.addEventListener('input', (e) => {
      state.summary = e.target.value;
      saveStateToLocalStorageDebounced();
      syncEditorToPreview('summary', e.target.value);
      renderPreviewDebounced();
    });
  }
}

// Avatar Upload Widget
function initAvatarUpload() {
  const area = document.getElementById('avatar-upload-area');
  const fileInput = document.getElementById('avatar-file-input');
  const previewImg = document.getElementById('avatar-preview-img');
  const placeholder = document.getElementById('avatar-upload-placeholder');
  const removeBtn = document.getElementById('avatar-remove-btn');
  const urlInput = document.getElementById('info-avatar');

  if (!area || !fileInput) return;

  // Set initial state from existing avatar
  if (state.personal.avatar) {
    previewImg.src = state.personal.avatar;
    removeBtn.style.display = 'flex';
  }

  // Click area → trigger file input
  area.addEventListener('click', (e) => {
    if (e.target.closest('.avatar-remove-btn')) return;
    fileInput.click();
  });

  // File selected → crop modal → update state
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const rawDataUrl = await resizeImage(file, 1024); // read file, resize to max 1024 for crop source
      const croppedUrl = await showCropModal(rawDataUrl);
      if (croppedUrl) {
        state.personal.avatar = croppedUrl;
        previewImg.src = croppedUrl;
        removeBtn.style.display = 'flex';
        if (urlInput) urlInput.value = '';
        saveStateToLocalStorageDebounced();
        syncEditorToPreview('personal.avatar', croppedUrl);
        renderPreviewDebounced();
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
    fileInput.value = '';
  });

  // Remove button → clear avatar
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.personal.avatar = '';
    previewImg.src = '';
    removeBtn.style.display = 'none';
    if (urlInput) urlInput.value = '';
    saveStateToLocalStorageDebounced();
    syncEditorToPreview('personal.avatar', '');
    renderPreviewDebounced();
  });

  // URL fallback input
  if (urlInput) {
    urlInput.value = state.personal.avatar || '';
    urlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      state.personal.avatar = val;
      if (val) {
        previewImg.src = val;
        removeBtn.style.display = 'flex';
      } else {
        previewImg.src = '';
        removeBtn.style.display = 'none';
      }
      saveStateToLocalStorageDebounced();
      syncEditorToPreview('personal.avatar', val);
      renderPreviewDebounced();
    });
  }
}

// Resize image file to max NxN, return JPEG data URL
function resizeImage(file, maxSize) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          const ratio = Math.min(maxSize / w, maxSize / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Show crop modal, returns Promise<base64|null>
function showCropModal(imageDataUrl) {
  return new Promise((resolve) => {
    const modal = document.getElementById('crop-modal');
    const img = document.getElementById('crop-image');
    const viewport = document.getElementById('crop-viewport');
    const zoomSlider = document.getElementById('crop-zoom');
    const confirmBtn = document.getElementById('crop-confirm');
    const cancelBtn = document.getElementById('crop-cancel');
    const backdrop = document.getElementById('crop-modal-backdrop');

    const VP_SIZE = 240; // viewport diameter
    let imgW = 0, imgH = 0;
    let posX = 0, posY = 0;
    let scale = 1;
    let minScale = 1;
    let dragging = false;
    let dragStartX, dragStartY, posStartX, posStartY;

    // Load image and initialize
    img.onload = () => {
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;

      // Scale to fill viewport (minScale = cover the circle)
      const scaleX = VP_SIZE / imgW;
      const scaleY = VP_SIZE / imgH;
      minScale = Math.max(scaleX, scaleY);
      scale = minScale;

      // Center
      posX = (VP_SIZE - imgW * scale) / 2;
      posY = (VP_SIZE - imgH * scale) / 2;

      applyTransform();
      zoomSlider.min = minScale;
      zoomSlider.max = minScale * 4;
      zoomSlider.value = scale;
    };
    img.src = imageDataUrl;

    function applyTransform() {
      img.style.width = imgW + 'px';
      img.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    function clampPosition() {
      const sw = imgW * scale;
      const sh = imgH * scale;
      // Image must cover the entire viewport circle
      if (sw <= VP_SIZE) {
        posX = (VP_SIZE - sw) / 2;
      } else {
        posX = Math.min(0, Math.max(VP_SIZE - sw, posX));
      }
      if (sh <= VP_SIZE) {
        posY = (VP_SIZE - sh) / 2;
      } else {
        posY = Math.min(0, Math.max(VP_SIZE - sh, posY));
      }
    }

    // Drag to pan
    function onPointerDown(e) {
      e.preventDefault();
      dragging = true;
      const point = e.touches ? e.touches[0] : e;
      dragStartX = point.clientX;
      dragStartY = point.clientY;
      posStartX = posX;
      posStartY = posY;
    }

    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      posX = posStartX + (point.clientX - dragStartX);
      posY = posStartY + (point.clientY - dragStartY);
      clampPosition();
      applyTransform();
    }

    function onPointerUp() {
      dragging = false;
    }

    // Zoom slider
    function onZoom() {
      const oldScale = scale;
      scale = parseFloat(zoomSlider.value);
      // Zoom toward center of viewport
      const cx = VP_SIZE / 2;
      const cy = VP_SIZE / 2;
      posX = cx - (cx - posX) * (scale / oldScale);
      posY = cy - (cy - posY) * (scale / oldScale);
      clampPosition();
      applyTransform();
    }

    // Confirm crop
    function onConfirm() {
      const canvas = document.createElement('canvas');
      const outSize = 256;
      canvas.width = outSize;
      canvas.height = outSize;
      const ctx = canvas.getContext('2d');

      // Map viewport circle → source image pixels
      const srcX = -posX / scale;
      const srcY = -posY / scale;
      const srcSize = VP_SIZE / scale;

      // Clip to circle
      ctx.beginPath();
      ctx.arc(outSize / 2, outSize / 2, outSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, outSize, outSize);
      cleanup();
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    }

    function onCancel() {
      cleanup();
      resolve(null);
    }

    function cleanup() {
      modal.style.display = 'none';
      viewport.removeEventListener('mousedown', onPointerDown);
      viewport.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchend', onPointerUp);
      zoomSlider.removeEventListener('input', onZoom);
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      backdrop.removeEventListener('click', onCancel);
      img.onload = null;
    }

    // Bind events
    viewport.addEventListener('mousedown', onPointerDown);
    viewport.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchend', onPointerUp);
    zoomSlider.addEventListener('input', onZoom);
    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    backdrop.addEventListener('click', onCancel);

    // Show modal
    modal.style.display = 'flex';
    lucide.createIcons();
  });
}

// Bind top customization options
function bindCustomizerControls() {
  // Template Selector
  const templateBtns = document.querySelectorAll('.template-btn');
  templateBtns.forEach(btn => {
    const tempName = btn.dataset.template;
    if (state.template === tempName) {
      templateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      templateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.template = tempName;
      saveStateToLocalStorage();
      renderSortableSections();
      renderPreview();
      // recalculate zoom if needed
      setTimeout(updateZoom, 50);
    });
  });

  // Color Presets
  const colorBtns = document.querySelectorAll('.color-preset-btn');
  colorBtns.forEach(btn => {
    const colorTheme = btn.dataset.color;
    if (state.theme === colorTheme) {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.theme = colorTheme;
      saveStateToLocalStorage();
      renderPreview();
    });
  });

  // Font Selection
  const fontSelect = document.getElementById('select-font');
  if (fontSelect) {
    fontSelect.value = state.font;
    fontSelect.addEventListener('change', (e) => {
      state.font = e.target.value;
      saveStateToLocalStorage();
      renderPreview();
    });
  }

  // Spacing Selection
  const spacingSelect = document.getElementById('select-spacing');
  if (spacingSelect) {
    spacingSelect.value = state.spacing;
    spacingSelect.addEventListener('change', (e) => {
      state.spacing = e.target.value;
      saveStateToLocalStorage();
      renderPreview();
      setTimeout(updateZoom, 50);
    });
  }

  // Zoom Controls
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnFit = document.getElementById('btn-fit-screen');
  const zoomText = document.getElementById('zoom-value');

  btnZoomIn.addEventListener('click', () => {
    fitScreenMode = false;
    btnFit.classList.remove('active');
    zoom = Math.min(1.5, zoom + 0.05);
    updateZoom();
  });

  btnZoomOut.addEventListener('click', () => {
    fitScreenMode = false;
    btnFit.classList.remove('active');
    zoom = Math.max(0.4, zoom - 0.05);
    updateZoom();
  });

  btnFit.addEventListener('click', () => {
    fitScreenMode = true;
    btnFit.classList.add('active');
    updateZoom();
  });

  // Editable zoom input
  zoomText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = zoomText.value.replace('%', '').trim();
      const pct = parseInt(raw, 10);
      if (!isNaN(pct) && pct >= 40 && pct <= 150) {
        fitScreenMode = false;
        btnFit.classList.remove('active');
        zoom = pct / 100;
        updateZoom();
      } else {
        // Reset to current value
        updateZoom();
      }
      zoomText.blur();
    }
  });

  zoomText.addEventListener('focus', () => {
    zoomText.select();
  });
}

function bindActions() {
  // Export JSON
  document.getElementById('btn-export').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const fileName = `${state.personal.name || 'resume'}_data.json`;
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Import JSON trigger
  const btnImport = document.getElementById('btn-import');
  const importFile = document.getElementById('import-file');
  btnImport.addEventListener('click', () => {
    importFile.click();
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        // Basic validation
        if (importedData.personal && importedData.experience) {
          state = { ...state, ...importedData };
          if (!state.sectionColumns) {
            state.sectionColumns = {
              summary: 'left',
              experience: 'left',
              projects: 'left',
              skills: 'right',
              education: 'right'
            };
          }
          saveStateToLocalStorage();
          
          // Re-render whole UI
          bindFormInputs();
          renderSortableSections();
          renderAllForms();
          renderPreview();
          updateZoom();
          
          alert('数据导入成功！');
        } else {
          alert('导入的 JSON 格式不合规范。');
        }
      } catch (err) {
        alert('读取文件出错，请确保是正确的 JSON 格式文件。');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be imported again
    importFile.value = '';
  });

  // Print PDF Trigger — renders each .resume-page as a separate PDF page
  document.getElementById('btn-print').addEventListener('click', async () => {
    const btn = document.getElementById('btn-print');
    const originalHTML = btn.innerHTML;

    // Disable contenteditable during export
    const editables = document.querySelectorAll('#resume-container [contenteditable="true"]');
    editables.forEach(el => {
      el.setAttribute('contenteditable', 'false');
      el.dataset.wasEditable = 'true';
    });

    // Reset container zoom for 1:1 rendering
    const container = document.getElementById('resume-container');
    const originalTransform = container.style.transform;
    container.style.transform = 'none';

    // Show loading state
    btn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="margin-right:6px;"></i><span>正在导出...</span>';
    lucide.createIcons();

    try {
      await new Promise(r => setTimeout(r, 150)); // Let browser settle

      const pages = document.querySelectorAll('.resume-page');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');

      for (let i = 0; i < pages.length; i++) {
        const canvas = await window.html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      const name = state.personal.name || 'resume';
      const now = new Date();
      const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      pdf.save(`${name}_${dateStr}.pdf`);
    } catch (err) {
      console.error("PDF Export error:", err);
      alert("PDF 导出失败，请重试！");
    } finally {
      editables.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        delete el.dataset.wasEditable;
      });
      container.style.transform = originalTransform;
      btn.innerHTML = originalHTML;
      lucide.createIcons();
    }
  });

}

// Zoom helper
function updateZoom() {
  const wrapper = document.querySelector('.resume-container');
  const zoomInput = document.getElementById('zoom-value');
  const previewContainer = document.querySelector('.preview-container');

  if (!wrapper || !previewContainer) return;

  if (fitScreenMode) {
    const containerWidth = previewContainer.clientWidth - 80;
    const scaleWidth = containerWidth / 794; // 210mm ≈ 794px

    let scale = Math.min(scaleWidth, 1.2);
    scale = Math.max(0.4, scale);

    wrapper.style.transform = `scale(${scale})`;
    zoomInput.value = `${Math.round(scale * 100)}%`;
  } else {
    wrapper.style.transform = `scale(${zoom})`;
    zoomInput.value = `${Math.round(zoom * 100)}%`;
  }
}

// ==========================================
// RENDERERS: SECTIONS ORDER / VISIBILITY
// ==========================================

function renderSortableSections() {
  const container = document.getElementById('sortable-sections');
  container.innerHTML = '';

  const sectionNameMap = {
    summary: '自我评价',
    experience: '工作经历',
    projects: '项目经验',
    education: '教育背景',
    skills: '专业技能'
  };

  const isTwoColumnTemplate = state.template === 'modern' || state.template === 'sidebar';

  state.sectionOrder.forEach((section, index) => {
    const isVisible = state.sectionVisibility[section] !== false;
    const displayName = sectionNameMap[section] || section;
    const isLeft = (state.sectionColumns[section] || 'left') === 'left';

    const colBadgeHTML = isTwoColumnTemplate ? `
      <button class="col-badge ${isLeft ? 'left-col' : 'right-col'}" 
              onclick="toggleSectionColumn('${section}', event)"
              title="切换到${isLeft ? '侧栏 (右栏)' : '主栏 (左栏)'}">
        ${isLeft ? '主栏' : '侧栏'}
      </button>
    ` : '';

    const eyeIcon = isVisible ? 'eye' : 'eye-off';
    const eyeTitle = isVisible ? '隐藏模块' : '显示模块';

    const item = document.createElement('div');
    item.className = 'sortable-item';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-index', index);
    item.setAttribute('data-section', section);
    item.innerHTML = `
      <div class="sortable-item-left">
        <span class="drag-handle"><i data-lucide="grip-vertical"></i></span>
        <button class="visibility-btn ${isVisible ? 'visible' : 'hidden'}" 
                onclick="toggleSectionVisibility('${section}', ${!isVisible}, event)"
                title="${eyeTitle}">
          <i data-lucide="${eyeIcon}"></i>
        </button>
        <span class="section-name-text ${isVisible ? '' : 'text-muted'}">${displayName}</span>
      </div>
      <div class="sortable-item-right" onclick="event.stopPropagation()">
        ${colBadgeHTML}
      </div>
    `;
    
    // Bind HTML5 drag & drop events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', handleDragEnd);

    container.appendChild(item);
  });
  
  lucide.createIcons();
}

// HTML5 Drag & Drop callbacks
let dragSourceEl = null;

function handleDragStart(e) {
  this.classList.add('dragging');
  dragSourceEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.index);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  this.classList.add('drag-over');
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.stopPropagation();
  this.classList.remove('drag-over');
  
  if (dragSourceEl !== this) {
    const fromIndex = parseInt(dragSourceEl.dataset.index);
    const toIndex = parseInt(this.dataset.index);
    
    // Move element in sectionOrder array
    const movedSection = state.sectionOrder.splice(fromIndex, 1)[0];
    state.sectionOrder.splice(toIndex, 0, movedSection);
    
    saveStateToLocalStorage();
    renderSortableSections();
    renderPreview();
  }
  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  const items = document.querySelectorAll('.sortable-item');
  items.forEach(item => {
    item.classList.remove('drag-over');
  });
}

window.toggleSectionColumn = function(section, event = null) {
  if (event) event.stopPropagation();
  if (!state.sectionColumns) {
    state.sectionColumns = {
      summary: 'left',
      experience: 'left',
      projects: 'left',
      skills: 'right',
      education: 'right'
    };
  }
  state.sectionColumns[section] = state.sectionColumns[section] === 'left' ? 'right' : 'left';
  saveStateToLocalStorage();
  renderSortableSections();
  renderPreview();
};

window.toggleSectionVisibility = function(section, isVisible, event = null) {
  if (event) event.stopPropagation();
  state.sectionVisibility[section] = isVisible;
  saveStateToLocalStorage();
  renderSortableSections();
  renderPreview();
};

// ==========================================
// RENDERERS: EDITOR FORMS (LIST ITEMS)
// ==========================================

function renderAllForms() {
  renderExperienceForm();
  renderEducationForm();
  renderProjectsForm();
  renderSkillsForm();
}

// Generic Collapsible subcard toggle
window.toggleItemCard = function(headerElement) {
  const card = headerElement.parentElement;
  card.classList.toggle('collapsed');
};

// Experience Forms
function renderExperienceForm() {
  const container = document.getElementById('experience-items');
  container.innerHTML = '';

  state.experience.forEach((item, index) => {
    const isCollapsed = collapsedCards[item.id] !== false; // default collapsed
    
    const card = document.createElement('div');
    card.className = `item-card ${isCollapsed ? 'collapsed' : ''}`;
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="item-card-header" onclick="toggleItemCard(this)">
        <span class="item-card-title">${item.company || '新加入公司'} - ${item.role || '新职位'}</span>
        <div class="item-card-actions" onclick="event.stopPropagation()">
          <button class="order-btn" title="上移" onclick="moveSubitem('experience', ${index}, 'up')">
            <i data-lucide="chevron-up"></i>
          </button>
          <button class="order-btn" title="下移" onclick="moveSubitem('experience', ${index}, 'down')">
            <i data-lucide="chevron-down"></i>
          </button>
          <button class="btn btn-danger-outline" onclick="deleteSubitem('experience', '${item.id}')">
            删除
          </button>
          <i data-lucide="chevron-down" class="chevron-toggle"></i>
        </div>
      </div>
      <div class="item-card-content">
        <div class="form-grid">
          <div class="input-group">
            <label>公司名称</label>
            <input type="text" value="${item.company || ''}" oninput="updateSubitemField('experience', '${item.id}', 'company', this.value, this)">
          </div>
          <div class="input-group">
            <label>工作岗位</label>
            <input type="text" value="${item.role || ''}" oninput="updateSubitemField('experience', '${item.id}', 'role', this.value, this)">
          </div>
          <div class="input-group">
            <label>开始时间</label>
            <input type="text" value="${item.startDate || ''}" placeholder="例如：2020-03" oninput="updateSubitemField('experience', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="input-group">
            <label>结束时间</label>
            <input type="text" value="${item.endDate || ''}" placeholder="例如：2023-05 或 至今" oninput="updateSubitemField('experience', '${item.id}', 'endDate', this.value)">
          </div>
          <div class="input-group full-width">
            <label>工作描述 (支持换行，建议以列表形式描述)</label>
            <textarea rows="5" placeholder="1. 主导项目...\n2. 负责开发..." oninput="updateSubitemField('experience', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  
  // Bind dynamic add click
  document.getElementById('add-exp-btn').onclick = () => {
    const id = `exp-${Date.now()}`;
    state.experience.push({
      id,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    collapsedCards[id] = false; // Expand the new card immediately
    saveStateToLocalStorage();
    renderExperienceForm();
    renderPreview();
  };

  lucide.createIcons();
  initAutoExpandingTextareas();
}

// Education Forms
function renderEducationForm() {
  const container = document.getElementById('education-items');
  container.innerHTML = '';

  state.education.forEach((item, index) => {
    const isCollapsed = collapsedCards[item.id] !== false;

    const card = document.createElement('div');
    card.className = `item-card ${isCollapsed ? 'collapsed' : ''}`;
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="item-card-header" onclick="toggleItemCard(this)">
        <span class="item-card-title">${item.institution || '新加入学校'} - ${item.degree || '学历'} ${item.major || ''}</span>
        <div class="item-card-actions" onclick="event.stopPropagation()">
          <button class="order-btn" title="上移" onclick="moveSubitem('education', ${index}, 'up')">
            <i data-lucide="chevron-up"></i>
          </button>
          <button class="order-btn" title="下移" onclick="moveSubitem('education', ${index}, 'down')">
            <i data-lucide="chevron-down"></i>
          </button>
          <button class="btn btn-danger-outline" onclick="deleteSubitem('education', '${item.id}')">
            删除
          </button>
          <i data-lucide="chevron-down" class="chevron-toggle"></i>
        </div>
      </div>
      <div class="item-card-content">
        <div class="form-grid">
          <div class="input-group">
            <label>学校 / 机构名称</label>
            <input type="text" value="${item.institution || ''}" oninput="updateSubitemField('education', '${item.id}', 'institution', this.value, this)">
          </div>
          <div class="input-group">
            <label>学位 / 证书</label>
            <input type="text" value="${item.degree || ''}" placeholder="例如：学士 / 硕士" oninput="updateSubitemField('education', '${item.id}', 'degree', this.value, this)">
          </div>
          <div class="input-group">
            <label>专业 / 科系</label>
            <input type="text" value="${item.major || ''}" placeholder="例如：计算机科学" oninput="updateSubitemField('education', '${item.id}', 'major', this.value, this)">
          </div>
          <div class="input-group">
            <label>起止时间</label>
            <input type="text" value="${item.startDate || ''}" placeholder="例如：2016.09 - 2020.06" oninput="updateSubitemField('education', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="input-group full-width">
            <label>教育背景描述 (选填)</label>
            <textarea rows="3" placeholder="专业绩点、主修课程、奖学金或在校荣誉等" oninput="updateSubitemField('education', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('add-edu-btn').onclick = () => {
    const id = `edu-${Date.now()}`;
    state.education.push({
      id,
      institution: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    collapsedCards[id] = false;
    saveStateToLocalStorage();
    renderEducationForm();
    renderPreview();
  };

  lucide.createIcons();
  initAutoExpandingTextareas();
}

// Projects Forms
function renderProjectsForm() {
  const container = document.getElementById('project-items');
  container.innerHTML = '';

  state.projects.forEach((item, index) => {
    const isCollapsed = collapsedCards[item.id] !== false;

    const card = document.createElement('div');
    card.className = `item-card ${isCollapsed ? 'collapsed' : ''}`;
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="item-card-header" onclick="toggleItemCard(this)">
        <span class="item-card-title">${item.name || '新项目名称'} - ${item.role || '担任角色'}</span>
        <div class="item-card-actions" onclick="event.stopPropagation()">
          <button class="order-btn" title="上移" onclick="moveSubitem('projects', ${index}, 'up')">
            <i data-lucide="chevron-up"></i>
          </button>
          <button class="order-btn" title="下移" onclick="moveSubitem('projects', ${index}, 'down')">
            <i data-lucide="chevron-down"></i>
          </button>
          <button class="btn btn-danger-outline" onclick="deleteSubitem('projects', '${item.id}')">
            删除
          </button>
          <i data-lucide="chevron-down" class="chevron-toggle"></i>
        </div>
      </div>
      <div class="item-card-content">
        <div class="form-grid">
          <div class="input-group">
            <label>项目名称</label>
            <input type="text" value="${item.name || ''}" oninput="updateSubitemField('projects', '${item.id}', 'name', this.value, this)">
          </div>
          <div class="input-group">
            <label>担任角色</label>
            <input type="text" value="${item.role || ''}" placeholder="例如：项目负责人 / 核心开发" oninput="updateSubitemField('projects', '${item.id}', 'role', this.value, this)">
          </div>
          <div class="input-group">
            <label>开始时间</label>
            <input type="text" value="${item.startDate || ''}" placeholder="例如：2025-12" oninput="updateSubitemField('projects', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="input-group">
            <label>结束时间</label>
            <input type="text" value="${item.endDate || ''}" placeholder="例如：2026-05 或 至今" oninput="updateSubitemField('projects', '${item.id}', 'endDate', this.value)">
          </div>
          <div class="input-group full-width">
            <label>技术栈 (选填)</label>
            <input type="text" value="${item.techStack || ''}" placeholder="例如：Spring Boot, Redis, Vue3" oninput="updateSubitemField('projects', '${item.id}', 'techStack', this.value)">
          </div>
          <div class="input-group full-width">
            <label>项目链接 (选填)</label>
            <input type="text" value="${item.link || ''}" placeholder="例如：github.com/username/project" oninput="updateSubitemField('projects', '${item.id}', 'link', this.value)">
          </div>
          <div class="input-group full-width">
            <label>项目描述</label>
            <textarea rows="4" placeholder="描述该项目背景、您的职责、所用技术及项目成果" oninput="updateSubitemField('projects', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('add-proj-btn').onclick = () => {
    const id = `proj-${Date.now()}`;
    state.projects.push({
      id,
      name: '',
      role: '',
      link: '',
      startDate: '',
      endDate: '',
      techStack: '',
      description: ''
    });
    collapsedCards[id] = false;
    saveStateToLocalStorage();
    renderProjectsForm();
    renderPreview();
  };

  lucide.createIcons();
  initAutoExpandingTextareas();
}

// Skills Forms
function renderSkillsForm() {
  const container = document.getElementById('skill-items');
  container.innerHTML = '';

  state.skills.forEach((item, index) => {
    const isCollapsed = collapsedCards[item.id] !== false;

    const card = document.createElement('div');
    card.className = `item-card ${isCollapsed ? 'collapsed' : ''}`;
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="item-card-header" onclick="toggleItemCard(this)">
        <span class="item-card-title">${item.category || '新技能分类'}</span>
        <div class="item-card-actions" onclick="event.stopPropagation()">
          <button class="order-btn" title="上移" onclick="moveSubitem('skills', ${index}, 'up')">
            <i data-lucide="chevron-up"></i>
          </button>
          <button class="order-btn" title="下移" onclick="moveSubitem('skills', ${index}, 'down')">
            <i data-lucide="chevron-down"></i>
          </button>
          <button class="btn btn-danger-outline" onclick="deleteSubitem('skills', '${item.id}')">
            删除
          </button>
          <i data-lucide="chevron-down" class="chevron-toggle"></i>
        </div>
      </div>
      <div class="item-card-content">
        <div class="form-grid">
          <div class="input-group full-width">
            <label>技能分类名称</label>
            <input type="text" value="${item.category || ''}" placeholder="例如：编程语言 / 办公软件" oninput="updateSubitemField('skills', '${item.id}', 'category', this.value, this)">
          </div>
          <div class="input-group full-width">
            <label>具体技能标签 (英文逗号分隔)</label>
            <input type="text" value="${item.tags || ''}" placeholder="例如：JavaScript, TypeScript, React" oninput="updateSubitemField('skills', '${item.id}', 'tags', this.value)">
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById('add-skill-btn').onclick = () => {
    const id = `skill-${Date.now()}`;
    state.skills.push({
      id,
      category: '',
      tags: ''
    });
    collapsedCards[id] = false;
    saveStateToLocalStorage();
    renderSkillsForm();
    renderPreview();
  };

  lucide.createIcons();
  initAutoExpandingTextareas();
}

// Subitems actions logic
window.updateSubitemField = function(sectionType, id, field, value, inputEl = null) {
  const item = state[sectionType].find(i => i.id === id);
  if (item) {
    item[field] = value;
    saveStateToLocalStorageDebounced();
    
    // Dynamic visual improvement: Update Card Header Title immediately as user types
    if (inputEl) {
      const card = inputEl.closest('.item-card');
      const titleEl = card.querySelector('.item-card-title');
      if (sectionType === 'experience') {
        const comp = card.querySelector('input[oninput*="company"]').value || '新加入公司';
        const role = card.querySelector('input[oninput*="role"]').value || '新职位';
        titleEl.textContent = `${comp} - ${role}`;
      } else if (sectionType === 'education') {
        const inst = card.querySelector('input[oninput*="institution"]').value || '新加入学校';
        const deg = card.querySelector('input[oninput*="degree"]').value || '学历';
        titleEl.textContent = `${inst} - ${deg}`;
      } else if (sectionType === 'projects') {
        const name = card.querySelector('input[oninput*="name"]').value || '新项目名称';
        const role = card.querySelector('input[oninput*="role"]').value || '担任角色';
        titleEl.textContent = `${name} - ${role}`;
      } else if (sectionType === 'skills') {
        titleEl.textContent = value || '新技能分类';
      }
    }
    
    // Sync to preview element instead of full redraw (except for tags which requires badge rebuilding)
    if (field === 'tags') {
      renderPreview();
    } else {
      syncEditorToPreview(`${sectionType}.${id}.${field}`, value);
      renderPreviewDebounced();
    }
  }
};

window.deleteSubitem = function(sectionType, id) {
      if (confirm('确定要删除此模块吗？')) {
    state[sectionType] = state[sectionType].filter(i => i.id !== id);
    if (collapsedCards[id] !== undefined) delete collapsedCards[id];
    saveStateToLocalStorage();
    
    // Refresh respective form view and document preview
    if (sectionType === 'experience') renderExperienceForm();
    else if (sectionType === 'education') renderEducationForm();
    else if (sectionType === 'projects') renderProjectsForm();
    else if (sectionType === 'skills') renderSkillsForm();
    
    renderPreview();
  }
};

window.moveSubitem = function(sectionType, index, direction) {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= state[sectionType].length) return;

  const temp = state[sectionType][index];
  state[sectionType][index] = state[sectionType][newIndex];
  state[sectionType][newIndex] = temp;

  // Track collapsed status before redrawing
  const listEl = document.getElementById(`${sectionType}-items`);
  const cards = listEl.querySelectorAll('.item-card');
  cards.forEach(card => {
    const id = card.dataset.id;
    collapsedCards[id] = card.classList.contains('collapsed');
  });

  saveStateToLocalStorage();

  if (sectionType === 'experience') renderExperienceForm();
  else if (sectionType === 'education') renderEducationForm();
  else if (sectionType === 'projects') renderProjectsForm();
  else if (sectionType === 'skills') renderSkillsForm();

  renderPreview();
};

// ==========================================
// PAGE COUNT BADGE UPDATER
// ==========================================

function updatePageCountBadge(pagesCount) {
  const badge = document.getElementById('page-count');
  if (!badge) return;

  const textSpan = badge.querySelector('span');
  if (!textSpan) return;

  textSpan.textContent = pagesCount === 1 ? '1 页' : `${pagesCount} 页`;

  // Add multi-page warning style if content exceeds one page
  if (pagesCount > 1) {
    badge.classList.add('multi-page');
    badge.title = `当前简历共 ${pagesCount} 页，建议精简内容以适配单页`;
  } else {
    badge.classList.remove('multi-page');
    badge.title = '当前简历页数';
  }
}

// ==========================================
// PAGINATION ENGINE FOR MULTI-PAGE RESUME
// ==========================================

// Measure content height using a hidden container
function measureContentHeight(htmlContent, columnClass = '') {
  const measureDiv = document.createElement('div');
  
  // Set explicit classes so stylesheets apply correctly
  measureDiv.className = `resume-page ${state.theme} ${state.font} ${state.spacing} template-${state.template}`;
  
  // Set padding top/bottom to 0 so we only measure content height, and prevent margin collapsing via flow-root
  const spacingMap = { 'spacing-compact': 16, 'spacing-normal': 20, 'spacing-comfortable': 26 };
  const pad = spacingMap[state.spacing] || 30;
  
  measureDiv.style.cssText = `
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    width: 210mm;
    height: auto !important;
    min-height: 0 !important;
    padding: 0 ${pad}px !important;
    box-sizing: border-box;
    margin: 0 !important;
    display: flow-root !important;
  `;
  measureDiv.style.setProperty('--pad', `${pad}px`);
  
  if (columnClass) {
    let wrapHTML = '';
    if (state.template === 'modern') {
      if (columnClass === 'main-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;"></div><div class="side-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      }
    } else if (state.template === 'sidebar') {
      if (columnClass === 'sidebar-col') {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      } else {
        wrapHTML = `<div class="resume-body" style="margin:0;padding:0;border:none;"><div class="sidebar-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;"></div><div class="main-col" style="margin:0;padding:0;border:none;float:none;width:auto;height:auto;">${htmlContent}</div></div>`;
      }
    } else {
      wrapHTML = htmlContent;
    }
    measureDiv.innerHTML = wrapHTML;
  } else {
    measureDiv.innerHTML = htmlContent;
  }
  
  document.body.appendChild(measureDiv);
  const height = measureDiv.scrollHeight;
  document.body.removeChild(measureDiv);
  return height;
}

// Get page content height in pixels (A4 = 297mm, minus padding)
function getPageContentHeight() {
  const spacingMap = { 'spacing-compact': 16, 'spacing-normal': 20, 'spacing-comfortable': 26 };
  const pad = spacingMap[state.spacing] || 30;
  return 1123 - (pad * 2); // 297mm ≈ 1123px at 96 DPI
}

// Paginate sections: keep section title with first item, never split items
function paginateContent(headerHTML, sectionsHTML) {
  const pageContentHeight = getPageContentHeight();
  const headerHeight = measureContentHeight(headerHTML);
  
  // Calculate continuation header height for subsequent pages
  const continuationHeaderHTML = `<div class="resume-continuation-header"><span class="continuation-name">${state.personal.name || ''}</span><span class="continuation-divider">·</span><span class="continuation-page">第 2 页</span></div>`;
  const continuationHeaderHeight = measureContentHeight(continuationHeaderHTML);

  // Route two-column templates explicitly to prevent layout flattening
  if (state.template === 'modern' || state.template === 'sidebar') {
    const totalHeight = headerHeight + measureContentHeight(sectionsHTML);
    if (totalHeight <= pageContentHeight) {
      return [{ header: headerHTML, body: sectionsHTML }];
    }
    return paginateComplexLayout(headerHTML, sectionsHTML, headerHeight, pageContentHeight, continuationHeaderHeight);
  }

  // Parse sections from HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sectionsHTML;
  const sectionEls = Array.from(tempDiv.querySelectorAll('.resume-section'));

  // If no sections found, treat as single block
  if (sectionEls.length === 0) {
    const totalHeight = headerHeight + measureContentHeight(sectionsHTML);
    if (totalHeight <= pageContentHeight) {
      return [{ header: headerHTML, body: sectionsHTML }];
    }
    return [{ header: headerHTML, body: sectionsHTML }];
  }

  // One-column layout: paginate at section level
  const pages = [];
  let currentPageSections = [];
  let currentHeight = headerHeight;

  for (const section of sectionEls) {
    const sectionHTML = section.outerHTML;
    const sectionHeight = measureContentHeight(sectionHTML);

    // If section fits on current page
    if (currentHeight + sectionHeight <= pageContentHeight) {
      currentPageSections.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    // Section doesn't fit — try splitting its items
    const items = section.querySelectorAll('.resume-item, .resume-skill-cat');

    if (items.length === 0) {
      // Cannot split this section (e.g. summary). Just move it to the next page.
      if (currentPageSections.length > 0) {
        pages.push(currentPageSections);
        currentPageSections = [];
        currentHeight = continuationHeaderHeight; // Subsequent pages start with continuation header height
      }
      currentPageSections.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    const titleEl = section.querySelector('.resume-section-title');
    const titleHTML = titleEl ? titleEl.outerHTML : '';
    const titleHeight = titleHTML ? measureContentHeight(titleHTML) : 0;
    const sectionClass = section.className;

    // Check if the title + first item can fit on the current page.
    const firstItem = items[0];
    const firstItemHeight = firstItem ? measureContentHeight(firstItem.outerHTML) : 0;
    const canStartOnCurrentPage = (currentHeight + titleHeight + firstItemHeight <= pageContentHeight);

    // Save current page if we can't start on it
    if (!canStartOnCurrentPage && currentPageSections.length > 0) {
      pages.push(currentPageSections);
      currentPageSections = [];
      currentHeight = continuationHeaderHeight;
    }

    // Try to fit items one by one
    let itemGroup = [];
    let itemGroupHeight = currentHeight + titleHeight; // Account for current page height and section title

    for (const item of items) {
      const itemHTML = item.outerHTML;
      const itemHeight = measureContentHeight(itemHTML);

      if (itemGroupHeight + itemHeight > pageContentHeight && itemGroup.length > 0) {
        // Flush current item group to a page
        currentPageSections.push(
          `<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`
        );
        pages.push(currentPageSections);
        currentPageSections = [];
        itemGroup = [];
        itemGroupHeight = continuationHeaderHeight + titleHeight; // Reset for new page with continuation header
      }

      itemGroup.push(itemHTML);
      itemGroupHeight += itemHeight;
    }

    // Remaining items in this section
    if (itemGroup.length > 0) {
      currentPageSections.push(
        `<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`
      );
      currentHeight = itemGroupHeight;
    }
  }

  if (currentPageSections.length > 0) {
    pages.push(currentPageSections);
  }

  return pages.map((sections, i) => ({
    header: i === 0 ? headerHTML : '',
    body: sections.join('')
  }));
}

// Handle complex (two-column) layouts
function paginateComplexLayout(headerHTML, bodyHTML, headerHeight, pageContentHeight, continuationHeaderHeight) {
  const totalHeight = headerHeight + measureContentHeight(bodyHTML);

  if (totalHeight <= pageContentHeight) {
    return [{ header: headerHTML, body: bodyHTML }];
  }

  // For two-column layouts, extract sections from both columns
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = bodyHTML;
  const mainCol = tempDiv.querySelector('.main-col');
  const sideCol = tempDiv.querySelector('.side-col') || tempDiv.querySelector('.sidebar-col');
  const bodyClass = tempDiv.querySelector('.resume-body')?.className || 'resume-body';

  if (!mainCol) {
    // Fallback: just return as single page
    return [{ header: headerHTML, body: bodyHTML }];
  }

  const mainSections = Array.from(mainCol.querySelectorAll('.resume-section'));
  const sideSections = sideCol ? Array.from(sideCol.querySelectorAll('.resume-section')) : [];

  // Measure static headers of each column (e.g. name/title or avatar/contacts that are not sections)
  const mainColClone = mainCol.cloneNode(true);
  mainColClone.querySelectorAll('.resume-section').forEach(el => el.remove());
  const mainColHeaderHeight = measureContentHeight(mainColClone.innerHTML, 'main-col');

  let sideColHeaderHeight = 0;
  if (sideCol) {
    const sideColClone = sideCol.cloneNode(true);
    sideColClone.querySelectorAll('.resume-section').forEach(el => el.remove());
    sideColHeaderHeight = measureContentHeight(sideColClone.innerHTML, state.template === 'sidebar' ? 'sidebar-col' : 'side-col');
  }

  // Paginate main column (headerHeight is only added to the first page's initial height)
  const mainPages = paginateSectionsIntoPages(mainSections, headerHeight + mainColHeaderHeight, pageContentHeight, continuationHeaderHeight, 'main-col');

  // Paginate side column
  const sidePages = paginateSectionsIntoPages(
    sideSections, 
    headerHeight + sideColHeaderHeight, 
    pageContentHeight, 
    continuationHeaderHeight,
    state.template === 'sidebar' ? 'sidebar-col' : 'side-col'
  );

  // Combine into pages
  const maxPages = Math.max(mainPages.length, sidePages.length);
  const pages = [];

  for (let i = 0; i < maxPages; i++) {
    const mainContent = mainPages[i] || [];
    const sideContent = sidePages[i] || [];

    // Reconstruct column elements in the correct horizontal order based on template
    let pageBody = '';
    if (state.template === 'sidebar') {
      pageBody = `<div class="${bodyClass}">
        ${sideCol ? `<div class="${sideCol.className}">${sideContent.join('')}</div>` : ''}
        <div class="main-col">${mainContent.join('')}</div>
      </div>`;
    } else {
      pageBody = `<div class="${bodyClass}">
        <div class="main-col">${mainContent.join('')}</div>
        ${sideCol ? `<div class="${sideCol.className}">${sideContent.join('')}</div>` : ''}
      </div>`;
    }

    pages.push({
      header: i === 0 ? headerHTML : '',
      body: pageBody
    });
  }

  return pages;
}

// Helper: paginate an array of section elements into page arrays
// Splits sections by individual items when a section doesn't fit
function paginateSectionsIntoPages(sectionEls, initialHeight, pageContentHeight, continuationHeaderHeight, columnClass) {
  const pages = [];
  let currentPage = [];
  let currentHeight = initialHeight;

  for (const section of sectionEls) {
    const sectionHTML = section.outerHTML;
    const sectionHeight = measureContentHeight(sectionHTML, columnClass);

    // If section fits on current page, add it whole
    if (currentHeight + sectionHeight <= pageContentHeight) {
      currentPage.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    // Section doesn't fit — try splitting its items
    const items = section.querySelectorAll('.resume-item, .resume-skill-cat');

    if (items.length === 0) {
      // Cannot split this section (e.g. summary). Just move it to the next page.
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = continuationHeaderHeight;
      }
      currentPage.push(sectionHTML);
      currentHeight += sectionHeight;
      continue;
    }

    const titleEl = section.querySelector('.resume-section-title');
    const titleHTML = titleEl ? titleEl.outerHTML : '';
    const titleHeight = titleHTML ? measureContentHeight(titleHTML, columnClass) : 0;
    const sectionClass = section.className;

    // Check if the title + first item can fit on the current page.
    const firstItem = items[0];
    const firstItemHeight = firstItem ? measureContentHeight(firstItem.outerHTML, columnClass) : 0;
    const canStartOnCurrentPage = (currentHeight + titleHeight + firstItemHeight <= pageContentHeight);

    // Save current page if we can't start on it
    if (!canStartOnCurrentPage && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = continuationHeaderHeight;
    }

    // Try to fit items one by one
    let itemGroup = [];
    let itemGroupHeight = currentHeight + titleHeight; // Account for current page height and section title

    for (const item of items) {
      const itemHTML = item.outerHTML;
      const itemHeight = measureContentHeight(itemHTML, columnClass);

      if (itemGroupHeight + itemHeight > pageContentHeight && itemGroup.length > 0) {
        // Flush current item group to a page
        currentPage.push(
          `<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`
        );
        pages.push(currentPage);
        currentPage = [];
        itemGroup = [];
        itemGroupHeight = continuationHeaderHeight + titleHeight; // Reset for new page
      }

      itemGroup.push(itemHTML);
      itemGroupHeight += itemHeight;
    }

    // Remaining items in this section
    if (itemGroup.length > 0) {
      currentPage.push(
        `<section class="${sectionClass}">${titleHTML}<div class="resume-items-list">${itemGroup.join('')}</div></section>`
      );
      currentHeight = itemGroupHeight;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

// ==========================================
// RENDERER: LIVE RESUME PREVIEW DOCUMENT
// ==========================================

function renderPreview() {
  const container = document.getElementById('resume-container');
  if (!container) return;

  container.innerHTML = '';

  const templateClasses = `${state.theme} ${state.font} ${state.spacing} template-${state.template}`;
  const headerHTML = renderHeaderTemplate();

  // Build body HTML based on template
  let bodyHTML = '';

  if (state.template === 'modern') {
    const leftSections = state.sectionOrder.filter(s => (state.sectionColumns[s] || 'left') === 'left');
    const rightSections = state.sectionOrder.filter(s => (state.sectionColumns[s] || 'left') === 'right');
    bodyHTML = `<div class="resume-body">
      <div class="main-col">${renderSectionsHTML(leftSections)}</div>
      <div class="side-col">${renderSectionsHTML(rightSections)}</div>
    </div>`;
  } else if (state.template === 'sidebar') {
    const mainSections = state.sectionOrder.filter(s => (state.sectionColumns[s] || 'left') === 'left');
    const sideSections = state.sectionOrder.filter(s => (state.sectionColumns[s] || 'left') === 'right');
    const p = state.personal;
    const avatarHTML = p.avatar ? `<div class="avatar-container"><img src="${p.avatar}" alt="${p.name}" class="avatar-img" onerror="this.style.display='none'"></div>` : '';
    let contactsList = [];
    if (p.age) contactsList.push(`<div class="contact-item"><i data-lucide="calendar"></i><span contenteditable="true" data-path="personal.age">${p.age}</span></div>`);
    if (p.gender) contactsList.push(`<div class="contact-item"><i data-lucide="user"></i><span contenteditable="true" data-path="personal.gender">${p.gender}</span></div>`);
    if (p.arrivalTime) contactsList.push(`<div class="contact-item"><i data-lucide="clock"></i><span contenteditable="true" data-path="personal.arrivalTime">${p.arrivalTime}</span></div>`);
    if (p.phone) contactsList.push(`<div class="contact-item"><i data-lucide="phone"></i><span contenteditable="true" data-path="personal.phone">${p.phone}</span></div>`);
    if (p.email) contactsList.push(`<div class="contact-item"><i data-lucide="mail"></i><span contenteditable="true" data-path="personal.email">${p.email}</span></div>`);
    if (p.location) contactsList.push(`<div class="contact-item"><i data-lucide="map-pin"></i><span contenteditable="true" data-path="personal.location">${p.location}</span></div>`);
    if (p.website) contactsList.push(`<div class="contact-item"><i data-lucide="globe"></i><span contenteditable="true" data-path="personal.website">${p.website}</span></div>`);
    if (p.github) contactsList.push(`<div class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg><span contenteditable="true" data-path="personal.github">${p.github}</span></div>`);
    if (p.linkedin) contactsList.push(`<div class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg><span contenteditable="true" data-path="personal.linkedin">${p.linkedin}</span></div>`);
    bodyHTML = `<div class="resume-body">
      <div class="sidebar-col">${avatarHTML}<div class="sidebar-contacts">${contactsList.join('')}</div>${renderSectionsHTML(sideSections)}</div>
      <div class="main-col"><h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1><div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>${renderSectionsHTML(mainSections)}</div>
    </div>`;
  } else {
    // elegant, geek, minimal — single-column layouts
    bodyHTML = `<div class="resume-body">${renderSectionsHTML(state.sectionOrder)}</div>`;
  }

  // Paginate content
  const pages = paginateContent(headerHTML, bodyHTML);

  // Render each page
  pages.forEach((page, index) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = `resume-page ${templateClasses}`;
    pageDiv.setAttribute('data-page', String(index + 1));

    if (index === 0) {
      pageDiv.innerHTML = page.header + page.body;
    } else {
      // Continuation header with name + page number
      const contHeader = `<div class="resume-continuation-header"><span class="continuation-name">${state.personal.name || ''}</span><span class="continuation-divider">·</span><span class="continuation-page">第 ${index + 1} 页</span></div>`;
      pageDiv.innerHTML = contHeader + page.body;
    }

    container.appendChild(pageDiv);
  });

  lucide.createIcons();
  updatePageCountBadge(pages.length);
}

// Generate Header HTML based on template
function renderHeaderTemplate() {
  const p = state.personal;
  
  const avatarHTML = p.avatar ? `
    <div class="avatar-container">
      <img src="${p.avatar}" alt="${p.name}" class="avatar-img" onerror="this.style.display='none'">
    </div>
  ` : '';

  // Contacts lists assembler
  let contactsList = [];
  
  if (p.age) contactsList.push(`<div class="contact-item"><i data-lucide="calendar"></i><span contenteditable="true" data-path="personal.age">${p.age}</span></div>`);
  if (p.gender) contactsList.push(`<div class="contact-item"><i data-lucide="user"></i><span contenteditable="true" data-path="personal.gender">${p.gender}</span></div>`);
  if (p.arrivalTime) contactsList.push(`<div class="contact-item"><i data-lucide="clock"></i><span contenteditable="true" data-path="personal.arrivalTime">${p.arrivalTime}</span></div>`);
  if (p.phone) contactsList.push(`<div class="contact-item"><i data-lucide="phone"></i><span contenteditable="true" data-path="personal.phone">${p.phone}</span></div>`);
  if (p.email) contactsList.push(`<div class="contact-item"><i data-lucide="mail"></i><span contenteditable="true" data-path="personal.email">${p.email}</span></div>`);
  if (p.location) contactsList.push(`<div class="contact-item"><i data-lucide="map-pin"></i><span contenteditable="true" data-path="personal.location">${p.location}</span></div>`);
  if (p.website) contactsList.push(`<div class="contact-item"><i data-lucide="globe"></i><span contenteditable="true" data-path="personal.website">${p.website}</span></div>`);
  if (p.github) contactsList.push(`<div class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg><span contenteditable="true" data-path="personal.github">${p.github}</span></div>`);
  if (p.linkedin) contactsList.push(`<div class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg><span contenteditable="true" data-path="personal.linkedin">${p.linkedin}</span></div>`);

  if (state.template === 'modern') {
    return `
      <header class="resume-header">
        <div class="header-info-main">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts">
            ${contactsList.join('')}
          </div>
        </div>
        ${avatarHTML}
      </header>
    `;
  } else if (state.template === 'elegant') {
    const hasAvatarClass = p.avatar ? 'has-avatar' : 'no-avatar';
    return `
      <header class="resume-header ${hasAvatarClass}">
        ${avatarHTML}
        <div class="header-text-container">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts">
            ${contactsList.join('')}
          </div>
        </div>
      </header>
    `;
  } else if (state.template === 'geek') {
    let geekContacts = [];
    if (p.age) geekContacts.push(`<div class="contact-item"><span class="contact-label">年 龄：</span><span contenteditable="true" data-path="personal.age">${p.age}</span></div>`);
    if (p.gender) geekContacts.push(`<div class="contact-item"><span class="contact-label">性 别：</span><span contenteditable="true" data-path="personal.gender">${p.gender}</span></div>`);
    if (p.phone) geekContacts.push(`<div class="contact-item"><span class="contact-label">电 话：</span><span contenteditable="true" data-path="personal.phone">${p.phone}</span></div>`);
    if (p.email) geekContacts.push(`<div class="contact-item"><span class="contact-label">邮 箱：</span><span contenteditable="true" data-path="personal.email">${p.email}</span></div>`);
    if (p.location) geekContacts.push(`<div class="contact-item"><span class="contact-label">地 区：</span><span contenteditable="true" data-path="personal.location">${p.location}</span></div>`);
    if (p.arrivalTime) geekContacts.push(`<div class="contact-item"><span class="contact-label">到 岗：</span><span contenteditable="true" data-path="personal.arrivalTime">${p.arrivalTime}</span></div>`);
    if (p.github) geekContacts.push(`<div class="contact-item"><span class="contact-label">GitHub：</span><span contenteditable="true" data-path="personal.github">${p.github}</span></div>`);
    if (p.linkedin) geekContacts.push(`<div class="contact-item"><span class="contact-label">LinkedIn：</span><span contenteditable="true" data-path="personal.linkedin">${p.linkedin}</span></div>`);
    if (p.website) geekContacts.push(`<div class="contact-item"><span class="contact-label">网 站：</span><span contenteditable="true" data-path="personal.website">${p.website}</span></div>`);

    return `
      <header class="resume-header geek-header">
        <div class="header-info-main">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts-grid">
            ${geekContacts.join('')}
          </div>
        </div>
        ${avatarHTML}
      </header>
    `;
  } else if (state.template === 'minimal') {
    return `
      <header class="resume-header">
        <div class="header-info-main">
          <h1 class="resume-name" contenteditable="true" data-path="personal.name">${p.name || ''}</h1>
          <div class="resume-title" contenteditable="true" data-path="personal.title">${p.title || ''}</div>
          <div class="header-contacts">
            ${contactsList.join('')}
          </div>
        </div>
        ${avatarHTML}
      </header>
    `;
  }
  return '';
}

// Returns concatenated HTML of listed sections
function renderSectionsHTML(sectionsList) {
  let sectionsHTML = '';
  
  sectionsList.forEach(sectionKey => {
    // Check visibility toggle
    if (state.sectionVisibility[sectionKey] === false) return;

    if (sectionKey === 'summary' && state.summary) {
      sectionsHTML += `
        <section class="resume-section section-summary">
          <div class="resume-section-title">
          <span>自我评价</span>
          </div>
          <div class="resume-summary" contenteditable="true" data-path="summary">${state.summary}</div>
        </section>
      `;
    } 
    else if (sectionKey === 'experience' && state.experience.length > 0) {
      let itemsHTML = '';
      state.experience.forEach(item => {
        if (!item.company && !item.role) return;
        itemsHTML += `
          <div class="resume-item">
            <div class="resume-item-header">
              <span contenteditable="true" data-path="experience.${item.id}.company">${item.company}</span>
              <span>
                <span contenteditable="true" data-path="experience.${item.id}.startDate">${item.startDate}</span> ~ 
                <span contenteditable="true" data-path="experience.${item.id}.endDate">${item.endDate}</span>
              </span>
            </div>
            <div class="resume-item-sub">
              <span contenteditable="true" data-path="experience.${item.id}.role">${item.role}</span>
            </div>
            <div class="resume-item-description" contenteditable="true" data-path="experience.${item.id}.description">${item.description}</div>
          </div>
        `;
      });
      if (itemsHTML) {
        sectionsHTML += `
          <section class="resume-section section-experience">
            <div class="resume-section-title">
          <span>工作经历</span>
            </div>
            <div class="resume-items-list">${itemsHTML}</div>
          </section>
        `;
      }
    } 
    else if (sectionKey === 'education' && state.education.length > 0) {
      let itemsHTML = '';
      state.education.forEach(item => {
        if (!item.institution) return;
        itemsHTML += `
          <div class="resume-item">
            <div class="resume-item-header">
              <span contenteditable="true" data-path="education.${item.id}.institution">${item.institution}</span>
              <span contenteditable="true" data-path="education.${item.id}.startDate">${item.startDate}</span>
            </div>
            <div class="resume-item-sub">
              <span contenteditable="true" data-path="education.${item.id}.degree">${item.degree}</span> - 
              <span contenteditable="true" data-path="education.${item.id}.major">${item.major}</span>
            </div>
            <div class="resume-item-description" contenteditable="true" data-path="education.${item.id}.description">${item.description || ''}</div>
          </div>
        `;
      });
      if (itemsHTML) {
        sectionsHTML += `
          <section class="resume-section section-education">
            <div class="resume-section-title">
          <span>教育背景</span>
            </div>
            <div class="resume-items-list">${itemsHTML}</div>
          </section>
        `;
      }
    } 
    else if (sectionKey === 'projects' && state.projects.length > 0) {
      let itemsHTML = '';
      state.projects.forEach(item => {
        if (!item.name) return;
        
        const dateHTML = (item.startDate || item.endDate) ? `
          <span class="resume-item-date">
            <span contenteditable="true" data-path="projects.${item.id}.startDate">${item.startDate || ''}</span>
            ${(item.startDate && item.endDate) ? ' ~ ' : ''}
            <span contenteditable="true" data-path="projects.${item.id}.endDate">${item.endDate || ''}</span>
          </span>
        ` : '';

        const techHTML = item.techStack ? `
          <div class="project-tech-stack">
            <strong>技术栈：</strong><span contenteditable="true" data-path="projects.${item.id}.techStack">${item.techStack}</span>
          </div>
        ` : '';

        const linkHTML = item.link ? `
          <span class="project-link-label">
            链接: <span contenteditable="true" data-path="projects.${item.id}.link">${item.link}</span>
          </span>
        ` : '';

        const subHTML = (techHTML || linkHTML) ? `
          <div class="resume-item-sub">
            ${techHTML}
            ${linkHTML}
          </div>
        ` : '';

        itemsHTML += `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="project-name-role">
                <span contenteditable="true" data-path="projects.${item.id}.name" style="font-weight: 700;">${item.name}</span>
                <span class="project-role-sep">·</span>
                <span contenteditable="true" data-path="projects.${item.id}.role" class="project-role">${item.role}</span>
              </span>
              ${dateHTML}
            </div>
            ${subHTML}
            <div class="resume-item-description" contenteditable="true" data-path="projects.${item.id}.description">${item.description}</div>
          </div>
        `;
      });
      if (itemsHTML) {
        sectionsHTML += `
          <section class="resume-section section-projects">
            <div class="resume-section-title">
          <span>项目经验</span>
            </div>
            <div class="resume-items-list">${itemsHTML}</div>
          </section>
        `;
      }
    } 
    else if (sectionKey === 'skills' && state.skills.length > 0) {
      let itemsHTML = '';
      state.skills.forEach(item => {
        if (!item.category) return;
        
        const tags = item.tags.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
          
        const tagsHTML = tags.map((tag, tagIdx) => `
          <span class="resume-skill-tag" contenteditable="true" data-path="skills.${item.id}.tags.${tagIdx}">${tag}</span>
        `).join('');
        
        itemsHTML += `
          <div class="resume-skill-cat">
            <div class="resume-skill-cat-name" contenteditable="true" data-path="skills.${item.id}.category">${item.category}</div>
            <div class="resume-skill-tags">${tagsHTML}</div>
          </div>
        `;
      });
      if (itemsHTML) {
        sectionsHTML += `
          <section class="resume-section section-skills">
            <div class="resume-section-title">
          <span>专业技能</span>
            </div>
            <div class="resume-skills-grid">${itemsHTML}</div>
          </section>
        `;
      }
    }
  });

  return sectionsHTML;
}

// ==========================================
// TARGETED UPDATE ENGINE (UX ENHANCEMENTS)
// ==========================================

function syncEditorToPreview(path, value) {
  if (path === 'personal.avatar') {
    const imgs = document.querySelectorAll('.avatar-img');
    imgs.forEach(img => {
      img.src = value;
      img.style.display = value ? 'block' : 'none';
    });
    // Also update editor preview
    const editorImg = document.getElementById('avatar-preview-img');
    const removeBtn = document.getElementById('avatar-remove-btn');
    if (editorImg) {
      editorImg.src = value;
    }
    if (removeBtn) {
      removeBtn.style.display = value ? 'flex' : 'none';
    }
    return;
  }
  // Update all matching elements across all pages
  const els = document.querySelectorAll(`[data-path="${path}"]`);
  els.forEach(el => {
    el.textContent = value;
  });
}

function syncPreviewToStateAndEditor(path, value) {
  const parts = path.split('.');
  
  if (parts.length === 2 && parts[0] === 'personal') {
    const field = parts[1];
    state.personal[field] = value;
    const input = document.getElementById(`info-${field}`);
    if (input) input.value = value;
    
  } else if (parts.length === 1 && parts[0] === 'summary') {
    state.summary = value;
    const input = document.getElementById('info-summary');
    if (input) {
      input.value = value;
      adjustTextareaHeight(input);
    }
    
  } else if (parts.length === 3) {
    const sectionType = parts[0];
    const id = parts[1];
    const field = parts[2];
    
    const item = state[sectionType].find(i => i.id === id);
    if (item) {
      item[field] = value;
      
      const card = document.querySelector(`.item-card[data-id="${id}"]`);
      if (card) {
        const input = card.querySelector(`[oninput*="${field}"]`);
        if (input) {
          input.value = value;
          if (input.tagName === 'TEXTAREA') {
            adjustTextareaHeight(input);
          }
        }
        
        const titleEl = card.querySelector('.item-card-title');
        if (titleEl) {
          if (sectionType === 'experience') {
            const comp = state.experience.find(i => i.id === id).company || '新加入公司';
            const role = state.experience.find(i => i.id === id).role || '新职位';
            titleEl.textContent = `${comp} - ${role}`;
          } else if (sectionType === 'education') {
            const inst = state.education.find(i => i.id === id).institution || '新加入学校';
            const deg = state.education.find(i => i.id === id).degree || '学历';
            titleEl.textContent = `${inst} - ${deg}`;
          } else if (sectionType === 'projects') {
            const name = state.projects.find(i => i.id === id).name || '新项目名称';
            const role = state.projects.find(i => i.id === id).role || '担任角色';
            titleEl.textContent = `${name} - ${role}`;
          } else if (sectionType === 'skills') {
            titleEl.textContent = value || '新技能分类';
          }
        }
      }
    }
  } else if (parts.length === 4 && parts[0] === 'skills' && parts[2] === 'tags') {
    const id = parts[1];
    const tagIndex = parseInt(parts[3]);
    const skillItem = state.skills.find(s => s.id === id);
    if (skillItem) {
      let tagsArr = skillItem.tags.split(',').map(t => t.trim());
      tagsArr[tagIndex] = value;
      skillItem.tags = tagsArr.filter(t => t.length > 0).join(', ');
      
      const card = document.querySelector(`.item-card[data-id="${id}"]`);
      if (card) {
        const input = card.querySelector(`[oninput*="tags"]`);
        if (input) input.value = skillItem.tags;
      }
    }
  }
  
  saveStateToLocalStorageDebounced();
}

// Print listeners to temporarily disable contenteditable to fix CJK print bugs
window.addEventListener('beforeprint', () => {
  const editables = document.querySelectorAll('#resume-container [contenteditable="true"]');
  editables.forEach(el => {
    el.setAttribute('contenteditable', 'false');
    el.dataset.wasEditable = 'true';
  });
});

window.addEventListener('afterprint', () => {
  const editables = document.querySelectorAll('#resume-container [data-was-editable="true"]');
  editables.forEach(el => {
    el.setAttribute('contenteditable', 'true');
    delete el.dataset.wasEditable;
  });
});
