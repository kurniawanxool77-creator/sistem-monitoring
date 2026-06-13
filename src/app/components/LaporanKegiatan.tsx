import { useState } from 'react';
import { FileText, Download, Eye, Printer, Share2 } from 'lucide-react';

export function LaporanKegiatan() {
  const [filterBagian, setFilterBagian] = useState('semua');
  const [filterBulan, setFilterBulan] = useState('semua');
  const [filterStatus, setFilterStatus] = useState('semua');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan Kegiatan</h1>
        <p className="text-sm text-gray-600 mt-1">Generate dan export laporan kegiatan</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Filter Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kegiatan</label>
            <input
              type="text"
              placeholder="Cari kegiatan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bagian</label>
            <select
              value={filterBagian}
              onChange={(e) => setFilterBagian(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semua">Semua Bagian</option>
              <option value="sekretariat">Sekretariat DPRD</option>
              <option value="komisi-a">Komisi A</option>
              <option value="komisi-b">Komisi B</option>
              <option value="komisi-c">Komisi C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semua">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semua">Semua Status</option>
              <option value="selesai">Selesai</option>
              <option value="berjalan">Berjalan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-900">Preview Laporan</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
              Print Preview
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
              Share Link
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Sample Report Content */}
        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50">
          <div className="bg-white p-8 rounded shadow-sm">
            {/* Report Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900">SEKRETARIAT DPRD</h3>
                  <p className="text-sm text-gray-600">Provinsi Jawa Tengah</p>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">LAPORAN KEGIATAN</h1>
              <p className="text-gray-600">Periode: Juni 2025</p>
            </div>

            {/* Report Summary */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan Kegiatan</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Kegiatan</div>
                  <div className="text-2xl font-bold text-blue-600">128</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Selesai</div>
                  <div className="text-2xl font-bold text-emerald-600">65</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Berjalan</div>
                  <div className="text-2xl font-bold text-amber-600">56</div>
                </div>
              </div>
            </div>

            {/* Sample Table */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Daftar Kegiatan</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-3 border">No</th>
                    <th className="text-left py-2 px-3 border">Nama Kegiatan</th>
                    <th className="text-left py-2 px-3 border">Tanggal</th>
                    <th className="text-left py-2 px-3 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-3 border">1</td>
                    <td className="py-2 px-3 border">Pembahasan Raperda APBD 2025-2029</td>
                    <td className="py-2 px-3 border">12 Mei 2025</td>
                    <td className="py-2 px-3 border">Berjalan</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border">2</td>
                    <td className="py-2 px-3 border">Publikasi & Dokumentasi Kegiatan</td>
                    <td className="py-2 px-3 border">20 Mei 2025</td>
                    <td className="py-2 px-3 border">Berjalan</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 border">3</td>
                    <td className="py-2 px-3 border">Rapat Koordinasi Pimpinan</td>
                    <td className="py-2 px-3 border">9 Juni 2025</td>
                    <td className="py-2 px-3 border">Selesai</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-600">
                  <p>Dokumen ini digenerate secara otomatis</p>
                  <p>Tanggal: 12 Juni 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-12">Mengetahui,</p>
                  <p className="font-bold text-gray-900">Sekretaris DPRD</p>
                  <p className="text-sm text-gray-600">Provinsi Jawa Tengah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Laporan Bulanan</h3>
              <p className="text-sm text-gray-600">Kegiatan per bulan</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Generate Laporan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Laporan Tahunan</h3>
              <p className="text-sm text-gray-600">Kegiatan per tahun</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium">
            Generate Laporan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Laporan Custom</h3>
              <p className="text-sm text-gray-600">Sesuai filter</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            Generate Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
