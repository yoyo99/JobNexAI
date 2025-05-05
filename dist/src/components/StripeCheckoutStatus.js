var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StripeService } from '../lib/stripe-service';
import { useAuth } from '../stores/auth';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
function StripeCheckoutStatus() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { loadUser } = useAuth();
    useEffect(() => {
        const checkStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Get session_id from URL
                const params = new URLSearchParams(location.search);
                const sessionId = params.get('session_id');
                if (!sessionId) {
                    setStatus('error');
                    setMessage('Aucun identifiant de session trouvé');
                    return;
                }
                // Check session status
                const { success, data, error } = yield StripeService.checkSessionStatus(sessionId);
                if (!success || error) {
                    setStatus('error');
                    setMessage(error || 'Une erreur est survenue lors de la vérification du paiement');
                    return;
                }
                // Reload user data to get updated subscription
                yield loadUser();
                // Set success status
                setStatus('success');
                setMessage('Votre abonnement a été activé avec succès');
                // Navigate to dashboard after a delay (React Router v6 migration)
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
            catch (error) {
                setStatus('error');
                setMessage(error.message || 'Une erreur est survenue lors de la vérification du paiement');
            }
        });
        checkStatus();
    }, [location, navigate, loadUser]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card max-w-md w-full text-center p-8", children: [status === 'loading' && (_jsxs(_Fragment, { children: [_jsx(LoadingSpinner, { size: "lg", className: "mb-4" }), _jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "V\u00E9rification de votre paiement" }), _jsx("p", { className: "text-gray-400", children: "Veuillez patienter pendant que nous v\u00E9rifions votre paiement..." })] })), status === 'success' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx(CheckCircleIcon, { className: "h-16 w-16 text-green-500" }) }), _jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Paiement r\u00E9ussi" }), _jsx("p", { className: "text-gray-400 mb-6", children: message }), _jsx("p", { className: "text-sm text-gray-500", children: "Vous allez \u00EAtre redirig\u00E9 vers votre tableau de bord..." })] })), status === 'error' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx(XCircleIcon, { className: "h-16 w-16 text-red-500" }) }), _jsx("h2", { className: "text-xl font-bold text-white mb-4", children: "Erreur de paiement" }), _jsx("p", { className: "text-gray-400 mb-6", children: message }), _jsx("button", { onClick: () => navigate('/pricing'), className: "btn-primary w-full", children: "Retour aux tarifs" })] }))] }) }));
}
export default StripeCheckoutStatus;
