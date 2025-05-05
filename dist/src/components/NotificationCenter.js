var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { subscribeToNotifications, requestNotificationPermission, markNotificationAsRead, markAllNotificationsAsRead, } from '../lib/notifications';
export function NotificationCenter() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (user) {
            requestNotificationPermission();
            const unsubscribe = subscribeToNotifications(user.id);
            return () => unsubscribe();
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
            if (error) {
                setError("Impossible de charger les notifications. Veuillez réessayer.");
            }
            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        }
        catch (error) {
            console.error('Error loading notifications:', error);
            setError("Impossible de charger les notifications. Veuillez réessayer.");
        }
        finally {
            setLoading(false);
        }
    });
    const markAsRead = (notificationId) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield markNotificationAsRead(notificationId);
            setNotifications(prev => prev.map(n => n.id === notificationId ? Object.assign(Object.assign({}, n), { read: true }) : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
    const markAllAsRead = () => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            yield markAllNotificationsAsRead(user.id);
            setNotifications(prev => prev.map(n => (Object.assign(Object.assign({}, n), { read: true }))));
            setUnreadCount(0);
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    });
    if (loading || !user)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setIsOpen(true), className: "relative rounded-full p-1 text-gray-400 hover:text-gray-300", children: [_jsx(BellIcon, { className: "h-6 w-6" }), unreadCount > 0 && (_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white", children: unreadCount }))] }), _jsx(Transition, { appear: true, show: isOpen, as: Fragment, children: _jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => setIsOpen(false), children: [_jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsx("div", { className: "fixed inset-0 bg-black/75" }) }), _jsx("div", { className: "fixed inset-0 overflow-y-auto", children: _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsx(Transition.Child, { as: Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-background p-6 shadow-xl transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "Notifications" }), _jsxs("div", { className: "flex items-center gap-4", children: [unreadCount > 0 && (_jsx("button", { onClick: markAllAsRead, className: "text-sm text-primary-400 hover:text-primary-300", children: "Tout marquer comme lu" })), _jsx("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-white", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] })] }), _jsxs("div", { className: "space-y-4", children: [error && (_jsx("p", { className: "text-center text-red-500 py-4", children: error })), !error && notifications.length === 0 ? (_jsx("p", { className: "text-center text-gray-400 py-4", children: "Aucune notification" })) : !error && (notifications.map((notification) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `p-4 rounded-lg transition-colors ${notification.read
                                                            ? 'bg-white/5'
                                                            : 'bg-primary-600/20'}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-white", children: notification.title }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: notification.content }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: format(new Date(notification.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr }) })] }), !notification.read && (_jsx("button", { onClick: () => markAsRead(notification.id), className: "shrink-0 text-xs text-primary-400 hover:text-primary-300", children: "Marquer comme lu" }))] }), notification.link && (_jsx("a", { href: notification.link, target: "_blank", rel: "noopener noreferrer", className: "block text-sm text-primary-400 hover:text-primary-300 mt-2", children: "Voir les d\u00E9tails \u2192" }))] }, notification.id))))] })] }) }) }) })] }) })] }));
}
