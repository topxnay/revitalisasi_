import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  KeyRound, 
  AlertCircle
} from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  users?: User[];
  registeredUsers?: User[];
  onRegisterUser?: (newUser: User) => void;
  initialRole?: 'admin' | 'user';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  users,
  registeredUsers
}) => {
  const userList = users || registeredUsers || [];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const target = userList.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && 
           u.password === password
    );

    if (target) {
      if (target.status === 'inactive') {
        setErrorMessage('Akun ini sedang dinonaktifkan oleh administrator.');
        return;
      }
      onLoginSuccess(target);
      onClose();
    } else {
      setErrorMessage('Nama pengguna atau kata sandi tidak sesuai.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Header with Title & Close */}
        <div className="bg-white/5 border-b border-white/10 p-6 relative backdrop-blur-md">
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white leading-snug">
                Masuk Sistem SIM- REVIT ASPIRASI
              </h2>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                (Pengajuan Rehab, Renov dan RKB -ASPIRASI)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="p-4 bg-red-500/15 border border-red-500/25 text-red-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Pengguna / Username / NPSN
              </label>
              <input
                id="input-login-username"
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username atau NPSN"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all"
              />
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Aplikasi</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
