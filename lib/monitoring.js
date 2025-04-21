"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMonitoring = initMonitoring;
exports.trackError = trackError;
exports.trackEvent = trackEvent;
const Sentry = __importStar(require("@sentry/react"));
const web_vitals_1 = require("web-vitals");
function initMonitoring() {
    // Initialize Sentry
    Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            new Sentry.BrowserTracing({
                tracePropagationTargets: ['localhost', 'jobnexus.com'],
            }),
            new Sentry.Replay(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
    });
    // Measure Web Vitals
    (0, web_vitals_1.onCLS)(metric => {
        Sentry.captureMessage(`Web Vital: CLS`, {
            level: 'info',
            tags: { metric: 'CLS', id: metric.id },
            extra: { value: metric.value },
        });
    });
    (0, web_vitals_1.onFID)(metric => {
        Sentry.captureMessage(`Web Vital: FID`, {
            level: 'info',
            tags: { metric: 'FID', id: metric.id },
            extra: { value: metric.value },
        });
    });
    (0, web_vitals_1.onFCP)(metric => {
        Sentry.captureMessage(`Web Vital: FCP`, {
            level: 'info',
            tags: { metric: 'FCP', id: metric.id },
            extra: { value: metric.value },
        });
    });
    (0, web_vitals_1.onLCP)(metric => {
        Sentry.captureMessage(`Web Vital: LCP`, {
            level: 'info',
            tags: { metric: 'LCP', id: metric.id },
            extra: { value: metric.value },
        });
    });
    (0, web_vitals_1.onTTFB)(metric => {
        Sentry.captureMessage(`Web Vital: TTFB`, {
            level: 'info',
            tags: { metric: 'TTFB', id: metric.id },
            extra: { value: metric.value },
        });
    });
}
function trackError(error, context) {
    Sentry.captureException(error, {
        tags: context,
    });
}
function trackEvent(name, data) {
    Sentry.captureMessage(name, {
        level: 'info',
        extra: data,
    });
}
