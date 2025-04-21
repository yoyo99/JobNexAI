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
exports.NetworkList = NetworkList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
function NetworkList({ onChatWithUser }) {
    const { user } = (0, auth_1.useAuth)();
    const [connections, setConnections] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [selectedFilter, setSelectedFilter] = (0, react_1.useState)('all');
    (0, react_1.useEffect)(() => {
        if (user) {
            loadConnections();
            subscribeToConnections();
        }
    }, [user]);
    const loadConnections = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
                .from('professional_connections')
                .select(`
          id,
          status,
          created_at,
          connected_user:profiles!connected_user_id (
            id,
            full_name,
            title,
            company
          )
        `)
                .or(`user_id.eq.${user === null || user === void 0 ? void 0 : user.id},connected_user_id.eq.${user === null || user === void 0 ? void 0 : user.id}`)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setConnections(data || []);
        }
        catch (error) {
            console.error('Error loading connections:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const subscribeToConnections = () => {
        const channel = supabase_1.supabase
            .channel('connections')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'professional_connections',
            filter: `user_id=eq.${user === null || user === void 0 ? void 0 : user.id}`,
        }, () => {
            loadConnections();
        })
            .subscribe();
        return () => {
            supabase_1.supabase.removeChannel(channel);
        };
    };
    const handleConnection = (connectionId, action) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
                .from('professional_connections')
                .update({ status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'blocked' })
                .eq('id', connectionId);
            if (error)
                throw error;
            loadConnections();
        }
        catch (error) {
            console.error('Error updating connection:', error);
        }
    });
    const filteredConnections = connections.filter(connection => {
        if (selectedFilter === 'all')
            return true;
        return connection.status === selectedFilter;
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedFilter('all'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "Toutes" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedFilter('pending'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'pending'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "En attente" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedFilter('accepted'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'accepted'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "Accept\u00E9es" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredConnections.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-400", children: "Aucune connexion trouv\u00E9e" })) : (filteredConnections.map((connection) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full bg-primary-600/20 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(outline_1.UserIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: connection.connected_user.full_name }), connection.connected_user.title && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: connection.connected_user.title })), connection.connected_user.company && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 text-sm text-gray-400", children: [(0, jsx_runtime_1.jsx)(outline_1.BuildingOfficeIcon, { className: "h-4 w-4" }), connection.connected_user.company] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [connection.status === 'pending' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleConnection(connection.id, 'accept'), className: "p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.UserPlusIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleConnection(connection.id, 'reject'), className: "p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.UserMinusIcon, { className: "h-5 w-5" }) })] })), connection.status === 'accepted' && ((0, jsx_runtime_1.jsx)("button", { onClick: () => onChatWithUser(connection.connected_user.id), className: "p-2 text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.ChatBubbleLeftIcon, { className: "h-5 w-5" }) }))] })] }) }, connection.id)))) })] }));
}
