
import React, { useState, useEffect, useRef } from 'react';
import { PackageDoctorService } from '../services/geminiService';
import { McpLog } from '../types';

const MCPStatus: React.FC = () => {
  const [logs, setLogs] = useState<McpLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [testPackage, setTestPackage] = useState('pandas');
  const [activeConfigTab, setActiveConfigTab] = useState<'cursor' | 'vscode' | 'cli'>('cursor');
  const scrollRef = useRef<HTMLDivElement>(null);
  const service = new PackageDoctorService();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: McpLog['type'], message: string, data?: any) => {
    setLogs(prev => [...prev.slice(-49), {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      data
    }]);
  };

  const handleSimulateTool = async () => {
    setIsSimulating(true);
    const requestId = Math.floor(Math.random() * 1000);
    addLog('incoming', `RPC REQUEST [ID: ${requestId}]`, { method: "tools/call", name: "solve_dependency_issue", args: { requirements: "numpy==1.26.4", error_log: "conflict" } });

    try {
      const result = await service.solveDependencyIssue("numpy==1.26.4", "conflict");
      addLog('outgoing', `RPC RESPONSE [ID: ${requestId}]`, { status: "success", result });
    } catch (err) {
      addLog('system', `INTERNAL EXCEPTION: ${(err as Error).message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleInstallSimulation = async () => {
    if (!testPackage) return;
    setIsSimulating(true);
    const requestId = Math.floor(Math.random() * 1000);
    addLog('incoming', `RPC REQUEST [ID: ${requestId}]`, { method: "tools/call", name: "simulate_installation", args: { packageName: testPackage, pythonVersion: "3.10" } });

    try {
      const result = await service.simulateInstallation(testPackage, "3.10", "linux");
      addLog('outgoing', `RPC RESPONSE [ID: ${requestId}]`, { status: "success", result });
    } catch (err) {
      addLog('system', `INTERNAL EXCEPTION: ${(err as Error).message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const configSnippets = {
    cursor: {
      path: ".cursor/mcp.json",
      code: `{
  "mcpServers": {
    "package-doctor": {
      "command": "npx",
      "args": ["-y", "@ai/package-doctor", "serve"],
      "env": {
        "GEMINI_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}`
    },
    vscode: {
      path: "settings.json (Global or Workspace)",
      code: `"mcp.servers": {
  "package-doctor": {
    "command": "npx",
    "args": ["@ai/package-doctor", "serve"],
    "enabled": true
  }
}`
    },
    cli: {
      path: "Terminal / Shell",
      code: `# Run the doctor globally
npx @ai/package-doctor analyze ./requirements.txt

# Start the JSON-RPC server
npx @ai/package-doctor serve --port 8080`
    }
  };

  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Protocol Active</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Model Context Protocol</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Integrate the Package Doctor directly into your developer workflow.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSimulateTool}
              disabled={isSimulating}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Test RPC Resolver
            </button>
            <button 
              onClick={handleInstallSimulation}
              disabled={isSimulating}
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isSimulating ? 'Authenticating...' : 'Simulate Install'}
            </button>
          </div>
        </div>

        {/* Console Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="card-saas p-8">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Live Sandbox</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package Name</label>
                  <input 
                    type="text" 
                    value={testPackage}
                    onChange={(e) => setTestPackage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500/10 focus:border-brand-primary outline-none"
                    placeholder="e.g. tensorflow"
                  />
                </div>
                <div className="p-4 border-l-4 border-brand-primary bg-blue-50/50 rounded-r-xl">
                   <p className="text-[10px] font-bold text-slate-900 uppercase mb-1">Local Bridge</p>
                   <p className="text-xs text-slate-500 font-mono">pkg-doctor-rpc-01</p>
                </div>
              </div>
            </div>

            <div className="card-saas p-8 bg-slate-900 text-white">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-400">Agent Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Status</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Memory Load</span>
                  <span className="text-xs font-bold">12%</span>
                </div>
                <div className="h-px bg-white/10 w-full"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Version</span>
                  <span className="text-xs font-mono text-slate-500">v1.2.4-stable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-[500px] card-saas overflow-hidden shadow-xl">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Inspector</span>
                </div>
                <button onClick={() => setLogs([])} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase">Clear</button>
             </div>
             
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-[11px] custom-scrollbar bg-white">
                {logs.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400 space-y-4">
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <p className="text-center font-bold tracking-widest uppercase">Waiting for tool activity...</p>
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="animate-fade-in border-l-2 border-slate-100 pl-4 pb-1 group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] text-slate-300 font-bold">{log.timestamp}</span>
                      <span className={`text-[9px] font-extrabold tracking-widest uppercase ${
                        log.type === 'incoming' ? 'text-blue-500' :
                        log.type === 'outgoing' ? 'text-emerald-500' :
                        'text-rose-400'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-slate-900 font-bold">{log.message}</span>
                    </div>
                    {log.data && (
                      <div className="mt-2 bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-600 overflow-x-auto group-hover:border-slate-200 transition-colors">
                        <pre className="whitespace-pre-wrap leading-relaxed">{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Detailed Integration Section */}
        <section className="pt-20 space-y-12">
           <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900">Developer Integration</h2>
              <p className="text-slate-500 font-medium">Follow these steps to enable Package Doctor in your preferred coding environment.</p>
           </div>

           <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left Column: Interactive Snippets */}
              <div className="card-saas overflow-hidden">
                 <div className="flex border-b border-slate-100 bg-slate-50/50">
                    {(['cursor', 'vscode', 'cli'] as const).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveConfigTab(tab)}
                        className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${
                          activeConfigTab === tab ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab === 'cli' ? 'Direct CLI' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                 </div>
                 <div className="p-8 space-y-6 bg-white">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Config Path:</span>
                       <span className="text-xs font-mono text-brand-primary bg-blue-50 px-2 py-0.5 rounded">{configSnippets[activeConfigTab].path}</span>
                    </div>
                    <div className="relative group">
                       <pre className="bg-slate-950 text-slate-300 p-6 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                          {configSnippets[activeConfigTab].code}
                       </pre>
                       <button 
                         onClick={() => navigator.clipboard.writeText(configSnippets[activeConfigTab].code)}
                         className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-all text-white opacity-0 group-hover:opacity-100"
                       >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                       </button>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
                       <svg className="w-5 h-5 text-brand-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {activeConfigTab === 'cursor' && "Cursor will automatically detect this server and offer tool calls when package errors occur in your chat."}
                          {activeConfigTab === 'vscode' && "Requires the 'MCP Client' extension. Ensure Node.js is in your system PATH."}
                          {activeConfigTab === 'cli' && "Best for CI/CD pipelines or manual audits before pushing to main branches."}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Right Column: Narrative Steps */}
              <div className="space-y-8">
                 <div className="space-y-6">
                    {[
                      {
                        step: "01",
                        title: "Prepare Your Project",
                        desc: "Ensure you have a requirements.txt or pyproject.toml in your root directory. The Doctor agents rely on scanning these files for context."
                      },
                      {
                        step: "02",
                        title: "Install the CLI Bridge",
                        desc: "The MCP server runs via Node.js. Use npx to start it instantly without global installation, or install globally using npm install -g @ai/package-doctor."
                      },
                      {
                        step: "03",
                        title: "API Authentication",
                        desc: "The server requires a valid Google Gemini API Key. Set it as an environment variable in your IDE configuration as shown in the snippets."
                      },
                      {
                        step: "04",
                        title: "Verify Connection",
                        desc: "Once configured, try asking your IDE assistant: 'Can you use the package doctor to check my environment health?'"
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 group">
                         <div className="text-2xl font-black text-slate-100 group-hover:text-blue-100 transition-colors shrink-0 leading-none">{item.step}</div>
                         <div className="space-y-2 pb-6 border-b border-slate-50 last:border-0">
                            <h4 className="font-bold text-slate-900 tracking-tight">{item.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Command Reference */}
        <section className="pb-20">
           <div className="card-saas overflow-hidden border-slate-100">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">MCP Tool Definitions</h3>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">v1.2 Protocol</span>
              </div>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/30">
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Tool Name</th>
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Capability</th>
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Primary Args</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <tr>
                       <td className="px-8 py-5 text-sm font-bold text-slate-900">solve_dependency_issue</td>
                       <td className="px-8 py-5 text-sm text-slate-500 font-medium">Auto-fix requirements.txt based on terminal error logs.</td>
                       <td className="px-8 py-5 text-[11px] font-mono text-brand-primary">requirements, error_log</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-5 text-sm font-bold text-slate-900">simulate_installation</td>
                       <td className="px-8 py-5 text-sm text-slate-500 font-medium">Predict installation risks, OS dependencies, and breaking changes.</td>
                       <td className="px-8 py-5 text-[11px] font-mono text-brand-primary">packageName, pythonVersion</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-5 text-sm font-bold text-slate-900">audit_vulnerabilities</td>
                       <td className="px-8 py-5 text-sm text-slate-500 font-medium">Scans for CVEs and known security flaws in current dependency tree.</td>
                       <td className="px-8 py-5 text-[11px] font-mono text-brand-primary">requirements</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </section>

      </div>
    </div>
  );
};

export default MCPStatus;
