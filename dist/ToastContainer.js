import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './Toast.css';
const ToastContainer = () => {
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
    if (!toast)
        return null;
    return (_jsx("div", { className: `toast toast-${toast.type}`, children: toast.message }));
};
export default ToastContainer;
