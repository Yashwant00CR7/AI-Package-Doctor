
import React from 'react';

interface HomeProps {
  onGetStarted: () => void;
  onScheduleDemo: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted, onScheduleDemo }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-48 pb-24 text-center md:text-left md:flex items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-brand-primary text-[11px] font-bold rounded-full mb-6 uppercase tracking-wider">
            Now with Gemini 3 Pro
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
            Managed <span className="text-brand-primary">Package Health</span> <br /> for Modern DevOps.
          </h1>
          <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed mb-10">
            Intelligently resolve Python dependency conflicts using specialized AI agents and real-time grounding. Reduce environment errors by up to 94%.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              Run Free Diagnosis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
            <button 
              onClick={onScheduleDemo}
              className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl transition-all hover:bg-slate-50"
            >
              Schedule Demo
            </button>
          </div>
        </div>
        <div className="flex-1 mt-16 md:mt-0 relative">
          <div className="bg-slate-100 rounded-2xl p-4 shadow-2xl overflow-hidden border border-slate-200">
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
               <div className="h-4 bg-slate-100 rounded w-3/4"></div>
               <div className="h-4 bg-slate-100 rounded w-1/2"></div>
               <div className="flex gap-2">
                 <div className="h-8 w-8 bg-blue-100 rounded"></div>
                 <div className="h-8 flex-1 bg-blue-600 rounded"></div>
               </div>
             </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white shadow-xl rounded-xl p-4 border border-slate-100 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Conflicts Fixed</p>
                <p className="text-lg font-extrabold text-brand-primary">1.2M+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="section-light py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Core Competencies</h2>
            <p className="text-slate-500 font-medium">Built for scale, security, and developer productivity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Deep Research',
                desc: 'Agents verify compatibility matrices against official documentation in real-time.',
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
                color: 'text-blue-600'
              },
              {
                title: 'Contextual Logic',
                desc: 'Not just version bumps. Our AI understands breaking changes and refactoring paths.',
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
                color: 'text-purple-600'
              },
              {
                title: 'Bridge Technology',
                desc: 'MCP implementation allows the Doctor to operate inside your local environment.',
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
                color: 'text-emerald-600'
              }
            ].map((feature, i) => (
              <div key={i} className="card-saas p-10 hover:shadow-lg transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
