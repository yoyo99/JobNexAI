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
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
export function PrivacyConsent() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showConsent, setShowConsent] = useState(false);
    const [consented, setConsented] = useState(false);
    useEffect(() => {
        checkConsent();
    }, [user]);
    const checkConsent = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!user)
            return;
        const { data } = yield supabase
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
            yield supabase
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
    return (_jsx(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, className: "fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8", children: _jsx("div", { className: "p-2 rounded-lg bg-primary-600 shadow-lg sm:p-3", children: _jsxs("div", { className: "flex items-center justify-between flex-wrap", children: [_jsx("div", { className: "w-0 flex-1 flex items-center", children: _jsxs("p", { className: "ml-3 font-medium text-white truncate", children: [_jsx("span", { className: "md:hidden", children: t('privacy.shortConsent') }), _jsx("span", { className: "hidden md:inline", children: t('privacy.consent') })] }) }), _jsx("div", { className: "mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto", children: _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => handleConsent(true), className: "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50", children: t('privacy.accept') }), _jsx("button", { onClick: () => handleConsent(false), className: "flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-400", children: t('privacy.decline') })] }) })] }) }) }) }));
}
