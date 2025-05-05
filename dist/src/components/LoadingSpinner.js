import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function LoadingSpinner({ size = 'md', color = 'primary-400', className = '', text }) {
    const sizeMap = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };
    return (_jsxs("div", { className: `flex flex-col items-center justify-center ${className}`, children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, className: `rounded-full border-t-2 border-b-2 border-${color} ${sizeMap[size]}` }), text && (_jsx("p", { className: "mt-2 text-gray-400 text-sm", children: text }))] }));
}
