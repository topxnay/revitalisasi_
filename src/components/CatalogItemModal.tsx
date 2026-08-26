import React, { useState, useEffect } from 'react';
import { X, Save, Layers, DollarSign, Tag, Check, AlertCircle } from 'lucide-react';
import { BantuanCatalogItem, JenjangType } from '../types';
import { JENJANG_LIST } from '../data/defaultCatalog';
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
    jenjangApplicable: undefined
  });

  const [applyToAllJenjang, setApplyToAllJenjang] = useState(true);
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangType[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
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
        jenjangApplicable: undefined
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama komponen bantuan wajib diisi.');
      return;
    }
    if (formData.nominalSatuan <= 0) {
      setError('Nominal biaya satuan harus lebih besar dari 0.');
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
      jenjangApplicable: applyToAllJenjang || selectedJenjang.length === 0 ? undefined : selectedJenjang
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
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
                placeholder="Contoh: RKB (Ruang Kelas Baru)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
              />
            </div>

            {/* Nominal Biaya Satuan */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nominal Biaya Satuan (Rp) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-code font-bold text-emerald-400">
                  Rp
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000000}
                  value={formData.nominalSatuan}
                  onChange={(e) => setFormData({ ...formData, nominalSatuan: Math.max(0, Number(e.target.value)) })}
                  placeholder="400000000"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-emerald-400 font-mono-code font-bold text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md"
                />
              </div>
              <p className="text-[11px] text-emerald-400/80 font-mono-code mt-1">
                Format: {formatRupiah(formData.nominalSatuan || 0)}
              </p>
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
                placeholder="Contoh: Ruang, Unit / Blok, Paket"
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

            {/* Deskripsi Spesifikasi Teknis */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Deskripsi Spesifikasi Teknis
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi teknis dan kelengkapan fasilitas sarana prasarana..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-800/70 border border-white/15 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-md resize-none"
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
