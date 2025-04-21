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
const vitest_1 = require("vitest");
const monitoring_1 = require("../monitoring");
const Sentry = __importStar(require("@sentry/react"));
const web_vitals_1 = require("web-vitals");
vitest_1.vi.mock('@sentry/react', () => ({
    init: vitest_1.vi.fn(),
    BrowserTracing: vitest_1.vi.fn(),
    Replay: vitest_1.vi.fn(),
    captureException: vitest_1.vi.fn(),
    captureMessage: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('web-vitals', () => ({
    onCLS: vitest_1.vi.fn(),
    onFID: vitest_1.vi.fn(),
    onFCP: vitest_1.vi.fn(),
    onLCP: vitest_1.vi.fn(),
    onTTFB: vitest_1.vi.fn(),
}));
describe('Monitoring Functions', () => {
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
    });
    test('initializes monitoring', () => {
        (0, monitoring_1.initMonitoring)();
        expect(Sentry.init).toHaveBeenCalledWith({
            dsn: expect.any(String),
            integrations: expect.any(Array),
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
        expect(web_vitals_1.onCLS).toHaveBeenCalled();
        expect(web_vitals_1.onFID).toHaveBeenCalled();
        expect(web_vitals_1.onFCP).toHaveBeenCalled();
        expect(web_vitals_1.onLCP).toHaveBeenCalled();
        expect(web_vitals_1.onTTFB).toHaveBeenCalled();
    });
    test('tracks error with context', () => {
        const error = new Error('Test error');
        const context = { userId: '123', page: 'home' };
        (0, monitoring_1.trackError)(error, context);
        expect(Sentry.captureException).toHaveBeenCalledWith(error, {
            tags: context,
        });
    });
    test('tracks event with data', () => {
        const eventName = 'button_click';
        const eventData = { buttonId: 'submit', page: 'checkout' };
        (0, monitoring_1.trackEvent)(eventName, eventData);
        expect(Sentry.captureMessage).toHaveBeenCalledWith(eventName, {
            level: 'info',
            extra: eventData,
        });
    });
    test('tracks web vitals', () => {
        (0, monitoring_1.initMonitoring)();
        // Simuler un événement CLS
        const clsCallback = web_vitals_1.onCLS.mock.calls[0][0];
        clsCallback({ id: 'cls-1', value: 0.1 });
        expect(Sentry.captureMessage).toHaveBeenCalledWith('Web Vital: CLS', {
            level: 'info',
            tags: { metric: 'CLS', id: 'cls-1' },
            extra: { value: 0.1 },
        });
        // Simuler un événement FID
        const fidCallback = web_vitals_1.onFID.mock.calls[0][0];
        fidCallback({ id: 'fid-1', value: 100 });
        expect(Sentry.captureMessage).toHaveBeenCalledWith('Web Vital: FID', {
            level: 'info',
            tags: { metric: 'FID', id: 'fid-1' },
            extra: { value: 100 },
        });
    });
});
