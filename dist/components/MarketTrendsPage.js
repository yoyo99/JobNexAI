import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MarketAnalysis } from './MarketAnalysis';
import { DashboardLayout } from './DashboardLayout';
const MarketTrendsPage = () => {
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Market Trends Analysis" }), _jsx(MarketAnalysis, {})] }) }));
};
export default MarketTrendsPage;
