import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { uraianAnggaran, UraianAnggaran } from '../lib/data';

function formatRp(n: number, short = false) {
  if (short) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

const BULAN_SINGKAT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

export function UraianKegiatanTable() {
  const [expandedKode, setExpandedKode] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [expandedBulanan, setExpandedBulanan] = useState<Set<string>>(new Set());

  // Filter state
  const [filterBidang, setFilterBidang] = useState('Semua Bidang');

  function toggleExpand(kode: string) {
    setExpandedKode((prev) => {
      const next = new Set(prev);
      next.has(kode) ? next.delete(kode) : next.add(kode);
      return next;
    });
  }

  function toggleBulanan(kode: string) {
    setExpandedBulanan((prev) => {
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

  // Filter logic: if Bidang is selected, only show that Bidang and its children
  const filteredData = uraianAnggaran.filter(u => {
    if (filterBidang !== 'Semua Bidang') {
      const bidangKode = uraianAnggaran.find(x => x.level === 1 && x.uraian === filterBidang)?.kode;
      if (bidangKode && !u.kode.startsWith(bidangKode)) return false;
    }
    return true;
  });

  const uraianTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.target : a, 0);
  const uraianRealisasiTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.realisasi : a, 0);

  // Helper to generate mock monthly targets for Bidang and Sub Bidang
  const generateMonthlyTarget = (target: number) => {
    const perBulan = Math.floor(target / 12);
    return Array(12).fill(perBulan);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* FILTER SECTION */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
          <Filter className="w-4 h-4" /> Filter Uraian Kegiatan
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Bidang</label>
            <select value={filterBidang} onChange={e => setFilterBidang(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option>Semua Bidang</option>
              {uraianAnggaran.filter(u => u.level === 1).map(u => (
                <option key={u.kode} value={u.uraian}>{u.uraian}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
        <div className="flex gap-2">
          <button onClick={() => setExpandedKode(new Set(uraianAnggaran.map((u) => u.kode)))}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
            Expand Semua
          </button>
          <button onClick={() => setExpandedKode(new Set(['1', '2', '3', '4', '5']))}
            className="text-xs text-slate-600 hover:text-slate-700 font-medium px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Collapse
          </button>
        </div>
        <div className="text-xs text-slate-500">
          Total Target: <span className="font-bold text-slate-700">{formatRp(uraianTotal, true)}</span>
          {' · '}
          Realisasi: <span className="font-bold text-emerald-600">{formatRp(uraianRealisasiTotal, true)}</span>
          {' · '}
          <span className={`font-bold ${uraianRealisasiTotal / uraianTotal >= 0.7 ? 'text-emerald-600' : 'text-amber-500'}`}>
            {uraianTotal > 0 ? Math.round((uraianRealisasiTotal / uraianTotal) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-slate-600 w-24">Kode</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Uraian Kegiatan</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-600">Target</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-600">Realisasi</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600 w-40">% Capaian</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.filter((u) => isVisible(u.kode)).map((u) => {
              const pct = u.target > 0 ? Math.round((u.realisasi / u.target) * 100) : 0;
              const hasChildren = uraianAnggaran.some((x) => x.kode.startsWith(u.kode + '.') && x.kode.split('.').length === u.kode.split('.').length + 1);
              const isExpanded = expandedKode.has(u.kode);
              const indent = (u.level - 1) * 20;

              // Only allow Bidang (level 1) and Sub Bagian (level 2) to show monthly targets
              const showMonthlyToggle = u.level === 1 || u.level === 2;
              const isBulananExpanded = expandedBulanan.has(u.kode);

              return (
                <React.Fragment key={u.kode}>
                  <tr className={`border-b border-slate-100 ${
                      u.level === 1 ? 'bg-blue-50/50 font-bold' :
                      u.level === 2 ? 'bg-slate-50/50 font-semibold' :
                      u.level === 3 ? 'hover:bg-slate-50' :
                      'hover:bg-slate-50 text-slate-600'
                    }`}>
                    
                    {/* Kode */}
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap" style={{ paddingLeft: 16 + indent }}>
                      {u.kode}
                    </td>

                    {/* Uraian with expand toggle */}
                    <td className="py-3 px-4" style={{ paddingLeft: 16 + indent }}>
                      <div className="flex items-start gap-2">
                        {hasChildren ? (
                          <button onClick={() => toggleExpand(u.kode)} className="mt-0.5 w-5 h-5 flex-shrink-0 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <span className="w-5 h-5 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span className={`${u.level === 1 ? 'text-blue-800' : u.level === 2 ? 'text-slate-800' : 'text-slate-700'}`}>
                            {u.uraian}
                          </span>
                          {/* Toggle Bulanan */}
                          {showMonthlyToggle && (
                            <button onClick={() => toggleBulanan(u.kode)} className="mt-1 text-left text-[11px] font-semibold text-blue-500 hover:text-blue-700 flex items-center gap-1">
                              {isBulananExpanded ? 'Sembunyikan Target Bulanan' : 'Lihat Target Bulanan'}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                      {formatRp(u.target, true)}
                    </td>

                    {/* Realisasi */}
                    <td className={`py-3 px-4 text-right tabular-nums font-medium ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>
                      {formatRp(u.realisasi, true)}
                    </td>

                    {/* % Capaian */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[60px]">
                          <div className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-bold min-w-[36px] text-right ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : 'text-amber-500'}`}>{pct}%</span>
                      </div>
                    </td>
                  </tr>

                  {/* BULANAN EXPANDED VIEW */}
                  {showMonthlyToggle && isBulananExpanded && (
                    <tr>
                      <td colSpan={5} className="p-0 border-b border-slate-200">
                        <div className="bg-slate-50 p-4 pl-16">
                          <div className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Target Bulanan ({u.uraian})</div>
                          <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
                            {generateMonthlyTarget(u.target).map((tgt, i) => (
                              <div key={i} className="bg-white p-2 rounded border border-slate-200 text-center shadow-sm">
                                <div className="text-[10px] font-semibold text-slate-500 mb-1">{BULAN_SINGKAT[i]}</div>
                                <div className="text-[11px] font-bold text-slate-800 tabular-nums" title={formatRp(tgt)}>{formatRp(tgt, true)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
