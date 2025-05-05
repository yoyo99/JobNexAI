import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../stores/auth';
import { Network } from './Network';
import { ChatNotifications } from './chat/ChatNotifications';
import { NotificationPreferences } from './notifications/NotificationPreferences';
import { initializeChat, disconnectChat } from '../lib/chat';
function NetworkPage() {
    const { user } = useAuth();
    const [showPreferences, setShowPreferences] = useState(false);
    const [activeChatRoom, setActiveChatRoom] = useState(null);
    useEffect(() => {
        if (user) {
            // Initialize chat connection
            initializeChat(user.id);
            return () => {
                // Clean up chat connection
                disconnectChat();
            };
        }
    }, [user]);
    const handleOpenChat = (roomId, participantId) => {
        setActiveChatRoom({ roomId, participantId });
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "R\u00E9seau professionnel" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos connexions et \u00E9changez avec d'autres professionnels" })] }), _jsx("button", { onClick: () => setShowPreferences(!showPreferences), className: "btn-secondary", children: showPreferences ? 'Retour au réseau' : 'Préférences de notification' })] }), showPreferences ? (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(NotificationPreferences, {}) })) : (_jsx(Network, {})), _jsx(ChatNotifications, { onOpenChat: handleOpenChat })] }));
}
export default NetworkPage;
