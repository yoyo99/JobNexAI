var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { supabase } from './supabase';
import { trackError, trackEvent } from './monitoring';
export function signIn(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: { user }, error } = yield supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error)
                throw error;
            trackEvent('auth.signin.success', {
                userId: user === null || user === void 0 ? void 0 : user.id,
            });
            return { user, error: null };
        }
        catch (error) {
            const authError = error;
            trackError(new Error(authError.message), {
                context: 'auth.signin',
                email,
            });
            return {
                user: null,
                error: {
                    message: getErrorMessage(authError),
                    status: authError.status,
                },
            };
        }
    });
}
export function signUp(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Vérifier la force du mot de passe
            if (!isStrongPassword(password)) {
                throw new Error('Le mot de passe ne respecte pas les critères de sécurité');
            }
            const { data: { user }, error } = yield supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: email.split('@')[0],
                        trial_ends_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h trial
                    }
                },
            });
            if (error)
                throw error;
            // Créer l'abonnement d'essai
            if (user) {
                const { error: subscriptionError } = yield supabase
                    .from('subscriptions')
                    .insert({
                    user_id: user.id,
                    status: 'trialing',
                    plan: 'pro',
                    current_period_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });
                if (subscriptionError)
                    throw subscriptionError;
            }
            trackEvent('auth.signup.success', {
                userId: user === null || user === void 0 ? void 0 : user.id,
            });
            return { user, error: null };
        }
        catch (error) {
            const authError = error;
            trackError(new Error(authError.message), {
                context: 'auth.signup',
                email,
            });
            return {
                user: null,
                error: {
                    message: getErrorMessage(authError),
                    status: authError.status,
                },
            };
        }
    });
}
export function signOut() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase.auth.signOut();
            if (error)
                throw error;
            trackEvent('auth.signout.success');
            return { error: null };
        }
        catch (error) {
            const authError = error;
            trackError(new Error(authError.message), {
                context: 'auth.signout',
            });
            return {
                error: {
                    message: getErrorMessage(authError),
                    status: authError.status,
                },
            };
        }
    });
}
export function resetPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            if (error)
                throw error;
            trackEvent('auth.reset_password.requested', {
                email,
            });
            return { error: null };
        }
        catch (error) {
            const authError = error;
            trackError(new Error(authError.message), {
                context: 'auth.reset_password',
                email,
            });
            return {
                error: {
                    message: getErrorMessage(authError),
                    status: authError.status,
                },
            };
        }
    });
}
export function updatePassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Vérifier la force du mot de passe
            if (!isStrongPassword(password)) {
                throw new Error('Le mot de passe ne respecte pas les critères de sécurité');
            }
            const { error } = yield supabase.auth.updateUser({
                password,
            });
            if (error)
                throw error;
            trackEvent('auth.password.updated');
            return { error: null };
        }
        catch (error) {
            const authError = error;
            trackError(new Error(authError.message), {
                context: 'auth.update_password',
            });
            return {
                error: {
                    message: getErrorMessage(authError),
                    status: authError.status,
                },
            };
        }
    });
}
function isStrongPassword(password) {
    const minLength = 9;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChars);
}
function getErrorMessage(error) {
    switch (error.message) {
        case 'Invalid login credentials':
            return 'Email ou mot de passe incorrect';
        case 'Email not confirmed':
            return 'Veuillez confirmer votre adresse email';
        case 'Password should be at least 12 characters':
            return 'Le mot de passe doit contenir au moins 9 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
        case 'Email already registered':
            return 'Cette adresse email est déjà utilisée';
        case 'Too many requests':
            return 'Trop de tentatives de connexion. Veuillez réessayer plus tard';
        default:
            return 'Une erreur est survenue. Veuillez réessayer';
    }
}
