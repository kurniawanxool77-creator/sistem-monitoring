import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, User, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { kegiatanList, Kegiatan } from '../lib/data';
import { UpdateProgressModal } from './UpdateProgressModal';

const stepList = [
  { id: 1, name: 'Persiapan', description: 'Rencana kerja, SK, anggaran' },
  { id: 2, name: 'Koordinasi', description: 'Rapat, surat undangan, konfirmasi peserta' },
  { id: 3, name: 'Pelaksanaan', description: 'Upload foto, dokumen, absensi' },
  { id: 4, name: 'Evaluasi', description: 'Laporan, notulen, hasil kegiatan' },
  { id: 5, name: 'Verifikasi', description: 'Cek kelengkapan dokumen & laporan' },
  { id: 6, name: 'Closed', description: 'Kegiatan Selesai Sempurna' },
];

export function DetailKegiatan() {
  const { id } = useParams();
  const [kegiatans, setKegiatans] = useState<Kegiatan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kegiatan_list_data');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return kegiatanList;
  });

  const [showModalPanel, setShowModalPanel] = useState<'progress' | 'realisasi' | 'edit' | null>(null);

  const kegiatan = kegiatans.find((k) => k.id === id);

  if (!kegiatan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Kegiatan tidak ditemukan</p>
        <Link to="/agenda" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Kembali ke Daftar Kegiatan
        </Link>
      </div>
    );
  }

  function handleToggleStep(stepId: string) {
    const next = kegiatans.map((k) => {
      if (k.id !== id) return k;
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

  function handleSaveRealisasi(amount: number) {
    const next = kegiatans.map((k) => {
      if (k.id !== id) return k;
      const newRealisasi = Math.min(k.realisasiAnggaran + amount, k.paguAnggaran);
      return { ...k, realisasiAnggaran: newRealisasi };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  function handleSaveEdit(updatedFields: Partial<Kegiatan>) {
    const next = kegiatans.map((k) => {
      if (k.id !== id) return k;
      return { ...k, ...updatedFields };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  const currentStepIndex = stepList.findIndex((s) => s.name === kegiatan.step);
  const progressPercentage = (kegiatan.realisasiAnggaran / kegiatan.paguAnggaran) * 100;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/agenda"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Kegiatan
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{kegiatan.nama}</h1>
            <p className="text-gray-600">{kegiatan.deskripsi}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
            kegiatan.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
            kegiatan.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' :
            kegiatan.status === 'Overdue' || kegiatan.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {kegiatan.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Penanggung Jawab</div>
              <div className="font-medium text-gray-900">{kegiatan.penanggungJawab}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tanggal Mulai</div>
              <div className="font-medium text-gray-900">
                {new Date(kegiatan.tanggalMulai).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Tanggal Selesai</div>
              <div className="font-medium text-gray-900">
                {new Date(kegiatan.tanggalSelesai).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Bidang/Sub Bidang</div>
              <div className="font-medium text-gray-900">{kegiatan.bidang}</div>
              <div className="text-sm text-gray-600">{kegiatan.subBidang}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Anggaran */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Anggaran Kegiatan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Pagu Anggaran</div>
            <div className="text-2xl font-bold text-gray-900">
              Rp {kegiatan.paguAnggaran.toLocaleString('id-ID')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Realisasi</div>
            <div className="text-2xl font-bold text-emerald-600">
              Rp {kegiatan.realisasiAnggaran.toLocaleString('id-ID')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Sisa Anggaran</div>
            <div className="text-2xl font-bold text-amber-600">
              Rp {(kegiatan.paguAnggaran - kegiatan.realisasiAnggaran).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Persentase Realisasi</span>
            <span className="text-sm font-bold text-gray-900">{progressPercentage.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Timeline Step Progress (6 Tahap)</h2>
        
        <div className="relative">
          {stepList.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === stepList.length - 1;

            return (
              <div key={step.id} className="relative flex gap-4 pb-8">
                {/* Vertical Line */}
                {!isLast && (
                  <div className={`absolute left-[15px] top-[32px] w-0.5 h-full ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}

                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500' :
                  isCurrent ? 'bg-blue-500' :
                  'bg-gray-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-white">{step.id}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`font-medium mb-1 ${
                    isCurrent ? 'text-blue-600' :
                    isCompleted ? 'text-emerald-600' :
                    'text-gray-600'
                  }`}>
                    {step.name}
                    {isCurrent && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Sedang Berjalan</span>}
                    {isCompleted && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Selesai</span>}
                  </div>
                  <div className="text-sm text-gray-600">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dokumen Terlampir */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dokumen Terlampir</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Dokumen Perencanaan.pdf</div>
                <div className="text-sm text-gray-600">Diupload 2 hari yang lalu</div>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Download
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Surat Undangan.pdf</div>
                <div className="text-sm text-gray-600">Diupload 1 hari yang lalu</div>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Riwayat Aktivitas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Perubahan / Log Aktivitas</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="text-sm text-gray-600 w-32">12 Jun 2026, 10:30</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Status diubah menjadi "Berjalan"</div>
              <div className="text-sm text-gray-600">oleh Administrator Utama</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-sm text-gray-600 w-32">10 Jun 2026, 14:15</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Dokumen "Surat Undangan.pdf" ditambahkan</div>
              <div className="text-sm text-gray-600">oleh Administrator Utama</div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-sm text-gray-600 w-32">8 Jun 2026, 09:00</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Kegiatan dibuat</div>
              <div className="text-sm text-gray-600">oleh Administrator Utama</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowModalPanel('progress')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer animate-none"
        >
          Update Progress
        </button>
        <button
          onClick={() => setShowModalPanel('realisasi')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium cursor-pointer animate-none"
        >
          Input Realisasi
        </button>
        <button
          onClick={() => setShowModalPanel('edit')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer animate-none"
        >
          Edit Kegiatan
        </button>
      </div>

      {showModalPanel && (
        <UpdateProgressModal
          kegiatan={kegiatan}
          steps={kegiatan.steps}
          progress={kegiatan.progress}
          onClose={() => setShowModalPanel(null)}
          onToggleStep={handleToggleStep}
          onSaveRealisasi={handleSaveRealisasi}
          onSaveEdit={handleSaveEdit}
          initialPanel={showModalPanel}
        />
      )}
    </div>
  );
}
