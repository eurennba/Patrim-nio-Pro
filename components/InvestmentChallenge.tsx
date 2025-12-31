
import React, { useState } from 'react';
import { ChallengeStep, Theme } from '../types';
import { getChallengeFeedback } from '../services/geminiService';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
  theme: Theme;
}

const InvestmentChallenge: React.FC<Props> = ({ onComplete, onCancel, theme }) => {
  const [step, setStep] = useState<ChallengeStep>('INTRO');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const bonusAmount = 2000;

  const assets = [
    { id: 'selic', name: 'Tesouro SELIC', icon: '🛡️', desc: 'Segurança absoluta e liquidez diária para sua base.', risk: 'Baixo' },
    { id: 'fii', name: 'Fundos Imob.', icon: '🏢', desc: 'Renda mensal isenta de IR vindo de aluguéis.', risk: 'Médio' },
    { id: 'stocks', name: 'Ações Blue Chips', icon: '📈', desc: 'Sócio das maiores empresas do Brasil e do mundo.', risk: 'Alto' },
  ];

  const handleChoice = async (assetName: string) => {
    setSelectedAsset(assetName);
    setIsLoading(true);
    setStep('RESULT');
    const feedback = await getChallengeFeedback(assetName, bonusAmount);
    setAiFeedback(feedback);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/90 backdrop-blur-2xl z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative border border-white dark:border-slate-800 transition-all duration-500">
        
        {/* Header Branding */}
        <div className="h-32 bg-brand-500 flex items-center justify-center relative overflow-hidden px-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-orange-600/20 animate-pulse-slow" />
          <div className="relative z-10 text-center">
            <h2 className="text-slate-900 font-black text-2xl tracking-tight leading-none uppercase italic">O Salto do Patrimônio</h2>
            <p className="text-slate-900/40 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Challenge Simulator v1.0</p>
          </div>
          
          <button 
            onClick={onCancel} 
            className="absolute top-8 right-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 text-slate-900 transition-all hover:scale-110 active:scale-90 z-20 backdrop-blur-md border border-white/10"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="p-10 md:p-12 min-h-[460px] flex flex-col">
          {step === 'INTRO' && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col flex-1 items-center justify-center">
              <div className="w-24 h-24 bg-brand-50 dark:bg-brand-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-brand-100 dark:border-brand-500/20 relative group">
                <div className="absolute inset-0 bg-brand-500/10 blur-xl group-hover:blur-2xl transition-all rounded-full" />
                <span className="text-5xl animate-float relative">🎁</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Cenário Inesperado!</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-12 leading-relaxed text-lg font-medium max-w-sm">
                Você acaba de receber um bônus de <br/>
                <span className="text-brand-500 font-black text-3xl tracking-tighter block mt-2">R$ {bonusAmount.toLocaleString('pt-BR')}</span>
              </p>
              <button 
                onClick={() => setStep('CHOICE')}
                className="w-full bg-slate-900 dark:bg-brand-500 hover:bg-black dark:hover:bg-brand-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 transition-all text-xl active:scale-95 group"
              >
                Decidir Destino <span className="inline-block group-hover:translate-x-1 transition-transform ml-1">→</span>
              </button>
            </div>
          )}

          {step === 'CHOICE' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col flex-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Qual sua estratégia?</h3>
              
              <div className="space-y-4 flex-1">
                {assets.map((asset) => (
                  <button 
                    key={asset.id}
                    onClick={() => handleChoice(asset.name)}
                    className="w-full text-left p-6 rounded-[2.5rem] border-2 border-slate-50 dark:border-white/5 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all group flex items-center gap-5 bg-slate-50 dark:bg-white/5"
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                      {asset.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-900 dark:text-white font-black text-lg">{asset.name}</span>
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                          asset.risk === 'Baixo' ? 'border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 
                          asset.risk === 'Médio' ? 'border-orange-200 text-orange-600 bg-orange-50 dark:bg-orange-900/20' : 
                          'border-rose-200 text-rose-600 bg-rose-50 dark:bg-rose-950/20'
                        }`}>Risco {asset.risk}</span>
                      </div>
                      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium leading-tight truncate">{asset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'RESULT' && (
            <div className="text-center flex flex-col flex-1 justify-center animate-in fade-in duration-500">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Avaliando Escolha...</p>
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-700">
                  <div className="w-24 h-24 bg-brand-50 dark:bg-brand-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-brand-100 dark:border-brand-500/20">
                    <span className="text-5xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Parecer da Estratégia</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">Alocação: {selectedAsset}</p>
                  
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-10 rounded-[3rem] mb-12 relative group">
                    <div className="absolute top-0 left-10 w-10 h-1 bg-brand-500 rounded-full" />
                    <p className="text-slate-700 dark:text-slate-300 font-bold italic text-xl leading-relaxed text-left">
                      "{aiFeedback}"
                    </p>
                  </div>

                  <button 
                    onClick={() => setStep('REWARD')}
                    className="w-full bg-slate-900 dark:bg-brand-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
                  >
                    Resgatar Resultados
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'REWARD' && (
            <div className="text-center animate-in zoom-in-95 duration-700 flex flex-col flex-1 items-center justify-center">
              <div className="text-9xl mb-12 animate-float drop-shadow-2xl">🏆</div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Desafio Concluído!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg">
                Sua mentalidade estratégica está evoluindo.
              </p>
              
              <div className="grid grid-cols-2 gap-6 w-full mb-12">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/20 shadow-lg group hover:scale-105 transition-transform">
                  <p className="text-emerald-500 font-black text-4xl tracking-tighter mb-1">+5</p>
                  <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-500 uppercase tracking-widest">Educação</p>
                </div>
                <div className="bg-brand-50 dark:bg-brand-500/10 p-8 rounded-[2.5rem] border border-brand-100 dark:border-brand-500/20 shadow-lg group hover:scale-105 transition-transform">
                  <p className="text-brand-500 font-black text-4xl tracking-tighter mb-1">+3</p>
                  <p className="text-[10px] font-black text-brand-700 dark:text-brand-500 uppercase tracking-widest">Progresso</p>
                </div>
              </div>

              <button 
                onClick={onComplete}
                className="w-full bg-slate-900 dark:bg-brand-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
              >
                Voltar ao Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentChallenge;
