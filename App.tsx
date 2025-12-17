
import React, { useState, useEffect } from 'react';
import { PackageDoctorService } from './services/geminiService';
import { AgentStep, ResolutionResult, AppView } from './types';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Resolver from './components/Resolver';
import MCPStatus from './components/MCPStatus';
import Support from './components/Support';
import ScheduleDemo from './components/ScheduleDemo';
import Privacy from './components/Privacy';
import Status from './components/Status';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<ResolutionResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleResolve = async (reqs: string, logs: string) => {
    const service = new PackageDoctorService();
    setLoading(true);
    setResult(null);
    setSteps([]);
    try {
      const res = await service.resolveConflict(reqs, logs, (newStep) => {
        setSteps(prev => {
          const exists = prev.findIndex(s => s.id === newStep.id);
          if (exists > -1) {
            const next = [...prev];
            next[exists] = newStep;
            return next;
          }
          return [...prev, newStep];
        });
      });
      setResult(res);
    } catch (error) {
      console.error("Resolution failed", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Analysis failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!hasApiKey) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="card-saas max-w-md w-full p-10 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Key Selection Required</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                To use Gemini 3 Pro reasoning features, you must select a valid API key from a paid GCP project.
              </p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-primary hover:underline block mb-8"
              >
                Learn about Gemini API billing
              </a>
              <button 
                onClick={handleOpenKeySelector}
                className="w-full py-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Select API Key
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'home':
        return <Home onGetStarted={() => setView('resolver')} onScheduleDemo={() => setView('demo')} />;
      case 'resolver':
        return (
          <Resolver 
            onResolve={handleResolve} 
            loading={loading} 
            steps={steps} 
            result={result} 
          />
        );
      case 'mcp-status':
        return <MCPStatus />;
      case 'support':
        return <Support />;
      case 'demo':
        return <ScheduleDemo onBack={() => setView('home')} />;
      case 'privacy':
        return <Privacy />;
      case 'status':
        return <Status />;
      default:
        return <Home onGetStarted={() => setView('resolver')} onScheduleDemo={() => setView('demo')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 bg-white">
      <Navigation currentView={view} setView={setView} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-60">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-[10px]">P</div>
             <span className="font-bold text-slate-900 tracking-tight">Package Doctor</span>
          </div>
          <p className="text-slate-400 text-xs font-medium tracking-wide">
            &copy; 2024 AI Package Doctor. All rights reserved. Built with Google Gemini Deep Research.
          </p>
          <div className="flex gap-6">
            <button onClick={() => setView('privacy')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'privacy' ? 'text-brand-primary' : 'text-slate-400 hover:text-brand-primary'}`}>Privacy</button>
            <button onClick={() => setView('status')} className={`text-xs font-bold uppercase tracking-widest transition-colors ${view === 'status' ? 'text-brand-primary' : 'text-slate-400 hover:text-brand-primary'}`}>Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
