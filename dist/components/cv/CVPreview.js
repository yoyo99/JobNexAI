var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
export function CVPreview({ templateId }) {
    const { user } = useAuth();
    const [cv, setCV] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    useEffect(() => {
        loadCV();
    }, [templateId]);
    const loadCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('user_cvs')
                .select(`
          *,
          template:cv_templates(*)
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('template_id', templateId)
                .single();
            if (error)
                throw error;
            setCV(data);
        }
        catch (error) {
            console.error('Error loading CV:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const downloadPDF = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setDownloading(true);
            const response = yield fetch('/api/generate-cv-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cv_id: cv.id }),
            });
            const blob = yield response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cv.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Error downloading PDF:', error);
        }
        finally {
            setDownloading(false);
        }
    });
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "w-1/2 bg-background p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Aper\u00E7u" }), _jsxs("button", { onClick: downloadPDF, disabled: downloading, className: "btn-primary flex items-center gap-2", children: [_jsx(DocumentArrowDownIcon, { className: "h-5 w-5" }), downloading ? 'Téléchargement...' : 'Télécharger PDF'] })] }), _jsx("div", { className: "bg-white rounded-lg shadow-xl p-8" })] }));
}
