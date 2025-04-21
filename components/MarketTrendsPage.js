"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
tsx;
const MarketAnalysis_1 = require("./MarketAnalysis");
const DashboardLayout_1 = require("./DashboardLayout");
const MarketTrendsPage = () => {
    return ((0, jsx_runtime_1.jsx)(DashboardLayout_1.DashboardLayout, { children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto p-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Market Trends Analysis" }), (0, jsx_runtime_1.jsx)(MarketAnalysis_1.MarketAnalysis, {})] }) }));
};
exports.default = MarketTrendsPage;
