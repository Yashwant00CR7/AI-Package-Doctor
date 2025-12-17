
import React, { useState } from 'react';
import { AgentStep, ResolutionResult } from '../types';
import AgentActivity from './AgentActivity';
import SolutionOutput from './SolutionOutput';

interface ResolverProps {
  onResolve: (reqs: string, logs: string) => void;
  loading: boolean;
  steps: AgentStep[];
  result: ResolutionResult | null;
}

const Resolver: React.FC<ResolverProps> = ({ onResolve, loading, steps, result }) => {
  const [requirements, setRequirements] = useState('numpy==1.26.4\ntensorflow==2.10.0');
  const [errorLog, setErrorLog] = useState('ERROR: Cannot install numpy==1.26.4 because it conflicts with tensorflow requirements.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(requirements, errorLog);
  };

  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Conflict Laboratory</h1>
            <p className="text-slate-500 font-medium">Paste your environment specs and let the agents do the work.</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400">STATUS:</span>
             <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${loading ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                {loading ? 'PROCESSING' : 'IDLE'}
             </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="card-saas p-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">Parameters</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Requirements.txt</label>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-brand-primary outline-none transition-all custom-scrollbar"
                    placeholder="e.g. pandas>=2.0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compiler Output</label>
                  <textarea
                    value={errorLog}
                    onChange={(e) => setErrorLog(e.target.value)}
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-4 text-rose-600 font-mono text-[11px] focus:ring-2 focus:ring-blue-500/20 focus:border-brand-primary outline-none transition-all custom-scrollbar"
                    placeholder="Paste conflict error here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>Run Analysis Engine</>
                  )}
                </button>
              </form>
            </div>
            
            <AgentActivity steps={steps} loading={loading} />
          </div>

          <div className="lg:col-span-8 min-h-[600px]">
            <SolutionOutput result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resolver;
