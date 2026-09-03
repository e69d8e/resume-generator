import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeProvider } from '../src/context/ResumeContext.jsx';
import App from '../src/App.jsx';

function renderApp() {
  return render(
    <ResumeProvider>
      <App />
    </ResumeProvider>
  );
}

describe('React Application & UI Workflows', () => {
  it('should render main app with header, editor, preview and toolbar', () => {
    renderApp();

    expect(screen.getByText('Resumify')).toBeDefined();
    expect(screen.getByText('导入')).toBeDefined();
    expect(screen.getByText('保存数据')).toBeDefined();
    expect(screen.getAllByText('导出 PDF').length).toBeGreaterThanOrEqual(1);

    // Default mock data rendered in preview
    expect(screen.getByText('张三')).toBeDefined();
    expect(screen.getAllByText('资深项目经理 / 运营主管').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('自我评价')).toBeDefined();
  });

  it('should switch between "内容编辑" and "排版与板块" tabs', () => {
    renderApp();

    const layoutTabBtn = screen.getByText('排版与板块');
    fireEvent.click(layoutTabBtn);

    expect(screen.getByText('排版与主题定制')).toBeDefined();
    expect(screen.getByText('模块顺序与显示')).toBeDefined();

    const contentTabBtn = screen.getByText('内容编辑');
    fireEvent.click(contentTabBtn);

    expect(screen.getByText('基本信息 (Personal Info)')).toBeDefined();
  });

  it('should update preview name when typing in personal name input', () => {
    renderApp();

    const nameInput = screen.getByPlaceholderText('张三');
    fireEvent.change(nameInput, { target: { value: '李四' } });

    expect(nameInput.value).toBe('李四');
    expect(screen.getByText('李四')).toBeDefined();
  });

  it('should allow switching templates in layout tab', () => {
    renderApp();

    const layoutTabBtn = screen.getByText('排版与板块');
    fireEvent.click(layoutTabBtn);

    const elegantBtn = screen.getByText('优雅经典 (Elegant)');
    fireEvent.click(elegantBtn);

    expect(elegantBtn.closest('button').classList.contains('active')).toBe(true);
  });

  it('should switch avatar shapes between circle, square, and 3:4 rectangle', () => {
    renderApp();

    const squareBtn = screen.getByText('圆角方形 (1:1)');
    fireEvent.click(squareBtn);
    expect(squareBtn.classList.contains('active')).toBe(true);

    const rectBtn = screen.getByText('标准证件照 (3:4)');
    fireEvent.click(rectBtn);
    expect(rectBtn.classList.contains('active')).toBe(true);
  });
});
