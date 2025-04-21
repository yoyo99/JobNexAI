"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVTemplate = CVTemplate;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
function CVTemplate({ template, onSelect }) {
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer", onClick: onSelect, children: [(0, jsx_runtime_1.jsx)("div", { className: "aspect-[3/4] bg-white/5" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: template.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mt-1", children: template.description }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: template.category }) })] })] }));
}
