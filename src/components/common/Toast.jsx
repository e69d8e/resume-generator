import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useResumeUI } from '../../context/ResumeContext.jsx';
import { X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useResumeUI();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div id="toast-container" role="status" aria-live="polite">
      {toasts.map(toast => {
        let Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertTriangle;
        else if (toast.type === 'info') Icon = Info;

        return (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            <Icon className="toast-icon" size={16} />
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              aria-label="关闭提示"
              onClick={() => dismissToast(toast.id)}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
