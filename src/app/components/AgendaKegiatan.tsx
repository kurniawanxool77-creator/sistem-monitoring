import { useState } from 'react';
import { Link } from 'react-router';
import {
  Plus, Search, Edit, Trash2, Eye, X, UserPlus, Minus,
  Check, CheckCircle2, FileCheck, ChevronRight, RefreshCw,
} from 'lucide-react';
import { kegiatanList, masterBidang, sumberDanaList, KegiatanStep, Kegiatan } from '../lib/data';
import { UpdateProgressModal } from './UpdateProgressModal';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

const INITIAL_FORM = {
  namaKegiatan: '',
  bidangId: '',
  subBidangId: '',
  kegiatanTemplateId: '',
  subKegiatanId: '',
  customSteps: [
    'Persiapan Dokumen',
    'Koordinasi Internal',
    'Pelaksanaan Kegiatan',
    'Evaluasi Hasil',
    'Verifikasi Dokumen',
  ],
  tanggalMulai: '',
  tanggalSelesai: '',
  paguAnggaran: 0,
  sumberDana: '',
  anggaranKegiatan: '',
  penanggungJawab: '',
  anggota: [''],
};

export function AgendaKegiatan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const [filterBagian, setFilterBagian] = useState('semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [updateProgressFor, setUpdateProgressFor] = useState<string | null>(null);
  const [modalInitialPanel, setModalInitialPanel] = useState<'progress' | 'realisasi' | 'edit'>('progress');
  const [form, setForm] = useState(INITIAL_FORM);
  
  // State untuk "Tambah Baru" inline
  const [newInputMode, setNewInputMode] = useState<'none' | 'subBidang' | 'kegiatan' | 'subKegiatan'>('none');
  const [newInputValue, setNewInputValue] = useState('');

  const [kegiatans, setKegiatans] = useState<Kegiatan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kegiatan_list_data');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return kegiatanList;
  });

  function openUpdateModal(kegiatanId: string, panel: 'progress' | 'realisasi' | 'edit') {
    setModalInitialPanel(panel);
    setUpdateProgressFor(kegiatanId);
  }

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

  function handleSaveEdit(kegiatanId: string, updatedFields: Partial<Kegiatan>) {
    const next = kegiatans.map((k) => {
      if (k.id !== kegiatanId) return k;
      return { ...k, ...updatedFields };
    });
    setKegiatans(next);
    localStorage.setItem('kegiatan_list_data', JSON.stringify(next));
  }

  const filteredKegiatan = kegiatans.filter((kegiatan) => {
    const matchSearch = kegiatan.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'semua' || kegiatan.status === filterStatus;
    const matchBagian = filterBagian === 'semua' || kegiatan.bidang === filterBagian;
    return matchSearch && matchStatus && matchBagian;
  });

  const selectedBidang = masterBidang.find((b) => b.id === form.bidangId);
  const selectedSubBidang = selectedBidang?.subBidang.find((s) => s.id === form.subBidangId);
  const selectedKegiatan = selectedSubBidang?.kegiatan.find((k) => k.id === form.kegiatanTemplateId);
  const selectedSubKegiatan = selectedKegiatan?.subKegiatan?.find((sk) => sk.id === form.subKegiatanId);

  // Perhitungan Pagu Otomatis
  const currentPagu = form.subKegiatanId ? (selectedSubKegiatan?.pagu || 0) 
                    : form.kegiatanTemplateId ? (selectedKegiatan?.pagu || 0) 
                    : form.subBidangId ? (selectedSubBidang?.paguDefault || 0) 
                    : form.bidangId ? (selectedBidang?.pagu || 0) : 0;

  let activeLevelLabel = '';
  if (form.subKegiatanId && selectedSubKegiatan) activeLevelLabel = 'dari Sub Kegiatan';
  else if (form.kegiatanTemplateId && selectedKegiatan) activeLevelLabel = 'dari Kegiatan';
  else if (form.subBidangId && selectedSubBidang) activeLevelLabel = 'dari Sub Bidang';
  else if (form.bidangId && selectedBidang) activeLevelLabel = 'dari Bidang';
  else activeLevelLabel = 'pilih data...';

  function handleBidangChange(id: string) {
    setForm((f) => ({ ...f, bidangId: id, subBidangId: '', kegiatanTemplateId: '', subKegiatanId: '', paguAnggaran: 0 }));
  }
  
  function handleSelectChange(type: 'subBidang' | 'kegiatan' | 'subKegiatan', value: string) {
    if (value === 'NEW') {
      setNewInputMode(type);
      setNewInputValue('');
    } else {
      if (type === 'subBidang') {
        setForm((f) => ({ ...f, subBidangId: value, kegiatanTemplateId: '', subKegiatanId: '' }));
      } else if (type === 'kegiatan') {
        setForm((f) => ({ ...f, kegiatanTemplateId: value, subKegiatanId: '' }));
      } else if (type === 'subKegiatan') {
        setForm((f) => ({ ...f, subKegiatanId: value }));
      }
    }
  }

  function saveNewItem() {
    if (!newInputValue.trim()) return;
    const newId = `new-${Date.now()}`;
    
    if (newInputMode === 'subBidang' && selectedBidang) {
      selectedBidang.subBidang.push({ id: newId, nama: newInputValue, paguDefault: 0, kegiatan: [] });
      setForm((f) => ({ ...f, subBidangId: newId, kegiatanTemplateId: '', subKegiatanId: '' }));
    } else if (newInputMode === 'kegiatan' && selectedSubBidang) {
      selectedSubBidang.kegiatan.push({ id: newId, nama: newInputValue, pagu: 0, subKegiatan: [] });
      setForm((f) => ({ ...f, kegiatanTemplateId: newId, subKegiatanId: '' }));
    } else if (newInputMode === 'subKegiatan' && selectedKegiatan) {
      if (!selectedKegiatan.subKegiatan) selectedKegiatan.subKegiatan = [];
      selectedKegiatan.subKegiatan.push({ id: newId, nama: newInputValue, pagu: 0 });
      setForm((f) => ({ ...f, subKegiatanId: newId }));
    }
    
    setNewInputMode('none');
    setNewInputValue('');
  }

  function cancelNewItem() {
    setNewInputMode('none');
    setNewInputValue('');
  }
  function addStepRow() {
    setForm((f) => ({
      ...f,
      customSteps: [...f.customSteps.slice(0, -1), '', f.customSteps[f.customSteps.length - 1]],
    }));
  }
  function removeStepRow(idx: number) { setForm((f) => ({ ...f, customSteps: f.customSteps.filter((_, i) => i !== idx) })); }
  function updateStepName(idx: number, v: string) { setForm((f) => { const s = [...f.customSteps]; s[idx] = v; return { ...f, customSteps: s }; }); }
  function addAnggota() { setForm((f) => ({ ...f, anggota: [...f.anggota, ''] })); }
  function removeAnggota(idx: number) { setForm((f) => ({ ...f, anggota: f.anggota.filter((_, i) => i !== idx) })); }
  function updateAnggota(idx: number, v: string) { setForm((f) => { const a = [...f.anggota]; a[idx] = v; return { ...f, anggota: a }; }); }

  const allBidangOptions = Array.from(new Set(kegiatans.map((k) => k.bidang)));

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
          <select value={filterBagian} onChange={(e) => setFilterBagian(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="semua">Semua Bagian</option>
            {allBidangOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
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
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${kegiatan.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                            kegiatan.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' :
                              kegiatan.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                          }`}>{kegiatan.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' :
                                progress >= 60 ? 'bg-blue-500' :
                                  progress >= 30 ? 'bg-amber-500' : 'bg-red-400'
                              }`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-800 min-w-[36px] text-right">{progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Link to={`/agenda/${kegiatan.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Lihat Detail">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openUpdateModal(kegiatan.id, 'edit')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
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
          onSaveRealisasi={(amount) => handleSaveRealisasi(updateKegiatan.id, amount)}
          onSaveEdit={(updatedFields) => handleSaveEdit(updateKegiatan.id, updatedFields)}
          initialPanel={modalInitialPanel}
        />
      )}

      {/* ── Tambah Kegiatan Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-6 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tambah Kegiatan Baru</h2>
              <button onClick={() => { setShowAddModal(false); setForm(INITIAL_FORM); }}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">


              {/* Bidang / Sub Bidang / Kegiatan / Sub Kegiatan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bidang <span className="text-red-500">*</span></label>
                  <select value={form.bidangId} onChange={(e) => handleBidangChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Pilih Bidang</option>
                    {masterBidang.map((b) => <option key={b.id} value={b.id}>{b.nama}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub Bidang <span className="text-red-500">*</span></label>
                  {newInputMode === 'subBidang' ? (
                    <div className="flex gap-2">
                      <input autoFocus type="text" value={newInputValue} onChange={(e) => setNewInputValue(e.target.value)}
                        placeholder="Nama Sub Bidang baru..." className="flex-1 px-3 py-2.5 border border-blue-400 rounded-lg" />
                      <button onClick={saveNewItem} className="px-3 bg-blue-600 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                      <button onClick={cancelNewItem} className="px-3 bg-gray-200 text-gray-600 rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select value={form.subBidangId} onChange={(e) => handleSelectChange('subBidang', e.target.value)} disabled={!form.bidangId}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Pilih Sub Bidang</option>
                      {selectedBidang?.subBidang.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                      <option value="NEW" className="text-blue-600 font-bold">+ Tambah Baru...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kegiatan <span className="text-red-500">*</span></label>
                  {newInputMode === 'kegiatan' ? (
                    <div className="flex gap-2">
                      <input autoFocus type="text" value={newInputValue} onChange={(e) => setNewInputValue(e.target.value)}
                        placeholder="Nama Kegiatan baru..." className="flex-1 px-3 py-2.5 border border-blue-400 rounded-lg" />
                      <button onClick={saveNewItem} className="px-3 bg-blue-600 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                      <button onClick={cancelNewItem} className="px-3 bg-gray-200 text-gray-600 rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select value={form.kegiatanTemplateId} onChange={(e) => handleSelectChange('kegiatan', e.target.value)} disabled={!form.subBidangId}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Pilih Kegiatan</option>
                      {selectedSubBidang?.kegiatan.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                      <option value="NEW" className="text-blue-600 font-bold">+ Tambah Baru...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub Kegiatan <span className="text-gray-400 font-normal">(opsional)</span></label>
                  {newInputMode === 'subKegiatan' ? (
                    <div className="flex gap-2">
                      <input autoFocus type="text" value={newInputValue} onChange={(e) => setNewInputValue(e.target.value)}
                        placeholder="Nama Sub Kegiatan baru..." className="flex-1 px-3 py-2.5 border border-blue-400 rounded-lg" />
                      <button onClick={saveNewItem} className="px-3 bg-blue-600 text-white rounded-lg"><Check className="w-4 h-4" /></button>
                      <button onClick={cancelNewItem} className="px-3 bg-gray-200 text-gray-600 rounded-lg"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select value={form.subKegiatanId} onChange={(e) => handleSelectChange('subKegiatan', e.target.value)} disabled={!form.kegiatanTemplateId}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50">
                      <option value="">Tidak ada / Sesuai Kegiatan</option>
                      {selectedKegiatan?.subKegiatan?.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                      <option value="NEW" className="text-blue-600 font-bold">+ Tambah Baru...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Custom Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Tahapan Progress <span className="text-red-500">*</span></label>
                    <p className="text-xs text-gray-500">Tahap terakhir = Verifikasi Dokumen (otomatis)</p>
                  </div>
                  <button type="button" onClick={addStepRow}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Tambah Tahap
                  </button>
                </div>

                {/* Mini preview */}
                <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 flex-wrap">
                  {form.customSteps.map((step, idx) => {
                    const isLast = idx === form.customSteps.length - 1;
                    return (
                      <div key={idx} className="flex items-center gap-1 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isLast ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-blue-100 border-blue-400 text-blue-700'
                          }`}>
                          {isLast ? '✔' : String.fromCharCode(65 + idx)}
                        </div>
                        {!isLast && <ChevronRight className="w-3 h-3 text-gray-300" />}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {form.customSteps.map((step, idx) => {
                    const isLast = idx === form.customSteps.length - 1;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isLast ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                          {isLast ? '✔' : String.fromCharCode(65 + idx)}
                        </div>
                        <input type="text" value={step}
                          onChange={(e) => updateStepName(idx, e.target.value)}
                          readOnly={isLast}
                          placeholder={isLast ? 'Verifikasi Dokumen' : `Nama tahap ${idx + 1}...`}
                          className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLast ? 'border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default' : 'border-gray-300'
                            }`}
                        />
                        {!isLast && form.customSteps.length > 2 && (
                          <button type="button" onClick={() => removeStepRow(idx)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input type="date" value={form.tanggalMulai}
                    onChange={(e) => setForm((f) => ({ ...f, tanggalMulai: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input type="date" value={form.tanggalSelesai}
                    onChange={(e) => setForm((f) => ({ ...f, tanggalSelesai: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Pagu + Sumber Dana */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pagu Anggaran <span className="text-blue-500 text-xs font-normal">({activeLevelLabel})</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                    <input type="text" readOnly
                      value={currentPagu > 0 ? currentPagu.toLocaleString('id-ID') : ''}
                      placeholder="Menunggu pilihan hierarki..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-blue-50/50 text-blue-800 font-bold cursor-not-allowed text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sumber Dana <span className="text-red-500">*</span></label>
                  <select value={form.sumberDana}
                    onChange={(e) => setForm((f) => ({ ...f, sumberDana: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Pilih Sumber Dana</option>
                    {sumberDanaList.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Anggaran kegiatan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Anggaran Kegiatan <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                  <input type="number" value={form.anggaranKegiatan}
                    onChange={(e) => setForm((f) => ({ ...f, anggaranKegiatan: e.target.value }))}
                    placeholder="Masukkan nominal anggaran"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Penanggung Jawab */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Penanggung Jawab <span className="text-red-500">*</span></label>
                <input type="text" value={form.penanggungJawab}
                  onChange={(e) => setForm((f) => ({ ...f, penanggungJawab: e.target.value }))}
                  placeholder="Nama penanggung jawab..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              {/* Anggota */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Nama Anggota</label>
                  <button type="button" onClick={addAnggota}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <UserPlus className="w-4 h-4" /> Tambah Anggota
                  </button>
                </div>
                <div className="space-y-2">
                  {form.anggota.map((anggota, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <input type="text" value={anggota} onChange={(e) => updateAnggota(idx, e.target.value)}
                        placeholder={`Nama anggota ${idx + 1}...`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      {form.anggota.length > 1 && (
                        <button type="button" onClick={() => removeAnggota(idx)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button onClick={() => { setShowAddModal(false); setForm(INITIAL_FORM); }}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Batal
              </button>
              <button onClick={() => { setShowAddModal(false); setForm(INITIAL_FORM); }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Simpan Kegiatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
