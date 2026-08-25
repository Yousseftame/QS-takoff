import type { TakeoffReport } from '@/service/api';
import { Layers, AlertTriangle, FileText, Activity, Database, X } from 'lucide-react';

export function DetailedItemsTable({ report }: { report: TakeoffReport }) {
  if (!report.items || report.items.length === 0) return null;

  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 lg:p-8 w-full border border-gray-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl">Detailed Pipe Runs</h3>
          <p className="text-sm text-muted-foreground">Comprehensive breakdown of all successfully parsed geometry</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 no-scrollbar">
        <table className="w-full text-left min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-4 px-4 whitespace-nowrap">Diameter / Labels</th>
              <th className="py-4 px-4 whitespace-nowrap">Service</th>
              <th className="py-4 px-4 whitespace-nowrap">Material</th>
              <th className="py-4 px-4 whitespace-nowrap">Length (m)</th>
              <th className="py-4 px-4 whitespace-nowrap">Segments</th>
              <th className="py-4 px-4 whitespace-nowrap">Primary Layer</th>
              <th className="py-4 px-4 text-right whitespace-nowrap">Evidence & Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report.items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.confidence > 0.8 ? 'bg-green-500' : (item.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500')}`} />
                      <span className="font-semibold text-sm" title={item.diameter_label}>{item.diameter_label.slice(0, 15)}{item.diameter_label.length > 15 ? '...' : ''}</span>
                    </div>
                    {item.label_variants && item.label_variants.length > 1 && (
                      <div className="flex flex-col gap-0.5 mt-1 pl-4" title="Other label variants detected">
                        {item.label_variants.slice(1, 3).map((v, idx) => (
                          <span key={idx} className="text-[9px] font-mono text-muted-foreground truncate max-w-[120px]">
                            ↳ {v}
                          </span>
                        ))}
                      </div>
                    )}
                    {(item as any).flags && (item as any).flags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {(item as any).flags.map((flag: string, idx: number) => (
                          <span key={idx} className="text-[8px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded uppercase">
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {item.service ? (
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase truncate max-w-[120px] block w-max">
                      {item.service.replace('_', ' ')}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium italic">None</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {item.material ? (
                    <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase truncate max-w-[120px] block w-max">
                      {item.material}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium italic">None</span>
                  )}
                </td>
                <td className="py-4 px-4 font-bold">{item.length_m.toFixed(2)}m</td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <span className="font-semibold">{item.run_count}</span> runs <span className="opacity-50">/</span> {item.segment_count} segs
                </td>
                <td className="py-4 px-4 text-xs font-mono text-gray-500 min-w-[250px]">
                  <div className="flex flex-col gap-2">
                    {item.layers.slice(0, 3).map((l, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5 bg-gray-50 p-1.5 rounded-md border border-gray-100">
                        <span className="truncate max-w-[200px] font-bold text-gray-700" title={l.layer}>
                          {l.layer} <span className="opacity-50 font-normal">({l.representation})</span>
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                          {l.length_m.toFixed(2)}m • {l.entity_count} entities
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-sm">{(item.confidence * 100).toFixed(1)}%</span>
                    {item.evidence && (
                      <div className="flex flex-wrap justify-end gap-1 max-w-[100px]">
                        {Object.keys(item.evidence).map((ev, idx) => (
                          <span key={idx} className="text-[8px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded uppercase" title={`${ev}: ${item.evidence[ev].toFixed(2)}`}>
                            {ev.slice(0, 5)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UnattributedTable({ report }: { report: TakeoffReport }) {
  if (!report.unattributed || report.unattributed.length === 0) return null;

  return (
    <div className="bg-card shadow-soft rounded-[2rem] p-6 lg:p-8 w-full border border-gray-50 overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl">Unattributed Segments</h3>
          <p className="text-sm text-muted-foreground">Segments the engine skipped or couldn't safely measure</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 no-scrollbar">
        <table className="w-full text-left min-w-[500px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-4 px-4 whitespace-nowrap">Layer Name</th>
              <th className="py-4 px-4 whitespace-nowrap">Reason Skipped</th>
              <th className="py-4 px-4 whitespace-nowrap">Run Count</th>
              <th className="py-4 px-4 text-right whitespace-nowrap">Length (m)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report.unattributed.map((item, i) => (
              <tr key={i} className="hover:bg-red-50/30 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-mono text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-700 whitespace-nowrap inline-block">
                    {item.layer}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase inline-flex items-center gap-1.5 whitespace-nowrap">
                    <X className="w-3 h-3 shrink-0" />
                    {item.reason.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{item.run_count}</td>
                <td className="py-4 px-4 text-right font-bold text-gray-800 whitespace-nowrap">{item.length_m.toFixed(3)}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdvancedDiagnosticsGrid({ report }: { report: TakeoffReport }) {
  const d = report.diagnostics;
  if (!d) return null;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Primitives Card */}
      <div className="bg-card shadow-soft rounded-[2rem] p-6 border border-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h3 className="font-heading font-bold text-lg">Primitive Analysis</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-gray-100 pb-3">
            <span className="text-sm font-semibold text-gray-600">Total Parsed</span>
            <span className="text-xl font-bold">{d.primitives_total?.toLocaleString() || 0}</span>
          </div>
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Top Skipped Items</span>
            {Object.entries(d.primitives_skipped || {})
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .slice(0, 4)
              .map(([key, val], i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">{key.replace('type:', '')}</span>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">{(val as number).toLocaleString()}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Labels Card */}
      <div className="bg-card shadow-soft rounded-[2rem] p-6 border border-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-5 h-5 text-emerald-500" />
          <h3 className="font-heading font-bold text-lg">Label Extraction</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
              <span className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Attached</span>
              <span className="text-2xl font-bold text-emerald-900">{d.labels?.attached || 0}</span>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
              <span className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Used</span>
              <span className="text-2xl font-bold text-blue-900">{d.labels?.used || 0}</span>
            </div>
          </div>
          <div className="pt-2 space-y-2">
             <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Text Nodes</span>
                <span className="text-xs font-bold">{d.labels?.text || 0}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Multileaders</span>
                <span className="text-xs font-bold">{d.labels?.multileader || 0}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">MText</span>
                <span className="text-xs font-bold">{d.labels?.mtext || 0}</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Attribs</span>
                <span className="text-xs font-bold">{d.labels?.attrib || 0}</span>
             </div>
             {d.labels?.diameter_labels && (
               <div className="pt-2 mt-2 border-t border-gray-100 space-y-1.5">
                 <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">Diameter Labels Breakdown</span>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 pl-2 border-l-2 border-emerald-200">Text Nodes</span>
                    <span className="text-xs font-bold">{d.labels.diameter_labels.text || 0}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 pl-2 border-l-2 border-emerald-200">Multileaders</span>
                    <span className="text-xs font-bold">{d.labels.diameter_labels.multileader || 0}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 pl-2 border-l-2 border-emerald-200">MText</span>
                    <span className="text-xs font-bold">{d.labels.diameter_labels.mtext || 0}</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Engine Core Card */}
      <div className="bg-card shadow-soft rounded-[2rem] p-6 border border-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-5 h-5 text-amber-500" />
          <h3 className="font-heading font-bold text-lg">Vocabulary & Layers</h3>
        </div>
        <div className="space-y-4">
          {d.pipe_layers && d.pipe_layers.length > 0 && (
            <div>
              <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Pipe Layers</span>
              <div className="flex flex-wrap gap-2">
                {d.pipe_layers.map((layer, i) => (
                  <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded border border-indigo-100/50">
                    {layer}
                  </span>
                ))}
              </div>
              {d.pipe_layer_length_m && (
                <div className="text-[10px] text-muted-foreground mt-1.5 font-medium">Pipe Layer Length: {d.pipe_layer_length_m.toFixed(1)}m</div>
              )}
            </div>
          )}
          <div className="pt-3 border-t border-gray-100">
            <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Size Vocabulary Detected</span>
            <div className="flex flex-wrap gap-2">
              {d.size_vocabulary?.map((size, i) => (
                <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded border border-amber-100/50">
                  {size}mm
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-2">Idioms</span>
            <div className="flex flex-wrap gap-2">
              {d.idiom?.map((id, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 font-mono text-[10px] rounded uppercase">
                  {id}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
             <span className="text-xs font-medium text-gray-500">Total Hidden Layers</span>
             <span className="text-xs font-bold">{d.hidden_layers || 0}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
             <span className="text-xs font-medium text-gray-500">Snap Range</span>
             <span className="text-xs font-bold">{d.snap_mm || 0}mm</span>
          </div>
          <div className="flex items-center justify-between mt-2">
             <span className="text-xs font-medium text-gray-500">Collapse Pairs Mode</span>
             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${d.profile?.collapse_pairs ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {d.profile?.collapse_pairs ? 'Active' : 'Inactive'}
             </span>
          </div>
          {d.warnings && d.warnings.length > 0 && (
            <div className="pt-2 border-t border-gray-100 mt-2">
              <span className="block text-[10px] font-bold text-red-500 uppercase mb-2">Warnings</span>
              <ul className="list-disc pl-4 text-xs text-red-600">
                {d.warnings.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
