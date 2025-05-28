import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CoverLetterGenerator from '../../src/components/CoverLetterGenerator';
import { useAuth } from '../../src/stores/auth';
// Note: supabase functions will be imported AFTER jest.mock call

// Mock des modules et fonctions externes
jest.mock('../../src/stores/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../src/lib/supabase', () => ({
  getUserCVs: jest.fn(), // Factory returns jest.fn() directly
  invokeExtractCvText: jest.fn(),
  invokeGenerateCoverLetter: jest.fn(),
}));

// Now import the mocked functions from supabase
import { getUserCVs, invokeExtractCvText, invokeGenerateCoverLetter } from '../../src/lib/supabase';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock pour t function
    i18n: {
      changeLanguage: jest.fn(),
      language: 'fr', // Langue par défaut pour les tests
    },
  }),
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockCVs = [
  { id: 'cv1', file_name: 'CV_Primaire.pdf', storage_path: 'bucket/cv1.pdf', uploaded_at: new Date().toISOString(), is_primary: true, user_id: mockUser.id, extracted_text: null, metadata: null },
  { id: 'cv2', file_name: 'CV_Secondaire.pdf', storage_path: 'bucket/cv2.pdf', uploaded_at: new Date().toISOString(), is_primary: false, user_id: mockUser.id, extracted_text: null, metadata: null },
];

describe('CoverLetterGenerator', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    (useAuth as unknown as jest.Mock).mockReturnValue({ user: mockUser, session: {} });
    
    (getUserCVs as jest.Mock).mockReset();
    // Default successful implementation with logging
    (getUserCVs as jest.Mock).mockImplementation(async (userId: string) => {
      console.log('[TEST DEBUG] mockGetUserCVs (default implementation) called with userId:', userId);
      return mockCVs;
    });

    (invokeExtractCvText as jest.Mock).mockReset();
    (invokeExtractCvText as jest.Mock).mockResolvedValue({ extractedText: 'Texte du CV extrait', totalPages: 1, meta: {} });

    (invokeGenerateCoverLetter as jest.Mock).mockReset();
    (invokeGenerateCoverLetter as jest.Mock).mockResolvedValue({ coverLetter: 'Lettre de motivation générée.' });
  });

  test('devrait afficher le formulaire avec les champs initiaux et charger les CVs', async () => {
    render(<CoverLetterGenerator />);

    // Vérifier la présence des champs principaux
    expect(screen.getByLabelText('coverLetterGenerator.labels.jobTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('coverLetterGenerator.labels.companyName')).toBeInTheDocument();
    expect(screen.getByLabelText('coverLetterGenerator.labels.jobDescription')).toBeInTheDocument();
    expect(screen.getByLabelText('coverLetterGenerator.labels.cv')).toBeInTheDocument(); // Le sélecteur de CV

    // Vérifier que getUserCVs a été appelé
    expect(getUserCVs).toHaveBeenCalledWith(mockUser.id);

    // Attendre que les CVs soient chargés et affichés dans le sélecteur
    await waitFor(() => {
      expect(screen.getByText('CV_Primaire.pdf (' + new Date(mockCVs[0].uploaded_at).toLocaleDateString() + ')')).toBeInTheDocument();
      expect(screen.getByText('CV_Secondaire.pdf (' + new Date(mockCVs[1].uploaded_at).toLocaleDateString() + ')')).toBeInTheDocument();
    });

    // Vérifier que le CV primaire est sélectionné par défaut
    const cvSelect = screen.getByLabelText('coverLetterGenerator.labels.cv') as HTMLSelectElement;
    expect(cvSelect.value).toBe('cv1');
  });

  test('devrait afficher un message d\'erreur si le chargement des CVs échoue', async () => {
    // Forcer getUserCVs à retourner une erreur qui n'est pas une instance de Error
    // pour que le composant utilise t('coverLetterGenerator.errors.fetchCvError')
    (getUserCVs as jest.Mock).mockRejectedValueOnce('Simulated CV fetch error, not an Error instance');

    render(<CoverLetterGenerator />);

    // Attendre que le message d'erreur s'affiche
    // Note: nous utilisons findByText car le message peut apparaître de manière asynchrone
    expect(await screen.findByText('coverLetterGenerator.errors.fetchCvError')).toBeInTheDocument();

    // Vérifier que le sélecteur de CV n'est pas désactivé par isLoading (car le chargement est terminé, même avec une erreur)
    const cvSelect = screen.getByLabelText('coverLetterGenerator.labels.cv') as HTMLSelectElement;
    // Le sélecteur peut être désactivé si aucun CV n'est chargé et qu'il n'y a pas d'option valide,
    // mais il ne doit pas être désactivé à cause de l'état isLoading.
    // Pour ce test, nous vérifions surtout que le message d'erreur est là.
    // Si le composant désactive le select en cas d'erreur de chargement des CVs, ce test pourrait avoir besoin d'ajustement.
    // Pour l'instant, la logique du composant ne semble pas désactiver le select en cas d'erreur de fetch, seulement pendant le fetch.
    expect(cvSelect).not.toHaveAttribute('disabled'); 
    // Ou plus spécifiquement, si on veut s'assurer qu'il n'est pas désactivé à cause de `isLoading`
    // on pourrait avoir besoin de vérifier l'absence du spinner si celui-ci était conditionné par `isLoading` uniquement.
  });

  // D'autres tests viendront ici...
});
