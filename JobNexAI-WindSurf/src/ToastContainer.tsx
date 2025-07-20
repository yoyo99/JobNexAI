import React, { useEffect, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastEventDetail {
  type: ToastType;
  message: string;
}

interface Toast {
  type: ToastType;
  message: string;
}

const ToastContainer: React.FC = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    function onToast(event: CustomEvent<ToastEventDetail>) {
      setToast({
        type: event.detail.type,
        message: event.detail.message,
      });
      setTimeout(() => setToast(null), 4000);
    }
    window.addEventListener('toast', onToast as EventListener);
    return () => window.removeEventListener('toast', onToast as EventListener);
  }, []);

  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>{toast.message}</div>
  );
};

export default ToastContainer;
