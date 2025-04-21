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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { trackError, trackEvent } from '../lib/monitoring';
import QRCode from 'qrcode';
export function MFASetup({ onComplete, onCancel }) {
    const [step, setStep] = useState('select');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const setupTOTP = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase.auth.mfa.enroll({
                factorType: 'totp',
            });
            if (error)
                throw error;
            const qr = yield QRCode.toDataURL(data.totp.qr_code);
            setQrCode(qr);
            setSecret(data.totp.secret);
            setStep('totp');
            trackEvent('auth.mfa.totp.setup_started');
        }
        catch (error) {
            trackError(error, { context: 'auth.mfa.totp.setup' });
            setError('Erreur lors de la configuration de l\'authentification à deux facteurs');
        }
        finally {
            setLoading(false);
        }
    });
    const verifyTOTP = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { error } = yield supabase.auth.mfa.verify({
                factorId: 'totp',
                code: verificationCode,
            });
            if (error)
                throw error;
            trackEvent('auth.mfa.totp.setup_completed');
            onComplete();
        }
        catch (error) {
            trackError(error, { context: 'auth.mfa.totp.verify' });
            setError('Code de vérification incorrect');
        }
        finally {
            setLoading(false);
        }
    });
    const setupSMS = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { error } = yield supabase.auth.mfa.enroll({
                factorType: 'sms',
                phoneNumber,
            });
            if (error)
                throw error;
            setStep('sms');
            trackEvent('auth.mfa.sms.setup_started');
        }
        catch (error) {
            trackError(error, { context: 'auth.mfa.sms.setup' });
            setError('Erreur lors de la configuration de l\'authentification par SMS');
        }
        finally {
            setLoading(false);
        }
    });
    const verifySMS = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { error } = yield supabase.auth.mfa.verify({
                factorId: 'sms',
                code: verificationCode,
            });
            if (error)
                throw error;
            trackEvent('auth.mfa.sms.setup_completed');
            onComplete();
        }
        catch (error) {
            trackError(error, { context: 'auth.mfa.sms.verify' });
            setError('Code de vérification incorrect');
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs("div", { className: "space-y-6", children: [step === 'select' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Choisissez une m\u00E9thode d'authentification \u00E0 deux facteurs" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("button", { onClick: setupTOTP, disabled: loading, className: "p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left", children: [_jsx("h3", { className: "text-white font-medium", children: "Application d'authentification" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Utilisez une application comme Google Authenticator" })] }), _jsxs("button", { onClick: () => setStep('sms'), disabled: loading, className: "p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left", children: [_jsx("h3", { className: "text-white font-medium", children: "SMS" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Recevez un code par SMS" })] })] })] })), step === 'totp' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Configuration de l'application d'authentification" }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-400", children: "1. Scannez ce QR code avec votre application d'authentification" }), _jsx("div", { className: "flex justify-center", children: _jsx("img", { src: qrCode, alt: "QR Code", className: "w-48 h-48" }) }), _jsx("p", { className: "text-gray-400", children: "2. Si vous ne pouvez pas scanner le QR code, entrez ce code manuellement :" }), _jsx("pre", { className: "bg-white/5 p-4 rounded-lg text-white font-mono text-sm", children: secret }), _jsx("p", { className: "text-gray-400", children: "3. Entrez le code g\u00E9n\u00E9r\u00E9 par votre application :" }), _jsx("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), placeholder: "000000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), error && (_jsx("p", { className: "text-red-400 text-sm", children: error })), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { onClick: onCancel, disabled: loading, className: "btn-secondary", children: "Annuler" }), _jsx("button", { onClick: verifyTOTP, disabled: loading || !verificationCode, className: "btn-primary", children: loading ? 'Vérification...' : 'Vérifier' })] })] })), step === 'sms' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Configuration de l'authentification par SMS" }), _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-gray-400", children: "Entrez votre num\u00E9ro de t\u00E9l\u00E9phone pour recevoir les codes de v\u00E9rification" }), _jsx("input", { type: "tel", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), placeholder: "+33612345678", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), verificationCode && (_jsx("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), placeholder: "Code de v\u00E9rification", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }))] }), error && (_jsx("p", { className: "text-red-400 text-sm", children: error })), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { onClick: onCancel, disabled: loading, className: "btn-secondary", children: "Annuler" }), _jsx("button", { onClick: verificationCode ? verifySMS : setupSMS, disabled: loading || !phoneNumber, className: "btn-primary", children: loading ? 'Vérification...' : verificationCode ? 'Vérifier' : 'Envoyer le code' })] })] }))] }));
}
