import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  Download, 
  UserPlus, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Building2, 
  School, 
  Layers, 
  FileText, 
  MapPin,
  Sparkles,
  ChevronDown,
  RotateCcw,
  DollarSign,
  Check,
  X,
  Settings
} from 'lucide-react';
import { 
  PengajuanRevitalisasi, 
  User, 
  JenjangType, 
  StatusPengajuan,
  BantuanCatalogItem,
  AppThemeConfig 
} from '../types';
import { 
  JENJANG_LIST, 
  JENJANG_COLORS, 
  STANDARD_CATALOG 
} from '../data/defaultCatalog';
import { DEFAULT_THEME } from '../data/themePresets';
import { 
  formatRupiah, 
  exportRekapitulasiExcel, 
  exportSingleProposalRAB 
} from '../utils/excelExport';
import { CatalogItemModal } from './CatalogItemModal';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  currentUser: User;
  proposals: PengajuanRevitalisasi[];
  users: User[];
  catalog?: BantuanCatalogItem[];
  theme?: AppThemeConfig;
  onSaveTheme?: (theme: AppThemeConfig) => void;
  onResetTheme?: () => void;
  onBulkSetUserStatus?: (userIds: string[], status: 'active' | 'inactive') => void;
  onSetAllSchoolsStatus?: (status: 'active' | 'inactive') => void;
  onSaveCatalogItem?: (item: BantuanCatalogItem) => void;
  onDeleteCatalogItem?: (itemId: string) => void;
  onResetCatalog?: () => void;
  onOpenCreateUser: () => void;
  onOpenEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onOpenVerification: (proposal: PengajuanRevitalisasi) => void;
  onOpenDetail: (proposal: PengajuanRevitalisasi) => void;
  onOpenPrintReceipt: (proposal: PengajuanRevitalisasi) => void;
  onOpenEditProposal: (proposal: PengajuanRevitalisasi) => void;
  onDeleteProposal: (proposalId: string) => void;
  onOpenCreateProposal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  proposals = [],
  users = [],
  catalog = STANDARD_CATALOG,
  theme = DEFAULT_THEME,
  onSaveTheme,
  onResetTheme,
  onBulkSetUserStatus,
  onSetAllSchoolsStatus,
  onSaveCatalogItem,
  onDeleteCatalogItem,
  onResetCatalog,
  onOpenCreateUser,
  onOpenEditUser,
  onDeleteUser,
  onToggleUserStatus,
  onOpenVerification,
  onOpenDetail,
  onOpenPrintReceipt,
  onOpenEditProposal,
  onDeleteProposal,
  onOpenCreateProposal
}) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'users' | 'analytics' | 'catalog' | 'settings'>('proposals');
  const [filterJenjang, setFilterJenjang] = useState<JenjangType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<StatusPengajuan | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Catalog State
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'ALL' | 'ruang_utama' | 'ruang_penunjang' | 'sarana_utilitas' | 'rehab'>('ALL');
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState<BantuanCatalogItem | null>(null);
  const [inlineEditNominalId, setInlineEditNominalId] = useState<string | null>(null);
  const [inlineEditNominalValue, setInlineEditNominalValue] = useState<number>(0);

  // Stats calculation
  const totalSekolah = proposals.length;
  const totalDana = proposals.reduce((acc, p) => acc + p.nilaiPengajuan, 0);
  const totalDisetujui = proposals.filter(p => p.statusPengajuan === 'disetujui').length;
  const totalDiverifikasi = proposals.filter(p => p.statusPengajuan === 'diverifikasi').length;

  // Filtered Proposals
  const filteredProposals = proposals.filter(p => {
    const matchJenjang = filterJenjang === 'ALL' || p.jenjang === filterJenjang;
    const matchStatus = filterStatus === 'ALL' || p.statusPengajuan === filterStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || 
      p.namaSekolah.toLowerCase().includes(q) ||
      p.npsn.toLowerCase().includes(q) ||
      p.kabupaten.toLowerCase().includes(q) ||
      p.nomorRegistrasi.toLowerCase().includes(q) ||
      p.namaKepalaSekolah.toLowerCase().includes(q);
    return matchJenjang && matchStatus && matchSearch;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const q = userSearchQuery.trim().toLowerCase();
    return !q || 
      u.nama.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.namaSekolah && u.namaSekolah.toLowerCase().includes(q)) ||
      (u.npsn && u.npsn.includes(q)) ||
      u.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Banner & Fast Excel Actions - Frosted Glass Card */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Panel Verifikator & Administrator Pusat T.A. 2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Rekapitulasi & Verifikasi Pengajuan Revitalisasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Pengelolaan seluruh usulan sarpras sekolah 7 jenjang, manajemen akun pengguna, dan ekspor excel resmi 18 kolom.
            </p>
          </div>

          {/* Excel Export Buttons Box */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-export-excel-full"
              onClick={() => exportRekapitulasiExcel(proposals, undefined, filterJenjang === 'ALL' ? undefined : filterJenjang)}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (18 Kolom)</span>
            </button>

            <button
              id="btn-add-user-top"
              onClick={onOpenCreateUser}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>+ Tambah Pengguna</span>
            </button>

            <button
              id="btn-add-proposal-top"
              onClick={onOpenCreateProposal}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Input Usulan Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium">Total Usulan Sekolah</div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1">
              {totalSekolah} Sekolah
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Semua 7 Jenjang</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium">Total Usulan Anggaran</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 font-mono-code truncate">
              {formatRupiah(totalDana)}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">RAB T.A. 2027</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium">Disetujui / Lolos</div>
            <div className="text-xl sm:text-2xl font-bold text-teal-300 mt-1">
              {totalDisetujui} Sekolah
            </div>
            <div className="text-[11px] text-teal-200/80 mt-0.5">Siap Ditetapkan</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-xs text-slate-400 font-medium">Dalam Verifikasi</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">
              {totalDiverifikasi} Sekolah
            </div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Peninjauan Berkas Cloud</div>
          </div>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          id="tab-data-proposals"
          onClick={() => setActiveTab('proposals')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md ${
            activeTab === 'proposals'
              ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Data Usulan Revitalisasi ({proposals.length})</span>
        </button>

        <button
          id="tab-user-management"
          onClick={() => setActiveTab('users')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Manajemen Pengguna ({users.length})</span>
        </button>

        <button
          id="tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span>Rekapitulasi per Jenjang</span>
        </button>

        <button
          id="tab-catalog"
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md ${
            activeTab === 'catalog'
              ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>Katalog Standar Biaya</span>
        </button>

        <button
          id="tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-sky-400" />
          <span>Pengaturan</span>
          <span 
            className="w-2 h-2 rounded-full border border-white/50" 
            style={{ backgroundColor: theme.bgColor }} 
            title="Warna Latar Aktif"
          />
        </button>
      </div>


      {/* TAB 1: DATA USULAN REVITALISASI (18 KOLOM TABLE) */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          
          {/* Filters and Search Bar */}
          <div className="bg-white/5 backdrop-blur-2xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-slate-100">
            
            <div className="relative flex-1">
              <input
                id="input-search-proposals-admin"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sekolah, NPSN, nomor registrasi, kabupaten, nama kepsek..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Jenjang */}
              <select
                id="select-filter-jenjang"
                value={filterJenjang}
                onChange={(e) => setFilterJenjang(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              >
                <option value="ALL" className="bg-slate-900 text-white">Semua Jenjang</option>
                {JENJANG_LIST.map(j => (
                  <option key={j} value={j} className="bg-slate-900 text-white">{j}</option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                id="select-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              >
                <option value="ALL" className="bg-slate-900 text-white">Semua Status</option>
                <option value="disetujui" className="bg-slate-900 text-white">Disetujui</option>
                <option value="diverifikasi" className="bg-slate-900 text-white">Diverifikasi</option>
                <option value="diajukan" className="bg-slate-900 text-white">Diajukan</option>
                <option value="perlu_perbaikan" className="bg-slate-900 text-white">Perlu Perbaikan</option>
                <option value="draft" className="bg-slate-900 text-white">Draft</option>
                <option value="ditolak" className="bg-slate-900 text-white">Ditolak</option>
              </select>

              <button
                onClick={() => exportRekapitulasiExcel(filteredProposals, `Rekap_Revitalisasi_${filterJenjang}.xlsx`, filterJenjang === 'ALL' ? undefined : filterJenjang)}
                className="px-3.5 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Ekspor baris terfilter ke Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Excel Filter</span>
              </button>
            </div>

          </div>

          {/* 18-Column Interactive Table */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 text-slate-300">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Menampilkan {filteredProposals.length} Data Usulan Revitalisasi (18 Kolom Lengkap)
              </div>
              <span className="text-[11px] text-slate-400">
                Geser ke kanan untuk melihat seluruh kolom dokumen
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1700px]">
                <thead>
                  <tr className="bg-white/10 text-slate-200 font-semibold divide-x divide-white/10 border-b border-white/10">
                    <th className="py-3 px-3 w-12 text-center">No (1)</th>
                    <th className="py-3 px-3 w-64">Nama Sekolah (2)</th>
                    <th className="py-3 px-3 w-28">NPSN (3)</th>
                    <th className="py-3 px-3 w-56">Alamat Sekolah (4)</th>
                    <th className="py-3 px-3 w-32">Kecamatan (5)</th>
                    <th className="py-3 px-3 w-36">Kabupaten (6)</th>
                    <th className="py-3 px-3 w-28">Provinsi (7)</th>
                    <th className="py-3 px-3 w-40">Nama Kepsek (8)</th>
                    <th className="py-3 px-3 w-32">No HP Kepsek (9)</th>
                    <th className="py-3 px-3 w-28 text-center">Murid (10)</th>
                    <th className="py-3 px-3 w-64">Pengajuan Bantuan (11)</th>
                    <th className="py-3 px-3 w-36 text-right">Nilai Pengajuan (12)</th>
                    <th className="py-3 px-3 w-28 text-center">Lahan Kosong (13)</th>
                    <th className="py-3 px-3 w-36">Status Lahan (14)</th>
                    <th className="py-3 px-3 w-32 text-center">Sertifikat (15)</th>
                    <th className="py-3 px-3 w-32 text-center">Siteplan (16)</th>
                    <th className="py-3 px-3 w-32 text-center">Google Map (17)</th>
                    <th className="py-3 px-3 w-32 text-center">Proposal PDF (18)</th>
                    <th className="py-3 px-3 w-36 text-center sticky right-0 bg-slate-900/95 backdrop-blur-md z-10">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredProposals.length === 0 ? (
                    <tr>
                      <td colSpan={19} className="py-12 text-center text-slate-400">
                        Tidak ada data usulan yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredProposals.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-white/5 divide-x divide-white/5 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${JENJANG_COLORS[item.jenjang]?.badge || 'bg-white/10 text-slate-200'}`}>
                              {item.jenjang}
                            </span>
                            <span className="truncate max-w-[220px]" title={item.namaSekolah}>
                              {item.namaSekolah}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono-code">{item.nomorRegistrasi}</div>
                        </td>
                        <td className="py-3 px-3 font-mono-code font-bold text-slate-300">{item.npsn}</td>
                        <td className="py-3 px-3 text-slate-300 truncate max-w-[220px]" title={item.alamatSekolah}>
                          {item.alamatSekolah}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{item.kecamatan}</td>
                        <td className="py-3 px-3 text-slate-300 font-medium">{item.kabupaten}</td>
                        <td className="py-3 px-3 text-slate-400">{item.provinsi}</td>
                        <td className="py-3 px-3 text-white font-medium truncate max-w-[160px]" title={item.namaKepalaSekolah}>
                          {item.namaKepalaSekolah}
                        </td>
                        <td className="py-3 px-3 font-mono-code text-slate-400">{item.noHpKepalaSekolah}</td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-300">{item.jumlahMurid} Siswa</td>
                        <td className="py-3 px-3 text-slate-200 text-[11px] leading-relaxed truncate max-w-[250px]" title={item.pengajuanBantuan}>
                          {item.pengajuanBantuan}
                        </td>
                        <td className="py-3 px-3 text-right font-mono-code font-bold text-emerald-400">
                          {formatRupiah(item.nilaiPengajuan)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-300">{item.luasLahanKosong} m²</td>
                        <td className="py-3 px-3 text-slate-300 truncate max-w-[150px]" title={item.statusLahan}>{item.statusLahan}</td>
                        
                        {/* 4 Cloud Links */}
                        <td className="py-3 px-3 text-center">
                          {item.linkSertifikat ? (
                            <a href={item.linkSertifikat} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1">
                              <span>Drive</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : <span className="text-slate-500">-</span>}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.linkSiteplan ? (
                            <a href={item.linkSiteplan} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300 font-bold text-[11px] flex items-center justify-center gap-1">
                              <span>Siteplan</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : <span className="text-slate-500">-</span>}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.linkGoogleMap ? (
                            <a href={item.linkGoogleMap} target="_blank" rel="noreferrer" className="text-rose-400 hover:text-rose-300 font-bold text-[11px] flex items-center justify-center gap-1">
                              <span>Maps</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : <span className="text-slate-500">-</span>}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.linkProposalPdf ? (
                            <a href={item.linkProposalPdf} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] flex items-center justify-center gap-1">
                              <span>PDF</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : <span className="text-slate-500">-</span>}
                        </td>

                        {/* Action buttons (Sticky right) */}
                        <td className="py-3 px-3 text-center sticky right-0 bg-slate-900/90 backdrop-blur-md shadow-md border-l border-white/10">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onOpenVerification(item)}
                              title="Verifikasi Status Usulan"
                              className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl transition-all"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onOpenDetail(item)}
                              title="Lihat Detail Lengkap"
                              className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition-all"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onOpenPrintReceipt(item)}
                              title="Cetak Lembar Tanda Terima"
                              className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-all"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onOpenEditProposal(item)}
                              title="Edit Usulan"
                              className="p-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProposal(item.id)}
                              title="Hapus Usulan"
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
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


      {/* TAB 2: MANAJEMEN PENGGUNA (ROLE 1 & ROLE 2) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-100">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Manajemen Pengguna Aplikasi (Role Admin & Role Pengguna Sekolah)
              </h3>
              <p className="text-xs text-slate-400">
                Administrator dapat mendaftarkan akun baru, mengatur role, reset password, dan status akses.
              </p>
            </div>

            <button
              onClick={onOpenCreateUser}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Cari user berdasarkan nama, username, NPSN, nama sekolah, atau email..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Users Table */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                    <th className="py-3.5 px-4">No</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Nama Lengkap & Satuan Pendidikan</th>
                    <th className="py-3.5 px-4">Username & Sandi</th>
                    <th className="py-3.5 px-4">NPSN & Jenjang</th>
                    <th className="py-3.5 px-4">Kontak / No. HP</th>
                    <th className="py-3.5 px-4">Wilayah</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        {user.role === 'admin' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Role 1: Admin</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <School className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Role 2: User</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{user.nama}</div>
                        {user.namaSekolah && (
                          <div className="text-[11px] text-slate-300 font-medium">{user.namaSekolah}</div>
                        )}
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono-code">
                        <div className="font-bold text-slate-200">{user.username}</div>
                        <div className="text-[10px] text-slate-400">Sandi: {user.password || '••••••••'}</div>
                      </td>
                      <td className="py-3 px-4">
                        {user.role === 'user' ? (
                          <div>
                            <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${JENJANG_COLORS[user.jenjang || 'SMK']?.badge || 'bg-white/10 text-slate-200'}`}>
                              {user.jenjang || '-'}
                            </span>
                            <div className="font-mono-code text-xs text-slate-300 mt-1">{user.npsn || '-'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Pusat / Instansi</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono-code text-slate-300">{user.noHp}</td>
                      <td className="py-3 px-4 text-slate-400">{user.kabupaten || '-'}, {user.provinsi || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleUserStatus(user.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors border ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                          }`}
                        >
                          {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenEditUser(user)}
                            title="Edit Data Pengguna"
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => onDeleteUser(user.id)}
                              title="Hapus Akun"
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* TAB 3: REKAPITULASI JENJANG & ANALITIK (BOTTOM PDF FORMAT) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rekapitulasi Format PDF Page 1 Bottom */}
            <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Rekapitulasi Usulan per Jenjang (Format Dokumen)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sesuai format tabel rekapitulasi pada lembar bawah dokumen PDF
                  </p>
                </div>
                <button
                  onClick={() => exportRekapitulasiExcel(proposals)}
                  className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/30 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/10 text-slate-200 font-bold border-b border-white/10">
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">JENJANG PENDIDIKAN</th>
                      <th className="py-3 px-3.5 text-center">JUMLAH USULAN</th>
                      <th className="py-3 px-3.5 text-right">TOTAL NILAI DANA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {JENJANG_LIST.map((jenjang, idx) => {
                      const list = proposals.filter(p => p.jenjang === jenjang);
                      const subTotal = list.reduce((sum, item) => sum + item.nilaiPengajuan, 0);
                      return (
                        <tr key={jenjang} className="hover:bg-white/5">
                          <td className="py-2.5 px-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3.5 font-bold text-white flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${JENJANG_COLORS[jenjang]?.bg || 'bg-slate-400'}`} />
                            <span>{jenjang}</span>
                          </td>
                          <td className="py-2.5 px-3.5 text-center font-bold text-slate-200">
                            {list.length} Sekolah
                          </td>
                          <td className="py-2.5 px-3.5 text-right font-mono-code font-bold text-emerald-400">
                            {formatRupiah(subTotal)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-white/10 text-white font-bold border-t border-white/15">
                      <td colSpan={2} className="py-3.5 px-3.5 uppercase text-slate-200">
                        TOTAL KESELURUHAN (SEMUA JENJANG)
                      </td>
                      <td className="py-3.5 px-3.5 text-center text-amber-300 text-sm">
                        {proposals.length} Sekolah
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono-code text-emerald-400 text-sm">
                        {formatRupiah(totalDana)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Breakdown & Distribution */}
            <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 text-slate-100">
              <h3 className="text-base font-bold text-white font-heading">
                Progres Tahapan Verifikasi Usulan
              </h3>
              <p className="text-xs text-slate-400">
                Distribusi status kelayakan dokumen dan persetujuan bantuan
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { status: 'disetujui', label: 'Disetujui / Lolos Penetapan', color: 'bg-emerald-500', count: proposals.filter(p => p.statusPengajuan === 'disetujui').length },
                  { status: 'diverifikasi', label: 'Sedang Diverifikasi Tim Teknis', color: 'bg-blue-500', count: proposals.filter(p => p.statusPengajuan === 'diverifikasi').length },
                  { status: 'diajukan', label: 'Usulan Masuk Baru (Diajukan)', color: 'bg-indigo-500', count: proposals.filter(p => p.statusPengajuan === 'diajukan').length },
                  { status: 'perlu_perbaikan', label: 'Perlu Revisi / Perbaikan Berkas', color: 'bg-amber-500', count: proposals.filter(p => p.statusPengajuan === 'perlu_perbaikan').length },
                  { status: 'draft', label: 'Draft Sekolah', color: 'bg-slate-400', count: proposals.filter(p => p.statusPengajuan === 'draft').length }
                ].map(s => {
                  const pct = proposals.length > 0 ? (s.count / proposals.length) * 100 : 0;
                  return (
                    <div key={s.status} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">{s.label}</span>
                        <span className="font-mono-code font-bold text-white">{s.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className={`h-full ${s.color} rounded-full transition-all duration-500 shadow-sm`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}


      {/* TAB 4: KATALOG STANDAR BIAYA */}
      {activeTab === 'catalog' && (
        <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-2xl space-y-5 text-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">
                  Katalog Standar Biaya Satuan Revitalisasi Sarpras (Page 2)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  {catalog.length} Komponen
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola standar acuan baku biaya sarpras yang otomatis digunakan dalam kalkulator anggaran pengusul
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-add-catalog-item"
                onClick={() => {
                  setEditingCatalogItem(null);
                  setIsCatalogModalOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Komponen</span>
              </button>

              {onResetCatalog && (
                <button
                  onClick={() => {
                    if (window.confirm('Reset katalog biaya satuan ke standar baku bawaan Kemendikbud?')) {
                      onResetCatalog();
                    }
                  }}
                  title="Kembalikan nilai katalog ke standar awal"
                  className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Standar Baku</span>
                </button>
              )}

              <button
                onClick={() => exportRekapitulasiExcel(proposals)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Excel</span>
              </button>
            </div>
          </div>

          {/* Search and Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Cari nama komponen bantuan atau spesifikasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
              {catalogSearchQuery && (
                <button
                  onClick={() => setCatalogSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Kategori:</span>
              <select
                value={catalogCategoryFilter}
                onChange={(e) => setCatalogCategoryFilter(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="ruang_utama">Ruang Utama</option>
                <option value="ruang_penunjang">Ruang Penunjang</option>
                <option value="sarana_utilitas">Sarana & Utilitas</option>
                <option value="rehab">Rehab & Pengecatan</option>
              </select>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                  <th className="py-3.5 px-4 w-12">No</th>
                  <th className="py-3.5 px-4">Menu / Komponen Bantuan</th>
                  <th className="py-3.5 px-4">Nominal Satuan (Rp)</th>
                  <th className="py-3.5 px-4">Satuan</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Deskripsi Spesifikasi Teknis</th>
                  <th className="py-3.5 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {catalog
                  .filter((cat) => {
                    const matchCategory = catalogCategoryFilter === 'ALL' || cat.category === catalogCategoryFilter;
                    const q = catalogSearchQuery.trim().toLowerCase();
                    const matchSearch = !q || cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q) || cat.unit.toLowerCase().includes(q);
                    return matchCategory && matchSearch;
                  })
                  .map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-white/5 group transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{cat.name}</span>
                          {cat.isPercentage && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              {cat.percentageRate || 15}% Otomatis
                            </span>
                          )}
                        </div>
                        {cat.checklistItems && cat.checklistItems.length > 0 && (
                          <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                            <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <span>Sub-Komponen Pilihan ({cat.checklistItems.length} Item Ceklis):</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {cat.checklistItems.map((item, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20"
                                >
                                  {cIdx + 1}. {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {cat.jenjangApplicable && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cat.jenjangApplicable.map(j => (
                              <span key={j} className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-semibold border border-indigo-500/30">
                                {j}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {cat.isPercentage ? (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold font-mono-code text-xs">
                              <span>{cat.percentageRate || 15}% dari Total Ajuan</span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Dihitung proporsional 15% dari akumulasi semua ajuan
                            </p>
                          </div>
                        ) : inlineEditNominalId === cat.id ? (
                          <div className="flex items-center gap-1.5">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono-code font-bold text-emerald-400">Rp</span>
                              <input
                                type="number"
                                min={0}
                                step={1000000}
                                autoFocus
                                value={inlineEditNominalValue}
                                onChange={(e) => setInlineEditNominalValue(Math.max(0, Number(e.target.value)))}
                                className="w-32 pl-7 pr-2 py-1 rounded-xl bg-slate-900 border border-emerald-400 text-emerald-400 font-mono-code font-bold text-xs focus:ring-1 focus:ring-emerald-400"
                              />
                            </div>
                            <button
                              onClick={() => {
                                if (onSaveCatalogItem) {
                                  onSaveCatalogItem({
                                    ...cat,
                                    nominalSatuan: inlineEditNominalValue
                                  });
                                }
                                setInlineEditNominalId(null);
                              }}
                              className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                              title="Simpan"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlineEditNominalId(null)}
                              className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
                              title="Batal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono-code font-bold text-emerald-400 text-xs">
                              {formatRupiah(cat.nominalSatuan)}
                            </span>
                            <button
                              onClick={() => {
                                setInlineEditNominalId(cat.id);
                                setInlineEditNominalValue(cat.nominalSatuan);
                              }}
                              title="Ubah nominal cepat"
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-opacity"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{cat.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-semibold uppercase whitespace-nowrap">
                          {cat.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs">{cat.description || '-'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCatalogItem(cat);
                              setIsCatalogModalOpen(true);
                            }}
                            title="Edit Komponen Lengkap"
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {onDeleteCatalogItem && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus komponen "${cat.name}" dari katalog standar?`)) {
                                  onDeleteCatalogItem(cat.id);
                                }
                              }}
                              title="Hapus Komponen"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PENGATURAN SISTEM (KELOLA PENGGUNA AKTIF & WARNA BACKGROUND) */}
      {activeTab === 'settings' && (
        <AdminSettings
          users={users}
          onToggleUserStatus={onToggleUserStatus}
          onOpenCreateUser={onOpenCreateUser}
          onOpenEditUser={onOpenEditUser}
          onDeleteUser={onDeleteUser}
          onBulkSetUserStatus={onBulkSetUserStatus}
          onSetAllSchoolsStatus={onSetAllSchoolsStatus}
          currentTheme={theme}
          onSaveTheme={(t) => onSaveTheme && onSaveTheme(t)}
          onResetTheme={() => onResetTheme && onResetTheme()}
        />
      )}

      {/* Catalog Item Edit / Create Modal */}
      {isCatalogModalOpen && (
        <CatalogItemModal
          isOpen={isCatalogModalOpen}
          onClose={() => {
            setIsCatalogModalOpen(false);
            setEditingCatalogItem(null);
          }}
          onSave={(item) => {
            if (onSaveCatalogItem) {
              onSaveCatalogItem(item);
            }
          }}
          editingItem={editingCatalogItem}
        />
      )}

    </div>
  );
};
