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
const CVBuilder_1 = require("../CVBuilder");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
vitest_1.vi.mock('../../stores/auth', () => ({
    useAuth: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vitest_1.vi.fn(() => ({
            upsert: vitest_1.vi.fn(),
        })),
    },
}));
describe('CVBuilder Component', () => {
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
        auth_1.useAuth.mockReturnValue({
            user: { id: 'test-user-id' },
        });
    });
    test('renders CV builder form', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(CVBuilder_1.CVBuilder, {}));
        expect(react_1.screen.getByText(/créateur de cv/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/formation/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/expérience professionnelle/i)).toBeInTheDocument();
        expect(react_1.screen.getByText(/compétences/i)).toBeInTheDocument();
    });
    test('adds new education item', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(CVBuilder_1.CVBuilder, {}));
        const addButton = react_1.screen.getAllByText(/ajouter/i)[0];
        react_1.fireEvent.click(addButton);
        expect(react_1.screen.getByPlaceholderText(/titre du diplôme/i)).toBeInTheDocument();
    });
    test('saves CV successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const upsertMock = vitest_1.vi.fn().mockResolvedValue({ error: null });
        supabase_1.supabase.from.mockReturnValue({
            upsert: upsertMock,
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(CVBuilder_1.CVBuilder, {}));
        const saveButton = react_1.screen.getByText(/enregistrer le cv/i);
        react_1.fireEvent.click(saveButton);
        yield (0, react_1.waitFor)(() => {
            expect(upsertMock).toHaveBeenCalled();
        });
    }));
});
