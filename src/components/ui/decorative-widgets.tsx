import { RefreshCw, Video, MoreHorizontal } from 'lucide-react';
import type { TakeoffReport } from '@/service/api';

import { CheckCircle2, AlertCircle } from 'lucide-react';

export function DiagnosticsWidget({ report }: { report?: TakeoffReport }) {
  const invariants = report?.diagnostics?.invariants || {};
  const hasInvariants = Object.keys(invariants).length > 0;

  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 flex flex-col gap-4 relative w-full h-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center shadow-inner">
          <RefreshCw className="w-5 h-5 text-indigo-600 animate-[spin_10s_linear_infinite]" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg leading-tight">Engine Diagnostics</h3>
          <p className="text-xs text-muted-foreground">
            {report ? `Generated at ${new Date(report.generated_at || Date.now()).toLocaleTimeString()}` : 'Waiting for job...'}
          </p>
        </div>
      </div>
      
      <div className="mt-2 flex-1 flex flex-col gap-2">
        {!report && (
          <div className="text-sm text-muted-foreground text-center py-4">Upload drawing to view health checks</div>
        )}
        {report?.diagnostics?.warnings && report.diagnostics.warnings.length > 0 && (
          <div className="mb-2 flex flex-col gap-1 border border-orange-200 bg-orange-50 rounded-lg p-2">
            <span className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Warnings</span>
            {report.diagnostics.warnings.map((w, i) => (
               <div key={i} className="text-xs text-orange-800 font-semibold">{w}</div>
            ))}
          </div>
        )}
        {hasInvariants && Object.entries(invariants).map(([key, passed]) => (
          <div key={key} className="flex items-center justify-between py-1.5 px-3 rounded-lg border border-gray-100 bg-gray-50/50">
            <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]" title={key}>
              {key.replace(/_/g, ' ')}
            </span>
            {passed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
          </div>
        ))}
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
      
      <div className="flex-1 flex items-end justify-evenly w-[calc(100%-2.5rem)] mt-auto relative border-l border-b border-gray-100 ml-10 mb-6">
        {/* Y Axis labels - strictly constrained to the bar height */}
        <div className="absolute -left-14 bottom-0 h-40 flex flex-col justify-between text-[10px] text-muted-foreground font-medium items-end pr-2 w-14 translate-y-[6px]">
          <span>{maxLen.toFixed(0)}m</span>
          <span>{(maxLen * 0.75).toFixed(0)}m</span>
          <span>{(maxLen * 0.5).toFixed(0)}m</span>
          <span>{(maxLen * 0.25).toFixed(0)}m</span>
          <span>0m</span>
        </div>
        
        {/* Bars */}
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center w-12 group relative">
            <div className="w-6 md:w-8 flex flex-col justify-end h-40 relative">
              <div 
                className="w-full bg-blue-500 rounded-t-[4px] transition-all group-hover:bg-blue-600" 
                style={{ height: `${Math.max((item.length_m / maxLen) * 100, 1)}%` }} 
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded flex flex-col items-center z-10 min-w-max pointer-events-none shadow-lg">
                <span className="font-bold">{item.length_m.toFixed(1)}m</span>
                <span className="text-[8px] text-gray-300">{item.share_pct?.toFixed(1)}% share</span>
              </div>
            </div>
            <span className="absolute -bottom-6 text-[9px] sm:text-[10px] text-muted-foreground font-semibold text-center w-12 truncate px-0.5" title={item.diameter_label}>
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
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-[2rem] p-8 relative overflow-hidden h-full flex flex-col justify-between items-start min-h-[220px]">
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-tl from-blue-400 to-cyan-300 rounded-full blur-2xl opacity-50" />
      
      {/* Top Text Content */}
      <div className="relative z-10 w-[85%]">
        <h3 className="font-heading font-extrabold text-3xl leading-[1.1] mb-2 text-indigo-950">Unattributed<br/>Lines</h3>
        <p className="text-sm font-semibold text-indigo-900/70">{unattributed.toFixed(2)}m unaccounted for</p>
      </div>
      
      {/* Bottom Button */}
      <div className="relative z-10 mt-auto pt-6">
        <button 
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-900 transition-all hover:scale-105 active:scale-95 border border-gray-800"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          View Diagnostics
        </button>
      </div>

      {/* Torus mockup */}
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-tl from-blue-500 to-cyan-300 rounded-[2rem] rounded-tl-[4rem] rounded-br-[4rem] shadow-2xl rotate-12" />
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
    <div className="bg-card shadow-soft rounded-[2rem] p-6 text-center flex flex-col h-full w-full">
      <div className="bg-gray-50 rounded-2xl flex-1 flex flex-col justify-center min-h-[140px] mb-6 shadow-inner border border-gray-100">
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

export function ScopeAndUnitsWidget({ report }: { report?: TakeoffReport }) {
  if (!report) {
    return (
      <div className="relative h-[220px] w-full max-w-[280px] mx-auto mt-4 opacity-50">
        <div className="absolute top-4 left-0 w-full h-[180px] bg-blue-500 rounded-3xl -rotate-6 origin-bottom-left shadow-lg"></div>
        <div className="absolute top-12 left-6 w-[105%] h-[180px] bg-white rounded-3xl shadow-soft p-6 flex flex-col justify-between z-10 border border-gray-100">
           <h3 className="font-bold text-lg">Parsing Scope</h3>
           <p className="text-sm text-muted-foreground">Upload drawing...</p>
        </div>
      </div>
    );
  }

  const mode = report.scope?.mode || 'Unknown';
  const unitsFormat = report.units?.length_format || 'Decimal';
  const primaryUnit = report.units?.primary_unit || 'Unknown';

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Drawing Units Card */}
      <div className="w-full bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] shadow-lg p-6 text-white transform transition-transform hover:-translate-y-1">
         <h3 className="font-bold text-xl">Drawing Units</h3>
         <div className="mt-2 flex items-center gap-2">
           <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold font-mono">{primaryUnit}</span>
           <span className="text-xs opacity-90">{unitsFormat}</span>
         </div>
         {report.units?.sources?.note && (
            <p className="text-xs opacity-80 mt-3 leading-snug italic border-l-2 border-white/20 pl-2">
              "{report.units.sources.note}"
            </p>
         )}
      </div>

      {/* Scope Card */}
      <div className="w-full bg-white rounded-[2rem] shadow-soft p-6 border border-gray-100 flex flex-col justify-between">
         <div className="flex items-center gap-2 mb-3">
           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
             <Video className="w-4 h-4 text-blue-600" />
           </div>
           <h3 className="font-bold font-heading text-lg">Scope</h3>
         </div>
         <div className="mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">{mode.replace('_', ' ').toUpperCase()}</p>
            {report.sheet_name && <p className="text-xs text-muted-foreground mb-2">Sheet: <span className="font-mono text-gray-600">{report.sheet_name}</span></p>}
            <div className="flex flex-wrap gap-1.5">
              {report.units?.agreed && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase border border-green-100">Units Agreed</span>}
              {report.units?.extent_plausible && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase border border-blue-100">Plausible Extent</span>}
              {report.summary?.basis && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold uppercase border border-purple-100">Basis: {report.summary.basis.replace('_', ' ')}</span>}
            </div>
         </div>
         <div className="bg-gray-50 rounded-xl py-2 px-3 text-xs font-semibold text-muted-foreground flex justify-between items-center border border-gray-100">
           <span>Modelspace</span>
           <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
         </div>
      </div>
    </div>
  );
}
