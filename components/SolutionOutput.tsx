
import React from 'react';
import { ResolutionResult } from '../types';

interface SolutionOutputProps {
  result: ResolutionResult | null;
  loading: boolean;
}

const SolutionOutput: React.FC<SolutionOutputProps> = ({ result, loading }) => {
  if (loading && !result) {
    return (
      <div className="card-saas h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-primary animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Synthesizing Resolution</h3>
          <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">Cross-referencing PyPI version histories and official documentation.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-saas h-full flex flex-col items-center justify-center text-center p-20 opacity-60">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
           <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Simulation Results</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full animate-fade-in">
      <div className="card-saas p-10 overflow-hidden relative group">
        <header className="mb-8 pb-8 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md mb-6 uppercase tracking-wider">
            Resolution Confirmed
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">{result.diagnosis}</h2>
          <p className="text-slate-500 text-base font-medium leading-relaxed">{result.explanation}</p>
        </header>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Optimized requirements.txt</label>
              <button 
                onClick={() => navigator.clipboard.writeText(result.fixedRequirements)}
                className="text-[11px] font-bold text-brand-primary hover:text-brand-dark transition-colors uppercase"
              >
                Copy Content
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl overflow-hidden">
              <pre className="text-slate-800 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                {result.fixedRequirements}
              </pre>
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="pt-8 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 block">Evidence Grounding</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 text-slate-400 group-hover:text-brand-primary rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 truncate">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionOutput;
