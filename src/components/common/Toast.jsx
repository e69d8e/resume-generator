import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useResume } from '../../context/ResumeContext.jsx';

export default function ToastContainer() {
  const { toasts } = useResume();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div id="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle;
        if (toast.type === 'error') Icon = AlertTriangle;
        else if (toast.type === 'info') Icon = Info;

        return (
          <div key={toast.id} className={`toast toast-${toast.type} show`}>
            <Icon className="toast-icon" size={16} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
