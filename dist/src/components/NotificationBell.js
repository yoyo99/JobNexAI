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
import { Fragment, useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            loadNotifications();
            // Souscrire aux nouvelles notifications
            const channel = supabase
                .channel('notifications')
                .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`,
            }, (payload) => {
                const newNotification = payload.new;
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
                .subscribe();
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);
    const loadNotifications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data } = yield supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        }
        catch (error) {
            console.error('Error loading notifications:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const markAsRead = (notificationId) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);
            setNotifications(prev => prev.map(n => n.id === notificationId ? Object.assign(Object.assign({}, n), { read: true }) : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
    const markAllAsRead = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('read', false);
            setNotifications(prev => prev.map(n => (Object.assign(Object.assign({}, n), { read: true }))));
            setUnreadCount(0);
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    });
    if (loading || !user)
        return null;
    return (_jsxs(Menu, { as: "div", className: "relative", children: [_jsxs(Menu.Button, { className: "relative rounded-full p-1 text-gray-400 hover:text-gray-300", children: [_jsx(BellIcon, { className: "h-6 w-6" }), unreadCount > 0 && (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white", children: unreadCount }))] }), _jsx(Transition, { as: Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: _jsx(Menu.Items, { className: "absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-lg bg-background shadow-lg ring-1 ring-white/10 focus:outline-none", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Notifications" }), unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-sm text-primary-400 hover:text-primary-300", children: "Tout marquer comme lu" }))] }), _jsx("div", { className: "space-y-4", children: notifications.length === 0 ? (_jsx("p", { className: "text-center text-gray-400 py-4", children: "Aucune notification" })) : (notifications.map((notification) => (_jsxs("div", { className: `p-3 rounded-lg transition-colors ${notification.read
                                        ? 'bg-white/5'
                                        : 'bg-primary-600/20 hover:bg-primary-600/30'}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-white", children: notification.title }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: notification.content }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: format(new Date(notification.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr }) })] }), !notification.read && (_jsx("button", { onClick: () => markAsRead(notification.id), className: "shrink-0 text-xs text-primary-400 hover:text-primary-300", children: "Marquer comme lu" }))] }), notification.link && (_jsx("a", { href: notification.link, target: "_blank", rel: "noopener noreferrer", className: "block text-sm text-primary-400 hover:text-primary-300 mt-2", children: "Voir les d\u00E9tails \u2192" }))] }, notification.id)))) })] }) }) })] }));
}
