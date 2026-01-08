
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { useLocalization, useAuth, useNotifications } from '../App';
import { TrustAudit } from '../types';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, formatPrice } = useLocalization();
  const { user, toggleFollowProject, toggleFollowTech, purchaseProject } = useAuth();
  const { addNotification } = useNotifications();
  const project = MOCK_PROJECTS.find(p => p.id === id);
  
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<TrustAudit | null>(project?.audit || null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'method' | 'processing' | 'success'>('method');
  
  // Demo States
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [resumeData, setResumeData] = useState({
    name: 'Jane Developer', role: 'Full Stack Engineer',
    summary: 'Expert in building scalable web architectures with a focus on high-performance UX.',
    skills: 'React, Node.js, AI, TypeScript'
  });

  if (!project) return <div className="text-center py-20 font-black uppercase text-zinc-600">404: Node Not Found</div>;

  const isAlreadyOwned = user?.purchasedProjectIds.includes(project.id);

  const performTrustAudit = async () => {
    setIsAuditing(true);
    addNotification('AI_INSIGHT', `Neural Trust Engine initiated audit for ${project.title}.`, project.title);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Evaluate: ${project.title}. Stack: ${project.techStack.join(', ')}. Desc: ${project.fullDescription}.`,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { score: { type: Type.INTEGER }, level: { type: Type.STRING }, breakdown: { type: Type.OBJECT, properties: { maintainability: { type: Type.INTEGER }, security: { type: Type.INTEGER }, documentation: { type: Type.INTEGER }, relevance: { type: Type.INTEGER }, readiness: { type: Type.INTEGER }, ethics: { type: Type.INTEGER } } }, reasoning: { type: Type.STRING }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, redFlags: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['score', 'level', 'breakdown', 'reasoning', 'recommendations', 'redFlags'] }, systemInstruction: "Senior Security Auditor persona." }
      });
      const parsed = JSON.parse(response.text || '{}');
      setAuditResult({ ...parsed, timestamp: new Date().toISOString() });
      addNotification('UPDATE', `Audit complete for ${project.title}. Score: ${parsed.score}% Integrity.`, project.title, parsed.score < 50 ? 'High' : 'Normal');
    } catch (e) { console.error(e); } finally { setIsAuditing(false); }
  };

  const fetchSimpleExplanation = async () => {
    if (aiSummary) { setAiSummary(null); return; }
    setIsAiSimplifying(true);
    addNotification('AI_INSIGHT', `Project Mentor is translating ${project.title} for non-technical review.`, project.title);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: `Explain simply: ${project.title}. Desc: ${project.fullDescription}.`,
        config: { systemInstruction: "Patient technology mentor persona." }
      });
      setAiSummary(response.text || "System sync failure.");
      addNotification('UPDATE', `Mentor Insights synchronized for ${project.title}.`, project.title);
    } catch (e) { console.error(e); } finally { setIsAiSimplifying(false); }
  };

  const handlePurchase = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        setIsCheckoutOpen(false);
        purchaseProject(project);
      }, 1500);
    }, 2000);
  };

  const handleDemoTrigger = () => {
    setDemoState('loading');
    addNotification('ENGAGEMENT', `Live demo deployment initiated for ${project.title}.`, project.title);
    setTimeout(() => setDemoState('active'), 1500);
  };

  const handleAiResumeOptimize = async () => {
    setIsOptimizing(true);
    addNotification('AI_INSIGHT', `Neural Navigator is optimizing resume parameters for Node_${project.id}`, project.title);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Professionalize this resume: Summary: ${resumeData.summary} Skills: ${resumeData.skills}`,
        config: { systemInstruction: "Tech recruiter persona. Rewrite to be metrics-driven. Use 'SKILLS:' to separate.", }
      });
      const parts = (response.text || "").split('SKILLS:');
      setResumeData(prev => ({ ...prev, summary: parts[0]?.trim() || prev.summary, skills: parts[1]?.trim() || prev.skills }));
    } catch (error) { console.error('AI Error:', error); }
    finally { setIsOptimizing(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Sandbox Overlay */}
      {demoState !== 'idle' && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex flex-col p-8 md:p-16 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-4">
               <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.7)]"></div>
               <span className="text-purple-400 font-black text-xs uppercase tracking-[0.4em] font-mono">Live_Instance_{project.id}</span>
             </div>
             <button onClick={() => setDemoState('idle')} className="group/close p-3 hover:bg-white/10 rounded-full transition-all">
               <svg className="w-6 h-6 text-zinc-500 group-hover/close:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          {demoState === 'loading' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 mb-10"><div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div><div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div></div>
              <p className="text-zinc-500 font-black text-xs uppercase tracking-[0.5em] animate-pulse">Syncing architectural fragments...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
              {project.id === '7' ? (
                <div className="flex-1 flex flex-col gap-10 overflow-hidden">
                  <div className="bg-zinc-900/40 border border-zinc-800/60 p-10 rounded-[2.5rem] space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-black text-sm uppercase tracking-widest">Neural Resume Architect</h4>
                      <button onClick={handleAiResumeOptimize} disabled={isOptimizing} className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/30 transition-all disabled:opacity-50">
                        {isOptimizing ? 'Analyzing career path...' : '⚡ Optimize with AI'}
                      </button>
                    </div>
                    <textarea value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-5 text-sm h-48 resize-none text-zinc-300 font-medium focus:border-purple-500/50 outline-none transition-all" />
                  </div>
                  <div className="flex-1 bg-white text-zinc-950 p-12 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-8 border-b border-zinc-100 pb-8">
                      <div>
                        <h4 className="font-black text-5xl tracking-tighter uppercase leading-none mb-2">{resumeData.name}</h4>
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em]">Professional Synopsis</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Architected_Node_07</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <p className="text-lg leading-relaxed text-zinc-800 italic font-medium">"{resumeData.summary}"</p>
                      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-50">
                        <div>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Core Competencies</p>
                          <p className="text-sm font-bold text-zinc-600 leading-relaxed">{resumeData.skills}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-4">Experience Record</p>
                          <p className="text-sm font-bold text-zinc-600 leading-relaxed">Generated historical career fragments are stored in local buffers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-zinc-900/10 border border-zinc-800/40 rounded-[4rem]">
                  <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center text-3xl mb-10 shadow-2xl">🔒</div>
                  <h4 className="text-white font-black text-3xl tracking-tighter mb-6 uppercase leading-none">Access Restricted</h4>
                  <p className="text-zinc-500 text-lg mb-16 max-w-[420px] font-medium italic mx-auto">"Full interaction with this architecture is reserved for verified collaborators. You are viewing a secure preview."</p>
                  <div className="flex gap-6">
                    <button onClick={() => setDemoState('idle')} className="bg-zinc-900 text-zinc-400 font-black text-[11px] px-12 py-5 rounded-2xl uppercase tracking-[0.3em] border border-zinc-800 hover:border-zinc-700 transition-all">Close Instance</button>
                    {!isAlreadyOwned && (
                      <button onClick={() => { setDemoState('idle'); setIsCheckoutOpen(true); }} className="bg-purple-500 text-black font-black text-[11px] px-12 py-5 rounded-2xl uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">Unlock Source</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 p-12 rounded-[4rem] shadow-2xl animate-in zoom-in-95">
            {checkoutStep === 'method' ? (
              <div className="text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">Secure Checkout</h2>
                <p className="text-zinc-500 mb-10 text-sm">Initializing payment protocol for: <br/><span className="text-white font-black">{project.title}</span></p>
                <div className="space-y-4 mb-8">
                  <button className="w-full p-6 rounded-2xl border bg-purple-500/10 border-purple-500 text-white font-black text-xs uppercase tracking-widest">Digital Credits (Auto)</button>
                </div>
                <button onClick={handlePurchase} className="w-full bg-purple-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest shadow-xl shadow-purple-500/20">Confirm Purchase</button>
              </div>
            ) : checkoutStep === 'processing' ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-black uppercase">Validating Transaction Hash</h2>
                <p className="text-zinc-600 text-[10px] mt-2 font-black uppercase tracking-widest">Syncing with Financial Ledger...</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-500 text-black rounded-full flex items-center justify-center text-2xl mx-auto mb-6">✓</div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Instance Acquired</h2>
                <p className="text-zinc-600 text-[10px] mt-2 font-black uppercase tracking-widest">Download protocol initialized.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-purple-500 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Back to Archive</button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-[3.5rem] overflow-hidden shadow-2xl">
            <img src={project.image} className="w-full aspect-video object-cover" alt="" />
            <div className="p-12">
              <div className="mb-12 flex justify-between items-start">
                <div><h1 className="text-6xl font-black tracking-tighter mb-4 uppercase leading-none">{project.title}</h1><p className="text-purple-500 font-black text-xl italic">{project.authorName}</p></div>
                <button onClick={() => toggleFollowProject(project.id)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${user?.followedProjects.includes(project.id) ? 'bg-purple-500 border-purple-500 text-black shadow-lg shadow-purple-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}>
                  {user?.followedProjects.includes(project.id) ? 'Subscribed' : 'Subscribe to Node'}
                </button>
              </div>

              {/* Trust Engine */}
              <div className="mb-16 bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase text-white tracking-tighter">Neural Trust Engine</h3>
                  {!auditResult && <button onClick={performTrustAudit} disabled={isAuditing} className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">{isAuditing ? 'Auditing...' : 'Initialize Integrity Check'}</button>}
                </div>
                {auditResult && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {Object.entries(auditResult.breakdown).map(([k, v]) => (
                      <div key={k} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-zinc-500">{k}</span><span className="text-white">{v}%</span></div>
                        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${v}%` }}></div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mentor */}
              <div className="mb-16 bg-zinc-900/20 border border-zinc-800 p-10 rounded-[3rem]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-black text-xl uppercase tracking-tighter">Project Mentor</h3>
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl">💡</div>
                </div>
                {!aiSummary && <button onClick={fetchSimpleExplanation} className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">{isAiSimplifying ? 'Translating logic...' : 'Human Language Translation'}</button>}
                {aiSummary && <p className="mt-8 p-10 bg-zinc-950/80 rounded-[2rem] text-zinc-300 italic text-xl border-l-8 border-amber-500 leading-relaxed shadow-xl animate-in slide-in-from-left-4 duration-500">"{aiSummary}"</p>}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-400 text-xl leading-relaxed mb-16 font-medium italic opacity-90">"{project.fullDescription}"</p>
                <div className="flex flex-wrap gap-4 pt-8 border-t border-zinc-900">
                  {project.techStack.map(tech => (
                    <button key={tech} onClick={() => toggleFollowTech(tech)} className={`px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${user?.followedTech.includes(tech) ? 'bg-purple-500 text-black border-purple-500 shadow-lg shadow-purple-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-700'}`}>
                      {tech} {user?.followedTech.includes(tech) ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 bg-zinc-950 border border-purple-500/20 p-12 rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4">License Acquisition</p>
            <h2 className="text-6xl font-black text-white tracking-tighter mb-12">{formatPrice(project.price)}</h2>
            
            <div className="space-y-4">
              {isAlreadyOwned ? (
                <button disabled className="w-full bg-zinc-900 text-zinc-500 border border-zinc-800 font-black py-6 rounded-[2rem] uppercase tracking-widest cursor-default">Instance Already Owned</button>
              ) : (
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-6 rounded-[2rem] uppercase tracking-widest shadow-2xl shadow-purple-500/20 active:scale-95 transition-all">Secure License</button>
              )}
              
              <button 
                onClick={handleDemoTrigger}
                className="w-full bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 font-black py-6 rounded-[2rem] uppercase tracking-widest active:scale-95 transition-all"
              >
                Try Live Demo
              </button>
            </div>
            
            <div className="mt-12 pt-12 border-t border-zinc-900">
              <div className="flex items-center gap-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Secure Artifact Retrieval
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectDetailPage;
