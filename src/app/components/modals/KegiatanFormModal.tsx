import { useState } from 'react';
import { X, Check, Plus, Minus, UserPlus, ChevronRight } from 'lucide-react';
import { useAppData } from '../../hooks/useAppData';
import { anggotaData, Kegiatan } from '../../lib/data';

interface Props {
  mode: 'add' | 'edit';
  initialData?: Kegiatan;
  onClose: () => void;
}

const sumberDanaList = [
  'APBD Provinsi',
  'APBD Kabupaten/Kota',
  'APBN',
  'Dana Alokasi Khusus (DAK)',
  'Dana Alokasi Umum (DAU)',
  'Dana Bagi Hasil (DBH)',
  'Dana Insentif Daerah (DID)',
  'Hibah'
];

export function KegiatanFormModal({ mode, initialData, onClose }: Props) {
  const { dataUraian, addUraianBaru, updateKegiatanMetadata, deleteKegiatanMetadata, addActivityLog, user } = useAppData();

  const INITIAL_FORM = {
    bidangId: '',
    subBidangId: '',
    kegiatanTemplateId: '',
    subKegiatanId: '',
    penanggungJawab: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    sumberDana: '',
    anggaranKegiatan: '',
    customSteps: ['Persiapan Dokumen', 'Pelaksanaan Kegiatan', 'Evaluasi Hasil', 'Verifikasi Dokumen'],
    anggota: [''],
  };

  const parsedIds = (() => {
    if (mode === 'edit' && initialData) {
      const parts = initialData.id.split('.');
      return {
        bidangId: parts.length >= 1 ? parts[0] : '',
        subBidangId: parts.length >= 2 ? parts.slice(0, 2).join('.') : '',
        kegiatanTemplateId: parts.length >= 3 ? parts.slice(0, 3).join('.') : '',
        subKegiatanId: parts.length >= 4 ? parts.slice(0, 4).join('.') : '',
      };
    }
    return { bidangId: '', subBidangId: '', kegiatanTemplateId: '', subKegiatanId: '' };
  })();

  const [form, setForm] = useState(
    mode === 'edit' && initialData
      ? {
          ...INITIAL_FORM,
          ...parsedIds,
          penanggungJawab: initialData.penanggungJawab,
          tanggalMulai: initialData.tanggalMulai.split('T')[0],
          tanggalSelesai: initialData.tanggalSelesai.split('T')[0],
          sumberDana: initialData.sumberDana || '',
          anggaranKegiatan: initialData.anggaranDiminta?.toString() || '',
          customSteps: initialData.steps.map(s => s.nama),
        }
      : INITIAL_FORM
  );

  const [newInputMode, setNewInputMode] = useState<'subBidang' | 'kegiatan' | 'subKegiatan' | null>(null);
  const [newInputValue, setNewInputValue] = useState('');

  // ── Hierarchy State (for ADD mode) ──
  const listBidang = dataUraian.filter((u) => u.level === 1);
  const selectedBidang = listBidang.find((b) => b.kode === form.bidangId);
  const listSubBidang = dataUraian.filter((u) => u.level === 2 && form.bidangId && u.kode.startsWith(form.bidangId + '.'));
  const selectedSubBidang = listSubBidang.find((s) => s.kode === form.subBidangId);
  const listKegiatan = dataUraian.filter((u) => u.level === 3 && form.subBidangId && u.kode.startsWith(form.subBidangId + '.'));
  const selectedKegiatan = listKegiatan.find((k) => k.kode === form.kegiatanTemplateId);
  const listSubKegiatan = dataUraian.filter((u) => u.level === 4 && form.kegiatanTemplateId && u.kode.startsWith(form.kegiatanTemplateId + '.'));
  const selectedSubKegiatan = listSubKegiatan.find((s) => s.kode === form.subKegiatanId);

  // ── Handlers ──
  function handleBidangChange(val: string) {
    setForm((f) => ({ ...f, bidangId: val, subBidangId: '', kegiatanTemplateId: '', subKegiatanId: '' }));
    setNewInputMode(null);
  }

  function handleSelectChange(level: 'subBidang' | 'kegiatan' | 'subKegiatan', val: string) {
    if (val === 'NEW') {
      setNewInputMode(level);
      setNewInputValue('');
      return;
    }
    if (level === 'subBidang') setForm((f) => ({ ...f, subBidangId: val, kegiatanTemplateId: '', subKegiatanId: '' }));
    if (level === 'kegiatan') setForm((f) => ({ ...f, kegiatanTemplateId: val, subKegiatanId: '' }));
    if (level === 'subKegiatan') setForm((f) => ({ ...f, subKegiatanId: val }));
  }

  function saveNewItem() {
    if (!newInputValue.trim()) return;
    let parentKode = '';
    let level: 2 | 3 | 4 = 2;
    if (newInputMode === 'subBidang') { parentKode = form.bidangId; level = 2; }
    if (newInputMode === 'kegiatan') { parentKode = form.subBidangId; level = 3; }
    if (newInputMode === 'subKegiatan') { parentKode = form.kegiatanTemplateId; level = 4; }

    const newUraian = addUraianBaru(level, parentKode, newInputValue.trim());

    if (newInputMode === 'subBidang') setForm((f) => ({ ...f, subBidangId: newUraian.kode, kegiatanTemplateId: '', subKegiatanId: '' }));
    if (newInputMode === 'kegiatan') setForm((f) => ({ ...f, kegiatanTemplateId: newUraian.kode, subKegiatanId: '' }));
    if (newInputMode === 'subKegiatan') setForm((f) => ({ ...f, subKegiatanId: newUraian.kode }));

    setNewInputMode(null);
    setNewInputValue('');
  }

  function cancelNewItem() {
    setNewInputMode(null);
    setNewInputValue('');
  }

  // Steps
  function addStepRow() {
    setForm(f => {
      const newSteps = [...f.customSteps];
      newSteps.splice(newSteps.length - 1, 0, `Tahap ${newSteps.length}`);
      return { ...f, customSteps: newSteps };
    });
  }
  function updateStepName(idx: number, val: string) {
    setForm(f => {
      const newSteps = [...f.customSteps];
      newSteps[idx] = val;
      return { ...f, customSteps: newSteps };
    });
  }
  function removeStepRow(idx: number) {
    if (form.customSteps.length <= 2) return;
    setForm(f => {
      const newSteps = [...f.customSteps];
      newSteps.splice(idx, 1);
      return { ...f, customSteps: newSteps };
    });
  }

  // Anggota
  function addAnggota() { setForm(f => ({ ...f, anggota: [...f.anggota, ''] })); }
  function updateAnggota(idx: number, val: string) {
    setForm(f => {
      const newAnggota = [...f.anggota];
      newAnggota[idx] = val;
      return { ...f, anggota: newAnggota };
    });
  }
  function removeAnggota(idx: number) {
    setForm(f => ({ ...f, anggota: f.anggota.filter((_, i) => i !== idx) }));
  }

  // Budget calculations (Sisa Anggaran = target - realisasi)
  let currentPagu = selectedBidang ? (selectedBidang.target - selectedBidang.realisasi) : 0;
  let activeLevelLabel = "Bidang";
  if (form.subKegiatanId) { currentPagu = selectedSubKegiatan ? (selectedSubKegiatan.target - selectedSubKegiatan.realisasi) : 0; activeLevelLabel = "Sub Kegiatan"; }
  else if (form.kegiatanTemplateId) { currentPagu = selectedKegiatan ? (selectedKegiatan.target - selectedKegiatan.realisasi) : 0; activeLevelLabel = "Kegiatan"; }
  else if (form.subBidangId) { currentPagu = selectedSubBidang ? (selectedSubBidang.target - selectedSubBidang.realisasi) : 0; activeLevelLabel = "Sub Bidang"; }

  // Save
  function handleSave() {
    if (mode === 'add') {
      if (!form.bidangId) {
        alert("Pilih Bidang terlebih dahulu");
        return;
      }
      const finalKode = form.subKegiatanId || form.kegiatanTemplateId || form.subBidangId || form.bidangId;
      const realisasi = Number(form.anggaranKegiatan) || 0;

      updateKegiatanMetadata({
        id: finalKode,
        penanggungJawab: form.penanggungJawab || 'Belum ada PJ',
        tanggalMulai: form.tanggalMulai || new Date().toISOString().split('T')[0],
        tanggalSelesai: form.tanggalSelesai || new Date().toISOString().split('T')[0],
        deskripsi: `Pelaksanaan kegiatan yang bersumber dari ${form.sumberDana}`,
        steps: form.customSteps.map((stepName, idx) => ({
          id: `step-${Date.now()}-${idx}`,
          nama: stepName,
          selesai: false
        })),
        isApproved: user?.role === 'superadmin', // superadmin auto-approved
        createdByRole: user?.role === 'superadmin' ? 'superadmin' : 'admin',
        sumberDana: form.sumberDana,
        anggaranDiminta: realisasi,
      });

      const uraianStr = selectedSubKegiatan?.uraian || selectedKegiatan?.uraian || selectedSubBidang?.uraian || selectedBidang?.uraian || 'Tanpa Nama';
      addActivityLog({
        user: user?.nama || 'Unknown User',
        action: 'Menambah Agenda Kegiatan',
        details: `Menambah kegiatan baru: ${uraianStr} (${finalKode})`
      });
    } else if (mode === 'edit' && initialData) {
      if (!form.bidangId) {
        alert("Pilih Bidang terlebih dahulu");
        return;
      }
      const realisasi = Number(form.anggaranKegiatan) || 0;
      const finalKode = form.subKegiatanId || form.kegiatanTemplateId || form.subBidangId || form.bidangId;

      if (finalKode !== initialData.id) {
        deleteKegiatanMetadata(initialData.id);
      }
      
      // Preserve done status of steps
      const oldStepsMap = new Map(initialData.steps.map(s => [s.nama, s.selesai]));
      
      updateKegiatanMetadata({
        id: finalKode,
        penanggungJawab: form.penanggungJawab,
        tanggalMulai: form.tanggalMulai,
        tanggalSelesai: form.tanggalSelesai,
        deskripsi: `Pelaksanaan kegiatan yang bersumber dari ${form.sumberDana}`,
        sumberDana: form.sumberDana,
        anggaranDiminta: realisasi,
        steps: form.customSteps.map((stepName, idx) => ({
          id: initialData.steps[idx]?.id || `step-${Date.now()}-${idx}`,
          nama: stepName,
          selesai: oldStepsMap.get(stepName) || false
        })),
        isApproved: initialData.isApproved
      });

      addActivityLog({
        user: user?.nama || 'Unknown User',
        action: 'Edit Kegiatan',
        details: `Mengubah data kegiatan: ${finalKode}`
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-6 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'add' ? 'Tambah Kegiatan Baru' : 'Edit Kegiatan'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bidang <span className="text-red-500">*</span></label>
                <select value={form.bidangId} onChange={(e) => handleBidangChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Pilih Bidang</option>
                  {listBidang.map((b) => <option key={b.kode} value={b.kode}>{b.uraian}</option>)}
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
                    {listSubBidang.map((s) => <option key={s.kode} value={s.kode}>{s.uraian}</option>)}
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
                    {listKegiatan.map((k) => <option key={k.kode} value={k.kode}>{k.uraian}</option>)}
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
                    {listSubKegiatan.map((k) => <option key={k.kode} value={k.kode}>{k.uraian}</option>)}
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

            <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 flex-wrap">
              {form.customSteps.map((step, idx) => {
                const isLast = idx === form.customSteps.length - 1;
                return (
                  <div key={idx} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isLast ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'bg-blue-100 border-blue-400 text-blue-700'}`}>
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
                    <div className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isLast ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {isLast ? '✔' : String.fromCharCode(65 + idx)}
                    </div>
                    <input type="text" value={step}
                      onChange={(e) => updateStepName(idx, e.target.value)}
                      readOnly={isLast}
                      placeholder={isLast ? 'Verifikasi Dokumen' : `Nama tahap ${idx + 1}...`}
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLast ? 'border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default' : 'border-gray-300'}`}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Sisa Anggaran <span className="text-blue-500 text-xs font-normal">({activeLevelLabel})</span>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Anggaran {mode === 'add' ? 'Kegiatan' : 'Diminta'} <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input type="number" value={form.anggaranKegiatan}
                onChange={(e) => setForm((f) => ({ ...f, anggaranKegiatan: e.target.value }))}
                placeholder="Masukkan nominal anggaran"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Penanggung Jawab <span className="text-red-500">*</span></label>
            <input list="anggota-list" value={form.penanggungJawab} onChange={(e) => setForm(f => ({...f, penanggungJawab: e.target.value}))}
              placeholder="Ketik untuk mencari penanggung jawab..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <datalist id="anggota-list">
              {anggotaData.map(a => <option key={a.id} value={a.nama}>{a.nama} - {a.jabatan}</option>)}
            </datalist>
          </div>

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
                  <input list="anggota-list" type="text" value={anggota} onChange={(e) => updateAnggota(idx, e.target.value)}
                    placeholder={`Ketik nama anggota ${idx + 1}...`}
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
          <button onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm font-medium">
            Batal
          </button>
          <button onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-lg shadow-blue-200">
            {mode === 'add' ? 'Simpan Kegiatan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
