
import React from 'react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats['confidenceScore'];
}

const ConfidenceScore: React.FC<Props> = ({ stats }) => {
  const metrics = [
    { label: 'Clareza', val: stats.clarity, max: 30, color: 'from-amber-400 to-brand-500' },
    { label: 'Consistência', val: stats.consistency, max: 25, color: 'from-orange-400 to-orange-600' },
    { label: 'Diversificação', val: stats.diversification, max: 20, color: 'from-yellow-400 to-amber-600' },
    { label: 'Progresso', val: stats.progress, max: 15, color: 'from-amber-500 to-brand-700' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-500">
      {/* Subtle Glow Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] -mr-32 -mt-32" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">Índice de Confiança</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stats.total}</span>
              <span className="text-2xl text-slate-300 dark:text-slate-700 font-bold">/100</span>
            </div>
          </div>
          <div className="bg-brand-50 dark:bg-brand-500/10 px-5 py-2.5 rounded-2xl border border-brand-100 dark:border-brand-500/20">
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none mb-1">Status</p>
            <p className="text-xs font-black text-slate-900 dark:text-white">🚀 Em Evolução</p>
          </div>
        </div>

        {/* Primary Master Bar */}
        <div className="h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 via-amber-400 to-orange-400 transition-all duration-1000 ease-out animate-shimmer" 
            style={{ width: `${stats.total}%`, backgroundSize: '200% 100%' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {metrics.map(m => (
            <div key={m.label} className="space-y-3 group">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {m.label}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.val}<span className="text-slate-300 dark:text-slate-700 ml-1">/{m.max}</span></span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${m.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${(m.val / m.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Education Highlight Section */}
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] p-6 flex items-center gap-6 shadow-xl transition-colors">
          <div className="w-14 h-14 bg-white/10 dark:bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
            📚
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Nível Educacional</span>
              <span className="text-sm font-black">{stats.education}/10</span>
            </div>
            <div className="h-1.5 w-48 bg-white/20 dark:bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-400 dark:bg-brand-600 transition-all duration-1000"
                style={{ width: `${(stats.education / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 4s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ConfidenceScore;