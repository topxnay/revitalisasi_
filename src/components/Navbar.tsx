import React from 'react';
import { 
  Building2, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  School, 
  RotateCcw, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers,
  Users
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: (role?: 'admin' | 'user') => void;
  onLogout: () => void;
  onSwitchRole: (userRole: 'admin' | 'user') => void;
  onResetData: () => void;
  activeView: string;
  onNavigate: (view: 'landing' | 'admin' | 'user' | 'form') => void;
  onOpenUserManagement?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onSwitchRole,
  onResetData,
  activeView,
  onNavigate,
  onOpenUserManagement
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & App Title */}
          <div 
            id="nav-brand"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-all">
              <div className="w-6 h-6 bg-indigo-500 rounded-md rotate-45 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Building2 className="w-3.5 h-3.5 text-white -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  SIM-REVIT
                </span>
                <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-full backdrop-blur-xs">
                  T.A. 2027
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sistem Informasi Pengajuan Revitalisasi Sarpras (7 Jenjang)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              id="nav-beranda-btn"
              onClick={() => onNavigate('landing')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                activeView === 'landing' 
                  ? 'bg-white/15 text-white border border-white/20 shadow-inner' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Beranda & Info
            </button>

            {currentUser?.role === 'admin' && (
              <>
                <button
                  id="nav-admin-dash-btn"
                  onClick={() => onNavigate('admin')}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                    activeView === 'admin' 
                      ? 'bg-indigo-600/80 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Panel Verifikasi</span>
                </button>

                {onOpenUserManagement && (
                  <button
                    id="nav-manage-user-btn"
                    onClick={onOpenUserManagement}
                    className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent transition-all flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Kelola Pengguna</span>
                  </button>
                )}
              </>
            )}

            {currentUser?.role === 'user' && (
              <button
                id="nav-user-dash-btn"
                onClick={() => onNavigate('user')}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  activeView === 'user' || activeView === 'form'
                    ? 'bg-emerald-600/80 text-white border border-emerald-400/40 shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <School className="w-4 h-4 text-emerald-300" />
                <span>Dashboard Sekolah</span>
              </button>
            )}
          </nav>

          {/* User Status / Action Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Frosted Role Badge Card */}
                <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  {currentUser.role === 'admin' ? (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                      <School className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
                      {currentUser.role === 'admin' ? 'TIM VERIFIKATOR' : (currentUser.namaSekolah || currentUser.nama)}
                      <span className={`text-[10px] uppercase px-2 py-0.2 rounded-full font-bold border ${
                        currentUser.role === 'admin' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {currentUser.role === 'admin' ? 'Admin Pusat' : currentUser.jenjang || 'Sekolah'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {currentUser.npsn ? `NPSN: ${currentUser.npsn}` : currentUser.email}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Keluar Akun"
                  className="p-2.5 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-2xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-open-login"
                  onClick={() => onOpenLogin()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Masuk</span>
                </button>
              </div>
            )}

            {/* Reset Data Button */}
            <button
              id="btn-reset-data"
              onClick={onResetData}
              title="Reset Data Master Sistem"
              className="p-2.5 text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
