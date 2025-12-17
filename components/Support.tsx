
import React, { useState } from 'react';

const Support: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the MCP bridge handle my local environment?",
      answer: "The Model Context Protocol (MCP) bridge acts as a secure proxy between your IDE (Cursor, VS Code, etc.) and our AI agents. It only transmits technical data like requirements.txt and terminal logs. It does not access your source code unless explicitly requested for context."
    },
    {
      question: "Why do I need a Gemini Pro API key?",
      answer: "Package Doctor uses advanced reasoning capabilities found in Gemini 3 Pro to simulate complex dependency graphs. This requires an API key linked to a project with billing enabled to handle the deep search and high-token reasoning tasks."
    },
    {
      question: "Does it support private PyPI registries?",
      answer: "Currently, our research agents index public PyPI data. Enterprise users can configure internal proxy bridges to index private artifacts by providing a custom research endpoint in the MCP configuration."
    },
    {
      question: "What is 'ERR_MODULE_NOT_FOUND' when setting up the bridge?",
      answer: "This is a common Node.js ESM error. Ensure you have 'type': 'module' in your package.json or use the .mjs extension for your bridge script as shown in the MCP Status guide."
    }
  ];

  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 animate-fade-in">
        
        {/* Hero Section */}
        <header className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">How can we help you?</h1>
          <p className="text-lg text-slate-500 font-medium">Find answers to technical questions or reach out to our engineering team.</p>
          <div className="mt-8 relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Search documentation, errors, or configuration..." 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Section */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Frequently Asked Questions</h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className="card-saas overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 group"
                >
                  <span className={`font-bold text-sm transition-colors ${activeFaq === idx ? 'text-brand-primary' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-brand-primary' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium pt-2 border-t border-slate-50">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact & Resources */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card-saas p-8 bg-brand-primary text-white shadow-xl shadow-blue-200 border-none">
              <h3 className="text-xl font-bold mb-2">Technical Support</h3>
              <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">
                Can't resolve a conflict? Our agents can help you debug manually. High-priority response for enterprise accounts.
              </p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Engineering Email" 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-blue-200 outline-none focus:bg-white/20 transition-all"
                />
                <textarea 
                  placeholder="Describe the dependency issue..." 
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-blue-200 outline-none focus:bg-white/20 transition-all resize-none"
                />
                <button 
                  type="button"
                  className="w-full py-3 bg-white text-brand-primary font-bold rounded-lg text-sm shadow-lg hover:bg-blue-50 transition-all"
                >
                  Submit Ticket
                </button>
              </form>
            </div>

            <div className="card-saas p-8 space-y-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Self-Serve Resources</h4>
              <div className="grid gap-4">
                {[
                  { title: 'API Documentation', label: 'PDF/Docs', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                  { title: 'Conflict Signatures', label: 'Reference', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { title: 'Community Discord', label: 'Forum', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' }
                ].map((res, i) => (
                  <button key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all group w-full text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:bg-blue-50 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={res.icon}/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">{res.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{res.label}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
