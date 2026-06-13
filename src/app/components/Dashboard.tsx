import { useState } from 'react';
import {
  FileText,
  ShoppingCart,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { bagianList, kegiatanPerBagian, notifikasiList } from '../lib/data';

const statsCards = [
  {
    title: 'TOTAL KEGIATAN',
    value: '128',
    subtitle: 'Bulan ini',
    detail: '↑ 8% dari bulan lalu',
    detailColor: 'text-emerald-600',
    icon: FileText,
    color: 'bg-blue-500',
    path: '/agenda',
  },
  {
    title: 'KEGIATAN BERJALAN',
    value: '56',
    subtitle: 'Sedang Berjalan',
    detail: '↑ 12% dari bulan lalu',
    detailColor: 'text-emerald-600',
    icon: ShoppingCart,
    color: 'bg-emerald-500',
    path: '/progress',
  },
  {
    title: 'KEGIATAN SELESAI',
    value: '65',
    subtitle: 'Selesai',
    detail: '↑ 5% dari bulan lalu',
    detailColor: 'text-emerald-600',
    icon: CheckCircle,
    color: 'bg-amber-500',
    path: '/laporan-kegiatan',
  },
  {
    title: 'TERLAMBAT / OVERDUE',
    value: '7',
    subtitle: 'Perlu Perhatian',
    detail: '↓ 3% dari bulan lalu',
    detailColor: 'text-red-500',
    icon: AlertTriangle,
    color: 'bg-red-500',
    path: '/agenda',
  },
];

const realisasiData = [
  { name: 'Terpakai', value: 45.67, color: '#3b82f6' },
  { name: 'Tersisa', value: 54.33, color: '#e5e7eb' },
];

const jenisData = [
  { name: 'Persidangan', value: 42, color: '#3b82f6' },
  { name: 'Humas', value: 28, color: '#10b981' },
  { name: 'Umum', value: 35, color: '#f59e0b' },
  { name: 'Keuangan', value: 23, color: '#8b5cf6' },
];

const stepColors: Record<string, string> = {
  Persiapan: 'bg-gray-400',
  Koordinasi: 'bg-blue-400',
  Pelaksanaan: 'bg-amber-400',
  Evaluasi: 'bg-purple-400',
  Verifikasi: 'bg-emerald-400',
  Closed: 'bg-emerald-600',
};

export function Dashboard() {
  const [selectedBagian, setSelectedBagian] = useState('Sekretariat DPRD');

  const kegiatanBerjalan = kegiatanPerBagian[selectedBagian] ?? [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 mb-1">{card.title}</div>
                  <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-1">{card.subtitle}</div>
              <div className={`text-xs font-medium ${card.detailColor}`}>{card.detail}</div>
            </Link>
          );
        })}
      </div>

      {/* Middle row: Progress Bagian (clickable) + Kegiatan Prioritas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress per Bagian — clickable */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">PROGRESS KEGIATAN SEKRETARIAT DPRD</h2>
            <p className="text-xs text-gray-500 mt-0.5">Klik bagian untuk melihat kegiatan berjalan</p>
          </div>

          <div className="space-y-3">
            {bagianList.map((bagian) => {
              const isSelected = selectedBagian === bagian.nama;
              return (
                <button
                  key={bagian.id}
                  onClick={() => setSelectedBagian(bagian.nama)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                      {bagian.nama}
                    </span>
                    <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                      {bagian.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${bagian.warna} h-2 rounded-full transition-all`}
                      style={{ width: `${bagian.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kegiatan Prioritas — filtered by selected bagian */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">KEGIATAN BERJALAN</h2>
              <p className="text-xs text-blue-600 font-medium mt-0.5">{selectedBagian}</p>
            </div>
            <Link
              to="/agenda"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {kegiatanBerjalan.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <CheckCircle className="w-10 h-10 mb-2 text-gray-300" />
                <p className="text-sm">Tidak ada kegiatan berjalan</p>
              </div>
            ) : (
              kegiatanBerjalan.map((kg) => (
                <div key={kg.id} className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">{kg.nama}</h4>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                      kg.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                      kg.status === 'Terlambat' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {kg.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          kg.progress === 100 ? 'bg-emerald-500' :
                          kg.status === 'Terlambat' ? 'bg-red-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${kg.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{kg.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{kg.tanggal}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      stepColors[kg.step] ?? 'bg-gray-200'
                    } text-white`}>
                      {kg.step}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Notifikasi | Realisasi Anggaran | Kegiatan Berdasarkan Jenis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifikasi */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">NOTIFIKASI / PERINGATAN</h2>
            <Link to="/agenda" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {notifikasiList.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  notif.type === 'overdue' ? 'bg-red-100' :
                  notif.type === 'belumSelesai' ? 'bg-yellow-100' :
                  notif.type === 'deadline' ? 'bg-blue-100' :
                  'bg-emerald-100'
                }`}>
                  {notif.type === 'overdue' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                   notif.type === 'belumSelesai' ? <AlertCircle className="w-4 h-4 text-yellow-600" /> :
                   notif.type === 'deadline' ? <Clock className="w-4 h-4 text-blue-600" /> :
                   <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{notif.title}</h3>
                  <p className="text-xs text-gray-500 mb-1 leading-snug">{notif.message}</p>
                  <p className="text-xs text-gray-400">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realisasi Anggaran */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">REALISASI ANGGARAN KEGIATAN</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={realisasiData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {realisasiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-2xl font-bold text-gray-900">45.67%</div>
                <div className="text-xs text-gray-500">Realisasi</div>
              </div>
            </div>

            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Terpakai</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">Rp 44.950.000.000</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pagu Total</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">Rp 98.450.000.000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kegiatan Berdasarkan Jenis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">KEGIATAN BERDASARKAN JENIS</h2>
            <span className="text-xs text-gray-500">Tahun 2025</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jenisData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {jenisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-2xl font-bold text-gray-900">128</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>

            <div className="mt-4 w-full space-y-1.5">
              {jenisData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">{item.value} kegiatan</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
