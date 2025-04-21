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
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowTrendingUpIcon, ArrowUpIcon, ArrowDownIcon, CalendarIcon, BriefcaseIcon, BuildingOfficeIcon, MapPinIcon, CheckCircleIcon, PhoneIcon, DocumentTextIcon, StarIcon, } from '@heroicons/react/24/outline';
const activityConfig = {
    application: {
        icon: DocumentTextIcon,
        color: 'text-blue-400',
    },
    interview: {
        icon: PhoneIcon,
        color: 'text-green-400',
    },
    offer: {
        icon: CheckCircleIcon,
        color: 'text-primary-400',
    },
    favorite: {
        icon: StarIcon,
        color: 'text-yellow-400',
    },
    status_change: {
        icon: ArrowTrendingUpIcon,
        color: 'text-purple-400',
    },
};
export function DashboardStats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    useEffect(() => {
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
            const { data: applications } = yield supabase
                .from('job_applications')
                .select('created_at, status')
                .eq('user_id', user.id)
                .gte('created_at', timeframeStart.toISOString());
            // Calculer les statistiques des entretiens
            const { data: interviews } = yield supabase
                .from('job_applications')
                .select('next_step_date, status')
                .eq('user_id', user.id)
                .eq('status', 'interviewing');
            // Récupérer les entreprises les plus fréquentes
            const { data: companies } = yield supabase
                .from('job_applications')
                .select(`
          job:jobs (
            company
          )
        `)
                .eq('user_id', user.id);
            // Récupérer l'activité récente
            const { data: recentApplications } = yield supabase
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
            const { data: recentFavorites } = yield supabase
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
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-end space-x-2", children: ['week', 'month', 'year'].map((t) => (_jsx("button", { onClick: () => setTimeframe(t), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeframe === t
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'}`, children: t.charAt(0).toUpperCase() + t.slice(1) }, t))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(BriefcaseIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("span", { className: `text-sm ${stats.applications.percentageChange > 0 ? 'text-green-400' : 'text-red-400'}`, children: [stats.applications.percentageChange > 0 ? (_jsx(ArrowUpIcon, { className: "h-4 w-4 inline" })) : (_jsx(ArrowDownIcon, { className: "h-4 w-4 inline" })), Math.abs(stats.applications.percentageChange).toFixed(1), "%"] }) })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: stats.applications.total }), _jsx("p", { className: "text-sm text-gray-400", children: "Candidatures" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "card", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(CalendarIcon, { className: "h-6 w-6 text-primary-400" }) }) }), _jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: stats.interviews.upcoming }), _jsx("p", { className: "text-sm text-gray-400", children: "Entretiens \u00E0 venir" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "card", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(BuildingOfficeIcon, { className: "h-6 w-6 text-primary-400" }) }) }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "space-y-2", children: stats.topCompanies.map((company, index) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-400", children: company.name }), _jsx("span", { className: "text-sm text-white", children: company.count })] }, company.name))) }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Top Entreprises" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "card", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(MapPinIcon, { className: "h-6 w-6 text-primary-400" }) }) }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "space-y-2", children: stats.topLocations.map((location, index) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-400", children: location.name }), _jsx("span", { className: "text-sm text-white", children: location.count })] }, location.name))) }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Top Localisations" })] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "card", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Activit\u00E9 r\u00E9cente" }), _jsx("div", { className: "space-y-4", children: stats.recentActivity.map((activity) => {
                            const Icon = activity.icon || BriefcaseIcon;
                            return (_jsxs("div", { className: "flex items-start gap-4 p-4 rounded-lg bg-white/5", children: [_jsx("div", { className: `p-2 rounded-lg bg-white/5 ${activity.color || 'text-primary-400'}`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-white truncate", children: activity.title }), _jsxs("p", { className: "text-sm text-gray-400", children: [activity.company, activity.status && (_jsxs(_Fragment, { children: [_jsx("span", { className: "mx-2", children: "\u2022" }), _jsx("span", { className: "capitalize", children: activity.status })] }))] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: format(new Date(activity.date), 'dd MMMM yyyy à HH:mm', { locale: fr }) })] })] }, activity.id));
                        }) })] })] }));
}
