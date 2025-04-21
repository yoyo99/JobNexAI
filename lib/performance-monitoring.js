"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPerformanceMonitoring = initPerformanceMonitoring;
const web_vitals_1 = require("web-vitals");
function initPerformanceMonitoring() {
    // Initialiser le monitoring des Web Vitals
    (0, web_vitals_1.onCLS)(sendToAnalytics);
    (0, web_vitals_1.onFID)(sendToAnalytics);
    (0, web_vitals_1.onFCP)(sendToAnalytics);
    (0, web_vitals_1.onLCP)(sendToAnalytics);
    (0, web_vitals_1.onTTFB)(sendToAnalytics);
}
function sendToAnalytics(metric) {
    // Construire l'URL avec les paramètres de métrique
    const url = `/api/performance?${metric.name.toLowerCase()}=${metric.value}&url=${encodeURIComponent(window.location.pathname)}`;
    // Utiliser sendBeacon si disponible, sinon utiliser fetch
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
    }
    else {
        fetch(url, { method: 'POST', keepalive: true });
    }
    // Envoyer également à Sentry si disponible
    if (window.Sentry) {
        window.Sentry.captureMessage(`Web Vital: ${metric.name}`, {
            level: 'info',
            tags: { metric: metric.name },
            extra: { value: metric.value },
        });
    }
}
