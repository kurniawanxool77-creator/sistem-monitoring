import React, { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { uraianAnggaran, UraianAnggaran } from '../lib/data';

function formatRp(n: number, short = false) {
  if (short) {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)}M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}



export function UraianKegiatanTable() {
  const [expandedKode, setExpandedKode] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));

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

  const filteredData = uraianAnggaran;

  const uraianTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.target : a, 0);
  const uraianRealisasiTotal = filteredData.reduce((a, u) => u.level === 1 ? a + u.realisasi : a, 0);
  const sisaTotal = uraianTotal - uraianRealisasiTotal;



  // Ambil data per Bidang (level 1) untuk kartu ringkasan
  const bidangList = uraianAnggaran.filter(u => u.level === 1);

  return (
    <div className="space-y-6">

      {/* ── KARTU RINGKASAN SISA ANGGARAN PER BIDANG ── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-blue-600" />
          Sisa Anggaran per Bidang / Bagian
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {bidangList.map(b => {
            const sisa = b.target - b.realisasi;
            const pct = b.target > 0 ? Math.round((b.realisasi / b.target) * 100) : 0;

            const sisaPct = 100 - pct;
            const isKritis = sisaPct < 15;
            const isAman = sisaPct >= 40;
            return (
              <div key={b.kode} style={{ minWidth: '200px', maxWidth: '240px', flex: '1 1 200px' }}
                className={`rounded-xl border p-4 flex flex-col gap-2 shadow-sm transition-all ${
                  isKritis
                    ? 'bg-red-50 border-red-200'
                    : isAman
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-700 leading-tight line-clamp-2">{b.uraian}</div>
                  {isKritis
                    ? <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    : isAman
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  }
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Sisa Anggaran</div>
                  <div className={`text-sm font-black tabular-nums ${
                    isKritis ? 'text-red-600' : isAman ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {formatRp(sisa, true)}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Terserap</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isKritis ? 'bg-red-500' : pct >= 60 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Target: <span className="font-semibold text-slate-700">{formatRp(b.target, true)}</span></span>
                  <span>Real: <span className="font-semibold text-emerald-700">{formatRp(b.realisasi, true)}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TABEL DETAIL ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Table Header */}
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
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Uraian Kegiatan</th>
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

                      {/* Kode */}
                      <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap" style={{ paddingLeft: 16 + indent }}>
                        {u.kode}
                      </td>

                      {/* Uraian */}
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

                      {/* Sisa Anggaran — kolom baru */}
                      <td className={`py-3 px-4 text-right tabular-nums font-bold bg-blue-50/30 ${
                        sisa <= 0 ? 'text-red-600' :
                        sisa / u.target < 0.15 ? 'text-orange-600' :
                        'text-blue-700'
                      }`}>
                        {sisa <= 0
                          ? <span className="text-red-600">Melebihi Pagu</span>
                          : formatRp(sisa, true)
                        }
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

                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Footer Total */}
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
    </div>
  );
}
