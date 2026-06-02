// src/components/layout/MainLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, Package, ShoppingCart, 
  LineChart, Search, Plus, LogOut, Store
} from 'lucide-react';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-bg-main font-sans text-text-main overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-55 bg-bg-2 border-r border-border-1 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 pb-4 border-b border-border-1">
          <div className="w-8 h-8 bg-accent-main rounded-lg flex items-center justify-center text-white mb-2">
            <Store size={18} />
          </div>
          <div className="font-bold text-[13px] tracking-wide">TokoMarket</div>
          <div className="text-[11px] text-text-dim font-mono mt-0.5">v1.0.0 · {user?.role || 'admin'}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {/* Section: Utama */}
          <div className="px-3 mb-2">
            <div className="text-[10px] font-semibold text-text-dim tracking-[1.2px] uppercase px-2 py-1 mb-1">Utama</div>
            
            <Link to="/dashboard" className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all my-0.5 ${isActive('/dashboard') ? 'bg-accent-main/10 text-accent-main' : 'text-text-muted hover:bg-bg-3 hover:text-text-main'}`}>
              <LayoutDashboard size={18} className={isActive('/dashboard') ? 'opacity-100' : 'opacity-70'} />
              Dashboard
            </Link>
            
            <Link to="/produk" className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all my-0.5 ${isActive('/produk') ? 'bg-accent-main/10 text-accent-main' : 'text-text-muted hover:bg-bg-3 hover:text-text-main'}`}>
              <Package size={18} className={isActive('/produk') ? 'opacity-100' : 'opacity-70'} />
              Produk
            </Link>
            
            <Link to="/pesanan" className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all my-0.5 ${isActive('/pesanan') ? 'bg-accent-main/10 text-accent-main' : 'text-text-muted hover:bg-bg-3 hover:text-text-main'}`}>
              <ShoppingCart size={18} className={isActive('/pesanan') ? 'opacity-100' : 'opacity-70'} />
              Pesanan
              <span className="ml-auto bg-status-amber text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">8</span>
            </Link>
          </div>

          {/* Section: Laporan (Khusus Admin) */}
          {user?.role === 'admin' && (
            <div className="px-3 mb-2 mt-4">
              <div className="text-[10px] font-semibold text-text-dim tracking-[1.2px] uppercase px-2 py-1 mb-1">Laporan</div>
              <Link to="/laporan" className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all my-0.5 ${isActive('/laporan') ? 'bg-accent-main/10 text-accent-main' : 'text-text-muted hover:bg-bg-3 hover:text-text-main'}`}>
                <LineChart size={18} className={isActive('/laporan') ? 'opacity-100' : 'opacity-70'} />
                Penjualan
              </Link>
            </div>
          )}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-border-1">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-bg-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent-main to-status-purple flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text-main truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-text-dim font-mono">{user?.email}</div>
            </div>
            <button onClick={logout} className="text-text-dim hover:text-status-red p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="bg-bg-2 border-b border-border-1 px-6 h-14 flex items-center gap-4 shrink-0">
          <h1 className="font-bold text-[15px] flex-1 capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h1>
          
          {/* Search Box */}
          <div className="flex items-center gap-2 bg-bg-3 border border-border-1 rounded-lg px-3 py-1.5 w-48 focus-within:border-accent-main focus-within:ring-1 focus-within:ring-accent-main transition-all">
            <Search size={14} className="text-text-dim" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="bg-transparent border-none outline-none text-xs text-text-main w-full placeholder:text-text-dim font-sans"
            />
          </div>

          {/* Action Button */}
          <button className="flex items-center gap-1.5 bg-accent-main hover:bg-accent-hover text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors">
            <Plus size={14} />
            Pesanan Baru
          </button>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-main">
          <Outlet />
        </main>
      </div>

    </div>
  );
};