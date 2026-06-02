// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store, Mail, Lock } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Panggil fungsi login dari AuthContext
      await login(formData.email, formData.password);
      toast.success('Selamat Datang Kembali!');
      navigate('/dashboard'); // Lempar ke dashboard pas sukses
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Email atau password salah nih bro';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans text-text-main flex items-center justify-center p-4">
      <div className="bg-card border border-border-1 rounded-[14px] p-8 w-full max-w-sm shadow-2xl flex flex-col">
        
        {/* Brand Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-accent-main rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-accent-main/20">
            <Store size={22} />
          </div>
          <h1 className="font-bold text-base tracking-wide text-text-main">TokoMarket</h1>
          <p className="text-[11px] text-text-dim mt-1 font-mono">Kelola jualanmu dalam satu sistem</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Email */}
          <div>
            <label className="block text-[10px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Email Akun</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-dim">
                <Mail size={14} />
              </span>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email lo..." 
                className="w-full bg-bg-3 border border-border-1 rounded-lg pl-9 pr-3 py-2 text-xs text-text-main placeholder-text-dim focus:border-accent-main focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-[10px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-text-dim">
                <Lock size={14} />
              </span>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full bg-bg-3 border border-border-1 rounded-lg pl-9 pr-3 py-2 text-xs text-text-main placeholder-text-dim focus:border-accent-main focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          {/* Tombol Masuk */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent-main hover:bg-accent-hover text-white py-2 rounded-lg text-xs font-semibold transition-colors mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Memvalidasi...' : 'Masuk ke Akun'}
          </button>
        </form>

        {/* Informasi Kredensial Mock (Biar lo atau Dosen gak lupa pas ngetes) */}
        <div className="mt-8 pt-4 border-t border-border-1 bg-bg-2/30 rounded-lg p-3 border border-dashed border-border-1">
          <div className="text-[10px] font-bold text-text-dim uppercase font-mono mb-1">Akses Demo (MOCK):</div>
          <div className="text-[11px] text-text-muted font-mono">Admin: admin@toko.com</div>
          <div className="text-[11px] text-text-muted font-mono">Staff: staff@toko.com</div>
          <div className="text-[11px] text-text-dim font-mono mt-1">Pass: password123</div>
        </div>

      </div>
    </div>
  );
};