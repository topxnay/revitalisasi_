import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileEdit, 
  Save, 
  ExternalLink,
  MapPin,
  FileText
} from 'lucide-react';
import { PengajuanRevitalisasi, StatusPengajuan, User } from '../types';
import { formatRupiah } from '../utils/excelExport';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PengajuanRevitalisasi | null;
  onSaveVerification: (updatedProposal: PengajuanRevitalisasi) => void;
  currentUser: User | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onSaveVerification,
  currentUser
}) => {
  const [status, setStatus] = useState<StatusPengajuan>('diverifikasi');
  const [catatan, setCatatan] = useState('');
  const [skor, setSkor] = useState(85);
  const [verifikator, setVerifikator] = useState('');

  useEffect(() => {
    if (proposal) {
      setStatus(proposal.statusPengajuan);
      setCatatan(proposal.catatanVerifikasi || '');
      setSkor(proposal.skorKelayakan || 85);
      setVerifikator(proposal.verifiedBy || currentUser?.nama || 'Tim Teknis Sarpras Pusat');
    }
  }, [proposal, currentUser, isOpen]);

  if (!isOpen || !proposal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: PengajuanRevitalisasi = {
      ...proposal,
      statusPengajuan: status,
      catatanVerifikasi: catatan,
      skorKelayakan: Number(skor),
      verifiedBy: verifikator,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveVerification(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
                Verifikasi Usulan Revitalisasi
              </h2>
              <p className="text-xs text-amber-300">
                {proposal.namaSekolah} ({proposal.npsn})
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Summary Info Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nomor Registrasi:</span>
              <span className="font-mono-code font-bold text-white">{proposal.nomorRegistrasi}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Jenjang:</span>
              <span className="font-bold text-indigo-300">{proposal.jenjang}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Nilai Usulan:</span>
              <span className="font-bold text-emerald-400 text-sm font-mono-code">{formatRupiah(proposal.nilaiPengajuan)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Luas Lahan Kosong:</span>
              <span className="font-medium text-white">{proposal.luasLahanKosong} m² ({proposal.statusLahan})</span>
            </div>
            <div className="pt-2 border-t border-white/10 text-slate-300 font-medium">
              <span className="text-slate-400 block mb-0.5">Item Bantuan:</span>
              {proposal.pengajuanBantuan}
            </div>
          </div>

          {/* Quick Link Checker */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 backdrop-blur-md">
            <div className="text-[11px] font-bold text-emerald-300 uppercase">Tautan Berkas Cloud:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {proposal.linkSertifikat && (
                <a href={proposal.linkSertifikat} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 p-1.5 rounded-xl bg-white/5 border border-white/5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Sertifikat Tanah</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                </a>
              )}
              {proposal.linkSiteplan && (
                <a href={proposal.linkSiteplan} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 p-1.5 rounded-xl bg-white/5 border border-white/5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Siteplan Sekolah</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                </a>
              )}
              {proposal.linkGoogleMap && (
                <a href={proposal.linkGoogleMap} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 p-1.5 rounded-xl bg-white/5 border border-white/5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Google Maps</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                </a>
              )}
              {proposal.linkProposalPdf && (
                <a href={proposal.linkProposalPdf} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 p-1.5 rounded-xl bg-white/5 border border-white/5">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Proposal PDF</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                </a>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Keputusan Verifikasi *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStatus('disetujui')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all backdrop-blur-md ${
                  status === 'disetujui'
                    ? 'border-emerald-400/50 bg-emerald-600/40 text-emerald-200 shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Disetujui</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('diverifikasi')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all backdrop-blur-md ${
                  status === 'diverifikasi'
                    ? 'border-blue-400/50 bg-blue-600/40 text-blue-200 shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Diverifikasi</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('perlu_perbaikan')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all backdrop-blur-md ${
                  status === 'perlu_perbaikan'
                    ? 'border-amber-400/50 bg-amber-600/40 text-amber-200 shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Perlu Perbaikan</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('ditolak')}
                className={`p-3 rounded-2xl border text-center font-bold text-xs flex flex-col items-center gap-1.5 transition-all backdrop-blur-md ${
                  status === 'ditolak'
                    ? 'border-red-400/50 bg-red-600/40 text-red-200 shadow-md'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Ditolak</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Skor Kelayakan (0 - 100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={skor}
                onChange={(e) => setSkor(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-mono-code font-bold focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Petugas Verifikator
              </label>
              <input
                type="text"
                value={verifikator}
                onChange={(e) => setVerifikator(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Catatan Evaluasi Teknis / Rekomendasi Sarpras
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Dokumen sertifikat dan proposal lengkap. Disarankan prioritas 4 RKB dan MCK pada termin pertama."
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-amber-600/30 border border-amber-400/30 flex items-center gap-2 active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Keputusan Verifikasi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
