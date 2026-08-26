import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  School, 
  KeyRound, 
  UserPlus, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { User, JenjangType } from '../types';
import { JENJANG_LIST } from '../data/defaultCatalog';

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
  registeredUsers,
  onRegisterUser,
  initialRole = 'user'
}) => {
  const userList = Array.isArray(users) ? users : (Array.isArray(registeredUsers) ? registeredUsers : []);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Register form state
  const [regForm, setRegForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nama: '',
    email: '',
    noHp: '',
    namaSekolah: '',
    npsn: '',
    jenjang: 'SMK' as JenjangType,
    kabupaten: 'Kabupaten Tasikmalaya',
    provinsi: 'JAWA BARAT'
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const target = userList.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && 
           (u.password === password || (!u.password && password === '123456') || password === 'admin2027' || password === 'smk2027')
    );

    if (target) {
      if (target.status === 'inactive') {
        setErrorMessage('Akun ini sedang dinonaktifkan oleh administrator.');
        return;
      }
      onLoginSuccess(target);
      onClose();
    } else {
      setErrorMessage('Nama pengguna atau kata sandi tidak sesuai. Silakan gunakan tombol demo di bawah.');
    }
  };

  const handleQuickLogin = (targetUser: User) => {
    onLoginSuccess(targetUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (userList.some(u => u.username.toLowerCase() === regForm.username.trim().toLowerCase())) {
      setErrorMessage('Username tersebut sudah digunakan. Silakan pilih username lain.');
      return;
    }

    if (userList.some(u => u.npsn && u.npsn === regForm.npsn.trim())) {
      setErrorMessage('NPSN ini sudah terdaftar dalam sistem.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      username: regForm.username.trim(),
      password: regForm.password,
      nama: regForm.nama,
      role: 'user',
      email: regForm.email,
      noHp: regForm.noHp,
      namaSekolah: regForm.namaSekolah,
      npsn: regForm.npsn,
      jenjang: regForm.jenjang,
      kabupaten: regForm.kabupaten,
      provinsi: regForm.provinsi,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    if (onRegisterUser) {
      onRegisterUser(newUser);
    }
    onLoginSuccess(newUser);
    onClose();
  };

  const adminUsers = userList.filter(u => u.role === 'admin');
  const schoolUsers = userList.filter(u => u.role === 'user');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Header with Title & Close */}
        <div className="bg-white/5 border-b border-white/10 p-6 sm:p-7 relative backdrop-blur-md">
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Masuk Sistem SIM-REVIT 2027
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Pilih Akun Role Admin Pusat atau Role Pengguna Sekolah
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
            <button
              id="tab-login"
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                tab === 'login' 
                  ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk dengan Akun</span>
            </button>
            <button
              id="tab-register"
              onClick={() => { setTab('register'); setErrorMessage(''); }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                tab === 'register' 
                  ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrasi Sekolah Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-500/15 border border-red-500/25 text-red-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'login' ? (
            <div className="space-y-6">
              {/* Form Manual Login */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nama Pengguna / Username / NPSN
                  </label>
                  <input
                    id="input-login-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: admin atau smk_miftahul atau 20263295"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Kata Sandi
                    </label>
                    <span className="text-xs text-slate-400">
                      Default Demo: admin2027 / smk2027
                    </span>
                  </div>
                  <input
                    id="input-login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Aplikasi</span>
                </button>
              </form>

              {/* Quick 1-Click Demo Accounts Section */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Akses Cepat 1-Klik Akun Demo (Sesuai Dokumen)
                  </span>
                </div>

                {/* Role 1: Admin */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Role 1: Admin Pusat (Verifikasi, Download Excel, Tambah User)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {adminUsers.map(admin => (
                      <button
                        key={admin.id}
                        type="button"
                        onClick={() => handleQuickLogin(admin)}
                        className="w-full p-3 text-left rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 backdrop-blur-md transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                            ADM
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-200">
                              {admin.nama}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Username: <span className="font-mono-code font-bold text-slate-200">admin</span> | Role: Admin Pusat
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Masuk <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role 2: User Sekolah (From PDF Data) */}
                <div>
                  <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <School className="w-3.5 h-3.5" />
                    <span>Role 2: Pengguna Sekolah / Pengusul (Form Isian Bantuan & Berkas)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {schoolUsers.slice(0, 6).map(sch => (
                      <button
                        key={sch.id}
                        type="button"
                        onClick={() => handleQuickLogin(sch)}
                        className="p-3 text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-400/30 backdrop-blur-md transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300 truncate max-w-[200px]">
                            {sch.namaSekolah || sch.nama}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="font-semibold text-indigo-300">{sch.jenjang}</span>
                            <span>• NPSN: {sch.npsn || '-'}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Jenjang Pendidikan *
                  </label>
                  <select
                    required
                    value={regForm.jenjang}
                    onChange={(e) => setRegForm({ ...regForm, jenjang: e.target.value as JenjangType })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  >
                    {JENJANG_LIST.map(j => (
                      <option key={j} value={j} className="bg-slate-900 text-white">{j}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    NPSN Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.npsn}
                    onChange={(e) => setRegForm({ ...regForm, npsn: e.target.value })}
                    placeholder="Contoh: 69758462"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Nama Satuan Pendidikan / Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.namaSekolah}
                  onChange={(e) => setRegForm({ ...regForm, namaSekolah: e.target.value })}
                  placeholder="Contoh: SMK MIFTAHUL HUDA II JATINAGARA"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nama Kepala Sekolah / Pengusul *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.nama}
                    onChange={(e) => setRegForm({ ...regForm, nama: e.target.value })}
                    placeholder="Nama lengkap & gelar"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    No. Handphone / WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.noHp}
                    onChange={(e) => setRegForm({ ...regForm, noHp: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Kabupaten / Kota *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.kabupaten}
                    onChange={(e) => setRegForm({ ...regForm, kabupaten: e.target.value })}
                    placeholder="Kabupaten Ciamis / Tasikmalaya"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Provinsi *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.provinsi}
                    onChange={(e) => setRegForm({ ...regForm, provinsi: e.target.value })}
                    placeholder="JAWA BARAT"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Username Akun *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    placeholder="smk_namasekolah"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Kata Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Ulangi Sandi *
                  </label>
                  <input
                    type="password"
                    required
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Daftarkan Akun Sekolah Sekarang</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
