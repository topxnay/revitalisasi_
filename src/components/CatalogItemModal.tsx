import React, { useState, useEffect } from 'react';
import { X, Save, Layers, DollarSign, Tag, Check, AlertCircle, Percent, CheckSquare, Plus, Trash2, RotateCcw } from 'lucide-react';
import { BantuanCatalogItem, JenjangType } from '../types';
import { JENJANG_LIST, DEFAULT_UTILITAS_CHECKLIST } from '../data/defaultCatalog';
import { formatRupiah } from '../utils/excelExport';

interface CatalogItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BantuanCatalogItem) => void;
  editingItem: BantuanCatalogItem | null;
}

export const CatalogItemModal: React.FC<CatalogItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem
}) => {
  const [formData, setFormData] = useState<BantuanCatalogItem>({
    id: '',
    name: '',
    category: 'ruang_utama',
    nominalSatuan: 300000000,
    unit: 'Ruang',
    description: '',
    jenjangApplicable: undefined,
    isPercentage: false,
    percentageRate: 15,
    checklistItems: []
  });

  const [applyToAllJenjang, setApplyToAllJenjang] = useState(true);
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangType[]>([]);
  const [isPercentageMode, setIsPercentageMode] = useState(false);
  const [percentageRate, setPercentageRate] = useState<number>(15);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newChecklistInput, setNewChecklistInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      const isPercent = !!editingItem.isPercentage || editingItem.id === 'utilitas';
      setIsPercentageMode(isPercent);
      setPercentageRate(editingItem.percentageRate || 15);

      const checklist = editingItem.checklistItems && editingItem.checklistItems.length > 0
        ? editingItem.checklistItems
        : (editingItem.id === 'utilitas' ? DEFAULT_UTILITAS_CHECKLIST : []);
      
      setHasChecklist(checklist.length > 0);
      setChecklistItems(checklist);

      if (editingItem.jenjangApplicable && editingItem.jenjangApplicable.length > 0) {
        setApplyToAllJenjang(false);
        setSelectedJenjang(editingItem.jenjangApplicable);
      } else {
        setApplyToAllJenjang(true);
        setSelectedJenjang([]);
      }
    } else {
      setFormData({
        id: `cat_${Date.now()}`,
        name: '',
        category: 'ruang_utama',
        nominalSatuan: 300000000,
        unit: 'Ruang',
        description: '',
        jenjangApplicable: undefined,
        isPercentage: false,
        percentageRate: 15,
        checklistItems: []
      });
      setIsPercentageMode(false);
      setPercentageRate(15);
      setHasChecklist(false);
      setChecklistItems([]);
      setApplyToAllJenjang(true);
      setSelectedJenjang([]);
    }
    setError('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleToggleJenjang = (j: JenjangType) => {
    if (selectedJenjang.includes(j)) {
      setSelectedJenjang(selectedJenjang.filter(item => item !== j));
    } else {
      setSelectedJenjang([...selectedJenjang, j]);
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistInput.trim()) return;
    if (!checklistItems.includes(newChecklistInput.trim())) {
      setChecklistItems([...checklistItems, newChecklistInput.trim()]);
    }
    setNewChecklistInput('');
  };

  const handleRemoveChecklistItem = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  const handleResetToDefaultUtilitas = () => {
    setChecklistItems(DEFAULT_UTILITAS_CHECKLIST);
    setHasChecklist(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama komponen bantuan wajib diisi.');
      return;
    }
    if (!isPercentageMode && formData.nominalSatuan <= 0) {
      setError('Nominal biaya satuan harus lebih besar dari 0.');
      return;
    }
    if (isPercentageMode && (percentageRate <= 0 || percentageRate > 100)) {
      setError('Nilai persentase harus antara 1% hingga 100%.');
      return;
    }
    if (!formData.unit.trim()) {
      setError('Satuan / unit wajib diisi.');
      return;
    }

    const itemToSave: BantuanCatalogItem = {
      ...formData,
      id: formData.id || `cat_${Date.now()}`,
      name: formData.name.trim(),
      unit: formData.unit.trim(),
      description: formData.description.trim(),
      isPercentage: isPercentageMode,
      percentageRate: isPercentageMode ? percentageRate : undefined,
      nominalSatuan: isPercentageMode ? 0 : formData.nominalSatuan,
      checklistItems: hasChecklist && checklistItems.length > 0 ? checklistItems : undefined,
      jenjangApplicable: applyToAllJenjang || selectedJenjang.length === 0 ? undefined : selectedJenjang
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                {editingItem ? 'Edit Komponen Standar Biaya' : 'Tambah Komponen Standar Biaya'}
              </h2>
              <p className="text-xs text-slate-400">
                Katalog Standar Biaya Satuan Revitalisasi Sarpras (Page 2)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with scroll */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Komponen */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nama Menu / Komponen Bantuan *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Utilitas atau RKB (Ruang Kelas Baru)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
              />
            </div>

            {/* Skema Penghitungan Nominal */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>Skema Biaya: Nominal Baku Tetap vs Persentase Ajuan</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPercentageMode(false);
                      if (formData.unit.includes('%')) {
                        setFormData({ ...formData, unit: 'Paket' });
                      }
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      !isPercentageMode
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Nominal Tetap (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPercentageMode(true);
                      setPercentageRate(15);
                      setFormData({ ...formData, unit: 'Paket Kawasan (15%)' });
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isPercentageMode
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    15% dari Semua Ajuan
                  </button>
                </div>
              </div>

              {isPercentageMode ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-300">Persentase Pagu:</span>
                    <div className="relative w-28">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={percentageRate}
                        onChange={(e) => setPercentageRate(Number(e.target.value))}
                        className="w-full pl-3 pr-7 py-1.5 rounded-lg bg-slate-900 border border-amber-400 text-amber-300 font-mono-code font-bold text-sm text-center"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold">%</span>
                    </div>
                    <span className="text-slate-300">dari total nilai semua usulan fisik</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    Nilai nominal akan dihitung otomatis sebesar <strong>{percentageRate}%</strong> dari total ajuan sekolah saat pengusul memilih komponen ini.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-code font-bold text-emerald-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      required={!isPercentageMode}
                      min={0}
                      step={1000000}
                      value={formData.nominalSatuan}
                      onChange={(e) => setFormData({ ...formData, nominalSatuan: Math.max(0, Number(e.target.value)) })}
                      placeholder="400000000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/70 border border-white/15 text-emerald-400 font-mono-code font-bold text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-400/80 font-mono-code mt-1">
                    Format: {formatRupiah(formData.nominalSatuan || 0)}
                  </p>
                </div>
              )}
            </div>

            {/* Satuan / Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Satuan / Unit *
              </label>
              <input
                type="text"
                required
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Contoh: Ruang, Unit / Blok, Paket Kawasan (15%)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Kategori Komponen *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
              >
                <option value="ruang_utama">Ruang Utama</option>
                <option value="ruang_penunjang">Ruang Penunjang</option>
                <option value="sarana_utilitas">Sarana & Utilitas</option>
                <option value="rehab">Rehabilitasi / Pengecatan</option>
              </select>
            </div>

            {/* Sub-Komponen Ceklis (Utilitas 8 Item) */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Sub-Komponen / Pilihan Ceklis Pengusul</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Opsi item yang dapat diceklis oleh pihak sekolah saat memilih komponen ini
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-emerald-300">
                    <input
                      type="checkbox"
                      checked={hasChecklist}
                      onChange={(e) => {
                        setHasChecklist(e.target.checked);
                        if (e.target.checked && checklistItems.length === 0) {
                          setChecklistItems(DEFAULT_UTILITAS_CHECKLIST);
                        }
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-800 border-white/20"
                    />
                    <span>Aktifkan Ceklis</span>
                  </label>
                  {hasChecklist && (
                    <button
                      type="button"
                      onClick={handleResetToDefaultUtilitas}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-slate-300 rounded-lg text-[11px] flex items-center gap-1 font-semibold"
                      title="Isi dengan 8 item utilitas standar"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-400" />
                      <span>8 Item Utilitas Standar</span>
                    </button>
                  )}
                </div>
              </div>

              {hasChecklist && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {checklistItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-medium"
                      >
                        <span className="font-bold text-emerald-400">{idx + 1}.</span>
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(idx)}
                          className="text-emerald-400 hover:text-red-300 ml-1 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newChecklistInput}
                      onChange={(e) => setNewChecklistInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                      placeholder="Tambah item ceklis (misal: Pagar, Sanitasi, dll)"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddChecklistItem}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi Spesifikasi Teknis */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Deskripsi Spesifikasi Teknis
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi teknis dan kelengkapan fasilitas sarana prasarana..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md resize-none"
              />
            </div>

            {/* Jenjang Applicability */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Cakupan Jenjang Pendidikan:
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-indigo-300">
                  <input
                    type="checkbox"
                    checked={applyToAllJenjang}
                    onChange={(e) => {
                      setApplyToAllJenjang(e.target.checked);
                      if (e.target.checked) setSelectedJenjang([]);
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-800 border-white/20"
                  />
                  <span>Berlaku untuk Semua Jenjang</span>
                </label>
              </div>

              {!applyToAllJenjang && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
                  {JENJANG_LIST.map((jenjang) => {
                    const isChecked = selectedJenjang.includes(jenjang);
                    return (
                      <button
                        key={jenjang}
                        type="button"
                        onClick={() => handleToggleJenjang(jenjang)}
                        className={`p-2 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span>{jenjang}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white rounded-2xl hover:bg-white/10 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Simpan Perubahan' : 'Tambah ke Katalog'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
