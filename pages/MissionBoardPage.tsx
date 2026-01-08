
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PROBLEMS } from '../constants';
import { ProblemStatement } from '../types';
import { useLocalization, useAuth, useToast, useNotifications } from '../App';

const MissionBoardPage: React.FC = () => {
  const { t } = useLocalization();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  
  // Local state for the "Live Feed" demo simulation
  const [missions, setMissions] = useState<ProblemStatement[]>(MOCK_PROBLEMS);
  const [search, setSearch] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form state for publishing new problems
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newSkills, setNewSkills] = useState('');

  // Deep search filtering across all published problem nodes
  const filteredMissions = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return missions;
    return missions.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.requiredSkills.some(s => s.toLowerCase().includes(term)) ||
      p.publicSummary.toLowerCase().includes(term) ||
      p.ownerName.toLowerCase().includes(term)
    );
  }, [search, missions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDetail) return;

    const skillsArray = newSkills.split(',').map(s => s.trim()).filter(s => s !== '');
    
    const newProblem: ProblemStatement = {
      id: `p-${Date.now()}`,
      ownerId: user?.id || 'anon',
      ownerName: user?.name || 'Architect',
      title: newTitle,
      publicSummary: newDetail.substring(0, 100) + (newDetail.length > 100 ? '...' : ''),
      protectedFullText: newDetail,
      requiredSkills: skillsArray.length > 0 ? skillsArray : ['General Engineering'],
      timestamp: new Date().toISOString().split('T')[0],
      status: 'Open',
      viewCount: Math.floor(Math.random() * 5) + 1, // Start with a few initial views
      interestedCount: 0
    };

    setMissions([newProblem, ...missions]);
    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewDetail('');
    setNewSkills('');
    
    showToast("Problem Node Broadcasted to Network");
    addNotification('UPDATE', `Mission published: "${newTitle}"`, newTitle);
  };

  const handleCollabSignal = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, interestedCount: m.interestedCount + 1 };
      }
      return m;
    }));

    showToast("Collaboration Signal Dispatched");
    addNotification('ENGAGEMENT', "Your interest in this mission has been logged.", "Collab");
  };

  const handleQuickPostTrigger = () => {
    setNewTitle(search);
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#a855f7]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">Live Mission Grid v4.0</span>
          </div>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">Mission Board</h1>
          <p className="text-zinc-500 text-lg font-medium italic">"The elite repository for identifying and solving architectural bottlenecks."</p>
        </div>
        <button 
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl hover:shadow-white/10"
        >
          Post Problem Statement
        </button>
      </div>

      {/* Reactive Command Search & Input */}
      <div className="mb-16 relative group">
        <input 
          type="text" 
          placeholder="Enter a problem statement to broadcast, or search existing missions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-900 rounded-[2.5rem] py-8 px-12 text-white outline-none focus:border-purple-500/50 transition-all font-medium text-xl shadow-3xl placeholder:text-zinc-800"
        />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6">
           {search.length > 5 && (
             <button 
               onClick={handleQuickPostTrigger}
               className="bg-purple-500 hover:bg-purple-400 text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg animate-in fade-in zoom-in"
             >
               Broadcast New Mission
             </button>
           )}
           <div className="h-8 w-px bg-zinc-900 mx-2 hidden sm:block"></div>
           <div className="hidden sm:flex flex-col items-end text-zinc-700">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Nodes</span>
             <span className="text-[8px] font-bold uppercase tracking-widest">{filteredMissions.length} Identified</span>
           </div>
        </div>
      </div>

      {/* Published Mission Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[400px]">
        {filteredMissions.length > 0 ? (
          filteredMissions.map(problem => (
            <div key={problem.id} className="group bg-zinc-950 border border-zinc-900 rounded-[3.5rem] p-12 hover:border-purple-500/40 transition-all duration-500 flex flex-col hover:shadow-[0_40px_80px_rgba(168,85,247,0.06)] animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                   <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Active</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                   <span className="text-[9px] font-black uppercase tracking-widest">{problem.timestamp}</span>
                </div>
              </div>
              
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none group-hover:text-purple-400 transition-colors">{problem.title}</h3>
              <p className="text-zinc-500 text-lg italic mb-10 leading-relaxed line-clamp-2">"{problem.publicSummary}"</p>
              
              <div className="flex flex-wrap gap-2.5 mb-12">
                {problem.requiredSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 font-black text-[9px] uppercase tracking-widest rounded-xl">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Engagement Dashboard: Views & Interest */}
              <div className="mt-auto pt-10 border-t border-zinc-900">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-10">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Neural Syncs</span>
                          <div className="flex items-center gap-2">
                             <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                             <span className="text-xl font-black text-zinc-400 tracking-tight">{problem.viewCount}</span>
                          </div>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Collab Signals</span>
                          <div className="flex items-center gap-2">
                             <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
                             <span className="text-xl font-black text-purple-500 tracking-tight">{problem.interestedCount}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] grayscale font-bold">👤</div>
                       <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{problem.ownerName}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={(e) => handleCollabSignal(problem.id, e)}
                      className="group/collab relative bg-zinc-900 hover:bg-purple-500 border border-zinc-800 hover:border-purple-400 py-4.5 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover/collab:text-black transition-colors">
                        Signal Interest
                      </span>
                    </button>
                    <Link 
                      to={`/problem/${problem.id}`} 
                      className="bg-white hover:bg-zinc-200 text-black py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center shadow-lg"
                    >
                      Review Dossier
                    </Link>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center bg-zinc-950 border border-zinc-900 rounded-[4rem]">
             <p className="text-zinc-700 font-black uppercase tracking-[0.4em] mb-8 italic">No architectural challenges matching your search grid.</p>
             <button 
               onClick={handleQuickPostTrigger}
               className="bg-purple-500 hover:bg-purple-400 text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl"
             >
               Broadcast This Problem Instead
             </button>
          </div>
        )}
      </div>

      {/* Structured IP Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsSubmitModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-16 rounded-[4rem] shadow-2xl animate-in zoom-in-95 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-start mb-12">
               <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Broadcast Mission</h2>
               <button onClick={() => setIsSubmitModalOpen(false)} className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Problem Identification</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-sm outline-none focus:border-purple-500 transition-all font-medium text-white" 
                  placeholder="e.g. Distributed Consensus Latency in Layer 2..." 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Required Skill-Matrix (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-sm outline-none focus:border-purple-500 transition-all font-medium text-white" 
                  placeholder="e.g. Rust, WebGL, Low-Level I/O" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Confidential Narrative Architecture</label>
                <textarea 
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-sm h-48 resize-none outline-none focus:border-purple-500 transition-all font-medium text-white placeholder:text-zinc-700" 
                  placeholder="Describe the full architectural challenge in depth. This narrative is only visible to verified collaborators who signal interest."
                ></textarea>
              </div>

              {/* IP Disclaimer */}
              <div className="p-8 bg-purple-500/5 border border-purple-500/20 rounded-[2.5rem] flex items-start gap-6">
                 <div className="text-4xl">🛡️</div>
                 <div>
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">BuildSpace Idea Shield</p>
                    <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">
                      By broadcasting, your narrative is cryptographically time-stamped as yours. 
                      Public visibility is restricted to an AI-generated brief. Only verified architects can request full dossier access.
                    </p>
                 </div>
              </div>

              <button type="submit" className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-7 rounded-[2.5rem] uppercase tracking-[0.4em] shadow-xl shadow-purple-500/10 transition-all active:scale-95">Dispatch to Network</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionBoardPage;
