# Resumify — 高质感简历生成器

一个纯前端、零依赖的简历生成应用。左右分栏布局，左侧编辑器填写内容，右侧实时预览多页 A4 简历效果。无需构建工具、无需服务器，浏览器打开 `index.html` 即可使用。

## 功能特性

### 内容编辑
- **个人信息**：姓名、头衔、头像（支持裁剪上传）、邮箱、电话、地址、网站、GitHub、LinkedIn 等
- **自我评价**：自由文本描述
- **工作经历**：公司、职位、时间段、工作描述，支持增删与拖拽排序
- **项目经验**：项目名称、角色、技术栈、链接、描述，支持增删与拖拽排序
- **教育背景**：学校、学位、专业、时间段、描述，支持增删与拖拽排序
- **专业技能**：分类 + 标签，支持增删与拖拽排序

### 模板与主题
- **5 套简历模板**：Modern（双栏）、Elegant（居中古典）、Sidebar（商务侧栏）、Geek（极客风）、Minimal（极简内容优先）
- **10 种配色主题**：Navy、Emerald、Wine、Indigo、Dark、Amber、Slate、Sand、Olive、Rose
- **3 种字体方案**：无衬线（Inter）、衬线（Noto Serif SC）、等宽（JetBrains Mono）
- **3 种行距预设**：紧凑、正常、舒适
- **分栏控制**：双栏模板下可指定各区块显示在左栏或右栏
- **区块显隐**：独立控制每个区块的可见性

### 实时预览
- 编辑器与预览双向同步：表单修改实时更新预览，预览区直接编辑同步回表单
- 多页分页引擎：自动测量内容高度，智能分配到多个 A4 页面，不会在内容中间断页
- 续页页眉：第二页起自动显示姓名与页码
- 缩放控制：放大、缩小、手动输入百分比、自适应屏幕

### 数据管理
- 自动保存到 localStorage（防抖）
- 导出 / 导入 JSON 数据文件
- 客户端 PDF 导出（html2canvas + jsPDF）
- 打印友好样式，支持中文字体

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/e69d8e/resume-generator.git
cd resume-generator

# 直接用浏览器打开
open index.html        # macOS
# 或
xdg-open index.html   # Linux
# 或
start index.html      # Windows
```

无需安装任何依赖，无需运行任何命令。

## 项目结构

```
├── index.html          # 应用主页面
├── app.js              # 全部应用逻辑（状态管理、渲染、事件、分页）
├── styles.css          # 全部样式（UI、5 套模板、10 种主题、打印样式）
├── set_sidebar.html    # 工具页：设置 localStorage 为 Sidebar 模板后跳转
├── CLAUDE.md           # 开发文档与架构说明
└── README.md           # 本文件
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 结构 | HTML5 |
| 样式 | CSS3（自定义属性、主题系统、打印样式） |
| 逻辑 | Vanilla JavaScript（无框架） |
| 图标 | Lucide Icons（CDN） |
| PDF 导出 | html2canvas 1.4.1 + jsPDF 2.5.1 |
| 字体 | Google Fonts（Inter、Outfit、Noto Serif SC、JetBrains Mono） |

## 浏览器兼容

支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）。

## License

MIT
