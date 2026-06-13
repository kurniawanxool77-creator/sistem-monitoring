import { useState } from 'react';
import { Database, Plus, Edit, Trash2, ChevronDown, ChevronRight, DollarSign, X, Save } from 'lucide-react';
import { masterBidang } from '../lib/data';

type TabKey = 'bidang' | 'subBidang' | 'kegiatan' | 'anggota';

const BIDANG_COLORS: Record<string, string> = {
  'Sekretariat DPRD':          'bg-blue-100 text-blue-700',
  'Bagian Umum':               'bg-emerald-100 text-emerald-700',
  'Bagian Hubungan Masyarakat':'bg-orange-100 text-orange-700',
  'Bagian Persidangan':        'bg-purple-100 text-purple-700',
  'Keuangan':                  'bg-amber-100 text-amber-700',
};

const BIDANG_KODE: Record<string, string> = {
  'Sekretariat DPRD':          'SKR',
  'Bagian Umum':               'UMUM',
  'Bagian Hubungan Masyarakat':'HUMAS',
  'Bagian Persidangan':        'SID',
  'Keuangan':                  'KEU',
};

function formatRp(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

const anggotaData = [
  { id: '1', nama: 'AGUNG HARIYADI, SE, MM', jabatan: 'Sekretaris DPRD', bidang: 'Sekretariat DPRD' },
  { id: '2', nama: 'Drs. Bambang Setiawan, M.Si', jabatan: 'Kepala Bagian Umum', bidang: 'Bagian Umum' },
  { id: '3', nama: 'Hj. Sri Wahyuni, S.H', jabatan: 'Kepala Bagian Hubungan Masyarakat', bidang: 'Bagian Hubungan Masyarakat' },
  { id: '4', nama: 'Ir. Eko Nugroho, M.T', jabatan: 'Kepala Bagian Persidangan', bidang: 'Bagian Persidangan' },
  { id: '5', nama: 'Dra. Endah Kusumastuti', jabatan: 'Kepala Sub Bagian Keuangan', bidang: 'Keuangan' },
  { id: '6', nama: 'Ahmad Fauzi, S.E', jabatan: 'Bendahara Pengeluaran', bidang: 'Keuangan' },
  { id: '7', nama: 'Yuliana Dewi, A.Md', jabatan: 'Staf Persidangan', bidang: 'Bagian Persidangan' },
  { id: '8', nama: 'Rudi Hartanto, S.Sos', jabatan: 'Staf Hubungan Masyarakat', bidang: 'Bagian Hubungan Masyarakat' },
];

// Flatten all sub bidang
const allSubBidang = masterBidang.flatMap(b => b.subBidang.map(s => ({ ...s, bidangNama: b.nama })));

// Flatten all kegiatan
const allKegiatan = masterBidang.flatMap(b =>
  b.subBidang.flatMap(s =>
    s.kegiatan.map(k => ({ ...k, subBidangNama: s.nama, bidangNama: b.nama }))
  )
);

export function MasterData() {
  const [activeTab, setActiveTab] = useState<TabKey>('bidang');
  const [expandedBidang, setExpandedBidang] = useState<Set<string>>(new Set(['bid-1']));
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterBidang, setFilterBidang] = useState('semua');

  function toggleBidang(id: string) {
    setExpandedBidang(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filteredSubBidang = filterBidang === 'semua'
    ? allSubBidang
    : allSubBidang.filter(s => s.bidangNama === filterBidang);

  const filteredKegiatan = filterBidang === 'semua'
    ? allKegiatan
    : allKegiatan.filter(k => k.bidangNama === filterBidang);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'bidang',    label: 'Bidang / Bagian',   count: masterBidang.length },
    { key: 'subBidang', label: 'Sub Bidang',         count: allSubBidang.length },
    { key: 'kegiatan',  label: 'Kegiatan',           count: allKegiatan.length },
    { key: 'anggota',   label: 'Anggota & Jabatan',  count: anggotaData.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola struktur bidang, sub bidang, dan kegiatan Sekretariat DPRD Provinsi Jawa Tengah
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Bidang', value: masterBidang.length, color: 'from-blue-500 to-blue-600' },
          { label: 'Total Sub Bidang', value: allSubBidang.length, color: 'from-purple-500 to-purple-600' },
          { label: 'Total Kegiatan', value: allKegiatan.length, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Total Anggota', value: anggotaData.length, color: 'from-amber-500 to-amber-600' },
        ].map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-4 text-white`}>
            <div className="text-2xl font-black">{c.value}</div>
            <div className="text-sm text-white/80 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}>
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── BIDANG tab ── */}
          {activeTab === 'bidang' && (
            <div className="space-y-3">
              {masterBidang.map(bidang => {
                const isExpanded = expandedBidang.has(bidang.id);
                const colorClass = BIDANG_COLORS[bidang.nama] ?? 'bg-gray-100 text-gray-700';
                const totalPagu = bidang.subBidang.reduce((a, s) => a + s.kegiatan.reduce((b, k) => b + k.pagu, 0), 0);

                return (
                  <div key={bidang.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Bidang header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleBidang(bidang.id)}
                          className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colorClass}`}>
                          {BIDANG_KODE[bidang.nama] ?? 'BID'}
                        </span>
                        <div>
                          <div className="font-bold text-gray-900">{bidang.nama}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {bidang.subBidang.length} Sub Bidang ·{' '}
                            {bidang.subBidang.reduce((a, s) => a + s.kegiatan.length, 0)} Kegiatan
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Total Pagu</div>
                          <div className="text-sm font-bold text-blue-700">{formatRp(totalPagu)}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sub Bidang list */}
                    {isExpanded && (
                      <div className="divide-y divide-gray-100">
                        {bidang.subBidang.map((sub, si) => (
                          <div key={sub.id} className="px-5 py-3 pl-12">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-xs text-gray-400 font-mono mr-2">{si + 1}</span>
                                <span className="text-sm font-semibold text-gray-800">{sub.nama}</span>
                                <span className="ml-2 text-xs text-gray-500">{sub.kegiatan.length} kegiatan</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                  Default: <span className="font-semibold text-emerald-700">{formatRp(sub.paguDefault)}</span>
                                </span>
                                <button className="p-1 text-amber-500 hover:bg-amber-50 rounded transition-colors">
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {/* Kegiatan chips */}
                            <div className="flex flex-wrap gap-1.5 pl-4">
                              {sub.kegiatan.map(k => (
                                <div key={k.id}
                                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 hover:bg-blue-100 transition-colors group">
                                  <DollarSign className="w-3 h-3 text-blue-400" />
                                  <span className="font-medium">{k.nama}</span>
                                  <span className="text-blue-400 font-mono">{formatRp(k.pagu)}</span>
                                  <button className="opacity-0 group-hover:opacity-100 ml-0.5 text-red-400 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-blue-300 rounded-lg text-xs text-blue-500 hover:bg-blue-50 transition-colors">
                                <Plus className="w-3 h-3" /> Tambah
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── SUB BIDANG tab ── */}
          {activeTab === 'subBidang' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <select value={filterBidang} onChange={e => setFilterBidang(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="semua">Semua Bidang</option>
                  {masterBidang.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
                </select>
                <span className="text-sm text-gray-500">{filteredSubBidang.length} sub bidang</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama Sub Bidang</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Bidang</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">Pagu Default</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600">Jml Kegiatan</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubBidang.map((sub, idx) => {
                      const color = BIDANG_COLORS[sub.bidangNama] ?? 'bg-gray-100 text-gray-600';
                      return (
                        <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{sub.nama}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${color}`}>
                              {sub.bidangNama}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-blue-700">{formatRp(sub.paguDefault)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {sub.kegiatan.length}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── KEGIATAN tab ── */}
          {activeTab === 'kegiatan' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <select value={filterBidang} onChange={e => setFilterBidang(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="semua">Semua Bidang</option>
                  {masterBidang.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
                </select>
                <span className="text-sm text-gray-500">{filteredKegiatan.length} kegiatan</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama Kegiatan</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Sub Bidang</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Bidang</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600">Pagu Anggaran</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKegiatan.map((k, idx) => {
                      const color = BIDANG_COLORS[k.bidangNama] ?? 'bg-gray-100 text-gray-600';
                      return (
                        <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">{k.nama}</td>
                          <td className="py-3 px-4 text-gray-600 text-xs">{k.subBidangNama}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${color}`}>
                              {k.bidangNama}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-blue-700">{formatRp(k.pagu)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <td colSpan={4} className="py-3 px-4 text-blue-800 text-right">TOTAL PAGU</td>
                      <td className="py-3 px-4 text-right text-blue-900 font-black">
                        {formatRp(filteredKegiatan.reduce((a, k) => a + k.pagu, 0))}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANGGOTA tab ── */}
          {activeTab === 'anggota' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Jabatan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Bidang</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {anggotaData.map((item, idx) => {
                    const color = BIDANG_COLORS[item.bidang] ?? 'bg-gray-100 text-gray-600';
                    const initials = item.nama.split(' ').slice(0, 2).map(w => w[0]).join('');
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <span className="font-semibold text-gray-800">{item.nama}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.jabatan}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${color}`}>
                            {item.bidang}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
        <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Tentang Master Data</h3>
          <p className="text-sm text-blue-800">
            Data bidang, sub bidang, dan kegiatan bersumber dari dokumen <strong>E-Controlling 2026 –
            Rekap Progres Agenda Sekretariat DPRD Provinsi Jawa Tengah</strong>.
            Total anggaran: <strong>Rp 559,4 Miliar</strong> — Kepala SKPD: <strong>AGUNG HARIYADI, SE, MM</strong>.
          </p>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Tambah {activeTab === 'bidang' ? 'Bidang' : activeTab === 'subBidang' ? 'Sub Bidang' : activeTab === 'kegiatan' ? 'Kegiatan' : 'Anggota'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeTab === 'bidang' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kode Bidang <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Contoh: SKR" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Bidang <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Nama bidang..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </>
              )}
              {activeTab === 'subBidang' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bidang <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Pilih Bidang</option>
                      {masterBidang.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Sub Bidang <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Nama sub bidang..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pagu Default</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                      <input type="number" placeholder="0" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'kegiatan' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bidang <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Pilih Bidang</option>
                      {masterBidang.map(b => <option key={b.id} value={b.id}>{b.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub Bidang <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Pilih Sub Bidang</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Nama kegiatan..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pagu Anggaran <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                      <input type="number" placeholder="0" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'anggota' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Nama lengkap + gelar..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jabatan <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Jabatan / posisi..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bidang <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Pilih Bidang</option>
                      {masterBidang.map(b => <option key={b.id} value={b.nama}>{b.nama}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
