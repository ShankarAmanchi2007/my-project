
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_DEVELOPERS, MOCK_PROJECTS } from '../constants';
import { useLocalization, useToast, useNotifications } from '../App';

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { t } = useLocalization();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const developer = MOCK_DEVELOPERS.find(d => d.id === id);
  const projects = MOCK_PROJECTS.filter(p => p.authorId === id);

  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedProjectForHire, setSelectedProjectForHire] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!developer) return <div className="text-center py-32 font-black uppercase text-zinc-800">Identity Not Found</div>;

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsHireModalOpen(false);
    showToast("Engagement Protocol Dispatched");
    addNotification('CUSTOMIZATION', `High Priority: New mission request for ${developer.name}.`, developer.name, 'High');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      {isHireModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsHireModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-10">Initialize Mission</h2>
            <form onSubmit={handleHireSubmit} className="space-y-6">
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none">
                <option>Full-Stack Build-Out</option><option>Architecture Review</option><option>SaaS Strategy</option>
              </select>
              <textarea required className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm h-32 outline-none text-white" placeholder="Describe the customization requirements..."></textarea>
              <button type="submit" className="w-full bg-purple-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.3em] shadow-xl">Dispatch Request</button>
            </form>
          </div>
        </div>
      )}

      <div className="relative mb-32 bg-zinc-950 border border-zinc-900 p-12 lg:p-16 rounded-[4rem]">
        <div className="flex flex-col lg:flex-row gap-16">
          <img src={developer.avatar} alt={developer.name} className="w-64 h-64 rounded-full border-[12px] border-black object-cover shadow-2xl" />
          <div className="flex-1 space-y-10">
            <div>
              <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-none mb-6">{developer.name}</h1>
              <p className="text-zinc-500 text-xl font-medium italic">"{developer.bio}"</p>
              
              {/* GitHub Username Profile Option */}
              {developer.githubUsername && (
                <div className="mt-6 flex items-center">
                  <a 
                    href={`https://github.com/${developer.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-5 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-purple-500/50 transition-all"
                  >
                    <svg className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-zinc-500 group-hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                      @{developer.githubUsername}
                    </span>
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6">
              <button onClick={() => setIsHireModalOpen(true)} className="bg-white text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">Hire for Project</button>
              <button onClick={() => { setIsFollowing(!isFollowing); addNotification('FOLLOW', !isFollowing ? `Subscribed to ${developer.name}` : `Unsubscribed from ${developer.name}`, developer.name); }} className={`px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${isFollowing ? 'bg-purple-500 text-black border-purple-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}>{isFollowing ? 'Following' : 'Follow Architect'}</button>
              
              {/* Existing full GitHub link kept as per requirements */}
              <a 
                href={developer.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4"
              >
                View GitHub
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-12 lg:border-l lg:border-zinc-900 lg:pl-16">
            <div className="text-center lg:text-left"><p className="text-6xl font-black text-white">{projects.length}</p><p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Builds</p></div>
            <div className="text-center lg:text-left"><p className="text-6xl font-black text-white">{developer.followersCount}</p><p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">Followers</p></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-4 space-y-24">
          <section><h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-12">Skill Matrix</h3><div className="flex flex-wrap gap-3">{developer.skills.map(skill => <span key={skill} className="px-6 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black text-[10px] uppercase tracking-widest rounded-2xl">{skill}</span>)}</div></section>
        </div>
        <div className="lg:col-span-8 space-y-32">
          <section><h4 className="text-5xl font-black uppercase tracking-tighter mb-16">Deployed Architectures</h4><div className="space-y-20">{projects.map(project => <div key={project.id} className="bg-zinc-950 border border-zinc-900 rounded-[4.5rem] overflow-hidden flex flex-col xl:flex-row"><img src={project.image} alt="" className="xl:w-1/2 object-cover" /><div className="xl:w-1/2 p-12 xl:p-20"><h4 className="text-5xl font-black uppercase text-white mb-4 leading-none">{project.title}</h4><p className="text-zinc-500 text-lg italic mb-12">"{project.description}"</p><div className="grid grid-cols-2 gap-6"><Link to={`/project/${project.id}`} className="py-6 text-center bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl">Review Node</Link><button onClick={() => { setIsHireModalOpen(true); setSelectedProjectForHire(project.id); }} className="py-6 text-center bg-purple-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg">Hire</button></div></div></div>)}</div></section>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
