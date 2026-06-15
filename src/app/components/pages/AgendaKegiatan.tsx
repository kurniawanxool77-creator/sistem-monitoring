import { useState } from 'react';
import { Link } from 'react-router';
import {
  Plus, Search, Edit, Trash2, Eye, X, UserPlus, Minus,
  Check, CheckCircle2, FileCheck, ChevronRight, RefreshCw,
} from 'lucide-react';
import { sumberDanaList, Kegiatan, anggotaData } from '../../lib/data';
import { UpdateProgressModal } from './UpdateProgressModal';
import { useAppData } from '../../hooks/useAppData';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

import { KegiatanFormModal } from './KegiatanFormModal';

export function AgendaKegiatan() {
  const {
    dataUraian: uraianAnggaranData,
    getKegiatanList,
    addRealisasi,
    updateKegiatanMetadata,
    approveKegiatan,
    deleteKegiatan,
    addActivityLog
  } = useAppData();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isSuperadmin = user?.role === 'superadmin';

  const kegiatans = getKegiatanList();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterBagian, setFilterBagian] = useState('semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [updateProgressFor, setUpdateProgressFor] = useState<string | null>(null);
  const [showEditModalFor, setShowEditModalFor] = useState<string | null>(null);
  const [modalInitialPanel, setModalInitialPanel] = useState<'progress' | 'realisasi'>('progress');

  function openUpdateModal(kegiatanId: string, panel: 'progress' | 'realisasi') {
    setModalInitialPanel(panel);
    setUpdateProgressFor(kegiatanId);
  }

  function toggleStep(kegiatanId: string, stepId: string) {
    const k = kegiatans.find(x => x.id === kegiatanId);
    if (!k) return;
    const newSteps = k.steps.map((s) =>
      s.id === stepId ? { ...s, selesai: !s.selesai } : s
    );
    updateKegiatanMetadata({
      id: kegiatanId,
      penanggungJawab: k.penanggungJawab,
      tanggalMulai: k.tanggalMulai,
      tanggalSelesai: k.tanggalSelesai,
      deskripsi: k.deskripsi,
      steps: newSteps
    });
  }

  function handleSaveRealisasi(kegiatanId: string, amount: number) {
    addRealisasi(kegiatanId, amount);
  }

  function handleSaveEdit(kegiatanId: string, updatedFields: Partial<Kegiatan>) {
    const k = kegiatans.find(x => x.id === kegiatanId);
    if (!k) return;
    
    updateKegiatanMetadata({
      id: kegiatanId,
      penanggungJawab: updatedFields.penanggungJawab !== undefined ? updatedFields.penanggungJawab : k.penanggungJawab,
      tanggalMulai: updatedFields.tanggalMulai !== undefined ? updatedFields.tanggalMulai : k.tanggalMulai,
      tanggalSelesai: updatedFields.tanggalSelesai !== undefined ? updatedFields.tanggalSelesai : k.tanggalSelesai,
      deskripsi: updatedFields.deskripsi !== undefined ? updatedFields.deskripsi : k.deskripsi,
      steps: updatedFields.steps || k.steps
    });
  }

  const filteredKegiatan = kegiatans.filter((kegiatan) => {
    const matchSearch = kegiatan.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'semua' || kegiatan.status === filterStatus;
    const matchBagian = filterBagian === 'semua' || kegiatan.bidang === filterBagian;
    return matchSearch && matchStatus && matchBagian;
  });

  const allBidangOptions = Array.from(new Set(kegiatans.map((k) => k.bidang)));

  function handleDeleteKegiatan(id: string, nama: string) {
    if (confirm(`Apakah Anda yakin ingin menghapus kegiatan "${nama}"?`)) {
      deleteKegiatan(id, user?.nama || 'Unknown User', nama);
    }
  }

  // kegiatan yang sedang dibuka update progress-nya
  const updateKegiatan = updateProgressFor ? kegiatans.find((k) => k.id === updateProgressFor) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Kegiatan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Cari nama kegiatan..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {(!user || user.role === 'superadmin') && (
            <select value={filterBagian} onChange={(e) => setFilterBagian(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="semua">Semua Bagian</option>
              {allBidangOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          )}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="semua">Semua Status</option>
            <option value="Berjalan">Berjalan</option>
            <option value="Selesai">Selesai</option>
            <option value="Terlambat">Terlambat</option>
            <option value="Belum Mulai">Belum Mulai</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-12">No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nama Kegiatan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bagian</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">PJ</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tgl Mulai</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tgl Selesai</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left font-bold py-4 px-4 uppercase text-gray-500 w-[12%]">Progress</th>
                  <th className="text-left font-bold py-4 px-4 uppercase text-gray-500 w-[10%]">Approval</th>
                  <th className="text-left font-bold py-4 px-4 uppercase text-gray-500 w-[10%]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKegiatan.map((kegiatan, index) => {
                const isExpanded = expandedRow === kegiatan.id;
                const steps = kegiatan.steps;
                const progress = kegiatan.progress;
                const doneCount = steps.filter((s) => s.selesai).length;
                const allDone = doneCount === steps.length;
                const currentStepIdx = steps.findIndex((s) => !s.selesai);

                return (
                  <>
                    {/* Main row */}
                    <tr key={kegiatan.id}
                      className={`border-b border-gray-100 transition-colors ${isExpanded ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => { setExpandedRow(isExpanded ? null : kegiatan.id); }}
                          className="text-sm text-gray-700 hover:text-blue-600 font-medium w-full text-left"
                          title="Klik untuk lihat progress"
                        >
                          {index + 1}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/agenda/${kegiatan.id}`}
                          className="text-sm font-medium text-blue-600 hover:underline">
                          {kegiatan.nama}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{kegiatan.bidang}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{kegiatan.penanggungJawab}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(kegiatan.tanggalMulai).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(kegiatan.tanggalSelesai).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${kegiatan.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                            kegiatan.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' :
                              kegiatan.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                          }`}>{kegiatan.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 w-32">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' :
                                progress >= 60 ? 'bg-blue-500' :
                                  progress >= 30 ? 'bg-amber-500' : 'bg-red-400'
                              }`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 w-10 text-right">{progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {kegiatan.isApproved ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" /> Disetujui
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-amber-600">
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {!kegiatan.isApproved && isSuperadmin && (
                            <button
                              onClick={() => approveKegiatan(kegiatan.id, user?.nama || 'Superadmin')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                              title="Approve Kegiatan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <Link to={`/agenda/${kegiatan.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setShowEditModalFor(kegiatan.id)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteKegiatan(kegiatan.id, kegiatan.nama)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expandable progress row ── */}
                    {isExpanded && (
                      <tr key={`${kegiatan.id}-progress`} className="border-b-2 border-blue-100">
                        <td colSpan={9} className="bg-gradient-to-b from-blue-50/60 to-slate-50 px-8 pt-6 pb-5">

                          {/* Title */}
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h4 className="text-sm font-bold text-gray-800">
                                Progress Tahapan
                                <span className="ml-2 text-blue-600">— {kegiatan.nama}</span>
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {doneCount}/{steps.length} tahap selesai · Klik lingkaran untuk detail
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {allDone && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Semua Selesai
                                </span>
                              )}
                              {/* Update Progress button */}
                              <button
                                onClick={() => openUpdateModal(kegiatan.id, 'progress')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all hover:scale-105 cursor-pointer"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Update Progress
                              </button>
                              <span className={`text-2xl font-black ${progress === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                {progress}%
                              </span>
                            </div>
                          </div>

                          {/* ── Horizontal timeline ── */}
                          <div className="relative px-2">
                            {/* Background track */}
                            <div className="absolute top-[22px] left-[36px] right-[36px] h-1.5 bg-gray-200 rounded-full" />

                            {/* Done fill */}
                            {doneCount > 0 && steps.length > 1 && (
                              <div
                                className="absolute top-[22px] left-[36px] h-1.5 rounded-full transition-all duration-700"
                                style={{
                                  width: `calc((100% - 72px) * ${(Math.max(doneCount - 1, 0)) / (steps.length - 1)})`,
                                  background: allDone ? '#10b981' : '#3b82f6',
                                }}
                              />
                            )}

                            {/* Step nodes */}
                            <div className="relative z-10 flex items-start justify-between">
                              {steps.map((step, idx) => {
                                const isDone = step.selesai;
                                const isLast = idx === steps.length - 1;
                                const isCurrent = idx === currentStepIdx;

                                return (
                                  <button
                                    key={step.id}
                                    onClick={() => openUpdateModal(kegiatan.id, 'progress')}
                                    title={`${step.nama} — klik untuk update`}
                                    className="flex flex-col items-center focus:outline-none group cursor-pointer"
                                    style={{ minWidth: 64 }}
                                  >
                                    {/* Circle */}
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm group-hover:scale-110 ${isDone
                                        ? isLast
                                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-md'
                                          : 'bg-blue-600 border-blue-600 text-white shadow-blue-200 shadow-md'
                                        : isCurrent
                                          ? 'bg-white border-blue-500 text-blue-600 shadow-blue-100 shadow-md animate-pulse'
                                          : 'bg-white border-gray-300 text-gray-400 group-hover:border-blue-300'
                                      }`}>
                                      {isDone
                                        ? isLast
                                          ? <FileCheck className="w-5 h-5" />
                                          : <Check className="w-5 h-5" strokeWidth={3} />
                                        : <span className="text-xs font-black">
                                          {String.fromCharCode(65 + idx)}
                                        </span>
                                      }
                                    </div>

                                    {/* Label */}
                                    <div className="mt-2 text-center" style={{ maxWidth: 72 }}>
                                      <div className={`text-[11px] font-semibold leading-tight ${isDone
                                          ? isLast ? 'text-emerald-700' : 'text-blue-700'
                                          : isCurrent ? 'text-blue-600' : 'text-gray-400'
                                        }`}>
                                        {isLast ? 'Finish' : step.nama.split(' ').slice(0, 2).join(' ')}
                                      </div>
                                      {isCurrent && (
                                        <div className="text-[9px] text-amber-500 font-bold mt-0.5">● Aktif</div>
                                      )}
                                      {isDone && (
                                        <div className={`text-[9px] font-bold mt-0.5 ${isLast ? 'text-emerald-600' : 'text-blue-500'}`}>
                                          ✓ Done
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Info footer */}
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-5 pt-3 border-t border-blue-100 text-xs text-gray-500">
                            <span><span className="font-semibold text-gray-700">PJ:</span> {kegiatan.penanggungJawab}</span>
                            <span><span className="font-semibold text-gray-700">Pagu:</span> {formatRupiah(kegiatan.paguAnggaran)}</span>
                            <span>
                              <span className="font-semibold text-gray-700">Realisasi:</span>{' '}
                              {formatRupiah(kegiatan.realisasiAnggaran)}{' '}
                              <span className="text-emerald-600 font-semibold">
                                ({Math.round((kegiatan.realisasiAnggaran / kegiatan.paguAnggaran) * 100)}%)
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Menampilkan {filteredKegiatan.length} dari {kegiatans.length} kegiatan
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Sebelumnya</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* ── Update Progress Modal ── */}
      {updateProgressFor && updateKegiatan && (
        <UpdateProgressModal
          kegiatan={updateKegiatan}
          steps={updateKegiatan.steps}
          progress={updateKegiatan.progress}
          onClose={() => setUpdateProgressFor(null)}
          onToggleStep={(stepId) => toggleStep(updateKegiatan.id, stepId)}
          initialPanel={modalInitialPanel}
        />
      )}

      {/* ── Tambah Kegiatan Modal ── */}
      {showAddModal && (
        <KegiatanFormModal mode="add" onClose={() => setShowAddModal(false)} />
      )}

      {/* ── Edit Kegiatan Modal ── */}
      {showEditModalFor && (
        <KegiatanFormModal mode="edit" initialData={kegiatans.find(k => k.id === showEditModalFor)} onClose={() => setShowEditModalFor(null)} />
      )}
    </div>

  );
}
