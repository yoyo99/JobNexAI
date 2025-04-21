"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const monitoring_1 = require("../lib/monitoring");
class ErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        // Track the error in monitoring system
        (0, monitoring_1.trackError)(error, {
            componentStack: errorInfo.componentStack,
            context: 'ErrorBoundary'
        });
        // Call onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    render() {
        var _a;
        if (this.state.hasError) {
            // Render custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default fallback UI
            return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-background", children: (0, jsx_runtime_1.jsxs)("div", { className: "card max-w-md w-full text-center p-8", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white mb-4", children: "Une erreur est survenue" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6", children: "Nous sommes d\u00E9sol\u00E9s, une erreur inattendue s'est produite. Notre \u00E9quipe a \u00E9t\u00E9 notifi\u00E9e." }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40", children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-400 text-sm font-mono", children: (_a = this.state.error) === null || _a === void 0 ? void 0 : _a.toString() }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => window.location.reload(), className: "btn-primary w-full", children: "Rafra\u00EEchir la page" })] }) }));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
