"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkPage = NetworkPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../stores/auth");
const Network_1 = require("./Network");
const ChatNotifications_1 = require("./chat/ChatNotifications");
const NotificationPreferences_1 = require("./notifications/NotificationPreferences");
const chat_1 = require("../lib/chat");
function NetworkPage() {
    const { user } = (0, auth_1.useAuth)();
    const [showPreferences, setShowPreferences] = (0, react_1.useState)(false);
    const [activeChatRoom, setActiveChatRoom] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (user) {
            // Initialize chat connection
            (0, chat_1.initializeChat)(user.id);
            return () => {
                // Clean up chat connection
                (0, chat_1.disconnectChat)();
            };
        }
    }, [user]);
    const handleOpenChat = (roomId, participantId) => {
        setActiveChatRoom({ roomId, participantId });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "R\u00E9seau professionnel" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos connexions et \u00E9changez avec d'autres professionnels" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowPreferences(!showPreferences), className: "btn-secondary", children: showPreferences ? 'Retour au réseau' : 'Préférences de notification' })] }), showPreferences ? ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(NotificationPreferences_1.NotificationPreferences, {}) })) : ((0, jsx_runtime_1.jsx)(Network_1.Network, {})), (0, jsx_runtime_1.jsx)(ChatNotifications_1.ChatNotifications, { onOpenChat: handleOpenChat })] }));
}
