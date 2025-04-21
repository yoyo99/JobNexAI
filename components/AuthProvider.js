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
exports.AuthProvider = AuthProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
function AuthProvider({ children }) {
    const { loadUser } = (0, auth_1.useAuth)();
    (0, react_1.useEffect)(() => {
        // Charger l'utilisateur au démarrage
        loadUser();
        // Configurer les écouteurs d'événements d'authentification
        const { data: { subscription } } = supabase_1.supabase.auth.onAuthStateChange((event, session) => __awaiter(this, void 0, void 0, function* () {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                yield loadUser();
            }
            else if (event === 'SIGNED_OUT') {
                // L'utilisateur est déjà déconnecté dans le store via signOut()
            }
        }));
        // Nettoyer l'abonnement
        return () => {
            subscription.unsubscribe();
        };
    }, [loadUser]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
