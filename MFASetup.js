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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MFASetup = MFASetup;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const supabase_1 = require("../lib/supabase");
const monitoring_1 = require("../lib/monitoring");
const qrcode_1 = __importDefault(require("qrcode"));
function MFASetup({ onComplete, onCancel }) {
    const [step, setStep] = (0, react_1.useState)('select');
    const [qrCode, setQrCode] = (0, react_1.useState)('');
    const [secret, setSecret] = (0, react_1.useState)('');
    const [verificationCode, setVerificationCode] = (0, react_1.useState)('');
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const setupTOTP = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase_1.supabase.auth.mfa.enroll({
                factorType: 'totp',
            });
            if (error)
                throw error;
            const qr = yield qrcode_1.default.toDataURL(data.totp.qr_code);
            setQrCode(qr);
            setSecret(data.totp.secret);
            setStep('totp');
            (0, monitoring_1.trackEvent)('auth.mfa.totp.setup_started');
        }
        catch (error) {
            (0, monitoring_1.trackError)(error, { context: 'auth.mfa.totp.setup' });
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
            const { error } = yield supabase_1.supabase.auth.mfa.verify({
                factorId: 'totp',
                code: verificationCode,
            });
            if (error)
                throw error;
            (0, monitoring_1.trackEvent)('auth.mfa.totp.setup_completed');
            onComplete();
        }
        catch (error) {
            (0, monitoring_1.trackError)(error, { context: 'auth.mfa.totp.verify' });
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
            const { error } = yield supabase_1.supabase.auth.mfa.enroll({
                factorType: 'sms',
                phoneNumber,
            });
            if (error)
                throw error;
            setStep('sms');
            (0, monitoring_1.trackEvent)('auth.mfa.sms.setup_started');
        }
        catch (error) {
            (0, monitoring_1.trackError)(error, { context: 'auth.mfa.sms.setup' });
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
            const { error } = yield supabase_1.supabase.auth.mfa.verify({
                factorId: 'sms',
                code: verificationCode,
            });
            if (error)
                throw error;
            (0, monitoring_1.trackEvent)('auth.mfa.sms.setup_completed');
            onComplete();
        }
        catch (error) {
            (0, monitoring_1.trackError)(error, { context: 'auth.mfa.sms.verify' });
            setError('Code de vérification incorrect');
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [step === 'select' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Choisissez une m\u00E9thode d'authentification \u00E0 deux facteurs" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: setupTOTP, disabled: loading, className: "p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: "Application d'authentification" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-1", children: "Utilisez une application comme Google Authenticator" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setStep('sms'), disabled: loading, className: "p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: "SMS" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-1", children: "Recevez un code par SMS" })] })] })] })), step === 'totp' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Configuration de l'application d'authentification" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "1. Scannez ce QR code avec votre application d'authentification" }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center", children: (0, jsx_runtime_1.jsx)("img", { src: qrCode, alt: "QR Code", className: "w-48 h-48" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "2. Si vous ne pouvez pas scanner le QR code, entrez ce code manuellement :" }), (0, jsx_runtime_1.jsx)("pre", { className: "bg-white/5 p-4 rounded-lg text-white font-mono text-sm", children: secret }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "3. Entrez le code g\u00E9n\u00E9r\u00E9 par votre application :" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), placeholder: "000000", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), error && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, disabled: loading, className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { onClick: verifyTOTP, disabled: loading || !verificationCode, className: "btn-primary", children: loading ? 'Vérification...' : 'Vérifier' })] })] })), step === 'sms' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Configuration de l'authentification par SMS" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Entrez votre num\u00E9ro de t\u00E9l\u00E9phone pour recevoir les codes de v\u00E9rification" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), placeholder: "+33612345678", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), verificationCode && ((0, jsx_runtime_1.jsx)("input", { type: "text", value: verificationCode, onChange: (e) => setVerificationCode(e.target.value), placeholder: "Code de v\u00E9rification", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }))] }), error && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm", children: error })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, disabled: loading, className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { onClick: verificationCode ? verifySMS : setupSMS, disabled: loading || !phoneNumber, className: "btn-primary", children: loading ? 'Vérification...' : verificationCode ? 'Vérifier' : 'Envoyer le code' })] })] }))] }));
}
