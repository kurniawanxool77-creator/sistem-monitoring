import { useState } from 'react';
import { Link } from 'react-router';
import {
  RefreshCw, Building2, Wallet, Megaphone, Gavel, Archive, HelpCircle, RotateCcw,
} from 'lucide-react';
import { SubKegiatan } from '../../lib/data';
import { UpdateProgressModal } from '../modals/UpdateProgressModal';
import { useAppData } from '../../hooks/useAppData';

const ALL_CARDS = [
  'Sekretariat DPRD',
  'Bagian Humas',
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
    iconBg: 'bg-emerald-500',
    iconText: 'text-white',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Humas': {
    label: 'Bagian Humas',
    desc: 'Protokol & Publikasi',
    icon: Megaphone,
    iconBg: 'bg-orange-500',
    iconText: 'text-white',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Persidangan': {
    label: 'Bagian Persidangan',
    desc: 'Fasilitasi & Risalah Rapat',
    icon: Gavel,
    iconBg: 'bg-purple-500',
    iconText: 'text-white',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
  'Bagian Umum': {
    label: 'Bagian Umum',
    desc: 'TU, Kepegawaian & RT',
    icon: Archive,
    iconBg: 'bg-blue-500',
    iconText: 'text-white',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] bg-blue-50/10',
  },
};

export function ProgressSubKegiatan() {
  const { getSubKegiatanList, addRealisasi, updateSubKegiatanMetadata, getBagianList } = useAppData();
  const subKegiatans = getSubKegiatanList();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const bagianList = getBagianList();

  const userBidang = user?.role === 'superadmin' 
    ? null 
    : bagianList.find(b => b.id === user?.bidangKode)?.nama;

  const CARDS_ORDER = userBidang ? [userBidang] : ALL_CARDS;

  const [selectedBagian, setSelectedBagian] = useState<string>(CARDS_ORDER[0] || 'Sekretariat DPRD');
  const [filterSubBagian, setFilterSubBagian] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [updateProgressFor, setUpdateProgressFor] = useState<string | null>(null);

  function toggleStep(subKegiatanId: string, stepId: string) {
    const k = subKegiatans.find(x => x.id === subKegiatanId);
    if (!k) return;
    const newSteps = k.steps.map((s) =>
      s.id === stepId ? { ...s, selesai: !s.selesai } : s
    );
    updateSubKegiatanMetadata({
      id: subKegiatanId,
      penanggungJawab: k.penanggungJawab,
      tanggalMulai: k.tanggalMulai,
      tanggalSelesai: k.tanggalSelesai,
      deskripsi: k.deskripsi,
      steps: newSteps
    });
  }

  function handleSaveRealisasi(subKegiatanId: string, amount: number) {
    addRealisasi(subKegiatanId, amount);
  }

  function handleSaveEdit(subKegiatanId: string, updatedFields: Partial<SubKegiatan>) {
    const k = subKegiatans.find(x => x.id === subKegiatanId);
    if (!k) return;
    
    updateSubKegiatanMetadata({
      id: subKegiatanId,
      penanggungJawab: updatedFields.penanggungJawab !== undefined ? updatedFields.penanggungJawab : k.penanggungJawab,
      tanggalMulai: updatedFields.tanggalMulai !== undefined ? updatedFields.tanggalMulai : k.tanggalMulai,
      tanggalSelesai: updatedFields.tanggalSelesai !== undefined ? updatedFields.tanggalSelesai : k.tanggalSelesai,
      deskripsi: updatedFields.deskripsi !== undefined ? updatedFields.deskripsi : k.deskripsi,
      steps: updatedFields.steps || k.steps
    });
  }

  // Get active subKegiatan data for selected department
  const currentDeptKegiatans = subKegiatans.filter((k) => k.bidang === selectedBagian);

  // Calculate average progress for selected department
  const selectedBagianProgress = currentDeptKegiatans.length > 0
    ? Math.round(currentDeptKegiatans.reduce((acc, k) => acc + k.progress, 0) / currentDeptKegiatans.length)
    : 0;

  // Get unique sub-bagian for filtering
  const uniqueSubBagian = Array.from(new Set(currentDeptKegiatans.map((k) => k.subKegiatan_parent)));

  // Filtered subKegiatan to display in table
  const filteredKegiatans = currentDeptKegiatans
    .filter((k) => filterSubBagian === 'Semua' || k.subKegiatan_parent === filterSubBagian)
    .filter((k) => filterStatus === 'Semua' || k.status === filterStatus);

  const updateKegiatan = updateProgressFor ? subKegiatans.find((k) => k.id === updateProgressFor) : null;

  return (
    <div className="space-y-6">
      {/* Header */}


      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS_ORDER.map((bagianNama, index) => {
          const config = CARDS_CONFIG[bagianNama];
          if (!config) return null;

          const IconComponent = config.icon;
          const isSelected = selectedBagian === bagianNama;

          // Calculate stats for this card
          const cardKegiatans = subKegiatans.filter((k) => k.bidang === bagianNama);
          const uniqueSubDepts = Array.from(new Set(cardKegiatans.map((k) => k.subKegiatan_parent)));
          const progressVal = cardKegiatans.length > 0
            ? Math.round(cardKegiatans.reduce((acc, k) => acc + k.progress, 0) / cardKegiatans.length)
            : 0;

          const progressColorClass = progressVal === 100 ? 'text-emerald-600' :
            progressVal >= 60 ? 'text-blue-600' :
              progressVal >= 30 ? 'text-amber-600' : 'text-red-500';

          return (
            <div
              key={bagianNama}
              onClick={() => {
                setSelectedBagian(bagianNama);
                setFilterSubBagian('Semua');
                setFilterStatus('Semua');
              }}
              className={`p-4 bg-white rounded-xl border transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${isSelected
                ? `${config.borderActive} transform scale-[1.02] shadow-md`
                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 hover:bg-gray-50/20 active:scale-95'
                }`}
            >
              {/* Top part: Title/Desc on Left, Icon on Right */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-2 min-w-0">
                  <div className="text-sm font-bold text-gray-900 leading-tight truncate" title={`${index + 1}. ${config.label}`}>
                    {index + 1}. {config.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1" title={config.desc}>
                    {config.desc}
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg} ${config.iconText}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>

              {/* Progress bar inside Card */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-medium">{uniqueSubDepts.length} Sub-Bagian</span>
                  <span className={`font-bold ${progressColorClass}`}>{progressVal}% Progres</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${progressVal === 100 ? 'bg-emerald-500' :
                        progressVal >= 60 ? 'bg-blue-500' :
                          progressVal >= 30 ? 'bg-amber-500' : 'bg-red-400'
                      }`}
                    style={{ width: `${progressVal}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Section Banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filters area */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">
            Rincian Per Kegiatan {selectedBagian.replace('Bagian ', '').toUpperCase()}:
          </span>
          <div className="flex items-center gap-3">
            {/* Kegiatan Filter */}
            <select
              value={filterSubBagian}
              onChange={(e) => setFilterSubBagian(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="Semua">Semua Kegiatan</option>
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

            <button
              onClick={() => {
                localStorage.removeItem('subKegiatan_metadata_v2');
                window.location.reload();
              }}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset data ke default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Data
            </button>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kegiatan
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kegiatan
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Target Selesai
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-2.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    <td className="px-4 py-2.5 text-xs text-gray-600 font-medium">
                      {k.subKegiatan_parent}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Link to={`/agenda/${k.id}`} className="text-xs font-medium text-blue-600 hover:underline">
                          {k.nama}
                        </Link>
                        <span className="text-gray-400 hover:text-blue-500 cursor-pointer flex-shrink-0" title={k.deskripsi}>
                          <HelpCircle className="w-3 h-3" />
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        PJ: <span className="font-semibold text-gray-600">{k.penanggungJawab}</span> • {new Date(k.tanggalMulai).toLocaleDateString('id-ID')} – {new Date(k.tanggalSelesai).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600">
                      {new Date(k.tanggalSelesai).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${k.progress === 100 ? 'bg-emerald-500' :
                              k.progress >= 60 ? 'bg-blue-500' :
                                k.progress >= 30 ? 'bg-amber-500' : 'bg-red-400'
                              }`}
                            style={{ width: `${k.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{k.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${k.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                        k.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' :
                          k.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <button
                        onClick={() => setUpdateProgressFor(k.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold text-white transition-all hover:scale-105 shadow-sm ${k.status === 'Selesai' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                          k.status === 'Terlambat' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' :
                            'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                          }`}
                      >
                        <RefreshCw className="w-3 h-3" />
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
          subKegiatan={updateKegiatan}
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
