
import React, { useState, useRef } from 'react';
import { useAuth, useLocalization } from '../App';
import { MOCK_PROJECTS } from '../constants';

const DashboardPage: React.FC = () => {
  const { user, updateUser, triggerZipDownload } = useAuth();
  const { t, formatPrice } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'managed' | 'obtained'>('managed');

  // Profile Update State
  const [githubUrl, setGithubUrl] = useState(user?.github || '');
  const [githubHandle, setGithubHandle] = useState(user?.githubUsername || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [githubError, setGithubError] = useState('');
  const [handleError, setHandleError] = useState('');

  // Project Deployment State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    price: '0',
    isPaid: false
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const publishedUnitsCount = 32; 
  const myManagedProjects = MOCK_PROJECTS.slice(0, 2);
  const myObtainedProjects = MOCK_PROJECTS.filter(p => user?.purchasedProjectIds.includes(p.id));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProjectImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateGithub = (url: string) => {
    if (!url) return true; 
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/;
    if (!githubRegex.test(url) && !url.startsWith('github.com/')) {
      setGithubError('Invalid GitHub profile pattern');
      return false;
    }
    setGithubError('');
    return true;
  };

  const validateHandle = (handle: string) => {
    if (handle.includes(' ')) {
      setHandleError('No spaces allowed in handle');
      return false;
    }
    setHandleError('');
    return true;
  };

  const handleUpdateGithub = () => {
    const isUrlValid = validateGithub(githubUrl);
    const isHandleValid = validateHandle(githubHandle);
    
    if (!isUrlValid || !isHandleValid) return;

    setSaveStatus('saving');
    setTimeout(() => {
      updateUser({ 
        github: githubUrl,
        githubUsername: githubHandle
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsModalOpen(false);
      setProjectImage(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Deploy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 p-12 rounded-[4rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">Deploy New Node</h2>
            <form onSubmit={handleDeploy} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Project Visual</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden"
                >
                  {projectImage ? (
                    <img src={projectImage} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <span className="text-zinc-600 font-bold uppercase text-[10px]">Upload Frame</span>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Build Title"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Tech Stack (Comma Separated)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none"
                  value={newProject.techStack}
                  onChange={e => setNewProject({...newProject, techStack: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="Mission Narrative"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 outline-none h-32 resize-none"
                value={newProject.description}
                onChange={e => setNewProject({...newProject, description: e.target.value})}
              ></textarea>
              <button 
                type="submit"
                disabled={isDeploying}
                className="w-full bg-purple-500 hover:bg-purple-400 text-black font-black py-6 rounded-[2rem] text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-purple-500/20"
              >
                {isDeploying ? 'Syncing...' : 'Initialize Deployment'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_#a855f7]"></div>
            <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em]">Architect Terminal</p>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 hover:bg-purple-400 text-black font-black px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-purple-500/20 uppercase tracking-[0.2em] text-[10px]"
          >
            Deploy Unit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-zinc-950 border border-zinc-800 p-10 rounded-[2.5rem]">
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Published Builds</p>
           <p className="text-5xl font-black text-white tracking-tighter">{publishedUnitsCount}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-10 rounded-[2.5rem]">
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Acquired Nodes</p>
           <p className="text-5xl font-black text-white tracking-tighter">{user?.purchasedProjectIds.length || 0}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-10 rounded-[2.5rem]">
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Net Applauses</p>
           <p className="text-5xl font-black text-white tracking-tighter">842</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div>
            <div className="flex items-center gap-8 mb-10">
              <button 
                onClick={() => setActiveTab('managed')}
                className={`text-xl font-black uppercase tracking-tighter transition-all ${activeTab === 'managed' ? 'text-white' : 'text-zinc-800 hover:text-zinc-500'}`}
              >
                Managed Instances
              </button>
              <button 
                onClick={() => setActiveTab('obtained')}
                className={`text-xl font-black uppercase tracking-tighter transition-all ${activeTab === 'obtained' ? 'text-white' : 'text-zinc-800 hover:text-zinc-500'}`}
              >
                Obtained Instances
              </button>
              <div className="h-px bg-zinc-900 flex-1"></div>
            </div>

            <div className="space-y-4">
              {activeTab === 'managed' ? (
                myManagedProjects.map(project => (
                  <div key={project.id} className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-6">
                      <img src={project.image} className="w-20 h-12 object-cover rounded-xl grayscale" alt="" />
                      <div>
                        <p className="text-sm font-black uppercase text-white">{project.title}</p>
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{project.views} Global Syncs</p>
                      </div>
                    </div>
                    <button className="p-3 hover:bg-zinc-900 rounded-xl transition-all text-zinc-600 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                    </button>
                  </div>
                ))
              ) : (
                myObtainedProjects.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No Acquired Nodes Found</p>
                  </div>
                ) : (
                  myObtainedProjects.map(project => (
                    <div key={project.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-purple-500/30 transition-all animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-8">
                        <img src={project.image} className="w-24 h-16 object-cover rounded-2xl" alt="" />
                        <div>
                          <p className="text-lg font-black uppercase text-white mb-1">{project.title}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-black rounded border border-emerald-500/20 uppercase tracking-widest">Licensed Artifact</span>
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Archived: 09/2025</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => triggerZipDownload(project.title)}
                          className="flex items-center gap-3 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest group"
                        >
                          <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download ZIP
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-12">
           <section className="bg-zinc-950 border border-zinc-800 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-10">Interface Settings</h3>
              <div className="space-y-8">
                 <div>
                    <label className="block text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">GitHub Identity URL</label>
                    <input 
                      type="text" 
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`w-full bg-black border ${githubError ? 'border-red-500/50' : 'border-zinc-900'} rounded-xl px-4 py-3 text-xs focus:border-purple-500 outline-none transition-all placeholder:text-zinc-800 font-medium`} 
                      placeholder="github.com/handle"
                    />
                    {githubError && <p className="text-[9px] text-red-500 mt-2 uppercase font-black tracking-widest">{githubError}</p>}
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-3">GitHub Username Handle</label>
                    <input 
                      type="text" 
                      value={githubHandle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGithubHandle(val);
                        validateHandle(val);
                      }}
                      className={`w-full bg-black border ${handleError ? 'border-red-500/50' : 'border-zinc-900'} rounded-xl px-4 py-3 text-xs focus:border-purple-500 outline-none transition-all placeholder:text-zinc-800 font-medium`} 
                      placeholder="e.g. janesmith"
                    />
                    {handleError && <p className="text-[9px] text-red-500 mt-2 uppercase font-black tracking-widest">{handleError}</p>}
                 </div>

                 <button 
                  onClick={handleUpdateGithub}
                  disabled={saveStatus === 'saving'}
                  className={`w-full py-4 ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-white'} text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50`}
                 >
                   {saveStatus === 'idle' ? 'Save Protocol' : saveStatus === 'saving' ? 'Processing...' : 'Protocol Updated ✓'}
                 </button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
