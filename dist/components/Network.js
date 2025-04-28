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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';
import { NetworkList } from './network/NetworkList';
import { ConnectionRequests } from './network/ConnectionRequests';
import { ChatRoom } from './chat/ChatRoom';
import { UserSearch } from './network/UserSearch';
import { UserGroupIcon, UserPlusIcon, ChatBubbleLeftRightIcon, MagnifyingGlassIcon, } from '@heroicons/react/24/outline';
export function Network() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('connections');
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    useEffect(() => {
        if (user) {
            loadPendingRequestsCount();
        }
    }, [user]);
    const loadPendingRequestsCount = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { count, error } = yield supabase
                .from('professional_connections')
                .select('*', { count: 'exact', head: true })
                .eq('connected_user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('status', 'pending');
            if (error)
                throw error;
            setPendingRequestsCount(count || 0);
        }
        catch (error) {
            console.error('Error loading pending requests count:', error);
        }
    });
    const handleChatWithUser = (userId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if a chat room already exists between these users
            const { data: existingRooms, error: roomsError } = yield supabase
                .from('chat_room_participants')
                .select(`
          room_id,
          room:chat_rooms(
            id
          )
        `)
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id);
            if (roomsError)
                throw roomsError;
            const { data: otherParticipants, error: participantsError } = yield supabase
                .from('chat_room_participants')
                .select('room_id, user_id')
                .in('room_id', existingRooms.map(r => r.room_id))
                .eq('user_id', userId);
            if (participantsError)
                throw participantsError;
            let roomId;
            if (otherParticipants && otherParticipants.length > 0) {
                // Use existing room
                roomId = otherParticipants[0].room_id;
            }
            else {
                // Create new room
                const { data: newRoom, error: createRoomError } = yield supabase
                    .from('chat_rooms')
                    .insert({})
                    .select()
                    .single();
                if (createRoomError)
                    throw createRoomError;
                roomId = newRoom.id;
                // Add participants
                const { error: addParticipantsError } = yield supabase
                    .from('chat_room_participants')
                    .insert([
                    { room_id: roomId, user_id: user === null || user === void 0 ? void 0 : user.id },
                    { room_id: roomId, user_id: userId }
                ]);
                if (addParticipantsError)
                    throw addParticipantsError;
            }
            setSelectedChatRoom(roomId);
            setSelectedParticipant(userId);
            setActiveTab('chat');
        }
        catch (error) {
            console.error('Error setting up chat room:', error);
        }
    });
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "R\u00E9seau professionnel" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos connexions et \u00E9changez avec d'autres professionnels" })] }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsxs("button", { onClick: () => setActiveTab('connections'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'connections'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [_jsx(UserGroupIcon, { className: "h-5 w-5" }), "Connexions"] }), _jsxs("button", { onClick: () => setActiveTab('requests'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'requests'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [_jsx(UserPlusIcon, { className: "h-5 w-5" }), "Demandes", pendingRequestsCount > 0 && (_jsx("span", { className: "bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: pendingRequestsCount }))] }), _jsxs("button", { onClick: () => setActiveTab('chat'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'chat'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [_jsx(ChatBubbleLeftRightIcon, { className: "h-5 w-5" }), "Messages"] }), _jsxs("button", { onClick: () => setActiveTab('search'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'search'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [_jsx(MagnifyingGlassIcon, { className: "h-5 w-5" }), "Rechercher"] })] }) }), _jsxs("div", { className: "card", children: [activeTab === 'connections' && (_jsx(NetworkList, { onChatWithUser: handleChatWithUser })), activeTab === 'requests' && (_jsx(ConnectionRequests, {})), activeTab === 'chat' && selectedChatRoom && selectedParticipant && (_jsx(ChatRoom, { roomId: selectedChatRoom, participantId: selectedParticipant })), activeTab === 'chat' && (!selectedChatRoom || !selectedParticipant) && (_jsx("div", { className: "text-center py-12 text-gray-400", children: "S\u00E9lectionnez une connexion pour d\u00E9marrer une conversation" })), activeTab === 'search' && (_jsx(UserSearch, { onConnect: (userId) => {
                            // Handle connection request
                        } }))] })] }));
}
