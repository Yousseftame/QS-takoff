import { useState, useCallback, useRef } from 'react';
import { uploadDrawing, getJobStatus, getTakeoffReport, getRenderSvgUrl, type TakeoffReport } from '@/service/api';

export function useSurveyData() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<TakeoffReport | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [colorBy, setColorBy] = useState<'diameter' | 'evidence' | 'layer' | 'service'>('diameter');
  
  const pollingIntervalRef = useRef<number | null>(null);

  const processFile = useCallback(async (file: File, options?: { snap_mm?: number, collapse_pairs?: boolean }) => {
    setIsUploading(true);
    setIsProcessing(false);
    setError(null);
    setReport(null);
    setSvgUrl(null);
    setJobId(null);
    
    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current);
    }
    
    try {
      // 1. Upload the file to start the job
      const uploadRes = await uploadDrawing(file, options);
      const newJobId = uploadRes.job_id;
      setJobId(newJobId);
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // 2. Poll the job status
      return new Promise<void>((resolve, reject) => {
        const poll = async () => {
          try {
            const statusRes = await getJobStatus(newJobId);
            
            if (statusRes.status === 'done') {
              if (pollingIntervalRef.current) {
                window.clearInterval(pollingIntervalRef.current);
              }
              
              // 3. Fetch the full report once done
              const takeoffReport = await getTakeoffReport(newJobId);
              setReport(takeoffReport);
              
              // Set the SVG URL
              setSvgUrl(getRenderSvgUrl(newJobId, 'diameter'));
              setColorBy('diameter');
              
              setIsProcessing(false);
              resolve();
            } else if (statusRes.status === 'error') {
              if (pollingIntervalRef.current) {
                window.clearInterval(pollingIntervalRef.current);
              }
              setError(statusRes.error || 'Job failed during processing');
              setIsProcessing(false);
              reject(new Error('Job failed'));
            }
            // If still queued/running, keep waiting
          } catch (err: any) {
            if (pollingIntervalRef.current) {
              window.clearInterval(pollingIntervalRef.current);
            }
            setError(err.message || 'Error polling job status');
            setIsProcessing(false);
            reject(err);
          }
        };

        // Poll every 10 seconds (backend Retry-After: 10; jobs take 25-90s)
        poll();
        pollingIntervalRef.current = window.setInterval(poll, 10000);
      });
      
    } catch (err: any) {
      setError(err.message || 'An error occurred starting the upload');
      setIsUploading(false);
      setIsProcessing(false);
    }
  }, []);

  const updateColorBy = useCallback((newColorBy: 'diameter' | 'evidence' | 'layer' | 'service') => {
    setColorBy(newColorBy);
    if (jobId) {
      setSvgUrl(getRenderSvgUrl(jobId, newColorBy));
    }
  }, [jobId]);

  return {
    isUploading,
    isProcessing,
    report,
    svgUrl,
    error,
    colorBy,
    updateColorBy,
    processFile
  };
}
