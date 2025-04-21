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
const Network_1 = require("../Network");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
vitest_1.vi.mock('../../stores/auth', () => ({
    useAuth: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vitest_1.vi.fn(() => ({
            select: vitest_1.vi.fn(() => ({
                eq: vitest_1.vi.fn(() => ({
                    or: vitest_1.vi.fn(() => ({
                        order: vitest_1.vi.fn(() => ({
                            limit: vitest_1.vi.fn().mockResolvedValue({ data: [] }),
                        })),
                    })),
                })),
            })),
        })),
        channel: vitest_1.vi.fn(() => ({
            on: vitest_1.vi.fn().mockReturnThis(),
            subscribe: vitest_1.vi.fn(),
        })),
        removeChannel: vitest_1.vi.fn(),
    },
}));
describe('Network Component', () => {
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
    };
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
        auth_1.useAuth.mockReturnValue({ user: mockUser });
    });
    test('renders network component', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Network_1.Network, {}));
        expect(react_1.screen.getByText(/réseau professionnel/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/connexions/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/messages/i)).toBeInTheDocument();
    });
    test('loads connections on mount', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockConnections = [
            {
                id: '1',
                user_id: mockUser.id,
                connected_user_id: 'other-user',
                status: 'accepted',
                connected_user: {
                    full_name: 'John Doe',
                    title: 'Developer',
                    company: 'Tech Corp',
                },
            },
        ];
        supabase_1.supabase.from.mockReturnValue({
            select: vitest_1.vi.fn().mockReturnValue({
                eq: vitest_1.vi.fn().mockReturnValue({
                    or: vitest_1.vi.fn().mockResolvedValue({ data: mockConnections }),
                }),
            }),
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Network_1.Network, {}));
        yield (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('John Doe')).toBeInTheDocument();
            expect(react_1.screen.getByText('Developer')).toBeInTheDocument();
            expect(react_1.screen.getByText('Tech Corp')).toBeInTheDocument();
        });
    }));
    test('sends message', () => __awaiter(void 0, void 0, void 0, function* () {
        const insertMock = vitest_1.vi.fn().mockResolvedValue({ error: null });
        supabase_1.supabase.from.mockReturnValue({
            select: vitest_1.vi.fn().mockReturnValue({
                eq: vitest_1.vi.fn().mockReturnValue({
                    or: vitest_1.vi.fn().mockResolvedValue({ data: [] }),
                }),
            }),
            insert: insertMock,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Network_1.Network, {}));
        // Sélectionner un contact et envoyer un message
        const messageInput = react_1.screen.getByPlaceholderText(/écrivez votre message/i);
        react_1.fireEvent.change(messageInput, { target: { value: 'Hello!' } });
        const sendButton = react_1.screen.getByText(/envoyer/i);
        react_1.fireEvent.click(sendButton);
        yield (0, react_1.waitFor)(() => {
            expect(insertMock).toHaveBeenCalledWith({
                sender_id: mockUser.id,
                content: 'Hello!',
                receiver_id: expect.any(String),
            });
        });
    }));
    test('accepts connection request', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateMock = vitest_1.vi.fn().mockResolvedValue({ error: null });
        supabase_1.supabase.from.mockReturnValue({
            update: updateMock,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Network_1.Network, {}));
        const acceptButton = react_1.screen.getByText(/accepter/i);
        react_1.fireEvent.click(acceptButton);
        yield (0, react_1.waitFor)(() => {
            expect(updateMock).toHaveBeenCalledWith({
                status: 'accepted',
            });
        });
    }));
});
