import { motion, AnimatePresence } from 'motion/react';
import { FileUploader } from '@/components/ui/file-uploader';
import { AnalyticsCard } from '@/components/ui/analytics-card';
import { Ruler, Activity } from 'lucide-react';
import { useSurveyData } from '@/hooks/useSurveyData';
import { 
  DiameterChartWidget, 
  AIPromoWidget, 
  ServicesListWidget, 
  CoverageWidget, 
  ScopeAndUnitsWidget,
  DiagnosticsWidget
} from '@/components/ui/decorative-widgets';
import { 
  DetailedItemsTable, 
  UnattributedTable, 
  AdvancedDiagnosticsGrid 
} from '@/components/ui/data-tables';
import { DiaTextReveal } from '@/components/ui/dia-text-reveal';

export function Dashboard() {
  const { report, svgUrl, error, processFile, colorBy, updateColorBy, isUploading, isProcessing } = useSurveyData();

  const handleFileSelect = async (file: File, options?: { snap_mm?: number, collapse_pairs?: boolean }) => {
    try {
      await processFile(file, options);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-y-auto overflow-x-hidden font-sans text-foreground pb-20">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header / Hero (Simplified for modern dashboard look) */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src="/hassan_allam_holding_logo.jpg" 
              alt="Hassan Allam Logo" 
              className="h-16 w-auto object-contain rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-3xl font-heading font-bold tracking-tight">
                <DiaTextReveal 
                  text="HAH AI Quantity Survey" 
                  colors={['#475569', '#0f172a', '#475569']} 
                />
              </h1>
              <p className="text-muted-foreground mt-1">Manage your QS Takeoff files and storage.</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (3 spans) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <DiagnosticsWidget report={report || undefined} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <DiameterChartWidget report={report || undefined} />
            </motion.div>
            <motion.div className="flex-1 flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AIPromoWidget report={report || undefined} />
            </motion.div>
          </div>

          {/* Center Column (5 spans) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FileUploader 
                onFileSelect={handleFileSelect} 
                isUploading={isUploading} 
                isProcessing={isProcessing}
                isComplete={!!report}
              />
              {error && (
                <div className="mt-4 p-4 rounded-2xl bg-red-50 text-red-500 border border-red-100 text-sm text-center font-medium shadow-sm">
                  {error}
                </div>
              )}
            </motion.div>

            {/* Results shown below uploader when ready */}
            <AnimatePresence>
              {report && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-6 flex-1"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <AnalyticsCard 
                      title="Total Length" 
                      value={`${report.summary.total_length_m.toFixed(1)}m`} 
                      icon={<Ruler className="w-5 h-5" />}
                    />
                    <AnalyticsCard 
                      title="Coverage" 
                      value={`${report.totals.coverage_pct.toFixed(1)}%`} 
                      icon={<Activity className="w-5 h-5" />}
                      trend={{ value: report.totals.coverage_pct, isPositive: report.totals.coverage_pct > 95 }}
                    />
                  </div>
                  
                  {/* Diameter Breakdown Table */}
                  <div className="bg-card shadow-soft rounded-[2rem] p-6 border border-gray-50 flex-1 flex flex-col">
                    <h3 className="font-heading font-semibold text-lg mb-4">Lengths by Diameter <span className="text-muted-foreground text-sm font-normal">({report.summary.diameter_count})</span></h3>
                    <div className="space-y-3">
                      {report?.summary.by_diameter.map((item, i) => (
                        <div key={i} className="flex flex-col gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${item.confidence > 0.8 ? 'bg-green-500' : (item.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500')}`} title={`Confidence: ${(item.confidence * 100).toFixed(1)}%`} />
                              <span className="font-semibold text-sm">{item.diameter_label}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-bold text-foreground">{item.length_m.toFixed(2)}m</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{item.run_count} runs • {item.segment_count} segs • {item.system_count || 0} sys</span>
                            </div>
                          </div>
                          
                          {(item.services && item.services.length > 0 || item.materials && item.materials.length > 0) && (
                            <div className="flex items-center gap-1.5 pl-5.5 overflow-hidden">
                                {item.services?.map((s, idx) => (
                                  <span key={`s-${idx}`} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase truncate max-w-[80px]">
                                    {s.replace('_', ' ')}
                                  </span>
                                ))}
                                {item.materials?.map((m, idx) => (
                                  <span key={`m-${idx}`} className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold uppercase truncate max-w-[80px]">
                                    {m}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column (4 spans) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
               <ScopeAndUnitsWidget report={report || undefined} />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
               <ServicesListWidget report={report || undefined} />
             </motion.div>
             <motion.div className="flex-1 flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
               <CoverageWidget report={report || undefined} />
             </motion.div>
          </div>
          
        </div>

        {/* Advanced Telemetry & Tables - Full Width */}
        <AnimatePresence>
          {report && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-6 w-full max-w-7xl mx-auto mt-6"
            >
              <AdvancedDiagnosticsGrid report={report} />
              
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1">
                  <DetailedItemsTable report={report} />
                </div>
                <div className="col-span-1">
                  <UnattributedTable report={report} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full width SVG Visualization if report is ready */}
        <AnimatePresence>
          {report && svgUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card shadow-soft rounded-[2rem] border border-gray-50 p-6 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="font-heading font-bold text-xl">Drawing Segments</h3>
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100">
                  {(['diameter', 'evidence', 'layer', 'service'] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => updateColorBy(option)}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors capitalize ${colorBy === option ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50/50 rounded-3xl p-4 flex items-center justify-center min-h-[500px] border border-gray-100 shadow-inner">
                <img src={svgUrl} alt="Drawing Segments" className="max-w-full max-h-[700px] object-contain drop-shadow-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
