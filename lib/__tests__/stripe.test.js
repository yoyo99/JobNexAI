"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const stripe_1 = require("../stripe");
const stripe_js_1 = require("@stripe/stripe-js");
const supabase_1 = require("../supabase");
vitest_1.vi.mock('@stripe/stripe-js', () => ({
    loadStripe: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('../supabase', () => ({
    supabase: {
        functions: {
            invoke: vitest_1.vi.fn(),
        },
    },
}));
describe('Stripe Functions', () => {
    const mockUserId = 'test-user-id';
    const mockPriceId = 'price_123';
    const mockCustomerId = 'cus_123';
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
        stripe_js_1.loadStripe.mockResolvedValue({
            redirectToCheckout: vitest_1.vi.fn().mockResolvedValue({ error: null }),
        });
    });
    test('creates checkout session successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSessionId = 'cs_123';
        supabase_1.supabase.functions.invoke.mockResolvedValue({
            data: { sessionId: mockSessionId },
            error: null,
        });
        yield (0, stripe_1.createCheckoutSession)(mockUserId, mockPriceId);
        expect(supabase_1.supabase.functions.invoke).toHaveBeenCalledWith('create-checkout-session', {
            body: { priceId: mockPriceId, userId: mockUserId },
        });
        expect(stripe_js_1.loadStripe).toHaveBeenCalled();
    }));
    test('handles checkout session error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Failed to create session');
        supabase_1.supabase.functions.invoke.mockRejectedValue(error);
        yield expect((0, stripe_1.createCheckoutSession)(mockUserId, mockPriceId)).rejects.toThrow('Failed to create session');
    }));
    test('creates portal session successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUrl = 'https://billing.stripe.com/session';
        supabase_1.supabase.functions.invoke.mockResolvedValue({
            data: { url: mockUrl },
            error: null,
        });
        const windowSpy = vitest_1.vi.spyOn(window, 'location', 'get');
        delete window.location;
        window.location = { href: '' };
        yield (0, stripe_1.createPortalSession)(mockCustomerId);
        expect(supabase_1.supabase.functions.invoke).toHaveBeenCalledWith('create-portal-session', {
            body: { customerId: mockCustomerId },
        });
        expect(window.location.href).toBe(mockUrl);
        windowSpy.mockRestore();
    }));
    test('handles portal session error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Failed to create portal session');
        supabase_1.supabase.functions.invoke.mockRejectedValue(error);
        yield expect((0, stripe_1.createPortalSession)(mockCustomerId)).rejects.toThrow('Failed to create portal session');
    }));
});
