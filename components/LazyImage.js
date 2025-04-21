"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyImage = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
exports.LazyImage = (0, react_1.memo)(function LazyImage({ src, alt, width, height, className = '', placeholderColor = '#1f2937', }) {
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [isInView, setIsInView] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const imgRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        if (imgRef.current) {
            observer.observe(imgRef.current);
        }
        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
            observer.disconnect();
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isInView || isLoaded)
            return;
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError(true);
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, isInView, isLoaded]);
    return ((0, jsx_runtime_1.jsx)("div", { ref: imgRef, style: {
            width: width || '100%',
            height: height || 'auto',
            backgroundColor: placeholderColor,
            position: 'relative',
            overflow: 'hidden',
        }, className: className, role: "img", "aria-label": alt, children: isInView && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: error ? ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center text-gray-400 text-xs", style: { backgroundColor: placeholderColor }, children: "Image non disponible" })) : ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.img, { src: src, alt: alt, initial: { opacity: 0 }, animate: { opacity: isLoaded ? 1 : 0 }, transition: { duration: 0.3 }, style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }, loading: "lazy" })) })) }));
});
