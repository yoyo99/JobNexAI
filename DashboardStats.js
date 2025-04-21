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
exports.DashboardStats = DashboardStats;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
const activityConfig = {
    application: {
        icon: outline_1.DocumentTextIcon,
        color: 'text-blue-400',
    },
    interview: {
        icon: outline_1.PhoneIcon,
        color: 'text-green-400',
    },
    offer: {
        icon: outline_1.CheckCircleIcon,
        color: 'text-primary-400',
    },
    favorite: {
        icon: outline_1.StarIcon,
        color: 'text-yellow-400',
    },
    status_change: {
        icon: outline_1.ArrowTrendingUpIcon,
        color: 'text-purple-400',
    },
};
function DashboardStats() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [stats, setStats] = (0, react_1.useState)(null);
    const [timeframe, setTimeframe] = (0, react_1.useState)('week');
    (0, react_1.useEffect)(() => {
        if (user) {
            loadStats();
        }
    }, [user, timeframe]);
    const loadStats = () => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            setLoading(true);
            // Calculer les dates pour le timeframe
            const now = new Date();
            const timeframeStart = new Date();
            switch (timeframe) {
                case 'week':
                    timeframeStart.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    timeframeStart.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    timeframeStart.setFullYear(now.getFullYear() - 1);
                    break;
            }
            // Récupérer les statistiques des candidatures
            const { data: applications } = yield supabase_1.supabase
                .from('job_applications')
                .select('created_at, status')
                .eq('user_id', user.id)
                .gte('created_at', timeframeStart.toISOString());
            // Calculer les statistiques des entretiens
            const { data: interviews } = yield supabase_1.supabase
                .from('job_applications')
                .select('next_step_date, status')
                .eq('user_id', user.id)
                .eq('status', 'interviewing');
            // Récupérer les entreprises les plus fréquentes
            const { data: companies } = yield supabase_1.supabase
                .from('job_applications')
                .select(`
          job:jobs (
            company
          )
        `)
                .eq('user_id', user.id);
            // Récupérer l'activité récente
            const { data: recentApplications } = yield supabase_1.supabase
                .from('job_applications')
                .select(`
          id,
          status,
          created_at,
          job:jobs (
            id,
            title,
            company
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            const { data: recentFavorites } = yield supabase_1.supabase
                .from('job_favorites')
                .select(`
          id,
          created_at,
          job:jobs (
            id,
            title,
            company
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            // Transformer les données en activités
            const activities = [
                ...((recentApplications === null || recentApplications === void 0 ? void 0 : recentApplications.map(app => ({
                    id: app.id,
                    type: 'application',
                    title: app.job.title,
                    company: app.job.company,
                    date: app.created_at,
                    status: app.status,
                }))) || []),
                ...((recentFavorites === null || recentFavorites === void 0 ? void 0 : recentFavorites.map(fav => ({
                    id: fav.id,
                    type: 'favorite',
                    title: fav.job.title,
                    company: fav.job.company,
                    date: fav.created_at,
                }))) || []),
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(activity => (Object.assign(Object.assign({}, activity), activityConfig[activity.type])));
            // Calculer les statistiques
            const stats = {
                applications: {
                    total: (applications === null || applications === void 0 ? void 0 : applications.length) || 0,
                    thisWeek: (applications === null || applications === void 0 ? void 0 : applications.filter(a => new Date(a.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length) || 0,
                    lastWeek: (applications === null || applications === void 0 ? void 0 : applications.filter(a => new Date(a.created_at) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
                        new Date(a.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length) || 0,
                    percentageChange: 0
                },
                interviews: {
                    upcoming: (interviews === null || interviews === void 0 ? void 0 : interviews.filter(i => i.next_step_date && new Date(i.next_step_date) > new Date()).length) || 0,
                    completed: (interviews === null || interviews === void 0 ? void 0 : interviews.filter(i => i.next_step_date && new Date(i.next_step_date) <= new Date()).length) || 0
                },
                topCompanies: (companies === null || companies === void 0 ? void 0 : companies.reduce((acc, curr) => {
                    const company = curr.job.company;
                    if (company) {
                        const existing = acc.find(c => c.name === company);
                        if (existing) {
                            existing.count++;
                        }
                        else {
                            acc.push({ name: company, count: 1 });
                        }
                    }
                    return acc;
                }, []).sort((a, b) => b.count - a.count).slice(0, 5)) || [],
                topLocations: [],
                averageSalary: 0,
                responseRate: ((applications === null || applications === void 0 ? void 0 : applications.filter(a => a.status !== 'draft').length) || 0) / ((applications === null || applications === void 0 ? void 0 : applications.length) || 1) * 100,
                recentActivity: activities,
            };
            // Calculer le pourcentage de changement
            if (stats.applications.lastWeek > 0) {
                stats.applications.percentageChange =
                    ((stats.applications.thisWeek - stats.applications.lastWeek) / stats.applications.lastWeek) * 100;
            }
            setStats(stats);
        }
        catch (error) {
            console.error('Error loading stats:', error);
        }
        finally {
            setLoading(false);
        }
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!stats)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-end space-x-2", children: ['week', 'month', 'year'].map((t) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => setTimeframe(t), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeframe === t
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.BriefcaseIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsxs)("span", { className: `text-sm ${stats.applications.percentageChange > 0 ? 'text-green-400' : 'text-red-400'}`, children: [stats.applications.percentageChange > 0 ? ((0, jsx_runtime_1.jsx)(outline_1.ArrowUpIcon, { className: "h-4 w-4 inline" })) : ((0, jsx_runtime_1.jsx)(outline_1.ArrowDownIcon, { className: "h-4 w-4 inline" })), Math.abs(stats.applications.percentageChange).toFixed(1), "%"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: stats.applications.total }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Candidatures" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.CalendarIcon, { className: "h-6 w-6 text-primary-400" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white", children: stats.interviews.upcoming }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Entretiens \u00E0 venir" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.BuildingOfficeIcon, { className: "h-6 w-6 text-primary-400" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: stats.topCompanies.map((company, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: company.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white", children: company.count })] }, company.name))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-2", children: "Top Entreprises" })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "card", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.MapPinIcon, { className: "h-6 w-6 text-primary-400" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: stats.topLocations.map((location, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: location.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-white", children: location.count })] }, location.name))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-2", children: "Top Localisations" })] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Activit\u00E9 r\u00E9cente" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: stats.recentActivity.map((activity) => {
                            const Icon = activity.icon || outline_1.BriefcaseIcon;
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4 p-4 rounded-lg bg-white/5", children: [(0, jsx_runtime_1.jsx)("div", { className: `p-2 rounded-lg bg-white/5 ${activity.color || 'text-primary-400'}`, children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-white truncate", children: activity.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: [activity.company, activity.status && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { className: "mx-2", children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { className: "capitalize", children: activity.status })] }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: (0, date_fns_1.format)(new Date(activity.date), 'dd MMMM yyyy à HH:mm', { locale: locale_1.fr }) })] })] }, activity.id));
                        }) })] })] }));
}
