
import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 animate-fade-in">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md mb-6 uppercase tracking-wider">
            Last Updated: December 2024
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-500 font-medium">How we protect your engineering data and environment specifications.</p>
        </header>

        <div className="card-saas p-10 space-y-10 text-slate-600">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">1. Data Collection & Scope</h2>
            <p className="text-sm leading-relaxed">
              Package Doctor is designed as a "Privacy-First" technical tool. We collect specifically identified technical information required to resolve dependency conflicts, including:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>Content of submitted <code className="bg-slate-50 px-1 rounded">requirements.txt</code> or environment configuration files.</li>
              <li>Terminal error logs and compiler output provided for diagnosis.</li>
              <li>Metadata via the Model Context Protocol (MCP) strictly limited to tool execution.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">2. AI Processing & Gemini API</h2>
            <p className="text-sm leading-relaxed">
              Processing is performed using Google's Gemini models. When you provide your own API key, your data processing is governed by your specific agreement with Google Cloud Platform. We do not use your technical inputs to train global foundational models outside of your project's scope.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">3. Data Retention</h2>
            <p className="text-sm leading-relaxed">
              Diagnosis results and logs are stored locally in your browser session. Our backend does not maintain a permanent database of your source code or project structure. Once the session is cleared, the transient data is purged from the application environment.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">4. Security Measures</h2>
            <p className="text-sm leading-relaxed">
              All communications between the Package Doctor client and the AI Reasoning Engine are encrypted via TLS 1.3. The MCP bridge operates within your local system boundaries and only exports the minimum context needed for the selected agentic task.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">Questions? Contact <span className="text-brand-primary">privacy@packagedoctor.ai</span></p>
            <button onClick={() => window.print()} className="text-xs font-bold text-slate-900 hover:text-brand-primary transition-colors">Download PDF</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
