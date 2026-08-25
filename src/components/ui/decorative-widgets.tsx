import { X, RefreshCw, Video, MoreHorizontal } from 'lucide-react';
import type { TakeoffReport } from '@/service/api';

export function ConnectWidget({ report }: { report?: TakeoffReport }) {
  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 flex items-start gap-4 relative">
      <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden shadow-inner">
        <RefreshCw className="w-8 h-8 text-primary animate-[spin_10s_linear_infinite]" />
      </div>
      <div className="pr-6">
        <h3 className="font-heading font-bold text-lg mb-1">QS Engine</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {report ? `Generated at ${new Date(report.generated_at || Date.now()).toLocaleTimeString()}` : 'Upload your DWG and get instant quantity takeoff'}
        </p>
      </div>
    </div>
  );
}

export function DiameterChartWidget({ report }: { report?: TakeoffReport }) {
  if (!report) {
    return (
      <div className="bg-card shadow-soft rounded-[2rem] p-6 flex flex-col h-full opacity-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-xl">Diameter Lengths</h3>
        </div>
        <p className="text-sm text-muted-foreground m-auto">Upload a drawing to see the chart.</p>
      </div>
    );
  }

  const items = report.summary.by_diameter.slice(0, 5); // top 5
  const maxLen = Math.max(...items.map(i => i.length_m), 1);

  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-xl">Diameter Lengths</h3>
        <span className="text-xs font-semibold px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">Top 5</span>
      </div>
      
      <div className="flex gap-4 text-xs font-semibold mb-8 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground"><div className="w-2 h-2 rounded-full bg-blue-500" /> Measured</div>
      </div>
      
      <div className="flex-1 flex items-end justify-around gap-2 mt-auto pb-4 relative h-48 border-l border-b border-gray-100 px-4">
        {/* Y Axis labels */}
        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between text-[10px] text-muted-foreground font-medium py-4 items-end pr-2 w-12">
          <span>{maxLen.toFixed(0)}m</span>
          <span>{(maxLen * 0.75).toFixed(0)}m</span>
          <span>{(maxLen * 0.5).toFixed(0)}m</span>
          <span>{(maxLen * 0.25).toFixed(0)}m</span>
          <span>0m</span>
        </div>
        
        {/* Bars */}
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-full group">
            <div className="w-4 md:w-6 flex flex-col-reverse justify-start gap-1 h-32 relative">
              <div 
                className="w-full bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600" 
                style={{ height: `${(item.length_m / maxLen) * 100}%` }} 
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded">
                {item.length_m.toFixed(1)}m
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold mt-2 text-center w-full truncate px-1" title={item.diameter_label}>
              {item.diameter_label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIPromoWidget({ report }: { report?: TakeoffReport }) {
  const unattributed = report?.summary.unattributed_m || 0;
  
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-[2rem] p-8 relative overflow-hidden h-full flex flex-col justify-between items-start min-h-[200px]">
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tl from-blue-400 to-cyan-300 rounded-full blur-2xl opacity-50" />
      <div className="relative z-10 w-2/3">
        <h3 className="font-heading font-bold text-2xl leading-tight mb-2">Unattributed Lines</h3>
        <p className="text-sm font-semibold text-gray-700 mb-4">{unattributed.toFixed(2)}m unaccounted for</p>
        <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black/80 transition-colors">
          View Diagnostics
        </button>
      </div>
      {/* Torus mockup */}
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-gradient-to-tl from-blue-500 to-cyan-300 rounded-[2rem] rounded-tl-[4rem] rounded-br-[4rem] shadow-2xl rotate-12 translate-x-4 translate-y-4" />
    </div>
  );
}

export function ServicesListWidget({ report }: { report?: TakeoffReport }) {
  const servicesSet = new Set<string>();
  const materialsSet = new Set<string>();
  
  if (report) {
    report.summary.by_diameter.forEach(item => {
      item.services?.forEach(s => servicesSet.add(s));
      item.materials?.forEach(m => materialsSet.add(m));
    });
  }
  
  const items = Array.from(servicesSet).slice(0, 3);
  if (items.length === 0) {
    items.push('cold_water', 'hot_water', 'waste');
  }

  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-lg">Detected Services</h3>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          {report ? Array.from(materialsSet).length : 0} Materials
        </button>
      </div>
      
      <div className="space-y-3">
        {items.map((service, i) => (
          <div key={i} className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100 ${!report ? 'opacity-50' : ''}`}>
            <div className={`w-10 h-10 rounded-full shrink-0 shadow-sm flex items-center justify-center text-white font-bold text-xs ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'][i%4]}`}>
              {service.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate uppercase">{service.replace('_', ' ')}</h4>
              <p className="text-xs text-muted-foreground truncate">System</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center bg-gray-50 rounded-xl p-1.5 border border-gray-100">
        <div className="px-3 flex-1 text-xs text-muted-foreground truncate bg-transparent outline-none font-mono">
          {report ? report.source_file.split('/').pop() : 'drawing.dxf'}
        </div>
      </div>
    </div>
  );
}

export function CoverageWidget({ report }: { report?: TakeoffReport }) {
  const coverage = report?.totals.coverage_pct || 0;
  
  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 text-center flex flex-col justify-center">
      <div className="bg-gray-50 rounded-2xl py-8 mb-6">
        <h2 className={`text-5xl font-bold font-heading ${coverage < 90 && report ? 'text-orange-500' : 'text-foreground'}`}>
          {report ? coverage.toFixed(1) : '0.0'}<span className="text-2xl text-muted-foreground ml-1">%</span>
        </h2>
      </div>
      <div className="flex items-center justify-between text-left">
        <div>
          <h3 className="font-bold text-lg">Total Coverage</h3>
          <p className="text-sm text-muted-foreground">Of measured lines</p>
        </div>
        <button className="bg-blue-50 text-blue-500 font-semibold px-5 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}

export function FoldersWidget() {
  return (
    <div className="relative h-[220px] w-full max-w-[280px] mx-auto mt-4">
      {/* Background folder */}
      <div className="absolute top-4 left-0 w-full h-[180px] bg-blue-500 rounded-3xl -rotate-6 origin-bottom-left shadow-lg transform transition-transform hover:-rotate-12">
         <div className="p-6 text-white h-full flex flex-col justify-between">
           <div>
             <h3 className="font-bold text-xl">Artifacts</h3>
             <p className="opacity-80 text-sm">JSON Reports</p>
           </div>
         </div>
      </div>
      {/* Foreground folder */}
      <div className="absolute top-12 left-6 w-[105%] h-[180px] bg-white rounded-3xl shadow-soft p-6 flex flex-col justify-between z-10">
         <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold font-heading text-lg">Visualizations</h3>
              </div>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground ml-7">SVG Renders</p>
         </div>
         <div className="border border-gray-200 rounded-xl py-2 text-center text-xs font-semibold text-muted-foreground">
           Ready to download
         </div>
      </div>
    </div>
  )
}
