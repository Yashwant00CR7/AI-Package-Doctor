
import React, { useState } from 'react';

interface ScheduleDemoProps {
  onBack: () => void;
}

const ScheduleDemo: React.FC<ScheduleDemoProps> = ({ onBack }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const timeSlots = [
    "09:00 AM EST", "10:30 AM EST", "01:00 PM EST", 
    "02:30 PM EST", "04:00 PM EST"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  if (formSubmitted) {
    return (
      <div className="section-light min-h-screen pt-48 pb-20 px-6">
        <div className="max-w-md mx-auto card-saas p-12 text-center space-y-6 animate-fade-in shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Demo Scheduled!</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We've sent a calendar invitation and technical brief to your engineering email. See you then!
            </p>
          </div>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            Back to Platform
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-light min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center pt-12">
          
          {/* Left Column: Context */}
          <div className="space-y-10">
            <div>
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Back to Home
              </button>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                See our Agentic Resolution <br /> 
                <span className="text-brand-primary">Engine in Action.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                Book a 15-minute technical deep dive into how Package Doctor orchestrates specialized AI agents to solve your most complex environment failures.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">What we'll cover:</h3>
              <ul className="space-y-4">
                {[
                  { title: "Agentic Orchestration", desc: "How Gemini 3 Pro delegates tasks between Query and Research agents." },
                  { title: "Local MCP Setup", desc: "A live demonstration of setting up the bridge in Cursor and VS Code." },
                  { title: "Enterprise Health Check", desc: "Audit your existing microservices for pending dependency debt." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center gap-8">
              <div>
                <p className="text-2xl font-black text-slate-900">500+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Teams Guided</p>
              </div>
              <div className="w-px h-10 bg-slate-100"></div>
              <div>
                <p className="text-2xl font-black text-slate-900">94%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fix Rate</p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="card-saas overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
               <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Book Technical Demo</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engineering Email</label>
                <input required type="email" placeholder="you@company.com" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all" />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Slots (Tomorrow)</label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`px-4 py-3 border rounded-xl text-[11px] font-bold transition-all ${
                        selectedTime === slot 
                          ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-blue-200' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={!selectedTime}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl shadow-xl shadow-blue-100 transition-all disabled:opacity-50 active:scale-95"
                >
                  Confirm Demo Booking
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-4 font-medium italic">
                  Demo includes a personalized conflict report for your repository.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScheduleDemo;
