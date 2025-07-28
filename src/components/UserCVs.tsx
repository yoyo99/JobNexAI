import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { uploadUserCV, getUserCVs, deleteUserCV, setPrimaryCV, CVMetadata } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { testRLSPolicies } from '../utils/testRLS';
import { FaUpload, FaTrash, FaCheckCircle, FaTimesCircle, FaSpinner, FaFilePdf } from 'react-icons/fa'; // Exemple d'icônes

interface UserCVsProps {
  userId: string;
}

const UserCVs: React.FC<UserCVsProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [cvs, setCvs] = useState<CVMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzingCvId, setAnalyzingCvId] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchCVs = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const userCVs = await getUserCVs(userId);
      setCvs(userCVs);
    } catch (err: any) {
      setError(err.message || t('userCVs.errors.fetchFailed'));
      console.error('Failed to fetch CVs:', err);
    }
    setIsLoading(false);
  }, [userId, t]);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
        setFeedbackMessage({ type: 'error', text: t('userCVs.errors.fileTooLarge') });
        setFileToUpload(null);
        return;
      }
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.text', // ODT (LibreOffice/OpenOffice)
        'application/rtf', // RTF (Rich Text Format)
        'text/rtf' // RTF alternative MIME type
      ];
    if (!allowedTypes.includes(file.type)) {
         setFeedbackMessage({ type: 'error', text: t('userCVs.errors.invalidFileType') });
         setFileToUpload(null);
         return;
      }
      setFileToUpload(file);
      setFeedbackMessage(null);
    }
  };

  const handleUploadCV = async () => {
    if (!fileToUpload || !userId) return;
    if (cvs.length >= 2) {
      setFeedbackMessage({ type: 'error', text: t('userCVs.errors.limitReached') });
      return;
    }
    setUploading(true);
    setFeedbackMessage(null);
    
    console.log('🚀 [UserCVs] Début upload CV:', {
      fileName: fileToUpload.name,
      fileSize: fileToUpload.size,
      fileType: fileToUpload.type,
      userId: userId
    });
    
    try {
            const result = await uploadUserCV(userId, fileToUpload);
      console.log('✅ [UserCVs] Upload réussi:', result);

      // Lancer l'analyse en arrière-plan
      setAnalyzingCvId(result.id);
      setFeedbackMessage({ type: 'success', text: t('userCVs.success.analysisInProgress') });

      try {
        console.log(`🚀 [UserCVs] Lancement du parsing pour le CV ID: ${result.id}`);
        console.log('Détails de l\'appel:', {
          function: 'parse-cv-v2',
          cvId: result.id,
          cvPath: result.storage_path,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL
        });
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('User not authenticated. Cannot call Edge Function.');
        }

        const parseResponse = await supabase.functions.invoke('parse-cv-v2', {
          body: { 
            cvId: result.id, 
            cvPath: result.storage_path 
          },
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        console.log('Réponse brute de parse-cv-v2:', parseResponse);
        
        if (parseResponse.error) {
          console.error('Erreur détaillée du parsing:', {
            error: parseResponse.error,
            message: parseResponse.error.message,
            status: parseResponse.status,
            statusText: parseResponse.statusText
          });
          throw new Error(`Erreur lors du parsing: ${parseResponse.error.message}`);
        }
        
        console.log(`✅ [UserCVs] Parsing terminé pour le CV ID: ${result.id}`, parseResponse.data);

        console.log(`🚀 [UserCVs] Lancement de l'analyse pour le CV ID: ${result.id}`);
        const analyzeResponse = await supabase.functions.invoke('analyze-cv-v2', {
          body: { cvId: result.id },
        });
        
        console.log('Réponse brute de analyze-cv-v2:', analyzeResponse);
        
        if (analyzeResponse.error) {
          console.error('Erreur détaillée de l\'analyse:', analyzeResponse.error);
          throw new Error(`Erreur lors de l'analyse: ${analyzeResponse.error.message}`);
        }
        
        console.log(`✅ [UserCVs] Analyse terminée. Résultat:`, analyzeResponse.data);

        setFeedbackMessage({ type: 'success', text: t('userCVs.success.analysisDone') });

      } catch (analysisError: any) {
        console.error('❌ [UserCVs] Erreur durant l\'analyse:', analysisError);
        setFeedbackMessage({ type: 'error', text: `${t('userCVs.errors.analysisFailed')}: ${analysisError.message}` });
      } finally {
        setAnalyzingCvId(null);
        fetchCVs(); // Recharger la liste pour mettre à jour les statuts/données
      }

      // Réinitialiser le formulaire d'upload immédiatement après l'upload
      setFileToUpload(null);
      const fileInput = document.getElementById('cv-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error('❌ [UserCVs] Upload échoué:', err);
      console.error('❌ [UserCVs] Détails de l\'erreur:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        statusCode: err.statusCode
      });
      
      // Message d'erreur plus détaillé pour l'utilisateur
      let userMessage = err.message || t('userCVs.errors.uploadFailed');
      if (err.message && err.message.includes('bucket')) {
        userMessage = 'Erreur de configuration du stockage. Le bucket "cvs" n\'existe pas ou n\'est pas accessible.';
      }
      
      setFeedbackMessage({ type: 'error', text: userMessage });
    }
    setUploading(false);
  };

  const handleDeleteCV = async (cvId: string, storagePath: string) => {
    if (!window.confirm(t('userCVs.confirmDelete'))) return;
    setIsLoading(true); // Peut-être un autre loader pour la suppression spécifique
    setFeedbackMessage(null);
    try {
      await deleteUserCV(cvId, storagePath);
      setFeedbackMessage({ type: 'success', text: t('userCVs.success.delete') });
      fetchCVs(); // Recharger la liste
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || t('userCVs.errors.deleteFailed') });
      console.error('Delete failed:', err);
    }
    setIsLoading(false);
  };

  const handleSetPrimaryCV = async (cvId: string) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      await setPrimaryCV(userId, cvId);
      setFeedbackMessage({ type: 'success', text: t('userCVs.success.primarySet') });
      fetchCVs(); // Recharger la liste pour refléter le changement
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || t('userCVs.errors.primarySetFailed') });
      console.error('Set primary failed:', err);
    }
    setIsLoading(false);
  };

  if (isLoading && cvs.length === 0) {
    return <div className="flex justify-center items-center p-4"><FaSpinner className="animate-spin text-xl text-primary-400" /> <span className="ml-2">{t('common.loading')}</span></div>;
  }

  if (error && cvs.length === 0) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">{t('userCVs.title')}</h3>

      {feedbackMessage && (
        <div className={`p-3 rounded-md text-sm ${feedbackMessage.type === 'success' ? 'bg-green-900/70 text-green-300' : 'bg-red-900/70 text-red-300'}`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Section d'upload */} 
      {cvs.length < 2 && (
        <div className="bg-white/5 p-4 rounded-lg shadow">
          <label htmlFor="cv-upload-input" className="block text-sm font-medium text-gray-300 mb-1">
            {t('userCVs.uploadLabel')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="cv-upload-input"
              accept=".pdf,.doc,.docx,.odt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/rtf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600 disabled:opacity-50"
              disabled={uploading}
            />
            <button
              onClick={handleUploadCV}
              disabled={!fileToUpload || uploading || cvs.length >= 2}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50 flex items-center"
            >
              {uploading ? <FaSpinner className="animate-spin mr-2" /> : <FaUpload className="mr-2" />} 
              {t('userCVs.uploadButton')}
            </button>
          </div>
          {fileToUpload && <p className='text-xs text-gray-400 mt-1'>{t('userCVs.selectedFile')}: {fileToUpload.name}</p>}
          <p className="text-xs text-gray-500 mt-1">{t('userCVs.uploadHint', { count: 2 - cvs.length })}</p>
        </div>
      )}
      {cvs.length >= 2 && (
         <p className="text-sm text-amber-500 bg-amber-900/50 p-3 rounded-md">{t('userCVs.limitReachedMessage')}</p>
      )}

      {/* Liste des CVs */} 
      {cvs.length > 0 ? (
        <ul className="space-y-3">
          {cvs.map((cv) => (
                        <li key={cv.id} className="bg-white/5 p-3 rounded-lg shadow flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center">
                <FaFilePdf className="text-2xl text-primary-400 mr-3" />
                <div>
                                    <p className="font-medium text-white">{cv.file_name}</p>
                  {analyzingCvId === cv.id && (
                    <div className="flex items-center text-xs text-amber-400 mt-1">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>{t('userCVs.analysisInProgress')}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    {t('userCVs.uploadedOn', { date: new Date(cv.uploaded_at).toLocaleDateString() })}
                    {cv.file_size && ` - ${(cv.file_size / 1024 / 1024).toFixed(2)} MB`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {cv.is_primary ? (
                  <span className="text-xs inline-flex items-center px-2 py-0.5 rounded-full bg-green-600 text-white">
                    <FaCheckCircle className="mr-1" /> {t('userCVs.primary')}
                  </span>
                ) : (
                  <button 
                    onClick={() => handleSetPrimaryCV(cv.id)}
                    className="text-xs text-gray-400 hover:text-primary-400 p-1 disabled:opacity-50"
                    disabled={isLoading}
                    title={t('userCVs.setAsPrimary')}
                  >
                    {t('userCVs.setAsPrimaryAction')}
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteCV(cv.id, cv.storage_path)}
                  className="text-red-500 hover:text-red-400 p-1 disabled:opacity-50"
                  disabled={isLoading}
                  title={t('userCVs.delete')}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p className="text-gray-400">{t('userCVs.noCVs')}</p>
      )}
    </div>
  );
};

export default UserCVs;
