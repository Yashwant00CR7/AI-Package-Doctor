
import React, { useState, useEffect, useRef } from 'react';
import { PackageDoctorService } from '../services/geminiService';
import { McpLog } from '../types';

type ConfigTab = 'cursor' | 'vscode' | 'jetbrains' | 'zed' | 'github' | 'local';

const MCPStatus: React.FC = () => {
  const [logs, setLogs] = useState<McpLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [testPackage, setTestPackage] = useState('pandas');
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('cursor');
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const service = new PackageDoctorService();
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
    const service = new PackageDoctorService();
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

  const configSnippets: Record<ConfigTab, { path: string; code: string; hint: string }> = {
    cursor: {
      path: ".cursor/mcp.json",
      code: `{
  "mcpServers": {
    "package-doctor": {
      "command": "node",
      "args": ["/absolute/path/to/doctor-mcp/doctor-bridge.mjs"],
      "env": {
        "GEMINI_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}`,
      hint: "Use the absolute path to the .mjs file inside your project folder."
    },
    vscode: {
      path: "settings.json",
      code: `"mcp.servers": {
  "package-doctor": {
    "command": "node",
    "args": ["C:\\\\Users\\\\Name\\\\doctor-mcp\\\\doctor-bridge.mjs"],
    "enabled": true
  }
}`,
      hint: "Ensure double-backslashes are used for Windows paths."
    },
    jetbrains: {
      path: "mcp-servers.json",
      code: `{
  "mcpServers": {
    "package-doctor": {
      "command": "node",
      "args": ["/absolute/path/to/doctor-mcp/doctor-bridge.mjs"]
    }
  }
}`,
      hint: "JetBrains IDEs look for this JSON in the project root or IDE config dir."
    },
    zed: {
      path: "settings.json",
      code: `{
  "context_providers": {
    "mcp": [
      {
        "name": "package-doctor",
        "command": "node",
        "args": ["/absolute/path/to/doctor-mcp/doctor-bridge.mjs"]
      }
    ]
  }
}`,
      hint: "Zed uses the 'node' command to spawn the stdio transport."
    },
    github: {
      path: ".github/workflows/audit.yml",
      code: `jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: |
          npm init -y
          npm pkg set type="module"
          npm install @modelcontextprotocol/sdk
      - name: Run Audit
        run: node ./doctor-bridge.mjs audit`,
      hint: "CI/CD requires explicit dependency installation in the runner."
    },
    local: {
      path: "Terminal & Script",
      code: `# 1. Setup Folder (Fixes ERR_MODULE_NOT_FOUND)
mkdir doctor-mcp && cd doctor-mcp
npm init -y
npm pkg set type="module"
npm install @modelcontextprotocol/sdk

# 2. doctor-bridge.mjs (Save in same folder)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "PackageDoctor",
  version: "1.0.0"
});

const transport = new StdioServerTransport();
await server.connect(transport);`,
      hint: "The 'npm pkg set type=\"module\"' command is vital for ESM resolution."
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
              Connect the Package Doctor to your IDE using the standard MCP bridge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleSimulateTool}
              disabled={isSimulating}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Test Resolver
            </button>
            <button 
              onClick={handleInstallSimulation}
              disabled={isSimulating}
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {isSimulating ? 'Processing...' : 'Simulate Install'}
            </button>
          </div>
        </div>

        {/* Configuration Section */}
        <section className="pt-8 space-y-12">
           <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900">Environment Setup</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Select your integration target and follow the setup script carefully to ensure module resolution.
              </p>
           </div>

           <div className="grid lg:grid-cols-2 gap-12">
              <div className="card-saas overflow-hidden shadow-lg border-slate-100">
                 <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50">
                    {(Object.keys(configSnippets) as ConfigTab[]).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveConfigTab(tab)}
                        className={`px-4 py-4 text-[9px] font-bold uppercase tracking-widest transition-all border-r border-slate-100 ${
                          activeConfigTab === tab ? 'bg-white text-brand-primary border-b-2 border-brand-primary' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab === 'local' ? 'Bridge Script' : tab === 'github' ? 'GH Actions' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                 </div>
                 <div className="p-8 space-y-6 bg-white">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Configuration:</span>
                       <span className="text-xs font-mono text-brand-primary bg-blue-50 px-2 py-0.5 rounded">{configSnippets[activeConfigTab].path}</span>
                    </div>
                    <div className="relative group">
                       <pre className="bg-slate-950 text-slate-300 p-6 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[350px]">
                          {configSnippets[activeConfigTab].code}
                       </pre>
                       <button 
                         onClick={() => navigator.clipboard.writeText(configSnippets[activeConfigTab].code)}
                         className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-all text-white"
                       >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                       </button>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
                       <svg className="w-5 h-5 text-brand-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                          {configSnippets[activeConfigTab].hint}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col h-full card-saas overflow-hidden shadow-xl">
                 <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Inspector</span>
                    <button onClick={() => setLogs([])} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase">Clear</button>
                 </div>
                 <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-[11px] custom-scrollbar bg-white min-h-[400px]">
                    {logs.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400 space-y-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        <p className="text-center font-bold tracking-widest uppercase">Awaiting activity...</p>
                      </div>
                    )}
                    {logs.map((log, i) => (
                      <div key={i} className="animate-fade-in border-l-2 border-slate-100 pl-4 group">
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
                          <div className="mt-2 bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-600 overflow-x-auto">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(log.data, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Tool Capability Reference */}
        <section className="pb-20">
           <div className="card-saas overflow-hidden border-slate-100">
              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100">
                 <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">MCP Interface Specification</h3>
              </div>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/30">
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Tool</th>
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Description</th>
                       <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Arguments</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <tr>
                       <td className="px-8 py-5 text-sm font-bold text-slate-900">solve_dependency_issue</td>
                       <td className="px-8 py-5 text-sm text-slate-500 font-medium">Resolves conflicts in requirements.txt using terminal logs.</td>
                       <td className="px-8 py-5 text-[11px] font-mono text-brand-primary">requirements, error_log</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-5 text-sm font-bold text-slate-900">simulate_installation</td>
                       <td className="px-8 py-5 text-sm text-slate-500 font-medium">Predicts installation risks and OS dependencies.</td>
                       <td className="px-8 py-5 text-[11px] font-mono text-brand-primary">packageName, pythonVersion</td>
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
