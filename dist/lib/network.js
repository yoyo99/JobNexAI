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
export function getConnections(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                .or(`user_id.eq.${userId},connected_user_id.eq.${userId}`)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error getting connections:', error);
            return [];
        }
    });
}
export function getPendingRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('professional_connections')
                .select(`
        id,
        created_at,
        user:profiles!user_id (
          id,
          full_name,
          title,
          company
        )
      `)
                .eq('connected_user_id', userId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error getting pending requests:', error);
            return [];
        }
    });
}
export function sendConnectionRequest(userId, connectedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('professional_connections')
                .insert({
                user_id: userId,
                connected_user_id: connectedUserId,
                status: 'pending'
            });
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Error sending connection request:', error);
            return false;
        }
    });
}
export function updateConnectionStatus(connectionId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase
                .from('professional_connections')
                .update({ status })
                .eq('id', connectionId);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Error updating connection status:', error);
            return false;
        }
    });
}
export function searchUsers(query, currentUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('profiles')
                .select('id, full_name, title, company')
                .ilike('full_name', `%${query}%`)
                .neq('id', currentUserId)
                .limit(20);
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    });
}
export function getConnectionStatus(userId, connectedUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('professional_connections')
                .select('status')
                .or(`and(user_id.eq.${userId},connected_user_id.eq.${connectedUserId}),and(user_id.eq.${connectedUserId},connected_user_id.eq.${userId})`)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    // No connection found
                    return null;
                }
                throw error;
            }
            return data.status;
        }
        catch (error) {
            console.error('Error getting connection status:', error);
            return null;
        }
    });
}
