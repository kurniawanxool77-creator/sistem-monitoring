import { useState, useMemo } from 'react';
import {
  DollarSign, TrendingUp, PieChart as PieChartIcon, Upload,
  X, Save, ChevronDown, ChevronRight, Plus, Minus, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  PAGU_TOTAL, BULAN_SINGKAT, BULAN_NAMES, buildMonthlyBudget,
  realisasiPerBulan as INITIAL_REALISASI, uraianAnggaran,
} from '../lib/data';

function formatRp(n: number, short = false) {
  if (short) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

type TabKey = 'bulanan' | 'uraian';

export function AnggaranRealisasi() {
  const [activeTab, setActiveTab] = useState<TabKey>('bulanan');
  const [showInputModal, setShowInputModal] = useState(false);
  const [showPaguModal, setShowPaguModal] = useState(false);
  const [paguTotal, setPaguTotal] = useState(PAGU_TOTAL);
  const [paguInput, setPaguInput] = useState('');
  const [realisasiArr, setRealisasiArr] = useState<number[]>([...INITIAL_REALISASI]);
  const [expandedKode, setExpandedKode] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));

  // Input realisasi form
  const [inputForm, setInputForm] = useState({ bulanIdx: -1, nominal: '', keterangan: '' });

  const monthly = useMemo(() => buildMonthlyBudget(paguTotal, realisasiArr), [paguTotal, realisasiArr]);

  const totalRealisasi = realisasiArr.reduce((a, b) => a + b, 0);
  const totalSisa = paguTotal - totalRealisasi;
  const pctSerapan = paguTotal > 0 ? ((totalRealisasi / paguTotal) * 100).toFixed(1) : '0';

  const bulanJalan = realisasiArr.filter((r) => r > 0).length;
  const realisasiTarget = bulanJalan > 0 ? paguTotal * (bulanJalan / 12) : paguTotal / 12;
  const statusSerapan = totalRealisasi >= realisasiTarget ? 'On Track' : 'Di Bawah Target';

  // Bar chart data — only months with data or current
  const chartData = BULAN_SINGKAT.map((bln, i) => ({
    bulan: bln,
    Target: Math.round(paguTotal / 12 / 1_000_000),
    Realisasi: Math.round(realisasiArr[i] / 1_000_000),
  }));

  const pieData = [
    { name: 'Terserap', value: totalRealisasi, color: '#10b981' },
    { name: 'Sisa', value: Math.max(0, totalSisa), color: '#e5e7eb' },
  ];

  // Toggle uraian row expansion
  function toggleExpand(kode: string) {
    setExpandedKode((prev) => {
      const next = new Set(prev);
      next.has(kode) ? next.delete(kode) : next.add(kode);
      return next;
    });
  }

  function isVisible(kode: string) {
    const parts = kode.split('.');
    if (parts.length === 1) return true; // level 1 always visible
    const parent = parts.slice(0, -1).join('.');
    return expandedKode.has(parent) && isVisible(parent);
  }

  function handleSavePagu() {
    const val = Number(paguInput.replace(/\D/g, ''));
    if (val > 0) { setPaguTotal(val); setPaguInput(''); setShowPaguModal(false); }
  }

  function handleSaveRealisasi() {
    if (inputForm.bulanIdx < 0 || !inputForm.nominal) return;
    setRealisasiArr((prev) => {
      const next = [...prev];
      next[inputForm.bulanIdx] = Number(inputForm.nominal);
      return next;
    });
    setInputForm({ bulanIdx: -1, nominal: '', keterangan: '' });
    setShowInputModal(false);
  }

  const uraianTotal = uraianAnggaran.reduce((a, u) => u.level === 1 ? a + u.target : a, 0);
  const uraianRealisasiTotal = uraianAnggaran.reduce((a, u) => u.level === 1 ? a + u.realisasi : a, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anggaran & Realisasi</h1>
          <p className="text-sm text-gray-600 mt-1">Monitoring anggaran Sekretariat DPRD — input 1x, realisasi otomatis per bulan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPaguModal(true)}
            className="flex items-center gap-2 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm font-semibold transition-colors">
            <DollarSign className="w-4 h-4" /> Set Pagu Anggaran
          </button>
          <button onClick={() => setShowInputModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold">
            <Upload className="w-4 h-4" /> Input Realisasi
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pagu', value: formatRp(paguTotal, true), sub: 'Tahun 2026', color: 'from-blue-500 to-blue-600', icon: <DollarSign className="w-6 h-6" /> },
          { label: 'Total Realisasi', value: formatRp(totalRealisasi, true), sub: `${pctSerapan}% terserap`, color: 'from-emerald-500 to-emerald-600', icon: <TrendingUp className="w-6 h-6" /> },
          { label: 'Sisa Anggaran', value: formatRp(totalSisa, true), sub: `${(100 - parseFloat(pctSerapan)).toFixed(1)}% tersisa`, color: 'from-amber-500 to-amber-600', icon: <PieChartIcon className="w-6 h-6" /> },
          { label: 'Status Serapan', value: parseFloat(pctSerapan) >= 40 ? 'On Track' : 'Perlu Perhatian', sub: `Pagu/bln: ${formatRp(Math.round(paguTotal / 12), true)}`, color: parseFloat(pctSerapan) >= 40 ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600', icon: <TrendingUp className="w-6 h-6" /> },
        ].map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 text-white`}>
            <div className="flex items-center justify-between mb-2">{c.icon}<span className="text-xs text-white/70">{c.label}</span></div>
            <div className="text-xl font-black mb-0.5">{c.value}</div>
            <div className="text-xs text-white/70">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart monthly */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Pagu vs Realisasi Per Bulan (juta Rp)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`Rp ${v}Jt`, '']} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="Target" fill="#93c5fd" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Realisasi" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Serapan Anggaran</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={62} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-xl font-black text-gray-900">{pctSerapan}%</div>
                <div className="text-[10px] text-gray-500">Terserap</div>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-gray-600">{p.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{formatRp(p.value, true)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab: Bulanan / Uraian */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {([
            { key: 'bulanan', label: '📅 Realisasi Per Bulan' },
            { key: 'uraian', label: '📋 Uraian Kegiatan' },
          ] as { key: TabKey; label: string }[]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: BULANAN ── */}
        {activeTab === 'bulanan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Bulan</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Pagu / Bulan</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Target Kumulatif</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">Realisasi</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">% Serapan</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m, i) => {
                  const targetKumulatif = monthly.slice(0, i + 1).reduce((a, b) => a + b.pagu, 0);
                  const realisasiKumulatif = monthly.slice(0, i + 1).reduce((a, b) => a + b.realisasi, 0);
                  const pctKumulatif = targetKumulatif > 0 ? Math.round((realisasiKumulatif / targetKumulatif) * 100) : 0;
                  const hasData = m.realisasi > 0;
                  const onTrack = m.persentase >= 80;

                  return (
                    <tr key={m.bulan} className={`border-b border-gray-100 ${hasData ? 'hover:bg-gray-50' : 'bg-gray-50/50 text-gray-400'}`}>
                      <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{m.bulan}</td>
                      <td className="py-3 px-4 text-right tabular-nums">{formatRp(m.pagu, true)}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-blue-600 font-medium">
                        {formatRp(targetKumulatif, true)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-700 font-semibold">
                        {hasData ? formatRp(m.realisasi, true) : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {hasData ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-full max-w-[80px] bg-gray-100 rounded-full h-1.5 mx-auto">
                              <div className={`h-1.5 rounded-full ${onTrack ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                style={{ width: `${Math.min(m.persentase, 100)}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${onTrack ? 'text-emerald-700' : 'text-amber-600'}`}>
                              {m.persentase}%
                            </span>
                          </div>
                        ) : <span className="text-gray-300 text-xs block text-center">-</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasData ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            onTrack ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {onTrack ? 'On Track' : 'Kurang'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Belum</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => { setInputForm({ bulanIdx: i, nominal: String(m.realisasi || ''), keterangan: '' }); setShowInputModal(true); }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                          {hasData ? 'Edit' : '+ Input'}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Total row */}
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                  <td colSpan={2} className="py-3 px-4 text-blue-800">TOTAL TAHUN 2026</td>
                  <td className="py-3 px-4 text-right text-blue-800">{formatRp(paguTotal, true)}</td>
                  <td className="py-3 px-4 text-right text-blue-600">—</td>
                  <td className="py-3 px-4 text-right text-emerald-700">{formatRp(totalRealisasi, true)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-base font-black text-blue-700">{pctSerapan}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      parseFloat(pctSerapan) >= 40 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>{statusSerapan}</span>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: URAIAN ── */}
        {activeTab === 'uraian' && (
          <div>
            {/* Uraian header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-2">
                <button onClick={() => setExpandedKode(new Set(uraianAnggaran.map((u) => u.kode)))}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 border border-blue-200 rounded-lg hover:bg-blue-50">
                  Expand Semua
                </button>
                <button onClick={() => setExpandedKode(new Set(['1','2','3','4','5']))}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Collapse
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Total Target: <span className="font-bold text-gray-700">{formatRp(uraianTotal, true)}</span>
                {' · '}
                Realisasi: <span className="font-bold text-emerald-700">{formatRp(uraianRealisasiTotal, true)}</span>
                {' · '}
                <span className={`font-bold ${uraianRealisasiTotal / uraianTotal >= 0.7 ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {uraianTotal > 0 ? Math.round((uraianRealisasiTotal / uraianTotal) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 w-24">Kode</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Uraian Kegiatan</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Target</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">Realisasi</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600 w-40">% Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  {uraianAnggaran.filter((u) => isVisible(u.kode)).map((u) => {
                    const pct = u.target > 0 ? Math.round((u.realisasi / u.target) * 100) : 0;
                    const hasChildren = uraianAnggaran.some((x) => x.kode.startsWith(u.kode + '.') && x.kode.split('.').length === u.kode.split('.').length + 1);
                    const isExpanded = expandedKode.has(u.kode);
                    const indent = (u.level - 1) * 20;

                    return (
                      <tr key={u.kode}
                        className={`border-b border-gray-100 ${
                          u.level === 1 ? 'bg-blue-50 font-bold' :
                          u.level === 2 ? 'bg-gray-50 font-semibold' :
                          u.level === 3 ? 'hover:bg-gray-50' :
                          'hover:bg-gray-50 text-gray-600'
                        }`}>
                        {/* Kode */}
                        <td className="py-2.5 px-4 text-xs font-mono text-gray-500 whitespace-nowrap"
                          style={{ paddingLeft: 16 + indent }}>
                          {u.kode}
                        </td>

                        {/* Uraian with expand toggle */}
                        <td className="py-2.5 px-4" style={{ paddingLeft: 16 + indent }}>
                          <div className="flex items-center gap-2">
                            {hasChildren ? (
                              <button onClick={() => toggleExpand(u.kode)}
                                className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 transition-colors">
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            ) : (
                              <span className="w-5 h-5 flex-shrink-0" />
                            )}
                            <span className={`${u.level === 1 ? 'text-blue-800' : u.level === 2 ? 'text-gray-800' : 'text-gray-700'}`}>
                              {u.uraian}
                            </span>
                          </div>
                        </td>

                        {/* Target */}
                        <td className="py-2.5 px-4 text-right tabular-nums text-gray-700">
                          {formatRp(u.target, true)}
                        </td>

                        {/* Realisasi */}
                        <td className={`py-2.5 px-4 text-right tabular-nums font-medium ${
                          pct >= 80 ? 'text-emerald-700' : pct >= 60 ? 'text-blue-700' : 'text-amber-600'
                        }`}>
                          {formatRp(u.realisasi, true)}
                        </td>

                        {/* % Capaian */}
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[60px]">
                              <div className={`h-1.5 rounded-full transition-all ${
                                pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'
                              }`} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className={`text-xs font-bold min-w-[36px] text-right ${
                              pct >= 80 ? 'text-emerald-700' : pct >= 60 ? 'text-blue-700' : 'text-amber-600'
                            }`}>{pct}%</span>
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
      </div>

      {/* ── Modal: Set Pagu Anggaran ── */}
      {showPaguModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Set Pagu Anggaran Total</h2>
              <button onClick={() => setShowPaguModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Masukkan total pagu anggaran 1x. Sistem akan otomatis membagi per 12 bulan.
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Pagu Anggaran 2026</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                  <input type="number" value={paguInput}
                    onChange={(e) => setPaguInput(e.target.value)}
                    placeholder="Contoh: 18500000000"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                {paguInput && Number(paguInput) > 0 && (
                  <div className="mt-1.5 space-y-0.5 text-xs text-gray-600">
                    <div>= <span className="font-semibold text-gray-800">{formatRp(Number(paguInput))}</span></div>
                    <div>Pagu/bulan = <span className="font-semibold text-blue-700">{formatRp(Math.round(Number(paguInput) / 12))}</span></div>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">Pagu saat ini: <span className="font-bold text-gray-700">{formatRp(paguTotal)}</span></div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowPaguModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSavePagu}
                disabled={!paguInput || Number(paguInput) <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Input Realisasi ── */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Input Realisasi Bulanan</h2>
              <button onClick={() => setShowInputModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Bulan <span className="text-red-500">*</span></label>
                <select value={inputForm.bulanIdx}
                  onChange={(e) => setInputForm((f) => ({ ...f, bulanIdx: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value={-1}>Pilih Bulan</option>
                  {BULAN_NAMES.map((b, i) => (
                    <option key={b} value={i}>{b} 2026 — Target: {formatRp(Math.round(paguTotal / 12), true)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nominal Realisasi <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">Rp</span>
                  <input type="number" value={inputForm.nominal}
                    onChange={(e) => setInputForm((f) => ({ ...f, nominal: e.target.value }))}
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                {inputForm.nominal && inputForm.bulanIdx >= 0 && (
                  <div className="mt-1.5 text-xs space-y-0.5">
                    <div className="text-gray-600">= <span className="font-semibold">{formatRp(Number(inputForm.nominal))}</span></div>
                    <div className={Number(inputForm.nominal) >= paguTotal / 12 * 0.8 ? 'text-emerald-600' : 'text-amber-600'}>
                      {Math.round((Number(inputForm.nominal) / (paguTotal / 12)) * 100)}% dari pagu bulan ini
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Keterangan</label>
                <textarea value={inputForm.keterangan}
                  onChange={(e) => setInputForm((f) => ({ ...f, keterangan: e.target.value }))}
                  placeholder="Uraian pengeluaran / keterangan realisasi..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowInputModal(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveRealisasi}
                disabled={inputForm.bulanIdx < 0 || !inputForm.nominal}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-40">
                <Save className="w-4 h-4" /> Simpan Realisasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
