
import React, { useState, useRef } from 'react';
import { UserAccount, Theme } from '../types';

interface Props {
  user: UserAccount;
  onUpdateProfile: (name: string, profileImage: string) => void;
  onDeleteAccount: () => void;
  onClose: () => void;
  theme: Theme;
}

const Settings: React.FC<Props> = ({ user, onUpdateProfile, onDeleteAccount, onClose, theme }) => {
  const [name, setName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('BRL');
  const [avatarSeed, setAvatarSeed] = useState(Math.floor(Math.random() * 1000));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateProfile(name, profileImage);
    setToast('Preferências atualizadas com sucesso! ✨');
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast('Erro: Imagem muito grande (máx 2MB)');
        setTimeout(() => setToast(null), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const randomizeAvatar = () => {
    const newSeed = Math.floor(Math.random() * 1000);
    setAvatarSeed(newSeed);
    const styles = ['avataaars', 'bottts', 'adventurer', 'lorelei'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const newAvatar = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${newSeed}`;
    setProfileImage(newAvatar);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 p-5 rounded-3xl shadow-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center gap-4 border border-white/10 dark:border-slate-200 min-w-[320px]">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 flex items-center justify-center shrink-0">
            <span className="text-xl">✨</span>
          </div>
          <span className="font-bold text-sm">{toast}</span>
        </div>
      )}

      {/* Hero Settings Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 border-b border-slate-100 dark:border-white/10 pb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter leading-none">Perfil & <span className="text-brand-500">Privacidade</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Controle sua identidade digital e preferências.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-10 py-5 rounded-[2rem] shadow-2xl hover:scale-[1.03] active:scale-95 transition-all text-sm tracking-tight"
          >
            Salvar Preferências
          </button>
          
          <button 
            onClick={onClose}
            className="w-16 h-16 flex items-center justify-center rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-90"
            title="Sair"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Identity Profile */}
        <div className="lg:col-span-1 space-y-10">
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-500 to-indigo-700 opacity-10 dark:opacity-20 transition-opacity" />
            
            <div className="relative group inline-block mb-8 mt-4">
              <div className="w-44 h-44 rounded-[3.5rem] bg-slate-50 dark:bg-black border-[6px] border-white dark:border-slate-800 overflow-hidden shadow-2xl relative transition-all group-hover:scale-[1.02]">
                <img 
                  src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-md"
                >
                  <span className="text-4xl">📸</span>
                  <span className="text-[9px] font-black uppercase mt-2 tracking-widest">Mudar Foto</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <button 
                onClick={randomizeAvatar}
                className="absolute -bottom-2 -right-2 w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-2xl hover:scale-110 active:rotate-12 transition-all border border-slate-100 dark:border-white/10"
                title="Aleatório"
              >
                🎲
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white truncate">{name || 'Visitante'}</h3>
              <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">{user.email}</p>
            </div>
            
            <div className="mt-10 pt-10 border-t border-slate-50 dark:border-white/5 flex justify-center gap-10">
               <div className="text-center group/metric">
                  <p className="text-3xl font-black text-slate-900 dark:text-white transition-transform group-hover/metric:scale-110">{user.stats.streak}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Streak</p>
               </div>
               <div className="text-center group/metric">
                  <p className="text-3xl font-black text-slate-900 dark:text-white transition-transform group-hover/metric:scale-110">{user.stats.confidenceScore.total}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Score</p>
               </div>
            </div>
          </section>

          {/* Critical: Security Zone */}
          <section className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
            <h2 className="text-xs font-black text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">🛑</span> 
              Zona de Exclusão
            </h2>
            <p className="text-rose-700/70 dark:text-rose-400/50 text-xs font-bold mb-10 leading-relaxed">
              Esta ação apagará todo seu histórico de clareza financeira e patrimônio declarado.
            </p>

            {showDeleteConfirm ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <button 
                  onClick={onDeleteAccount}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-500/20 text-xs uppercase tracking-widest"
                >
                  Confirmar Exclusão
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 font-black py-5 rounded-2xl text-xs uppercase tracking-widest active:scale-95"
                >
                  Voltar Atrás
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-white dark:bg-slate-800/50 text-rose-500 border border-rose-200 dark:border-white/5 font-black py-5 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all text-xs uppercase tracking-widest"
              >
                Deletar Perfil
              </button>
            )}
          </section>
        </div>

        {/* Right: Technical Settings */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-[4rem] shadow-2xl relative">
            <div className="absolute top-10 right-12 bg-slate-50 dark:bg-white/5 px-4 py-1.5 rounded-full text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PatrimônioPro Beta</div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 flex items-center gap-5">
              <span className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner border border-slate-100 dark:border-white/5">📋</span>
              Preferências
            </h2>

            <div className="space-y-12">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-1 block mb-4 group-focus-within:text-brand-500 transition-colors">Identidade</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-20 group-focus-within:opacity-100 transition-opacity">👤</span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-6 pl-16 bg-slate-50 dark:bg-black border-2 border-slate-50 dark:border-white/5 rounded-[2rem] focus:border-brand-500 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-black outline-none font-black text-xl text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="Nome completo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-black rounded-[2.5rem] border border-slate-100 dark:border-white/5 group/item hover:border-brand-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <span className="text-3xl group-hover/item:scale-110 group-hover:rotate-12 transition-transform">🔔</span>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">Notificações</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Alertas de treino.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-14 h-8 rounded-full relative p-1 transition-all flex items-center ${notifications ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-black rounded-[2.5rem] border border-slate-100 dark:border-white/5 group/item hover:border-brand-500/30 transition-all">
                  <div className="flex items-center gap-5">
                    <span className="text-3xl group-hover/item:scale-110 group-hover:-rotate-12 transition-transform">💰</span>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">Moeda Base</p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Padrão de valores.</p>
                    </div>
                  </div>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-black outline-none focus:border-brand-500 transition-colors cursor-pointer text-slate-900 dark:text-white"
                  >
                    <option value="BRL">BRL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-brand-500/10 p-10 rounded-[3rem] flex items-start gap-8 border border-white/10 group hover:scale-[1.01] transition-all">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-xl shrink-0 group-hover:scale-110 transition-transform">🛡️</div>
                <div>
                  <h4 className="font-black text-white text-xl">Escudo de Dados</h4>
                  <p className="text-slate-400 dark:text-brand-300/60 text-sm font-medium mt-2 leading-relaxed">
                    Seu patrimônio é protegido por criptografia de ponta a ponta. Somente você e a análise offline da IA têm acesso aos seus números reais.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="mt-14 w-full bg-brand-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 hover:scale-[1.01] active:scale-95 transition-all text-xl flex items-center justify-center gap-4"
            >
              💾 Confirmar Alterações
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
