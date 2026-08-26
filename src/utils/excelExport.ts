import * as XLSX from 'xlsx';
import { PengajuanRevitalisasi, JenjangType, BantuanCatalogItem } from '../types';
import { getStoredCatalog } from './storage';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function exportRekapitulasiExcel(
  proposals: PengajuanRevitalisasi[],
  customFileName?: string,
  filterJenjang?: JenjangType | 'ALL'
) {
  const wb = XLSX.utils.book_new();

  // Filter if needed
  const targetProposals = filterJenjang && filterJenjang !== 'ALL'
    ? proposals.filter(p => p.jenjang === filterJenjang)
    : proposals;

  // Build Primary Rekapitulasi Sheet matching PDF format
  const rows: any[][] = [];

  // Title Headers
  rows.push(['REKAPITULASI USULAN PROGRAM REVITALISASI SARANA & PRASARANA SEKOLAH TAHUN ANGGARAN 2027']);
  rows.push([`Kementerian Pendidikan Dasar dan Menengah | Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`]);
  rows.push([]); // Empty row

  // Table Headers (Columns 1 to 18 as per document)
  const headerColNames = [
    'No',
    'Nama Sekolah',
    'NPSN',
    'Alamat Sekolah',
    'Kecamatan',
    'Kabupaten',
    'Provinsi',
    'Nama Kepala Sekolah',
    'No HP Kepala Sekolah',
    'Jumlah Murid',
    'Pengajuan Bantuan',
    'Nilai Pengajuan',
    'Luas Lahan Kosong',
    'Status Lahan',
    'LINK SERTIFIKAT/WAKAF/AIW/HIBBAH',
    'LINK SITEPLAN SEKOLAH',
    'LOKASI SEKOLAH /GOOGLE MAP',
    'LINK FILE PROPOSAL PDF GOOGLE DRIVE'
  ];

  const headerColNumbers = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'
  ];

  rows.push(headerColNames);
  rows.push(headerColNumbers);

  const jenjangOrder: JenjangType[] = [
    'SMK',
    'SMA',
    'SMP',
    'SD',
    'TK/PAUD/KOBER/SPS',
    'SLB',
    'PKBM'
  ];

  const jenjangCounts: Record<string, number> = {};

  jenjangOrder.forEach(jenjang => {
    const list = targetProposals.filter(p => p.jenjang === jenjang);
    jenjangCounts[jenjang] = list.length;

    if (filterJenjang && filterJenjang !== 'ALL' && filterJenjang !== jenjang) {
      return;
    }

    // Section Header row for the Jenjang (e.g. "SMK")
    rows.push([jenjang, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);

    if (list.length === 0) {
      // Empty row placeholder
      rows.push(['1', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    } else {
      list.forEach((item, index) => {
        rows.push([
          index + 1,
          item.namaSekolah,
          item.npsn,
          item.alamatSekolah,
          item.kecamatan,
          item.kabupaten,
          item.provinsi,
          item.namaKepalaSekolah,
          item.noHpKepalaSekolah,
          `${item.jumlahMurid.toLocaleString('id-ID')} Siswa`,
          item.pengajuanBantuan || item.rincianBantuan?.map(r => `${r.quantity} ${r.name}`).join(', '),
          formatRupiah(item.nilaiPengajuan),
          `${item.luasLahanKosong.toLocaleString('id-ID')} m2`,
          item.statusLahan,
          item.linkSertifikat || '-',
          item.linkSiteplan || '-',
          item.linkGoogleMap || '-',
          item.linkProposalPdf || '-'
        ]);
      });
    }
  });

  // Add spacing before Summary Table
  rows.push([]);
  rows.push([]);

  // Summary Table: JENJANG | JUMLAH (as seen in bottom left of PDF Page 1)
  rows.push(['JENJANG', 'JUMLAH SEKOLAH']);
  let totalAll = 0;
  jenjangOrder.forEach((j, idx) => {
    const count = jenjangCounts[j] || 0;
    totalAll += count;
    rows.push([`${idx + 1}. ${j}`, count]);
  });
  rows.push(['TOTAL', totalAll]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set Column Widths for good readability
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 36 }, // Nama Sekolah
    { wch: 14 }, // NPSN
    { wch: 45 }, // Alamat
    { wch: 18 }, // Kecamatan
    { wch: 24 }, // Kabupaten
    { wch: 16 }, // Provinsi
    { wch: 26 }, // Nama Kepsek
    { wch: 18 }, // No HP
    { wch: 15 }, // Jumlah Murid
    { wch: 45 }, // Pengajuan Bantuan
    { wch: 22 }, // Nilai Pengajuan
    { wch: 18 }, // Luas Lahan
    { wch: 28 }, // Status Lahan
    { wch: 40 }, // Link Sertifikat
    { wch: 40 }, // Link Siteplan
    { wch: 40 }, // Link Map
    { wch: 40 }  // Link Proposal
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'REKAP_REVITALISASI_2027');

  // Sheet 2: STANDAR BIAYA SARPRAS (Page 2 in the uploaded PDF)
  const costRows: any[][] = [];
  costRows.push(['STANDAR HARGA SATUAN BIAYA REVITALISASI SARPRAS TAHUN ANGGARAN 2027']);
  costRows.push(['Panduan Standar Komponen Sarana & Prasarana Sekolah']);
  costRows.push([]);
  costRows.push(['Menu / Komponen Bantuan', 'Nominal Satuan (Rp)', 'Satuan', 'Kategori', 'Keterangan']);

  const catalog = getStoredCatalog();
  catalog.forEach(item => {
    costRows.push([
      item.name,
      formatRupiah(item.nominalSatuan),
      item.unit,
      item.category.toUpperCase().replace('_', ' '),
      item.description
    ]);
  });

  const wsCost = XLSX.utils.aoa_to_sheet(costRows);
  wsCost['!cols'] = [
    { wch: 40 },
    { wch: 22 },
    { wch: 15 },
    { wch: 20 },
    { wch: 55 }
  ];
  XLSX.utils.book_append_sheet(wb, wsCost, 'STANDAR_BIAYA_SARPRAS');

  // Sheet 3: RINCIAN USULAN ITEM SELURUH SEKOLAH
  const itemRows: any[][] = [];
  itemRows.push(['RINCIAN USULAN KOMPONEN BIAYA PER SEKOLAH (RAB T.A. 2027)']);
  itemRows.push([]);
  itemRows.push(['No', 'Nama Sekolah', 'Jenjang', 'NPSN', 'Komponen / Menu', 'Nominal Satuan', 'Jumlah (Unit)', 'Total Biaya (Rp)']);

  let itemCounter = 1;
  targetProposals.forEach(school => {
    if (school.rincianBantuan && school.rincianBantuan.length > 0) {
      school.rincianBantuan.forEach(r => {
        itemRows.push([
          itemCounter++,
          school.namaSekolah,
          school.jenjang,
          school.npsn,
          r.name,
          formatRupiah(r.nominalSatuan),
          r.quantity,
          formatRupiah(r.total)
        ]);
      });
    }
  });

  const wsItems = XLSX.utils.aoa_to_sheet(itemRows);
  wsItems['!cols'] = [
    { wch: 6 },
    { wch: 34 },
    { wch: 12 },
    { wch: 14 },
    { wch: 32 },
    { wch: 20 },
    { wch: 14 },
    { wch: 22 }
  ];
  XLSX.utils.book_append_sheet(wb, wsItems, 'RINCIAN_RAB_SEKOLAH');

  // Write file & trigger browser download
  const dateStr = new Date().toISOString().split('T')[0];
  const finalFileName = customFileName || `Rekap_Pengajuan_Revitalisasi_TA_2027_${dateStr}.xlsx`;
  XLSX.writeFile(wb, finalFileName);
}

export function exportSingleProposalRAB(proposal: PengajuanRevitalisasi) {
  const wb = XLSX.utils.book_new();
  const rows: any[][] = [];

  rows.push([`RINCIAN ANGGARAN BIAYA (RAB) REVITALISASI T.A. 2027`]);
  rows.push([`Nama Sekolah: ${proposal.namaSekolah} (${proposal.jenjang})`]);
  rows.push([`NPSN: ${proposal.npsn} | No. Registrasi: ${proposal.nomorRegistrasi}`]);
  rows.push([`Kepala Sekolah: ${proposal.namaKepalaSekolah} (${proposal.noHpKepalaSekolah})`]);
  rows.push([`Alamat: ${proposal.alamatSekolah}, ${proposal.kecamatan}, ${proposal.kabupaten}, ${proposal.provinsi}`]);
  rows.push([]);

  // Page 2 Format: Menu | Nominal | Jumlah | Total
  rows.push(['Menu', 'Nominal', 'Jumlah', 'Total']);

  proposal.rincianBantuan.forEach(item => {
    rows.push([
      item.name,
      formatRupiah(item.nominalSatuan),
      item.quantity,
      formatRupiah(item.total)
    ]);
  });

  rows.push(['Total', '', '', formatRupiah(proposal.nilaiPengajuan)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 45 },
    { wch: 22 },
    { wch: 12 },
    { wch: 24 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'RAB_SEKOLAH');
  const safeName = proposal.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  XLSX.writeFile(wb, `RAB_${safeName}_TA2027.xlsx`);
}
