var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';
export function AuthProvider({ children }) {
    const { loadUser } = useAuth();
    useEffect(() => {
        // Charger l'utilisateur au démarrage
        loadUser();
        // Configurer les écouteurs d'événements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => __awaiter(this, void 0, void 0, function* () {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                yield loadUser();
            }
            else if (event === 'SIGNED_OUT') {
                // L'utilisateur est déjà déconnecté dans le store via signOut()
            }
        }));
        // Écouteur d'événement storage pour synchroniser la session sur tous les onglets
        const handleStorage = () => {
            loadUser();
        };
        window.addEventListener('storage', handleStorage);
        // Nettoyer l'abonnement et l'écouteur
        return () => {
            subscription.unsubscribe();
            window.removeEventListener('storage', handleStorage);
        };
    }, [loadUser]);
    return _jsx(_Fragment, { children: children });
}
