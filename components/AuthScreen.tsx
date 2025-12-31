
import React, { useState, useEffect } from 'react';
import { AuthStep, UserAccount, UserStats, Theme } from '../types';
import { LOGO_ICON } from '../constants';

interface Props {
  onAuthComplete: (user: UserAccount) => void;
  theme: Theme;
}

const INITIAL_STATS: UserStats = {
  accessibleMoney: { bank1: 0, bank2: 0, physical: 0 },
  investments: { savings: 0, tesouro: 0, stocks: 0, others: 0 },
  confidenceScore: {
    clarity: 0,
    consistency: 0,
    diversification: 0,
    progress: 0,
    education: 0,
    total: 0
  },
  streak: 0,
  trainingHistory: []
};

const AuthScreen: React.FC<Props> = ({ onAuthComplete, theme }) => {
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [sendEmailReport, setSendEmailReport] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('patrimonio_pro_remember_email');
    if (savedEmail) {
      setRememberMe(true);
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (step === 'REGISTER') {
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newUser: UserAccount = { name, email, password, stats: INITIAL_STATS };
        localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
        handlePersistence(email, password);
        onAuthComplete(newUser);
      }, 1200);

    } else if (step === 'LOGIN') {
      const savedUser = localStorage.getItem(`user_${email}`);
      if (!savedUser) {
        setError('E-mail não encontrado.');
        return;
      }
      const user = JSON.parse(savedUser) as UserAccount;
      if (user.password !== password) {
        setError('Senha incorreta.');
        return;
      }
      handlePersistence(email, password);
      onAuthComplete(user);
    }
  };

  const handleGuestAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestUser: UserAccount = {
        name: 'Visitante Público',
        email: 'guest@patrimoniopro.com',
        stats: INITIAL_STATS
      };
      onAuthComplete(guestUser);
    }, 800);
  };

  const handleKeyConfig = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setSuccess('Conexão estabelecida. ✨');
    }
  };

  const handlePersistence = (userEmail: string, userPass: string) => {
    if (rememberMe) {
      localStorage.setItem('patrimonio_pro_remember_email', userEmail);
    } else {
      localStorage.removeItem('patrimonio_pro_remember_email');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-400/10 blur-[150px] rounded-full animate-float" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left: Value Proposition (Landing Page Style) */}
        <div className="space-y-10 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex p-4 bg-white dark:bg-white/5 rounded-3xl shadow-2xl border border-brand-500/20 mb-4 transform hover:rotate-3 transition-transform">
            {LOGO_ICON}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-sm font-black text-brand-500 uppercase tracking-[0.4em]">Plataforma de Elite</h2>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.9] lg:max-w-md">
              Domine seu <span className="text-brand-500 italic">Futuro</span> Financeiro.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              A ferramenta definitiva para quem busca clareza absoluta sobre o patrimônio. Inteligência artificial local para sua soberania total.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={handleGuestAccess}
              className="px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg group"
            >
              Começar Agora (Grátis)
              <span className="inline-block ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <button 
              onClick={handleKeyConfig}
              className="px-8 py-6 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 text-slate-900 dark:text-white font-black rounded-3xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-lg"
            >
              Configurar Acesso IA
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-10 flex items-center justify-center lg:justify-start gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-2xl">🔒</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">100% Local-First</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-2xl">⚡</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">Resposta Real-Time</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-2xl">💎</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">Qualidade Premium</span>
            </div>
          </div>
        </div>

        {/* Right: Authentication Card */}
        <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white dark:bg-white/5 rounded-[3.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-100 dark:border-white/10 overflow-hidden relative">
            
            {/* Tabs */}
            <div className="flex bg-slate-50/50 dark:bg-white/5 h-20 border-b border-slate-100 dark:border-white/5">
              <button 
                onClick={() => setStep('LOGIN')}
                className={`flex-1 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${step === 'LOGIN' ? 'text-slate-900 dark:text-white bg-white dark:bg-transparent' : 'text-slate-400 dark:text-white/20'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setStep('REGISTER')}
                className={`flex-1 font-black text-[10px] uppercase tracking-[0.3em] transition-all ${step === 'REGISTER' ? 'text-slate-900 dark:text-white bg-white dark:bg-transparent' : 'text-slate-400 dark:text-white/20'}`}
              >
                Criar Perfil
              </button>
            </div>

            <div className="p-10">
              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="space-y-5">
                  
                  {step === 'REGISTER' && (
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-brand-500 transition-colors">Seu Nome</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-brand-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  )}

                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-brand-500 transition-colors">E-mail de Acesso</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-brand-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-brand-500 transition-colors">Senha Secreta</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-brand-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && <div className="text-rose-500 text-[10px] font-black bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 animate-pulse">{error}</div>}
                {success && <div className="text-emerald-500 text-[10px] font-black bg-emerald-50 p-4 rounded-xl border border-emerald-100">{success}</div>}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-slate-900 font-black py-5 rounded-3xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 text-lg"
                >
                  {isLoading ? 'Conectando...' : step === 'LOGIN' ? 'Acessar Plataforma' : 'Finalizar Cadastro'}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-50 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-2">Tecnologia de Inteligência Patrimonial</p>
                <p className="text-[9px] text-slate-400 dark:text-white/20 leading-relaxed max-w-xs mx-auto">
                  Ambiente de alta segurança com arquitetura local-first. Suas diretrizes financeiras permanecem sob sua soberania exclusiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Scroll Hint */}
      <div className="mt-16 animate-scroll-down opacity-30 hidden lg:block">
        <span className="text-2xl">🖱️</span>
      </div>
    </div>
  );
};

export default AuthScreen;
