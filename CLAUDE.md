# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resumify is a client-side resume generator web application with a modern dark-themed UI. It provides a split-pane interface with a sidebar editor (left) and live resume preview (right). The application is built with vanilla JavaScript, HTML, and CSS — no build tools or frameworks.

## Architecture

### Core Files
- `app.js` — Main application logic (state management, rendering, event handling)
- `index.html` — UI structure with editor panels and preview container
- `styles.css` — All styling including themes, templates, and responsive design
- `set_sidebar.html` — Utility HTML for sidebar configuration

### State Management
The application uses a single global `state` object stored in `localStorage` under key `resumify_state`. State structure:
```javascript
{
  personal: { name, title, avatar, email, phone, location, website, github, linkedin },
  summary: string,
  experience: [{ id, company, role, startDate, endDate, description }],
  education: [{ id, institution, degree, major, startDate, endDate, description }],
  projects: [{ id, name, role, link, description }],
  skills: [{ id, category, tags }],  // tags is comma-separated string
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills'],
  sectionVisibility: { [section]: boolean },
  sectionColumns: { [section]: 'left' | 'right' },
  theme: 'theme-navy' | 'theme-emerald' | 'theme-wine' | 'theme-indigo' | 'theme-dark',
  font: 'font-sans' | 'font-serif' | 'font-tech',
  spacing: 'spacing-compact' | 'spacing-normal' | 'spacing-comfortable',
  template: 'modern' | 'elegant' | 'sidebar' | 'geek' | 'minimal'
}
```

### Rendering Architecture
- **Editor Forms**: Dynamically generated in `renderAllForms()` → `renderExperienceForm()`, `renderEducationForm()`, `renderProjectsForm()`, `renderSkillsForm()`
- **Multi-Page Preview**: `renderPreview()` uses pagination engine to split content across multiple A4 pages (`#resume-container` → `.resume-page` elements)
- **Pagination Engine**: `paginateContent()` measures section heights and distributes across pages, ensuring items are never split mid-content
- **Bidirectional Sync**: Changes in editor sync to preview via `syncEditorToPreview()`, preview edits sync back via `syncPreviewToStateAndEditor()`
- **Targeted Updates**: Uses `data-path` attributes on preview elements for efficient DOM updates without full re-renders

### Template System
Three layout templates with distinct HTML structures:
- **Modern** (`template-modern`): Two-column layout with main content (left) and sidebar (right)
- **Elegant** (`template-elegant`): Single-column centered layout
- **Sidebar** (`template-sidebar`): Two-column with left sidebar for contacts/skills and right main content
- **Geek** (`template-geek`): Single-column with grid-based contact layout and banner section titles
- **Minimal** (`template-minimal`): Ultra-clean single-column layout, no decorations, content-first design

### Theme System
CSS class-based theming on `.resume-page` (also legacy `.resume-paper`):
- Color themes: `theme-navy`, `theme-emerald`, `theme-wine`, `theme-indigo`, `theme-dark`
- Font families: `font-sans` (Inter), `font-serif` (Noto Serif SC), `font-tech` (JetBrains Mono)
- Spacing: `spacing-compact`, `spacing-normal`, `spacing-comfortable`

## Key Features

### PDF Export
Uses html2canvas + jsPDF for client-side PDF generation. The export process:
1. Temporarily disables `contenteditable` attributes
2. Resets container zoom to 100%
3. Iterates over each `.resume-page` element, capturing each as a separate PDF page
4. Restores original state

### Drag & Drop
HTML5 Drag & Drop API for reordering sections in the editor sidebar. Implemented via `handleDragStart`, `handleDragOver`, `handleDrop`, `handleDragEnd`.

### Section Management
- Visibility toggle per section via `sectionVisibility`
- Column assignment (left/right) for two-column templates via `sectionColumns`
- Section reordering via drag-and-drop updates `sectionOrder`

### Data Import/Export
- Export: Downloads state as JSON file
- Import: File input accepts `.json`, merges with backward compatibility checks

## Development

### Running Locally
Open `index.html` directly in a browser — no server required. All dependencies are loaded via CDN:
- Lucide Icons (latest)
- html2canvas 1.4.1
- jsPDF 2.5.1
- Google Fonts (Inter, Outfit, Noto Serif SC, JetBrains Mono)

### Key Functions
- `initApp()` — Entry point, binds controls and renders initial state
- `renderPreview()` — Multi-page preview rebuild using pagination engine
- `paginateContent()` — Measures section heights and distributes across A4 pages
- `renderSortableSections()` — Editor sidebar section list with drag handles
- `saveStateToLocalStorage()` / `saveStateToLocalStorageDebounced()` — Persistence
- `updateZoom()` — Fit-to-screen or manual zoom for preview

### Common Patterns
- All state mutations trigger `saveStateToLocalStorage()` then `renderPreview()`
- Editor forms use `oninput` handlers that call `window.updateSubitem()`
- Preview elements use `contenteditable="true"` with `data-path` for two-way binding
- Collapsible cards tracked in `collapsedCards` object by item ID

### CSS Organization
- `:root` variables for UI chrome colors (dark theme editor)
- `.resume-page` variables for resume theme colors (separate per theme class)
- `.resume-container` holds multiple `.resume-page` elements with flexbox column layout
- Template-specific styles prefixed with `.template-modern`, `.template-elegant`, `.template-sidebar`
- Print styles in `@media print` block with proper page-break support
- `.resume-continuation-header` for pages after the first (name + page number)

## Language

The UI is in Chinese (Simplified). Default resume content is in Chinese. Section labels: 自我评价, 工作经历, 项目经验, 教育背景, 专业技能.
