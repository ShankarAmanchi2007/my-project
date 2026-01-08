
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PROJECTS } from '../constants';
import { Project } from '../types';
import { useLocalization, useToast, useAuth, useNotifications } from '../App';
import { GoogleGenAI } from "@google/genai";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [demoState, setDemoState] = useState<'idle' | 'loading' | 'active'>('idle');
  const { t, formatPrice } = useLocalization();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const { user, toggleFollowTech } = useAuth();
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    name: 'Jane Developer', role: 'Full Stack Engineer',
    summary: 'Expert in building scalable web architectures with a focus on high-performance UX.',
    skills: 'React, Node.js, AI, TypeScript'
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleDemoTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    setDemoState('loading');
    addNotification('ENGAGEMENT', `New instance deployment initiated for ${project.title}.`, project.title);
    setTimeout(() => setDemoState('active'), 1200);
  };

  const handleFollowAuthorToggle = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const newState = !isFollowingAuthor;
    setIsFollowingAuthor(newState);
    showToast(newState ? `Connected with ${project.authorName}` : `Connection Terminated`);
    addNotification('FOLLOW', newState ? `Identity Link Established: ${project.authorName}` : `Identity Link Servered: ${project.authorName}`, project.authorName);
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
    <div className="group relative bg-zinc-900/10 border border-zinc-800/60 rounded-[2.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-700 flex flex-col h-full hover:shadow-[0_30px_60px_rgba(168,85,247,0.06)]">
      {/* Sandbox Overlay */}
      {demoState !== 'idle' && (
        <div className="absolute inset-0 z-40 bg-black/98 backdrop-blur-2xl flex flex-col p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.6)]"></div>
               <span className="text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] font-mono">Instance_{project.id}</span>
             </div>
             <button onClick={() => setDemoState('idle')} className="group/close p-2 hover:bg-white/10 rounded-full transition-all">
               <svg className="w-5 h-5 text-zinc-500 group-hover/close:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          {demoState === 'loading' ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-8"><div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div><div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div></div>
              <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Runtime...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {project.id === '7' ? (
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                  <div className="bg-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl space-y-4">
                    <button onClick={handleAiResumeOptimize} disabled={isOptimizing} className="bg-purple-500/20 border border-purple-500/40 text-purple-400 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/30 transition-all disabled:opacity-50">
                      {isOptimizing ? 'Synthesizing...' : '⚡ AI Optimize'}
                    </button>
                    <textarea value={resumeData.summary} onChange={e => setResumeData({...resumeData, summary: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-[11px] h-32 resize-none text-zinc-300 font-medium" />
                  </div>
                  <div className="flex-1 bg-white text-zinc-950 p-8 rounded-[2.5rem] shadow-2xl overflow-y-auto">
                    <h4 className="font-black text-3xl tracking-tighter uppercase mb-1">{resumeData.name}</h4>
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest mb-6">Generated Output</p>
                    <p className="text-xs leading-relaxed text-zinc-700 italic font-medium">"{resumeData.summary}"</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <h4 className="text-white font-black text-2xl tracking-tighter mb-4 uppercase">System Standby</h4>
                  <p className="text-zinc-500 text-sm mb-12 max-w-[280px] font-medium italic">"Full architectural logs are reserved for verified collaborators."</p>
                  <Link to={`/project/${project.id}`} className="bg-purple-500 text-black font-black text-[11px] px-12 py-5 rounded-2xl uppercase tracking-[0.3em] shadow-xl">Open Dossier</Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Media Visual */}
      <div className="relative aspect-[16/10] overflow-hidden cursor-pointer" onClick={handleDemoTrigger}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
        <div className="absolute top-6 right-6"><div className="bg-zinc-950/90 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl border border-zinc-800/60 backdrop-blur-md">{formatPrice(project.price)}</div></div>
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center z-10">
          <Link to={`/profile/${project.authorId}`} className="flex items-center gap-4 group/author" onClick={(e) => e.stopPropagation()}>
            <img src={project.authorAvatar} className="w-10 h-10 rounded-full border-2 border-zinc-800/80 p-0.5 bg-black" alt="" />
            <div className="flex flex-col"><span className="text-[11px] font-black text-white uppercase group-hover/author:text-purple-400 transition-colors">{project.authorName}</span><span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Architect</span></div>
          </Link>
          <button onClick={handleFollowAuthorToggle} className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${isFollowingAuthor ? 'bg-purple-500 border-purple-500 text-black shadow-lg shadow-purple-500/20' : 'bg-black/40 border-zinc-700 text-zinc-400 hover:border-purple-500 hover:text-white'}`}>
            {isFollowingAuthor ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>}
          </button>
        </div>
      </div>
      <div className="p-10 flex-1 flex flex-col">
        <h3 className="text-4xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors tracking-tighter uppercase leading-none">{project.title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-medium italic mb-10">"{project.description}"</p>
        <div className="flex flex-wrap gap-2.5 mb-10">
          {project.techStack.slice(0, 3).map(tech => (
            <button key={tech} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFollowTech(tech); }} className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all ${user?.followedTech.includes(tech) ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-zinc-900/50 text-zinc-600 border-zinc-800/40 hover:border-purple-500/40'}`}>
              {tech} {user?.followedTech.includes(tech) ? '✓' : '+'}
            </button>
          ))}
        </div>
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to={`/project/${project.id}`} className="flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-black py-4.5 rounded-2xl transition-all uppercase tracking-[0.3em]">Review Node</Link>
          <button onClick={handleDemoTrigger} className="flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-400 text-black text-[10px] font-black py-4.5 rounded-2xl transition-all uppercase tracking-[0.3em] shadow-lg active:scale-95">Try Instance</button>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const { t } = useLocalization();
  const { user } = useAuth();
  const { showToast } = useToast();
  const filters = ['All', t('forYou'), 'React', 'AI', 'Security', 'Web3', 'System'];

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(p => {
      const searchTerm = search.toLowerCase().trim();
      const matchesSearch = searchTerm === '' || p.title.toLowerCase().includes(searchTerm) || p.techStack.some(t => t.toLowerCase().includes(searchTerm));
      let matchesFilter = activeFilter === 'All' || p.techStack.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
      if (activeFilter === t('forYou')) {
        matchesFilter = (user?.followedProjects.includes(p.id) || p.techStack.some(tech => user?.followedTech.includes(tech))) ?? false;
      }
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter, user, t]);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showToast("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      showToast("Neural voice interface active...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      showToast(`Transcript synced: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      showToast("Voice capture failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="mb-32 text-center py-24">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">Build<span className="text-zinc-800">Space</span></h1>
        <p className="text-zinc-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed italic opacity-80 mb-20">"{t('heroSubtitle')}"</p>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="relative group">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-black border border-zinc-800 rounded-[2.5rem] py-8 px-20 text-white focus:border-purple-500/50 outline-none text-xl font-medium shadow-3xl transition-all" 
            />
            {/* Search Icon */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            {/* Microphone Integration */}
            <button 
              onClick={startVoiceSearch}
              className={`absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full transition-all duration-500 ${isListening ? 'bg-purple-500 text-black animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.6)]' : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
              title="Voice Search"
            >
              {isListening ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              )}
            </button>
            {isListening && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 animate-pulse">Listening for keywords...</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {filters.map(filter => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${activeFilter === filter ? 'bg-purple-500 border-purple-500 text-black scale-105' : 'bg-transparent border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}>{filter}</button>
            ))}
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-48">
        {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  );
};
export default HomePage;
