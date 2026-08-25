import { motion, AnimatePresence } from 'motion/react';
import { FileUploader } from '@/components/ui/file-uploader';
import { AnalyticsCard } from '@/components/ui/analytics-card';
import { Ruler, Activity } from 'lucide-react';
import { useSurveyData } from '@/hooks/useSurveyData';
import { 
  ConnectWidget, 
  DiameterChartWidget, 
  AIPromoWidget, 
  ServicesListWidget, 
  CoverageWidget, 
  FoldersWidget 
} from '@/components/ui/decorative-widgets';
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (3 spans) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <ConnectWidget report={report || undefined} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-[360px]">
              <DiameterChartWidget report={report || undefined} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-[280px]">
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
                  className="flex flex-col gap-6"
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
                  <div className="bg-card shadow-soft rounded-[2rem] p-6 border border-gray-50">
                    <h3 className="font-heading font-semibold text-lg mb-4">Lengths by Diameter</h3>
                    <div className="space-y-3">
                      {report.summary.by_diameter.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                            <span className="font-semibold text-sm">{item.diameter_label}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-foreground">{item.length_m.toFixed(2)}m</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">{item.run_count} runs</span>
                          </div>
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
               <FoldersWidget />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
               <ServicesListWidget report={report || undefined} />
             </motion.div>
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
               <CoverageWidget report={report || undefined} />
             </motion.div>
          </div>
          
        </div>

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
