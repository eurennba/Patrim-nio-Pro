
import React, { useState } from 'react';
import { TrainingStep, UserStats, Theme } from '../types';
import { getFinancialDiscoveryMessage } from '../services/geminiService';

interface Props {
  onComplete: (newStats: Partial<UserStats>) => void;
  onCancel: () => void;
  theme: Theme;
}

const TrainingIcon = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
    <div className="relative w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/20 transform hover:scale-110 transition-transform duration-500">
      <svg viewBox="0 0 24 24" className="w-12 h-12 text-white drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
      </svg>
      <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-lg border border-slate-100 dark:border-white/10">
        <span className="text-xs font-black text-brand-600">15m</span>
      </div>
    </div>
  </div>
);

const TrainingSession: React.FC<Props> = ({ onComplete, onCancel, theme }) => {
  const [step, setStep] = useState<TrainingStep>('WELCOME');
  const [formData, setFormData] = useState<Partial<UserStats>>({
    accessibleMoney: { bank1: 0, bank2: 0, physical: 0 },
    investments: { savings: 0, tesouro: 0, stocks: 0, others: 0 }
  });
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const stepsOrder: TrainingStep[] = ['WELCOME', 'STARTING_POINT', 'TREASURE_MAP_A', 'TREASURE_MAP_B', 'PHOTO_SUMMARY', 'AI_DISCOVERY', 'MISSION_COMPLETE'];

  const nextStep = () => {
    const currentIndex = stepsOrder.indexOf(step);
    if (currentIndex < stepsOrder.length - 1) {
      const next = stepsOrder[currentIndex + 1];
      if (next === 'AI_DISCOVERY') {
        generateDiscovery();
      } else {
        setStep(next);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = stepsOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepsOrder[currentIndex - 1]);
    }
  };

  const generateDiscovery = async () => {
    setIsLoadingAi(true);
    setStep('AI_DISCOVERY');
    const msg = await getFinancialDiscoveryMessage(formData as UserStats);
    setAiMessage(msg);
    setIsLoadingAi(false);
  };

  const handleFinish = () => {
    onComplete(formData);
  };

  const liquidTotal = (formData.accessibleMoney?.bank1 || 0) + 
                      (formData.accessibleMoney?.bank2 || 0) + 
                      (formData.accessibleMoney?.physical || 0);
  
  const investedTotal = (formData.investments?.savings || 0) + 
                         (formData.investments?.tesouro || 0) + 
                         (formData.investments?.stocks || 0) + 
                         (formData.investments?.others || 0);

  const total = liquidTotal + investedTotal;

  const percAccessible = total > 0 ? Math.round((liquidTotal / total) * 100) : 0;
  const percInvested = 100 - percAccessible;

  const handleInputChange = (category: 'accessibleMoney' | 'investments', field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: numValue
      }
    }));
  };

  const currentStepIndex = stepsOrder.indexOf(step);
  const progressPercent = ((currentStepIndex + 1) / stepsOrder.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden relative border border-white/10 dark:border-slate-800 transition-all duration-500">
        
        {/* COMPACT COMMAND HEADER */}
        <div className="relative border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Step Info */}
            <div className="flex items-center gap-3 min-w-0">
               <button 
                onClick={prevStep}
                disabled={currentStepIndex === 0 || step === 'MISSION_COMPLETE'}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentStepIndex === 0 || step === 'MISSION_COMPLETE' ? 'opacity-0 scale-0' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-brand-500 shadow-sm border border-slate-100 dark:border-white/5'}`}
               >
                 <span className="text-sm font-bold">←</span>
               </button>
               <div className="min-w-0">
                  <p className="text-[8px] font-black text-brand-500 uppercase tracking-[0.2em] leading-none mb-1">Passo {currentStepIndex + 1}</p>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate tracking-tight">{step.replace('_', ' ')}</h4>
               </div>
            </div>

            {/* Center: Live Values */}
            <div className="hidden sm:flex items-center gap-6 px-6 border-l border-r border-slate-200 dark:border-white/10 h-10">
               <div className="text-right">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Líquido</p>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white">R$ {liquidTotal.toLocaleString('pt-BR')}</p>
               </div>
               <div className="text-right">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Investido</p>
                  <p className="text-[10px] font-black text-emerald-500">R$ {investedTotal.toLocaleString('pt-BR')}</p>
               </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
               <div className="text-right hidden xs:block">
                  <p className="text-[7px] font-black text-brand-500 uppercase tracking-widest">Mapeado</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">R$ {total.toLocaleString('pt-BR')}</p>
               </div>
               <button 
                onClick={onCancel}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-200/50 dark:bg-white/10 text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
              >
                <span className="text-lg font-bold">✕</span>
              </button>
            </div>
          </div>

          {/* Precision Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-200 dark:bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(245,158,11,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="px-10 pb-12 pt-8 min-h-[480px] flex flex-col relative">
          {step === 'WELCOME' && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center flex-1">
              <div className="mb-10 scale-110">
                <TrainingIcon />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Diagnóstico Sem Medo</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 leading-relaxed text-lg font-medium max-w-xs">
                Transforme sua ansiedade em números reais. Vamos mapear sua base financeira agora.
              </p>
              <button 
                onClick={nextStep}
                className="w-full bg-slate-900 dark:bg-brand-500 hover:bg-black dark:hover:bg-brand-600 text-white font-black py-6 rounded-3xl shadow-2xl transition-all text-xl group"
              >
                Começar Treino <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
              </button>
            </div>
          )}

          {step === 'STARTING_POINT' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col flex-1">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Onde estamos?</h2>
              <p className="text-slate-500 font-semibold mb-10">Qual o seu maior desafio financeiro hoje?</p>
              
              <div className="space-y-4 flex-1">
                {[
                  { text: 'Sinto que meu dinheiro some', icon: '🌪️' },
                  { text: 'Tenho reservas dispersas', icon: '🏦' },
                  { text: 'Quero clareza para crescer', icon: '✨' }
                ].map((option, idx) => (
                  <button 
                    key={idx}
                    onClick={nextStep}
                    className="w-full text-left p-6 rounded-3xl border-2 border-slate-50 dark:border-white/5 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all group flex items-center gap-6 bg-slate-50 dark:bg-white/5"
                  >
                    <span className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-3xl shadow-sm border border-slate-50 group-hover:rotate-6 transition-transform">{option.icon}</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-lg flex-1 tracking-tight">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(step === 'TREASURE_MAP_A' || step === 'TREASURE_MAP_B') && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mapa de Valor</h2>
                  <p className={`font-black text-[10px] uppercase tracking-widest mt-1 ${step === 'TREASURE_MAP_A' ? 'text-brand-500' : 'text-emerald-500'}`}>
                    {step === 'TREASURE_MAP_A' ? 'Líquido / Bancos' : 'Ativos / Investimentos'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 dark:border-white/5">
                  {step === 'TREASURE_MAP_A' ? '💰' : '💎'}
                </div>
              </div>

              <div className="space-y-6">
                {(step === 'TREASURE_MAP_A' ? [
                  { label: 'Banco Principal', field: 'bank1' },
                  { label: 'Reserva Emergência', field: 'physical' }
                ] : [
                  { label: 'Tesouro Selic', field: 'tesouro' },
                  { label: 'Renda Variável', field: 'stocks' },
                  { label: 'Outros (Cripto/Etc)', field: 'others' }
                ]).map(item => (
                  <div key={item.field} className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest group-focus-within:text-brand-500 transition-colors">{item.label}</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">R$</span>
                      <input 
                        type="number" 
                        placeholder="0,00"
                        value={(formData[step === 'TREASURE_MAP_A' ? 'accessibleMoney' : 'investments'] as any)[item.field] || ''}
                        onChange={(e) => handleInputChange(step === 'TREASURE_MAP_A' ? 'accessibleMoney' : 'investments', item.field, e.target.value)}
                        className="w-full p-5 pl-14 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-brand-500 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-black outline-none font-black text-2xl text-slate-900 dark:text-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button 
                  onClick={nextStep} 
                  className={`w-full font-black py-6 rounded-3xl shadow-xl transition-all text-white text-lg active:scale-95 ${step === 'TREASURE_MAP_A' ? 'bg-brand-500 shadow-brand-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}
                >
                  Confirmar e Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'PHOTO_SUMMARY' && (
            <div className="text-center animate-in zoom-in-95 duration-700 flex flex-col flex-1">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Sua Realidade 📸</h2>
              <p className="text-slate-500 font-semibold mb-10">O espelho do seu patrimônio atual.</p>
              
              <div className="bg-slate-50 dark:bg-black/40 rounded-[3rem] p-10 mb-auto border border-slate-100 dark:border-white/5 shadow-inner group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Patrimônio Declarado</p>
                <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-10">R$ {total.toLocaleString('pt-BR')}</p>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Acessível</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{percAccessible}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-brand-500 transition-all duration-1000" style={{ width: `${percAccessible}%` }} />
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${percInvested}%` }} />
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{percInvested}%</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Investido</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-6 rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl mt-12"
              >
                Analisar com IA ✨
              </button>
            </div>
          )}

          {step === 'AI_DISCOVERY' && (
            <div className="text-center flex flex-col flex-1 animate-in fade-in duration-1000 items-center justify-center">
               <div className="w-24 h-24 bg-brand-500/10 rounded-[2rem] flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-brand-500/20 blur-xl animate-pulse rounded-full" />
                  <span className="text-5xl relative animate-float">✨</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">Veredito da IA</h2>
              
              <div className="flex-1 w-full flex flex-col justify-center">
                {isLoadingAi ? (
                  <div className="space-y-6 px-10">
                    <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full animate-pulse w-full" />
                    <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full animate-pulse w-5/6 mx-auto" />
                    <div className="h-4 bg-slate-50 dark:bg-white/5 rounded-full animate-pulse w-4/6 mx-auto" />
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-black/40 backdrop-blur-md border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-slate-800 dark:text-slate-200 font-bold italic leading-relaxed text-xl">
                      "{aiMessage}"
                    </p>
                  </div>
                )}
              </div>

              <button 
                disabled={isLoadingAi}
                onClick={nextStep}
                className="w-full bg-brand-500 text-white font-black py-6 rounded-3xl shadow-xl shadow-brand-500/30 transition-all mt-12 text-xl disabled:opacity-50"
              >
                Continuar Jornada
              </button>
            </div>
          )}

          {step === 'MISSION_COMPLETE' && (
            <div className="text-center animate-in zoom-in-95 flex flex-col flex-1 items-center justify-center">
              <div className="text-9xl mb-10 animate-float drop-shadow-2xl">🏆</div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Clareza Ativada</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 font-semibold text-lg">
                Você acaba de dar o passo mais importante: <br/><span className="text-brand-500 font-black italic">o primeiro.</span>
              </p>
              
              <div className="bg-gradient-to-br from-brand-500 to-orange-600 p-8 rounded-[2.5rem] mb-auto flex items-center gap-6 text-left shadow-2xl group w-full">
                <div className="text-5xl bg-white/20 backdrop-blur-lg w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 shrink-0">🏅</div>
                <div>
                  <h4 className="text-white font-black text-xl leading-none">Mestre Nível 1</h4>
                  <p className="text-brand-50 text-[9px] font-black uppercase tracking-widest mt-2 opacity-80">Evolução Patrimonial Iniciada</p>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full bg-slate-900 dark:bg-brand-500 text-white font-black py-6 rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl mt-12"
              >
                Finalizar Treino
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingSession;
