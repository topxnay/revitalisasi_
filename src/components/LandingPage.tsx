import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  FileSpreadsheet, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  School, 
  UploadCloud, 
  MapPin, 
  FileCheck, 
  Sparkles, 
  Search, 
  Clock, 
  Calculator, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { JenjangType, PengajuanRevitalisasi, User } from '../types';
import { JENJANG_LIST, STANDARD_CATALOG, JENJANG_COLORS } from '../data/defaultCatalog';
import { formatRupiah } from '../utils/excelExport';

interface LandingPageProps {
  onOpenLogin: (role?: 'admin' | 'user') => void;
  currentUser: User | null;
  proposals: PengajuanRevitalisasi[];
  onSelectProposalDetail: (proposal: PengajuanRevitalisasi) => void;
  onNavigateToForm: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  currentUser,
  proposals,
  onSelectProposalDetail,
  onNavigateToForm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjangTab, setSelectedJenjangTab] = useState<JenjangType>('SMK');

  // Search filter for public status tracker
  const searchResults = searchQuery.trim().length >= 3
    ? (proposals || []).filter(p => 
        (p.npsn || '').toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (p.namaSekolah || '').toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (p.nomorRegistrasi || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const totalNilaiAll = (proposals || []).reduce((acc, p) => acc + (p.nilaiPengajuan || 0), 0);

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION - Frosted Glass Card */}
      <section className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/15 text-white rounded-[32px] p-6 sm:p-12 shadow-2xl">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Penerimaan Usulan Program Revitalisasi Sekolah T.A. 2027</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight sm:leading-tight">
            Sistem Informasi Terpadu <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400">
              Revitalisasi Sarpras 2027
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Portal pengajuan bantuan pembangunan Ruang Kelas Baru (RKB), Perpustakaan, Ruang Praktik Siswa (RPS), Laboratorium, Sanitasi/MCK, dan Sarpras Terpadu untuk <strong>Semua 7 Jenjang Satuan Pendidikan</strong>.
          </p>

          {/* Jenjang Badges Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {JENJANG_LIST.map(j => (
              <span key={j} className="px-3.5 py-1 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-full border border-white/10 backdrop-blur-xs transition-colors">
                {j}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {currentUser ? (
              <button
                id="hero-btn-dashboard"
                onClick={onNavigateToForm}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm sm:text-base transition-all shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Buka {currentUser.role === 'admin' ? 'Panel Verifikasi Admin' : 'Form Pengajuan Sekolah'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button
                  id="hero-btn-login"
                  onClick={() => onOpenLogin('user')}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm sm:text-base transition-all shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <School className="w-5 h-5 text-indigo-200" />
                  <span>Mulai Pengajuan Sekolah</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  id="hero-btn-admin-login"
                  onClick={() => onOpenLogin('admin')}
                  className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Login Tim Admin / Verifikator</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Metrics Frosted Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="text-xs text-slate-400 font-medium">Total Usulan Sekolah</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                {proposals.length} Lembaga
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="text-xs text-slate-400 font-medium">Total Nilai Usulan</div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 truncate">
                {formatRupiah(totalNilaiAll)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="text-xs text-slate-400 font-medium">Jenjang Terlayani</div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-300 mt-1">
                7 Jenjang
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="text-xs text-slate-400 font-medium">Tahun Anggaran</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                2027
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION: CEK STATUS PENGAJUAN CEPAT (TRACKING BY NPSN) */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl text-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Search className="w-4 h-4" />
                <span>Pelacakan Usulan Mandiri</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Cek Status Usulan Revitalisasi Sekolah
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Masukkan NPSN Sekolah atau Nomor Registrasi (Contoh: 20263295, 69752261, atau 69758462)
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              id="input-search-public-proposal"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik NPSN atau Nama Sekolah (misal: Miftahul Huda, Sukaresik, Al-Idris)..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md text-sm font-medium"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          </div>

          {/* Quick presets tags */}
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span>Contoh Cepat:</span>
            <button 
              onClick={() => setSearchQuery('20263295')}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl font-mono-code transition-all"
            >
              20263295 (SMK Miftahul Huda)
            </button>
            <button 
              onClick={() => setSearchQuery('69752261')}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl font-mono-code transition-all"
            >
              69752261 (SMKN Sukaresik)
            </button>
            <button 
              onClick={() => setSearchQuery('69758462')}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl font-mono-code transition-all"
            >
              69758462 (SMAS Al-Idris)
            </button>
          </div>

          {/* Results list */}
          {searchQuery.trim().length >= 3 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ditemukan {searchResults.length} Data Usulan
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-sm text-slate-400">
                  Data dengan kata kunci &quot;{searchQuery}&quot; tidak ditemukan. Pastikan NPSN terdaftar.
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => onSelectProposalDetail(item)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 cursor-pointer backdrop-blur-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${JENJANG_COLORS[item.jenjang]?.badge || 'bg-white/10 text-slate-200'}`}>
                            {item.jenjang}
                          </span>
                          <span className="font-mono-code text-xs font-semibold text-slate-300">
                            NPSN: {item.npsn}
                          </span>
                          <span className="text-xs font-mono-code text-slate-400">
                            ({item.nomorRegistrasi})
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                          {item.namaSekolah}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.pengajuanBantuan}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-medium">Nilai Usulan</div>
                          <div className="text-sm font-bold text-emerald-400">
                            {formatRupiah(item.nilaiPengajuan)}
                          </div>
                        </div>

                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                          item.statusPengajuan === 'disetujui' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                          item.statusPengajuan === 'diverifikasi' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
                          item.statusPengajuan === 'perlu_perbaikan' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                          'bg-white/10 border-white/10 text-slate-300'
                        }`}>
                          {item.statusPengajuan.replace('_', ' ')}
                        </span>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>


      {/* SECTION: 7 JENJANG PENDIDIKAN & PERSYARATAN */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">
            Cakupan Program
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            Revitalisasi Terpadu untuk 7 Jenjang Pendidikan
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Setiap jenjang memiliki fokus pembangunan sarpras sesuai standar kebutuhan pembelajaran peserta didik.
          </p>
        </div>

        {/* Tab Jenjang selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JENJANG_LIST.map(j => (
            <button
              key={j}
              onClick={() => setSelectedJenjangTab(j)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all backdrop-blur-md ${
                selectedJenjangTab === j 
                  ? 'bg-indigo-600 text-white border border-indigo-400/40 shadow-lg shadow-indigo-600/30' 
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {j}
            </button>
          ))}
        </div>

        {/* Selected Jenjang Focus Box */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full font-bold text-xs border ${JENJANG_COLORS[selectedJenjangTab]?.badge || 'bg-white/10 text-slate-200'}`}>
                  Jenjang {selectedJenjangTab}
                </span>
                <span className="text-xs text-slate-400 font-medium">T.A. 2027</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-white">
                Fokus Prioritas Revitalisasi {selectedJenjangTab}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Peningkatan kualitas ruang belajar, sanitasi higienis, fasilitas digital, dan kelayakan sarana utilitas pendukung agar lingkungan belajar aman, nyaman, dan berstandar nasional.
              </p>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wide">Standar Kelayakan Lahan:</div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li>• Memiliki lahan kosong siap bangun (tidak sengketa)</li>
                  <li>• Status Wakaf/AIW, Sertifikat Hak Milik, atau Sertifikat Negara</li>
                  <li>• Tersedia Siteplan & Titik Koordinat Google Maps</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STANDARD_CATALOG.filter(c => !c.jenjangApplicable || c.jenjangApplicable.includes(selectedJenjangTab)).slice(0, 6).map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-400/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono-code font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {formatRupiah(item.nominalSatuan)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Satuan: {item.unit}</span>
                    <span className="capitalize">{item.category.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* SECTION: 4 BERKAS DOKUMEN CLOUD WAJIB */}
      <section>
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/15 text-white">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Persyaratan Berkas Cloud</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              4 Tautan Berkas Wajib Disiapkan Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sesuai format resmi instrumen pengusulan, setiap sekolah wajib menyematkan tautan Google Drive / Google Maps publik:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-white">
                Link Dokumen Tanah
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan Sertifikat Hak Milik, Akta Ikrar Wakaf (AIW), Hibah Yayasan, atau Surat Legalitas Tanah yang sah di Google Drive.
              </p>
              <div className="text-[11px] text-amber-400 font-medium">Format: Google Drive Link</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-400/30 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-white">
                Link Siteplan Sekolah
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gambar denah/siteplan sekolah yang memperlihatkan denah gedung eksisting serta posisi peletakan usulan RKB/RPS/Sarpras.
              </p>
              <div className="text-[11px] text-teal-400 font-medium">Format: Google Drive Link</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rose-400/30 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-sm text-white">
                Lokasi Google Maps
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tautan pin lokasi Google Maps / koordinat geotagging akurat sekolah untuk verifikasi tim peninjau sarpras wilayah.
              </p>
              <div className="text-[11px] text-rose-400 font-medium">Format: Google Maps Share Link</div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="font-bold text-sm text-white">
                Link Proposal PDF
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dokumen lengkap Proposal Pengajuan Revitalisasi Sarpras T.A. 2027 yang telah ditandatangani Kepala Sekolah & Yayasan.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">Format: Google Drive PDF Link</div>
            </div>

          </div>
        </div>
      </section>


      {/* SECTION: STANDAR HARGA BIAYA SATUAN (TABEL PAGE 2 PDF) */}
      <section>
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Calculator className="w-4 h-4" />
                <span>Instrumen Pembiayaan T.A. 2027</span>
              </span>
              <h2 className="text-2xl font-bold font-heading text-white">
                Standar Satuan Biaya Komponen Revitalisasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Daftar komponen dan estimasi biaya satuan resmi untuk perhitungan Rencana Anggaran Biaya (RAB)
              </p>
            </div>
            <button
              onClick={onNavigateToForm}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 shrink-0 transition-all active:scale-[0.98]"
            >
              <span>Kalkulator & Pengajuan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                  <th className="py-3.5 px-4">No</th>
                  <th className="py-3.5 px-4">Menu / Komponen Bantuan</th>
                  <th className="py-3.5 px-4">Nominal Satuan Standar</th>
                  <th className="py-3.5 px-4">Satuan</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Deskripsi Spesifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {STANDARD_CATALOG.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-4 font-mono-code font-bold text-emerald-400">
                      {formatRupiah(item.nominalSatuan)}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.unit}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 hidden md:table-cell">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};
