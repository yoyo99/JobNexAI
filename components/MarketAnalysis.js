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
exports.MarketAnalysis = MarketAnalysis;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const supabase_1 = require("../lib/supabase");
const outline_1 = require("@heroicons/react/24/outline");
function MarketAnalysis() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [trends, setTrends] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadTrends();
    }, []);
    const loadTrends = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const data = yield (0, supabase_1.getMarketTrends)();
            setTrends(data);
        }
        catch (error) {
            console.error('Error loading market trends:', error);
        }
        finally {
            setLoading(false);
        }
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!trends)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: t('marketAnalysis.title') }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: t('marketAnalysis.subtitle') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.ChartBarIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.jobTypes') })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: trends.jobTypes.map((trend) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: trend.category }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [trend.percentage.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-primary-600 to-secondary-600", style: { width: `${trend.percentage}%` } }) })] }, trend.category))) })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.MapPinIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.topLocations') })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: trends.locations.map((trend) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: trend.category }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white", children: [trend.percentage.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-primary-600 to-secondary-600", style: { width: `${trend.percentage}%` } }) })] }, trend.category))) })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.2 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.CurrencyEuroIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.salaryInsights') })] }), trends.salary.count > 0 ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-3xl font-bold text-white mb-2", children: trends.salary.average.toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR',
                                            maximumFractionDigits: 0
                                        }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: t('marketAnalysis.averageSalary', { count: trends.salary.count }) })] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: t('marketAnalysis.noSalaryData') }))] })] })] }));
}
