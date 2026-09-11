import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  School, 
  MapPin, 
  Users, 
  Phone, 
  Calculator, 
  UploadCloud, 
  CheckCircle, 
  Plus, 
  Minus, 
  Trash2, 
  ExternalLink, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  FileCheck,
  AlertCircle,
  Layers
} from 'lucide-react';
import { 
  PengajuanRevitalisasi, 
  User, 
  JenjangType, 
  StatusLahanType, 
  BantuanItemSelection,
  BantuanCatalogItem 
} from '../types';
import { 
  JENJANG_LIST, 
  STATUS_LAHAN_OPTIONS, 
  STANDARD_CATALOG, 
  JENJANG_COLORS 
} from '../data/defaultCatalog';
import { formatRupiah } from '../utils/excelExport';
import { generateRegistrationNumber, getStoredCatalog } from '../utils/storage';

interface FormPengajuanProps {
  currentUser: User;
  editingProposal: PengajuanRevitalisasi | null;
  onSaveProposal: (proposal: PengajuanRevitalisasi) => void;
  onCancel: () => void;
  allProposals: PengajuanRevitalisasi[];
  catalog?: BantuanCatalogItem[];
}

export const FormPengajuan: React.FC<FormPengajuanProps> = ({
  currentUser,
  editingProposal,
  onSaveProposal,
  onCancel,
  allProposals = [],
  catalog
}) => {
  const activeCatalog = catalog || getStoredCatalog();
  const [step, setStep] = useState<number>(1);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  // Form State
  const [jenjang, setJenjang] = useState<JenjangType>(
    editingProposal?.jenjang || currentUser.jenjang || 'SMK'
  );
  const [namaSekolah, setNamaSekolah] = useState(
    editingProposal?.namaSekolah || currentUser.namaSekolah || ''
  );
  const [npsn, setNpsn] = useState(
    editingProposal?.npsn || currentUser.npsn || ''
  );
  const [alamatSekolah, setAlamatSekolah] = useState(
    editingProposal?.alamatSekolah || ''
  );
  const [kecamatan, setKecamatan] = useState(
    editingProposal?.kecamatan || ''
  );
  const [kabupaten, setKabupaten] = useState(
    editingProposal?.kabupaten || currentUser.kabupaten || 'Kabupaten Tasikmalaya'
  );
  const [provinsi, setProvinsi] = useState(
    editingProposal?.provinsi || currentUser.provinsi || 'JAWA BARAT'
  );

  // Headmaster & Students
  const [namaKepalaSekolah, setNamaKepalaSekolah] = useState(
    editingProposal?.namaKepalaSekolah || currentUser.nama || ''
  );
  const [noHpKepalaSekolah, setNoHpKepalaSekolah] = useState(
    editingProposal?.noHpKepalaSekolah || currentUser.noHp || ''
  );
  const [jumlahMurid, setJumlahMurid] = useState<number>(
    editingProposal?.jumlahMurid || 250
  );

  // Land info
  const [luasLahanKosong, setLuasLahanKosong] = useState<number>(
    editingProposal?.luasLahanKosong || 1500
  );
  const [statusLahan, setStatusLahan] = useState<StatusLahanType>(
    editingProposal?.statusLahan || 'Wakaf/AIW Yayasan'
  );

  // 4 Cloud Links
  const [linkSertifikat, setLinkSertifikat] = useState(
    editingProposal?.linkSertifikat || ''
  );
  const [linkSiteplan, setLinkSiteplan] = useState(
    editingProposal?.linkSiteplan || ''
  );
  const [linkGoogleMap, setLinkGoogleMap] = useState(
    editingProposal?.linkGoogleMap || ''
  );
  const [linkProposalPdf, setLinkProposalPdf] = useState(
    editingProposal?.linkProposalPdf || ''
  );

  // Bantuan Items Selection (Page 2 Interactive Builder)
  const [bantuanItems, setBantuanItems] = useState<BantuanItemSelection[]>(() => {
    if (editingProposal?.rincianBantuan && editingProposal.rincianBantuan.length > 0) {
      return editingProposal.rincianBantuan;
    }
    // Default initial items
    return [
      { itemId: 'rkb', name: 'RKB (Ruang Kelas Baru)', nominalSatuan: 400000000, quantity: 4, total: 1600000000 },
      { itemId: 'perpustakaan', name: 'Perpustakaan', nominalSatuan: 432000000, quantity: 1, total: 432000000 },
      { itemId: 'toilet', name: 'Toilet / MCK & Sanitasi', nominalSatuan: 120000000, quantity: 2, total: 240000000 },
      { itemId: 'utilitas', name: 'Utilitas (Pagar, Paving Blok, Listrik & Drainase)', nominalSatuan: 150000000, quantity: 1, total: 150000000 }
    ];
  });

  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState<number>(100000000);

  // Calculate Total Nilai Pengajuan
  const totalNilaiPengajuan = bantuanItems.reduce((sum, item) => sum + item.total, 0);

  // Auto-generate text summary
  const autoSummaryText = bantuanItems
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity} ${item.name}`)
    .join(', ');

  const handleNominalChange = (itemId: string, newNominal: number) => {
    if (newNominal < 0) return;
    setBantuanItems(prev => prev.map(item => {
      if (item.itemId === itemId) {
        return {
          ...item,
          nominalSatuan: newNominal,
          total: item.quantity * newNominal
        };
      }
      return item;
    }));
  };

  const handleItemNameChange = (itemId: string, newName: string) => {
    setBantuanItems(prev => prev.map(item => {
      if (item.itemId === itemId) {
        return {
          ...item,
          name: newName
        };
      }
      return item;
    }));
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty < 0) return;
    setBantuanItems(prev => {
      if (newQty === 0) {
        return prev.filter(i => i.itemId !== itemId);
      }
      return prev.map(item => {
        if (item.itemId === itemId) {
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.nominalSatuan
          };
        }
        return item;
      });
    });
  };

  const handleAddCatalogItem = (catalogItem: BantuanCatalogItem) => {
    setBantuanItems(prev => {
      const existing = prev.find(i => i.itemId === catalogItem.id);
      if (existing) {
        return prev.map(i => i.itemId === catalogItem.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.nominalSatuan } : i);
      } else {
        return [
          ...prev,
          {
            itemId: catalogItem.id,
            name: catalogItem.name,
            nominalSatuan: catalogItem.nominalSatuan,
            quantity: 1,
            total: catalogItem.nominalSatuan
          }
        ];
      }
    });
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;

    const newItem: BantuanItemSelection = {
      itemId: `custom_${Date.now()}`,
      name: customItemName.trim(),
      nominalSatuan: Number(customItemPrice),
      quantity: 1,
      total: Number(customItemPrice)
    };

    setBantuanItems([...bantuanItems, newItem]);
    setCustomItemName('');
    setCustomItemPrice(100000000);
  };

  const handleSave = (statusToSave: 'draft' | 'diajukan') => {
    if (!namaSekolah || !npsn) {
      alert('Mohon lengkapi Nama Sekolah dan NPSN terlebih dahulu.');
      setStep(1);
      return;
    }

    const regNum = editingProposal?.nomorRegistrasi || 
      generateRegistrationNumber(jenjang, allProposals.filter(p => p.jenjang === jenjang).length);

    const newProposal: PengajuanRevitalisasi = {
      id: editingProposal?.id || `prop_${Date.now()}`,
      nomorRegistrasi: regNum,
      userId: currentUser.id,
      jenjang,
      namaSekolah: namaSekolah.trim(),
      npsn: npsn.trim(),
      alamatSekolah: alamatSekolah.trim(),
      kecamatan: kecamatan.trim(),
      kabupaten: kabupaten.trim(),
      provinsi: provinsi.trim(),
      namaKepalaSekolah: namaKepalaSekolah.trim(),
      noHpKepalaSekolah: noHpKepalaSekolah.trim(),
      jumlahMurid: Number(jumlahMurid),
      pengajuanBantuan: autoSummaryText || 'Usulan Sarana Prasarana Revitalisasi',
      nilaiPengajuan: totalNilaiPengajuan,
      luasLahanKosong: Number(luasLahanKosong),
      statusLahan,
      linkSertifikat: linkSertifikat.trim(),
      linkSiteplan: linkSiteplan.trim(),
      linkGoogleMap: linkGoogleMap.trim(),
      linkProposalPdf: linkProposalPdf.trim(),
      rincianBantuan: bantuanItems,
      statusPengajuan: statusToSave,
      tahunAnggaran: '2027',
      tanggalPengajuan: editingProposal?.tanggalPengajuan || new Date().toISOString().split('T')[0],
      catatanVerifikasi: editingProposal?.catatanVerifikasi,
      verifiedBy: editingProposal?.verifiedBy,
      verifiedAt: editingProposal?.verifiedAt,
      skorKelayakan: editingProposal?.skorKelayakan,
      createdAt: editingProposal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveProposal(newProposal);
    setIsSuccessSubmitted(true);
  };

  if (isSuccessSubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-8 sm:p-12 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 text-slate-100">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Usulan Berhasil Tersimpan!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Data usulan untuk <strong>{namaSekolah}</strong> ({jenjang}) telah masuk ke dalam sistem <strong>SIM- REVIT ASPIRASI</strong> (Pengajuan Rehab, Renov dan RKB -ASPIRASI).
          </p>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1.5 backdrop-blur-md">
          <div className="flex justify-between">
            <span className="text-slate-400">NPSN:</span>
            <span className="font-bold text-white font-mono-code">{npsn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Nilai Usulan:</span>
            <span className="font-bold text-emerald-400 font-mono-code">{formatRupiah(totalNilaiPengajuan)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Jumlah Komponen:</span>
            <span className="font-bold text-white">{bantuanItems.length} Komponen</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/30 active:scale-[0.98]"
          >
            Buka Dashboard Pengajuan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-2xl overflow-hidden text-slate-100 pb-12">
      
      {/* Header Form */}
      <div className="bg-white/5 border-b border-white/10 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <School className="w-3.5 h-3.5 text-indigo-400" />
              <span>Formulir Pengusulan Revitalisasi Sarpras T.A. 2027</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {editingProposal ? 'Edit Data Pengajuan Revitalisasi' : 'Pengajuan Usulan Baru'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Pengisian data 18 kolom lengkap & penghitungan otomatis RAB sarana prasarana
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition-all active:scale-[0.98]"
          >
            Kembali
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/10 text-xs font-medium">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 rounded-2xl text-left transition-all backdrop-blur-md ${
              step === 1 
                ? 'bg-indigo-600 text-white font-bold border border-indigo-400/40 shadow-lg shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-300">Langkah 1</span>
            <span>1. Identitas Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`p-3 rounded-2xl text-left transition-all backdrop-blur-md ${
              step === 2 
                ? 'bg-indigo-600 text-white font-bold border border-indigo-400/40 shadow-lg shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-300">Langkah 2</span>
            <span>2. Kepsek & Siswa</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`p-3 rounded-2xl text-left transition-all backdrop-blur-md ${
              step === 3 
                ? 'bg-indigo-600 text-white font-bold border border-indigo-400/40 shadow-lg shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-300">Langkah 3</span>
            <span>3. Kalkulator Sarpras</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(4)}
            className={`p-3 rounded-2xl text-left transition-all backdrop-blur-md ${
              step === 4 
                ? 'bg-indigo-600 text-white font-bold border border-indigo-400/40 shadow-lg shadow-indigo-600/25' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-300">Langkah 4</span>
            <span>4. Lahan & 4 Link Berkas</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8">
        
        {/* STEP 1: IDENTITAS SEKOLAH & JENJANG */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white font-heading">
                Langkah 1: Identitas Satuan Pendidikan & Jenjang
              </h2>
              <p className="text-xs text-slate-400">
                Pilih jenjang pendidikan dan lengkapi identitas resmi sekolah sesuai Dapodik / EMIS
              </p>
            </div>

            {/* Jenjang Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Pilih Jenjang Pendidikan (Semua 7 Jenjang) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {JENJANG_LIST.map(j => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setJenjang(j)}
                    className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all backdrop-blur-md ${
                      jenjang === j
                        ? 'border-indigo-400/50 bg-indigo-600/40 text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400">Jenjang</div>
                    <div className="text-xs sm:text-sm mt-0.5 truncate">{j}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor Pokok Sekolah Nasional (NPSN) *
                </label>
                <input
                  type="text"
                  required
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  placeholder="Contoh: 20263295"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-mono-code font-bold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Satuan Pendidikan / Sekolah Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  placeholder="Contoh: SMK MIFTAHUL HUDA II JATINAGARA"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Alamat Lengkap Sekolah (Jalan, Dusun, RT/RW, Desa/Kelurahan) *
              </label>
              <textarea
                rows={2}
                required
                value={alamatSekolah}
                onChange={(e) => setAlamatSekolah(e.target.value)}
                placeholder="Jln. Mulyasari No. 43 Dusun Wetan 05/02 Desa Bayasari 46273"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kecamatan *
                </label>
                <input
                  type="text"
                  required
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Jatinegara / Sukaresik"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kabupaten / Kota *
                </label>
                <input
                  type="text"
                  required
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  placeholder="Kabupaten Ciamis / Tasikmalaya"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Provinsi *
                </label>
                <input
                  type="text"
                  required
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  placeholder="JAWA BARAT"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <span>Lanjut ke Langkah 2 (Data Kepsek & Siswa)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}


        {/* STEP 2: DATA KEPALA SEKOLAH & PESERTA DIDIK */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white font-heading">
                Langkah 2: Data Kepala Sekolah & Jumlah Peserta Didik
              </h2>
              <p className="text-xs text-slate-400">
                Informasi pimpinan satuan pendidikan untuk verifikasi dan konfirmasi teknis
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Kepala Sekolah / Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  value={namaKepalaSekolah}
                  onChange={(e) => setNamaKepalaSekolah(e.target.value)}
                  placeholder="Sobirin, S.Pd., M.Pd."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nomor Handphone / WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={noHpKepalaSekolah}
                  onChange={(e) => setNoHpKepalaSekolah(e.target.value)}
                  placeholder="085223053315"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-mono-code focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Jumlah Peserta Didik (Siswa Aktif) *
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  required
                  value={jumlahMurid}
                  onChange={(e) => setJumlahMurid(Number(e.target.value))}
                  className="w-48 px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-bold font-mono-code focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
                <span className="text-sm font-bold text-slate-300">Siswa Aktif Terdaftar</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Digunakan untuk analisis rasio kebutuhan ruang belajar dan kapasitas tampung sarpras.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm rounded-2xl flex items-center gap-2 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <span>Lanjut ke Langkah 3 (Kalkulator Sarpras)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}


        {/* STEP 3: KALKULATOR USULAN BANTUAN SARPRAS (PAGE 2 FORMAT) */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-heading">
                  Langkah 3: Rincian Anggaran Usulan Bantuan Sarpras (RAB T.A. 2027)
                </h2>
                <p className="text-xs text-slate-400">
                  Pilih item bantuan dan tentukan jumlah unit. Sistem otomatis menghitung total nominal usulan (sesuai Page 2 dokumen).
                </p>
              </div>

              {/* Real-time Total Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-right backdrop-blur-md">
                <div className="text-[10px] uppercase font-bold text-emerald-300">Total Nilai Usulan:</div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono-code">
                  {formatRupiah(totalNilaiPengajuan)}
                </div>
              </div>
            </div>

            {/* Quick Catalog Addition Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pilih Komponen Standar dari Katalog Bantuan:
                </label>
                <span className="text-[11px] text-slate-400">
                  Klik untuk menambahkan ke daftar usulan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {activeCatalog.filter(c => !c.jenjangApplicable || c.jenjangApplicable.includes(jenjang)).map(cat => {
                  const currentSelection = bantuanItems.find(i => i.itemId === cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleAddCatalogItem(cat)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between backdrop-blur-md ${
                        currentSelection && currentSelection.quantity > 0
                          ? 'border-indigo-400/50 bg-indigo-600/30 text-white shadow-sm ring-1 ring-indigo-500/30'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{cat.name}</div>
                        <div className="text-[11px] text-emerald-400 font-mono-code font-bold mt-0.5">
                          {formatRupiah(cat.nominalSatuan)}
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span className="text-indigo-300 font-medium">+ Tambah</span>
                        {currentSelection && currentSelection.quantity > 0 && (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full font-bold text-[10px]">
                            {currentSelection.quantity} {cat.unit}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Items Table (Page 2 format: Menu | Nominal | Jumlah | Total) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Tabel Rincian Usulan Bantuan (Format Dokumen):
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Nominal satuan dan jumlah unit dapat diubah / diinput secara manual sesuai kebutuhan RAB sekolah
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                  {bantuanItems.length} Komponen Dipilih
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                      <th className="py-3.5 px-3 w-10">No</th>
                      <th className="py-3.5 px-3 min-w-[180px]">Menu / Komponen Bantuan</th>
                      <th className="py-3.5 px-3 min-w-[170px]">Nominal Satuan (Rp)</th>
                      <th className="py-3.5 px-3 text-center min-w-[120px]">Jumlah (Unit)</th>
                      <th className="py-3.5 px-3 text-right min-w-[140px]">Total Biaya (Rp)</th>
                      <th className="py-3.5 px-3 text-center w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {bantuanItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Belum ada komponen bantuan yang dipilih. Klik tombol katalog di atas atau tambahkan komponen khusus.
                        </td>
                      </tr>
                    ) : (
                      bantuanItems.map((item, idx) => (
                        <tr key={item.itemId} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-white text-xs">{item.name}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="relative flex items-center">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono-code font-bold text-emerald-400">
                                Rp
                              </span>
                              <input
                                type="number"
                                min={0}
                                step={1000000}
                                value={item.nominalSatuan}
                                onChange={(e) => handleNominalChange(item.itemId, Math.max(0, Number(e.target.value) || 0))}
                                title="Input nominal satuan manual"
                                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-white/20 text-emerald-400 font-mono-code font-bold text-xs focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono-code block mt-0.5">
                              {formatRupiah(item.nominalSatuan)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.itemId, Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-10 text-center font-bold font-mono-code text-xs text-white bg-transparent border-0 focus:ring-0 p-0"
                              />
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono-code font-bold text-emerald-400 text-xs">
                            {formatRupiah(item.total)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.itemId, 0)}
                              title="Hapus komponen usulan ini"
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    <tr className="bg-white/10 font-bold border-t border-white/15">
                      <td colSpan={4} className="py-3.5 px-3 text-slate-200 uppercase text-xs">
                        Total Nilai Pengajuan Revitalisasi:
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-code text-sm sm:text-base text-emerald-400 font-extrabold">
                        {formatRupiah(totalNilaiPengajuan)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Custom Item Form */}
            <form onSubmit={handleAddCustomItem} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                + Tambah Komponen Usulan Khusus / Lainnya:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Nama komponen khusus (misal: Ruang Lab Bahasa)"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
                <input
                  type="number"
                  step={10000000}
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                  placeholder="Harga satuan (Rp)"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-slate-100 text-xs font-mono-code focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Tambah ke Usulan
                </button>
              </div>
            </form>

            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm rounded-2xl flex items-center gap-2 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all active:scale-[0.98]"
              >
                <span>Lanjut ke Langkah 4 (Lahan & 4 Link Berkas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}


        {/* STEP 4: LAHAN & 4 LINK BERKAS CLOUD */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white font-heading">
                Langkah 4: Informasi Lahan & 4 Tautan Berkas Digital (Google Drive/Maps)
              </h2>
              <p className="text-xs text-slate-400">
                Sesuai instrumen Kolom 13, 14, 15, 16, 17, dan 18 pada dokumen resmi
              </p>
            </div>

            {/* Land Size & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Luas Lahan Kosong Siap Bangun (m²) *
                </label>
                <input
                  type="number"
                  min={10}
                  required
                  value={luasLahanKosong}
                  onChange={(e) => setLuasLahanKosong(Number(e.target.value))}
                  placeholder="Contoh: 7143 atau 9714"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-mono-code font-bold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Luas area tanah yang bebas sengketa dan siap dibangun sarpras baru.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Status Legalitas Tanah *
                </label>
                <select
                  value={statusLahan}
                  onChange={(e) => setStatusLahan(e.target.value as StatusLahanType)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/60 border border-white/15 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                >
                  {STATUS_LAHAN_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Pilih jenis sertifikat atau akta legalitas tanah sekolah.
                </p>
              </div>
            </div>

            {/* 4 Cloud Links Section */}
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>4 Link Berkas Cloud Wajib (Kolom 15 - 18)</span>
              </div>

              {/* Link 1: Sertifikat */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1.5 backdrop-blur-md">
                <label className="block text-xs font-bold text-amber-300 uppercase">
                  1. LINK SERTIFIKAT/WAKAF/AIW/HIBBAH (Kolom 15) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkSertifikat}
                    onChange={(e) => setLinkSertifikat(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                  {linkSertifikat && (
                    <a
                      href={linkSertifikat}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                    >
                      <span>Tes Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tautan Google Drive dokumen legalitas (pastikan akses diset ke &quot;Siapa saja yang memiliki link&quot;).
                </p>
              </div>

              {/* Link 2: Siteplan */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1.5 backdrop-blur-md">
                <label className="block text-xs font-bold text-teal-300 uppercase">
                  2. LINK SITEPLAN SEKOLAH (Kolom 16) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkSiteplan}
                    onChange={(e) => setLinkSiteplan(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                  {linkSiteplan && (
                    <a
                      href={linkSiteplan}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                    >
                      <span>Tes Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tautan Google Drive denah & gambar siteplan tata letak bangunan sekolah.
                </p>
              </div>

              {/* Link 3: Google Maps */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1.5 backdrop-blur-md">
                <label className="block text-xs font-bold text-rose-300 uppercase">
                  3. LOKASI SEKOLAH / GOOGLE MAP (Kolom 17) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkGoogleMap}
                    onChange={(e) => setLinkGoogleMap(e.target.value)}
                    placeholder="https://maps.app.goo.gl/... atau tautan Google Maps"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                  {linkGoogleMap && (
                    <a
                      href={linkGoogleMap}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                    >
                      <span>Buka Peta</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tautan pin koordinat titik lokasi sekolah di Google Maps.
                </p>
              </div>

              {/* Link 4: Proposal PDF */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1.5 backdrop-blur-md">
                <label className="block text-xs font-bold text-indigo-300 uppercase">
                  4. LINK FILE PROPOSAL PDF GOOGLE DRIVE (Kolom 18) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkProposalPdf}
                    onChange={(e) => setLinkProposalPdf(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=drive_link"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-white/15 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                  />
                  {linkProposalPdf && (
                    <a
                      href={linkProposalPdf}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all"
                    >
                      <span>Lihat PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tautan file proposal lengkap yang telah ditandatangani dan dicap resmi.
                </p>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Kalkulator</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  className="flex-1 sm:flex-initial px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 font-bold text-sm rounded-2xl backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Sebagai Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave('diajukan')}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Kirim Usulan Resmi 2027</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
