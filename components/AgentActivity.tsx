
import React from 'react';
import { AgentStep } from '../types';

interface AgentActivityProps {
  steps: AgentStep[];
  loading: boolean;
}

const AgentActivity: React.FC<AgentActivityProps> = ({ steps, loading }) => {
  if (steps.length === 0 && !loading) return null;

  return (
    <div className="card-saas p-6 animate-fade-in shadow-lg border-slate-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agent Intelligence Feed</h3>
        {loading && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </div>
      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 
                step.status === 'running' ? 'bg-white border-brand-primary text-brand-primary animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                {step.status === 'completed' ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                ) : idx + 1}
              </div>
              {idx < steps.length - 1 && <div className="w-px h-full bg-slate-100 my-2"></div>}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-800 tracking-tight uppercase">{step.agent}</span>
                <span className="text-[10px] text-slate-400 font-mono">STEP_0{idx + 1}</span>
              </div>
              <p className="text-[12px] text-slate-600 font-medium leading-normal mb-3">{step.message}</p>
              
              {/* Agent-specific detailed data rendering */}
              {step.status === 'completed' && step.data && (
                <div className="mt-2 space-y-3 animate-fade-in">
                  
                  {/* Query Creator Details */}
                  {step.agent === 'Query Creator' && step.data.searchQuery && (
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5">Synthesized Search Query</div>
                      <div className="flex items-center gap-2 text-brand-primary font-mono text-[11px] font-semibold italic">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        "{step.data.searchQuery}"
                      </div>
                    </div>
                  )}

                  {/* Research Team Details */}
                  {step.agent === 'Research Team' && (
                    <div className="space-y-2">
                      {step.data.researchSummary && (
                        <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-3">
                          <div className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter mb-1.5">Research Findings</div>
                          <p className="text-[11px] text-slate-600 leading-relaxed italic">
                            "...{step.data.researchSummary}"
                          </p>
                        </div>
                      )}
                      {step.data.sources && step.data.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {step.data.sources.slice(0, 3).map((source: any, i: number) => (
                            <div key={i} className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] text-slate-400 font-medium flex items-center gap-1">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                              {source.title.split(' ').slice(0, 2).join(' ')}...
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Surgeon Details */}
                  {step.agent === 'Code Surgeon' && step.data.diagnosisSummary && (
                    <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg p-3">
                      <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mb-1.5">Surgeon's Conclusion</div>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                        {step.data.diagnosisSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step.tools && step.tools.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 opacity-60">
                  {step.tools.map((tool, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-[8px] text-slate-500 font-mono rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentActivity;
