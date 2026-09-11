export type UserRole = 'admin' | 'user';

export type JenjangType = 
  | 'TK/PAUD/KOBER/SPS'
  | 'SD'
  | 'SMP'
  | 'SMA'
  | 'SMK'
  | 'SLB'
  | 'PKBM';

export type StatusLahanType = 
  | 'Wakaf/AIW Yayasan'
  | 'Sertifikat Hak Milik Yayasan'
  | 'Sertifikat Hak Milik Pribadi/Hibah'
  | 'Sertifikat Negara / Milik Pemerintah'
  | 'Hibah Yayasan / Masyarakat'
  | 'Hak Guna Bangunan'
  | 'Surat Keterangan Tanah Desa/Adat';

export type StatusPengajuan = 
  | 'draft'
  | 'diajukan'
  | 'diverifikasi'
  | 'disetujui'
  | 'perlu_perbaikan'
  | 'ditolak';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: UserRole;
  email: string;
  noHp: string;
  namaSekolah?: string;
  npsn?: string;
  jenjang?: JenjangType;
  kabupaten?: string;
  provinsi?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface BantuanCatalogItem {
  id: string;
  name: string;
  category: 'ruang_utama' | 'ruang_penunjang' | 'sarana_utilitas' | 'rehab';
  nominalSatuan: number;
  unit: string;
  jenjangApplicable?: JenjangType[]; // if undefined, applies to all
  description: string;
}

export interface BantuanItemSelection {
  itemId: string;
  name: string;
  nominalSatuan: number;
  quantity: number;
  total: number;
  customNote?: string;
}

export interface PengajuanRevitalisasi {
  id: string;
  nomorRegistrasi: string;
  userId: string;
  jenjang: JenjangType;
  
  // 18 Standard Columns as per Document
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  namaKepalaSekolah: string;
  noHpKepalaSekolah: string;
  jumlahMurid: number;
  pengajuanBantuan: string; // Summary string e.g. "7 RKB, 1 Perpustakaan, 3 Toilet..."
  nilaiPengajuan: number; // Total nominal e.g. 5406000000
  luasLahanKosong: number; // in m2
  statusLahan: StatusLahanType;
  linkSertifikat: string; // LINK SERTIFIKAT/WAKAF/AIW/HIBBAH (Google Drive)
  linkSiteplan: string; // LINK SITEPLAN SEKOLAH (Google Drive)
  linkGoogleMap: string; // LOKASI SEKOLAH / GOOGLE MAP
  linkProposalPdf: string; // LINK FILE PROPOSAL PDF GOOGLE DRIVE
  
  // Additional application meta & tracking
  rincianBantuan: BantuanItemSelection[];
  statusPengajuan: StatusPengajuan;
  tahunAnggaran: string; // "2027"
  tanggalPengajuan: string;
  catatanVerifikasi?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  skorKelayakan?: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export interface SystemStats {
  totalSekolah: number;
  totalNilaiPengajuan: number;
  perJenjang: Record<JenjangType, number>;
  perStatus: Record<StatusPengajuan, number>;
}

export interface AppThemeConfig {
  presetId: string;
  name: string;
  bgColor: string;
  textColor: string;
  ambientColor1: string;
  ambientColor2: string;
  ambientColor3: string;
  isLightMode?: boolean;
}
