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
exports.Network = Network;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
const NetworkList_1 = require("./network/NetworkList");
const ConnectionRequests_1 = require("./network/ConnectionRequests");
const ChatRoom_1 = require("./chat/ChatRoom");
const UserSearch_1 = require("./network/UserSearch");
const outline_1 = require("@heroicons/react/24/outline");
function Network() {
    const { user } = (0, auth_1.useAuth)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('connections');
    const [selectedChatRoom, setSelectedChatRoom] = (0, react_1.useState)(null);
    const [selectedParticipant, setSelectedParticipant] = (0, react_1.useState)(null);
    const [pendingRequestsCount, setPendingRequestsCount] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadPendingRequestsCount();
        }
    }, [user]);
    const loadPendingRequestsCount = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { count, error } = yield supabase_1.supabase
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
            const { data: existingRooms, error: roomsError } = yield supabase_1.supabase
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
            const { data: otherParticipants, error: participantsError } = yield supabase_1.supabase
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
                const { data: newRoom, error: createRoomError } = yield supabase_1.supabase
                    .from('chat_rooms')
                    .insert({})
                    .select()
                    .single();
                if (createRoomError)
                    throw createRoomError;
                roomId = newRoom.id;
                // Add participants
                const { error: addParticipantsError } = yield supabase_1.supabase
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "R\u00E9seau professionnel" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez vos connexions et \u00E9changez avec d'autres professionnels" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('connections'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'connections'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)(outline_1.UserGroupIcon, { className: "h-5 w-5" }), "Connexions"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('requests'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'requests'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)(outline_1.UserPlusIcon, { className: "h-5 w-5" }), "Demandes", pendingRequestsCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: pendingRequestsCount }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('chat'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'chat'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)(outline_1.ChatBubbleLeftRightIcon, { className: "h-5 w-5" }), "Messages"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('search'), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'search'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: [(0, jsx_runtime_1.jsx)(outline_1.MagnifyingGlassIcon, { className: "h-5 w-5" }), "Rechercher"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [activeTab === 'connections' && ((0, jsx_runtime_1.jsx)(NetworkList_1.NetworkList, { onChatWithUser: handleChatWithUser })), activeTab === 'requests' && ((0, jsx_runtime_1.jsx)(ConnectionRequests_1.ConnectionRequests, {})), activeTab === 'chat' && selectedChatRoom && selectedParticipant && ((0, jsx_runtime_1.jsx)(ChatRoom_1.ChatRoom, { roomId: selectedChatRoom, participantId: selectedParticipant })), activeTab === 'chat' && (!selectedChatRoom || !selectedParticipant) && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12 text-gray-400", children: "S\u00E9lectionnez une connexion pour d\u00E9marrer une conversation" })), activeTab === 'search' && ((0, jsx_runtime_1.jsx)(UserSearch_1.UserSearch, { onConnect: (userId) => {
                            // Handle connection request
                        } }))] })] }));
}
