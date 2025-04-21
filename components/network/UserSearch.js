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
exports.UserSearch = UserSearch;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const outline_1 = require("@heroicons/react/24/outline");
function UserSearch({ onConnect }) {
    const { user } = (0, auth_1.useAuth)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [searchResults, setSearchResults] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [pendingConnections, setPendingConnections] = (0, react_1.useState)({});
    const handleSearch = () => __awaiter(this, void 0, void 0, function* () {
        if (!searchQuery.trim())
            return;
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
                .from('profiles')
                .select('id, full_name, title, company')
                .ilike('full_name', `%${searchQuery}%`)
                .neq('id', user === null || user === void 0 ? void 0 : user.id)
                .limit(20);
            if (error)
                throw error;
            setSearchResults(data || []);
            // Check existing connection status
            if (data && data.length > 0) {
                const userIds = data.map(u => u.id);
                const { data: connections, error: connectionsError } = yield supabase_1.supabase
                    .from('professional_connections')
                    .select('connected_user_id, status')
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                    .in('connected_user_id', userIds);
                if (connectionsError)
                    throw connectionsError;
                const pendingMap = {};
                connections === null || connections === void 0 ? void 0 : connections.forEach(conn => {
                    pendingMap[conn.connected_user_id] = conn.status === 'pending';
                });
                setPendingConnections(pendingMap);
            }
        }
        catch (error) {
            console.error('Error searching users:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const sendConnectionRequest = (userId) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
                .from('professional_connections')
                .insert({
                user_id: user === null || user === void 0 ? void 0 : user.id,
                connected_user_id: userId,
                status: 'pending'
            });
            if (error)
                throw error;
            setPendingConnections(prev => (Object.assign(Object.assign({}, prev), { [userId]: true })));
        }
        catch (error) {
            console.error('Error sending connection request:', error);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white mb-4", children: "Rechercher des professionnels" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(outline_1.MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Rechercher par nom...", className: "w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        } })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSearch, disabled: loading || !searchQuery.trim(), className: "btn-primary", children: loading ? 'Recherche...' : 'Rechercher' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: searchResults.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-400", children: loading ? 'Recherche en cours...' : 'Aucun résultat trouvé' })) : (searchResults.map((result) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: result.full_name }), result.title && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: result.title })), result.company && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: result.company }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => sendConnectionRequest(result.id), disabled: pendingConnections[result.id], className: `btn-secondary flex items-center gap-2 ${pendingConnections[result.id] ? 'opacity-50 cursor-not-allowed' : ''}`, children: [(0, jsx_runtime_1.jsx)(outline_1.UserPlusIcon, { className: "h-5 w-5" }), pendingConnections[result.id] ? 'Demande envoyée' : 'Se connecter'] })] }) }, result.id)))) })] }));
}
