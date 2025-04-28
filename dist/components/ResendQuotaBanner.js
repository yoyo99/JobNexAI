import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useResendQuota } from '../hooks/useResendQuota';
export default function ResendQuotaBanner() {
    const { sent, limit, percent, loading, error } = useResendQuota();
    if (loading)
        return null;
    if (error)
        return (_jsxs("div", { style: { background: '#d90429', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6, margin: '1rem 0', textAlign: 'center' }, children: ["Erreur monitoring quota Resend: ", error] }));
    if (percent < 70)
        return null;
    return (_jsxs("div", { style: { background: percent < 90 ? '#f9c74f' : '#d90429', color: '#222', padding: '0.5rem 1rem', borderRadius: 6, margin: '1rem 0', textAlign: 'center', fontWeight: 'bold' }, children: ["Attention : ", sent, " emails envoy\u00E9s ce mois-ci sur ", limit, " (", percent, "%)", percent >= 90 && _jsx("span", { style: { color: '#fff', marginLeft: 8 }, children: "Limite presque atteinte !" })] }));
}
