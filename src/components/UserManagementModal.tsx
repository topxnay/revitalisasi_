import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  School, 
  CheckCircle, 
  AlertCircle,
  KeyRound,
  Trash2,
  Edit,
  Power
} from 'lucide-react';
import { User, UserRole, JenjangType } from '../types';
import { JENJANG_LIST } from '../data/defaultCatalog';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveUser: (user: User) => void;
  editingUser: User | null;
  existingUsers?: User[];
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  onSaveUser,
  editingUser,
  existingUsers = []
}) => {
  const safeUsers = Array.isArray(existingUsers) ? existingUsers : [];
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    nama: '',
    role: 'user' as UserRole,
    email: '',
    noHp: '',
    namaSekolah: '',
    npsn: '',
    jenjang: 'SMK' as JenjangType,
    kabupaten: '',
    provinsi: 'JAWA BARAT',
    status: 'active' as 'active' | 'inactive'
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        id: editingUser.id,
        username: editingUser.username,
        password: editingUser.password || '123456',
        nama: editingUser.nama,
        role: editingUser.role,
        email: editingUser.email || '',
        noHp: editingUser.noHp || '',
        namaSekolah: editingUser.namaSekolah || '',
        npsn: editingUser.npsn || '',
        jenjang: editingUser.jenjang || 'SMK',
        kabupaten: editingUser.kabupaten || '',
        provinsi: editingUser.provinsi || 'JAWA BARAT',
        status: editingUser.status
      });
    } else {
      setFormData({
        id: `usr_${Date.now()}`,
        username: '',
        password: 'smk2027',
        nama: '',
        role: 'user',
        email: '',
        noHp: '',
        namaSekolah: '',
        npsn: '',
        jenjang: 'SMK',
        kabupaten: '',
        provinsi: 'JAWA BARAT',
        status: 'active'
      });
    }
    setErrorMessage('');
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check duplicate username
    const duplicate = safeUsers.find(
      u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.id !== formData.id
    );

    if (duplicate) {
      setErrorMessage(`Username "${formData.username}" sudah dipakai pengguna lain.`);
      return;
    }

    if (formData.role === 'user' && formData.npsn) {
      const duplicateNpsn = safeUsers.find(
        u => u.npsn === formData.npsn.trim() && u.id !== formData.id
      );
      if (duplicateNpsn) {
        setErrorMessage(`NPSN "${formData.npsn}" sudah terdaftar pada akun ${duplicateNpsn.namaSekolah || duplicateNpsn.username}.`);
        return;
      }
    }

    const savedUser: User = {
      id: formData.id || `usr_${Date.now()}`,
      username: formData.username.trim(),
      password: formData.password || '123456',
      nama: formData.nama,
      role: formData.role,
      email: formData.email,
      noHp: formData.noHp,
      namaSekolah: formData.role === 'user' ? formData.namaSekolah : undefined,
      npsn: formData.role === 'user' ? formData.npsn : undefined,
      jenjang: formData.role === 'user' ? formData.jenjang : undefined,
      kabupaten: formData.kabupaten,
      provinsi: formData.provinsi,
      status: formData.status,
      createdAt: editingUser?.createdAt || new Date().toISOString()
    };

    onSaveUser(savedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Aplikasi Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                Pilih Role Admin atau Role 2: User Pengusul Sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/25 text-red-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Role Pengguna Aplikasi *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all backdrop-blur-md ${
                  formData.role === 'admin'
                    ? 'border-amber-400/50 bg-amber-500/20 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Role 1: Admin Pusat</div>
                  <div className="text-[11px] text-slate-400">Akses Verifikasi & Export Excel</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all backdrop-blur-md ${
                  formData.role === 'user'
                    ? 'border-indigo-400/50 bg-indigo-500/20 text-white shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Role 2: User Sekolah</div>
                  <div className="text-[11px] text-slate-400">Form Isian Bantuan & Link Berkas</div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional school fields if Role is User */}
          {formData.role === 'user' && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 backdrop-blur-md">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Informasi Satuan Pendidikan (Sekolah)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jenjang Pendidikan *
                  </label>
                  <select
                    required
                    value={formData.jenjang}
                    onChange={(e) => setFormData({ ...formData, jenjang: e.target.value as JenjangType })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  >
                    {JENJANG_LIST.map(j => (
                      <option key={j} value={j} className="bg-slate-900 text-white">{j}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NPSN Sekolah *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.npsn}
                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    placeholder="Contoh: 20263295"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Satuan Pendidikan / Sekolah *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                  placeholder="Contoh: SMK MIFTAHUL HUDA II JATINAGARA"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>
            </div>
          )}

          {/* User Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Nama Lengkap / Penanggung Jawab *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Sobirin, S.Pd., M.Pd."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                No. HP / WhatsApp Aktif *
              </label>
              <input
                type="tel"
                required
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                placeholder="085223053315"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Kabupaten / Kota *
              </label>
              <input
                type="text"
                required
                value={formData.kabupaten}
                onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                placeholder="Kabupaten Ciamis / Tasikmalaya"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Provinsi *
              </label>
              <input
                type="text"
                required
                value={formData.provinsi}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                placeholder="JAWA BARAT"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>
          </div>

          {/* Account Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Username Akun *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="smk_miftahul"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password / Kata Sandi *
              </label>
              <input
                type="text"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="smk2027"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Status Akun
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              >
                <option value="active" className="bg-slate-900 text-white">Aktif (Bisa Login)</option>
                <option value="inactive" className="bg-slate-900 text-white">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{editingUser ? 'Simpan Perubahan User' : 'Tambahkan Pengguna'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
