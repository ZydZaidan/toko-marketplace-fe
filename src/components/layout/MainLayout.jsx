// src/components/layout/MainLayout.jsx
import { Outlet, Link } from "react-router-dom"; // Ganti tag <a> jadi <Link> biar nggak reload halaman
import { useAuth } from "../../hooks/useAuth";


export const MainLayout = () => {
  const { user, logout } = useAuth(); // Ambil 'user' dari useAuth buat ngecek role

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-blue-600">TokoKita</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/produk" className="block p-2 rounded hover:bg-gray-100">Produk</Link>
          <Link to="/pesanan" className="block p-2 rounded hover:bg-gray-100">Pesanan</Link>
          
          {/* Menu Laporan cuma muncul kalau rolenya Admin */}
          {user?.role === 'admin' && (
            <Link to="/laporan" className="block p-2 rounded hover:bg-gray-100 font-semibold text-indigo-600">Laporan Keuangan</Link>
          )}

          <button onClick={logout} className="block w-full text-left p-2 mt-10 text-red-500 rounded hover:bg-red-50">Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
