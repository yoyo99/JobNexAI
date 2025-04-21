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
import { generateApplicationPDF, downloadApplicationPDF } from '../pdf';
import pdfMake from 'pdfmake/build/pdfmake';
vi.mock('pdfmake/build/pdfmake', () => ({
    default: {
        vfs: {},
        fonts: {},
        createPdf: vi.fn(),
    },
}));
vi.mock('pdfmake/build/vfs_fonts', () => ({
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
        vi.clearAllMocks();
        pdfMake.createPdf.mockReturnValue({
            getBlob: (callback) => callback(new Blob()),
        });
    });
    test('generates PDF successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const blob = yield generateApplicationPDF(mockApplication);
        expect(pdfMake.createPdf).toHaveBeenCalledWith(expect.objectContaining({
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
        pdfMake.createPdf.mockReturnValue({
            getBlob: () => {
                throw error;
            },
        });
        yield expect(generateApplicationPDF(mockApplication)).rejects.toThrow('PDF generation failed');
    }));
    test('downloads PDF', () => __awaiter(void 0, void 0, void 0, function* () {
        const createElementSpy = vi.spyOn(document, 'createElement');
        const appendChildSpy = vi.spyOn(document.body, 'appendChild');
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const clickSpy = vi.fn();
        createElementSpy.mockReturnValue({
            href: '',
            download: '',
            click: clickSpy,
        });
        yield downloadApplicationPDF(mockApplication);
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(appendChildSpy).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalled();
        expect(removeChildSpy).toHaveBeenCalled();
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    }));
});
