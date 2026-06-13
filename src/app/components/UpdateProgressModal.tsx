import { useState, useRef } from 'react';
import {
  X, Check, FileCheck, Clock, Upload, Download,
  FileText, RefreshCw, DollarSign, Edit3,
  Plus, Trash2, Save, ChevronRight, AlertCircle,
} from 'lucide-react';
import { Kegiatan, KegiatanStep } from '../lib/data';

interface LogItem {
  id: string;
  tanggal: string;
  jam: string;
  keterangan: string;
  oleh: string;
}
interface DocItem {
  id: string;
  nama: string;
  ukuran: string;
  uploadedAt: string;
}

interface Props {
  kegiatan: Kegiatan;
  steps: KegiatanStep[];
  progress: number;
  onClose: () => void;
  onToggleStep: (stepId: string) => void;
  onSaveRealisasi?: (amount: number) => void;
  onSaveEdit?: (updatedFields: Partial<Kegiatan>) => void;
  initialPanel?: ActivePanel;
}

const STEP_DESCRIPTIONS: Record<string, string> = {
  'Persiapan Dokumen': 'Siapkan seluruh dokumen pendukung kegiatan',
  'Koordinasi Internal': 'Koordinasi dengan pihak terkait & konfirmasi peserta',
  'Pelaksanaan Kegiatan': 'Upload foto, dokumen, absensi',
  'Evaluasi Hasil': 'Laporan, notulen, hasil kegiatan',
  'Penyusunan Laporan': 'Susun laporan pelaksanaan kegiatan',
  'Verifikasi Dokumen': 'Cek kelengkapan dokumen & laporan',
  'Closed': 'Kegiatan Selesai Sempurna',
};
const getDesc = (n: string) => STEP_DESCRIPTIONS[n] ?? 'Selesaikan tahap ini sesuai prosedur';

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}
function nowDate() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function nowTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

type ActivePanel = 'progress' | 'realisasi' | 'edit';

export function UpdateProgressModal({
  kegiatan,
  steps,
  progress,
  onClose,
  onToggleStep,
  onSaveRealisasi,
  onSaveEdit,
  initialPanel,
}: Props) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(initialPanel ?? 'progress');
  const [docs, setDocs] = useState<DocItem[]>([
    { id: 'd1', nama: 'Dokumen Perencanaan.pdf', ukuran: '245 KB', uploadedAt: '2 hari yang lalu' },
    { id: 'd2', nama: 'Surat Undangan.pdf', ukuran: '128 KB', uploadedAt: '1 hari yang lalu' },
  ]);
  const [logs, setLogs] = useState<LogItem[]>([
    { id: 'l1', tanggal: '12 Jun 2026', jam: '10:30', keterangan: 'Status diubah menjadi "Berjalan"', oleh: 'Administrator Utama' },
    { id: 'l2', tanggal: '10 Jun 2026', jam: '14:15', keterangan: 'Dokumen "Surat Undangan.pdf" ditambahkan', oleh: 'Administrator Utama' },
    { id: 'l3', tanggal: '8 Jun 2026', jam: '09:00', keterangan: 'Kegiatan dibuat', oleh: 'Administrator Utama' },
  ]);
  const [catatan, setCatatan] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Input Realisasi form state ──
  const [realisasiForm, setRealisasiForm] = useState({
    bulan: '',
    nominal: '',
    tanggal: '',
    keterangan: '',
  });

  // ── Edit Kegiatan form state ──
  const [editForm, setEditForm] = useState({
    nama: kegiatan.nama,
    penanggungJawab: kegiatan.penanggungJawab,
    tanggalMulai: kegiatan.tanggalMulai,
    tanggalSelesai: kegiatan.tanggalSelesai,
    status: kegiatan.status,
    deskripsi: kegiatan.deskripsi,
  });
  const [editFormSteps, setEditFormSteps] = useState<KegiatanStep[]>(() => kegiatan.steps || steps || []);

  const doneCount = steps.filter((s) => s.selesai).length;
  const currentStepIdx = steps.findIndex((s) => !s.selesai);
  const allDone = doneCount === steps.length;

  function addLog(keterangan: string) {
    setLogs((prev) => [{
      id: `l${Date.now()}`,
      tanggal: nowDate(),
      jam: nowTime(),
      keterangan,
      oleh: 'Administrator Utama',
    }, ...prev]);
  }

  function handleMarkStep(step: KegiatanStep) {
    addLog(step.selesai
      ? `Tahap "${step.nama}" dibatalkan / ditandai belum selesai`
      : `Tahap "${step.nama}" ditandai selesai`);
    onToggleStep(step.id);
  }

  function handleUpload(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      setDocs((prev) => [...prev, {
        id: `d${Date.now()}-${Math.random()}`,
        nama: file.name,
        ukuran: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        uploadedAt: 'Baru saja',
      }]);
      addLog(`Dokumen "${file.name}" diunggah`);
    });
  }

  function handleDeleteDoc(id: string) {
    const doc = docs.find((d) => d.id === id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (doc) addLog(`Dokumen "${doc.nama}" dihapus`);
  }

  function handleSaveCatatan() {
    if (!catatan.trim()) return;
    addLog(`Catatan: "${catatan}"`);
    setCatatan('');
  }

  function handleSaveRealisasi() {
    if (!realisasiForm.nominal) return;
    const amount = Number(realisasiForm.nominal);
    addLog(`Input realisasi ${realisasiForm.bulan}: ${formatRp(amount)}`);
    if (onSaveRealisasi) {
      onSaveRealisasi(amount);
    }
    setRealisasiForm({ bulan: '', nominal: '', tanggal: '', keterangan: '' });
    setActivePanel('progress');
  }

  function handleSaveEdit() {
    // Recalculate progress based on current editFormSteps
    const done = editFormSteps.filter((s) => s.selesai).length;
    const newProgress = editFormSteps.length > 0 ? Math.round((done / editFormSteps.length) * 100) : 0;
    
    let newStatus = editForm.status;
    if (newProgress === 100) {
      newStatus = 'Selesai';
    } else if (editForm.status === 'Selesai') {
      newStatus = 'Berjalan';
    }

    let newStep = kegiatan.step;
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

    addLog(`Data kegiatan diperbarui oleh Administrator Utama`);
    if (onSaveEdit) {
      onSaveEdit({
        nama: editForm.nama,
        penanggungJawab: editForm.penanggungJawab,
        tanggalMulai: editForm.tanggalMulai,
        tanggalSelesai: editForm.tanggalSelesai,
        status: newStatus as any,
        progress: newProgress,
        step: newStep as any,
        steps: editFormSteps,
        deskripsi: editForm.deskripsi,
      });
    }
    setActivePanel('progress');
  }

  const BULAN_LIST = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  const navTabs: { key: ActivePanel; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
    {
      key: 'progress',
      label: 'Update Progress',
      icon: <RefreshCw className="w-4 h-4" />,
      color: 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
      activeColor: 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200',
    },
    {
      key: 'realisasi',
      label: 'Input Realisasi',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600',
      activeColor: 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200',
    },
    {
      key: 'edit',
      label: 'Edit Kegiatan',
      icon: <Edit3 className="w-4 h-4" />,
      color: 'border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600',
      activeColor: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#1e3a5f] to-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">Monitoring Kegiatan</h2>
              <p className="text-blue-200 text-xs truncate max-w-[400px] mt-0.5">{kegiatan.nama}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-white">{progress}%</div>
              <div className="text-blue-200 text-xs">{doneCount}/{steps.length} tahap selesai</div>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-2 px-6 pt-4 pb-0 bg-gray-50 border-b border-gray-200">
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePanel(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-2 border-b-0 text-sm font-semibold transition-all -mb-px ${
                activePanel === tab.key ? tab.activeColor : `bg-white ${tab.color}`
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* hidden file input — always mounted so ref works across all panels */}
        <input ref={fileInputRef} type="file" multiple className="hidden"
          onChange={(e) => handleUpload(e.target.files)} />

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT — vertical step timeline (always visible) */}
          <div className="w-60 flex-shrink-0 border-r border-gray-100 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tahapan</div>
              <div className="relative">
                <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gray-200" />
                <div className="space-y-1">
                  {steps.map((step, idx) => {
                    const isDone = step.selesai;
                    const isCurrent = idx === currentStepIdx;
                    const isLast = idx === steps.length - 1;
                    return (
                      <button
                        key={step.id}
                        onClick={() => { handleMarkStep(step); }}
                        className={`relative w-full flex items-start gap-3 p-2 rounded-xl text-left transition-all group ${
                          isCurrent ? 'bg-blue-50 hover:bg-blue-100' :
                          isDone ? 'hover:bg-emerald-50' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className={`relative z-10 w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? isLast ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-blue-600 border-blue-600 text-white'
                            : isCurrent ? 'bg-white border-blue-500 text-blue-600 shadow-md shadow-blue-100'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isDone ? isLast ? <FileCheck className="w-5 h-5" /> : <Check className="w-5 h-5" strokeWidth={3} />
                            : isCurrent ? <Clock className="w-4 h-4 animate-pulse" />
                            : <span className="text-xs font-bold">{String.fromCharCode(65 + idx)}</span>}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className={`text-xs font-semibold leading-tight ${
                            isDone ? isLast ? 'text-emerald-700' : 'text-blue-700'
                            : isCurrent ? 'text-blue-700' : 'text-gray-500'
                          }`}>{step.nama}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{getDesc(step.nama)}</div>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Sedang Berjalan
                            </span>
                          )}
                          {isDone && (
                            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold">✓ Selesai</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — tab content */}
          <div className="flex-1 overflow-y-auto">

            {/* ── TAB: UPDATE PROGRESS ── */}
            {activePanel === 'progress' && (
              <div className="p-6 space-y-6">
                {/* Current step highlight */}
                {!allDone && currentStepIdx >= 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-blue-500 font-bold uppercase tracking-wide mb-1">Tahap Aktif Sekarang</div>
                        <div className="text-base font-bold text-blue-900">{steps[currentStepIdx]?.nama}</div>
                        <div className="text-sm text-blue-600 mt-0.5">{getDesc(steps[currentStepIdx]?.nama)}</div>
                      </div>
                      <button
                        onClick={() => handleMarkStep(steps[currentStepIdx])}
                        className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all hover:scale-105"
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                        Tandai Selesai
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-blue-700">{progress}%</span>
                    </div>
                  </div>
                )}

                {allDone && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-emerald-800">Kegiatan Selesai Sempurna</div>
                      <div className="text-sm text-emerald-600">Semua tahap telah terverifikasi</div>
                    </div>
                  </div>
                )}

                {/* Catatan */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tambah Catatan Progress</label>
                  <div className="flex gap-2">
                    <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)}
                      placeholder="Tulis catatan atau keterangan progress..."
                      rows={2}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                    <button onClick={handleSaveCatatan} disabled={!catatan.trim()}
                      className="self-end flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Save className="w-4 h-4" /> Simpan
                    </button>
                  </div>
                </div>

                {/* Dokumen */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-800">Dokumen Terlampir</h3>
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Upload
                    </button>
                  </div>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 mb-3 text-center cursor-pointer transition-all ${
                      dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Drag & drop atau klik untuk upload (PDF, Word, Excel, Foto)</p>
                  </div>
                  <div className="space-y-2">
                    {docs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group">
                        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">{doc.nama}</div>
                          <div className="text-xs text-gray-500">{doc.ukuran} · {doc.uploadedAt}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteDoc(doc.id)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {docs.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-sm">Belum ada dokumen terlampir</div>
                    )}
                  </div>
                </div>

                {/* Log */}
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Riwayat Perubahan / Log Aktivitas</h3>
                  <div className="relative">
                    <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-100" />
                    <div className="space-y-3">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 relative">
                          <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center flex-shrink-0 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="text-sm font-semibold text-gray-800">{log.keterangan}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{log.tanggal}, {log.jam} · {log.oleh}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: INPUT REALISASI ── */}
            {activePanel === 'realisasi' && (
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-emerald-800">Input Realisasi Anggaran</div>
                    <div className="text-xs text-emerald-600 mt-0.5">
                      Pagu: {formatRp(kegiatan.paguAnggaran)} · Realisasi saat ini: {formatRp(kegiatan.realisasiAnggaran)}{' '}
                      <span className="font-bold">({Math.round((kegiatan.realisasiAnggaran / kegiatan.paguAnggaran) * 100)}%)</span>
                    </div>
                  </div>
                </div>

                {/* Mini monthly bar */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Serapan Per Bulan (Tahun 2026)</div>
                  <div className="grid grid-cols-6 gap-2">
                    {['Jan','Feb','Mar','Apr','Mei','Jun'].map((bln, i) => {
                      const pct = [72, 65, 80, 55, 90, 42][i];
                      return (
                        <div key={bln} className="flex flex-col items-center gap-1">
                          <div className="w-full h-16 bg-gray-100 rounded-lg flex items-end overflow-hidden">
                            <div className={`w-full rounded-t-lg transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`}
                              style={{ height: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">{bln}</span>
                          <span className="text-[10px] font-bold text-gray-700">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form input */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bulan <span className="text-red-500">*</span></label>
                      <select value={realisasiForm.bulan}
                        onChange={(e) => setRealisasiForm((f) => ({ ...f, bulan: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <option value="">Pilih Bulan</option>
                        {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((b) => (
                          <option key={b} value={b}>{b} 2026</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Realisasi <span className="text-red-500">*</span></label>
                      <input type="date" value={realisasiForm.tanggal}
                        onChange={(e) => setRealisasiForm((f) => ({ ...f, tanggal: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nominal Realisasi <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                      <input type="number" value={realisasiForm.nominal}
                        onChange={(e) => setRealisasiForm((f) => ({ ...f, nominal: e.target.value }))}
                        placeholder="0"
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                    </div>
                    {realisasiForm.nominal && (
                      <div className="text-xs text-emerald-600 font-medium mt-1">
                        = {formatRp(Number(realisasiForm.nominal))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Bukti (SPJ / Kwitansi)</label>
                    <div onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition-all">
                      <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Klik untuk upload SPJ / Kwitansi</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Uraian Pengeluaran</label>
                    <textarea value={realisasiForm.keterangan}
                      onChange={(e) => setRealisasiForm((f) => ({ ...f, keterangan: e.target.value }))}
                      placeholder="Jelaskan uraian pengeluaran anggaran..."
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" />
                  </div>
                </div>

                <button onClick={handleSaveRealisasi}
                  disabled={!realisasiForm.bulan || !realisasiForm.nominal}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-200 transition-all">
                  <Save className="w-4 h-4" /> Simpan Realisasi
                </button>
              </div>
            )}

            {/* ── TAB: EDIT KEGIATAN ── */}
            {activePanel === 'edit' && (
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    Perubahan data kegiatan akan tercatat di log aktivitas. Pastikan data yang diubah sudah benar.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Kegiatan</label>
                  <input type="text" value={editForm.nama}
                    onChange={(e) => setEditForm((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Penanggung Jawab</label>
                  <input type="text" value={editForm.penanggungJawab}
                    onChange={(e) => setEditForm((f) => ({ ...f, penanggungJawab: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Mulai</label>
                    <input type="date" value={editForm.tanggalMulai}
                      onChange={(e) => setEditForm((f) => ({ ...f, tanggalMulai: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Selesai</label>
                    <input type="date" value={editForm.tanggalSelesai}
                      onChange={(e) => setEditForm((f) => ({ ...f, tanggalSelesai: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select value={editForm.status}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as any }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                    <option value="Belum Mulai">Belum Mulai</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                  <textarea value={editForm.deskripsi}
                    onChange={(e) => setEditForm((f) => ({ ...f, deskripsi: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />
                </div>

                {/* Edit Steps / Tahapan */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <label className="block text-sm font-semibold text-gray-700">Tahapan Progress</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `step-${Date.now()}`;
                        setEditFormSteps([...editFormSteps, { id: newId, nama: `Tahap Baru`, selesai: false }]);
                      }}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Tahap
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                    {editFormSteps.map((step, idx) => {
                      return (
                        <div key={step.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                          {/* Step letter indicator */}
                          <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          {/* Step name input */}
                          <input
                            type="text"
                            value={step.nama}
                            onChange={(e) => {
                              const updated = editFormSteps.map((s, sIdx) => 
                                sIdx === idx ? { ...s, nama: e.target.value } : s
                              );
                              setEditFormSteps(updated);
                            }}
                            placeholder={`Nama tahapan ${idx + 1}`}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                          />
                          {/* Checkbox for selesai */}
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={step.selesai}
                              onChange={(e) => {
                                const updated = editFormSteps.map((s, sIdx) => 
                                  sIdx === idx ? { ...s, selesai: e.target.checked } : s
                                );
                                setEditFormSteps(updated);
                              }}
                              className="w-3.5 h-3.5 text-amber-500 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-600 font-medium">Selesai</span>
                          </label>
                          {/* Delete button */}
                          {editFormSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editFormSteps.filter((_, sIdx) => sIdx !== idx);
                                setEditFormSteps(updated);
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0 cursor-pointer"
                              title="Hapus tahapan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {editFormSteps.length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-400">Belum ada tahapan. Klik Tambah Tahap di atas.</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setActivePanel('progress')}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Batal
                  </button>
                  <button onClick={handleSaveEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 shadow-md shadow-amber-200 transition-all">
                    <Save className="w-4 h-4" /> Simpan Perubahan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-200 bg-gray-50">
          {navTabs.map((tab) => (
            <button key={tab.key} onClick={() => setActivePanel(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                activePanel === tab.key ? tab.activeColor : `bg-white ${tab.color}`
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-xs font-medium">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
