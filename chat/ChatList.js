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
exports.ChatList = ChatList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
function ChatList({ onSelectRoom }) {
    const { user } = (0, auth_1.useAuth)();
    const [chatRooms, setChatRooms] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadChatRooms();
            subscribeToNewMessages();
        }
    }, [user]);
    const loadChatRooms = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
                .from('chat_room_participants')
                .select(`
          room_id,
          room:chat_rooms (
            id,
            last_message:chat_messages (
              content,
              created_at,
              sender:profiles!sender_id (
                full_name
              )
            ),
            participants:chat_room_participants (
              user_id,
              user:profiles!user_id (
                full_name
              )
            )
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('room.last_message.created_at', { ascending: false });
            if (error)
                throw error;
            // Format the data
            const rooms = data.map(item => {
                var _a;
                const otherParticipants = item.room.participants.filter(p => p.user_id !== (user === null || user === void 0 ? void 0 : user.id));
                // Count unread messages
                const unreadCount = 0; // This would need to be calculated based on read_by array
                return {
                    id: item.room_id,
                    last_message: (_a = item.room.last_message) === null || _a === void 0 ? void 0 : _a[0],
                    participants: otherParticipants,
                    unread_count: unreadCount
                };
            });
            setChatRooms(rooms);
        }
        catch (error) {
            console.error('Error loading chat rooms:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const subscribeToNewMessages = () => {
        const channel = supabase_1.supabase
            .channel('chat_messages')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
        }, () => {
            loadChatRooms();
        })
            .subscribe();
        return () => {
            supabase_1.supabase.removeChannel(channel);
        };
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (chatRooms.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-400", children: "Aucune conversation" }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: chatRooms.map((room) => {
            const otherParticipant = room.participants[0];
            return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer", onClick: () => onSelectRoom(room.id, otherParticipant.user_id), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: otherParticipant.user.full_name }), room.last_message && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400 truncate", children: [room.last_message.sender.full_name === (user === null || user === void 0 ? void 0 : user.full_name)
                                            ? 'Vous: '
                                            : `${room.last_message.sender.full_name}: `, room.last_message.content] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [room.last_message && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: (0, date_fns_1.format)(new Date(room.last_message.created_at), 'HH:mm', { locale: locale_1.fr }) })), room.unread_count > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-white text-xs", children: room.unread_count }))] })] }) }, room.id));
        }) }));
}
