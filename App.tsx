
import React, { useState, useEffect } from 'react';
import { UserStats, UserAccount, Theme, View } from './types';
import Dashboard from './components/Dashboard';
import TrainingSession from './components/TrainingSession';
import InvestmentChallenge from './components/InvestmentChallenge';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('patrimonio_pro_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('patrimonio_pro_theme');
    return (saved as Theme) || 'dark'; 
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('patrimonio_pro_session', JSON.stringify(currentUser));
      if (currentUser.email !== 'guest@patrimoniopro.com') {
        localStorage.setItem(`user_${currentUser.email}`, JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem('patrimonio_pro_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('patrimonio_pro_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.className = 'bg-black text-white transition-colors duration-300';
    } else {
      root.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-900 transition-colors duration-300';
    }
  }, [theme]);

  const updateStats = (updates: Partial<UserStats> | ((prev: UserStats) => UserStats)) => {
    if (!currentUser) return;

    setCurrentUser(prev => {
      if (!prev) return null;
      const nextStats = typeof updates === 'function' ? updates(prev.stats) : { ...prev.stats, ...updates };
      
      const { clarity, consistency, diversification, progress, education } = nextStats.confidenceScore;
      nextStats.confidenceScore.total = Math.min(100, 
        Math.min(30, clarity) + 
        Math.min(25, consistency) + 
        Math.min(20, diversification) + 
        Math.min(15, progress) + 
        Math.min(10, education)
      );
      
      return { ...prev, stats: nextStats };
    });
  };

  const handleUpdateProfile = (name: string, profileImage: string) => {
    setCurrentUser(prev => prev ? { ...prev, name, profileImage } : null);
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
      if (currentUser.email !== 'guest@patrimoniopro.com') {
        localStorage.removeItem(`user_${currentUser.email}`);
      }
      localStorage.removeItem('patrimonio_pro_session');
      setCurrentUser(null);
      setCurrentView('dashboard');
    }
  };

  const handleTrainingComplete = (newFormData: Partial<UserStats>) => {
    updateStats(prevStats => {
      const newClarity = Math.min(30, prevStats.confidenceScore.clarity + 8);
      const newConsistency = Math.min(25, prevStats.confidenceScore.consistency + 3);
      const newEducation = Math.min(10, prevStats.confidenceScore.education + 2); 
      
      const hasStocks = (newFormData.investments?.stocks ?? prevStats.investments.stocks) > 0;
      const hasTesouro = (newFormData.investments?.tesouro ?? prevStats.investments.tesouro) > 0;
      const newDiversification = Math.min(20, (hasStocks ? 10 : 0) + (hasTesouro ? 10 : 0));
      
      const newProgress = Math.min(15, prevStats.confidenceScore.progress + 2);

      return {
        ...prevStats,
        accessibleMoney: {
          ...prevStats.accessibleMoney,
          ...(newFormData.accessibleMoney || {})
        },
        investments: {
          ...prevStats.investments,
          ...(newFormData.investments || {})
        },
        streak: prevStats.streak + 1,
        confidenceScore: {
          ...prevStats.confidenceScore,
          clarity: newClarity,
          consistency: newConsistency,
          diversification: newDiversification,
          progress: newProgress,
          education: newEducation
        }
      };
    });
    
    setIsTrainingOpen(false);
  };

  const handleChallengeComplete = () => {
    updateStats(prev => ({
      ...prev,
      confidenceScore: {
        ...prev.confidenceScore,
        education: Math.min(10, prev.confidenceScore.education + 5),
        progress: Math.min(15, prev.confidenceScore.progress + 3)
      }
    }));
    setIsChallengeOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!currentUser) {
    return <AuthScreen onAuthComplete={setCurrentUser} theme={theme} />;
  }

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} selection:bg-amber-100 dark:selection:bg-amber-900/40 selection:text-amber-900 dark:selection:text-amber-100`}>
      <Sidebar 
        user={currentUser} 
        onLogout={handleLogout} 
        onStartTraining={() => setIsTrainingOpen(true)} 
        theme={theme}
        onThemeToggle={toggleTheme}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto transition-colors duration-300 bg-slate-50 dark:bg-black">
        <header className="md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-white/10 h-20 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
           <div className="flex items-baseline gap-2" onClick={() => setCurrentView('dashboard')}>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-tight">Patrimônio</span>
            <span className="text-xl font-black italic text-brand-500 tracking-tighter">PRO</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl transition-all active:scale-95"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center transition-all active:scale-95"
            >
              🚪
            </button>
          </div>
        </header>

        <main className="flex-1 pb-32 md:pb-12">
          {currentView === 'dashboard' ? (
            <Dashboard 
              stats={currentUser.stats} 
              onStartTraining={() => setIsTrainingOpen(true)} 
              onStartChallenge={() => setIsChallengeOpen(true)}
              onUpdateStats={updateStats}
              theme={theme}
            />
          ) : (
            <Settings 
              user={currentUser} 
              onUpdateProfile={handleUpdateProfile} 
              onDeleteAccount={handleDeleteAccount}
              onClose={() => setCurrentView('dashboard')}
              theme={theme}
            />
          )}
        </main>
      </div>

      {isTrainingOpen && (
        <TrainingSession 
          onComplete={handleTrainingComplete} 
          onCancel={() => setIsTrainingOpen(false)} 
          theme={theme}
        />
      )}

      {isChallengeOpen && (
        <InvestmentChallenge 
          onComplete={handleChallengeComplete}
          onCancel={() => setIsChallengeOpen(false)}
          theme={theme}
        />
      )}

      <nav className="fixed bottom-6 left-6 right-6 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/10 md:hidden flex justify-around items-center h-20 px-4 z-40 rounded-[2.5rem] shadow-2xl transition-all duration-300">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'dashboard' ? 'text-amber-400' : 'text-slate-400 dark:text-white/40'}`}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Início</span>
        </button>
        <button onClick={() => setIsTrainingOpen(true)} className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-white/40 hover:text-white transition-colors">
          <span className="text-2xl transition-transform active:scale-125">🏋️</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Treinar</span>
        </button>
        <button 
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${currentView === 'settings' ? 'text-amber-400' : 'text-slate-400 dark:text-white/40'}`}
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-[9px] font-black uppercase tracking-widest">Config</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
