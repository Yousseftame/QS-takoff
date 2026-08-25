import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, File as FileIcon, X, Trash2, Download, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect?: (file: File, options?: { snap_mm?: number, collapse_pairs?: boolean }) => void;
  className?: string;
  isUploading?: boolean;
  isProcessing?: boolean;
}

export function FileUploader({ onFileSelect, className, isUploading, isProcessing }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [snapMm, setSnapMm] = useState<number>(10);
  const [collapsePairs, setCollapsePairs] = useState<boolean>(true);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.dwg') || file.name.toLowerCase().endsWith('.dxf')) {
        setSelectedFile(file);
        onFileSelect?.(file, { snap_mm: snapMm, collapse_pairs: collapsePairs });
      } else {
        alert('Please upload a .dwg or .dxf file');
      }
    }
  }, [onFileSelect, snapMm, collapsePairs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.dwg') || file.name.toLowerCase().endsWith('.dxf')) {
        setSelectedFile(file);
        onFileSelect?.(file, { snap_mm: snapMm, collapse_pairs: collapsePairs });
      } else {
        alert('Please upload a .dwg or .dxf file');
      }
    }
  }, [onFileSelect, snapMm, collapsePairs]);

  return (
    <div className={cn("w-full bg-card shadow-soft rounded-[2rem] p-6 sm:p-8", className)}>

      <motion.div
        className={cn(
          "relative group overflow-hidden rounded-[2rem] border-2 border-dashed p-10 transition-colors duration-300 flex flex-col items-center justify-center min-h-[220px]",
          isDragActive ? "bg-primary/5 border-primary" : "border-blue-400 hover:bg-gray-50/50 bg-[#F9FBFF]"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".dwg,.dxf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
        />

        <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/30 mb-4 transform group-hover:-translate-y-1 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <p className="text-muted-foreground text-sm font-medium">
          Drag & drop or click to<br/>choose files
        </p>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 mb-6 px-2 text-xs text-muted-foreground font-semibold gap-2">
        <div className="flex items-center gap-4">
          <span>Supported formats: DWG, DXF</span>
          <span>Max: 25MB</span>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors bg-gray-50 border border-gray-200"
        >
          <Settings className="w-3.5 h-3.5" /> Options
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-foreground mb-1">Snap Tolerance (mm)</label>
                <p className="text-[10px] text-muted-foreground mb-2">How close two pipe ends must be to count as joined.</p>
                <input 
                  type="number" 
                  value={snapMm} 
                  onChange={e => setSnapMm(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-foreground mb-1">Collapse Pairs</label>
                <p className="text-[10px] text-muted-foreground mb-2">Switch on to collapse parallel double-lines.</p>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={collapsePairs} 
                    onChange={e => setCollapsePairs(e.target.checked)} 
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List mimicking the design */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                    <FileIcon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="flex items-center gap-4 mt-2">
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full bg-blue-500 rounded-full transition-all duration-500", isProcessing ? "w-[90%]" : (isUploading ? "w-[40%]" : "w-[10%]") )} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {isProcessing ? "90%" : (isUploading ? "40%" : "10%")}
                </span>
              </div>
              
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center mt-1"
                  >
                    <p className="text-[10px] text-blue-500 font-semibold animate-pulse">
                      Analyzing drawing geometry... This usually takes 30-90 seconds.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
