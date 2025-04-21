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
exports.JobStats = JobStats;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const react_i18next_1 = require("react-i18next");
const outline_1 = require("@heroicons/react/24/outline");
function JobStats() {
    const { user } = (0, auth_1.useAuth)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [stats, setStats] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const loadStats = () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            setLoading(true);
            setError(null);
            const [applicationsResponse, matchesResponse, skillsResponse, salaryResponse, suggestionsResponse, favoritesResponse] = yield Promise.all([
                supabase_1.supabase
                    .from('job_applications')
                    .select('*')
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id),
                supabase_1.supabase
                    .from('job_matches')
                    .select('*')
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id),
                supabase_1.supabase
                    .from('user_skills')
                    .select(`
            id,
            user_id,
            skill_id,
            proficiency_level,
            years_experience,
            created_at,
            updated_at,
            skill:skills (
              id,
              name,
              category,
              job_skills (
                job:jobs (
                  id,
                  title,
                  company,
                  created_at
                )
              )
            )
          `)
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                    .order('created_at', { ascending: false })
                    .limit(5),
                supabase_1.supabase
                    .from('jobs')
                    .select('salary_min, salary_max'),
                supabase_1.supabase
                    .from('job_suggestions')
                    .select('*')
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id),
                supabase_1.supabase
                    .from('job_favorites')
                    .select('*')
                    .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
            ]);
            if (applicationsResponse.error)
                throw applicationsResponse.error;
            if (matchesResponse.error)
                throw matchesResponse.error;
            if (skillsResponse.error)
                throw skillsResponse.error;
            if (salaryResponse.error)
                throw salaryResponse.error;
            if (suggestionsResponse.error)
                throw suggestionsResponse.error;
            if (favoritesResponse.error)
                throw favoritesResponse.error;
            const totalApplications = ((_a = applicationsResponse.data) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const activeApplications = ((_b = matchesResponse.data) === null || _b === void 0 ? void 0 : _b.filter(m => m.match_score > 70).length) || 0;
            const responseRate = matchesResponse.data
                ? (matchesResponse.data.filter(m => m.match_score > 50).length / matchesResponse.data.length) * 100
                : 0;
            const averageSalary = ((_c = salaryResponse.data) === null || _c === void 0 ? void 0 : _c.reduce((acc, job) => {
                const avg = ((job.salary_min || 0) + (job.salary_max || 0)) / 2;
                return acc + avg;
            }, 0)) || 0;
            const matchingJobs = ((_d = suggestionsResponse.data) === null || _d === void 0 ? void 0 : _d.length) || 0;
            const savedJobs = ((_e = favoritesResponse.data) === null || _e === void 0 ? void 0 : _e.length) || 0;
            const skillCounts = {};
            const userSkills = skillsResponse.data;
            userSkills === null || userSkills === void 0 ? void 0 : userSkills.forEach(userSkill => {
                var _a;
                if ((_a = userSkill.skill) === null || _a === void 0 ? void 0 : _a.name) {
                    skillCounts[userSkill.skill.name] = (skillCounts[userSkill.skill.name] || 0) + 1;
                }
            });
            const topSkills = Object.entries(skillCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
            const recentActivities = (userSkills === null || userSkills === void 0 ? void 0 : userSkills.map(userSkill => {
                var _a, _b, _c, _d, _e, _f;
                const jobSkill = (_b = (_a = userSkill.skill) === null || _a === void 0 ? void 0 : _a.job_skills) === null || _b === void 0 ? void 0 : _b[0];
                return {
                    id: ((_c = jobSkill === null || jobSkill === void 0 ? void 0 : jobSkill.job) === null || _c === void 0 ? void 0 : _c.id) || '',
                    type: 'skill_match',
                    title: ((_d = jobSkill === null || jobSkill === void 0 ? void 0 : jobSkill.job) === null || _d === void 0 ? void 0 : _d.title) || '',
                    company: ((_e = jobSkill === null || jobSkill === void 0 ? void 0 : jobSkill.job) === null || _e === void 0 ? void 0 : _e.company) || '',
                    date: ((_f = jobSkill === null || jobSkill === void 0 ? void 0 : jobSkill.job) === null || _f === void 0 ? void 0 : _f.created_at) || '',
                };
            }).filter(activity => activity.id)) || [];
            setStats({
                totalApplications,
                activeApplications,
                responseRate,
                averageSalary: averageSalary / (((_f = salaryResponse.data) === null || _f === void 0 ? void 0 : _f.length) || 1),
                matchingJobs,
                savedJobs,
                topSkills,
                recentActivities,
            });
        }
        catch (error) {
            console.error('Error loading stats:', error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        if (user) {
            loadStats();
        }
    }, [user]);
    const statCards = (0, react_1.useMemo)(() => [
        {
            title: t('dashboard.stats.applications'),
            value: (stats === null || stats === void 0 ? void 0 : stats.totalApplications) || 0,
            icon: outline_1.BriefcaseIcon,
            color: 'text-primary-400',
        },
        {
            title: t('dashboard.stats.interviews'),
            value: (stats === null || stats === void 0 ? void 0 : stats.activeApplications) || 0,
            icon: outline_1.ClockIcon,
            color: 'text-primary-400',
        },
        {
            title: t('dashboard.stats.responseRate'),
            value: `${stats === null || stats === void 0 ? void 0 : stats.responseRate.toFixed(0)}%` || '0%',
            icon: outline_1.ChartBarIcon,
            color: 'text-primary-400',
        },
        {
            title: t('dashboard.stats.averageSalary'),
            value: (stats === null || stats === void 0 ? void 0 : stats.averageSalary.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
            })) || '0 €',
            icon: outline_1.ArrowTrendingUpIcon,
            color: 'text-primary-400',
        },
        {
            title: t('dashboard.stats.matchingJobs'),
            value: (stats === null || stats === void 0 ? void 0 : stats.matchingJobs) || 0,
            icon: outline_1.SparklesIcon,
            color: 'text-primary-400',
        },
        {
            title: t('dashboard.stats.savedJobs'),
            value: (stats === null || stats === void 0 ? void 0 : stats.savedJobs) || 0,
            icon: outline_1.BookmarkIcon,
            color: 'text-primary-400',
        },
    ], [stats, t]);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: error }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6", children: statCards.map((card, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "card", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(card.icon, { className: `h-6 w-6 ${card.color}` }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: card.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-semibold text-white", children: card.value })] })] }) }, card.title))) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white mb-4", children: t('dashboard.skillsProgress.title') }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: stats === null || stats === void 0 ? void 0 : stats.topSkills.map((skill, index) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: skill.name }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [skill.count, " offres"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { width: 0 }, animate: { width: `${(skill.count / (((_a = stats === null || stats === void 0 ? void 0 : stats.topSkills[0]) === null || _a === void 0 ? void 0 : _a.count) || 1)) * 100}%` }, transition: { duration: 0.5, delay: 0.1 * index }, className: "h-full bg-gradient-to-r from-primary-600 to-secondary-600" }) })] }, skill.name));
                                }) })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white mb-4", children: t('dashboard.recentApplications.title') }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: stats === null || stats === void 0 ? void 0 : stats.recentActivities.map((activity) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 rounded-lg bg-white/5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: activity.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: activity.company })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-primary-400", children: new Date(activity.date).toLocaleDateString('fr-FR') }) })] }, activity.id))) })] })] })] }));
}
