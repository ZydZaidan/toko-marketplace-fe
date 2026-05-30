// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../api/AuthService';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Biar form gak nge-refresh halaman
    setIsLoading(true);

    try {
      // Panggil method login dari class AuthService
      const response = await AuthService.login(email, password);
      
      // Kalau sukses, simpan token dan data user ke Context/localStorage
      if (response.success) { // [cite: 183]
        login(response.data.token, response.data.user);
        toast.success(response.message || 'Login berhasil!');
        navigate('/dashboard'); // Lempar ke halaman dashboard
      }
    } catch (error) {
      // Tangani error kalau email/password salah atau validasi gagal [cite: 185]
      const errorMsg = error.response?.data?.message || 'Gagal login, periksa koneksi lo.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">TokoKita</h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Masuk ke Akun Lo</h3>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@toko.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Loading...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};