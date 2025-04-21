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
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMarketTrends } from '../lib/supabase';
import { ChartBarIcon, MapPinIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';
export function MarketAnalysis() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState(null);
    useEffect(() => {
        loadTrends();
    }, []);
    const loadTrends = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const data = yield getMarketTrends();
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
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!trends)
        return null;
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: t('marketAnalysis.title') }), _jsx("p", { className: "text-gray-400 mt-1", children: t('marketAnalysis.subtitle') })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "card", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(ChartBarIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsx("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.jobTypes') })] }), _jsx("div", { className: "space-y-4", children: trends.jobTypes.map((trend) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-gray-400", children: trend.category }), _jsxs("span", { className: "text-white", children: [trend.percentage.toFixed(1), "%"] })] }), _jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-primary-600 to-secondary-600", style: { width: `${trend.percentage}%` } }) })] }, trend.category))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "card", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(MapPinIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsx("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.topLocations') })] }), _jsx("div", { className: "space-y-4", children: trends.locations.map((trend) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-gray-400", children: trend.category }), _jsxs("span", { className: "text-white", children: [trend.percentage.toFixed(1), "%"] })] }), _jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-primary-600 to-secondary-600", style: { width: `${trend.percentage}%` } }) })] }, trend.category))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.2 }, className: "card", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: "p-3 rounded-lg bg-white/5", children: _jsx(CurrencyEuroIcon, { className: "h-6 w-6 text-primary-400" }) }), _jsx("h2", { className: "text-lg font-semibold text-white", children: t('marketAnalysis.salaryInsights') })] }), trends.salary.count > 0 ? (_jsxs("div", { children: [_jsx("div", { className: "text-3xl font-bold text-white mb-2", children: trends.salary.average.toLocaleString('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR',
                                            maximumFractionDigits: 0
                                        }) }), _jsx("p", { className: "text-sm text-gray-400", children: t('marketAnalysis.averageSalary', { count: trends.salary.count }) })] })) : (_jsx("p", { className: "text-gray-400", children: t('marketAnalysis.noSalaryData') }))] })] })] }));
}
