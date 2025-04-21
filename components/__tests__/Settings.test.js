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
const Settings_1 = require("../Settings");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const react_i18next_1 = require("react-i18next");
vitest_1.vi.mock('../../stores/auth', () => ({
    useAuth: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('react-i18next', () => ({
    useTranslation: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vitest_1.vi.fn(() => ({
            upsert: vitest_1.vi.fn(),
        })),
    },
}));
describe('Settings Component', () => {
    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
    };
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
        auth_1.useAuth.mockReturnValue({ user: mockUser });
        react_i18next_1.useTranslation.mockReturnValue({
            t: (key) => key,
            i18n: {
                language: 'fr',
                changeLanguage: vitest_1.vi.fn(),
            },
        });
    });
    test('renders settings component', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Settings_1.Settings, {}));
        expect(react_1.screen.getByText(/paramètres/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/sécurité/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/notifications/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/confidentialité/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/langue/i)).toBeInTheDocument();
    });
    test('updates security settings', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const upsertMock = vitest_1.vi.fn().mockResolvedValue({ error: null });
        supabase_1.supabase.from.mockReturnValue({
            upsert: upsertMock,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Settings_1.Settings, {}));
        // Activer l'authentification à deux facteurs
        const mfaToggle = (_a = react_1.screen.getByText(/authentification à deux facteurs/i)
            .parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('button');
        react_1.fireEvent.click(mfaToggle);
        // Sauvegarder les paramètres
        const saveButton = react_1.screen.getByText(/enregistrer les paramètres/i);
        react_1.fireEvent.click(saveButton);
        yield (0, react_1.waitFor)(() => {
            expect(upsertMock).toHaveBeenCalledWith({
                user_id: mockUser.id,
                security: expect.objectContaining({
                    enable_mfa: true,
                }),
                updated_at: expect.any(String),
            });
        });
    }));
    test('updates notification settings', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const upsertMock = vitest_1.vi.fn().mockResolvedValue({ error: null });
        supabase_1.supabase.from.mockReturnValue({
            upsert: upsertMock,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Settings_1.Settings, {}));
        // Aller à l'onglet notifications
        const notificationsTab = react_1.screen.getByText(/notifications/i);
        react_1.fireEvent.click(notificationsTab);
        // Activer les notifications par email
        const emailToggle = (_a = react_1.screen.getByText(/notifications par email/i)
            .parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('button');
        react_1.fireEvent.click(emailToggle);
        // Sauvegarder les paramètres
        const saveButton = react_1.screen.getByText(/enregistrer les paramètres/i);
        react_1.fireEvent.click(saveButton);
        yield (0, react_1.waitFor)(() => {
            expect(upsertMock).toHaveBeenCalledWith({
                user_id: mockUser.id,
                notifications: expect.objectContaining({
                    email_notifications: true,
                }),
                updated_at: expect.any(String),
            });
        });
    }));
    test('changes language', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Settings_1.Settings, {}));
        // Aller à l'onglet langue
        const languageTab = react_1.screen.getByText(/langue/i);
        react_1.fireEvent.click(languageTab);
        // Changer la langue
        const englishButton = react_1.screen.getByText('English');
        react_1.fireEvent.click(englishButton);
        expect((0, react_i18next_1.useTranslation)().i18n.changeLanguage).toHaveBeenCalledWith('en');
    });
});
