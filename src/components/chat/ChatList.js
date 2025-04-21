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
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export function ChatList({ onSelectRoom }) {
    const { user } = useAuth();
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            loadChatRooms();
            subscribeToNewMessages();
        }
    }, [user]);
    const loadChatRooms = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
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
        const channel = supabase
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
            supabase.removeChannel(channel);
        };
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center p-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (chatRooms.length === 0) {
        return (_jsx("div", { className: "text-center py-8 text-gray-400", children: "Aucune conversation" }));
    }
    return (_jsx("div", { className: "space-y-4", children: chatRooms.map((room) => {
            const otherParticipant = room.participants[0];
            return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer", onClick: () => onSelectRoom(room.id, otherParticipant.user_id), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: otherParticipant.user.full_name }), room.last_message && (_jsxs("p", { className: "text-sm text-gray-400 truncate", children: [room.last_message.sender.full_name === (user === null || user === void 0 ? void 0 : user.full_name)
                                            ? 'Vous: '
                                            : `${room.last_message.sender.full_name}: `, room.last_message.content] }))] }), _jsxs("div", { className: "text-right", children: [room.last_message && (_jsx("p", { className: "text-xs text-gray-500", children: format(new Date(room.last_message.created_at), 'HH:mm', { locale: fr }) })), room.unread_count > 0 && (_jsx("span", { className: "inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-white text-xs", children: room.unread_count }))] })] }) }, room.id));
        }) }));
}
