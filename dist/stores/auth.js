var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthService } from '../lib/auth-service';
export const useAuth = create((set, get) => ({
    user: null,
    subscription: null,
    loading: true,
    initialized: false,
    loadUser: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            set({ loading: true });
            // Vérifier si l'utilisateur est connecté
            const { user: authUser } = yield AuthService.getCurrentUser();
            if (!authUser) {
                set({ user: null, subscription: null, loading: false, initialized: true });
                return;
            }
            // Récupérer le profil complet et l'abonnement
            const { data: profile, error: profileError } = yield supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();
            if (profileError)
                throw profileError;
            // Récupérer l'abonnement
            const { data: subscription, error: subscriptionError } = yield supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', authUser.id)
                .single();
            if (subscriptionError && subscriptionError.code !== 'PGRST116') {
                // PGRST116 = not found, ce qui est normal si l'utilisateur n'a pas d'abonnement
                throw subscriptionError;
            }
            set({
                user: profile,
                subscription: subscription || null,
                loading: false,
                initialized: true
            });
        }
        catch (error) {
            console.error('Error loading user:', error);
            set({ loading: false, initialized: true });
        }
    }),
    signIn: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, error } = yield AuthService.signIn(email, password);
            if (error)
                return { error: error.message };
            if (!user)
                return { error: 'Une erreur est survenue lors de la connexion' };
            yield get().loadUser();
            return { error: null };
        }
        catch (error) {
            console.error('Error signing in:', error);
            return { error: error.message || 'Une erreur est survenue lors de la connexion' };
        }
    }),
    signUp: (email, password, fullName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, error } = yield AuthService.signUp(email, password, fullName);
            if (error)
                return { error: error.message };
            if (!user)
                return { error: 'Une erreur est survenue lors de l\'inscription' };
            return { error: null };
        }
        catch (error) {
            console.error('Error signing up:', error);
            return { error: error.message || 'Une erreur est survenue lors de l\'inscription' };
        }
    }),
    signOut: () => __awaiter(void 0, void 0, void 0, function* () {
        const { error } = yield AuthService.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        set({ user: null, subscription: null });
    }),
    updateProfile: (profile) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { error } = yield supabase
                .from('profiles')
                .update(profile)
                .eq('id', (_a = get().user) === null || _a === void 0 ? void 0 : _a.id);
            if (error)
                throw error;
            // Recharger les informations de l'utilisateur
            yield get().loadUser();
            return { error: null };
        }
        catch (error) {
            console.error('Error updating profile:', error);
            return { error: error.message || 'Une erreur est survenue lors de la mise à jour du profil' };
        }
    })
}));
