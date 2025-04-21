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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
export function UserSearch({ onConnect }) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingConnections, setPendingConnections] = useState({});
    const handleSearch = () => __awaiter(this, void 0, void 0, function* () {
        if (!searchQuery.trim())
            return;
        try {
            setLoading(true);
            const { data, error } = yield supabase
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
                const { data: connections, error: connectionsError } = yield supabase
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
            const { error } = yield supabase
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-white mb-4", children: "Rechercher des professionnels" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Rechercher par nom...", className: "w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        } })] }), _jsx("button", { onClick: handleSearch, disabled: loading || !searchQuery.trim(), className: "btn-primary", children: loading ? 'Recherche...' : 'Rechercher' })] })] }), _jsx("div", { className: "space-y-4", children: searchResults.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-400", children: loading ? 'Recherche en cours...' : 'Aucun résultat trouvé' })) : (searchResults.map((result) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: result.full_name }), result.title && (_jsx("p", { className: "text-sm text-gray-400", children: result.title })), result.company && (_jsx("p", { className: "text-sm text-gray-400", children: result.company }))] }), _jsxs("button", { onClick: () => sendConnectionRequest(result.id), disabled: pendingConnections[result.id], className: `btn-secondary flex items-center gap-2 ${pendingConnections[result.id] ? 'opacity-50 cursor-not-allowed' : ''}`, children: [_jsx(UserPlusIcon, { className: "h-5 w-5" }), pendingConnections[result.id] ? 'Demande envoyée' : 'Se connecter'] })] }) }, result.id)))) })] }));
}
