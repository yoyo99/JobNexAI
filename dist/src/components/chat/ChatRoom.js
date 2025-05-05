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
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { getChatMessages, sendChatMessage, subscribeToRoom, sendTypingNotification, subscribeToTyping } from '../../lib/chat';
export function ChatRoom({ roomId, participantId }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef();
    const [participant, setParticipant] = useState(null);
    useEffect(() => {
        loadMessages();
        const unsubscribe = subscribeToRoom(roomId, (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });
        loadParticipantInfo();
        const unsubscribeTyping = subscribeToTyping(roomId, (userId) => {
            if (userId !== (user === null || user === void 0 ? void 0 : user.id)) {
                setIsTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                }, 3000);
            }
        });
        return () => {
            unsubscribe();
            unsubscribeTyping();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [roomId]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const loadMessages = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const messages = yield getChatMessages(roomId);
            setMessages(messages);
        }
        catch (error) {
            console.error('Error loading messages:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const loadParticipantInfo = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('profiles')
                .select('full_name')
                .eq('id', participantId)
                .single();
            if (error)
                throw error;
            setParticipant(data);
        }
        catch (error) {
            console.error('Error loading participant info:', error);
        }
    });
    const handleTyping = () => {
        sendTypingNotification(roomId, (user === null || user === void 0 ? void 0 : user.id) || '');
    };
    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!newMessage.trim() || !user)
            return;
        try {
            const success = yield sendChatMessage(roomId, user.id, newMessage.trim());
            if (success) {
                setNewMessage('');
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    });
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center p-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "flex flex-col h-[600px] bg-white/5 rounded-lg", children: [_jsx("div", { className: "p-4 border-b border-white/10", children: _jsx("h3", { className: "font-medium text-white", children: (participant === null || participant === void 0 ? void 0 : participant.full_name) || 'Conversation' }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `flex ${message.sender_id === (user === null || user === void 0 ? void 0 : user.id) ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[70%] rounded-lg p-3 ${message.sender_id === (user === null || user === void 0 ? void 0 : user.id)
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/10 text-white'}`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-medium", children: message.sender.full_name }), _jsx("span", { className: "text-xs opacity-70", children: format(new Date(message.created_at), 'HH:mm', { locale: fr }) })] }), _jsx("p", { className: "text-sm", children: message.content })] }) }, message.id))), isTyping && (_jsxs("div", { className: "text-sm text-gray-400", children: [participant === null || participant === void 0 ? void 0 : participant.full_name, " est en train d'\u00E9crire..."] })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "border-t border-white/10 p-4", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", value: newMessage, onChange: (e) => {
                                setNewMessage(e.target.value);
                                handleTyping();
                            }, placeholder: "\u00C9crivez votre message...", className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            } }), _jsxs("button", { onClick: sendMessage, disabled: !newMessage.trim(), className: "btn-primary flex items-center gap-2", children: [_jsx(PaperAirplaneIcon, { className: "h-5 w-5" }), "Envoyer"] })] }) })] }));
}
