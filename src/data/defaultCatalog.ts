import { BantuanCatalogItem, JenjangType, StatusLahanType } from '../types';

export const JENJANG_LIST: JenjangType[] = [
  'TK/PAUD/KOBER/SPS',
  'SD',
  'SMP',
  'SMA',
  'SMK',
  'SLB',
  'PKBM'
];

export const DEFAULT_UTILITAS_CHECKLIST: string[] = [
  'Pagar',
  'Taman',
  'Lapangan',
  'Paffing Blok',
  'Jalan',
  'Turab',
  'Sanitasi',
  'Pengeboran Sumur'
];

export const STATUS_LAHAN_OPTIONS: StatusLahanType[] = [
  'Wakaf/AIW Yayasan',
  'Sertifikat Hak Milik Yayasan',
  'Sertifikat Hak Milik Pribadi/Hibah',
  'Sertifikat Negara / Milik Pemerintah',
  'Hibah Yayasan / Masyarakat',
  'Hak Guna Bangunan',
  'Surat Keterangan Tanah Desa/Adat'
];

export const STANDARD_CATALOG: BantuanCatalogItem[] = [
  {
    id: 'rkb',
    name: 'RKB (Ruang Kelas Baru)',
    category: 'ruang_utama',
    nominalSatuan: 400000000,
    unit: 'Ruang',
    description: 'Pembangunan Ruang Kelas Baru standar lengkap dengan meubilair meja kursi siswa dan guru.'
  },
  {
    id: 'perpustakaan',
    name: 'Perpustakaan',
    category: 'ruang_penunjang',
    nominalSatuan: 432000000,
    unit: 'Ruang / Gedung',
    description: 'Pembangunan Gedung Perpustakaan ramah anak dilengkapi rak buku dan fasilitas baca.'
  },
  {
    id: 'radm',
    name: 'R.ADM (Ruang Administrasi / TU)',
    category: 'ruang_utama',
    nominalSatuan: 432000000,
    unit: 'Ruang',
    description: 'Pembangunan Ruang Administrasi & Tata Usaha untuk kelancaran administrasi sekolah.'
  },
  {
    id: 'toilet',
    name: 'Toilet / MCK & Sanitasi',
    category: 'sarana_utilitas',
    nominalSatuan: 120000000,
    unit: 'Unit / Blok',
    description: 'Pembangunan fasilitas sanitasi & toilet ramah anak, bersih, higienis serta inklusif.'
  },
  {
    id: 'rps',
    name: 'RPS / Laboratorium Vokasi',
    category: 'ruang_utama',
    nominalSatuan: 432000000,
    unit: 'Ruang / Bengkel',
    jenjangApplicable: ['SMK', 'SMA', 'SMP', 'PKBM', 'SLB'],
    description: 'Pembangunan Ruang Praktik Siswa / Bengkel Kerja / Lab Terpadu spesifik kejuruan.'
  },
  {
    id: 'ruang_bk',
    name: 'Ruang BK (Bimbingan Konseling)',
    category: 'ruang_penunjang',
    nominalSatuan: 300000000,
    unit: 'Ruang',
    description: 'Pembangunan Ruang Konseling & Konsultasi BK yang nyaman dan privat.'
  },
  {
    id: 'gedung_kepsek_guru',
    name: 'Gedung / Ruang Kepsek & Guru / Serbaguna',
    category: 'ruang_utama',
    nominalSatuan: 300000000,
    unit: 'Ruang / Gedung',
    description: 'Pembangunan Ruang Pimpinan, Dewan Guru dan Ruang Rapat / Aula Serbaguna.'
  },
  {
    id: 'pengecatan_rehab',
    name: 'Pengecatan & Rehab Ruang Lainnya',
    category: 'rehab',
    nominalSatuan: 50000000,
    unit: 'Paket / Ruang',
    description: 'Perbaikan kusen, genteng/plafon, pintu, jendela, dan pengecatan gedung sekolah.'
  },
  {
    id: 'utilitas',
    name: 'Utilitas',
    category: 'sarana_utilitas',
    nominalSatuan: 0,
    unit: 'Paket Kawasan (15%)',
    isPercentage: true,
    percentageRate: 15,
    checklistItems: DEFAULT_UTILITAS_CHECKLIST,
    description: 'Komponen Bantuan Utilitas (Pagar, Taman, Lapangan, Paffing Blok, Jalan, Turab, Sanitasi, Pengeboran Sumur) dengan nilai nominal 15% dari semua ajuan fisik.'
  },
  {
    id: 'lab_komputer',
    name: 'Laboratorium Komputer / Digital TIK',
    category: 'ruang_utama',
    nominalSatuan: 400000000,
    unit: 'Ruang',
    description: 'Pembangunan Ruang Laboratorium Komputer dan Jaringan Internet Sekolah.'
  },
  {
    id: 'ruang_uks',
    name: 'Ruang UKS (Usaha Kesehatan Sekolah)',
    category: 'ruang_penunjang',
    nominalSatuan: 150000000,
    unit: 'Ruang',
    description: 'Pembangunan Ruang UKS beserta fasilitas tempat tidur medis dan kotak P3K.'
  },
  {
    id: 'ape_paud',
    name: 'APE (Alat Peraga Edukatif) Dalam/Luar',
    category: 'sarana_utilitas',
    nominalSatuan: 50000000,
    unit: 'Paket',
    jenjangApplicable: ['TK/PAUD/KOBER/SPS'],
    description: 'Pengadaan paket APE indoor & playground outdoor ramah motorik anak usia dini.'
  },
  {
    id: 'sensori_slb',
    name: 'Ruang Terapi & Sensori Integrasi',
    category: 'ruang_utama',
    nominalSatuan: 300000000,
    unit: 'Ruang',
    jenjangApplicable: ['SLB'],
    description: 'Pembangunan ruang khusus terapi sensori motorik dan bina diri anak berkebutuhan khusus.'
  }
];

export const JENJANG_COLORS: Record<JenjangType, { badge: string; border: string; bg: string; text: string }> = {
  'TK/PAUD/KOBER/SPS': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-rose-500',
    bg: 'bg-rose-500',
    text: 'text-rose-600'
  },
  'SD': {
    badge: 'bg-red-50 text-red-700 border-red-200',
    border: 'border-red-500',
    bg: 'bg-red-500',
    text: 'text-red-600'
  },
  'SMP': {
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    border: 'border-sky-500',
    bg: 'bg-sky-500',
    text: 'text-sky-600'
  },
  'SMA': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'border-indigo-500',
    bg: 'bg-indigo-500',
    text: 'text-indigo-600'
  },
  'SMK': {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-emerald-500',
    bg: 'bg-emerald-500',
    text: 'text-emerald-600'
  },
  'SLB': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    border: 'border-purple-500',
    bg: 'bg-purple-500',
    text: 'text-purple-600'
  },
  'PKBM': {
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-500',
    bg: 'bg-amber-500',
    text: 'text-amber-600'
  }
};
