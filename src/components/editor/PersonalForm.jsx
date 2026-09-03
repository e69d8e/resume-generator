import React, { useRef, useState } from 'react';
import { User, ChevronDown, Camera, X, Crop } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';
import { AVATAR_SHAPES } from '../../constants/defaultState.js';

export default function PersonalForm() {
  const { state, updatePersonal, openCropModal } = useResume();
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = useRef(null);
  const p = state.personal || {};
  const currentShape = p.avatarShape || 'circle';

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      openCropModal(event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    updatePersonal('avatar', '');
  };

  const handleReCrop = (e) => {
    e.stopPropagation();
    if (p.avatar) {
      openCropModal(p.avatar);
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <section className={`control-card form-section ${collapsed ? 'collapsed' : ''}`} data-section-id="personal">
      <div className="section-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="header-title">
          <User size={18} />
          <h2>基本信息 (Personal Info)</h2>
        </div>
        <ChevronDown className="toggle-icon" size={18} />
      </div>

      <div className="section-content">
        <div className="form-grid">
          <div className="input-group full-width">
            <label htmlFor="info-name">姓名</label>
            <input
              type="text"
              id="info-name"
              placeholder="张三"
              value={p.name || ''}
              onChange={(e) => updatePersonal('name', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-title">意向岗位 / 职业头衔</label>
            <input
              type="text"
              id="info-title"
              placeholder="前端开发工程师"
              value={p.title || ''}
              onChange={(e) => updatePersonal('title', e.target.value)}
            />
          </div>

          <div className="input-group full-width">
            <div className="avatar-header-row">
              <label>照片 / 头像</label>
              <div className="avatar-shape-pills">
                {AVATAR_SHAPES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`shape-pill-btn ${currentShape === s.id ? 'active' : ''}`}
                    onClick={() => updatePersonal('avatarShape', s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="avatar-controls-wrapper">
              <div
                className={`avatar-upload-area shape-${currentShape}`}
                onClick={() => fileInputRef.current?.click()}
                title="点击上传新照片或更换头像"
              >
                {p.avatar ? (
                  <>
                    <img id="avatar-preview-img" className="avatar-preview-img" src={p.avatar} alt="Avatar preview" />
                    <button
                      className="avatar-remove-btn"
                      id="avatar-remove-btn"
                      title="移除头像"
                      style={{ display: 'flex' }}
                      onClick={handleRemoveAvatar}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="avatar-upload-placeholder">
                    <Camera size={20} />
                    <span>点击上传照片</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarFile}
                />
              </div>

              {p.avatar && (
                <div className="avatar-action-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleReCrop}
                  >
                    <Crop size={14} />
                    <span>重新裁切</span>
                  </button>
                </div>
              )}
            </div>

            <div className="avatar-url-fallback">
              <input
                type="text"
                id="info-avatar"
                placeholder="或粘贴图片网络链接 https://..."
                value={p.avatar || ''}
                onChange={(e) => updatePersonal('avatar', e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="info-email">电子邮箱</label>
            <input
              type="email"
              id="info-email"
              placeholder="zhangsan@example.com"
              value={p.email || ''}
              onChange={(e) => updatePersonal('email', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-phone">联系电话</label>
            <input
              type="tel"
              id="info-phone"
              placeholder="138-0000-0000"
              value={p.phone || ''}
              onChange={(e) => updatePersonal('phone', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-location">所在城市</label>
            <input
              type="text"
              id="info-location"
              placeholder="北京"
              value={p.location || ''}
              onChange={(e) => updatePersonal('location', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-website">个人网站</label>
            <input
              type="url"
              id="info-website"
              placeholder="https://zhangsan.dev"
              value={p.website || ''}
              onChange={(e) => updatePersonal('website', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-github">GitHub</label>
            <input
              type="text"
              id="info-github"
              placeholder="github.com/zhangsan"
              value={p.github || ''}
              onChange={(e) => updatePersonal('github', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-linkedin">LinkedIn</label>
            <input
              type="text"
              id="info-linkedin"
              placeholder="linkedin.com/in/zhangsan"
              value={p.linkedin || ''}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-age">年龄</label>
            <input
              type="text"
              id="info-age"
              placeholder="例如：28岁"
              value={p.age || ''}
              onChange={(e) => updatePersonal('age', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-gender">性别</label>
            <input
              type="text"
              id="info-gender"
              placeholder="例如：男"
              value={p.gender || ''}
              onChange={(e) => updatePersonal('gender', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="info-arrivalTime">到岗时间</label>
            <input
              type="text"
              id="info-arrivalTime"
              placeholder="例如：随时到岗"
              value={p.arrivalTime || ''}
              onChange={(e) => updatePersonal('arrivalTime', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
