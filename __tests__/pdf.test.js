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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pdf_1 = require("../pdf");
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
vitest_1.vi.mock('pdfmake/build/pdfmake', () => ({
    default: {
        vfs: {},
        fonts: {},
        createPdf: vitest_1.vi.fn(),
    },
}));
vitest_1.vi.mock('pdfmake/build/vfs_fonts', () => ({
    pdfMake: {
        vfs: {},
    },
}));
describe('PDF Functions', () => {
    const mockApplication = {
        id: '123',
        job: {
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Paris',
        },
        status: 'applied',
        notes: 'Test notes',
        created_at: '2024-01-01T00:00:00Z',
        timeline: [
            {
                date: '2024-01-01T00:00:00Z',
                description: 'Application submitted',
            },
        ],
    };
    beforeEach(() => {
        vitest_1.vi.clearAllMocks();
        pdfmake_1.default.createPdf.mockReturnValue({
            getBlob: (callback) => callback(new Blob()),
        });
    });
    test('generates PDF successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const blob = yield (0, pdf_1.generateApplicationPDF)(mockApplication);
        expect(pdfmake_1.default.createPdf).toHaveBeenCalledWith(expect.objectContaining({
            content: expect.arrayContaining([
                expect.objectContaining({
                    text: 'Détails de la candidature',
                }),
            ]),
        }));
        expect(blob).toBeInstanceOf(Blob);
    }));
    test('handles PDF generation error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('PDF generation failed');
        pdfmake_1.default.createPdf.mockReturnValue({
            getBlob: () => {
                throw error;
            },
        });
        yield expect((0, pdf_1.generateApplicationPDF)(mockApplication)).rejects.toThrow('PDF generation failed');
    }));
    test('downloads PDF', () => __awaiter(void 0, void 0, void 0, function* () {
        const createElementSpy = vitest_1.vi.spyOn(document, 'createElement');
        const appendChildSpy = vitest_1.vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vitest_1.vi.spyOn(document.body, 'removeChild');
        const clickSpy = vitest_1.vi.fn();
        createElementSpy.mockReturnValue({
            href: '',
            download: '',
            click: clickSpy,
        });
        yield (0, pdf_1.downloadApplicationPDF)(mockApplication);
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    }));
});
