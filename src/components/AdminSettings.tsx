import React, { useState } from 'react';
import { 
  Users, 
  Palette, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  School, 
  Search, 
  Filter, 
  Check, 
  RotateCcw, 
  Sparkles, 
  UserPlus, 
  Edit, 
  Trash2, 
  Sliders, 
  Power,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User, AppThemeConfig } from '../types';
import { THEME_PRESETS, DEFAULT_THEME, isColorLight } from '../data/themePresets';
import { JENJANG_COLORS } from '../data/defaultCatalog';

interface AdminSettingsProps {
  users: User[];
  onToggleUserStatus: (userId: string) => void;
  onOpenCreateUser: () => void;
  onOpenEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onBulkSetUserStatus?: (userIds: string[], status: 'active' | 'inactive') => void;
  onSetAllSchoolsStatus?: (status: 'active' | 'inactive') => void;
  currentTheme: AppThemeConfig;
  onSaveTheme: (theme: AppThemeConfig) => void;
  onResetTheme: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  users = [],
  onToggleUserStatus,
  onOpenCreateUser,
  onOpenEditUser,
  onDeleteUser,
  onBulkSetUserStatus,
  onSetAllSchoolsStatus,
  currentTheme,
  onSaveTheme,
  onResetTheme
}) => {
  const isLightMode = currentTheme.isLightMode ?? isColorLight(currentTheme.bgColor);
  const [activeSection, setActiveSection] = useState<'active_users' | 'bg_color'>('active_users');
  
  // User Management Sub-State
  const [userSearch, setUserSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'inactive'>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'admin' | 'user'>('ALL');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Background Color Customization Sub-State
  const [customBgColor, setCustomBgColor] = useState(currentTheme.bgColor || '#0f172a');
  const [selectedOrbPalette, setSelectedOrbPalette] = useState<'indigo' | 'emerald' | 'cyan' | 'purple' | 'rose' | 'amber'>('indigo');
  const [themeNotification, setThemeNotification] = useState<string | null>(null);

  // User Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const schoolUsers = users.filter(u => u.role === 'user').length;
  const activeSchoolUsers = users.filter(u => u.role === 'user' && u.status === 'active').length;

  const showNotification = (msg: string, type: 'user' | 'theme') => {
    if (type === 'user') {
      setStatusNotification(msg);
      setTimeout(() => setStatusNotification(null), 3500);
    } else {
      setThemeNotification(msg);
      setTimeout(() => setThemeNotification(null), 3500);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = userSearch.toLowerCase().trim();
    const matchSearch = !q || (
      u.nama.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.namaSekolah && u.namaSekolah.toLowerCase().includes(q)) ||
      (u.npsn && u.npsn.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.kabupaten && u.kabupaten.toLowerCase().includes(q)) ||
      (u.provinsi && u.provinsi.toLowerCase().includes(q))
    );
    return matchStatus && matchRole && matchSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    if (selectedUserIds.length === 0) return;
    if (onBulkSetUserStatus) {
      onBulkSetUserStatus(selectedUserIds, status);
      showNotification(
        `Berhasil mengubah ${selectedUserIds.length} pengguna menjadi status ${status === 'active' ? 'AKTIF' : 'NONAKTIF'}.`,
        'user'
      );
      setSelectedUserIds([]);
    }
  };

  const handleActivateAllSchools = () => {
    if (window.confirm('Aktifkan seluruh akun Satuan Pendidikan agar dapat masuk sistem dan mengajukan proposal?')) {
      if (onSetAllSchoolsStatus) {
        onSetAllSchoolsStatus('active');
        showNotification('Seluruh akun Satuan Pendidikan berhasil DIAKTIFKAN.', 'user');
      }
    }
  };

  const handleDeactivateAllSchools = () => {
    if (window.confirm('Nonaktifkan sementara seluruh akun Satuan Pendidikan? (Akun admin pusat tetap aktif)')) {
      if (onSetAllSchoolsStatus) {
        onSetAllSchoolsStatus('inactive');
        showNotification('Seluruh akun Satuan Pendidikan berhasil DINONAKTIFKAN sementara.', 'user');
      }
    }
  };

  // Theme Preset Selection
  const handleApplyPreset = (preset: AppThemeConfig) => {
    onSaveTheme(preset);
    setCustomBgColor(preset.bgColor);
    showNotification(`Tema background "${preset.name}" berhasil diterapkan ke seluruh aplikasi.`, 'theme');
  };

  // Apply Custom Color
  const handleApplyCustomColor = () => {
    const orbMap = {
      indigo: {
        orb1: 'rgba(99, 102, 241, 0.25)',
        orb2: 'rgba(16, 185, 129, 0.20)',
        orb3: 'rgba(6, 182, 212, 0.15)'
      },
      emerald: {
        orb1: 'rgba(16, 185, 129, 0.28)',
        orb2: 'rgba(20, 184, 166, 0.22)',
        orb3: 'rgba(52, 211, 153, 0.18)'
      },
      cyan: {
        orb1: 'rgba(6, 182, 212, 0.28)',
        orb2: 'rgba(59, 130, 246, 0.22)',
        orb3: 'rgba(14, 165, 233, 0.18)'
      },
      purple: {
        orb1: 'rgba(168, 85, 247, 0.26)',
        orb2: 'rgba(236, 72, 153, 0.20)',
        orb3: 'rgba(192, 132, 252, 0.18)'
      },
      rose: {
        orb1: 'rgba(244, 63, 94, 0.26)',
        orb2: 'rgba(251, 113, 133, 0.20)',
        orb3: 'rgba(245, 158, 11, 0.16)'
      },
      amber: {
        orb1: 'rgba(245, 158, 11, 0.25)',
        orb2: 'rgba(234, 88, 12, 0.20)',
        orb3: 'rgba(252, 211, 77, 0.16)'
      }
    };

    const orbs = orbMap[selectedOrbPalette];
    
    // Detect light mode accurately based on luminance
    const isLight = isColorLight(customBgColor);

    const customThemeConfig: AppThemeConfig = {
      presetId: 'custom',
      name: `Kustom (${customBgColor})`,
      bgColor: customBgColor,
      textColor: isLight ? '#0f172a' : '#f8fafc',
      ambientColor1: orbs.orb1,
      ambientColor2: orbs.orb2,
      ambientColor3: orbs.orb3,
      isLightMode: isLight
    };

    onSaveTheme(customThemeConfig);
    showNotification(`Warna background kustom "${customBgColor}" berhasil disimpan & diterapkan.`, 'theme');
  };

  const handleResetColorToDefault = () => {
    onResetTheme();
    setCustomBgColor(DEFAULT_THEME.bgColor);
    showNotification('Warna background telah dikembalikan ke standar bawaan sistem (Midnight Slate).', 'theme');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub Header & Navigation */}
      <div className={`p-5 rounded-3xl backdrop-blur-2xl border shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isLightMode 
          ? 'bg-white/90 border-slate-200/90 shadow-slate-200/50 text-slate-800' 
          : 'bg-white/5 border-white/15 text-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border ${
              isLightMode 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-heading font-bold ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}>
                Pengaturan Sistem Admin Pusat
              </h2>
              <p className={`text-xs ${
                isLightMode ? 'text-slate-600 font-medium' : 'text-slate-400'
              }`}>
                Kelola hak akses pengguna aktif dan sesuaikan tampilan warna tema background aplikasi
              </p>
            </div>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border w-full sm:w-auto ${
          isLightMode ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-900/60 border-white/10'
        }`}>
          <button
            id="btn-subtab-active-users"
            onClick={() => setActiveSection('active_users')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeSection === 'active_users'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-white/70' : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Kelola Pengguna Aktif</span>
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isLightMode ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {activeUsers}
            </span>
          </button>

          <button
            id="btn-subtab-bg-color"
            onClick={() => setActiveSection('bg_color')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeSection === 'bg_color'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : (isLightMode ? 'text-slate-600 hover:text-slate-900 hover:bg-white/70' : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <Palette className="w-4 h-4 text-sky-500" />
            <span>Warna Background</span>
            <span 
              className={`w-2.5 h-2.5 rounded-full border inline-block ml-0.5 ${
                isLightMode ? 'border-slate-400' : 'border-white/40'
              }`} 
              style={{ backgroundColor: currentTheme.bgColor }}
              title={`Warna saat ini: ${currentTheme.name}`}
            />
          </button>
        </div>
      </div>

      {/* SECTION 1: KELOLA PENGGUNA AKTIF */}
      {activeSection === 'active_users' && (
        <div className="space-y-5">
          
          {/* Status Notification Toast */}
          {statusNotification && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span className="font-medium">{statusNotification}</span>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className={`p-4 rounded-2xl border backdrop-blur-md transition-colors ${
              isLightMode 
                ? 'bg-white/90 border-slate-200/90 shadow-sm' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs font-medium ${
                isLightMode ? 'text-slate-600' : 'text-slate-400'
              }`}>
                <span>Total Akun</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}>
                {totalUsers}
              </div>
              <div className={`text-[11px] mt-0.5 ${
                isLightMode ? 'text-slate-500' : 'text-slate-400'
              }`}>Admin & Satuan Pendidikan</div>
            </div>

            <div className={`p-4 rounded-2xl border backdrop-blur-md transition-colors ${
              isLightMode 
                ? 'bg-emerald-50/90 border-emerald-200 shadow-sm' 
                : 'bg-emerald-500/10 border-emerald-500/25'
            }`}>
              <div className={`flex items-center justify-between text-xs font-medium ${
                isLightMode ? 'text-emerald-800 font-bold' : 'text-emerald-300'
              }`}>
                <span>Pengguna Aktif</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${
                isLightMode ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                {activeUsers}
              </div>
              <div className={`text-[11px] mt-0.5 ${
                isLightMode ? 'text-emerald-700 font-medium' : 'text-emerald-300/80'
              }`}>Akses login dibuka</div>
            </div>

            <div className={`p-4 rounded-2xl border backdrop-blur-md transition-colors ${
              isLightMode 
                ? 'bg-red-50/90 border-red-200 shadow-sm' 
                : 'bg-red-500/10 border-red-500/25'
            }`}>
              <div className={`flex items-center justify-between text-xs font-medium ${
                isLightMode ? 'text-red-800 font-bold' : 'text-red-300'
              }`}>
                <span>Pengguna Nonaktif</span>
                <UserX className="w-4 h-4 text-red-500" />
              </div>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${
                isLightMode ? 'text-red-700' : 'text-red-400'
              }`}>
                {inactiveUsers}
              </div>
              <div className={`text-[11px] mt-0.5 ${
                isLightMode ? 'text-red-700 font-medium' : 'text-red-300/80'
              }`}>Akses login ditutup</div>
            </div>

            <div className={`p-4 rounded-2xl border backdrop-blur-md transition-colors ${
              isLightMode 
                ? 'bg-teal-50/90 border-teal-200 shadow-sm' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className={`flex items-center justify-between text-xs font-medium ${
                isLightMode ? 'text-teal-800 font-bold' : 'text-slate-400'
              }`}>
                <span>Sekolah Aktif</span>
                <School className="w-4 h-4 text-teal-600" />
              </div>
              <div className={`text-xl sm:text-2xl font-bold mt-1 ${
                isLightMode ? 'text-teal-800' : 'text-teal-300'
              }`}>
                {activeSchoolUsers} / {schoolUsers}
              </div>
              <div className={`text-[11px] mt-0.5 ${
                isLightMode ? 'text-teal-700 font-medium' : 'text-teal-200/80'
              }`}>Satuan pendidikan terverifikasi</div>
            </div>
          </div>

          {/* Quick Actions & Filter Bar */}
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl space-y-4 backdrop-blur-2xl transition-colors ${
            isLightMode 
              ? 'bg-white/90 border-slate-200/90 shadow-slate-200/50' 
              : 'bg-white/5 border-white/15 shadow-xl'
          }`}>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  id="input-search-active-users"
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Cari pengguna berdasarkan nama, NPSN, sekolah, username, email, kabupaten..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md border ${
                    isLightMode 
                      ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-sm' 
                      : 'bg-slate-800/60 border-white/15 text-slate-100 placeholder:text-slate-500'
                  }`}
                />
                <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isLightMode ? 'text-slate-400' : 'text-slate-400'}`} />
                {userSearch && (
                  <button 
                    onClick={() => setUserSearch('')}
                    className={`absolute right-3 top-2.5 text-xs ${isLightMode ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === 'ALL'
                      ? (isLightMode ? 'bg-slate-800 text-white shadow-sm' : 'bg-white/20 text-white border border-white/30')
                      : (isLightMode ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white/5 text-slate-400 hover:text-slate-200')
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'active'
                      ? 'bg-emerald-600 text-white border border-emerald-400/40 shadow-sm'
                      : (isLightMode ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20')
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Aktif ({activeUsers})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    statusFilter === 'inactive'
                      ? 'bg-red-600 text-white border border-red-400/40 shadow-sm'
                      : (isLightMode ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20')
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Nonaktif ({inactiveUsers})</span>
                </button>
              </div>

              {/* Add User Button */}
              <button
                id="btn-settings-add-user"
                onClick={onOpenCreateUser}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98] shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Pengguna</span>
              </button>
            </div>

            {/* Mass Actions Bar */}
            <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
              isLightMode ? 'border-slate-200' : 'border-white/10'
            }`}>
              <div className={`flex items-center gap-2 ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                <span className={`font-semibold ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>Aksi Massal Satuan Pendidikan:</span>
                <button
                  onClick={handleActivateAllSchools}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    isLightMode 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300' 
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                  title="Aktifkan seluruh akun sekolah agar bisa login dan mengajukan berkas"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aktifkan Semua Sekolah</span>
                </button>
                <button
                  onClick={handleDeactivateAllSchools}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    isLightMode 
                      ? 'bg-red-100 hover:bg-red-200 text-red-800 border border-red-300' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                  }`}
                  title="Nonaktifkan sementara seluruh akun sekolah"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Nonaktifkan Semua Sekolah</span>
                </button>
              </div>

              {selectedUserIds.length > 0 && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  isLightMode 
                    ? 'bg-indigo-50 border-indigo-200' 
                    : 'bg-indigo-500/20 border-indigo-500/30'
                }`}>
                  <span className={`font-medium ${
                    isLightMode ? 'text-indigo-800' : 'text-indigo-200'
                  }`}>
                    {selectedUserIds.length} akun terpilih:
                  </span>
                  <button
                    onClick={() => handleBulkStatusChange('active')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Set Aktif</span>
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange('inactive')}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
                  >
                    <UserX className="w-3 h-3" />
                    <span>Set Nonaktif</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Active Users Table */}
          <div className={`rounded-3xl border overflow-hidden backdrop-blur-2xl shadow-xl transition-colors ${
            isLightMode 
              ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50' 
              : 'bg-white/5 border-white/15 shadow-2xl'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`font-semibold border-b ${
                    isLightMode 
                      ? 'bg-slate-100 text-slate-700 border-slate-200' 
                      : 'bg-white/10 text-slate-200 border-white/10'
                  }`}>
                    <th className="py-3.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredUsers.length}
                        onChange={handleSelectAll}
                        className="rounded accent-indigo-600 cursor-pointer"
                        title="Pilih Semua"
                      />
                    </th>
                    <th className="py-3.5 px-3">No</th>
                    <th className="py-3.5 px-4">Satuan Pendidikan / Nama Pengguna</th>
                    <th className="py-3.5 px-4">Role & Akses</th>
                    <th className="py-3.5 px-4">Username & NPSN</th>
                    <th className="py-3.5 px-4">Wilayah & Kontak</th>
                    <th className="py-3.5 px-4 text-center">Status Akun</th>
                    <th className="py-3.5 px-4 text-center">Saklar Aktif</th>
                    <th className="py-3.5 px-4 text-center w-24">Kelola</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isLightMode 
                    ? 'divide-slate-200 text-slate-700' 
                    : 'divide-white/5 text-slate-200'
                }`}>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        Tidak ada data pengguna yang sesuai dengan filter atau pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <tr key={user.id} className={`transition-colors ${
                        isLightMode ? 'hover:bg-slate-50/90' : 'hover:bg-white/5'
                      }`}>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => handleToggleSelectUser(user.id)}
                            className="rounded accent-indigo-600 cursor-pointer"
                          />
                        </td>
                        <td className={`py-3 px-3 font-bold text-center ${
                          isLightMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className={`font-bold text-sm ${
                            isLightMode ? 'text-slate-900' : 'text-white'
                          }`}>{user.nama}</div>
                          {user.namaSekolah ? (
                            <div className={`text-xs font-medium ${
                              isLightMode ? 'text-indigo-600 font-semibold' : 'text-indigo-300'
                            }`}>{user.namaSekolah}</div>
                          ) : (
                            <div className={`text-[11px] italic ${
                              isLightMode ? 'text-slate-500' : 'text-slate-400'
                            }`}>Tim Administrator Pusat</div>
                          )}
                          <div className={`text-[10px] mt-0.5 ${
                            isLightMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>{user.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          {user.role === 'admin' ? (
                            <span className={`px-2.5 py-1 rounded-full border font-bold text-[11px] flex items-center gap-1 w-fit ${
                              isLightMode 
                                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}>
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                              <span>Admin Pusat</span>
                            </span>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full border font-bold text-[11px] flex items-center gap-1 w-fit ${
                              isLightMode 
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300' 
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}>
                              <School className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Sekolah</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono-code">
                          <div className={`font-bold ${
                            isLightMode ? 'text-slate-900' : 'text-slate-200'
                          }`}>{user.username}</div>
                          {user.npsn ? (
                            <div className={`text-[11px] ${
                              isLightMode ? 'text-slate-600' : 'text-slate-400'
                            }`}>NPSN: {user.npsn}</div>
                          ) : (
                            <div className={`text-[10px] ${
                              isLightMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>-</div>
                          )}
                          {user.jenjang && (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border mt-0.5 inline-block ${JENJANG_COLORS[user.jenjang]?.badge || 'bg-white/10 text-slate-200'}`}>
                              {user.jenjang}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <div className={isLightMode ? 'text-slate-700 font-medium' : 'text-slate-300'}>{user.kabupaten || '-'}, {user.provinsi || '-'}</div>
                          <div className={`text-[11px] font-mono-code mt-0.5 ${
                            isLightMode ? 'text-slate-500' : 'text-slate-400'
                          }`}>{user.noHp || '-'}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {user.status === 'active' ? (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${
                              isLightMode 
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Aktif</span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${
                              isLightMode 
                                ? 'bg-red-100 text-red-900 border-red-300' 
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              <span>Nonaktif</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {/* Interactive 1-Click Toggle Switch */}
                          <button
                            onClick={() => onToggleUserStatus(user.id)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                              isLightMode ? 'focus:ring-offset-white' : 'focus:ring-offset-slate-900'
                            } ${
                              user.status === 'active' 
                                ? 'bg-emerald-600' 
                                : (isLightMode ? 'bg-slate-300' : 'bg-slate-700')
                            }`}
                            title={user.status === 'active' ? 'Klik untuk Menonaktifkan' : 'Klik untuk Mengaktifkan'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                user.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onOpenEditUser(user)}
                              title="Edit Pengguna"
                              className={`p-1.5 rounded-xl transition-all ${
                                isLightMode 
                                  ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50' 
                                  : 'text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10'
                              }`}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteUser(user.id)}
                              title="Hapus Pengguna"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: PENGATURAN WARNA BACKGROUND APLIKASI */}
      {activeSection === 'bg_color' && (
        <div className="space-y-6">
          
          {/* Notification Toast */}
          {themeNotification && (
            <div className="p-4 bg-sky-500/15 border border-sky-500/30 rounded-2xl text-sky-300 text-xs sm:text-sm flex items-center gap-2.5 backdrop-blur-md animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-sky-400" />
              <span className="font-medium">{themeNotification}</span>
            </div>
          )}

          {/* Current Active Background Status & Interactive Live Preview Card */}
          <div className={`backdrop-blur-2xl p-6 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isLightMode 
              ? 'bg-white/90 border-slate-200/90 shadow-slate-200/50 text-slate-800' 
              : 'bg-white/5 border-white/15 shadow-xl text-slate-100'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                  isLightMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Status Warna Latar Belakang Aktif
                </span>
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-8 h-8 rounded-2xl border-2 shadow-lg shrink-0 ${
                      isLightMode ? 'border-slate-300' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: currentTheme.bgColor }}
                  />
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold font-heading ${
                      isLightMode ? 'text-slate-900' : 'text-white'
                    }`}>
                      {currentTheme.name}
                    </h3>
                    <p className={`text-xs font-mono-code ${
                      isLightMode ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}>
                      Kode Hex: {currentTheme.bgColor} • Mode: {isLightMode ? 'Terang (Light)' : 'Gelap (Dark)'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetColorToDefault}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] ${
                    isLightMode 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                  }`}
                  title="Kembalikan ke warna latar awal (Midnight Slate)"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  <span>Reset Bawaan</span>
                </button>
              </div>
            </div>

            {/* Live Mini Preview Box */}
            <div 
              className={`p-5 rounded-2xl border relative overflow-hidden transition-all duration-500 shadow-inner ${
                isLightMode ? 'border-slate-300 bg-white/40' : 'border-white/15'
              }`}
              style={{ backgroundColor: currentTheme.bgColor }}
            >
              {/* Simulated Ambient Orbs inside mini preview */}
              <div 
                className="absolute top-[-30px] left-[-30px] w-36 h-36 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: currentTheme.ambientColor1 }}
              />
              <div 
                className="absolute bottom-[-30px] right-[-30px] w-40 h-40 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: currentTheme.ambientColor2 }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isLightMode 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white/10 border-white/20 text-indigo-300'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>Pratinjau Langsung Aplikasi</span>
                  </div>
                  <h4 className={`text-sm sm:text-base font-bold font-heading ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}>
                    SIM- REVIT ASPIRASI 2027
                  </h4>
                  <p className={`text-xs max-w-md ${
                    isLightMode ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Ini adalah simulasi visual bagaimana warna latar belakang dan pendaran cahaya ambient tampil pada sistem Anda.
                  </p>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-xl border backdrop-blur-md ${
                  isLightMode ? 'bg-white/80 border-slate-300 shadow-xs' : 'bg-white/10 border-white/15'
                }`}>
                  <div className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">
                    Tombol Aksi
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-medium border ${
                    isLightMode ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-white/5 text-slate-300 border-white/10'
                  }`}>
                    Kartu Data
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 8 Curated Theme Presets */}
          <div className={`backdrop-blur-2xl p-6 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isLightMode 
              ? 'bg-white/90 border-slate-200/90 shadow-slate-200/50' 
              : 'bg-white/5 border-white/15'
          }`}>
            <div>
              <h3 className={`text-base font-bold font-heading ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}>
                Palet Warna Pilihan (Preset Tematik)
              </h3>
              <p className={`text-xs ${
                isLightMode ? 'text-slate-600 font-medium' : 'text-slate-400'
              }`}>
                Pilih palet warna yang telah dioptimalkan secara estetika dengan rasio kontras tinggi dan kenyamanan mata:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {THEME_PRESETS.map((preset) => {
                const isActive = currentTheme.bgColor.toLowerCase() === preset.bgColor.toLowerCase();
                return (
                  <div
                    key={preset.presetId}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative group overflow-hidden ${
                      isActive
                        ? (isLightMode 
                            ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-500/20' 
                            : 'border-indigo-400 bg-white/10 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30')
                        : (isLightMode 
                            ? 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 shadow-xs' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20')
                    }`}
                  >
                    {/* Simulated Ambient Orb */}
                    <div 
                      className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: preset.ambientColor1 }}
                    />

                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className={`w-7 h-7 rounded-xl border-2 shadow-md shrink-0 flex items-center justify-center ${
                            isLightMode ? 'border-slate-300' : 'border-white/20'
                          }`}
                          style={{ backgroundColor: preset.bgColor }}
                        >
                          {isActive && <Check className={`w-3.5 h-3.5 ${preset.isLightMode ? 'text-slate-900' : 'text-white'} drop-shadow`} />}
                        </div>
                        <div>
                          <div className={`font-bold text-xs line-clamp-1 ${
                            isLightMode ? 'text-slate-900' : 'text-white'
                          }`}>{preset.name}</div>
                          <div className={`text-[10px] font-mono-code ${
                            isLightMode ? 'text-slate-600 font-medium' : 'text-slate-400'
                          }`}>{preset.bgColor}</div>
                        </div>
                      </div>

                      {isActive && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 border ${
                          isLightMode 
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-800' 
                            : 'bg-indigo-500/30 border-indigo-400/40 text-indigo-300'
                        }`}>
                          Aktif
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.ambientColor1 }} title="Ambient Orb 1" />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.ambientColor2 }} title="Ambient Orb 2" />
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.ambientColor3 }} title="Ambient Orb 3" />
                      <span className={`text-[10px] ml-auto font-medium ${
                        isLightMode ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {preset.isLightMode ? 'Mode Terang' : 'Mode Gelap'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(preset);
                      }}
                      className={`w-full mt-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : (isLightMode 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' 
                              : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10')
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Diterapkan</span>
                        </>
                      ) : (
                        <span>Pilih Tema Ini</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Background Color Picker */}
          <div className={`backdrop-blur-2xl p-6 rounded-3xl border shadow-xl space-y-5 transition-colors ${
            isLightMode 
              ? 'bg-white/90 border-slate-200/90 shadow-slate-200/50' 
              : 'bg-white/5 border-white/15'
          }`}>
            <div>
              <h3 className={`text-base font-bold font-heading ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}>
                Kustomisasi Warna Latar Manual
              </h3>
              <p className={`text-xs ${
                isLightMode ? 'text-slate-600 font-medium' : 'text-slate-400'
              }`}>
                Pilih warna latar belakang kustom menggunakan pemilih warna (Color Picker) atau ketik kode HEX secara bebas:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Color Input */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isLightMode ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Pemilih Warna Latar (Background Color)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="input-custom-bg-color-picker"
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      className={`w-14 h-12 rounded-2xl cursor-pointer bg-transparent border-2 p-1 shrink-0 ${
                        isLightMode ? 'border-slate-300' : 'border-white/20'
                      }`}
                    />
                    <div className="flex-1">
                      <input
                        id="input-custom-bg-color-hex"
                        type="text"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        placeholder="#0f172a"
                        maxLength={7}
                        className={`w-full px-4 py-2.5 rounded-2xl font-mono-code text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase border ${
                          isLightMode 
                            ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-sm' 
                            : 'bg-slate-800/60 border-white/15 text-slate-100 placeholder:text-slate-500'
                        }`}
                      />
                      <span className={`text-[10px] mt-1 block ${
                        isLightMode ? 'text-slate-500 font-medium' : 'text-slate-400'
                      }`}>
                        Contoh: #f1f5f9 (Putih Bersih), #0f172a (Navy), #030712 (Hitam), #032019 (Hijau Tua)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Swatches */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isLightMode ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Pilihan Cepat Warna Populer
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '#f1f5f9', '#f8fafc', '#ffffff', '#e2e8f0', 
                      '#0f172a', '#030712', '#032019', '#08172c', 
                      '#160a24', '#18181b', '#220b13', '#0f2027'
                    ].map((swatch) => (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => setCustomBgColor(swatch)}
                        className={`w-8 h-8 rounded-xl border-2 transition-all active:scale-95 ${
                          customBgColor.toLowerCase() === swatch.toLowerCase()
                            ? 'border-indigo-500 scale-110 shadow-lg shadow-indigo-500/30'
                            : (isLightMode ? 'border-slate-300 hover:border-slate-400' : 'border-white/20 hover:border-white/40')
                        }`}
                        style={{ backgroundColor: swatch }}
                        title={swatch}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Ambient Glow Orb Scheme */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isLightMode ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    Pendaran Cahaya Ambient (Glow Effect)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['indigo', 'emerald', 'cyan', 'purple', 'rose', 'amber'] as const).map((scheme) => (
                      <button
                        key={scheme}
                        type="button"
                        onClick={() => setSelectedOrbPalette(scheme)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
                          selectedOrbPalette === scheme
                            ? (isLightMode 
                                ? 'bg-indigo-100 border-indigo-500 text-indigo-900 font-bold shadow-sm' 
                                : 'bg-indigo-600/30 border-indigo-400 text-white font-bold shadow-sm')
                            : (isLightMode 
                                ? 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10')
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          scheme === 'indigo' ? 'bg-indigo-400' :
                          scheme === 'emerald' ? 'bg-emerald-400' :
                          scheme === 'cyan' ? 'bg-cyan-400' :
                          scheme === 'purple' ? 'bg-purple-400' :
                          scheme === 'rose' ? 'bg-rose-400' : 'bg-amber-400'
                        }`} />
                        <span>{scheme}</span>
                      </button>
                    ))}
                  </div>
                  <span className={`text-[10px] mt-1.5 block ${
                    isLightMode ? 'text-slate-500 font-medium' : 'text-slate-400'
                  }`}>
                    Cahaya ambient memberikan efek kedalaman frosted-glass pada latar belakang.
                  </span>
                </div>

                {/* Apply Button */}
                <div className="pt-2">
                  <button
                    id="btn-apply-custom-bg"
                    type="button"
                    onClick={handleApplyCustomColor}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Terapkan & Simpan Warna Latar Ini</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
