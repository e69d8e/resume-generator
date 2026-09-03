export const DEFAULT_SECTION_COLUMNS = {
  summary: 'left',
  experience: 'left',
  projects: 'left',
  skills: 'right',
  education: 'right'
};

export const SPACING_MAP = {
  'spacing-compact': 16,
  'spacing-normal': 20,
  'spacing-comfortable': 26
};

export const SECTION_NAMES = {
  summary: '自我评价',
  experience: '工作经历',
  projects: '项目经验',
  education: '教育背景',
  skills: '专业技能'
};

export const CARD_TITLE_CONFIG = {
  experience: [['company', '新加入公司'], ' - ', ['role', '新职位']],
  education: [['institution', '新加入学校'], ' - ', ['degree', '学历'], ' ', ['major', '']],
  projects: [['name', '新项目名称'], ' - ', ['role', '担任角色']],
  skills: [['category', '新技能分类']]
};

export const FORM_CONFIGS = {
  experience: {
    title: '工作经历',
    icon: 'Briefcase',
    idPrefix: 'exp',
    newItem: { company: '', role: '', startDate: '', endDate: '', description: '' },
    fields: [
      { name: 'company', label: '公司名称', updateTitle: true },
      { name: 'role', label: '工作岗位', updateTitle: true },
      { name: 'startDate', label: '开始时间', placeholder: '例如：2020-03' },
      { name: 'endDate', label: '结束时间', placeholder: '例如：2023-05 或 至今' },
      { name: 'description', label: '工作描述 (支持换行，建议以列表形式描述)', type: 'textarea', rows: 5, placeholder: '1. 主导项目...\n2. 负责开发...', fullWidth: true }
    ]
  },
  education: {
    title: '教育背景',
    icon: 'GraduationCap',
    idPrefix: 'edu',
    newItem: { institution: '', degree: '', major: '', startDate: '', endDate: '', description: '' },
    fields: [
      { name: 'institution', label: '学校 / 机构名称', updateTitle: true },
      { name: 'degree', label: '学位 / 证书', placeholder: '例如：学士 / 硕士', updateTitle: true },
      { name: 'major', label: '专业 / 科系', placeholder: '例如：计算机科学', updateTitle: true },
      { name: 'startDate', label: '起止时间', placeholder: '例如：2016.09 - 2020.06' },
      { name: 'description', label: '教育背景描述 (选填)', type: 'textarea', rows: 3, placeholder: '专业绩点、主修课程、奖学金或在校荣誉等', fullWidth: true }
    ]
  },
  projects: {
    title: '项目经验',
    icon: 'FolderGit2',
    idPrefix: 'proj',
    newItem: { name: '', role: '', link: '', startDate: '', endDate: '', techStack: '', description: '' },
    fields: [
      { name: 'name', label: '项目名称', updateTitle: true },
      { name: 'role', label: '担任角色', placeholder: '例如：项目负责人 / 核心开发', updateTitle: true },
      { name: 'startDate', label: '开始时间', placeholder: '例如：2025-12' },
      { name: 'endDate', label: '结束时间', placeholder: '例如：2026-05 或 至今' },
      { name: 'techStack', label: '技术栈 (选填)', placeholder: '例如：Spring Boot, Redis, Vue3', fullWidth: true },
      { name: 'link', label: '项目链接 (选填)', placeholder: '例如：github.com/username/project', fullWidth: true },
      { name: 'description', label: '项目描述', type: 'textarea', rows: 4, placeholder: '描述该项目背景、您的职责、所用技术及项目成果', fullWidth: true }
    ]
  },
  skills: {
    title: '专业技能',
    icon: 'CheckCircle2',
    idPrefix: 'skill',
    newItem: { category: '', tags: '' },
    fields: [
      { name: 'category', label: '技能分类名称', placeholder: '例如：编程语言 / 办公软件', fullWidth: true, updateTitle: true },
      { name: 'tags', label: '具体技能标签 (英文逗号分隔)', placeholder: '例如：JavaScript, TypeScript, React', fullWidth: true }
    ]
  }
};

export const COLOR_PRESETS = [
  { id: 'theme-navy', name: '玄青蓝', color: '#1e293b', accent: '#486581' },
  { id: 'theme-emerald', name: '松石灰', color: '#1f3a38', accent: '#4a7c76' },
  { id: 'theme-wine', name: '栗壳棕', color: '#382f2d', accent: '#7c655b' },
  { id: 'theme-indigo', name: '灰霁蓝', color: '#1f2d3d', accent: '#576574' },
  { id: 'theme-dark', name: '暗夜黑', color: '#18181b', accent: '#52525b' },
  { id: 'theme-amber', name: '陶土褐', color: '#3d2b27', accent: '#8a6152' },
  { id: 'theme-slate', name: '烟青灰', color: '#262c36', accent: '#5c6b73' },
  { id: 'theme-sand', name: '暖麦杏', color: '#403531', accent: '#8c766b' },
  { id: 'theme-olive', name: '云杉绿', color: '#24332b', accent: '#526e5e' },
  { id: 'theme-rose', name: '干枯玫瑰', color: '#38262a', accent: '#855c65' }
];

export const TEMPLATES = [
  { id: 'modern', name: '现代专业 (Modern)', dotClass: 'modern-dot' },
  { id: 'elegant', name: '优雅经典 (Elegant)', dotClass: 'elegant-dot' },
  { id: 'sidebar', name: '商务侧栏 (Sidebar)', dotClass: 'sidebar-dot' },
  { id: 'geek', name: '极客技术 (Geek)', dotClass: 'geek-dot' },
  { id: 'minimal', name: '极简风格 (Minimal)', dotClass: 'minimal-dot' },
  { id: 'creative', name: '创意先锋 (Creative)', dotClass: 'creative-dot' },
  { id: 'compact', name: '精英商务 (Compact)', dotClass: 'compact-dot' }
];

export const FONTS = [
  { id: 'font-sans', name: '无衬线 (Inter / 微软雅黑)' },
  { id: 'font-serif', name: '衬线体 (Outfit / 宋体)' },
  { id: 'font-tech', name: '经典楷体 (STKaiti / 楷体)' }
];

export const SPACINGS = [
  { id: 'spacing-compact', name: '紧凑 (Compact)' },
  { id: 'spacing-normal', name: '适中 (Normal)' },
  { id: 'spacing-comfortable', name: '宽松 (Comfortable)' }
];

export const AVATAR_SHAPES = [
  { id: 'circle', name: '圆形 (1:1)', aspect: '1:1', radiusClass: 'shape-circle' },
  { id: 'square', name: '圆角方形 (1:1)', aspect: '1:1', radiusClass: 'shape-square' },
  { id: 'rect', name: '标准证件照 (3:4)', aspect: '3:4', radiusClass: 'shape-rect' }
];

export const DEFAULT_STATE = {
  personal: {
    name: '张三',
    title: '资深项目经理 / 运营主管',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    avatarShape: 'circle',
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
  sectionColumns: { ...DEFAULT_SECTION_COLUMNS },
  theme: 'theme-navy',
  font: 'font-sans',
  spacing: 'spacing-normal',
  template: 'modern'
};
