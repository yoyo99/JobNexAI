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
exports.PrivacyConsent = PrivacyConsent;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
function PrivacyConsent() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { user } = (0, auth_1.useAuth)();
    const [showConsent, setShowConsent] = (0, react_1.useState)(false);
    const [consented, setConsented] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        checkConsent();
    }, [user]);
    const checkConsent = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!user)
            return;
        const { data } = yield supabase_1.supabase
            .from('user_preferences')
            .select('gdpr_consent')
            .eq('user_id', user.id)
            .maybeSingle();
        setShowConsent(!((_a = data === null || data === void 0 ? void 0 : data.gdpr_consent) !== null && _a !== void 0 ? _a : false));
    });
    const handleConsent = (accepted) => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            yield supabase_1.supabase
                .from('user_preferences')
                .upsert({
                user_id: user.id,
                gdpr_consent: accepted,
                gdpr_consent_date: new Date().toISOString(),
            });
            setConsented(accepted);
            setShowConsent(false);
        }
        catch (error) {
            console.error('Error saving consent:', error);
        }
    });
    if (!showConsent)
        return null;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, className: "fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg bg-primary-600 shadow-lg sm:p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between flex-wrap", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-0 flex-1 flex items-center", children: (0, jsx_runtime_1.jsxs)("p", { className: "ml-3 font-medium text-white truncate", children: [(0, jsx_runtime_1.jsx)("span", { className: "md:hidden", children: t('privacy.shortConsent') }), (0, jsx_runtime_1.jsx)("span", { className: "hidden md:inline", children: t('privacy.consent') })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleConsent(true), className: "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50", children: t('privacy.accept') }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleConsent(false), className: "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400", children: t('privacy.decline') })] }) })] }) }) }) }));
}
