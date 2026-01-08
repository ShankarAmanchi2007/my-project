
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Notification, NotificationType, Project } from './types';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import MissionBoardPage from './pages/MissionBoardPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import { ChatBox } from './components/ChatBox';

// --- Localization ---
export type CountryCode = 'US' | 'IN' | 'FR' | 'JP';
export interface LocaleData {
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number;
  translations: Record<string, string>;
}

export const LOCALES: Record<CountryCode, LocaleData> = {
  US: {
    name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', rate: 1,
    translations: {
      explore: 'Explore', dashboard: 'Dashboard', missionBoard: 'Mission Board', tryDemo: 'Try Demo', viewDetails: 'View Details',
      buyNow: 'Buy Now', publishedUnits: 'Published Units', revenue: 'Net Revenue', login: 'Login', logout: 'Logout',
      heroTitle: 'BUILD FEED', heroSubtitle: 'The interactive gallery where high-impact engineers showcase architectures and secure licensing.',
      searchPlaceholder: 'Search builds, repos, and engineers...', noResults: 'No Results Identified',
      resetFilters: 'Reset Search Filters', engagementType: 'Engagement Type', budgetBracket: 'Budget Bracket',
      missionStatement: 'The Mission Statement', requestCollab: 'Request Collaboration', talentAcquisition: 'Talent Acquisition',
      instanceLicense: 'Instance License', executiveSummary: 'Executive Summary', stackInfra: 'Stack Infrastructure',
      applauses: 'Applauses', financialLedger: 'Financial Ledger', activeRepos: 'Active Repositories',
      trendingNow: 'Trending Now', regenerate: 'Regenerate', paymentMethod: 'Payment Method',
      cardNumber: 'Card Number', expiryDate: 'Expiry Date', upiId: 'UPI ID', payNow: 'Pay Now',
      secureCheckout: 'Secure Checkout', forYou: 'For You', notifications: 'System Log'
    }
  },
  IN: {
    name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹', rate: 83.5,
    translations: {
      explore: 'खोजें', dashboard: 'डैशबोर्ड', missionBoard: 'मिशन बोर्ड', tryDemo: 'डेमो देखें', viewDetails: 'विवरण', buyNow: 'अभी खरीदें',
      publishedUnits: 'प्रकाशित इकाइयाँ', revenue: 'कुल आय', login: 'लॉगिन', logout: 'लॉगआउट', heroTitle: 'बिल्ड फीड',
      heroSubtitle: 'एक संवादात्मक गैलरी जहाँ इंजीनियर अपनी वास्तुकला प्रदर्शित करते हैं और लाइसेंस प्राप्त करते हैं।',
      searchPlaceholder: 'बिल्ड, रेपो और इंजीनियर खोजें...', noResults: 'कोई परिणाम नहीं मिला',
      resetFilters: 'फ़िल्टर रीसेट करें', engagementType: 'सगाई का प्रकार', budgetBracket: 'बजेट ब्रैकेट',
      missionStatement: 'मिशन वक्तव्य', requestCollab: 'सहयोग का अनुरोध करें', talentAcquisition: 'प्रतिभा अधिग्रहण',
      instanceLicense: 'लाइसेंस', executiveSummary: 'कार्यकारी सारांश', stackInfra: 'तकनीकी बुनियादी ढांचा',
      applauses: 'तालियां', financialLedger: 'वित्तीय बहीखाता', activeRepos: 'सक्रिय रिपॉजिटरी',
      trendingNow: 'ट्रेंडिंग', regenerate: 'फिर से बनाएं', paymentMethod: 'भुगतान विधि',
      cardNumber: 'कार्ड नंबर', expiryDate: 'समाप्ति तिथि', upiId: 'यूपीआई आईडी', payNow: 'अभी भुगतान करें',
      secureCheckout: 'सुरक्षित चेकआउट', forYou: 'आपके लिए', notifications: 'सिस्टम लॉग'
    }
  },
  FR: {
    name: 'France', flag: '🇫🇷', currency: 'EUR', symbol: '€', rate: 0.92,
    translations: {
      explore: 'Explorer', dashboard: 'Tableau', missionBoard: 'Missions', tryDemo: 'Essayer Démo', viewDetails: 'Détails', buyNow: 'Acheter',
      publishedUnits: 'Unités Publiées', revenue: 'Revenu Net', login: 'Connexion', logout: 'Déconnexion',
      heroTitle: 'FLUX DE CONSTRUCTION', heroSubtitle: 'La galerie interactive où les ingénieurs présentent leurs architectures et sécurisent les licences.',
      searchPlaceholder: 'Rechercher des builds, des repos...', noResults: 'Aucun résultat identifié',
      resetFilters: 'Réinitialiser les filtres', engagementType: "Type d'engagement", budgetBracket: 'Tranche de budget',
      missionStatement: 'Déclaration de mission', requestCollab: 'Demander collaboration', talentAcquisition: 'Acquisition de talents',
      instanceLicense: 'Licence d\'instance', executiveSummary: 'Résumé exécutif', stackInfra: 'Infrastructure technologique',
      applauses: 'Applaudissements', financialLedger: 'Grand livre financier', activeRepos: 'Répertoires actifs',
      trendingNow: 'Tendance actuelle', regenerate: 'Régénérer', paymentMethod: 'Méथोड de paiement',
      cardNumber: 'Numéro de carte', expiryDate: 'Date d\'expiration', upiId: 'Identifiant UPI',
      payNow: 'Payer maintenant', secureCheckout: 'Paiement sécurisé', forYou: 'Pour vous', notifications: 'Journal'
    }
  },
  JP: {
    name: 'Japan', flag: '🇯🇵', currency: 'JPY', symbol: '¥', rate: 151.2,
    translations: {
      explore: '探索する', dashboard: 'ダッシュボード', missionBoard: 'ミッションボード', tryDemo: 'デモを試す', viewDetails: '詳細を見る', buyNow: '今すぐ購入',
      publishedUnits: '公開ユニット', revenue: '純収益', login: 'ログイン', logout: 'ログアウト', heroTitle: 'ビルドフィード',
      heroSubtitle: 'エンジニアがアーキテクチャを展示し、ライセンスを確保するインタラクティブなギャラリー。',
      searchPlaceholder: 'ビルド、レポジトリ、エンジニアを検索...', noResults: '結果が見つかりません',
      resetFilters: 'フィルターをリセット', engagementType: 'エンゲージメントタイプ', budgetBracket: '予算範囲',
      missionStatement: 'ミッションステートメント', requestCollab: 'コラボレーションを依頼', talentAcquisition: '人材採用',
      instanceLicense: 'インスタンスライセンス', executiveSummary: 'エグゼクティブサマリー', stackInfra: 'スタックインフラ',
      applauses: '拍手', financialLedger: '財務元帳', activeRepos: 'アクティブなリポジトリ',
      trendingNow: '今のトレンド', regenerate: '再生成', paymentMethod: '支払い方法',
      cardNumber: 'カード番号', expiryDate: '有効期限', upiId: 'UPI ID', payNow: '今すぐ支払う',
      secureCheckout: '安全なチェックアウト', forYou: 'あなたへ', notifications: 'システムログ'
    }
  }
};

interface LocalizationContextType {
  country: CountryCode;
  setCountry: (code: CountryCode) => void;
  t: (key: string) => string;
  formatPrice: (usdAmount?: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within LocalizationProvider');
  return context;
};

// --- Toast ---
interface Toast { id: string; message: string; }
interface ToastContextType { showToast: (message: string) => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

// --- Notifications ---
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, message: string, targetName?: string, priority?: 'High' | 'Normal', progress?: number) => string;
  updateNotificationProgress: (id: string, progress: number, newMessage?: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

// --- Auth ---
interface AuthContextType {
  user: User | null;
  login: (email: string, provider?: 'github' | 'google' | 'email') => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  toggleFollowProject: (projectId: string) => void;
  toggleFollowTech: (techName: string) => void;
  purchaseProject: (project: Project) => void;
  triggerZipDownload: (projectName: string) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { country, setCountry, t } = useLocalization();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [showSelector, setShowSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-purple-900/20 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="text-2xl font-black text-purple-500 tracking-tighter hover:text-purple-400 transition-colors group">
        BUILD<span className="text-white group-hover:ml-1 transition-all">SPACE</span>
      </Link>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="hidden md:block text-gray-400 hover:text-purple-400 transition-colors text-sm font-black uppercase tracking-widest">{t('explore')}</Link>
          <Link to="/missions" className="hidden md:block text-gray-400 hover:text-purple-400 transition-colors text-sm font-black uppercase tracking-widest">{t('missionBoard')}</Link>
          
          <div className="relative">
            <button 
              onClick={() => setShowSelector(!showSelector)}
              className="flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest transition-all group"
            >
              <span className="text-base leading-none">{LOCALES[country].flag}</span>
              <span className="text-zinc-400 group-hover:text-white transition-colors">{LOCALES[country].currency}</span>
              <svg className={`w-3 h-3 text-zinc-600 transition-transform ${showSelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {showSelector && (
              <div className="absolute top-full mt-3 right-0 w-56 bg-zinc-950 border border-zinc-800 rounded-[2rem] p-3 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                {(Object.keys(LOCALES) as CountryCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => { setCountry(code); setShowSelector(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mb-1 last:mb-0 ${country === code ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/10' : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg">{LOCALES[code].flag}</span>
                      <span>{LOCALES[code].name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-purple-500 text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-[8px] font-black text-black rounded-full flex items-center justify-center animate-pulse border-2 border-black">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full mt-4 right-0 w-80 sm:w-96 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[200]">
              <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">{t('notifications')}</h4>
                <button onClick={clearAll} className="text-[9px] font-black text-zinc-700 hover:text-white uppercase tracking-widest transition-all">Clear All</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-800 italic">No Active Protocols</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-6 border-b border-zinc-900/50 hover:bg-zinc-900/40 transition-all cursor-pointer group relative ${!n.isRead ? 'bg-purple-500/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                          n.type === 'CUSTOMIZATION' ? 'bg-emerald-500 text-black' :
                          n.type === 'AI_INSIGHT' ? 'bg-cyan-500 text-black' :
                          n.type === 'DOWNLOAD' ? 'bg-purple-500 text-black' :
                          n.type === 'PROBLEM_MATCH' ? 'bg-amber-500 text-black' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {n.type}
                        </span>
                        <span className="text-[8px] font-black text-zinc-800 uppercase group-hover:text-zinc-600">{n.timestamp}</span>
                      </div>
                      <p className={`text-xs leading-relaxed transition-colors ${!n.isRead ? 'text-white font-bold' : 'text-zinc-500'}`}>{n.message}</p>
                      
                      {n.progress !== undefined && n.progress < 100 && (
                        <div className="mt-3 w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 transition-all duration-300" 
                            style={{ width: `${n.progress}%` }}
                          ></div>
                        </div>
                      )}

                      {!n.isRead && <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>}
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-zinc-900/20 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800">Neural Log System v4.1</p>
              </div>
            </div>
          )}
        </div>

        <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors text-sm font-black uppercase tracking-widest">{t('dashboard')}</Link>
        <div className="h-4 w-px bg-zinc-800"></div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-purple-500/50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="hidden sm:block text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">{t('logout')}</button>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [country, setCountry] = useState<CountryCode>('US');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const addNotification = (type: NotificationType, message: string, targetName?: string, priority: 'High' | 'Normal' = 'Normal', progress?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNote: Notification = {
      id,
      type,
      message,
      targetName,
      timestamp: 'JUST NOW',
      isRead: false,
      priority,
      progress
    };
    setNotifications(prev => [newNote, ...prev]);
    return id;
  };

  const updateNotificationProgress = (id: string, progress: number, newMessage?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, progress, message: newMessage || n.message } : n));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => setNotifications([]);

  const triggerZipDownload = (projectName: string) => {
    const dummyContent = "BuildSpace Project Source Code Artifacts\n\nThis is a simulated project ZIP archive.\nIn a production environment, this would contain the actual source code, documentation, and licensing keys.\n\nProject: " + projectName + "\nLicense: COMMERCIAL-V1-" + Math.random().toString(36).toUpperCase().substring(2, 10);
    const blob = new Blob([dummyContent], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = projectName.replace(/\s+/g, '-').toLowerCase() + '-source.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const login = (email: string, provider: 'github' | 'google' | 'email' = 'email') => {
    let name = email.split('@')[0] || 'Architect';
    let avatar = 'https://ui-avatars.com/api/?name=' + name + '&background=a855f7&color=000';
    setUser({
      id: 'me', name, email: email || `${name}@${provider}.com`, avatar, 
      github: provider === 'github' ? 'https://github.com/alexrivera' : '',
      followedProjects: [], followedTech: [], purchasedProjectIds: []
    });
    addNotification('UPDATE', 'Welcome back, Architect. System protocols engaged.', name);
  };

  const logout = () => { setUser(null); setNotifications([]); };

  const purchaseProject = (project: Project) => {
    if (!user) return;
    if (user.purchasedProjectIds.includes(project.id)) {
      showToast("Instance already acquired.");
      return;
    }

    // Process Purchase
    const noteId = addNotification('DOWNLOAD', `Initializing secure artifact retrieval for ${project.title}...`, project.title, 'High', 0);
    
    // Simulate Progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updateNotificationProgress(noteId, 100, `Artifact retrieval complete. ${project.title} files stored.`);
        showToast(`Asset Acquired: ${project.title}`);
        
        // Add to user purchased list
        setUser(prev => prev ? { ...prev, purchasedProjectIds: [...prev.purchasedProjectIds, project.id] } : null);
        
        // Trigger actual download
        triggerZipDownload(project.title);
      } else {
        updateNotificationProgress(noteId, progress, `Retrieving ${project.title} artifacts: ${progress}%`);
      }
    }, 400);
  };

  const localizationValue: LocalizationContextType = {
    country, setCountry, t: (key: string) => LOCALES[country].translations[key] || key,
    formatPrice: (usdAmount?: number) => {
      if (usdAmount === 0) return 'FREE';
      if (!usdAmount) return '$0';
      const locale = LOCALES[country];
      const converted = usdAmount * locale.rate;
      return `${locale.symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <LocalizationContext.Provider value={localizationValue}>
      <ToastContext.Provider value={{ showToast }}>
        <NotificationContext.Provider value={{ notifications, unreadCount: notifications.filter(n => !n.isRead).length, addNotification, updateNotificationProgress, markAsRead, clearAll }}>
          <AuthContext.Provider value={{ user, login, logout, purchaseProject, triggerZipDownload, updateUser: (d) => user && setUser({...user, ...d}), toggleFollowProject: (pid) => {
            if (!user) return;
            const following = user.followedProjects.includes(pid);
            setUser({...user, followedProjects: following ? user.followedProjects.filter(id => id !== pid) : [...user.followedProjects, pid]});
            addNotification('FOLLOW', following ? `Unsubscribed from Project Node_${pid}` : `Subscribed to Project Node_${pid}`, pid);
          }, toggleFollowTech: (tname) => {
            if (!user) return;
            const following = user.followedTech.includes(tname);
            setUser({...user, followedTech: following ? user.followedTech.filter(t => t !== tname) : [...user.followedTech, tname]});
            addNotification('FOLLOW', following ? `Protocol terminated for ${tname}` : `Following technical stack: ${tname}`, tname);
          }}}>
            <HashRouter>
              <Navbar />
              <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-black">
                <main className={user ? "pt-24 pb-12" : ""}>
                  <Routes>
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/missions" element={user ? <MissionBoardPage /> : <Navigate to="/login" />} />
                    <Route path="/problem/:id" element={user ? <ProblemDetailPage /> : <Navigate to="/login" />} />
                    <Route path="/project/:id" element={user ? <ProjectDetailPage /> : <Navigate to="/login" />} />
                    <Route path="/profile/:id" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
                  </Routes>
                </main>
                {user && <ChatBox />}
                <div className="fixed bottom-10 right-10 z-[200] space-y-4 pointer-events-none">
                  {toasts.map((toast) => (
                    <div key={toast.id} className="bg-zinc-900 border border-purple-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8 duration-500 backdrop-blur-xl pointer-events-auto">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </HashRouter>
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </ToastContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default App;
