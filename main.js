"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
require("./i18n");
require("./index.css");
const App_tsx_1 = __importDefault(require("./App.tsx"));
const monitoring_1 = require("./lib/monitoring");
const performance_monitoring_1 = require("./lib/performance-monitoring");
// Initialiser le monitoring
(0, monitoring_1.initMonitoring)();
// Initialiser le monitoring des performances
(0, performance_monitoring_1.initPerformanceMonitoring)();
(0, client_1.createRoot)(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(App_tsx_1.default, {}) }));
