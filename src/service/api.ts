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
  job_id: string;
  status: 'queued' | 'running' | 'done' | 'error';
  stage?: string;
  filename?: string;
  summary?: TakeoffReport['summary'];
  totals?: TakeoffReport['totals'];
  error?: string | null;
  links?: {
    self: string;
    takeoff: string;
    svg: string;
  };
}

export interface TakeoffReport {
  schema_version: string;
  source_file: string;
  sheet_name?: string;
  generated_at: string;
  summary: {
    basis?: string;
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
      system_count?: number;
      confidence: number;
      services?: string[];
      materials?: string[];
      label_variants?: string[];
    }>;
  };
  totals: {
    measured_centerline_m: number;
    attributed_m: number;
    coverage_pct: number;
  };
  units?: any;
  scope?: any;
  items?: Array<{
    diameter_mm: number;
    diameter_label: string;
    label_variants: string[];
    service: string | null;
    material: string | null;
    length_m: number;
    run_count: number;
    segment_count: number;
    layers: Array<{
      layer: string;
      length_m: number;
      representation: string;
      entity_count: number;
    }>;
    evidence: Record<string, number>;
    confidence: number;
  }>;
  unattributed?: Array<{
    layer: string;
    length_m: number;
    reason: string;
    run_count: number;
  }>;
  diagnostics?: {
    pipe_layers?: string[];
    pipe_layer_length_m?: number;
    idiom?: string[];
    primitives_total?: number;
    primitives_skipped?: Record<string, number>;
    hidden_layers?: number;
    labels?: {
      text?: number;
      multileader?: number;
      mtext?: number;
      used?: number;
      attached?: number;
      attrib?: number;
      diameter_labels?: {
        text?: number;
        multileader?: number;
        mtext?: number;
      };
    };
    size_vocabulary?: number[];
    runs?: number;
    snap_mm?: number;
    profile?: {
      collapse_pairs?: boolean;
    };
    warnings?: string[];
    invariants?: Record<string, boolean>;
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
    
    const response = await api.post('/jobs', formData);
    
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
