import React from 'react';
import { 
  School, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Download, 
  ExternalLink, 
  MapPin, 
  Users, 
  Building2,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Edit
} from 'lucide-react';
import { User, PengajuanRevitalisasi } from '../types';
import { JENJANG_COLORS } from '../data/defaultCatalog';
import { formatRupiah, exportSingleProposalRAB } from '../utils/excelExport';

interface UserDashboardProps {
  currentUser: User;
  userProposals: PengajuanRevitalisasi[];
  onOpenCreateForm: () => void;
  onOpenEditForm: (proposal: PengajuanRevitalisasi) => void;
  onOpenDetail: (proposal: PengajuanRevitalisasi) => void;
  onOpenPrintReceipt: (proposal: PengajuanRevitalisasi) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  userProposals,
  onOpenCreateForm,
  onOpenEditForm,
  onOpenDetail,
  onOpenPrintReceipt
}) => {
  const primaryProposal = userProposals[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Welcome Banner - Frosted Glass Card */}
      <div className="bg-white/5 backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${JENJANG_COLORS[currentUser.jenjang || 'SMK']?.badge || 'bg-white/10 text-slate-200'}`}>
                {currentUser.jenjang || 'Semua Jenjang'}
              </span>
              <span className="text-xs text-slate-300 font-mono-code font-bold">
                NPSN: {currentUser.npsn || '-'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              {currentUser.namaSekolah || currentUser.nama}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentUser.kabupaten || 'Wilayah Jawa Barat'}, {currentUser.provinsi || 'JAWA BARAT'}</span>
              <span>•</span>
              <span>Penanggung Jawab: <strong>{currentUser.nama}</strong> ({currentUser.noHp})</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {primaryProposal ? (
              <button
                onClick={() => onOpenEditForm(primaryProposal)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Usulan Sekolah</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreateForm}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Buat Pengajuan Revitalisasi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Status Tracker & Active Submission */}
      {primaryProposal ? (
        <div className="space-y-6">
          
          {/* Submission Status Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 text-slate-100">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status Pengajuan Revitalisasi T.A. 2027
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    {primaryProposal.nomorRegistrasi}
                  </h2>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                    primaryProposal.statusPengajuan === 'disetujui' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                    primaryProposal.statusPengajuan === 'diverifikasi' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
                    primaryProposal.statusPengajuan === 'perlu_perbaikan' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' :
                    'bg-white/10 border-white/10 text-slate-300'
                  }`}>
                    {primaryProposal.statusPengajuan.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPrintReceipt(primaryProposal)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Tanda Terima</span>
                </button>
                <button
                  onClick={() => exportSingleProposalRAB(primaryProposal)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh RAB Excel</span>
                </button>
              </div>
            </div>

            {/* Stepper Process Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">1. Pengisian Data</div>
                  <div className="text-[11px] text-emerald-400/80">18 Kolom Lengkap</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 backdrop-blur-md">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">2. Berkas Digital</div>
                  <div className="text-[11px] text-emerald-400/80">4 Tautan Cloud Terunggah</div>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
                primaryProposal.statusPengajuan === 'diverifikasi' || primaryProposal.statusPengajuan === 'disetujui'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                {primaryProposal.statusPengajuan === 'diverifikasi' || primaryProposal.statusPengajuan === 'disetujui' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">3. Verifikasi Tim Teknis</div>
                  <div className="text-[11px] text-slate-400">
                    {primaryProposal.verifiedBy ? `Diverifikasi: ${primaryProposal.verifiedBy}` : 'Dalam Antrean Review'}
                  </div>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 backdrop-blur-md ${
                primaryProposal.statusPengajuan === 'disetujui'
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                {primaryProposal.statusPengajuan === 'disetujui' ? (
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">4. Penetapan Usulan 2027</div>
                  <div className="text-[11px] text-slate-400">
                    {primaryProposal.statusPengajuan === 'disetujui' ? 'Direkomendasikan Lolos' : 'Menunggu Penetapan'}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Note if Available */}
            {primaryProposal.catatanVerifikasi && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/25 space-y-1 backdrop-blur-md">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Catatan dari Tim Verifikator Sarpras:</span>
                </div>
                <p className="text-xs text-amber-200 font-medium">
                  {primaryProposal.catatanVerifikasi}
                </p>
              </div>
            )}

            {/* Summary Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Usulan Bantuan
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs backdrop-blur-md">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Nilai Usulan:</span>
                    <span className="font-bold font-mono-code text-emerald-400 text-sm">
                      {formatRupiah(primaryProposal.nilaiPengajuan)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-slate-300">
                    <span className="text-slate-400 block mb-0.5">Daftar Komponen:</span>
                    <p className="font-semibold text-white">{primaryProposal.pengajuanBantuan}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kesiapan Lahan Sekolah
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs backdrop-blur-md">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Luas Lahan Kosong:</span>
                    <span className="font-bold text-white">{primaryProposal.luasLahanKosong.toLocaleString('id-ID')} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status Legalitas:</span>
                    <span className="font-bold text-emerald-400">{primaryProposal.statusLahan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah Siswa:</span>
                    <span className="font-bold text-white">{primaryProposal.jumlahMurid} Siswa</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tautan Berkas Cloud Terunggah
                </h3>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">1. Sertifikat Lahan:</span>
                    {primaryProposal.linkSertifikat ? (
                      <a href={primaryProposal.linkSertifikat} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        <span>Buka</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-slate-500">-</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">2. Siteplan Sekolah:</span>
                    {primaryProposal.linkSiteplan ? (
                      <a href={primaryProposal.linkSiteplan} target="_blank" rel="noreferrer" className="text-teal-400 font-bold hover:underline flex items-center gap-1">
                        <span>Buka</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-slate-500">-</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">3. Google Maps:</span>
                    {primaryProposal.linkGoogleMap ? (
                      <a href={primaryProposal.linkGoogleMap} target="_blank" rel="noreferrer" className="text-rose-400 font-bold hover:underline flex items-center gap-1">
                        <span>Buka Peta</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-slate-500">-</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">4. Proposal PDF:</span>
                    {primaryProposal.linkProposalPdf ? (
                      <a href={primaryProposal.linkProposalPdf} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline flex items-center gap-1">
                        <span>Buka PDF</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span className="text-slate-500">-</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => onOpenDetail(primaryProposal)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-2xl backdrop-blur-md transition-all active:scale-[0.98]"
              >
                Lihat Lembar 18 Kolom Lengkap
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 sm:p-14 border border-white/15 text-center space-y-5 shadow-2xl text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <School className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-white">
              Belum Ada Usulan Revitalisasi yang Dibuat
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Silakan isi formulir pengajuan 18 kolom untuk mengajukan program bantuan revitalisasi sarpras sekolah tahun anggaran 2027.
            </p>
          </div>

          <button
            onClick={onOpenCreateForm}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 inline-flex items-center gap-2 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mulai Isi Formulir Pengajuan</span>
          </button>
        </div>
      )}

    </div>
  );
};
