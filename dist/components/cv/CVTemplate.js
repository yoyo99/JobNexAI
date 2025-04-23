import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function CVTemplate({ template, onSelect }) {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors cursor-pointer", onClick: onSelect, children: [_jsx("div", { className: "aspect-[3/4] bg-white/5" }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: template.name }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: template.description }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-400", children: template.category }) })] })] }));
}
