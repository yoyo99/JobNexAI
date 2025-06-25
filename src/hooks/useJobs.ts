import { useState, useCallback } from 'react';
import { api, ApiResponse } from '../utils/api';
import { mapApiError, logError, AppError } from '../utils/error-handling';
import { useAuth } from './useAuth';

// Types
export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  remote?: boolean;
  sector?: string;
  contractType?: string;
  postedAt: string;
  postedById: string;
  skills?: string[];
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  remote?: boolean;
  sector?: string;
  contractType?: string;
  postedById?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface JobResult<T = any> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
  refetch?: () => Promise<void>;
}

export function useJobs() {
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useAuth();

  // Fonction utilitaire pour obtenir le token d'authentification
  const getAuthHeaders = useCallback(() => {
    return {
      token: session?.access_token
    };
  }, [session]);

  // Fonction pour traiter la réponse API et standardiser les retours
  const processApiResponse = useCallback(<T>(response: ApiResponse<T>): JobResult<T> => {
    if (response.error) {
      const error = mapApiError(response.error, response.status);
      logError(error, 'useJobs.processResponse');
      return { data: null, error, loading: false };
    }
    
    return { data: response.data, error: null, loading: false };
  }, []);

  /**
   * Récupérer la liste des offres d'emploi avec filtres optionnels
   */
  const getJobs = useCallback(async (filters?: JobFilters): Promise<JobResult<Job[]>> => {
    try {
      setLoading(true);
      
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      // Construire l'URL avec les paramètres
      const endpoint = `jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await api.get(endpoint, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<Job[]>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.getJobs');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Récupérer une offre d'emploi par son ID
   */
  const getJobById = useCallback(async (jobId: string): Promise<JobResult<Job>> => {
    try {
      setLoading(true);
      const response = await api.get(`jobs/${jobId}`, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<Job>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.getJobById');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Créer une nouvelle offre d'emploi
   */
  const createJob = useCallback(async (jobData: Omit<Job, 'id' | 'postedAt' | 'postedById' | 'createdAt' | 'updatedAt'>): Promise<JobResult<Job>> => {
    try {
      setLoading(true);
      const response = await api.post('jobs', jobData, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<Job>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.createJob');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Mettre à jour une offre d'emploi existante
   */
  const updateJob = useCallback(async (jobId: string, jobData: Partial<Job>): Promise<JobResult<Job>> => {
    try {
      setLoading(true);
      const response = await api.put(`jobs/${jobId}`, jobData, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<Job>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.updateJob');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Supprimer une offre d'emploi
   */
  const deleteJob = useCallback(async (jobId: string): Promise<JobResult<{ success: boolean }>> => {
    try {
      setLoading(true);
      const response = await api.delete(`jobs/${jobId}`, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<{ success: boolean }>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.deleteJob');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Récupérer les candidatures pour une offre spécifique (employeur)
   */
  const getJobApplications = useCallback(async (jobId: string): Promise<JobResult<JobApplication[]>> => {
    try {
      setLoading(true);
      const response = await api.get(`jobs/${jobId}/applications`, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<JobApplication[]>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.getJobApplications');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Postuler à une offre d'emploi
   */
  const applyToJob = useCallback(async (jobId: string, applicationData: { coverLetter?: string; resumeUrl?: string }): Promise<JobResult<JobApplication>> => {
    try {
      setLoading(true);
      const response = await api.post(`jobs/${jobId}/apply`, applicationData, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<JobApplication>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.applyToJob');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Récupérer les candidatures de l'utilisateur actuel (chercheur d'emploi)
   */
  const getMyApplications = useCallback(async (): Promise<JobResult<JobApplication[]>> => {
    try {
      setLoading(true);
      const response = await api.get('applications/me', getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<JobApplication[]>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.getMyApplications');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  /**
   * Mettre à jour le statut d'une candidature (employeur)
   */
  const updateApplicationStatus = useCallback(async (
    jobId: string, 
    applicationId: string, 
    status: 'pending' | 'reviewed' | 'interviewing' | 'accepted' | 'rejected'
  ): Promise<JobResult<JobApplication>> => {
    try {
      setLoading(true);
      const response = await api.put(`jobs/${jobId}/applications/${applicationId}`, { status }, getAuthHeaders());
      setLoading(false);
      
      return processApiResponse<JobApplication>(response);
    } catch (error) {
      setLoading(false);
      const mappedError = mapApiError(error);
      logError(mappedError, 'useJobs.updateApplicationStatus');
      return { data: null, error: mappedError, loading: false };
    }
  }, [getAuthHeaders, processApiResponse]);
  
  return {
    loading,
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getJobApplications,
    applyToJob,
    getMyApplications,
    updateApplicationStatus
  };
}
