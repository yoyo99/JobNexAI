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
exports.ConnectionRequests = ConnectionRequests;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
function ConnectionRequests() {
    const { user } = (0, auth_1.useAuth)();
    const [requests, setRequests] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadRequests();
            subscribeToRequests();
        }
    }, [user]);
    const loadRequests = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
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
                .eq('connected_user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setRequests(data || []);
        }
        catch (error) {
            console.error('Error loading requests:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const subscribeToRequests = () => {
        const channel = supabase_1.supabase
            .channel('requests')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'professional_connections',
            filter: `connected_user_id=eq.${user === null || user === void 0 ? void 0 : user.id}`,
        }, () => {
            loadRequests();
        })
            .subscribe();
        return () => {
            supabase_1.supabase.removeChannel(channel);
        };
    };
    const handleRequest = (requestId, accept) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
                .from('professional_connections')
                .update({ status: accept ? 'accepted' : 'rejected' })
                .eq('id', requestId);
            if (error)
                throw error;
            loadRequests();
        }
        catch (error) {
            console.error('Error handling request:', error);
        }
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (requests.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-gray-400", children: "Aucune demande de connexion en attente" }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: requests.map((request) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-12 w-12 rounded-full bg-primary-600/20 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(outline_1.UserIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-white", children: request.user.full_name }), request.user.title && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: request.user.title })), request.user.company && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: request.user.company }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleRequest(request.id, true), className: "p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleRequest(request.id, false), className: "p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-5 w-5" }) })] })] }) }, request.id))) }));
}
