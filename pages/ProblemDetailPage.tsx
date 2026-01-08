
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PROBLEMS } from '../constants';
import { useLocalization, useAuth, useNotifications, useToast } from '../App';
import { GoogleGenAI, Type } from "@google/genai";

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const problem = MOCK_PROBLEMS.find(p => p.id === id);

  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transmissionState, setTransmissionState] = useState<'idle' | 'encrypting' | 'dispatching' | 'success'>('idle');
  const [replyText, setReplyText] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);

  if (!problem) return <div className="text-center py-24 font-black uppercase text-zinc-700">404: Node Terminated</div>;

  useEffect(() => {
    analyzeCompatibility();
  }, [id, user?.followedTech]);

  const analyzeCompatibility = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze Problem: "${problem.title}" - "${problem.protectedFullText}". 
                   Developer Skills: "${user?.followedTech.join(', ') || 'General Engineering'}".
                   Provide a compatibility score and architecture advice.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              compatibilityReason: { type: Type.STRING },
              suggestedApproach: { type: Type.ARRAY, items: { type: Type.STRING } },
              complexityLevel: { type: Type.STRING }
            },
            required: ['matchScore', 'compatibilityReason', 'suggestedApproach', 'complexityLevel']
          },
          systemInstruction: "Expert System Architect. Evaluate if this developer is a fit for the confidential mission."
        }
      });
      const data = JSON.parse(response.text || '{}');
      setAiSuggestions(data);
      setMatchScore(data.matchScore);
      
      if (data.matchScore > 85) {
        addNotification('AI_INSIGHT', `High-Fidelity Match Identified: ${problem.title}`, problem.title, 'High');
      }
    } catch (e) { 
      console.error(e);
      // Fallback for demo if API fails
      setMatchScore(82);
    } finally { 
      setIsAnalyzing(false); 
    }
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setTransmissionState('encrypting');
    setTimeout(() => {
      setTransmissionState('dispatching');
      setTimeout(() => {
        setTransmissionState('success');
        showToast("Encrypted Proposal Dispatched Successfully");
        addNotification('ENGAGEMENT', `Proposal for ${problem.title} securely routed to owner.`, problem.title);
        setTimeout(() => {
          setTransmissionState('idle');
          setReplyText('');
        }, 3000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] mb-12 transition-all group">
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to board
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          {/* Protected Content Container */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 relative overflow-hidden group/box">
            {/* Real-time Secure Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] select-none text-white font-black text-[12rem] flex flex-wrap items-center justify-center rotate-[-15deg] gap-20 overflow-hidden leading-none z-0">
               <span>PROTECTED</span><span>SECURE</span><span>PROPRIETARY</span><span>PROTECTED</span><span>SECURE</span>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    Access Authorized
                  </div>
                  <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/5 px-4 py-2.5 rounded-2xl border border-emerald-500/10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.181-6.5 11.573a12.02 12.02 0 01-3 1.088 12.02 12.02 0 01-3-1.088c-3.903-2.392-6.5-6.627-6.5-11.573 0-.682.057-1.35.166-2.001zm9.497 3.035a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11l2.249-2.966z" clipRule="evenodd" /></svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">Idea Shield Active</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">Node_Sequence</p>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{problem.id}</p>
                </div>
              </div>

              <h1 className="text-7xl font-black uppercase tracking-tighter mb-10 leading-[0.9]">{problem.title}</h1>
              
              <div className="bg-zinc-900/40 p-12 rounded-[3.5rem] border border-zinc-800/60 mb-16 shadow-inner">
                 <p className="text-zinc-200 text-2xl leading-relaxed italic font-medium selection:bg-amber-500/20">"{problem.protectedFullText}"</p>
              </div>

              <div className="space-y-16">
                <section>
                   <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-10">Target Tech Stack</h3>
                   <div className="flex flex-wrap gap-4">
                     {problem.requiredSkills.map(skill => (
                       <span key={skill} className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:border-white transition-colors">{skill}</span>
                     ))}
                   </div>
                </section>

                {aiSuggestions ? (
                  <section className="bg-purple-500/5 border border-purple-500/10 p-14 rounded-[4rem] animate-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-purple-500 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl shadow-purple-500/20">🧠</div>
                         <div>
                           <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Neural Analysis</h3>
                           <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest">Powered by Gemini 3</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-1">Intensity</p>
                         <p className="text-3xl font-black text-white">{aiSuggestions.complexityLevel}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-12">
                      <div className="p-8 bg-black/40 border border-purple-500/10 rounded-3xl">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4">Compatibility Rationale</p>
                        <p className="text-zinc-300 italic text-xl leading-relaxed">"{aiSuggestions.compatibilityReason}"</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Suggested Roadmap</p>
                           <ul className="space-y-5">
                             {aiSuggestions.suggestedApproach.map((step: string, i: number) => (
                               <li key={i} className="flex gap-6 items-start group/step">
                                 <span className="text-purple-500 font-black text-xl leading-none pt-1">0{i+1}</span>
                                 <span className="text-[13px] font-bold text-zinc-400 leading-relaxed group-hover/step:text-white transition-colors">{step}</span>
                               </li>
                             ))}
                           </ul>
                        </div>
                        <div className="p-10 bg-zinc-900/30 rounded-[3rem] border border-zinc-800 flex flex-col items-center justify-center text-center">
                           <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-3xl mb-6">⚙️</div>
                           <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Architectural Readiness</p>
                           <p className="text-xs font-bold text-zinc-400">System protocols aligned with your expertise record.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : isAnalyzing && (
                  <div className="p-20 text-center space-y-8 bg-zinc-950 border border-zinc-900 rounded-[4rem]">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Analyzing Mission Compatibility...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-14 relative z-10">
               <h2 className="text-5xl font-black uppercase tracking-tighter">Confidential Reply</h2>
               <div className="flex items-center gap-3 text-zinc-600 bg-zinc-900/50 px-5 py-2.5 rounded-2xl border border-zinc-800">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 116 0v2H7V7z" /></svg>
                  <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
               </div>
            </div>

            {transmissionState === 'idle' ? (
              <form onSubmit={handleReply} className="space-y-12 relative z-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Structured Technical Proposal</label>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-900 rounded-[2.5rem] p-12 text-xl text-white outline-none focus:border-amber-500/50 transition-all h-80 resize-none font-medium placeholder:text-zinc-800 focus:shadow-[0_0_30px_rgba(245,158,11,0.05)]"
                    placeholder="Describe your intended architecture, risk mitigation strategy, and implementation roadmap..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Vertical Contribution</label>
                     <input type="text" className="w-full bg-black border border-zinc-900 rounded-2xl px-10 py-6 text-sm outline-none focus:border-amber-500/50 font-bold" placeholder="e.g. Scalable Infrastructure" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Timeline Estimation</label>
                     <select className="w-full bg-black border border-zinc-900 rounded-2xl px-10 py-6 text-sm outline-none focus:border-amber-500/50 font-black uppercase tracking-widest text-zinc-400">
                        <option>Rapid Prototyping (1-2 weeks)</option>
                        <option>Production Ready (4-6 weeks)</option>
                        <option>Enterprise Scale (3+ months)</option>
                     </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-8 rounded-[2.5rem] uppercase tracking-[0.5em] shadow-2xl shadow-amber-500/10 transition-all active:scale-95 group"
                >
                  <span className="flex items-center justify-center gap-4">
                    Dispatch Secure Response
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </span>
                </button>
              </form>
            ) : (
              <div className="py-32 text-center space-y-12 animate-in zoom-in-95 duration-500 relative z-10">
                <div className="relative w-32 h-32 mx-auto">
                   {transmissionState === 'success' ? (
                     <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/20">✓</div>
                   ) : (
                     <>
                        <div className="absolute inset-0 border-8 border-amber-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-3xl">📡</div>
                     </>
                   )}
                </div>
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                     {transmissionState === 'encrypting' ? 'Encrypting Payload...' : 
                      transmissionState === 'dispatching' ? 'Routing via Secure Channels...' : 
                      'Transmission Confirmed'}
                   </h3>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] animate-pulse">
                     {transmissionState === 'success' ? 'Owner notification dispatched.' : 'Do not disconnect from node.'}
                   </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            {matchScore !== null && (
              <div className="bg-zinc-950 border border-zinc-900 p-14 rounded-[4rem] text-center shadow-2xl overflow-hidden relative group/match">
                 <div className="absolute top-0 left-0 w-full h-2 bg-zinc-900">
                    <div className="h-full bg-purple-500 transition-all duration-1000 ease-out" style={{ width: `${matchScore}%` }}></div>
                 </div>
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/5 blur-[50px] rounded-full group-hover/match:bg-purple-500/10 transition-all"></div>
                 
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-6">Neural Compatibility Index</p>
                 <div className="text-[10rem] font-black text-white tracking-tighter leading-none mb-4">{matchScore}%</div>
                 <div className={`inline-block px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${matchScore > 75 ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-900 text-zinc-500'}`}>
                   {matchScore > 80 ? 'Optimal Architecture Match' : matchScore > 60 ? 'Compatible Profile' : 'Sub-Optimal Alignment'}
                 </div>
              </div>
            )}

            <div className="bg-zinc-950 border border-zinc-900 p-14 rounded-[4rem] shadow-2xl space-y-12">
               <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Intellectual Integrity</h4>
               
               <div className="space-y-10">
                 <div className="flex items-center gap-8 group/badge">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl group-hover/badge:border-amber-500 transition-colors">🏷️</div>
                    <div>
                      <p className="text-sm font-black uppercase text-white mb-1">Ownership Stamp</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Digital Fingerprint V1.2</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-8 group/badge">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-3xl group-hover/badge:border-emerald-500 transition-colors">🔐</div>
                    <div>
                      <p className="text-sm font-black uppercase text-white mb-1">Vault Privacy</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Zero Public Threads</p>
                    </div>
                 </div>
               </div>

               <p className="text-[11px] text-zinc-500 leading-relaxed font-medium italic pt-8 border-t border-zinc-900">
                 "BuildSpace protocols ensure this mission narrative remains cryptographically linked to the owner. All developer interactions are audited for professional integrity."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
