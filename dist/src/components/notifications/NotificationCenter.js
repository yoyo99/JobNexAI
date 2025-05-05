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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BellIcon, CheckIcon, XMarkIcon, } from '@heroicons/react/24/outline';
export function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (user) {
            loadNotifications();
            const unsubscribe = subscribeToNotifications();
            return () => {
                if (unsubscribe)
                    unsubscribe();
            };
        }
    }, [user]);
    const loadNotifications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('created_at', { ascending: false })
                .limit(20);
            if (error)
                throw error;
            setNotifications(data || []);
            setUnreadCount((data === null || data === void 0 ? void 0 : data.filter(n => !n.read).length) || 0);
        }
        catch (err) {
            setError('Erreur lors du chargement des notifications.');
            console.error('Error loading notifications:', err);
        }
        finally {
            setLoading(false);
        }
    });
    const subscribeToNotifications = () => {
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user === null || user === void 0 ? void 0 : user.id}`,
        }, (payload) => {
            const newNotification = payload.new;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Show browser notification
            if (window.Notification && Notification.permission === 'granted') {
                new Notification(newNotification.title, {
                    body: newNotification.content,
                    icon: '/logo.png',
                });
            }
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    };
    const markAsRead = (notificationId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);
            if (error)
                throw error;
            setNotifications(prev => prev.map(n => n.id === notificationId ? Object.assign(Object.assign({}, n), { read: true }) : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
    const markAllAsRead = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('read', false);
            if (error)
                throw error;
            setNotifications(prev => prev.map(n => (Object.assign(Object.assign({}, n), { read: true }))));
            setUnreadCount(0);
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    });
    const deleteNotification = (notificationId) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { error } = yield supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);
            if (error)
                throw error;
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (!((_a = notifications.find(n => n.id === notificationId)) === null || _a === void 0 ? void 0 : _a.read)) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        }
        catch (error) {
            console.error('Error deleting notification:', error);
        }
    });
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "relative p-2 text-gray-400 hover:text-white transition-colors", children: [_jsx(BellIcon, { className: "h-6 w-6" }), unreadCount > 0 && (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white", children: unreadCount }))] }), _jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "absolute right-0 mt-2 w-96 bg-background rounded-lg shadow-xl border border-white/10 overflow-hidden", children: [_jsx("div", { className: "p-4 border-b border-white/10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Notifications" }), unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-sm text-primary-400 hover:text-primary-300", children: "Tout marquer comme lu" }))] }) }), loading && (_jsx("div", { className: "p-4 text-center text-gray-400", children: "Chargement des notifications\u2026" })), error && (_jsx("div", { className: "p-4 text-center text-red-400", children: error })), _jsxs("div", { className: "max-h-[480px] overflow-y-auto", children: [!loading && !error && notifications.length === 0 ? (_jsx("div", { className: "p-4 text-center text-gray-400", children: "Aucune notification" })) : null, !loading && !error && notifications.length > 0 && (_jsx("div", { children: notifications.map((notification) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `p-4 border-b border-white/10 ${notification.read ? 'bg-white/5' : 'bg-primary-600/20'}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-white", children: notification.title }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: notification.content }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: format(new Date(notification.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr }) }), notification.link && (_jsx("a", { href: notification.link, className: "text-sm text-primary-400 hover:text-primary-300 mt-2 inline-block", children: "Voir les d\u00E9tails \u2192" }))] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [!notification.read && (_jsx("button", { onClick: () => markAsRead(notification.id), className: "p-1 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors", children: _jsx(CheckIcon, { className: "h-4 w-4" }) })), _jsx("button", { onClick: () => deleteNotification(notification.id), className: "p-1 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors", children: _jsx(XMarkIcon, { className: "h-4 w-4" }) })] })] }) }, notification.id))) }))] })] })) })] }));
}
