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
import { optimizeCV } from '../ai';
import { supabase } from '../supabase';
vi.mock('../supabase', () => ({
    supabase: {
        functions: {
            invoke: vi.fn(),
        },
    },
}));
describe('AI Functions', () => {
    const mockCV = {
        education: [
            {
                title: 'Master en Informatique',
                school: 'Université de Paris',
                year: 2020,
            },
        ],
        experience: [
            {
                title: 'Développeur Full Stack',
                company: 'Tech Corp',
                duration: '2020-2023',
            },
        ],
    };
    const mockJobDescription = 'Nous recherchons un développeur React expérimenté...';
    beforeEach(() => {
        vi.clearAllMocks();
    });
    test('optimizes CV successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResponse = {
            suggestions: 'Mettez en avant vos compétences React...',
            keywords: ['React', 'TypeScript', 'Node.js'],
        };
        supabase.functions.invoke.mockResolvedValue({
            data: mockResponse,
            error: null,
        });
        const result = yield optimizeCV(mockCV, mockJobDescription);
        expect(result).toEqual(mockResponse);
        expect(supabase.functions.invoke).toHaveBeenCalledWith('optimize-cv', {
            body: { cv: mockCV, jobDescription: mockJobDescription },
        });
    }));
    test('handles optimization error', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Failed to optimize CV');
        supabase.functions.invoke.mockRejectedValue(error);
        yield expect(optimizeCV(mockCV, mockJobDescription)).rejects.toThrow('Failed to optimize CV');
    }));
});
