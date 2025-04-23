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
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
export function ChatNotifications({ onOpenChat }) {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotification, setShowNotification] = useState(false);
    const [latestMessage, setLatestMessage] = useState(null);
    useEffect(() => {
        if (user) {
            loadUnreadCount();
            subscribeToNewMessages();
        }
    }, [user]);
    const loadUnreadCount = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // This is a placeholder - in a real app, you would calculate unread messages
            // based on a read_by array or similar mechanism
            const { count, error } = yield supabase
                .from('chat_messages')
                .select('*', { count: 'exact', head: true })
                .not('read_by', 'cs', `{${user === null || user === void 0 ? void 0 : user.id}}`)
                .neq('sender_id', user === null || user === void 0 ? void 0 : user.id);
            if (error)
                throw error;
            setUnreadCount(count || 0);
        }
        catch (error) {
            console.error('Error loading unread count:', error);
        }
    });
    const subscribeToNewMessages = () => {
        const channel = supabase
            .channel('new_messages')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `sender_id=neq.${user === null || user === void 0 ? void 0 : user.id}`
        }, (payload) => __awaiter(this, void 0, void 0, function* () {
            // Handle new message
            const { new: newMessage } = payload;
            // Update unread count
            setUnreadCount((prev) => prev + 1);
            // Show notification
            try {
                const { data: sender } = yield supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', newMessage.sender_id)
                    .single();
                setLatestMessage({
                    roomId: newMessage.room_id,
                    participantId: newMessage.sender_id,
                    senderName: (sender === null || sender === void 0 ? void 0 : sender.full_name) || 'Someone',
                    content: newMessage.content
                });
                setShowNotification(true);
            }
            catch (error) {
                console.error('Error fetching message details:', error);
            }
        }))
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    };
    const handleNotificationClick = () => {
        if (latestMessage) {
            onOpenChat(latestMessage.roomId, latestMessage.participantId);
            setShowNotification(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "relative", children: _jsxs("button", { className: "relative p-2 text-gray-600 hover:text-gray-900", onClick: () => onOpenChat('', ''), children: [_jsx(ChatBubbleLeftIcon, { className: "h-6 w-6" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: unreadCount }))] }) }), showNotification && latestMessage && (_jsxs(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, className: "fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm cursor-pointer", onClick: handleNotificationClick, children: [_jsx("h4", { className: "font-semibold", children: latestMessage.senderName }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: latestMessage.content })] }))] }));
}
