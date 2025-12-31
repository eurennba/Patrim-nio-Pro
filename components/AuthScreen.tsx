
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

  // We only check if "Remember Me" was previously active, but we leave fields empty as requested
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
        setError('Este e-mail já está cadastrado em nosso sistema.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const newUser: UserAccount = { name, email, password, stats: INITIAL_STATS };
        localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
        handlePersistence(email, password);
        
        if (sendEmailReport) {
          setSuccess('Conta criada! Guia inicial enviado para seu e-mail. ✨');
        } else {
          setSuccess('Sua conta foi criada com sucesso! ✨');
        }
        
        setTimeout(() => onAuthComplete(newUser), 1500);
      }, 1200);

    } else if (step === 'LOGIN') {
      const savedUser = localStorage.getItem(`user_${email}`);
      if (!savedUser) {
        setError('E-mail não encontrado. Verifique os dados ou cadastre-se.');
        return;
      }
      
      const user = JSON.parse(savedUser) as UserAccount;
      if (user.password !== password) {
        setError('Senha incorreta para este usuário.');
        return;
      }
      
      handlePersistence(email, password);
      onAuthComplete(user);
    } else if (step === 'RECOVERY') {
      if (!email || !newEmail || !password) {
        setError('Todos os campos são necessários para a recuperação.');
        return;
      }

      const savedUser = localStorage.getItem(`user_${email}`);
      if (!savedUser) {
        setError('E-mail atual não localizado.');
        return;
      }

      const user = JSON.parse(savedUser) as UserAccount;
      user.email = newEmail;
      user.password = password;

      localStorage.setItem(`user_${newEmail}`, JSON.stringify(user));
      if (email !== newEmail) localStorage.removeItem(`user_${email}`);

      setSuccess('Credenciais atualizadas! Acesse agora. ✨');
      setTimeout(() => {
        setStep('LOGIN');
        setEmail(newEmail);
        setPassword('');
        setSuccess('');
      }, 2000);
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
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-black' : 'bg-slate-50 bg-[radial-gradient(circle_at_top_right,_#fffbeb,_#f8fafc)]'}`}>
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        
        {/* Brand Header */}
        <div className="text-center mb-8 group">
          <div className="inline-flex p-5 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-2xl mb-6 border border-amber-50 dark:border-white/10 transition-all duration-500 group-hover:shadow-amber-500/20 group-hover:-translate-y-1">
            {LOGO_ICON}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-medium text-slate-500 dark:text-slate-400 tracking-wide leading-none mb-1">Patrimônio</span>
            <h1 className="text-5xl font-black italic text-amber-500 tracking-tighter leading-none">PRO</h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] dark:shadow-none border border-slate-100 dark:border-white/10 overflow-hidden transition-all duration-300">
          
          {/* Dynamic Header: Tabs or Recovery Title */}
          <div className="relative">
            {step !== 'RECOVERY' ? (
              <div className="flex bg-slate-50/50 dark:bg-white/5 h-16 relative">
                <button 
                  onClick={() => { setStep('LOGIN'); setError(''); setSuccess(''); setEmail(''); setPassword(''); }}
                  className={`flex-1 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 relative z-10 ${step === 'LOGIN' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/20'}`}
                >
                  Entrar
                </button>
                <button 
                  onClick={() => { setStep('REGISTER'); setError(''); setSuccess(''); setEmail(''); setPassword(''); setName(''); }}
                  className={`flex-1 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 relative z-10 ${step === 'REGISTER' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/20'}`}
                >
                  Cadastrar
                </button>
                
                {/* Slidable Indicator */}
                <div 
                  className="absolute bottom-0 h-1 bg-amber-500 transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                  style={{ 
                    width: '50%', 
                    left: step === 'LOGIN' ? '0%' : '50%',
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.6)'
                  }}
                />
              </div>
            ) : (
              <div className="bg-amber-500/10 dark:bg-amber-500/5 h-16 flex items-center justify-center border-b border-amber-500/20">
                <h2 className="text-amber-600 dark:text-amber-500 font-black text-[10px] uppercase tracking-[0.3em]">Recuperação de Acesso</h2>
              </div>
            )}
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {step === 'REGISTER' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">Seu Nome</label>
                    <div className="group relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">👤</span>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 pl-14 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-amber-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="Como deseja ser chamado?"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">
                    {step === 'RECOVERY' ? 'E-mail cadastrado' : 'E-mail'}
                  </label>
                  <div className="group relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">✉️</span>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 pl-14 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-amber-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      placeholder="seu@email.com.br"
                    />
                  </div>
                </div>

                {step === 'RECOVERY' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">Novo E-mail (Opcional)</label>
                    <div className="group relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔄</span>
                      <input 
                        type="email" 
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full p-4 pl-14 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-amber-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="novo@email.com.br"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">
                      {step === 'RECOVERY' ? 'Nova Senha' : 'Senha'}
                    </label>
                    {step === 'LOGIN' && (
                      <button 
                        type="button" 
                        onClick={() => { setStep('RECOVERY'); setError(''); setSuccess(''); }}
                        className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest hover:underline transition-all"
                      >
                        Esqueci a senha?
                      </button>
                    )}
                  </div>
                  <div className="group relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-40 group-focus-within:opacity-100 transition-opacity">🔑</span>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 pl-14 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-2xl focus:border-amber-500 focus:bg-white dark:focus:bg-black outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      placeholder="Sua senha secreta"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 ml-1 animate-in fade-in duration-700">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-transparent border-slate-200 dark:border-white/10'}`}
                    >
                      {rememberMe && <span className="text-[10px] font-black">✓</span>}
                    </button>
                    <span 
                      onClick={() => setRememberMe(!rememberMe)}
                      className="text-xs font-bold text-slate-400 dark:text-white/30 cursor-pointer select-none hover:text-slate-600 dark:hover:text-white/60 transition-colors"
                    >
                      Lembrar meu e-mail neste navegador
                    </span>
                  </div>

                  {step === 'REGISTER' && (
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setSendEmailReport(!sendEmailReport)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${sendEmailReport ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-transparent border-slate-200 dark:border-white/10'}`}
                      >
                        {sendEmailReport && <span className="text-[10px] font-black">✓</span>}
                      </button>
                      <span 
                        onClick={() => setSendEmailReport(!sendEmailReport)}
                        className="text-xs font-bold text-slate-400 dark:text-white/30 cursor-pointer select-none hover:text-slate-600 dark:hover:text-white/60 transition-colors"
                      >
                        Receber guia inicial e dados por e-mail
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="flex items-center gap-3 text-rose-500 text-xs font-bold bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20 animate-in shake-animation">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 text-emerald-600 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 animate-in fade-in">
                  <span>✨</span>
                  {success}
                </div>
              )}

              {/* Action Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all text-lg group flex items-center justify-center gap-3 disabled:opacity-50`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {step === 'LOGIN' ? 'Acessar Conta' : step === 'REGISTER' ? 'Criar minha conta' : 'Confirmar Mudança'}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>

              {step === 'RECOVERY' && (
                <button 
                  type="button" 
                  onClick={() => { setStep('LOGIN'); setError(''); setSuccess(''); }}
                  className="w-full text-slate-400 dark:text-white/40 text-[10px] font-black uppercase tracking-[0.2em] hover:text-amber-500 transition-colors py-2"
                >
                  Cancelar e voltar ao login
                </button>
              )}
            </form>

            {/* Professional Footer Section */}
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5">
              <p className="text-center text-slate-900 dark:text-white text-[10px] font-black leading-relaxed tracking-[0.25em] uppercase mb-1">
                Tecnologia de Inteligência Patrimonial
              </p>
              <p className="text-center text-slate-400 dark:text-white/20 text-[9px] font-medium leading-relaxed tracking-wide">
                Ambiente de alta segurança com arquitetura local-first. <br/>
                Suas diretrizes financeiras permanecem sob sua soberania exclusiva e inviolável.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake-animation { animation: shake 0.25s ease-in-out infinite alternate; animation-iteration-count: 2; }
      `}</style>
    </div>
  );
};

export default AuthScreen;
