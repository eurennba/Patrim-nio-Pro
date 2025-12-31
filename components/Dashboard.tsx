
import React, { useState, useEffect } from 'react';
import { UserStats, FinancialAlert, AlertCategory, Theme } from '../types';
import ConfidenceScore from './ConfidenceScore';
import AlertCard from './AlertCard';
import { getInvestmentOpportunityAdvice } from '../services/geminiService';

interface Props {
  stats: UserStats;
  onStartTraining: () => void;
  onStartChallenge: () => void;
  onUpdateStats: (updates: Partial<UserStats> | ((prev: UserStats) => UserStats)) => void;
  theme: Theme;
}

const StreakIcon = ({ streak }: { streak: number }) => {
  let boltColor = "text-brand-500";
  let glowColor = "bg-amber-400";
  
  if (streak >= 30) {
    boltColor = "text-orange-600";
    glowColor = "bg-orange-500";
  } else if (streak >= 7) {
    boltColor = "text-brand-500";
    glowColor = "bg-brand-400";
  }

  return (
    <div className="relative flex items-center justify-center w-20 h-20 group/streak">
      {/* Energy Ring */}
      <div className={`absolute inset-0 rounded-full border-2 border-dashed border-brand-500/30 animate-[spin_10s_linear_infinite] group-hover/streak:border-brand-500/60 transition-colors`} />
      
      {/* Pulse Glow */}
      <div className={`absolute inset-0 ${glowColor} blur-2xl opacity-20 animate-pulse rounded-full`} />
      
      {/* Kinetic Bolt */}
      <svg viewBox="0 0 24 24" className={`w-12 h-12 ${boltColor} drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-500 animate-float`} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        {/* Inner detail */}
        <path d="M11.5 7L8 13H12L11 18L16 11H11.5L11.5 7Z" fill="white" fillOpacity="0.8" />
      </svg>

      {streak > 0 && (
        <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-900 w-7 h-7 rounded-full flex items-center justify-center border-2 border-brand-500 shadow-lg animate-in zoom-in duration-500">
           <span className="text-[12px] font-black text-brand-600">⚡</span>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ stats, onStartTraining, onStartChallenge, onUpdateStats, theme }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [appliedActions, setAppliedActions] = useState<Record<string, string>>({});
  const [aiAdvice, setAiAdvice] = useState<string>('Analisando oportunidades...');
  const [isLoadingAi, setIsLoadingAi] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Bom dia', icon: '☀️' };
    if (hour >= 12 && hour < 18) return { text: 'Boa tarde', icon: '🌤️' };
    return { text: 'Boa noite', icon: '🌙' };
  };

  const greeting = getGreeting();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAi(true);
      const advice = await getInvestmentOpportunityAdvice(stats);
      setAiAdvice(advice);
      setIsLoadingAi(false);
    };
    fetchAdvice();
  }, [stats]);

  const handleAlertAction = (alertId: string, value: string) => {
    switch (value) {
      case 'add':
        onUpdateStats(prev => ({
          ...prev,
          investments: { ...prev.investments, tesouro: (prev.investments.tesouro || 0) + 500 },
          confidenceScore: {
            ...prev.confidenceScore,
            progress: Math.min(15, prev.confidenceScore.progress + 2),
            clarity: Math.min(30, prev.confidenceScore.clarity + 1)
          }
        }));
        setAppliedActions(prev => ({ ...prev, [alertId]: value }));
        setToast({ message: 'R$ 500,00 alocados com sucesso!', type: 'success' });
        break;
      case 'ignore':
      case 'skip': setAppliedActions(prev => ({ ...prev, [alertId]: value })); break;
      default: console.log('Action:', value);
    }
  };

  const alerts: FinancialAlert[] = [
    {
      id: 'security-1',
      category: AlertCategory.SECURITY,
      title: 'Reserva em Alerta',
      description: 'Você tem apenas 2 meses de reserva. IA sugere: Aloque R$ 500 este mês.',
      actions: [
        { label: 'Adicionar Agora', value: 'add' },
        { label: 'Ignorar', value: 'ignore' }
      ]
    },
    {
      id: 'opportunity-1',
      category: AlertCategory.OPPORTUNITY,
      title: 'Oportunidade IA',
      description: isLoadingAi ? 'Calculando...' : `IA sugere: ${aiAdvice}`,
      actions: [
        { label: 'Simular', value: 'simulate' },
        { label: 'Ver Opções', value: 'options' }
      ]
    }
  ];

  const liquidWealth = (Object.values(stats.accessibleMoney) as number[]).reduce((a, b) => a + b, 0);
  const investedWealth = (Object.values(stats.investments) as number[]).reduce((a, b) => a + b, 0);
  const totalWealth = liquidWealth + investedWealth;

  const milestones = [
    { days: 3, icon: '🌱', label: 'Semente' }, 
    { days: 7, icon: '⚡', label: 'Energia' }, 
    { days: 15, icon: '🛡️', label: 'Escudo' }, 
    { days: 30, icon: '👑', label: 'Mestre' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Premium Toast */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 dark:border-slate-200">
            <span className="text-xl">{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            {greeting.text} <span className="animate-float">{greeting.icon}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Sua jornada para a liberdade financeira continua.</p>
        </div>

        {/* Dynamic Streak Card */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-3xl border border-slate-100 dark:border-white/10 p-6 rounded-[3rem] flex items-center gap-8 shadow-2xl hover:shadow-brand-500/10 transition-all duration-700 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-[50px] -mr-12 -mt-12" />
          
          <StreakIcon streak={stats.streak} />

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-all group-hover:scale-110 origin-left">{stats.streak}</span>
              <div className="flex flex-col">
                <span className="text-brand-500 font-black text-[10px] uppercase tracking-[0.3em] leading-none mb-1">Dias</span>
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] leading-none">Ativos</span>
              </div>
            </div>
            
            {/* Conquest Milestones */}
            <div className="flex gap-2 mt-3">
              {milestones.map(m => {
                const isUnlocked = stats.streak >= m.days;
                return (
                  <div 
                    key={m.days} 
                    className={`relative group/m cursor-help transition-all duration-500 ${isUnlocked ? 'scale-110' : 'opacity-20 grayscale'}`}
                    title={m.label}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border-2 shadow-sm transition-all ${isUnlocked ? 'bg-white dark:bg-slate-800 border-brand-400/50 shadow-brand-500/20' : 'bg-slate-100 dark:bg-white/5 border-transparent'}`}>
                      {m.icon}
                    </div>
                    {isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NOVO CENTRO DE COMANDO */}
      <div className="bg-slate-900 dark:bg-white/5 border border-slate-800 dark:border-white/10 rounded-[3rem] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl relative group overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Info Zone */}
        <div className="flex items-center gap-6 px-4 py-2">
           <div className="bg-brand-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
           </div>
           <div>
              <p className="text-white/40 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Sessão Ativa</p>
              <h3 className="text-white dark:text-white font-black text-xl tracking-tighter">Treino de Atitude</h3>
           </div>
        </div>

        {/* Stats Zone */}
        <div className="flex flex-1 items-center justify-center gap-8 md:border-l md:border-r border-white/10 px-10 py-2">
           <div className="text-center md:text-left">
              <p className="text-white/30 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Líquido</p>
              <p className="text-white dark:text-white font-black text-lg tracking-tight">R$ {liquidWealth.toLocaleString('pt-BR')}</p>
           </div>
           <div className="text-center md:text-left">
              <p className="text-white/30 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Investido</p>
              <p className="text-emerald-400 font-black text-lg tracking-tight">R$ {investedWealth.toLocaleString('pt-BR')}</p>
           </div>
           <div className="hidden lg:block text-center md:text-left">
              <p className="text-white/30 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Patrimônio Global</p>
              <p className="text-brand-400 font-black text-lg tracking-tight">R$ {totalWealth.toLocaleString('pt-BR')}</p>
           </div>
        </div>

        {/* Action Zone */}
        <div className="px-4">
          <button 
            onClick={onStartTraining}
            className="bg-brand-500 hover:bg-brand-600 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.03] active:scale-95 text-xs uppercase tracking-[0.2em] whitespace-nowrap"
          >
            Iniciar Treino 15m
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <ConfidenceScore stats={stats.confidenceScore} />
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              Alertas Inteligentes
              <span className="bg-emerald-500 w-2 h-2 rounded-full animate-ping" />
            </h3>
          </div>

          <div className="space-y-5">
            {alerts.map(alert => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onAction={handleAlertAction} 
                appliedActions={appliedActions} 
              />
            ))}
          </div>

          {/* Education Mini-Banner */}
          <div className="bg-brand-50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-brand-300 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition-transform">
              🎓
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Fábrica de Dividendos</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Aprenda a criar renda passiva mensal.</p>
            </div>
            <div className="ml-auto text-brand-500 text-xl font-bold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
