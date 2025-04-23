var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { supabase } from './supabase';
import { io } from 'socket.io-client';
let socket = null;
export function initializeChat(userId) {
    if (socket)
        return socket;
    socket = io(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001', {
        auth: {
            userId
        }
    });
    socket.on('connect', () => {
        console.log('Connected to chat server');
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
    });
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
    return socket;
}
export function disconnectChat() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
export function getChatRooms(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                .eq('user_id', userId)
                .order('room.last_message.created_at', { ascending: false });
            if (error)
                throw error;
            return (data || []).map((item) => {
                var _a;
                const participants = (item.room.participants || []).map((p) => ({
                    user_id: p.user_id,
                    user: p.user[0],
                }));
                const msg = (_a = item.room.last_message) === null || _a === void 0 ? void 0 : _a[0];
                const last_message = msg
                    ? {
                        id: msg.id,
                        sender_id: msg.sender_id,
                        content: msg.content,
                        created_at: msg.created_at,
                        sender: msg.sender[0],
                    }
                    : null;
                return { id: item.room_id, participants, last_message };
            });
        }
        catch (error) {
            console.error('Error getting chat rooms:', error);
            return [];
        }
    });
}
export function getChatMessages(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('chat_messages')
                .select(`
        id,
        sender_id,
        content,
        created_at,
        sender:profiles!sender_id (
          full_name
        )
      `)
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            return (data || []).map((msg) => ({
                id: msg.id,
                sender_id: msg.sender_id,
                content: msg.content,
                created_at: msg.created_at,
                sender: msg.sender[0],
            }));
        }
        catch (error) {
            console.error('Error getting chat messages:', error);
            return [];
        }
    });
}
export function sendChatMessage(roomId, senderId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('chat_messages')
                .insert({
                room_id: roomId,
                sender_id: senderId,
                content
            });
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Error sending chat message:', error);
            return false;
        }
    });
}
export function subscribeToRoom(roomId, callback) {
    const channel = supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
    }, (payload) => {
        const newMsg = payload.new;
        const message = {
            id: newMsg.id,
            sender_id: newMsg.sender_id,
            content: newMsg.content,
            created_at: newMsg.created_at,
            sender: newMsg.sender,
        };
        callback(message);
    })
        .subscribe();
    return () => {
        supabase.removeChannel(channel);
    };
}
export function sendTypingNotification(roomId, userId) {
    socket === null || socket === void 0 ? void 0 : socket.emit('typing', { roomId, userId });
}
export function subscribeToTyping(roomId, callback) {
    if (!socket) {
        return () => { };
    }
    socket.on(`typing:${roomId}`, (data) => {
        callback(data.userId);
    });
    return () => {
        socket === null || socket === void 0 ? void 0 : socket.off(`typing:${roomId}`);
    };
}
