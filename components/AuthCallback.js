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
exports.AuthCallback = AuthCallback;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("../lib/supabase");
function AuthCallback() {
    const [error, setError] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const handleAuthCallback = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Récupérer le hash de l'URL
                const hash = window.location.hash;
                // Traiter le callback d'authentification
                const { data, error } = yield supabase_1.supabase.auth.getSession();
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-md w-full space-y-8 text-center", children: error ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Erreur d'authentification" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-center text-sm text-red-400", children: error }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/login'), className: "btn-primary", children: "Retour \u00E0 la connexion" }) })] })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Authentification en cours..." }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 flex justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400" }) })] })) }) }));
}
