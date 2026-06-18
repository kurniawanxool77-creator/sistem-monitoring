import { useState } from 'react';
import {
  DollarSign, TrendingUp, PieChart as PieChartIcon,
  X, Save, AlertCircle, Wallet, Edit2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  PAGU_TOTAL, BULAN_NAMES,
} from '../../lib/data';
import { useAppData } from '../../hooks/useAppData';

function formatRp(n: number, short = false) {
  if (short) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export function AnggaranRealisasi() {
  const { dataUraian: uraianAnggaran, getSubKegiatanList } = useAppData();
  const subKegiatans = getSubKegiatanList();

  const [showPaguModal, setShowPaguModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditBidangModal, setShowEditBidangModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [editingBulan, setEditingBulan] = useState<{ idx: number; nama: string; currentValue: number } | null>(null);
  const [editingBidang, setEditingBidang] = useState<{ kode: string; nama: string; currentTarget: number } | null>(null);

  // State untuk target per bulan
  const [targetPerBulan, setTargetPerBulan] = useState<Record<number, number[]>>({
    2024: [43_000_000_000, 44_000_000_000, 42_000_000_000, 45_000_000_000, 43_000_000_000, 44_000_000_000, 42_000_000_000, 45_000_000_000, 44_000_000_000, 45_000_000_000, 43_000_000_000, 45_000_000_000],
    2025: [45_000_000_000, 46_000_000_000, 44_000_000_000, 47_000_000_000, 45_000_000_000, 46_000_000_000, 44_000_000_000, 47_000_000_000, 46_000_000_000, 47_000_000_000, 45_000_000_000, 44_000_000_000],
    2026: Array(12).fill(0).map((_, i) => Math.round(PAGU_TOTAL / 12)),
    2027: Array(12).fill(0),
  });

  // State untuk target per bidang (dari Master Data)
  const [targetPerBidang, setTargetPerBidang] = useState<Record<string, number>>({});

  const [paguInput, setPaguInput] = useState('');
  const [tahunAnggaranInput, setTahunAnggaranInput] = useState<number>(2026);
  const [targetInput, setTargetInput] = useState('');
  const [bidangTargetInput, setBidangTargetInput] = useState('');

  // Target per bulan untuk tahun ini
  const currentYearTargets = targetPerBulan[selectedYear] || Array(12).fill(0);

  // Hitung target per bidang dari Master Data (uraian level 1)
  const bidangList = uraianAnggaran.filter(u => u.level === 1);

  // Total pagu = dari target per bidang di Master Data
  const paguTotal = bidangList.reduce((sum, b) => sum + b.target, 0);

  // Hitung realization per bulan dari seluruh kegiatan
  const realizationPerBulan = Array(12).fill(0);
  subKegiatans.forEach(k => {
    const realization = k.realisasiAnggaran || 0;
    if (realization > 0) {
      const startDate = new Date(k.tanggalMulai);
      const endDate = new Date(k.tanggalSelesai);
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();
      const totalMonths = Math.max(1, endMonth - startMonth + 1);
      const perMonth = realization / totalMonths;

      for (let m = startMonth; m <= endMonth && m < 12; m++) {
        realizationPerBulan[m] += perMonth;
      }
    }
  });

  const totalRealisasi = realizationPerBulan.reduce((sum, v) => sum + v, 0);
  const totalSisa = paguTotal - totalRealisasi;
  const pctSerapan = paguTotal > 0 ? ((totalRealisasi / paguTotal) * 100).toFixed(1) : '0';

  // Monthly data
  const monthly = BULAN_NAMES.map((bulan, i) => {
    const target = currentYearTargets[i] || 0;
    const realization = realizationPerBulan[i];
    const pct = target > 0 ? Math.round((realization / target) * 100) : 0;
    const onTrack = pct >= 80;

    return {
      bulan,
      target,
      realization,
      persentase: pct,
      onTrack,
    };
  });

  // Per bidang data
  const perBidangData = bidangList.map(bidang => {
    const kegiatanBidang = subKegiatans.filter(k => k.bidang === bidang.uraian);
    const targetBidang = targetPerBidang[bidang.kode] || bidang.target;
    const realizationBidang = kegiatanBidang.reduce((sum, k) => sum + (k.realisasiAnggaran || 0), 0);
    const pct = targetBidang > 0 ? Math.round((realizationBidang / targetBidang) * 100) : 0;

    return {
      kode: bidang.kode,
      nama: bidang.uraian,
      target: targetBidang,
      realization: realizationBidang,
      persentase: pct,
      jumlahKegiatan: kegiatanBidang.length,
    };
  });

  // Chart data
  const chartData = BULAN_NAMES.map((bln, i) => ({
    bulan: bln.substring(0, 3),
    Target: Math.round(currentYearTargets[i] / 1_000_000),
    Realisasi: Math.round(realizationPerBulan[i] / 1_000_000),
  }));

  const pieData = [
    { name: 'Terserap', value: totalRealisasi, color: '#10b981' },
    { name: 'Sisa', value: Math.max(0, totalSisa), color: '#e5e7eb' },
  ];

  // Handle save pagu
  function handleSavePagu() {
    const val = Number(paguInput.replace(/\D/g, ''));
    if (val > 0) {
      setTargetPerBulan(prev => ({
        ...prev,
        [tahunAnggaranInput]: Array(12).fill(0).map(() => Math.round(val / 12))
      }));
      setSelectedYear(tahunAnggaranInput);
      setPaguInput('');
      setShowPaguModal(false);
    }
  }

  // Handle open edit modal bulan
  function handleOpenEditModal(idx: number, nama: string, currentValue: number) {
    setEditingBulan({ idx, nama, currentValue });
    setTargetInput(currentValue.toString());
    setShowEditModal(true);
  }

  // Handle save target per bulan
  function handleSaveTarget() {
    if (!editingBulan) return;
    const val = Number(targetInput.replace(/\D/g, '')) || 0;

    setTargetPerBulan(prev => {
      const current = prev[selectedYear] || Array(12).fill(0);
      const newTargets = [...current];
      newTargets[editingBulan.idx] = val;
      return {
        ...prev,
        [selectedYear]: newTargets
      };
    });

    setShowEditModal(false);
    setEditingBulan(null);
    setTargetInput('');
  }

  // Handle open edit modal bidang
  function handleOpenEditBidangModal(kode: string, nama: string, currentTarget: number) {
    setEditingBidang({ kode, nama, currentTarget });
    setBidangTargetInput(currentTarget.toString());
    setShowEditBidangModal(true);
  }

  // Handle save target per bidang
  function handleSaveTargetBidang() {
    if (!editingBidang) return;
    const val = Number(bidangTargetInput.replace(/\D/g, '')) || 0;

    setTargetPerBidang(prev => ({
      ...prev,
      [editingBidang.kode]: val
    }));

    setShowEditBidangModal(false);
    setEditingBidang(null);
    setBidangTargetInput('');
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "TOTAL PAGU", value: formatRp(paguTotal, true), color: "bg-blue-500", icon: DollarSign, detail: `Tahun Anggaran ${selectedYear}` },
          { title: "TOTAL REALISASI", value: formatRp(totalRealisasi, true), color: "bg-emerald-500", icon: TrendingUp, detail: "Terserap" },
          { title: "SISA ANGGARAN", value: formatRp(totalSisa, true), color: "bg-amber-500", icon: Wallet, detail: "Sisa Pagu" },
          { title: "PERSENTASE CAPAIAN", value: `${pctSerapan}%`, color: "bg-purple-500", icon: PieChartIcon, detail: "Dari Total Pagu" }
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 active:scale-95 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-2 min-w-0">
                <div className="text-xs font-bold text-gray-500 mb-1 truncate">{c.title}</div>
                <div className="text-3xl font-bold text-gray-900 truncate">{c.value}</div>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${c.color}`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{c.detail}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-700">Tahun Anggaran:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-slate-800">
            {Object.keys(targetPerBulan).map(Number).sort((a, b) => a - b).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button onClick={() => { setPaguInput(String(paguTotal)); setTahunAnggaranInput(selectedYear); setShowPaguModal(true); }}
          className="flex items-center gap-2 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm font-semibold transition-colors">
          <DollarSign className="w-4 h-4" /> Set Pagu Anggaran
        </button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart monthly */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Target vs Realisasi Per Bulan (juta Rp)</h2>
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

      {/* Target Per Bulan */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Target & Realisasi Per Bulan</h3>
          <span className="text-xs text-gray-500">Klik icon edit untuk mengubah target per bulan</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Bulan</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Target</th>
                <th className="text-right py-3 px-4 font-semibold text-emerald-600">Realisasi</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">% Capaian</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => {
                const hasData = m.target > 0;

                return (
                  <tr key={m.bulan} className={`border-b border-gray-100 ${hasData ? 'hover:bg-gray-50' : 'bg-gray-50/50'}`}>
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{m.bulan}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-blue-600 font-medium">
                      {hasData ? formatRp(m.target, true) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-700 font-semibold">
                      {m.realization > 0 ? formatRp(m.realization, true) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {hasData ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-full max-w-[80px] bg-gray-100 rounded-full h-1.5 mx-auto">
                            <div className={`h-1.5 rounded-full ${m.onTrack ? 'bg-emerald-500' : 'bg-amber-400'}`}
                              style={{ width: `${Math.min(m.persentase, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${m.onTrack ? 'text-emerald-700' : 'text-amber-600'}`}>
                            {m.persentase}%
                          </span>
                        </div>
                      ) : <span className="text-gray-300 text-xs block text-center">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditModal(i, m.bulan, m.target)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Target"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                <td colSpan={2} className="py-3 px-4 text-blue-800">TOTAL TAHUN {selectedYear}</td>
                <td className="py-3 px-4 text-right text-blue-800">{formatRp(paguTotal, true)}</td>
                <td className="py-3 px-4 text-right text-emerald-700">{formatRp(totalRealisasi, true)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-base font-black text-blue-700">{pctSerapan}%</span>
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Anggaran Per Bidang */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Anggaran Per Bidang</h3>
          <span className="text-xs text-gray-500">Target = Anggaran per bidang</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-8">No</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama Bidang</th>
                <th className="text-right py-3 px-4 font-semibold text-blue-600">Target (Anggaran)</th>
                <th className="text-right py-3 px-4 font-semibold text-emerald-600">Realisasi</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Sisa</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">% Capaian</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {perBidangData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Tidak ada data bidang. Tambahkan bidang di Master Data.
                  </td>
                </tr>
              ) : perBidangData.map((bidang, idx) => {
                const sisa = bidang.target - bidang.realization;
                const hasData = bidang.target > 0;

                return (
                  <tr key={bidang.kode} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{bidang.nama}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-blue-600 font-medium">
                      {hasData ? formatRp(bidang.target, true) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-700 font-semibold">
                      {bidang.realization > 0 ? formatRp(bidang.realization, true) : '-'}
                    </td>
                    <td className={`py-3 px-4 text-right tabular-nums font-medium ${sisa < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatRp(Math.abs(sisa), true)}
                      {sisa < 0 ? ' (Lebih)' : ''}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasData ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bidang.persentase >= 80 ? 'bg-emerald-100 text-emerald-700' : bidang.persentase >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {bidang.persentase}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditBidangModal(bidang.kode, bidang.nama, bidang.target)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Target"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                <td colSpan={2} className="py-3 px-4 text-blue-800">TOTAL</td>
                <td className="py-3 px-4 text-right text-blue-800">{formatRp(paguTotal, true)}</td>
                <td className="py-3 px-4 text-right text-emerald-700">{formatRp(totalRealisasi, true)}</td>
                <td className="py-3 px-4 text-right text-gray-700">{formatRp(totalSisa, true)}</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-base font-black text-blue-700">{pctSerapan}%</span>
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Set Pagu Anggaran */}
      {showPaguModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Set Pagu Anggaran</h2>
              <button onClick={() => setShowPaguModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Masukkan total pagu anggaran. Target per bulan akan dibagi merata.
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tahun Anggaran</label>
                <select value={tahunAnggaranInput}
                  onChange={(e) => setTahunAnggaranInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  {[2024, 2025, 2026, 2027, 2028, 2029].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Pagu Anggaran</label>
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
                    <div>Target/bulan = <span className="font-semibold text-blue-700">{formatRp(Math.round(Number(paguInput) / 12))}</span> (dibagi merata 12 bulan)</div>
                  </div>
                )}
              </div>
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

      {/* Modal: Edit Target Per Bulan */}
      {showEditModal && editingBulan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Edit Target {editingBulan.nama}</h2>
              <button onClick={() => { setShowEditModal(false); setEditingBulan(null); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Target untuk bulan {editingBulan.nama} saja (bukan kumulatif).
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target {editingBulan.nama}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                  <input type="text"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan target"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                {targetInput && Number(targetInput) > 0 && (
                  <div className="mt-1.5 text-xs text-gray-600">
                    = <span className="font-semibold text-gray-800">{formatRp(Number(targetInput))}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowEditModal(false); setEditingBulan(null); }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveTarget}
                disabled={!targetInput || Number(targetInput) < 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Target Per Bidang */}
      {showEditBidangModal && editingBidang && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Edit Target {editingBidang.nama}</h2>
              <button onClick={() => { setShowEditBidangModal(false); setEditingBidang(null); }} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Target adalah anggaran untuk bidang {editingBidang.nama}.
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target {editingBidang.nama}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                  <input type="text"
                    value={bidangTargetInput}
                    onChange={(e) => setBidangTargetInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Masukkan target"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                {bidangTargetInput && Number(bidangTargetInput) > 0 && (
                  <div className="mt-1.5 text-xs text-gray-600">
                    = <span className="font-semibold text-gray-800">{formatRp(Number(bidangTargetInput))}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => { setShowEditBidangModal(false); setEditingBidang(null); }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveTargetBidang}
                disabled={!bidangTargetInput || Number(bidangTargetInput) < 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40">
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
