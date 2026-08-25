import axios from 'axios';

// Create an axios instance with a base URL
// The backend runs on port 8000 by default (FastAPI)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

export interface JobResponse {
  job_id: string;
}

export interface JobStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary?: any; // The summary object from takeoff
  error?: string;
}

export interface TakeoffReport {
  schema_version: string;
  source_file: string;
  generated_at: string;
  summary: {
    total_length_m: number;
    unattributed_m: number;
    diameter_count: number;
    by_diameter: Array<{
      diameter_mm: number;
      diameter_label: string;
      length_m: number;
      share_pct: number;
      run_count: number;
      segment_count: number;
      confidence: number;
      services?: string[];
      materials?: string[];
    }>;
  };
  totals: {
    measured_centerline_m: number;
    attributed_m: number;
    coverage_pct: number;
  };
}

/**
 * Uploads a DWG or DXF file to start a takeoff job.
 */
export const uploadDrawing = async (
  file: File, 
  options?: { snap_mm?: number, collapse_pairs?: boolean }
): Promise<JobResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options?.snap_mm !== undefined) {
      formData.append('snap_mm', options.snap_mm.toString());
    }
    if (options?.collapse_pairs !== undefined) {
      formData.append('collapse_pairs', options.collapse_pairs.toString());
    }
    
    const response = await api.post('/jobs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error starting takeoff job:', error);
    throw error;
  }
};

/**
 * Polls the job status.
 */
export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for job ${jobId}:`, error);
    throw error;
  }
};

/**
 * Retrieves the full takeoff report once the job is completed.
 */
export const getTakeoffReport = async (jobId: string): Promise<TakeoffReport> => {
  try {
    const response = await api.get(`/jobs/${jobId}/takeoff.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching takeoff report for job ${jobId}:`, error);
    throw error;
  }
};

/**
 * Retrieves the SVG render URL for the job.
 * Note: Returns the URL string to be used as an img src, rather than fetching it.
 */
export const getRenderSvgUrl = (jobId: string, colorBy: 'diameter' | 'evidence' | 'layer' | 'service' = 'diameter'): string => {
  const baseUrl = api.defaults.baseURL || '';
  return `${baseUrl.replace(/\/$/, '')}/jobs/${jobId}/render.svg?color_by=${colorBy}`;
};
