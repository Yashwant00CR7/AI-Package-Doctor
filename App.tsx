
import React, { useState } from 'react';
import { PackageDoctorService } from './services/geminiService';
import { AgentStep, ResolutionResult, AppView } from './types';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Resolver from './components/Resolver';
import MCPStatus from './components/MCPStatus';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<ResolutionResult | null>(null);

  const service = new PackageDoctorService();

  const handleResolve = async (reqs: string, logs: string) => {
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
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return <Home onGetStarted={() => setView('resolver')} />;
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
      default:
        return <Home onGetStarted={() => setView('resolver')} />;
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
            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors text-xs font-bold uppercase tracking-widest">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
