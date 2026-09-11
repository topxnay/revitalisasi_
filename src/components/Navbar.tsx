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
  isLightMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  onSwitchRole,
  onResetData,
  activeView,
  onNavigate,
  onOpenUserManagement,
  isLightMode = false
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-2xl transition-colors duration-300 ${
      isLightMode 
        ? 'bg-white/85 border-b border-slate-200/90 shadow-md text-slate-800' 
        : 'bg-slate-900/60 border-b border-white/10 shadow-2xl text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & App Title */}
          <div 
            id="nav-brand"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-all ${
              isLightMode ? 'bg-indigo-50 border border-indigo-200' : 'bg-white/10 backdrop-blur-lg border border-white/20'
            }`}>
              <div className="w-6 h-6 bg-indigo-600 rounded-md rotate-45 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Building2 className="w-3.5 h-3.5 text-white -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-heading font-extrabold text-base sm:text-lg lg:text-xl tracking-tight whitespace-nowrap ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`}>
                  SIM- REVIT ASPIRASI
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold rounded-full backdrop-blur-xs">
                  T.A. 2027
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] font-medium line-clamp-1 ${
                isLightMode ? 'text-indigo-700' : 'text-indigo-200/80'
              }`}>
                (Pengajuan Rehab, Renov dan RKB -ASPIRASI)
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
                  ? (isLightMode ? 'bg-slate-200 text-slate-900 border border-slate-300 font-bold shadow-sm' : 'bg-white/15 text-white border border-white/20 shadow-inner') 
                  : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent' : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent')
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
                      ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/20' 
                      : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent' : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent')
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Panel Verifikasi</span>
                </button>

                {onOpenUserManagement && (
                  <button
                    id="nav-manage-user-btn"
                    onClick={onOpenUserManagement}
                    className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 border border-transparent ${
                      isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-500" />
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
                    ? 'bg-emerald-600 text-white border border-emerald-400/40 shadow-lg shadow-emerald-600/20' 
                    : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent' : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent')
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
                <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-md ${
                  isLightMode ? 'bg-white/90 border border-slate-200 shadow-sm' : 'bg-white/5 border border-white/10'
                }`}>
                  {currentUser.role === 'admin' ? (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-500 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 flex items-center justify-center">
                      <School className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className={`text-xs font-bold flex items-center gap-1.5 leading-tight ${
                      isLightMode ? 'text-slate-900' : 'text-white'
                    }`}>
                      {currentUser.role === 'admin' ? 'TIM VERIFIKATOR' : (currentUser.namaSekolah || currentUser.nama)}
                      <span className={`text-[10px] uppercase px-2 py-0.2 rounded-full font-bold border ${
                        currentUser.role === 'admin' 
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}>
                        {currentUser.role === 'admin' ? 'Admin Pusat' : currentUser.jenjang || 'Sekolah'}
                      </span>
                    </div>
                    <div className={`text-[11px] truncate max-w-[150px] ${
                      isLightMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {currentUser.npsn ? `NPSN: ${currentUser.npsn}` : currentUser.email}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Keluar Akun"
                  className={`p-2.5 rounded-2xl transition-all ${
                    isLightMode 
                      ? 'text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200' 
                      : 'text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20'
                  }`}
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
              className={`p-2.5 rounded-2xl transition-all ${
                isLightMode 
                  ? 'text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
