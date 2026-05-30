// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProdukPage } from './pages/produk/ProdukPage';
import { PesananPage } from './pages/pesanan/PesananPage';
import { LaporanPage } from './pages/laporan/LaporanPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route - Siapa aja bisa akses halaman gembok ini */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes - Harus login dulu baru bisa tembus */}
          <Route path="/" element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            {/* Kalau user nembak url root "/", otomatis dilempar ke /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Menu Dashboard: Bisa diakses Admin maupun Staff */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Menu Manajemen Produk: Bisa diakses Admin maupun Staff */}
            <Route 
              path="produk" 
              element={
                <PrivateRoute allowedRoles={['admin', 'staff']}>
                  <ProdukPage />
                </PrivateRoute>
              } 
            />
            
            {/* Menu Manajemen Pesanan: Bisa diakses Admin maupun Staff */}
            <Route 
              path="pesanan" 
              element={
                <PrivateRoute allowedRoles={['admin', 'staff']}>
                  <PesananPage />
                </PrivateRoute>
              } 
            />
            
            {/* Menu Laporan Keuangan: SUPER RAHASIA, Hanya Admin yang boleh liat cuan */}
            <Route 
              path="laporan" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <LaporanPage />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
      
      {/* Komponen global buat nampilin pop-up notifikasi cantik */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;