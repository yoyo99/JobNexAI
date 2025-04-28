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
import { trackError } from './monitoring';
export function requestNotificationPermission() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!('Notification' in window)) {
                console.warn('Ce navigateur ne supporte pas les notifications');
                return false;
            }
            const permission = yield Notification.requestPermission();
            return permission === 'granted';
        }
        catch (error) {
            trackError(error, { context: 'notifications.permission' });
            return false;
        }
    });
}
export function subscribeToNotifications(userId) {
    const channel = supabase
        .channel(`notifications:${userId}`)
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
    }, (payload) => {
        const notification = payload.new;
        // Notification système
        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.content,
                icon: '/logo.png',
                tag: notification.id,
                data: {
                    url: notification.link,
                },
            });
        }
        // Notification sonore
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {
            // Ignorer les erreurs de lecture audio
        });
        // Mise à jour du badge
        if ('setAppBadge' in navigator) {
            navigator.setAppBadge(1).catch(() => {
                // Ignorer les erreurs de badge
            });
        }
    })
        .subscribe();
    return () => {
        supabase.removeChannel(channel);
    };
}
export function markNotificationAsRead(notificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);
            if (error)
                throw error;
            // Mettre à jour le badge
            if ('clearAppBadge' in navigator) {
                navigator.clearAppBadge().catch(() => {
                    // Ignorer les erreurs de badge
                });
            }
        }
        catch (error) {
            trackError(error, { context: 'notifications.markAsRead' });
            throw error;
        }
    });
}
export function markAllNotificationsAsRead(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', userId)
                .eq('read', false);
            if (error)
                throw error;
            // Mettre à jour le badge
            if ('clearAppBadge' in navigator) {
                navigator.clearAppBadge().catch(() => {
                    // Ignorer les erreurs de badge
                });
            }
        }
        catch (error) {
            trackError(error, { context: 'notifications.markAllAsRead' });
            throw error;
        }
    });
}
