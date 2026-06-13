// Mock data untuk sistem dashboard monitoring DPRD

export interface BidangData {
  id: string;
  nama: string;
  subBidang: SubBidangData[];
}

export interface SubBidangData {
  id: string;
  nama: string;
  paguDefault: number;
  kegiatan: KegiatanTemplate[];
}

export interface KegiatanTemplate {
  id: string;
  nama: string;
  pagu: number;
}

// Sumber: E-controlling 2026 Rekap Progres Agenda – Sekretariat DPRD Provinsi Jawa Tengah
export const masterBidang: BidangData[] = [
  {
    id: 'bid-1',
    nama: 'Sekretariat DPRD',
    subBidang: [
      {
        id: 'sub-1',
        nama: 'Perencanaan & Evaluasi Kinerja',
        paguDefault: 712_581_000,
        kegiatan: [
          { id: 'k-1', nama: 'Penyusunan Dokumen Perencanaan Perangkat Daerah', pagu: 442_601_000 },
          { id: 'k-2', nama: 'Evaluasi Kinerja Perangkat Daerah', pagu: 219_980_000 },
          { id: 'k-3', nama: 'Pengumpulan Data Statistik Sektoral Daerah', pagu: 25_000_000 },
          { id: 'k-4', nama: 'Penyelenggaraan Walidata Pendukung Statistik', pagu: 25_000_000 },
        ],
      },
      {
        id: 'sub-2',
        nama: 'Administrasi Keuangan Perangkat Daerah',
        paguDefault: 19_550_589_000,
        kegiatan: [
          { id: 'k-5', nama: 'Penyediaan Gaji dan Tunjangan ASN', pagu: 18_570_007_000 },
          { id: 'k-6', nama: 'Penyediaan Administrasi Pelaksanaan Tugas ASN', pagu: 980_582_000 },
        ],
      },
      {
        id: 'sub-3',
        nama: 'Layanan Keuangan & Kesejahteraan DPRD',
        paguDefault: 148_113_423_000,
        kegiatan: [
          { id: 'k-7', nama: 'Penyelenggaraan Administrasi Keuangan DPRD', pagu: 148_113_423_000 },
        ],
      },
    ],
  },
  {
    id: 'bid-2',
    nama: 'Bagian Umum',
    subBidang: [
      {
        id: 'sub-4',
        nama: 'Administrasi Umum Perangkat Daerah',
        paguDefault: 7_464_110_000,
        kegiatan: [
          { id: 'k-8', nama: 'Penyediaan Komponen Instalasi Listrik / Penerangan', pagu: 244_485_000 },
          { id: 'k-9', nama: 'Penyediaan Bahan Logistik Kantor', pagu: 187_269_000 },
          { id: 'k-10', nama: 'Penyediaan Bahan Bacaan dan Peraturan Perundang-undangan', pagu: 96_565_000 },
          { id: 'k-11', nama: 'Fasilitasi Kunjungan Tamu', pagu: 6_141_465_000 },
          { id: 'k-12', nama: 'Rapat Koordinasi dan Konsultasi SKPD', pagu: 672_366_000 },
          { id: 'k-13', nama: 'Penatausahaan Arsip Dinamis pada SKPD', pagu: 121_960_000 },
        ],
      },
      {
        id: 'sub-5',
        nama: 'Administrasi Kepegawaian',
        paguDefault: 471_428_000,
        kegiatan: [
          { id: 'k-14', nama: 'Pendataan dan Pengolahan Administrasi Kepegawaian', pagu: 141_168_000 },
          { id: 'k-15', nama: 'Pendidikan dan Pelatihan Pegawai', pagu: 330_260_000 },
        ],
      },
      {
        id: 'sub-6',
        nama: 'Pengadaan Barang Milik Daerah',
        paguDefault: 10_309_086_000,
        kegiatan: [
          { id: 'k-16', nama: 'Pengadaan Kendaraan Perorangan Dinas / Jabatan', pagu: 4_002_240_000 },
          { id: 'k-17', nama: 'Pengadaan Mebel', pagu: 2_048_833_000 },
          { id: 'k-18', nama: 'Pengadaan Peralatan dan Mesin Lainnya', pagu: 1_443_188_000 },
          { id: 'k-19', nama: 'Pengadaan Sarana dan Prasarana Gedung Kantor', pagu: 2_814_825_000 },
        ],
      },
      {
        id: 'sub-7',
        nama: 'Pemeliharaan Barang Milik Daerah',
        paguDefault: 11_282_023_000,
        kegiatan: [
          { id: 'k-20', nama: 'Pemeliharaan Kendaraan Dinas Jabatan', pagu: 596_253_000 },
          { id: 'k-21', nama: 'Pemeliharaan Kendaraan Dinas Operasional', pagu: 2_712_428_000 },
          { id: 'k-22', nama: 'Pemeliharaan Mebel', pagu: 86_425_000 },
          { id: 'k-23', nama: 'Pemeliharaan / Rehabilitasi Gedung Kantor', pagu: 5_191_084_000 },
          { id: 'k-24', nama: 'Pemeliharaan / Rehabilitasi Sarana Prasarana Gedung', pagu: 2_695_833_000 },
        ],
      },
      {
        id: 'sub-8',
        nama: 'Penyediaan Jasa Penunjang',
        paguDefault: 28_689_992_000,
        kegiatan: [
          { id: 'k-25', nama: 'Penyediaan Jasa Surat Menyurat', pagu: 145_708_000 },
          { id: 'k-26', nama: 'Penyediaan Jasa Komunikasi, Air dan Listrik', pagu: 4_474_000_000 },
          { id: 'k-27', nama: 'Penyediaan Jasa Peralatan dan Perlengkapan Kantor', pagu: 900_761_000 },
          { id: 'k-28', nama: 'Penyediaan Jasa Pelayanan Umum Kantor', pagu: 23_169_523_000 },
        ],
      },
    ],
  },
  {
    id: 'bid-3',
    nama: 'Bagian Humas',
    subBidang: [
      {
        id: 'sub-9',
        nama: 'Peningkatan Kapasitas DPRD',
        paguDefault: 130_044_388_000,
        kegiatan: [
          { id: 'k-29', nama: 'Penyediaan Kelompok Pakar dan Tim Ahli', pagu: 1_939_086_000 },
          { id: 'k-30', nama: 'Penyediaan Tenaga Ahli Fraksi', pagu: 418_741_000 },
          { id: 'k-31', nama: 'Penyelenggaraan Hubungan Masyarakat', pagu: 12_166_561_000 },
          { id: 'k-32', nama: 'Penyusunan Program Kerja DPRD', pagu: 115_520_000_000 },
        ],
      },
      {
        id: 'sub-10',
        nama: 'Pembahasan Kerja Sama Daerah',
        paguDefault: 101_540_000_000,
        kegiatan: [
          { id: 'k-33', nama: 'Penyusunan Bahan Komunikasi dan Publikasi', pagu: 101_540_000_000 },
        ],
      },
    ],
  },
  {
    id: 'bid-4',
    nama: 'Bagian Persidangan',
    subBidang: [
      {
        id: 'sub-11',
        nama: 'Pembentukan Perda dan Peraturan DPRD',
        paguDefault: 7_206_440_000,
        kegiatan: [
          { id: 'k-34', nama: 'Penyusunan dan Pembahasan Program Pembentukan Perda', pagu: 4_262_440_000 },
          { id: 'k-35', nama: 'Sosialisasi Peraturan Daerah Bersama DPRD & Pemerintah', pagu: 2_944_000_000 },
        ],
      },
      {
        id: 'sub-12',
        nama: 'Pembahasan Kebijakan Anggaran',
        paguDefault: 2_210_534_000,
        kegiatan: [
          { id: 'k-36', nama: 'Pembahasan APBD', pagu: 2_210_534_000 },
        ],
      },
      {
        id: 'sub-13',
        nama: 'Pengawasan Penyelenggaraan Pemerintahan',
        paguDefault: 12_515_582_000,
        kegiatan: [
          { id: 'k-37', nama: 'Pengawasan Bidang Pemerintahan dan Hukum', pagu: 1_850_000_000 },
          { id: 'k-38', nama: 'Pengawasan Bidang Infrastruktur', pagu: 1_850_000_000 },
          { id: 'k-39', nama: 'Pengawasan Bidang Kesejahteraan Rakyat', pagu: 1_850_000_000 },
          { id: 'k-40', nama: 'Pengawasan Bidang Perekonomian', pagu: 1_850_000_000 },
          { id: 'k-41', nama: 'Pengawasan Bidang Sumber Daya Alam', pagu: 1_850_000_000 },
          { id: 'k-42', nama: 'Pengawasan Penggunaan Anggaran', pagu: 2_095_860_000 },
          { id: 'k-43', nama: 'Pengawasan Tindak Lanjut Hasil Pemeriksaan BPK', pagu: 1_169_722_000 },
        ],
      },
      {
        id: 'sub-14',
        nama: 'Penyerapan Aspirasi Masyarakat',
        paguDefault: 49_184_524_000,
        kegiatan: [
          { id: 'k-44', nama: 'Kunjungan Kerja dalam Daerah', pagu: 10_402_980_000 },
          { id: 'k-45', nama: 'Penyusunan Pokok-Pokok Pikiran DPRD', pagu: 175_000_000 },
          { id: 'k-46', nama: 'Pelaksanaan Reses', pagu: 38_606_544_000 },
        ],
      },
      {
        id: 'sub-15',
        nama: 'Peningkatan Kapasitas & Kode Etik DPRD',
        paguDefault: 5_532_000_000,
        kegiatan: [
          { id: 'k-47', nama: 'Pendalaman Tugas DPRD', pagu: 4_380_000_000 },
          { id: 'k-48', nama: 'Penyusunan Kode Etik DPRD', pagu: 1_152_000_000 },
        ],
      },
      {
        id: 'sub-16',
        nama: 'Fasilitasi Tugas DPRD',
        paguDefault: 21_311_005_000,
        kegiatan: [
          { id: 'k-49', nama: 'Koordinasi dan Konsultasi Pelaksanaan Tugas DPRD', pagu: 21_311_005_000 },
        ],
      },
    ],
  },
  {
    id: 'bid-5',
    nama: 'Keuangan',
    subBidang: [
      {
        id: 'sub-17',
        nama: 'Administrasi Keuangan',
        paguDefault: 19_550_589_000,
        kegiatan: [
          { id: 'k-50', nama: 'Penyediaan Gaji dan Tunjangan ASN', pagu: 18_570_007_000 },
          { id: 'k-51', nama: 'Penyediaan Administrasi Pelaksanaan Tugas ASN', pagu: 980_582_000 },
        ],
      },
      {
        id: 'sub-18',
        nama: 'Layanan Keuangan DPRD',
        paguDefault: 148_113_423_000,
        kegiatan: [
          { id: 'k-52', nama: 'Penyelenggaraan Administrasi Keuangan DPRD', pagu: 148_113_423_000 },
        ],
      },
      {
        id: 'sub-19',
        nama: 'Pelaporan & Akuntabilitas',
        paguDefault: 712_581_000,
        kegiatan: [
          { id: 'k-53', nama: 'Penyusunan Dokumen Perencanaan Perangkat Daerah', pagu: 442_601_000 },
          { id: 'k-54', nama: 'Evaluasi Kinerja Perangkat Daerah', pagu: 219_980_000 },
        ],
      },
    ],
  },
];

export const sumberDanaList = [
  'APBD Provinsi',
  'APBD Kabupaten/Kota',
  'APBN',
  'Dana Alokasi Khusus (DAK)',
  'Dana Alokasi Umum (DAU)',
  'Dana Bagi Hasil (DBH)',
  'Dana Insentif Daerah (DID)',
  'Hibah',
];

export interface KegiatanStep {
  id: string;
  nama: string;
  selesai: boolean;
}

export interface Kegiatan {
  id: string;
  nama: string;
  bidang: string;
  subBidang: string;
  penanggungJawab: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Belum Mulai' | 'Berjalan' | 'Selesai' | 'Overdue' | 'Terlambat';
  progress: number;
  paguAnggaran: number;
  realisasiAnggaran: number;
  deskripsi: string;
  step: 'Persiapan' | 'Koordinasi' | 'Pelaksanaan' | 'Evaluasi' | 'Verifikasi' | 'Closed';
  steps: KegiatanStep[];
}

export interface Bagian {
  id: string;
  nama: string;
  progress: number;
  warna: string;
}

// Progress berdasarkan Realisasi Fisik S/D Mei 2026 (sumber: E-Controlling 2026)
export const bagianList: Bagian[] = [
  { id: '1', nama: 'Sekretariat DPRD', progress: 100, warna: 'bg-blue-500' },
  { id: '2', nama: 'Bagian Humas', progress: 54, warna: 'bg-orange-500' },
  { id: '3', nama: 'Bagian Umum', progress: 42, warna: 'bg-emerald-500' },
  { id: '4', nama: 'Bagian Persidangan', progress: 37, warna: 'bg-purple-500' },
  { id: '5', nama: 'Keuangan', progress: 42, warna: 'bg-amber-500' },
];

export const kegiatanList: Kegiatan[] = [
  {
    id: '1',
    nama: 'Pembahasan Raperda APBD 2025-2029',
    bidang: 'Sekretariat DPRD',
    subBidang: 'Persidangan',
    penanggungJawab: 'Rapat Paripurna',
    tanggalMulai: '2025-05-12',
    tanggalSelesai: '2025-07-12',
    status: 'Selesai',
    progress: 100,
    paguAnggaran: 450000000,
    realisasiAnggaran: 450000000,
    deskripsi: 'Pembahasan dan persetujuan Raperda APBD untuk periode 2025-2029',
    step: 'Closed',
    steps: [
      { id: 's1-1', nama: 'Persiapan Dokumen Raperda', selesai: true },
      { id: 's1-2', nama: 'Koordinasi dengan Komisi', selesai: true },
      { id: 's1-3', nama: 'Rapat Pembahasan Internal', selesai: true },
      { id: 's1-4', nama: 'Sidang Paripurna', selesai: true },
      { id: 's1-5', nama: 'Pengesahan Raperda', selesai: true },
      { id: 's1-6', nama: 'Verifikasi Dokumen', selesai: true },
    ],
  },
  {
    id: '2',
    nama: 'Publikasi & Dokumentasi Kegiatan',
    bidang: 'Bagian Humas',
    subBidang: 'Humas & Publikasi',
    penanggungJawab: 'Kepala Humas',
    tanggalMulai: '2025-05-20',
    tanggalSelesai: '2025-06-26',
    status: 'Berjalan',
    progress: 45,
    paguAnggaran: 320000000,
    realisasiAnggaran: 144000000,
    deskripsi: 'Dokumentasi dan publikasi kegiatan DPRD ke media massa',
    step: 'Koordinasi',
    steps: [
      { id: 's2-1', nama: 'Penyusunan Rencana Publikasi', selesai: true },
      { id: 's2-2', nama: 'Koordinasi Media Partner', selesai: true },
      { id: 's2-3', nama: 'Liputan Kegiatan', selesai: false },
      { id: 's2-4', nama: 'Pengeditan & Review Konten', selesai: false },
      { id: 's2-5', nama: 'Publikasi ke Media', selesai: false },
      { id: 's2-6', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '3',
    nama: 'Rapat Koordinasi Pimpinan',
    bidang: 'Sekretariat DPRD',
    subBidang: 'Sekretariat',
    penanggungJawab: 'Pimpinan DPRD',
    tanggalMulai: '2025-06-09',
    tanggalSelesai: '2025-06-30',
    status: 'Selesai',
    progress: 100,
    paguAnggaran: 150000000,
    realisasiAnggaran: 150000000,
    deskripsi: 'Koordinasi rutin pimpinan DPRD',
    step: 'Closed',
    steps: [
      { id: 's3-1', nama: 'Penyiapan Agenda Rapat', selesai: true },
      { id: 's3-2', nama: 'Undangan & Konfirmasi Peserta', selesai: true },
      { id: 's3-3', nama: 'Pelaksanaan Rapat', selesai: true },
      { id: 's3-4', nama: 'Notulensi & Tindak Lanjut', selesai: true },
      { id: 's3-5', nama: 'Verifikasi Dokumen', selesai: true },
    ],
  },
  {
    id: '4',
    nama: 'Penyusunan Laporan Keuangan Triwulan',
    bidang: 'Keuangan',
    subBidang: 'Pelaporan',
    penanggungJawab: 'Kepala Keuangan',
    tanggalMulai: '2025-06-01',
    tanggalSelesai: '2025-06-14',
    status: 'Terlambat',
    progress: 40,
    paguAnggaran: 280000000,
    realisasiAnggaran: 112000000,
    deskripsi: 'Penyusunan laporan keuangan triwulan',
    step: 'Pelaksanaan',
    steps: [
      { id: 's4-1', nama: 'Pengumpulan Data Keuangan', selesai: true },
      { id: 's4-2', nama: 'Rekonsiliasi Anggaran', selesai: true },
      { id: 's4-3', nama: 'Penyusunan Draft Laporan', selesai: false },
      { id: 's4-4', nama: 'Review Internal', selesai: false },
      { id: 's4-5', nama: 'Perbaikan & Finalisasi', selesai: false },
      { id: 's4-6', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '5',
    nama: 'Sidang Paripurna Pembahasan Raperda',
    bidang: 'Bagian Persidangan',
    subBidang: 'Persidangan',
    penanggungJawab: 'Ketua DPRD',
    tanggalMulai: '2025-06-12',
    tanggalSelesai: '2025-06-20',
    status: 'Berjalan',
    progress: 85,
    paguAnggaran: 200000000,
    realisasiAnggaran: 170000000,
    deskripsi: 'Sidang paripurna pembahasan raperda',
    step: 'Evaluasi',
    steps: [
      { id: 's5-1', nama: 'Persiapan Ruang Sidang', selesai: true },
      { id: 's5-2', nama: 'Distribusi Materi Sidang', selesai: true },
      { id: 's5-3', nama: 'Pembukaan Sidang', selesai: true },
      { id: 's5-4', nama: 'Pembahasan Agenda', selesai: true },
      { id: 's5-5', nama: 'Pengambilan Keputusan', selesai: true },
      { id: 's5-6', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '6',
    nama: 'Pengelolaan Arsip & Surat Dinas',
    bidang: 'Bagian Umum',
    subBidang: 'Tata Usaha',
    penanggungJawab: 'Kepala Bagian Umum',
    tanggalMulai: '2025-06-01',
    tanggalSelesai: '2025-06-30',
    status: 'Berjalan',
    progress: 60,
    paguAnggaran: 120000000,
    realisasiAnggaran: 72000000,
    deskripsi: 'Pengelolaan arsip dan surat-surat dinas DPRD',
    step: 'Pelaksanaan',
    steps: [
      { id: 's6-1', nama: 'Inventarisasi Arsip Lama', selesai: true },
      { id: 's6-2', nama: 'Digitalisasi Dokumen', selesai: true },
      { id: 's6-3', nama: 'Penataan Sistem Kearsipan', selesai: true },
      { id: 's6-4', nama: 'Monitoring & Evaluasi', selesai: false },
      { id: 's6-5', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '7',
    nama: 'Siaran Pers & Media Sosial DPRD',
    bidang: 'Bagian Humas',
    subBidang: 'Humas & Publikasi',
    penanggungJawab: 'Kepala Humas',
    tanggalMulai: '2025-06-05',
    tanggalSelesai: '2025-07-05',
    status: 'Berjalan',
    progress: 50,
    paguAnggaran: 180000000,
    realisasiAnggaran: 90000000,
    deskripsi: 'Pengelolaan siaran pers dan konten media sosial DPRD',
    step: 'Pelaksanaan',
    steps: [
      { id: 's7-1', nama: 'Penyusunan Kalender Konten', selesai: true },
      { id: 's7-2', nama: 'Pembuatan Konten Media Sosial', selesai: true },
      { id: 's7-3', nama: 'Distribusi Siaran Pers', selesai: false },
      { id: 's7-4', nama: 'Monitoring & Evaluasi', selesai: false },
      { id: 's7-5', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '8',
    nama: 'Pengadaan Perlengkapan Kantor',
    bidang: 'Bagian Umum',
    subBidang: 'Perlengkapan',
    penanggungJawab: 'Kepala Bagian Umum',
    tanggalMulai: '2025-06-10',
    tanggalSelesai: '2025-07-10',
    status: 'Berjalan',
    progress: 35,
    paguAnggaran: 250000000,
    realisasiAnggaran: 87500000,
    deskripsi: 'Pengadaan perlengkapan dan peralatan kantor DPRD',
    step: 'Koordinasi',
    steps: [
      { id: 's8-1', nama: 'Identifikasi Kebutuhan', selesai: true },
      { id: 's8-2', nama: 'Penyusunan Spesifikasi', selesai: true },
      { id: 's8-3', nama: 'Proses Pengadaan / Lelang', selesai: false },
      { id: 's8-4', nama: 'Penerimaan & Pemeriksaan Barang', selesai: false },
      { id: 's8-5', nama: 'Distribusi ke Unit Kerja', selesai: false },
      { id: 's8-6', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
  {
    id: '9',
    nama: 'Pembayaran Gaji & Tunjangan',
    bidang: 'Keuangan',
    subBidang: 'Penggajian',
    penanggungJawab: 'Bendahara',
    tanggalMulai: '2025-06-01',
    tanggalSelesai: '2025-06-05',
    status: 'Selesai',
    progress: 100,
    paguAnggaran: 5800000000,
    realisasiAnggaran: 5800000000,
    deskripsi: 'Pembayaran gaji dan tunjangan anggota & pegawai DPRD',
    step: 'Closed',
    steps: [
      { id: 's9-1', nama: 'Rekap Daftar Gaji', selesai: true },
      { id: 's9-2', nama: 'Verifikasi Data Pegawai', selesai: true },
      { id: 's9-3', nama: 'Pencairan Dana', selesai: true },
      { id: 's9-4', nama: 'Transfer / Pembayaran', selesai: true },
      { id: 's9-5', nama: 'Verifikasi Dokumen', selesai: true },
    ],
  },
  {
    id: '10',
    nama: 'Rapat Panitia Khusus Raperda',
    bidang: 'Bagian Persidangan',
    subBidang: 'Persidangan',
    penanggungJawab: 'Ketua Pansus',
    tanggalMulai: '2025-06-15',
    tanggalSelesai: '2025-07-15',
    status: 'Berjalan',
    progress: 20,
    paguAnggaran: 175000000,
    realisasiAnggaran: 35000000,
    deskripsi: 'Rapat Pansus pembahasan Raperda inisiatif DPRD',
    step: 'Persiapan',
    steps: [
      { id: 's10-1', nama: 'Pembentukan Pansus', selesai: true },
      { id: 's10-2', nama: 'Penyusunan Jadwal Rapat', selesai: false },
      { id: 's10-3', nama: 'Pembahasan Draft Raperda', selesai: false },
      { id: 's10-4', nama: 'Konsultasi Publik', selesai: false },
      { id: 's10-5', nama: 'Finalisasi Raperda', selesai: false },
      { id: 's10-6', nama: 'Verifikasi Dokumen', selesai: false },
    ],
  },
];

export const notifikasiList = [
  {
    id: '1',
    type: 'overdue' as const,
    title: '7 kegiatan incidental / overdue',
    message: 'Segera lakukan tindak lanjut oleh Operator Bidang',
    time: '7 jam yang lalu',
  },
  {
    id: '2',
    type: 'belumSelesai' as const,
    title: '16 target belum diselesaikan',
    message: 'Segera lakukan tindak lanjut oleh Operator Bidang',
    time: '3 jam yang lalu',
  },
  {
    id: '3',
    type: 'deadline' as const,
    title: 'Sidang Paripurna hari ini pukul 10.00 WIB',
    message: 'Segera pastikan di Auditorium DPRD tentang rencana...',
    time: '2 jam yang lalu',
  },
  {
    id: '4',
    type: 'selesai' as const,
    title: 'Laporan kegiatan minggu lalu',
    message: 'Klik untuk melihat laporan dokumen',
    time: '1 hari yang lalu',
  },
];

export const agendaHariIni = [
  {
    id: '1',
    waktu: '09:00',
    status: 'berlangsung' as const,
    nama: 'Rapat Koordinasi Pimpinan',
    lokasi: 'Ruang Rapat Pimpinan',
    badge: 'Berlangsung',
  },
  {
    id: '2',
    waktu: '10:00',
    status: 'berlangsung' as const,
    nama: 'Pengecekan Perlengkapan Sidang',
    lokasi: 'Ruang Sidang Paripurna',
    badge: 'Berlangsung',
  },
  {
    id: '3',
    waktu: '13:00',
    status: 'terjadwal' as const,
    nama: 'Liputan & Publikasi Kegiatan',
    lokasi: 'Ruang Media',
    badge: 'Terjadwal',
  },
  {
    id: '4',
    waktu: '14:00',
    status: 'terjadwal' as const,
    nama: 'Penyusunan Laporan Keuangan',
    lokasi: 'Ruang Keuangan',
    badge: 'Terjadwal',
  },
];

export const kegiatanPerBagian: Record<string, { id: string; nama: string; tanggal: string; progress: number; status: string; step: string }[]> = {
  'Sekretariat DPRD': [
    { id: 'k1', nama: 'Penyusunan Dokumen Perencanaan Perangkat Daerah', tanggal: '1 Jan – 31 Des 2026', progress: 100, status: 'Selesai', step: 'Closed' },
    { id: 'k3', nama: 'Evaluasi Kinerja Perangkat Daerah', tanggal: '1 Jan – 31 Des 2026', progress: 100, status: 'Selesai', step: 'Closed' },
    { id: 'ka', nama: 'Penyediaan Gaji dan Tunjangan ASN', tanggal: '1 Jan – 31 Des 2026', progress: 100, status: 'Selesai', step: 'Closed' },
  ],
  'Bagian Humas': [
    { id: 'k2', nama: 'Penyelenggaraan Hubungan Masyarakat', tanggal: '1 Jan – 31 Des 2026', progress: 41, status: 'Berjalan', step: 'Pelaksanaan' },
    { id: 'k7', nama: 'Penyusunan Bahan Komunikasi dan Publikasi', tanggal: '1 Jan – 31 Des 2026', progress: 53, status: 'Berjalan', step: 'Pelaksanaan' },
    { id: 'kb', nama: 'Penyusunan Program Kerja DPRD', tanggal: '1 Jan – 31 Des 2026', progress: 55, status: 'Berjalan', step: 'Pelaksanaan' },
  ],
  'Bagian Umum': [
    { id: 'k6', nama: 'Penatausahaan Arsip Dinamis pada SKPD', tanggal: '1 Jan – 31 Des 2026', progress: 87, status: 'Berjalan', step: 'Evaluasi' },
    { id: 'k8', nama: 'Pengadaan Sarana dan Prasarana Gedung Kantor', tanggal: '1 Jan – 31 Des 2026', progress: 39, status: 'Berjalan', step: 'Koordinasi' },
    { id: 'kc', nama: 'Fasilitasi Kunjungan Tamu', tanggal: '1 Jan – 31 Des 2026', progress: 41, status: 'Berjalan', step: 'Pelaksanaan' },
  ],
  'Bagian Persidangan': [
    { id: 'k5', nama: 'Pembahasan APBD', tanggal: '1 Jan – 31 Des 2026', progress: 33, status: 'Berjalan', step: 'Persiapan' },
    { id: 'k10', nama: 'Penyusunan dan Pembahasan Program Pembentukan Perda', tanggal: '1 Jan – 31 Des 2026', progress: 44, status: 'Berjalan', step: 'Koordinasi' },
    { id: 'kd', nama: 'Kunjungan Kerja dalam Daerah', tanggal: '1 Jan – 31 Des 2026', progress: 36, status: 'Berjalan', step: 'Pelaksanaan' },
    { id: 'ke', nama: 'Pelaksanaan Reses', tanggal: '1 Jan – 31 Des 2026', progress: 31, status: 'Berjalan', step: 'Persiapan' },
  ],
  'Keuangan': [
    { id: 'k4', nama: 'Penyusunan Laporan Keuangan Triwulan', tanggal: '1 Jan – 31 Des 2026', progress: 40, status: 'Terlambat', step: 'Pelaksanaan' },
    { id: 'k9', nama: 'Pembayaran Gaji & Tunjangan ASN', tanggal: '1 – 5 Jun 2026', progress: 100, status: 'Selesai', step: 'Closed' },
    { id: 'kf', nama: 'Penyelenggaraan Administrasi Keuangan DPRD', tanggal: '1 Jan – 31 Des 2026', progress: 39, status: 'Berjalan', step: 'Pelaksanaan' },
  ],
};

export const kegiatanPrioritas = [
  { id: '1', nama: 'Pembahasan Raperda APBD 2025-2029', komisi: 'Pimpinan', tanggal: '12 Mei 2025', progress: 100, status: 'Selesai' as const },
  { id: '2', nama: 'Publikasi & Dokumentasi Kegiatan', komisi: 'Komisi A', tanggal: '20 Mei 2025', progress: 45, status: 'Berjalan' as const },
];

export const kalenderEvents = [
  { date: '2025-06-02', title: 'Kunjungan Kerja', color: 'bg-red-100 text-red-700 border-red-200' },
  { date: '2025-06-10', title: 'Rapat Pimpinan Internal', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { date: '2025-06-12', title: 'Sidang Paripurna', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { date: '2025-06-13', title: 'Sidang Paripurna', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { date: '2025-06-15', title: 'Sidang Paripurna', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { date: '2025-06-18', title: 'Kunjungan Kerja & Evaluasi', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { date: '2025-06-20', title: 'Hari Libur Nasional', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { date: '2025-06-22', title: 'Kunjungan Kerja Daerah Pemilihan', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { date: '2025-06-27', title: 'Kunjungan Kerja Ahli', color: 'bg-red-100 text-red-700 border-red-200' },
  { date: '2025-06-28', title: 'Kunjungan Kerja', color: 'bg-red-100 text-red-700 border-red-200' },
  { date: '2025-06-31', title: 'Masa Reses 2025', color: 'bg-red-100 text-red-700 border-red-200' },
];

// ─── ANGGARAN BULANAN ───────────────────────────────────────────────────────

export interface MonthlyBudget {
  bulan: string;
  singkatan: string;
  pagu: number;        // = totalPagu / 12
  realisasi: number;
  persentase: number;  // realisasi / pagu * 100
}

export interface UraianAnggaran {
  kode: string;
  uraian: string;
  level: 1 | 2 | 3 | 4; // 1=bidang, 2=subbidang, 3=kegiatan, 4=sub kegiatan
  target: number;
  realisasi: number;
}

// Sumber: E-Controlling 2026 – Total Anggaran Sekretariat DPRD Provinsi Jawa Tengah
export const PAGU_TOTAL = 559_427_180_000;

export const BULAN_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];
export const BULAN_SINGKAT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

// Realisasi per bulan – estimasi dari total s/d Mei Rp 246.791.918.544
// (sumber: E-Controlling 2026, rata-rata ≈ Rp 49,4M per bulan)
export const realisasiPerBulan: number[] = [
  47_300_000_000, // Jan
  49_100_000_000, // Feb
  51_200_000_000, // Mar
  52_700_000_000, // Apr
  46_492_000_000, // Mei (real: Rp 47.461.572.961 bulan berjalan)
  0,              // Jun (belum)
  0, 0, 0, 0, 0, 0,
];

export function buildMonthlyBudget(paguTotal: number, realisasi: number[]): MonthlyBudget[] {
  const paguPerBulan = Math.round(paguTotal / 12);
  return BULAN_NAMES.map((bulan, i) => ({
    bulan,
    singkatan: BULAN_SINGKAT[i],
    pagu: paguPerBulan,
    realisasi: realisasi[i] ?? 0,
    persentase: realisasi[i] ? Math.round((realisasi[i] / paguPerBulan) * 100) : 0,
  }));
}

// Uraian anggaran – data nyata dari E-Controlling 2026, Sekretariat DPRD Prov. Jawa Tengah, s/d Mei 2026
export const uraianAnggaran: UraianAnggaran[] = [
  // ── 1. SEKRETARIAT DPRD (Sekretariat) ──────────────────────────────────────
  { kode: '1',     uraian: 'Sekretariat DPRD',                                              level: 1, target: 168_376_593_000, realisasi: 66_460_655_669 },
  { kode: '1.1',   uraian: 'Perencanaan, Penganggaran & Evaluasi Kinerja',                  level: 2, target: 712_581_000,       realisasi: 436_597_100 },
  { kode: '1.1.1', uraian: 'Penyusunan Dokumen Perencanaan Perangkat Daerah',               level: 3, target: 442_601_000,       realisasi: 300_242_400 },
  { kode: '1.1.1.1', uraian: 'Dokumen perencanaan perangkat daerah ASB',                   level: 4, target: 11_082_000,         realisasi: 1_200_000 },
  { kode: '1.1.1.2', uraian: 'Dokumen perencanaan perangkat daerah bukan ASB',             level: 4, target: 431_519_000,        realisasi: 299_042_400 },
  { kode: '1.1.2', uraian: 'Evaluasi Kinerja Perangkat Daerah',                             level: 3, target: 219_980_000,       realisasi: 133_066_700 },
  { kode: '1.1.2.1', uraian: 'Laporan evaluasi kinerja perangkat daerah',                  level: 4, target: 219_980_000,        realisasi: 133_066_700 },
  { kode: '1.1.3', uraian: 'Pengumpulan Data Statistik Sektoral Daerah',                   level: 3, target: 25_000_000,         realisasi: 0 },
  { kode: '1.1.4', uraian: 'Penyelenggaraan Walidata Pendukung Statistik Sektoral',        level: 3, target: 25_000_000,         realisasi: 3_288_000 },
  { kode: '1.2',   uraian: 'Administrasi Keuangan Perangkat Daerah',                       level: 2, target: 19_550_589_000,    realisasi: 8_223_751_698 },
  { kode: '1.2.1', uraian: 'Penyediaan Gaji dan Tunjangan ASN',                            level: 3, target: 18_570_007_000,    realisasi: 7_789_297_798 },
  { kode: '1.2.1.1', uraian: 'Orang yang menerima gaji dan tunjangan ASN',                 level: 4, target: 18_570_007_000,    realisasi: 7_789_297_798 },
  { kode: '1.2.2', uraian: 'Penyediaan Administrasi Pelaksanaan Tugas ASN',                level: 3, target: 980_582_000,        realisasi: 434_453_900 },
  { kode: '1.2.2.1', uraian: 'Dokumen hasil penyediaan administrasi pelaksanaan tugas ASN',level: 4, target: 980_582_000,        realisasi: 434_453_900 },
  { kode: '1.3',   uraian: 'Layanan Keuangan dan Kesejahteraan DPRD',                      level: 2, target: 148_113_423_000,   realisasi: 57_800_306_871 },
  { kode: '1.3.1', uraian: 'Penyelenggaraan Administrasi Keuangan DPRD',                   level: 3, target: 148_113_423_000,   realisasi: 57_800_306_871 },
  { kode: '1.3.1.1', uraian: 'Anggota DPRD yang menerima hak keuangan DPRD',               level: 4, target: 148_113_423_000,   realisasi: 57_800_306_871 },

  // ── 2. BAGIAN UMUM ────────────────────────────────────────────────────────
  { kode: '2',     uraian: 'Bagian Umum',                                                   level: 1, target: 61_506_114_000,    realisasi: 22_812_821_138 },
  { kode: '2.1',   uraian: 'Administrasi Barang Milik Daerah',                             level: 2, target: 1_330_474_000,     realisasi: 422_997_547 },
  { kode: '2.1.1', uraian: 'Pengamanan Barang Milik Daerah SKPD',                          level: 3, target: 1_330_474_000,     realisasi: 422_997_547 },
  { kode: '2.1.1.1', uraian: 'Dokumen pengamanan barang milik daerah',                     level: 4, target: 1_330_474_000,     realisasi: 422_997_547 },
  { kode: '2.2',   uraian: 'Administrasi Kepegawaian Perangkat Daerah',                    level: 2, target: 471_428_000,        realisasi: 52_919_800 },
  { kode: '2.2.1', uraian: 'Pendataan dan Pengolahan Administrasi Kepegawaian',            level: 3, target: 141_168_000,        realisasi: 52_919_800 },
  { kode: '2.2.1.1', uraian: 'Pendataan dan Pengolahan Administrasi Kepegawaian',          level: 4, target: 141_168_000,        realisasi: 52_919_800 },
  { kode: '2.2.2', uraian: 'Pendidikan dan Pelatihan Pegawai',                             level: 3, target: 330_260_000,        realisasi: 0 },
  { kode: '2.2.2.1', uraian: 'Pegawai yang mengikuti pendidikan dan pelatihan',            level: 4, target: 330_260_000,        realisasi: 0 },
  { kode: '2.3',   uraian: 'Administrasi Umum Perangkat Daerah',                           level: 2, target: 7_464_110_000,     realisasi: 3_180_609_525 },
  { kode: '2.3.1', uraian: 'Penyediaan Komponen Instalasi Listrik / Penerangan',           level: 3, target: 244_485_000,        realisasi: 93_495_800 },
  { kode: '2.3.2', uraian: 'Penyediaan Bahan Logistik Kantor',                             level: 3, target: 187_269_000,        realisasi: 75_079_300 },
  { kode: '2.3.3', uraian: 'Penyediaan Bahan Bacaan dan Peraturan Perundang-undangan',     level: 3, target: 96_565_000,         realisasi: 59_968_350 },
  { kode: '2.3.4', uraian: 'Fasilitasi Kunjungan Tamu',                                    level: 3, target: 6_141_465_000,     realisasi: 2_518_246_300 },
  { kode: '2.3.4.1', uraian: 'Laporan fasilitasi kunjungan tamu',                          level: 4, target: 6_141_465_000,     realisasi: 2_518_246_300 },
  { kode: '2.3.5', uraian: 'Penyelenggaraan Rapat Koordinasi dan Konsultasi SKPD',         level: 3, target: 672_366_000,        realisasi: 328_210_575 },
  { kode: '2.3.5.1', uraian: 'Penyelenggaraan Rapat Koordinasi dan Konsultasi SKPD',       level: 4, target: 672_366_000,        realisasi: 328_210_575 },
  { kode: '2.3.6', uraian: 'Penatausahaan Arsip Dinamis pada SKPD',                        level: 3, target: 121_960_000,        realisasi: 105_609_200 },
  { kode: '2.4',   uraian: 'Pengadaan Barang Milik Daerah Penunjang',                      level: 2, target: 10_309_086_000,    realisasi: 6_403_957_855 },
  { kode: '2.4.1', uraian: 'Pengadaan Kendaraan Perorangan Dinas / Jabatan',               level: 3, target: 4_002_240_000,     realisasi: 3_943_200_004 },
  { kode: '2.4.2', uraian: 'Pengadaan Mebel',                                              level: 3, target: 2_048_833_000,     realisasi: 26_375_000 },
  { kode: '2.4.3', uraian: 'Pengadaan Peralatan dan Mesin Lainnya',                        level: 3, target: 1_443_188_000,     realisasi: 1_326_273_001 },
  { kode: '2.4.4', uraian: 'Pengadaan Sarana dan Prasarana Gedung Kantor',                 level: 3, target: 2_814_825_000,     realisasi: 1_108_109_850 },
  { kode: '2.5',   uraian: 'Penyediaan Jasa Penunjang Urusan Pemerintahan',                level: 2, target: 28_689_992_000,    realisasi: 9_374_333_179 },
  { kode: '2.5.1', uraian: 'Penyediaan Jasa Surat Menyurat',                               level: 3, target: 145_708_000,        realisasi: 49_392_600 },
  { kode: '2.5.2', uraian: 'Penyediaan Jasa Komunikasi, Air dan Listrik',                  level: 3, target: 4_474_000_000,     realisasi: 1_151_370_595 },
  { kode: '2.5.3', uraian: 'Penyediaan Jasa Peralatan dan Perlengkapan Kantor',            level: 3, target: 900_761_000,        realisasi: 414_955_000 },
  { kode: '2.5.4', uraian: 'Penyediaan Jasa Pelayanan Umum Kantor',                        level: 3, target: 23_169_523_000,    realisasi: 7_758_614_984 },
  { kode: '2.5.4.1', uraian: 'Penyediaan Jasa Pelayanan Umum Kantor',                      level: 4, target: 20_134_371_484,    realisasi: 6_601_605_496 },
  { kode: '2.5.4.2', uraian: 'Gaji PPPK Paruh Waktu Bagian Keuangan',                     level: 4, target: 180_000_000,        realisasi: 75_000_000 },
  { kode: '2.5.4.3', uraian: 'Gaji PPPK Paruh Waktu Bagian Humas',                        level: 4, target: 925_380_000,        realisasi: 326_150_000 },
  { kode: '2.5.4.4', uraian: 'Gaji PPPK Paruh Waktu Bagian Persidangan',                  level: 4, target: 86_460_000,         realisasi: 36_025_000 },
  { kode: '2.5.4.5', uraian: 'Gaji PPPK Paruh Waktu Bagian Umum',                         level: 4, target: 1_658_400_000,     realisasi: 675_053_333 },
  { kode: '2.6',   uraian: 'Pemeliharaan Barang Milik Daerah Penunjang',                   level: 2, target: 11_282_023_000,    realisasi: 2_871_833_232 },
  { kode: '2.6.1', uraian: 'Pemeliharaan Kendaraan Dinas Jabatan',                         level: 3, target: 596_253_000,        realisasi: 244_867_099 },
  { kode: '2.6.2', uraian: 'Pemeliharaan Kendaraan Dinas Operasional',                     level: 3, target: 2_712_428_000,     realisasi: 1_054_638_686 },
  { kode: '2.6.3', uraian: 'Pemeliharaan Mebel',                                           level: 3, target: 86_425_000,         realisasi: 50_140_000 },
  { kode: '2.6.4', uraian: 'Pemeliharaan / Rehabilitasi Gedung Kantor',                    level: 3, target: 5_191_084_000,     realisasi: 380_988_447 },
  { kode: '2.6.5', uraian: 'Pemeliharaan / Rehabilitasi Sarana Prasarana Gedung',          level: 3, target: 2_695_833_000,     realisasi: 1_141_199_000 },
  { kode: '2.7',   uraian: 'Layanan Keuangan dan Kesejahteraan DPRD (Umum)',               level: 2, target: 1_959_001_000,     realisasi: 506_170_000 },
  { kode: '2.7.1', uraian: 'Penyediaan Pakaian Dinas dan Atribut DPRD',                    level: 3, target: 1_392_880_000,     realisasi: 506_170_000 },
  { kode: '2.7.2', uraian: 'Pelaksanaan Medical Check Up DPRD',                            level: 3, target: 566_121_000,        realisasi: 0 },

  // ── 3. BAGIAN HUMAS ─────────────────────────────────────────
  { kode: '3',     uraian: 'Bagian Humas',                                    level: 1, target: 231_584_388_000,   realisasi: 121_817_534_227 },
  { kode: '3.1',   uraian: 'Peningkatan Kapasitas DPRD',                                   level: 2, target: 130_044_388_000,   realisasi: 68_041_841_227 },
  { kode: '3.1.1', uraian: 'Penyediaan Kelompok Pakar dan Tim Ahli',                       level: 3, target: 1_939_086_000,     realisasi: 776_400_000 },
  { kode: '3.1.1.1', uraian: 'Orang dalam kelompok pakar dan tim ahli',                    level: 4, target: 1_939_086_000,     realisasi: 776_400_000 },
  { kode: '3.1.2', uraian: 'Penyediaan Tenaga Ahli Fraksi',                                level: 3, target: 418_741_000,        realisasi: 150_527_446 },
  { kode: '3.1.2.1', uraian: 'Tenaga Ahli Fraksi',                                         level: 4, target: 418_741_000,        realisasi: 150_527_446 },
  { kode: '3.1.3', uraian: 'Penyelenggaraan Hubungan Masyarakat',                          level: 3, target: 12_166_561_000,    realisasi: 5_019_026_794 },
  { kode: '3.1.3.1', uraian: 'Dokumen hasil penyelenggaraan hubungan masyarakat',          level: 4, target: 12_166_561_000,    realisasi: 5_019_026_794 },
  { kode: '3.1.4', uraian: 'Penyusunan Program Kerja DPRD',                                level: 3, target: 115_520_000_000,   realisasi: 62_095_886_987 },
  { kode: '3.1.4.1', uraian: 'Dokumen rencana kerja DPRD',                                 level: 4, target: 115_520_000_000,   realisasi: 62_095_886_987 },
  { kode: '3.2',   uraian: 'Pembahasan Kerja Sama Daerah',                                 level: 2, target: 101_540_000_000,   realisasi: 53_775_693_000 },
  { kode: '3.2.1', uraian: 'Penyusunan Bahan Komunikasi dan Publikasi',                    level: 3, target: 101_540_000_000,   realisasi: 53_775_693_000 },
  { kode: '3.2.1.1', uraian: 'Dokumen bahan komunikasi dan publikasi yang disusun',        level: 4, target: 101_540_000_000,   realisasi: 53_775_693_000 },

  // ── 4. BAGIAN PERSIDANGAN ─────────────────────────────────────────────────
  { kode: '4',     uraian: 'Bagian Persidangan',                                            level: 1, target: 97_960_085_000,    realisasi: 35_700_907_510 },
  { kode: '4.1',   uraian: 'Pembentukan Perda dan Peraturan DPRD',                         level: 2, target: 7_206_440_000,     realisasi: 3_595_312_350 },
  { kode: '4.1.1', uraian: 'Penyusunan dan Pembahasan Program Pembentukan Perda',          level: 3, target: 4_262_440_000,     realisasi: 1_845_412_350 },
  { kode: '4.1.1.1', uraian: 'Dokumen hasil penyusunan dan pembahasan Raperda',            level: 4, target: 4_262_440_000,     realisasi: 1_845_412_350 },
  { kode: '4.1.2', uraian: 'Sosialisasi Peraturan Daerah Bersama DPRD dan Pemda',          level: 3, target: 2_944_000_000,     realisasi: 1_749_900_000 },
  { kode: '4.1.2.1', uraian: 'Orang yang mengikuti sosialisasi Peraturan Daerah',          level: 4, target: 2_944_000_000,     realisasi: 1_749_900_000 },
  { kode: '4.2',   uraian: 'Pembahasan Kebijakan Anggaran',                                level: 2, target: 2_210_534_000,     realisasi: 732_551_337 },
  { kode: '4.2.1', uraian: 'Pembahasan APBD',                                              level: 3, target: 2_210_534_000,     realisasi: 732_551_337 },
  { kode: '4.2.1.1', uraian: 'Dokumen hasil pembahasan APBD',                              level: 4, target: 2_210_534_000,     realisasi: 732_551_337 },
  { kode: '4.3',   uraian: 'Pengawasan Penyelenggaraan Pemerintahan',                      level: 2, target: 12_515_582_000,    realisasi: 3_230_867_990 },
  { kode: '4.3.1', uraian: 'Pengawasan Bidang Pemerintahan dan Hukum',                     level: 3, target: 1_850_000_000,     realisasi: 472_633_700 },
  { kode: '4.3.2', uraian: 'Pengawasan Bidang Infrastruktur',                              level: 3, target: 1_850_000_000,     realisasi: 512_038_000 },
  { kode: '4.3.3', uraian: 'Pengawasan Bidang Kesejahteraan Rakyat',                       level: 3, target: 1_850_000_000,     realisasi: 595_962_300 },
  { kode: '4.3.4', uraian: 'Pengawasan Bidang Perekonomian',                               level: 3, target: 1_850_000_000,     realisasi: 529_423_550 },
  { kode: '4.3.5', uraian: 'Pengawasan Bidang Sumber Daya Alam',                           level: 3, target: 1_850_000_000,     realisasi: 640_537_900 },
  { kode: '4.3.6', uraian: 'Pengawasan Tindak Lanjut Hasil Pemeriksaan BPK',               level: 3, target: 1_169_722_000,     realisasi: 0 },
  { kode: '4.3.7', uraian: 'Pengawasan Penggunaan Anggaran',                               level: 3, target: 2_095_860_000,     realisasi: 480_272_540 },
  { kode: '4.4',   uraian: 'Peningkatan Kapasitas DPRD (Persidangan)',                     level: 2, target: 4_380_000_000,     realisasi: 818_416_022 },
  { kode: '4.4.1', uraian: 'Pendalaman Tugas DPRD',                                        level: 3, target: 4_380_000_000,     realisasi: 818_416_022 },
  { kode: '4.4.1.1', uraian: 'Dokumen hasil Pendalaman Tugas DPRD',                        level: 4, target: 4_380_000_000,     realisasi: 818_416_022 },
  { kode: '4.5',   uraian: 'Penyerapan dan Penghimpunan Aspirasi Masyarakat',              level: 2, target: 49_184_524_000,    realisasi: 15_784_115_600 },
  { kode: '4.5.1', uraian: 'Kunjungan Kerja dalam Daerah',                                 level: 3, target: 10_402_980_000,   realisasi: 3_745_743_400 },
  { kode: '4.5.1.1', uraian: 'Laporan hasil Kunjungan Kerja DPRD',                         level: 4, target: 10_402_980_000,   realisasi: 3_745_743_400 },
  { kode: '4.5.2', uraian: 'Penyusunan Pokok-Pokok Pikiran DPRD',                          level: 3, target: 175_000_000,        realisasi: 0 },
  { kode: '4.5.3', uraian: 'Pelaksanaan Reses',                                            level: 3, target: 38_606_544_000,   realisasi: 12_038_372_200 },
  { kode: '4.5.3.1', uraian: 'Dokumen hasil pelaksanaan Reses',                            level: 4, target: 38_606_544_000,   realisasi: 12_038_372_200 },
  { kode: '4.6',   uraian: 'Pelaksanaan dan Pengawasan Kode Etik DPRD',                    level: 2, target: 1_152_000_000,     realisasi: 532_650_000 },
  { kode: '4.6.1', uraian: 'Penyusunan Kode Etik DPRD',                                   level: 3, target: 1_152_000_000,     realisasi: 532_650_000 },
  { kode: '4.7',   uraian: 'Fasilitasi Tugas DPRD',                                        level: 2, target: 21_311_005_000,    realisasi: 11_006_994_211 },
  { kode: '4.7.1', uraian: 'Koordinasi dan Konsultasi Pelaksanaan Tugas DPRD',             level: 3, target: 21_311_005_000,    realisasi: 11_006_994_211 },
  { kode: '4.7.1.1', uraian: 'Dokumen hasil Koordinasi dan Konsultasi Pelaksanaan Tugas', level: 4, target: 21_311_005_000,    realisasi: 11_006_994_211 },
];

// ─── DATA DETAIL SUB-SUB KEGIATAN (SSK) MOCKUP ────────────────────────────

export interface SSKBulanan {
  target: number;
  realisasi: number;
}

export interface DetailSSK {
  id: string;
  kodeSubKegiatan: string; // referensi ke uraianAnggaran level 4
  opd: string;
  bidang: string;
  program: string;
  kegiatan: string;
  subKegiatan: string;
  paguApbd: number;
  totalRab: number;
  paguVerifikasi: number;
  uraianSsk: string;
  indikator: string;
  jenis: string;
  sumberAnggaran: string;
  jenisIku: string;
  bobot: number;
  statusSesuai: boolean;
  statusSelesai: boolean;
  bulanan: SSKBulanan[]; // Array 12 elemen (Jan-Des)
}

export const detailSSKMock: DetailSSK = {
  id: 'ssk-1',
  kodeSubKegiatan: '4.3.3.1', // Mock kode level 4
  opd: 'Sekretariat DPRD',
  bidang: 'Bagian Persidangan',
  program: 'PROGRAM DUKUNGAN PELAKSANAAN TUGAS...',
  kegiatan: 'Pengawasan Penyelenggaraan Pemerinta...',
  subKegiatan: 'Pengawasan Urusan Pemerintahan Bidang Kesejahteraan Rakyat',
  paguApbd: 1850000000,
  totalRab: 1850000000,
  paguVerifikasi: 1850000000,
  uraianSsk: 'laporan hasil Pengawasan Urusan Pemerintahan Bidang Kesejahteraan Rakyat',
  indikator: 'Jumlah Laporan Pengawasan Urusan Pemerintahan Bidang Kesejahteraan Rakyat',
  jenis: 'NON FISIK',
  sumberAnggaran: 'PAD & DAU',
  jenisIku: 'Indeks Reformasi Birokrasi',
  bobot: 100,
  statusSesuai: false,
  statusSelesai: false,
  bulanan: [
    { target: 5.41, realisasi: 9.17 },
    { target: 8.49, realisasi: 8.83 },
    { target: 5.57, realisasi: 0.47 },
    { target: 6.22, realisasi: 6.22 },
    { target: 5.85, realisasi: 6.55 },
    { target: 8.27, realisasi: 0 },
    { target: 6.22, realisasi: 0 },
    { target: 8.49, realisasi: 0 },
    { target: 6.88, realisasi: 0 },
    { target: 11.18, realisasi: 0 },
    { target: 10.85, realisasi: 0 },
    { target: 15.27, realisasi: 0 }
  ]
};
