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
exports.NotificationCenter = NotificationCenter;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const framer_motion_1 = require("framer-motion");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const notifications_1 = require("../lib/notifications");
function NotificationCenter() {
    const { user } = (0, auth_1.useAuth)();
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [notifications, setNotifications] = (0, react_1.useState)([]);
    const [unreadCount, setUnreadCount] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (user) {
            (0, notifications_1.requestNotificationPermission)();
            const unsubscribe = (0, notifications_1.subscribeToNotifications)(user.id);
            return () => unsubscribe();
        }
    }, [user]);
    const loadNotifications = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data } = yield supabase_1.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('created_at', { ascending: false })
                .limit(20);
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
            yield (0, notifications_1.markNotificationAsRead)(notificationId);
            setNotifications(prev => prev.map(n => n.id === notificationId ? Object.assign(Object.assign({}, n), { read: true }) : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });
    const markAllAsRead = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, notifications_1.markAllNotificationsAsRead)(user === null || user === void 0 ? void 0 : user.id);
            setNotifications(prev => prev.map(n => (Object.assign(Object.assign({}, n), { read: true }))));
            setUnreadCount(0);
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    });
    if (loading || !user)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: "relative rounded-full p-1 text-gray-400 hover:text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.BellIcon, { className: "h-6 w-6" }), unreadCount > 0 && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs text-white", children: unreadCount }))] }), (0, jsx_runtime_1.jsx)(react_2.Transition, { appear: true, show: isOpen, as: react_1.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "relative z-50", onClose: () => setIsOpen(false), children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75" }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 overflow-y-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "flex min-h-full items-center justify-center p-4", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-out duration-300", enterFrom: "opacity-0 scale-95", enterTo: "opacity-100 scale-100", leave: "ease-in duration-200", leaveFrom: "opacity-100 scale-100", leaveTo: "opacity-0 scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "w-full max-w-md transform overflow-hidden rounded-lg bg-background p-6 shadow-xl transition-all", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "text-lg font-medium text-white", children: "Notifications" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [unreadCount > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: markAllAsRead, className: "text-sm text-primary-400 hover:text-primary-300", children: "Tout marquer comme lu" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: notifications.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-gray-400 py-4", children: "Aucune notification" })) : (notifications.map((notification) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `p-4 rounded-lg transition-colors ${notification.read
                                                        ? 'bg-white/5'
                                                        : 'bg-primary-600/20'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-white", children: notification.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-1", children: notification.content }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: (0, date_fns_1.format)(new Date(notification.created_at), 'dd MMMM yyyy à HH:mm', { locale: locale_1.fr }) })] }), !notification.read && ((0, jsx_runtime_1.jsx)("button", { onClick: () => markAsRead(notification.id), className: "shrink-0 text-xs text-primary-400 hover:text-primary-300", children: "Marquer comme lu" }))] }), notification.link && ((0, jsx_runtime_1.jsx)("a", { href: notification.link, target: "_blank", rel: "noopener noreferrer", className: "block text-sm text-primary-400 hover:text-primary-300 mt-2", children: "Voir les d\u00E9tails \u2192" }))] }, notification.id)))) })] }) }) }) })] }) })] }));
}
