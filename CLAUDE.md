# CLAUDE.md

本文件为 ZCode (Claude) 在本仓库工作时提供指导。

## 项目概述

Resumify — 高质感简历生成器，**React 19 + Vite 6** 单页应用。左侧编辑面板（表单/模板/主题），右侧实时 A4 预览（HTML 字符串渲染 + 自动分页），支持多页、7 套模板、头像裁剪、JSON 导入导出与客户端 PDF 导出（html2canvas + jsPDF）。数据持久化到 localStorage，部署于 Netlify。

**界面设计规范：根目录 `DESIGN.md`（warm-canvas 编辑风格）是配色与 UI 的唯一权威**——米色画布 #faf9f5 + 珊瑚色主 CTA #cc785c + 深色面板 #181715；衬线展示字体（Cormorant Garamond 替代）字重恒为 500、负字距，正文 Inter；珊瑚色只用于主 CTA 与品牌强调，尖刺符号（`SpikeMark.jsx`）作字标前缀且为墨色。改 UI 样式前先查该文件的 token 与组件定义。注意：简历模板本身的排版字体（`font-sans/serif/tech`）是产品功能，不受此规范约束。

## 常用命令

```bash
npm run dev        # 启动 Vite 开发服务器 (localhost:5173)
npm run build      # 生产构建 → dist/
npm run preview    # 本地预览构建产物
npm test           # vitest run（全量测试）
npm run test:watch # vitest watch
```

无 lint 配置；Node >= 18（见 package.json engines）。

## 架构

```
src/
├── main.jsx                     # 入口，引入 styles/index.css（样式总入口）
├── App.jsx                      # 左右分栏 + 移动端 Tab 切换
├── constants/defaultState.js    # DEFAULT_STATE、FORM_CONFIGS、模板/主题/字体枚举、缩放常量
├── context/ResumeContext.jsx    # 双 Context Provider（见下）
├── hooks/useExportPDF.js        # PDF 导出共享 hook（loading/统一提示）
├── styles/                      # 样式分区（index.css 按原级联顺序 @import）
│                                #   base / resume-document / editor-ux / print / responsive
│                                #   template-modern / elegant-sidebar / geek-minimal / creative-compact
├── components/
│   ├── common/                  # Toast、AvatarCropModal、CollapseHeader
│   ├── editor/                  # EditorHeader、EditorTabs、ContentTab、LayoutTab、
│   │                            #   PersonalForm、SummaryForm、DynamicListForm、FormCard、SectionSorter
│   └── preview/                 # ResumeContainer、ResumePage、PreviewToolbar
└── utils/
    ├── pagination.js            # 分页引擎（核心，见下）
    ├── pdfExport.js             # html2canvas 逐页截图 + jsPDF 拼接，模块级导出互斥
    ├── storage.js               # 版本化 localStorage 存取 + mergeState 导入消毒
    ├── skills.js / id.js        # 技能标签回写纯函数 / 防碰撞 id 生成
```

### 状态管理：双 Context

`ResumeContext.jsx` 提供 **`useResumeData()`**（简历数据 state 及全部操作 action）与 **`useResumeUI()`**（zoom/fitScreen/activeTab/isSyncing/toasts/cropModal）。两者 value 均 useMemo 化。**新增组件时按需选择 hook**，不要恢复合并式订阅——拆分的意义是让编辑文本不触发 UI 组件重渲染、toast 弹出不触发数据组件重渲染。

自动保存：state 变化 → 300ms 防抖 → `saveStateToLocalStorage`；失败时 toast 提示（只提示一次）；`beforeunload`/`pagehide` 时同步 flush 挂起的保存。

### 分页引擎 (utils/pagination.js)

预览不是 React 组件树，而是 **HTML 字符串 → `dangerouslySetInnerHTML`**：

1. `renderFullResumeHTML(state)` 按 template/sectionOrder/sectionColumns 拼接 headerHTML + bodyHTML；
2. `paginateContent` 用**测量沙盒**（`.resume-measure-sandbox`，固定 210mm 宽）反复挂载/卸载 DOM 量取高度，超过 `getPageContentHeight`（A4 1123px - 上下 padding）即分页；modern/sidebar 双栏模板按列独立分页（`paginateComplexLayout`）；
3. `ResumeContainer` 用 `useDeferredValue(state)` 低优先级重分页，分页结果（JSON 比较）未变化时跳过 setState。

**测量沙盒约定**：测单列高度时沙盒必须保留双列结构（被测列 + 空占位列），让模板 CSS 的列宽自然生效；禁止用内联 `width:auto` 覆盖列宽，否则行宽被撑到整页宽、高度系统性低估、内容被 `overflow:hidden` 静默裁切。

### ⚠️ 安全约定（必须遵守）

预览走 `dangerouslySetInnerHTML`，**任何用户数据（personal 字段、条目字段、summary、id、avatar URL）拼进 HTML 模板字符串前必须经过 `pagination.js` 导出的 `escapeHTML()`**。新增模板分支或插值点时逐点检查。数据入库侧的防线在 `storage.js` 的 `mergeState`（字段白名单、类型强转、id 补齐、枚举校验），两道防线都要维持。

### 存储格式

localStorage key `resumify_state`，格式 `{ version: 1, data: <state> }`；读取兼容无 version 的旧裸对象。导入 JSON 一律经 `mergeState(DEFAULT_STATE, parsed)` 消毒。

### PDF 导出

`pdfExport.js` `exportToPDF`：临时移除容器 transform 与 contenteditable → html2canvas 逐页（scale 2, useCORS, JPEG 0.92）→ jsPDF A4 拼接 → try/finally 恢复现场。模块级 `isExporting` 互斥，两处入口（EditorHeader / PreviewToolbar）共用 `useExportPDF` hook。

## 测试

vitest + @testing-library/react + happy-dom（`vite.config.js` 内联配置）。6 个测试文件：

- `state.test.js` — 数据模型默认值、mergeState 合并、原型污染防护
- `sanitize.test.js` — XSS 转义（含整条渲染链）与导入消毒回归
- `storage.test.js` — 版本化往返、旧格式兼容、配额失败返回 false、损坏 JSON 兜底
- `pagination.test.js` — 测量缓存、分页拆分、超长 section、技能标签 data-path
- `skills.test.js` — 标签字符串回写纯函数、id 生成防碰撞
- `components.test.jsx` — 应用级冒烟（渲染/Tab/表单联动/模板切换/预览编辑技能标签/重置入口）

改 pagination/storage/context 时先跑 `npm test`。

## 注意事项

- 模板枚举见 `TEMPLATES`（7 个：modern/elegant/sidebar/geek/minimal/creative/compact）；默认头像为内置 dataURL（`scripts/generate-default-avatar.cjs` 可重新生成），不要引入外部图片依赖。
- 可折叠卡片头部统一用 `CollapseHeader`（键盘可访问）；模态框遵循 AvatarCropModal 的 dialog 模式（role/aria-modal/Esc/焦点圈定）。
- `styles/` 按区段拆分（原 91KB 单文件），`index.css` 以 @import 保持原级联顺序；新增模板样式放到对应 `template-*.css`，不要恢复单文件。拆分脚本见 `scripts/split-styles.cjs`。
