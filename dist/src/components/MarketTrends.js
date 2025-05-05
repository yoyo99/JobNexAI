import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AuthService } from '../lib/auth-service';
import { useTranslation } from 'react-i18next';
const MarketTrends = () => {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    useEffect(() => {
        AuthService.getMarketTrends()
            .then(setTrends)
            .catch((err) => setError(err.message || t('marketTrends.errorUnknown')))
            .finally(() => setLoading(false));
    }, [t]);
    if (loading)
        return _jsx("div", { children: t('marketTrends.loading') });
    if (error)
        return _jsx("div", { children: t('marketTrends.error', { error }) });
    if (!trends)
        return _jsx("div", { children: t('marketTrends.noData') });
    return (_jsxs("div", { children: [_jsx("h2", { children: t('marketTrends.title') }), _jsx("h3", { children: t('marketTrends.jobTypes') }), _jsx("ul", { children: (Array.isArray(trends.jobTypes) ? trends.jobTypes : []).map((tItem) => (_jsxs("li", { children: [tItem.category, " : ", tItem.count, " (", tItem.percentage.toFixed(1), "%)"] }, tItem.category))) }), _jsx("h3", { children: t('marketTrends.locations') }), _jsx("ul", { children: (Array.isArray(trends.locations) ? trends.locations : []).map((lItem) => (_jsxs("li", { children: [lItem.category, " : ", lItem.count, " (", lItem.percentage.toFixed(1), "%)"] }, lItem.category))) }), _jsx("h3", { children: t('marketTrends.salary') }), _jsxs("p", { children: [trends.salary.average.toLocaleString(), " \u20AC (", trends.salary.count, " ", t('marketTrends.salaryOffers'), ")"] })] }));
};
export default MarketTrends;
