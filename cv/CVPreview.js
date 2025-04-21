"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVPreview = CVPreview;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const outline_1 = require("@heroicons/react/24/outline");
function CVPreview({ templateId }) {
    const { user } = (0, auth_1.useAuth)();
    const [cv, setCV] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [downloading, setDownloading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadCV();
    }, [templateId]);
    const loadCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-1/2 bg-background p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Aper\u00E7u" }), (0, jsx_runtime_1.jsxs)("button", { onClick: downloadPDF, disabled: downloading, className: "btn-primary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.DocumentArrowDownIcon, { className: "h-5 w-5" }), downloading ? 'Téléchargement...' : 'Télécharger PDF'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-xl p-8" })] }));
}
