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
exports.ChatRoom = ChatRoom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
const framer_motion_1 = require("framer-motion");
const chat_1 = require("../../lib/chat");
function ChatRoom({ roomId, participantId }) {
    const { user } = (0, auth_1.useAuth)();
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [newMessage, setNewMessage] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const messagesEndRef = (0, react_1.useRef)(null);
    const [isTyping, setIsTyping] = (0, react_1.useState)(false);
    const typingTimeoutRef = (0, react_1.useRef)();
    const [participant, setParticipant] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadMessages();
        const unsubscribe = (0, chat_1.subscribeToRoom)(roomId, (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });
        loadParticipantInfo();
        const unsubscribeTyping = (0, chat_1.subscribeToTyping)(roomId, (userId) => {
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
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const loadMessages = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const messages = yield (0, chat_1.getChatMessages)(roomId);
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
            const { data, error } = yield supabase_1.supabase
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
        (0, chat_1.sendTypingNotification)(roomId, (user === null || user === void 0 ? void 0 : user.id) || '');
    };
    const sendMessage = () => __awaiter(this, void 0, void 0, function* () {
        if (!newMessage.trim() || !user)
            return;
        try {
            const success = yield (0, chat_1.sendChatMessage)(roomId, user.id, newMessage.trim());
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-[600px] bg-white/5 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 border-b border-white/10", children: (0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: (participant === null || participant === void 0 ? void 0 : participant.full_name) || 'Conversation' }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `flex ${message.sender_id === (user === null || user === void 0 ? void 0 : user.id) ? 'justify-end' : 'justify-start'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: `max-w-[70%] rounded-lg p-3 ${message.sender_id === (user === null || user === void 0 ? void 0 : user.id)
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/10 text-white'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: message.sender.full_name }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs opacity-70", children: (0, date_fns_1.format)(new Date(message.created_at), 'HH:mm', { locale: locale_1.fr }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message.content })] }) }, message.id))), isTyping && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-400", children: [participant === null || participant === void 0 ? void 0 : participant.full_name, " est en train d'\u00E9crire..."] })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-white/10 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newMessage, onChange: (e) => {
                                setNewMessage(e.target.value);
                                handleTyping();
                            }, placeholder: "\u00C9crivez votre message...", className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            } }), (0, jsx_runtime_1.jsxs)("button", { onClick: sendMessage, disabled: !newMessage.trim(), className: "btn-primary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PaperAirplaneIcon, { className: "h-5 w-5" }), "Envoyer"] })] }) })] }));
}
