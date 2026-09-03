import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPDF(resumeContainerEl, resumeName = 'resume') {
  if (!resumeContainerEl) return false;

  const originalTransform = resumeContainerEl.style.transform;
  resumeContainerEl.style.transform = 'none';

  const editables = resumeContainerEl.querySelectorAll('[contenteditable="true"]');
  editables.forEach(el => {
    el.setAttribute('contenteditable', 'false');
    el.dataset.wasEditable = 'true';
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
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const now = new Date();
    const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    pdf.save(`${resumeName || 'resume'}_${dateStr}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  } finally {
    editables.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      delete el.dataset.wasEditable;
    });
    resumeContainerEl.style.transform = originalTransform;
  }
}
