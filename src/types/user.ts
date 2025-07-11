// src/types/user.ts

export interface UserPreferencesAuth {
  id?: string;
  user_id?: string;
  job_types?: string[];
  preferred_locations?: string[];
  min_salary?: number | null;
  max_salary?: number | null;
  remote_preference?: 'remote' | 'hybrid' | 'onsite' | 'any' | null;
  preferred_currency?: string | null;
}

// D'autres types liés à l'utilisateur pourront être ajoutés ici.
