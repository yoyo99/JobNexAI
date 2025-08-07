import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase'; // Assuming supabase client is exported from here

// Define the shape of the scraping target for type safety
interface ScrapingTarget {
  platform: 'linkedin' | 'indeed' | 'welcometothejungle';
  keywords: string[];
  location: string;
  filters?: any;
}

export function useJobQueue() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addScrapingJob = async (target: ScrapingTarget) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs', {
        body: { target }
      });

      if (error) throw error;
      
      // Start polling to track the job's progress
      if (data.jobId) {
        pollJobStatus(data.jobId);
      }
      
    } catch (error) {
      console.error('Error adding scraping job:', error);
    } finally {
      setLoading(false);
    }
  };

  const pollJobStatus = useCallback((jobId: string) => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('job_queue')
        .select('status')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error('Error polling job status:', error);
        clearInterval(interval);
        return;
      }

      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(interval);
        // Optionally, refresh the list of jobs or trigger a notification
        console.log(`Job ${jobId} finished with status: ${data.status}`);
        // refreshJobs(); // You would implement this function to refetch job data
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Add a function to refresh jobs if needed
  const refreshJobs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error refreshing jobs:', error);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  }, []);

  // Initial fetch of jobs
  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  return { jobs, loading, addScrapingJob, refreshJobs };
}
