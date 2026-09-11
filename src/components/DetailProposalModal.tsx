import React from 'react';
import { 
  X, 
  School, 
  MapPin, 
  Phone, 
  Users, 
  FileText, 
  ExternalLink, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { PengajuanRevitalisasi, User } from '../types';
import { JENJANG_COLORS } from '../data/defaultCatalog';
import { formatRupiah, exportSingleProposalRAB } from '../utils/excelExport';

interface DetailProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PengajuanRevitalisasi | null;
  currentUser: User | null;
  onOpenVerification?: (proposal: PengajuanRevitalisasi) => void;
  onOpenPrintReceipt: (proposal: PengajuanRevitalisasi) => void;
  onEditProposal?: (proposal: PengajuanRevitalisasi) => void;
}

export const DetailProposalModal: React.FC<DetailProposalModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentUser,
  onOpenVerification,
  onOpenPrintReceipt,
  onEditProposal
}) => {
  if (!isOpen || !proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Modal Top Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 relative backdrop-blur-md">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Jenjang {proposal.jenjang}
            </span>
            <span className="font-mono-code text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
              {proposal.nomorRegistrasi}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-xl font-bold uppercase ${
              proposal.statusPengajuan === 'disetujui' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              proposal.statusPengajuan === 'diverifikasi' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              proposal.statusPengajuan === 'perlu_perbaikan' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-slate-700/50 text-slate-300 border border-white/10'
            }`}>
              Status: {proposal.statusPengajuan.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {proposal.namaSekolah}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 mt-1">
            <span>NPSN: <strong className="text-white font-mono-code">{proposal.npsn}</strong></span>
            <span>•</span>
            <span>{proposal.kabupaten}, {proposal.provinsi}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Nilai Usulan</div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono-code mt-0.5">
                {formatRupiah(proposal.nilaiPengajuan)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Luas Lahan Kosong</div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                {proposal.luasLahanKosong.toLocaleString('id-ID')} m²
              </div>
              <div className="text-[10px] text-slate-400 truncate">{proposal.statusLahan}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Jumlah Murid</div>
              <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                {proposal.jumlahMurid.toLocaleString('id-ID')} Siswa
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Tahun Anggaran</div>
              <div className="text-sm sm:text-base font-bold text-amber-400 mt-0.5">
                T.A. {proposal.tahunAnggaran || '2027'}
              </div>
            </div>
          </div>

          {/* Section: Rincian 18 Kolom Data Sekolah */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3 backdrop-blur-md">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-indigo-400" />
              <span>Identitas & Data Penanggung Jawab Sekolah</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Nama Kepala Sekolah:</span>
                <span className="font-bold text-white">{proposal.namaKepalaSekolah}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">No. HP / WhatsApp:</span>
                <span className="font-bold text-white font-mono-code">{proposal.noHpKepalaSekolah}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Kecamatan:</span>
                <span className="font-medium text-white">{proposal.kecamatan}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Kabupaten / Kota:</span>
                <span className="font-medium text-white">{proposal.kabupaten}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Provinsi:</span>
                <span className="font-medium text-white">{proposal.provinsi}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-400">Status Legalitas Tanah:</span>
                <span className="font-bold text-emerald-400">{proposal.statusLahan}</span>
              </div>
              <div className="col-span-1 sm:col-span-2 pt-1">
                <span className="text-slate-400 block mb-0.5">Alamat Lengkap Sekolah:</span>
                <p className="text-slate-200 font-medium">{proposal.alamatSekolah}</p>
              </div>
            </div>
          </div>

          {/* Section: 4 Link Dokumen Berkas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>4 Tautan Dokumen Cloud Terverifikasi (Sesuai Kolom 15 - 18)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Link 1: Sertifikat */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-emerald-500/40 backdrop-blur-md transition-colors flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase">1. Link Sertifikat / AIW / Hibbah</div>
                  <div className="text-xs text-slate-300 font-medium truncate max-w-[200px] mt-0.5">
                    {proposal.linkSertifikat || 'Belum ditautkan'}
                  </div>
                </div>
                {proposal.linkSertifikat && (
                  <a
                    href={proposal.linkSertifikat}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Link 2: Siteplan */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-teal-500/40 backdrop-blur-md transition-colors flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-teal-300 uppercase">2. Link Siteplan Sekolah</div>
                  <div className="text-xs text-slate-300 font-medium truncate max-w-[200px] mt-0.5">
                    {proposal.linkSiteplan || 'Belum ditautkan'}
                  </div>
                </div>
                {proposal.linkSiteplan && (
                  <a
                    href={proposal.linkSiteplan}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Link 3: Google Map */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-rose-500/40 backdrop-blur-md transition-colors flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-rose-300 uppercase">3. Lokasi Google Maps</div>
                  <div className="text-xs text-slate-300 font-medium truncate max-w-[200px] mt-0.5">
                    {proposal.linkGoogleMap || 'Belum ditautkan'}
                  </div>
                </div>
                {proposal.linkGoogleMap && (
                  <a
                    href={proposal.linkGoogleMap}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Link 4: Proposal PDF */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:border-indigo-500/40 backdrop-blur-md transition-colors flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-indigo-300 uppercase">4. Link File Proposal PDF</div>
                  <div className="text-xs text-slate-300 font-medium truncate max-w-[200px] mt-0.5">
                    {proposal.linkProposalPdf || 'Belum ditautkan'}
                  </div>
                </div>
                {proposal.linkProposalPdf && (
                  <a
                    href={proposal.linkProposalPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Section: Tabel Rincian Anggaran Biaya (Page 2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Rincian Anggaran Biaya Usulan (Format Page 2)</span>
              </h3>
              <button
                onClick={() => exportSingleProposalRAB(proposal)}
                className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download RAB Excel</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                    <th className="py-3 px-3">Menu / Komponen</th>
                    <th className="py-3 px-3">Nominal Satuan</th>
                    <th className="py-3 px-3 text-center">Jumlah (Unit)</th>
                    <th className="py-3 px-3 text-right">Total Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {proposal.rincianBantuan && proposal.rincianBantuan.length > 0 ? (
                    proposal.rincianBantuan.map((item, idx) => {
                      const isPercent = !!item.isPercentage || item.itemId === 'utilitas';
                      return (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{item.name}</div>
                            {isPercent && (
                              <div className="mt-1 space-y-1">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 mr-1">
                                  15% Pagu Otomatis
                                </span>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {(item.selectedChecklist || []).map((chk, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30"
                                    >
                                      {chk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono-code text-slate-300">
                            {isPercent ? (
                              <div>
                                <span className="text-amber-300 text-xs font-bold">15% Ajuan</span>
                                <span className="block text-[10px] text-slate-400">({formatRupiah(item.nominalSatuan)})</span>
                              </div>
                            ) : (
                              formatRupiah(item.nominalSatuan)
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-white">
                            {isPercent ? '1 Paket (15%)' : item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-mono-code font-bold text-emerald-400">
                            {formatRupiah(item.total)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-3 text-center text-slate-400">
                        {proposal.pengajuanBantuan}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-white/10 font-bold border-t border-white/15">
                    <td colSpan={3} className="py-3.5 px-3 text-slate-200 uppercase">
                      Total Nilai Pengajuan Revitalisasi
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-base text-emerald-400">
                      {formatRupiah(proposal.nilaiPengajuan)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Status Verifikasi & Catatan Evaluasi */}
          {proposal.catatanVerifikasi && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-1.5 text-xs backdrop-blur-md">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Catatan Hasil Verifikasi Tim Sarpras:</span>
              </div>
              <p className="text-amber-100 leading-relaxed font-medium">
                &quot;{proposal.catatanVerifikasi}&quot;
              </p>
              {proposal.verifiedBy && (
                <div className="text-[11px] text-amber-300/80 pt-1">
                  Diverifikasi oleh: <strong className="text-white">{proposal.verifiedBy}</strong> pada {new Date(proposal.verifiedAt || '').toLocaleDateString('id-ID')}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-white/5 p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintReceipt(proposal)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs sm:text-sm font-semibold rounded-2xl border border-white/20 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti Usulan</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'admin' && onOpenVerification && (
              <button
                onClick={() => onOpenVerification(proposal)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-600/30 border border-amber-400/30 transition-all active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifikasi Proposal</span>
              </button>
            )}

            {onEditProposal && (currentUser?.role === 'admin' || currentUser?.id === proposal.userId) && (
              <button
                onClick={() => onEditProposal(proposal)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <FileText className="w-4 h-4" />
                <span>Edit Data Usulan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
