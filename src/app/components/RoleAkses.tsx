import { useState } from 'react';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';

const userData = [
  {
    id: '1',
    nama: 'Administrator Utama',
    email: 'admin@dprd.go.id',
    role: 'Superadmin',
    status: 'Aktif',
    lastLogin: '12 Jun 2026, 10:30',
  },
  {
    id: '2',
    nama: 'Kepala Sekretariat',
    email: 'sekretariat@dprd.go.id',
    role: 'Admin',
    status: 'Aktif',
    lastLogin: '12 Jun 2026, 09:15',
  },
  {
    id: '3',
    nama: 'Operator Komisi A',
    email: 'komisia@dprd.go.id',
    role: 'Admin',
    status: 'Aktif',
    lastLogin: '11 Jun 2026, 16:45',
  },
  {
    id: '4',
    nama: 'Operator Komisi B',
    email: 'komisib@dprd.go.id',
    role: 'Admin',
    status: 'Aktif',
    lastLogin: '10 Jun 2026, 14:20',
  },
];

export function RoleAkses() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Pengguna
        </button>
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Superadmin</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Akses penuh semua modul</li>
                <li>• Kelola master data</li>
                <li>• Kelola role user lain</li>
                <li>• Verifikasi kegiatan</li>
                <li>• Approve anggaran over-budget</li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">1 Pengguna</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Admin</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Input & update kegiatan</li>
                <li>• Input realisasi anggaran</li>
                <li>• Akses laporan terbatas</li>
                <li>• Tidak bisa kelola Role & Master Data</li>
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">3 Pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Daftar Pengguna</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nama</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Login</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.nama.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.nama}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Superadmin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'Superadmin' && (
                        <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-6">Matriks Hak Akses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 border">Modul / Fitur</th>
                <th className="text-center py-3 px-4 border">Superadmin</th>
                <th className="text-center py-3 px-4 border">Admin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 border font-medium">Dashboard</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Agenda & Kegiatan (Tambah/Edit)</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Agenda & Kegiatan (Hapus)</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✗</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Verifikasi Kegiatan</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✗</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Anggaran & Realisasi</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Approve Over Budget</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✗</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Laporan</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✓ (Terbatas)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Role & Akses</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✗</td>
              </tr>
              <tr>
                <td className="py-3 px-4 border font-medium">Master Data</td>
                <td className="py-3 px-4 border text-center">✓</td>
                <td className="py-3 px-4 border text-center">✗</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tambah Pengguna Baru</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Pilih Role</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bidang/Komisi</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Pilih Bidang</option>
                  <option>Sekretariat DPRD</option>
                  <option>Komisi A</option>
                  <option>Komisi B</option>
                  <option>Komisi C</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
