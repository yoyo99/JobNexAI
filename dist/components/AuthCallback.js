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
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
export function AuthCallback() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleAuthCallback = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Traiter le callback d'authentification
                const { data, error } = yield supabase.auth.getSession();
                if (error) {
                    throw error;
                }
                if (data.session) {
                    // Rediriger vers le dashboard
                    navigate('/dashboard');
                }
                else {
                    // Si pas de session, rediriger vers la page de connexion
                    navigate('/login');
                }
            }
            catch (error) {
                console.error('Error handling auth callback:', error);
                setError(error.message || 'Une erreur est survenue lors de l\'authentification');
            }
        });
        handleAuthCallback();
    }, [navigate]);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-md w-full space-y-8 text-center", children: error ? (_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Erreur d'authentification" }), _jsx("p", { className: "mt-2 text-center text-sm text-red-400", children: error }), _jsx("div", { className: "mt-6", children: _jsx("button", { onClick: () => navigate('/login'), className: "btn-primary", children: "Retour \u00E0 la connexion" }) })] })) : (_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Authentification en cours..." }), _jsx("div", { className: "mt-6 flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400" }) })] })) }) }));
}
