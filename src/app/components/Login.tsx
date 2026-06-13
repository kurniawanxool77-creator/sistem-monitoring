import { useState } from 'react';
import { useNavigate } from 'react-router';
import { LogIn } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi kredensial
    if (!email || !password) {
      setError('Username/Email dan Password wajib diisi');
      return;
    }

    // Mock login - di production akan menggunakan API
    if (email && password) {
      // Simpan session (mock)
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: 'superadmin',
        nama: 'Administrator Utama' 
      }));
      navigate('/');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-900" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div className="text-white">
              <div className="text-xl font-bold">SEKRETARIAT DPRD</div>
              <div className="text-sm text-blue-200">Provinsi Jawa Tengah</div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Sistem Pengendalian Kegiatan
          </h1>
          <p className="text-blue-100 text-lg">
            Dashboard Monitoring & Pelaporan Kegiatan DPRD Provinsi Jawa Tengah
          </p>
        </div>
        
        <div className="text-blue-200 text-sm">
          © 2025 Sekretariat DPRD Provinsi Jawa Tengah
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Masuk ke Sistem</h2>
            <p className="text-gray-600">Silakan masukkan kredensial Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Username / Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan username atau email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo kredensial: Isi sembarang username dan password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
