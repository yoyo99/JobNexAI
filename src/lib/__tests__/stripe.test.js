var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { vi } from 'vitest';
import { createCheckoutSession, createPortalSession } from '../stripe';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase';
vi.mock('@stripe/stripe-js', () => ({
    loadStripe: vi.fn(),
}));
vi.mock('../supabase', () => ({
    supabase: {
        functions: {
            invoke: vi.fn(),
        },
    },
}));
describe('Stripe Functions', () => {
    const mockUserId = 'test-user-id';
    const mockPriceId = 'price_123';
    const mockCustomerId = 'cus_123';
    beforeEach(() => {
        vi.clearAllMocks();
        loadStripe.mockResolvedValue({
            redirectToCheckout: vi.fn().mockResolvedValue({ error: null }),
        });
    });
    test('creates checkout session successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockSessionId = 'cs_123';
        supabase.functions.invoke.mockResolvedValue({
            data: { sessionId: mockSessionId },
            error: null,
        });
        yield createCheckoutSession(mockUserId, mockPriceId);
        expect(supabase.functions.invoke).toHaveBeenCalledWith('create-checkout-session', {
            body: { priceId: mockPriceId, userId: mockUserId },
        });
        expect(loadStripe).toHaveBeenCalled();
    }));
    test('handles checkout session error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Failed to create session');
        supabase.functions.invoke.mockRejectedValue(error);
        yield expect(createCheckoutSession(mockUserId, mockPriceId)).rejects.toThrow('Failed to create session');
    }));
    test('creates portal session successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUrl = 'https://billing.stripe.com/session';
        supabase.functions.invoke.mockResolvedValue({
            data: { url: mockUrl },
            error: null,
        });
        const windowSpy = vi.spyOn(window, 'location', 'get');
        delete window.location;
        window.location = { href: '' };
        yield createPortalSession(mockCustomerId);
        expect(supabase.functions.invoke).toHaveBeenCalledWith('create-portal-session', {
            body: { customerId: mockCustomerId },
        });
        expect(window.location.href).toBe(mockUrl);
        windowSpy.mockRestore();
    }));
    test('handles portal session error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Failed to create portal session');
        supabase.functions.invoke.mockRejectedValue(error);
        yield expect(createPortalSession(mockCustomerId)).rejects.toThrow('Failed to create portal session');
    }));
});
