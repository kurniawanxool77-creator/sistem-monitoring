import { useState } from 'react';
import { Link } from 'react-router';
import {
  RefreshCw, Building2, Wallet, Megaphone, Gavel, Archive, HelpCircle,
} from 'lucide-react';
import { kegiatanList, Kegiatan } from '../lib/data';
import { UpdateProgressModal } from './UpdateProgressModal';

const CARDS_ORDER = [
  'Sekretariat DPRD',
  'Keuangan',
  'Bagian Hubungan Masyarakat',
  'Bagian Persidangan',
  'Bagian Umum'
];

const CARDS_CONFIG: Record<string, {
  label: string;
  desc: string;
  icon: any;
  iconBg: string;
  iconText: string;
  borderActive: string;
}> = {
  'Sekretariat DPRD': {
    label: 'Sekretariat DPRD',
    desc: 'Humas, Perlengkapan, dll',
    icon: Building2,
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Keuangan': {
    label: 'Keuangan',
    desc: 'Anggaran & Laporan Keuangan',
    icon: Wallet,
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Hubungan Masyarakat': {
    label: 'Bagian Hubungan Masyarakat',
    desc: 'Protokol & Publikasi',
    icon: Megaphone,
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Persidangan': {
    label: 'Bagian Persidangan',
    desc: 'Fasilitasi & Risalah Rapat',
    icon: Gavel,
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Umum': {
    label: 'Bagian Umum',
    desc: 'TU, Kepegawaian & RT',
    icon: Archive,
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
};

export function ProgressKegiatan() {
  const [selectedBagian, setSelectedBagian] = useState<string>('Sekretariat DPRD');
  const [filterSubBagian, setFilterSubBagian] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [updateProgressFor, setUpdateProgressFor] = useState<string | null>(null);

  const [kegiatans, setKegiatans] = useState<Kegiatan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kegiatan_list_data');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return kegiatanList;
  });

  function toggleStep(kegiatanId: string, stepId: string) {
    const next = kegiatans.map((k) => {
      if (k.id !== kegiatanId) return k;
      const newSteps = k.steps.map((s) =>
        s.id === stepId ? { ...s, selesai: !s.selesai } : s
      );
      const done = newSteps.filter((s) => s.selesai).length;
      const newProgress = Math.round((done / newSteps.length) * 100);
      
      let newStatus = k.status;
      if (newProgress === 100) {
        newStatus = 'Selesai';
      } else if (k.status === 'Selesai') {
        newStatus = 'Berjalan';
      }

      let newStep = k.step;
      if (newProgress === 100) {
        newStep = 'Closed';
      } else if (newProgress >= 86) {
        newStep = 'Verifikasi';
      } else if (newProgress >= 66) {
        newStep = 'Evaluasi';
      } else if (newProgress >= 36) {
        newStep = 'Pelaksanaan';
      } else if (newProgress >= 16) {
        newStep = 'Koordinasi';
      } else {
        newStep = 'Persiapan';
      }

      return { ...k, steps: newSteps, progress: newProgress, status: newStatus, step: newStep };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  function handleSaveRealisasi(kegiatanId: string, amount: number) {
    const next = kegiatans.map((k) => {
      if (k.id !== kegiatanId) return k;
      const newRealisasi = Math.min(k.realisasiAnggaran + amount, k.paguAnggaran);
      return { ...k, realisasiAnggaran: newRealisasi };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  // Update kegiatan details from Edit panel in modal
  function handleSaveEdit(kegiatanId: string, updatedFields: Partial<Kegiatan>) {
    const next = kegiatans.map((k) => {
      if (k.id !== kegiatanId) return k;
      return { ...k, ...updatedFields };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  // Get active kegiatan data for selected department
  const currentDeptKegiatans = kegiatans.filter((k) => k.bidang === selectedBagian);
  
  // Calculate average progress for selected department
  const selectedBagianProgress = currentDeptKegiatans.length > 0 
    ? Math.round(currentDeptKegiatans.reduce((acc, k) => acc + k.progress, 0) / currentDeptKegiatans.length)
    : 0;

  // Get unique sub-bagian for filtering
  const uniqueSubBagian = Array.from(new Set(currentDeptKegiatans.map((k) => k.subBidang)));

  // Filtered kegiatan to display in table
  const filteredKegiatans = currentDeptKegiatans
    .filter((k) => filterSubBagian === 'Semua' || k.subBidang === filterSubBagian)
    .filter((k) => filterStatus === 'Semua' || k.status === filterStatus);

  const updateKegiatan = updateProgressFor ? kegiatans.find((k) => k.id === updateProgressFor) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progres Kegiatan & Dashboard Bidang</h1>
        <p className="text-sm text-gray-500 mt-1">Pemantauan Capaian Fisik Perkegiatan dan Cabang Sub-Bagian Masing-Masing</p>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {CARDS_ORDER.map((bagianNama, index) => {
          const config = CARDS_CONFIG[bagianNama];
          if (!config) return null;
          
          const IconComponent = config.icon;
          const isSelected = selectedBagian === bagianNama;
          
          // Calculate stats for this card
          const cardKegiatans = kegiatans.filter((k) => k.bidang === bagianNama);
          const uniqueSubDepts = Array.from(new Set(cardKegiatans.map((k) => k.subBidang)));
          const progressVal = cardKegiatans.length > 0
            ? Math.round(cardKegiatans.reduce((acc, k) => acc + k.progress, 0) / cardKegiatans.length)
            : 0;

          return (
            <div
              key={bagianNama}
              onClick={() => {
                setSelectedBagian(bagianNama);
                setFilterSubBagian('Semua');
                setFilterStatus('Semua');
              }}
              className={`p-4 bg-white rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 ${
                isSelected 
                  ? config.borderActive 
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              {/* Top part: Icon + Title & Desc */}
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg} ${config.iconText}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate">{index + 1}. {config.label}</div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{config.desc}</div>
                </div>
              </div>

              {/* Bottom part: Stats */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-2">
                <span className="text-xs text-gray-500 font-medium">Cabang: {uniqueSubDepts.length} Sub-Bagian</span>
                <span className="text-sm font-bold text-blue-600">{progressVal}% Progres</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Section Banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Banner Title area */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-start gap-3 pl-3 border-l-4 border-blue-600">
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-wide uppercase">
                DASHBOARD MONITORING: {selectedBagian}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan rincian progres cabang bagian dan daftar perkegiatannya.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 self-start sm:self-center px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold rounded-full shadow-sm">
            Total Progres: {selectedBagianProgress}%
          </div>
        </div>

        {/* Filters area */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
            Rincian Perkegiatan {selectedBagian.replace('Bagian ', '').toUpperCase()}:
          </span>
          <div className="flex items-center gap-3">
            {/* Cabang Filter */}
            <select
              value={filterSubBagian}
              onChange={(e) => setFilterSubBagian(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="Semua">Semua Cabang</option>
              {uniqueSubBagian.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Berjalan">Berjalan</option>
              <option value="Selesai">Selesai</option>
              <option value="Terlambat">Terlambat</option>
            </select>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Cabang Bidang
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Nama Kegiatan
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Target Selesai
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredKegiatans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm font-medium">
                    Tidak ada kegiatan yang berjalan dengan kriteria filter tersebut.
                  </td>
                </tr>
              ) : (
                filteredKegiatans.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-600 font-medium">
                      {k.subBidang}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/agenda/${k.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {k.nama}
                        </Link>
                        <span className="text-gray-400 hover:text-blue-500 cursor-pointer flex-shrink-0" title={k.deskripsi}>
                          <HelpCircle className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        PJ: <span className="font-semibold text-gray-600">{k.penanggungJawab}</span> • {new Date(k.tanggalMulai).toLocaleDateString('id-ID')} – {new Date(k.tanggalSelesai).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(k.tanggalSelesai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              k.progress === 100 ? 'bg-emerald-500' :
                              k.progress >= 60 ? 'bg-blue-500' :
                              k.progress >= 30 ? 'bg-amber-500' : 'bg-red-400'
                            }`}
                            style={{ width: `${k.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{k.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                        k.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' :
                        k.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setUpdateProgressFor(k.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 shadow-sm ${
                          k.status === 'Selesai' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                          k.status === 'Terlambat' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' :
                          'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Update Progress
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Progress Modal */}
      {updateProgressFor && updateKegiatan && (
        <UpdateProgressModal
          kegiatan={updateKegiatan}
          steps={updateKegiatan.steps}
          progress={updateKegiatan.progress}
          onClose={() => setUpdateProgressFor(null)}
          onToggleStep={(stepId) => toggleStep(updateKegiatan.id, stepId)}
          onSaveRealisasi={(amount) => handleSaveRealisasi(updateKegiatan.id, amount)}
          onSaveEdit={(updatedFields) => handleSaveEdit(updateKegiatan.id, updatedFields)}
        />
      )}
    </div>
  );
}
