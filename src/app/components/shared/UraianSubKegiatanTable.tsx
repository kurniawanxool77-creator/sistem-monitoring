import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, Plus, X, Search } from 'lucide-react';
import { useAppData } from '../../hooks/useAppData';

function formatRp(n: number, short = false) {
  if (short) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export function UraianSubKegiatanTable() {
  const { dataUraian: uraianAnggaran, addRealisasi, addActivityLog } = useAppData();
  const [expandedKode, setExpandedKode] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [selectedBidang, setSelectedBidang] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKode, setSelectedKode] = useState<string>('');
  const [jumlah, setJumlah] = useState<string>('');
  const [keterangan, setKeterangan] = useState<string>('');
  const [sukses, setSukses] = useState(false);

  function toggleExpand(kode: string) {
    setExpandedKode((prev) => {
      const next = new Set(prev);
      next.has(kode) ? next.delete(kode) : next.add(kode);
      return next;
    });
  }

  function isVisible(kode: string) {
    const parts = kode.split('.');
    if (parts.length === 1) return true;
    const parent = parts.slice(0, -1).join('.');
    return expandedKode.has(parent) && isVisible(parent);
  }

  const filteredData = uraianAnggaran.filter(u => {
    if (!selectedBidang) return true;
    return u.kode === selectedBidang || u.kode.startsWith(selectedBidang + '.');
  });

  const uraianTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.target : a, 0);
  const uraianRealisasiTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.realisasi : a, 0);
  const sisaTotal = uraianTotal - uraianRealisasiTotal;

  // Ambil data per Bidang (level 1) untuk kartu ringkasan
  const bidangList = uraianAnggaran.filter(u => u.level === 1);

  // Semua uraian level 3 dan 4 untuk pilihan di modal
  const leafItems = uraianAnggaran.filter(u => u.level === 3 || u.level === 4);
  const filteredLeafItems = leafItems.filter(u => {
    const q = searchQuery.toLowerCase();
    return u.uraian.toLowerCase().includes(q) || u.kode.toLowerCase().includes(q);
  });

  const selectedItem = uraianAnggaran.find(u => u.kode === selectedKode);

  function handleTambah() {
    if (!selectedKode || !jumlah) return;
    const amount = parseInt(jumlah.replace(/[^0-9]/g, ''), 10);
    if (isNaN(amount) || amount <= 0) return;

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    addRealisasi(selectedKode, amount);
    addActivityLog({
      user: user?.nama || 'Admin',
      action: 'Tambah Realisasi Anggaran',
      details: `Realisasi sebesar ${formatRp(amount)} ditambahkan ke ${selectedItem?.uraian ?? selectedKode}${keterangan ? `. Keterangan: ${keterangan}` : ''}.`
    });

    setSukses(true);
    setTimeout(() => {
      setSukses(false);
      setShowModal(false);
      setSelectedKode('');
      setJumlah('');
      setKeterangan('');
      setSearchQuery('');
    }, 1500);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedKode('');
    setJumlah('');
    setKeterangan('');
    setSearchQuery('');
    setSukses(false);
  }

  function formatInputRupiah(val: string) {
    const num = val.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString('id-ID');
  }

  return (
    <div className="space-y-6">

      {/* ── KARTU RINGKASAN PER BIDANG (tanpa judul) + Tombol Tambah ── */}
      <div>
        {/* Header baris: tombol di kanan */}
        <div className="flex items-center justify-end mb-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Realisasi
          </button>
        </div>

        {/* Kartu Summary Bidang */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bidangList.map(b => {
            const sisa = b.target - b.realisasi;
            const pct = b.target > 0 ? Math.round((b.realisasi / b.target) * 100) : 0;
            const sisaPct = 100 - pct;
            const isKritis = sisaPct < 15;
            const isAman = sisaPct >= 40;
            const isSelected = selectedBidang === b.kode;

            return (
              <button
                key={b.kode}
                onClick={() => setSelectedBidang(isSelected ? null : b.kode)}
                className={`text-left bg-white rounded-xl p-4 shadow-sm border transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isSelected
                    ? 'border-blue-500 ring-4 ring-blue-500/20 transform scale-[1.02] shadow-md bg-blue-50/10'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 active:scale-95'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2 min-w-0">
                    <div className="text-xs font-medium text-gray-500 mb-1 truncate" title={b.uraian}>{b.uraian}</div>
                    <div className="text-2xl font-bold text-gray-900 truncate">{formatRp(sisa, true)}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isKritis ? 'bg-red-500' : isAman ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    {isKritis
                      ? <AlertCircle className="w-6 h-6 text-white" />
                      : isAman
                        ? <CheckCircle2 className="w-6 h-6 text-white" />
                        : <AlertCircle className="w-6 h-6 text-white" />
                    }
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Target: <span className="font-medium text-gray-700">{formatRp(b.target, true)}</span></span>
                    <span className="font-bold text-gray-700">{pct}% Terserap</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isKritis ? 'bg-red-500' : pct >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TABEL DETAIL ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Table Info Bar */}
        <div className="flex items-center justify-end px-4 py-3 border-b border-slate-100 bg-white">
          <div className="text-xs text-slate-500">
            Target: <span className="font-bold text-slate-700">{formatRp(uraianTotal, true)}</span>
            {' · '}
            Realisasi: <span className="font-bold text-emerald-600">{formatRp(uraianRealisasiTotal, true)}</span>
            {' · '}
            Sisa: <span className={`font-bold ${sisaTotal < 0 ? 'text-red-600' : 'text-blue-600'}`}>{formatRp(sisaTotal, true)}</span>
            {' · '}
            <span className={`font-bold ${uraianRealisasiTotal / uraianTotal >= 0.7 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {uraianTotal > 0 ? Math.round((uraianRealisasiTotal / uraianTotal) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600 w-24">Kode</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Uraian SubKegiatan</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Target (Pagu)</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">Realisasi</th>
                <th className="text-right py-3 px-4 font-semibold text-blue-700 bg-blue-50">Sisa Anggaran</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-600 w-40">% Capaian</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.filter((u) => isVisible(u.kode)).map((u) => {
                const pct = u.target > 0 ? Math.round((u.realisasi / u.target) * 100) : 0;
                const sisa = u.target - u.realisasi;
                const hasChildren = uraianAnggaran.some((x) => x.kode.startsWith(u.kode + '.') && x.kode.split('.').length === u.kode.split('.').length + 1);
                const isExpanded = expandedKode.has(u.kode);
                const indent = (u.level - 1) * 20;

                return (
                  <React.Fragment key={u.kode}>
                    <tr className={`border-b border-slate-100 ${
                        u.level === 1 ? 'bg-blue-50/50 font-bold' :
                        u.level === 2 ? 'bg-slate-50/50 font-semibold' :
                        u.level === 3 ? 'hover:bg-slate-50' :
                        'hover:bg-slate-50 text-slate-600'
                      }`}>

                      <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap" style={{ paddingLeft: 16 + indent }}>
                        {u.kode}
                      </td>

                      <td className="py-3 px-4" style={{ paddingLeft: 16 + indent }}>
                        <div className="flex items-start gap-2">
                          {hasChildren ? (
                            <button onClick={() => toggleExpand(u.kode)} className="mt-0.5 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors">
                              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                            </button>
                          ) : (
                            <span className="w-5 h-5 flex-shrink-0" />
                          )}
                          <span className={`${u.level === 1 ? 'text-blue-800' : u.level === 2 ? 'text-slate-800' : 'text-slate-700'}`}>
                            {u.uraian}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                        {formatRp(u.target, true)}
                      </td>

                      <td className={`py-3 px-4 text-right tabular-nums font-medium ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>
                        {formatRp(u.realisasi, true)}
                      </td>

                      <td className={`py-3 px-4 text-right tabular-nums font-bold bg-blue-50/30 ${
                        sisa <= 0 ? 'text-red-600' :
                        sisa / u.target < 0.15 ? 'text-orange-600' :
                        'text-blue-700'
                      }`}>
                        {sisa <= 0 ? <span className="text-red-600">Melebihi Pagu</span> : formatRp(sisa, true)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[60px]">
                            <div className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-bold min-w-[36px] text-right ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>

            <tfoot className="bg-slate-100 border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="py-3 px-4 font-bold text-slate-700">TOTAL</td>
                <td className="py-3 px-4 text-right font-black text-slate-800 tabular-nums">{formatRp(uraianTotal, true)}</td>
                <td className="py-3 px-4 text-right font-black text-emerald-700 tabular-nums">{formatRp(uraianRealisasiTotal, true)}</td>
                <td className={`py-3 px-4 text-right font-black tabular-nums ${sisaTotal < 0 ? 'text-red-600' : 'text-blue-700'}`}>{formatRp(sisaTotal, true)}</td>
                <td className="py-3 px-4 text-center font-black text-slate-700">
                  {uraianTotal > 0 ? Math.round((uraianRealisasiTotal / uraianTotal) * 100) : 0}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── MODAL TAMBAH REALISASI ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Tambah Realisasi Anggaran</h2>
                <p className="text-xs text-slate-500 mt-0.5">Catat realisasi penyerapan anggaran kegiatan</p>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sukses ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                </div>
                <p className="font-bold text-emerald-700 text-lg">Realisasi berhasil ditambahkan!</p>
              </div>
            ) : (
              <div className="px-6 py-5 space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Pilih Sub Kegiatan / Sub-Sub Kegiatan <span className="text-red-500">*</span>
                  </label>
                  {selectedItem ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-500 font-mono">{selectedItem.kode}</div>
                        <div className="text-sm font-semibold text-blue-800 truncate">{selectedItem.uraian}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Pagu: {formatRp(selectedItem.target, true)} · Sisa: {formatRp(selectedItem.target - selectedItem.realisasi, true)}
                        </div>
                      </div>
                      <button onClick={() => setSelectedKode('')} className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 flex-shrink-0 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari uraian atau kode..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                        {filteredLeafItems.length === 0 ? (
                          <div className="py-6 text-center text-sm text-slate-400">Tidak ada data</div>
                        ) : filteredLeafItems.map(item => (
                          <button
                            key={item.kode}
                            onClick={() => { setSelectedKode(item.kode); setSearchQuery(''); }}
                            className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-slate-400 flex-shrink-0">{item.kode}</span>
                              <span className="text-sm text-slate-700 truncate">{item.uraian}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jumlah Realisasi (Rp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={jumlah}
                      onChange={e => setJumlah(formatInputRupiah(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                  </div>
                  {selectedItem && jumlah && (
                    <p className={`text-xs mt-1.5 font-medium ${parseInt(jumlah.replace(/\D/g,''), 10) > selectedItem.target - selectedItem.realisasi ? 'text-red-500' : 'text-emerald-600'}`}>
                      {parseInt(jumlah.replace(/\D/g,''), 10) > selectedItem.target - selectedItem.realisasi
                        ? '⚠ Jumlah melebihi sisa pagu anggaran!'
                        : `✓ Sisa setelah input: ${formatRp(selectedItem.target - selectedItem.realisasi - parseInt(jumlah.replace(/\D/g,''), 10), true)}`
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Keterangan <span className="text-slate-400 font-normal">(opsional)</span></label>
                  <textarea
                    rows={2}
                    placeholder="Misal: Pembayaran termin ke-1, pengadaan ATK, dll."
                    value={keterangan}
                    onChange={e => setKeterangan(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={handleCloseModal} className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                  <button
                    onClick={handleTambah}
                    disabled={!selectedKode || !jumlah}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Simpan Realisasi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
