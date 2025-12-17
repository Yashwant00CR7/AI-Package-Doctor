
import React from 'react';

const Status: React.FC = () => {
  const services = [
    { name: 'Conflict Resolution Engine', status: 'Operational', uptime: '99.98%', latency: '240ms' },
    { name: 'Grounding & Search API', status: 'Operational', uptime: '99.95%', latency: '850ms' },
    { name: 'Research Reasoning Agent', status: 'Operational', uptime: '100%', latency: '1.2s' },
    { name: 'MCP Global Bridge', status: 'Operational', uptime: '99.99%', latency: '12ms' },
  ];

  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 animate-fade-in">
        
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">System Status</h1>
            <p className="text-slate-500 font-medium">Current health of the Package Doctor platform.</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-700 font-bold text-sm">All Systems Operational</span>
          </div>
        </header>

        <div className="space-y-6">
          <div className="card-saas overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-4">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Services</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {services.map((s, i) => (
                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Uptime: {s.uptime} • Latency: {s.latency}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 px-3 py-1 bg-emerald-50 rounded-full">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-saas p-8">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Uptime History (Last 30 Days)</h2>
            <div className="flex items-end gap-1 h-12">
              {Array.from({ length: 60 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-sm ${Math.random() > 0.98 ? 'bg-amber-400' : 'bg-emerald-400'} transition-all hover:scale-y-125`}
                  style={{ height: `${70 + Math.random() * 30}%` }}
                  title="99.9% Operational"
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] font-bold text-slate-300">30 DAYS AGO</span>
              <span className="text-[10px] font-bold text-slate-300">TODAY</span>
            </div>
          </div>

          <div className="card-saas p-8">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Incident History</h2>
            <div className="space-y-6">
              <div className="flex gap-4 border-l-2 border-slate-100 pl-6 relative">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-300"></div>
                <div>
                  <p className="text-xs font-bold text-slate-900 mb-1">Minor Grounding Latency</p>
                  <p className="text-[10px] text-slate-500 font-medium mb-3">Dec 12, 2024 — Resolved in 14 minutes</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">"We identified an upstream issue with web grounding indexing. Research agents were fallback-routed to static documentation."</p>
                </div>
              </div>
              <div className="flex gap-4 border-l-2 border-slate-100 pl-6 relative">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-300"></div>
                <div>
                  <p className="text-xs font-bold text-slate-900 mb-1">System Maintenance</p>
                  <p className="text-[10px] text-slate-500 font-medium mb-1">Dec 01, 2024 — Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Powered by Global Monitoring Cluster 04
        </p>

      </div>
    </div>
  );
};

export default Status;
