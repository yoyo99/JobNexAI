import React, { useEffect, useState } from "react";
import './Toast.css';

export default function ToastContainer() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function onToast(event) {
      setToast({
        type: event.detail.type,
        message: event.detail.message,
      });
      setTimeout(() => setToast(null), 4000);
    }
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>{toast.message}</div>
  );
}
