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
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const Auth_1 = require("../Auth");
const supabase_1 = require("../../lib/supabase");
const react_router_dom_1 = require("react-router-dom");
vitest_1.vi.mock('react-router-dom', () => ({
    useNavigate: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: vitest_1.vi.fn(),
            signUp: vitest_1.vi.fn(),
        },
    },
}));
describe('Auth Component', () => {
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
    });
    test('renders login form', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Auth_1.Auth, {}));
        expect(react_1.screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(react_1.screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(react_1.screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
    test('handles successful login', () => __awaiter(void 0, void 0, void 0, function* () {
        const navigate = vitest_1.vi.fn();
        react_router_dom_1.useNavigate.mockReturnValue(navigate);
        supabase_1.supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Auth_1.Auth, {}));
        react_1.fireEvent.change(react_1.screen.getByPlaceholderText(/email/i), {
            target: { value: 'test@example.com' },
        });
        react_1.fireEvent.change(react_1.screen.getByPlaceholderText(/password/i), {
            target: { value: 'password123' },
        });
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /login/i }));
        yield (0, react_1.waitFor)(() => {
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });
    }));
    test('handles login error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Invalid credentials');
        supabase_1.supabase.auth.signInWithPassword.mockRejectedValue(error);
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Auth_1.Auth, {}));
        react_1.fireEvent.change(react_1.screen.getByPlaceholderText(/email/i), {
            target: { value: 'test@example.com' },
        });
        react_1.fireEvent.change(react_1.screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrongpassword' },
        });
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /login/i }));
        yield (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText(/incorrect email or password/i)).toBeInTheDocument();
        });
    }));
});
