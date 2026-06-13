import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import logoJateng from '../../imports/logo_jateng.png';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Database,
  Bell,
  ChevronRight,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';

const menuItems = [
  {
    section: 'SISTEM PENGENDALIAN KEGIATAN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ],
  },
  {
    section: 'KEGIATAN',
    items: [
      { icon: FileText, label: 'Agenda & Kegiatan', path: '/agenda' },
      { icon: Calendar, label: 'Kalender Kegiatan', path: '/kalender' },
      { icon: TrendingUp, label: 'Progress Kegiatan', path: '/progress' },
    ],
  },
  {
    section: 'ANGGARAN',
    items: [
      { icon: DollarSign, label: 'Anggaran & Realisasi', path: '/anggaran' },
    ],
  },
  {
    section: 'LAPORAN',
    items: [
      { icon: BarChart3, label: 'Laporan Kegiatan', path: '/laporan-kegiatan' },
      { icon: FileText, label: 'Laporan Anggaran', path: '/laporan-anggaran' },
    ],
  },
  {
    section: 'PENGATURAN',
    items: [
      { icon: Shield, label: 'Role Akses', path: '/role-akses' },
      { icon: Database, label: 'Master Data', path: '/master-data' },
    ],
  },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [notificationCount] = useState(4);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-neutral-950 text-white flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-4 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-0.5">
              <img src={logoJateng} alt="Logo Jawa Tengah" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="text-sm font-bold">SEKRETARIAT DPRD</div>
                <div className="text-xs text-neutral-400">Provinsi Jawa Tengah</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {sidebarOpen && (
                <div className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {section.section}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-neutral-900 transition-colors ${
                        isActive ? 'bg-neutral-800 border-l-4 border-white' : ''
                      }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="text-sm">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-900 rounded-lg transition-colors"
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Monitoring</h1>
                <p className="text-sm text-gray-600">Sistem Pengendalian Kegiatan DPRD Provinsi Jawa Tengah</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Jumat, 12 Juni 2026 20:42 WIB
              </div>
              
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                  <div className="text-xs text-gray-600 bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Superadmin
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
