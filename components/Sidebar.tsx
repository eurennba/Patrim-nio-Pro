
import React from 'react';
import { LOGO_ICON } from '../constants';
import { UserAccount, Theme, View } from '../types';

interface Props {
  user: UserAccount;
  onLogout: () => void;
  onStartTraining: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<Props> = ({ user, onLogout, onStartTraining, theme, onThemeToggle, currentView, onViewChange }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-black border-r border-slate-100 dark:border-white/10 h-screen sticky top-0 p-8 z-40 transition-colors duration-300">
      {/* Logo Section */}
      <div 
        onClick={() => onViewChange('dashboard')}
        className="flex items-center gap-4 mb-14 group cursor-pointer"
      >
        <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-2xl group-hover:bg-brand-500/5 transition-all duration-500 border border-slate-100 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {LOGO_ICON}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium text-slate-500 dark:text-slate-400 tracking-tight leading-none mb-1">Patrimônio</span>
          <span className="text-2xl font-black italic text-brand-500 tracking-tighter leading-none">PRO</span>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 space-y-3">
        <div className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] mb-6 ml-4">Principais</div>
        
        <button 
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${currentView === 'dashboard' ? 'bg-brand-500 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-brand-500/20 dark:shadow-none scale-[1.02]' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${currentView === 'dashboard' ? 'bg-white/20 dark:bg-slate-900/10' : 'bg-slate-50 dark:bg-white/5 group-hover:scale-110 group-hover:rotate-3'}`}>
            🏠
          </div>
          <span className="font-bold text-sm">Dashboard</span>
        </button>
        
        <button 
          onClick={onStartTraining} 
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 group-hover:-rotate-3 transition-all">
            🏋️
          </div>
          <span className="font-bold text-sm">Treinar</span>
        </button>
        
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${currentView === 'settings' ? 'bg-brand-500 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-brand-500/20 dark:shadow-none scale-[1.02]' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${currentView === 'settings' ? 'bg-white/20 dark:bg-slate-900/10' : 'bg-slate-50 dark:bg-white/5 group-hover:scale-110 group-hover:rotate-3'}`}>
            ⚙️
          </div>
          <span className="font-bold text-sm">Configurações</span>
        </button>
      </nav>

      {/* Theme & User & Footer Section */}
      <div className="pt-8 border-t border-slate-100 dark:border-white/10 space-y-8">
        <div className="flex items-center justify-between px-4">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em]">Tema</span>
          <button 
            onClick={onThemeToggle}
            className={`w-14 h-8 rounded-full relative p-1 transition-all flex items-center ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-100'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-xs transition-all duration-500 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
              {theme === 'light' ? '☀️' : '🌙'}
            </div>
          </button>
        </div>

        <div 
          onClick={() => onViewChange('settings')}
          className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] border border-slate-100 dark:border-white/10 flex items-center gap-4 transition-all cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-95 group"
        >
          <div className="w-12 h-12 rounded-[1.2rem] bg-white dark:bg-black border border-slate-100 dark:border-white/10 overflow-hidden shrink-0 transition-all group-hover:shadow-inner">
            <img src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[9px] text-brand-500 font-black uppercase tracking-widest mt-0.5">Premium</p>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-all grayscale group-hover:grayscale-0">
            🚪
          </div>
          <span className="font-bold text-sm">Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;