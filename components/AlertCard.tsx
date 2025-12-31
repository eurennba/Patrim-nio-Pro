
import React, { useState } from 'react';
import { FinancialAlert, AlertCategory } from '../types';

interface Props {
  alert: FinancialAlert;
  onAction: (alertId: string, actionValue: string) => void;
  appliedActions: Record<string, string>;
}

const AlertCard: React.FC<Props> = ({ alert, onAction, appliedActions }) => {
  const takenAction = appliedActions[alert.id];
  const isAiAdvice = alert.description.includes('IA sugere:');
  const showAiLabel = isAiAdvice && takenAction !== 'ignore' && takenAction !== 'skip';

  const getTheme = () => {
    switch (alert.category) {
      case AlertCategory.SECURITY: return { bg: 'bg-amber-50 dark:bg-amber-950/20', accent: 'text-amber-600', icon: '🛡️', border: 'border-amber-100 dark:border-amber-500/20' };
      case AlertCategory.OPPORTUNITY: return { bg: 'bg-orange-50 dark:bg-orange-950/20', accent: 'text-orange-600', icon: '🎯', border: 'border-orange-100 dark:border-orange-500/20' };
      default: return { bg: 'bg-slate-50 dark:bg-white/5', accent: 'text-brand-500', icon: 'ℹ️', border: 'border-slate-100 dark:border-white/5' };
    }
  };

  const theme = getTheme();

  if (takenAction && (takenAction === 'ignore' || takenAction === 'skip')) return null;

  return (
    <div className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${theme.bg} ${theme.border}`}>
      {showAiLabel && (
        <div className="absolute -top-3 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-10">
          Recomendação IA
        </div>
      )}

      <div className="flex gap-5">
        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50 dark:border-white/5 shrink-0 group-hover:scale-110 transition-transform">
          {theme.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{alert.title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
            {isAiAdvice ? alert.description.replace('IA sugere:', '').trim() : alert.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {alert.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onAction(alert.id, action.value)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  idx === 0 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-100 dark:border-slate-700 shadow-sm'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;