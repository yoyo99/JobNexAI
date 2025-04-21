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
exports.initializeChat = initializeChat;
exports.disconnectChat = disconnectChat;
exports.getChatRooms = getChatRooms;
exports.getChatMessages = getChatMessages;
exports.sendChatMessage = sendChatMessage;
exports.subscribeToRoom = subscribeToRoom;
exports.sendTypingNotification = sendTypingNotification;
exports.subscribeToTyping = subscribeToTyping;
const supabase_1 = require("./supabase");
const socket_io_client_1 = require("socket.io-client");
let socket = null;
function initializeChat(userId) {
    if (socket)
        return socket;
    socket = (0, socket_io_client_1.io)(import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001', {
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
function disconnectChat() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
function getChatRooms(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                .eq('user_id', userId)
                .order('room.last_message.created_at', { ascending: false });
            if (error)
                throw error;
            return data.map(item => {
                var _a;
                const otherParticipants = item.room.participants.filter(p => p.user_id !== userId);
                return {
                    id: item.room_id,
                    last_message: (_a = item.room.last_message) === null || _a === void 0 ? void 0 : _a[0],
                    participants: otherParticipants
                };
            });
        }
        catch (error) {
            console.error('Error getting chat rooms:', error);
            return [];
        }
    });
}
function getChatMessages(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase
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
            return data;
        }
        catch (error) {
            console.error('Error getting chat messages:', error);
            return [];
        }
    });
}
function sendChatMessage(roomId, senderId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
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
function subscribeToRoom(roomId, callback) {
    const channel = supabase_1.supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
    }, (payload) => {
        callback(payload.new);
    })
        .subscribe();
    return () => {
        supabase_1.supabase.removeChannel(channel);
    };
}
function sendTypingNotification(roomId, userId) {
    if (socket) {
        socket.emit('typing', { roomId, userId });
    }
}
function subscribeToTyping(roomId, callback) {
    if (socket) {
        socket.on(`typing:${roomId}`, (data) => {
            callback(data.userId);
        });
        return () => {
            socket.off(`typing:${roomId}`);
        };
    }
    return () => { };
}
