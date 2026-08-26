import React from 'react';
import { X, Printer, Download, CheckCircle, School, Building2 } from 'lucide-react';
import { PengajuanRevitalisasi } from '../types';
import { formatRupiah } from '../utils/excelExport';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: PengajuanRevitalisasi | null;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  proposal
}) => {
  if (!isOpen || !proposal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Modal Controls */}
        <div className="no-print bg-white/5 border-b border-white/10 text-white p-4 sm:p-5 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-slate-100">Pratinjau Lembar Bukti Pendaftaran Usulan</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content (High contrast white sheet for official document print) */}
        <div id="printable-receipt" className="p-8 sm:p-10 bg-white text-slate-900 text-xs space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Official Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="text-xs uppercase tracking-widest font-bold text-slate-600">
              KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH REPUBLIK INDONESIA
            </div>
            <div className="text-sm sm:text-base font-extrabold uppercase font-heading text-slate-900">
              TANDA BUKTI REGISTRASI PENGAJUAN PROGRAM REVITALISASI SARANA & PRASARANA
            </div>
            <div className="text-xs font-bold text-emerald-800">
              TAHUN ANGGARAN 2027 (SEMUA JENJANG: PAUD/TK, SD, SMP, SMA, SMK, SLB, PKBM)
            </div>
          </div>

          {/* Registration Code Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-50 border border-slate-300 rounded-lg gap-2">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Nomor Registrasi Sistem:</span>
              <span className="font-mono-code font-bold text-base text-slate-900">{proposal.nomorRegistrasi}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Status Berkas:</span>
              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                {proposal.statusPengajuan.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Section A: Identitas Lembaga */}
          <div className="space-y-2">
            <div className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 text-xs">
              A. IDENTITAS SATUAN PENDIDIKAN & PENGUSUL
            </div>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="w-44 py-1 text-slate-600">Nama Sekolah</td>
                  <td className="w-3 py-1">:</td>
                  <td className="py-1 font-bold text-slate-900">{proposal.namaSekolah}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Jenjang Pendidikan</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-bold text-emerald-800">{proposal.jenjang}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">NPSN</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-mono-code font-bold text-slate-900">{proposal.npsn}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Alamat Sekolah</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{proposal.alamatSekolah}, Kec. {proposal.kecamatan}, {proposal.kabupaten}, {proposal.provinsi}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Kepala Sekolah / Penanggung Jawab</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-bold">{proposal.namaKepalaSekolah} ({proposal.noHpKepalaSekolah})</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Jumlah Peserta Didik (Siswa)</td>
                  <td className="py-1">:</td>
                  <td className="py-1 font-bold">{proposal.jumlahMurid.toLocaleString('id-ID')} Siswa</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Luas Lahan Kosong & Legalitas</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{proposal.luasLahanKosong.toLocaleString('id-ID')} m² — Status: <strong>{proposal.statusLahan}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section B: Rincian Usulan Bantuan (Page 2) */}
          <div className="space-y-2">
            <div className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 text-xs flex justify-between items-center">
              <span>B. RINCIAN USULAN BANTUAN SARANA PRASARANA (RAB T.A. 2027)</span>
              <span className="text-[10px] font-normal text-slate-500">Standar Biaya Revitalisasi</span>
            </div>

            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800">
                  <th className="border border-slate-300 py-1.5 px-2 text-center w-8">No</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-left">Komponen / Menu Bantuan</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-right">Nominal Satuan</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-center w-16">Jumlah</th>
                  <th className="border border-slate-300 py-1.5 px-2 text-right">Total Biaya</th>
                </tr>
              </thead>
              <tbody>
                {proposal.rincianBantuan?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 py-1 px-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-300 py-1 px-2 font-medium">{item.name}</td>
                    <td className="border border-slate-300 py-1 px-2 text-right font-mono-code">{formatRupiah(item.nominalSatuan)}</td>
                    <td className="border border-slate-300 py-1 px-2 text-center font-bold">{item.quantity}</td>
                    <td className="border border-slate-300 py-1 px-2 text-right font-mono-code font-bold text-slate-900">{formatRupiah(item.total)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={4} className="border border-slate-300 py-1.5 px-2 text-right uppercase">
                    Total Nilai Usulan Revitalisasi:
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-right font-mono-code text-emerald-900 text-sm">
                    {formatRupiah(proposal.nilaiPengajuan)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section C: Verifikasi Berkas Cloud */}
          <div className="space-y-1 text-[11px] text-slate-600 border border-slate-200 p-2.5 rounded bg-slate-50">
            <div className="font-bold text-slate-800 uppercase">C. TAUTAN BERKAS PENDUKUNG DIGITAL (GOOGLE DRIVE & MAPS):</div>
            <div>1. Sertifikat/Wakaf/Hibbah: <span className="font-mono-code text-slate-800">{proposal.linkSertifikat || '-'}</span></div>
            <div>2. Siteplan Sekolah: <span className="font-mono-code text-slate-800">{proposal.linkSiteplan || '-'}</span></div>
            <div>3. Lokasi Google Maps: <span className="font-mono-code text-slate-800">{proposal.linkGoogleMap || '-'}</span></div>
            <div>4. Proposal PDF: <span className="font-mono-code text-slate-800">{proposal.linkProposalPdf || '-'}</span></div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-600">Mengetahui & Mengusulkan,</p>
              <p className="font-bold text-slate-900">Kepala Satuan Pendidikan</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
                (Tanda Tangan & Cap Sekolah)
              </div>
              <p className="font-bold underline text-slate-900">{proposal.namaKepalaSekolah}</p>
              <p className="text-[10px] text-slate-500 font-mono-code">NPSN: {proposal.npsn}</p>
            </div>

            <div>
              <p className="text-slate-600">{proposal.kabupaten}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold text-slate-900">Tim Verifikator Sarpras Pusat</p>
              <div className="h-16 flex items-center justify-center text-slate-300 italic text-[10px]">
                (Tanda Tangan Petugas)
              </div>
              <p className="font-bold underline text-slate-900">{proposal.verifiedBy || 'Tim Teknis Verifikasi T.A. 2027'}</p>
              <p className="text-[10px] text-slate-500">Kementerian Pendidikan Dasar & Menengah</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200">
            Dicetak otomatis dari Sistem Informasi Pengajuan Revitalisasi Sekolah (SIM-REVIT 2027) pada {new Date().toLocaleString('id-ID')}
          </div>

        </div>

      </div>
    </div>
  );
};
