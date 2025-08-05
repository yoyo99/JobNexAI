export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          retention_period: unknown | null
          scheduled_deletion_date: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          retention_period?: unknown | null
          scheduled_deletion_date?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          retention_period?: unknown | null
          scheduled_deletion_date?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_login_attempts: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: unknown
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_settings: {
        Row: {
          setting_name: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          setting_name: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          setting_name?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read_by: string[] | null
          room_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read_by?: string[] | null
          room_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read_by?: string[] | null
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_participants: {
        Row: {
          created_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          status: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      cv_analysis: {
        Row: {
          analysis_type: string
          created_at: string | null
          cv_id: string
          details: Json
          id: string
          score: number | null
        }
        Insert: {
          analysis_type: string
          created_at?: string | null
          cv_id: string
          details: Json
          id?: string
          score?: number | null
        }
        Update: {
          analysis_type?: string
          created_at?: string | null
          cv_id?: string
          details?: Json
          id?: string
          score?: number | null
        }
        Relationships: []
      }
      cv_data: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          template_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_data_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "cv_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_improvements: {
        Row: {
          applied: boolean | null
          created_at: string | null
          cv_id: string
          id: string
          priority: string | null
          section: string
          suggestion: string
        }
        Insert: {
          applied?: boolean | null
          created_at?: string | null
          cv_id: string
          id?: string
          priority?: string | null
          section: string
          suggestion: string
        }
        Update: {
          applied?: boolean | null
          created_at?: string | null
          cv_id?: string
          id?: string
          priority?: string | null
          section?: string
          suggestion?: string
        }
        Relationships: []
      }
      cv_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          structure: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          structure: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          structure?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      emails_sent: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          recipient_email: string | null
          resend_email_id: string | null
          sender_email: string | null
          status: string
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string | null
          resend_email_id?: string | null
          sender_email?: string | null
          status?: string
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string | null
          resend_email_id?: string | null
          sender_email?: string | null
          status?: string
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean | null
          job_types: string[]
          keywords: string[]
          last_sent_at: string | null
          locations: string[]
          salary_max: number | null
          salary_min: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          job_types?: string[]
          keywords?: string[]
          last_sent_at?: string | null
          locations?: string[]
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          job_types?: string[]
          keywords?: string[]
          last_sent_at?: string | null
          locations?: string[]
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          created_at: string | null
          id: string
          job_id: string
          next_step_date: string | null
          next_step_type: string | null
          notes: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          next_step_date?: string | null
          next_step_type?: string | null
          notes?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          next_step_date?: string | null
          next_step_type?: string | null
          notes?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_favorites: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_favorites_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_interviews: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          date: string
          id: string
          job_application_id: string
          location: string | null
          notes: string | null
          reminder_set: boolean | null
          type: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          date: string
          id?: string
          job_application_id: string
          location?: string | null
          notes?: string | null
          reminder_set?: boolean | null
          type: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          date?: string
          id?: string
          job_application_id?: string
          location?: string | null
          notes?: string | null
          reminder_set?: boolean | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_interviews_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_matches: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          data_processing_consent: boolean | null
          data_source: string | null
          id: string
          job_id: string
          location_match: boolean | null
          match_score: number | null
          processing_purpose: string | null
          salary_match: boolean | null
          skills_match_percentage: number | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          data_source?: string | null
          id?: string
          job_id: string
          location_match?: boolean | null
          match_score?: number | null
          processing_purpose?: string | null
          salary_match?: boolean | null
          skills_match_percentage?: number | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          data_processing_consent?: boolean | null
          data_source?: string | null
          id?: string
          job_id?: string
          location_match?: boolean | null
          match_score?: number | null
          processing_purpose?: string | null
          salary_match?: boolean | null
          skills_match_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          created_at: string | null
          id: string
          importance: string | null
          job_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance?: string | null
          job_id: string
          skill_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string | null
          job_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      job_sources: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      job_suggestions: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          match_score: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          match_score: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          match_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_suggestions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          created_at: string | null
          currency: string | null
          description: string | null
          experience_level: string | null
          id: string
          job_type: string
          location: string
          posted_at: string
          remote_type: string | null
          salary_max: number | null
          salary_min: number | null
          search_vector: unknown | null
          source_id: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          job_type: string
          location: string
          posted_at: string
          remote_type?: string | null
          salary_max?: number | null
          salary_min?: number | null
          search_vector?: unknown | null
          source_id?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          job_type?: string
          location?: string
          posted_at?: string
          remote_type?: string | null
          salary_max?: number | null
          salary_min?: number | null
          search_vector?: unknown | null
          source_id?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "job_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_translations: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          lang: string
          new_value: string | null
          old_value: string | null
          translation_key: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lang: string
          new_value?: string | null
          old_value?: string | null
          translation_key: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          lang?: string
          new_value?: string | null
          old_value?: string | null
          translation_key?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          connection_requests: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          in_app_notifications: boolean | null
          job_alerts: boolean | null
          messages: boolean | null
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_requests?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          job_alerts?: boolean | null
          messages?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_requests?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          job_alerts?: boolean | null
          messages?: boolean | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          channel: string
          content_template: string
          created_at: string | null
          id: string
          title_template: string
          type: string
          updated_at: string | null
        }
        Insert: {
          channel: string
          content_template: string
          created_at?: string | null
          id?: string
          title_template: string
          type: string
          updated_at?: string | null
        }
        Update: {
          channel?: string
          content_template?: string
          created_at?: string | null
          id?: string
          title_template?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_connections: {
        Row: {
          connected_user_id: string
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string | null
          id?: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          has_used_trial: boolean | null
          id: string
          is_admin: boolean | null
          linkedin: string | null
          location: string | null
          phone: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          title: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_type: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          has_used_trial?: boolean | null
          id: string
          is_admin?: boolean | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          title?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          has_used_trial?: boolean | null
          id?: string
          is_admin?: boolean | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          title?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      project_proposals: {
        Row: {
          bid_amount: number
          cover_letter: string
          created_at: string
          delivery_time: string | null
          freelancer_id: string
          id: string
          project_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bid_amount: number
          cover_letter: string
          created_at?: string
          delivery_time?: string | null
          freelancer_id: string
          id?: string
          project_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bid_amount?: number
          cover_letter?: string
          created_at?: string
          delivery_time?: string | null
          freelancer_id?: string
          id?: string
          project_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          created_at: string | null
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_history: {
        Row: {
          id: string
          lang: string
          new_value: string | null
          old_value: string | null
          translation_key: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          lang: string
          new_value?: string | null
          old_value?: string | null
          translation_key: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          lang?: string
          new_value?: string | null
          old_value?: string | null
          translation_key?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          auto: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          key: string
          lang: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          auto?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          key: string
          lang: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          auto?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          key?: string
          lang?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      user_ai_settings: {
        Row: {
          api_keys: Json
          created_at: string
          feature_engines: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          api_keys?: Json
          created_at?: string
          feature_engines?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          api_keys?: Json
          created_at?: string
          feature_engines?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_cover_letters: {
        Row: {
          ai_model_used: string | null
          company_name: string | null
          cover_letter_content: string
          created_at: string
          custom_instructions: string | null
          cv_id_used: string | null
          id: string
          job_description_details: string | null
          job_title: string | null
          language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          company_name?: string | null
          cover_letter_content: string
          created_at?: string
          custom_instructions?: string | null
          cv_id_used?: string | null
          id?: string
          job_description_details?: string | null
          job_title?: string | null
          language: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          company_name?: string | null
          cover_letter_content?: string
          created_at?: string
          custom_instructions?: string | null
          cv_id_used?: string | null
          id?: string
          job_description_details?: string | null
          job_title?: string | null
          language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cover_letters_cv_id_used_fkey"
            columns: ["cv_id_used"]
            isOneToOne: false
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cvs: {
        Row: {
          content: Json | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          is_primary: boolean
          storage_path: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_primary?: boolean
          storage_path: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_primary?: boolean
          storage_path?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_job_sources: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          data_retention_accepted: boolean | null
          expires_at: string | null
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          job_types: string[]
          marketing_consent: boolean | null
          max_salary: number | null
          min_salary: number | null
          preferred_currency: string | null
          preferred_locations: string[]
          remote_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_retention_accepted?: boolean | null
          expires_at?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          job_types?: string[]
          marketing_consent?: boolean | null
          max_salary?: number | null
          min_salary?: number | null
          preferred_currency?: string | null
          preferred_locations?: string[]
          remote_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_retention_accepted?: boolean | null
          expires_at?: string | null
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          job_types?: string[]
          marketing_consent?: boolean | null
          max_salary?: number | null
          min_salary?: number | null
          preferred_currency?: string | null
          preferred_locations?: string[]
          remote_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          notifications: Json
          privacy: Json
          Roles: string | null
          security: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notifications?: Json
          privacy?: Json
          Roles?: string | null
          security?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notifications?: Json
          privacy?: Json
          Roles?: string | null
          security?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: number | null
          skill_id: string
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          skill_id: string
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          skill_id?: string
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          roles: string
        }
        Insert: {
          created_at?: string
          id?: string
          roles: string
        }
        Update: {
          created_at?: string
          id?: string
          roles?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_cv: {
        Args: { p_cv_id: string }
        Returns: undefined
      }
      apply_auth_settings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_job_match_score: {
        Args: { p_user_id: string; p_job_id: string }
        Returns: number
      }
      calculate_job_suggestions: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      check_login_attempts: {
        Args: { p_user_id: string; p_ip_address: unknown }
        Returns: boolean
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_login_attempts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      export_cv_as_pdf: {
        Args: { p_user_id: string }
        Returns: string
      }
      generate_cv_pdf: {
        Args: { p_cv_id: string }
        Returns: string
      }
      get_or_create_user_preferences: {
        Args: { user_id: string }
        Returns: {
          created_at: string | null
          data_retention_accepted: boolean | null
          expires_at: string | null
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          job_types: string[]
          marketing_consent: boolean | null
          max_salary: number | null
          min_salary: number | null
          preferred_currency: string | null
          preferred_locations: string[]
          remote_preference: string | null
          updated_at: string | null
          user_id: string
        }[]
      }
      handle_data_deletion_request: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_recent_attempt: {
        Args: Record<PropertyKey, never> | { created_at: string }
        Returns: boolean
      }
      log_login_attempt: {
        Args: {
          p_user_id: string
          p_ip_address: unknown
          p_user_agent: string
          p_success: boolean
        }
        Returns: undefined
      }
      process_job_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_jobs: {
        Args: { search_query: string }
        Returns: {
          company: string
          created_at: string | null
          currency: string | null
          description: string | null
          experience_level: string | null
          id: string
          job_type: string
          location: string
          posted_at: string
          remote_type: string | null
          salary_max: number | null
          salary_min: number | null
          search_vector: unknown | null
          source_id: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string | null
        }[]
      }
      send_interview_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_job_matches: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
