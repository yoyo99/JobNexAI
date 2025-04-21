var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { motion } from 'framer-motion';
import { UserIcon, BuildingOfficeIcon, ChatBubbleLeftIcon, UserPlusIcon, UserMinusIcon, } from '@heroicons/react/24/outline';
export function NetworkList({ onChatWithUser }) {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');
    useEffect(() => {
        if (user) {
            loadConnections();
            subscribeToConnections();
        }
    }, [user]);
    const loadConnections = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
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
        const channel = supabase
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
            supabase.removeChannel(channel);
        };
    };
    const handleConnection = (connectionId, action) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
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
        return (_jsx("div", { className: "flex justify-center p-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => setSelectedFilter('all'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "Toutes" }), _jsx("button", { onClick: () => setSelectedFilter('pending'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'pending'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "En attente" }), _jsx("button", { onClick: () => setSelectedFilter('accepted'), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === 'accepted'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: "Accept\u00E9es" })] }), _jsx("div", { className: "space-y-4", children: filteredConnections.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-400", children: "Aucune connexion trouv\u00E9e" })) : (filteredConnections.map((connection) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-primary-600/20 flex items-center justify-center", children: _jsx(UserIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: connection.connected_user.full_name }), connection.connected_user.title && (_jsx("p", { className: "text-sm text-gray-400", children: connection.connected_user.title })), connection.connected_user.company && (_jsxs("div", { className: "flex items-center gap-1 text-sm text-gray-400", children: [_jsx(BuildingOfficeIcon, { className: "h-4 w-4" }), connection.connected_user.company] }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [connection.status === 'pending' && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleConnection(connection.id, 'accept'), className: "p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors", children: _jsx(UserPlusIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleConnection(connection.id, 'reject'), className: "p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors", children: _jsx(UserMinusIcon, { className: "h-5 w-5" }) })] })), connection.status === 'accepted' && (_jsx("button", { onClick: () => onChatWithUser(connection.connected_user.id), className: "p-2 text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors", children: _jsx(ChatBubbleLeftIcon, { className: "h-5 w-5" }) }))] })] }) }, connection.id)))) })] }));
}
