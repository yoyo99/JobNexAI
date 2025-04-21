"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSpinner = LoadingSpinner;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
function LoadingSpinner({ size = 'md', color = 'primary-400', className = '', text }) {
    const sizeMap = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: `flex flex-col items-center justify-center ${className}`, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, className: `rounded-full border-t-2 border-b-2 border-${color} ${sizeMap[size]}` }), text && ((0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-400 text-sm", children: text }))] }));
}
