import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// 模块级互斥：两个"导出 PDF"按钮同屏可见，防止并发导出时互相改写
// transform/contenteditable 导致对方截图被污染
let isExporting = false;

export async function exportToPDF(resumeContainerEl, resumeName = 'resume') {
  if (!resumeContainerEl || isExporting) return false;
  isExporting = true;

  const originalTransform = resumeContainerEl.style.transform;
  resumeContainerEl.style.transform = 'none';

  const editables = resumeContainerEl.querySelectorAll('[contenteditable="true"]');
  editables.forEach(el => {
    el.setAttribute('contenteditable', 'false');
  });

  try {
    await new Promise(r => setTimeout(r, 150));

    const pages = resumeContainerEl.querySelectorAll('.resume-page');
    if (!pages || pages.length === 0) return false;

    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const now = new Date();
    const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const safeName = (resumeName || 'resume').replace(/[\\/:*?"<>|]/g, '_').trim() || 'resume';
    pdf.save(`${safeName}_${dateStr}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  } finally {
    editables.forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });
    resumeContainerEl.style.transform = originalTransform;
    isExporting = false;
  }
}
