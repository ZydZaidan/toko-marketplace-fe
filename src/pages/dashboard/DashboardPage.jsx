// src/pages/dashboard/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { ReportService } from '../../api/ReportService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Package, ShoppingCart, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await ReportService.getDashboardSummary();
        setSummary(data);
      } catch {
        toast.error('Gagal memuat data dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatRupiah = (angka) => {
    if (angka === null || angka === undefined) return '-';
    // Format jadi lebih ringkas (misal: Rp 15,6jt) biar muat di card
    if (angka >= 1000000) return `Rp ${(angka / 1000000).toFixed(1).replace('.0', '')}jt`;
    if (angka >= 1000) return `Rp ${(angka / 1000).toFixed(0)}k`;
    return `Rp ${angka}`;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-text-muted">Loading data...</div>;
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      
      {/* OOP STRIP */}
      <div className="bg-bg-2 border border-border-1 rounded-[10px] p-3 px-4 flex items-center gap-4 flex-wrap">
        <div className="text-[11px] font-bold text-text-dim tracking-wide">KONSEP OOP:</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">🔵 <span className="text-text-muted">User</span> (Role RBAC)</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">🟢 <span className="text-text-muted">Produk</span> (Soft Delete)</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">🟡 <span className="text-text-muted">Pesanan</span> (State Machine)</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">🟣 <span className="text-text-muted">DetailPesanan</span> (Snapshot Harga)</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">🔴 <span className="text-text-muted">Stok</span> (Audit Trail)</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim">📊 <span className="text-text-muted">Laporan</span> (Role Filter)</div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Omzet (Hanya untuk Admin) */}
        {user?.role === 'admin' ? (
          <div className="bg-card border border-border-1 rounded-[14px] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-accent-main/10 text-accent-main">
                <DollarSign size={18} />
              </div>
              <div className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-status-green-bg text-status-green flex items-center gap-1">
                <TrendingUp size={12} /> +12%
              </div>
            </div>
            <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
              {formatRupiah(summary?.omzet_bulan_ini)}
            </div>
            <div className="text-[11px] text-text-muted mt-1">Omzet Bulan Ini</div>
          </div>
        ) : (
          <div className="bg-card border border-border-1 rounded-[14px] p-4 opacity-50">
            <div className="text-xs text-text-dim italic text-center mt-6">Data Keuangan Disembunyikan</div>
          </div>
        )}

        {/* Card 2: Pesanan Aktif */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-green/10 text-status-green">
              <ShoppingCart size={18} />
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-status-green-bg text-status-green flex items-center gap-1">
              <TrendingUp size={12} /> +5
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {summary?.pesanan_diproses || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Pesanan Diproses</div>
        </div>

        {/* Card 3: Stok Kritis */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-amber/10 text-status-amber">
              <AlertTriangle size={18} />
            </div>
            <div className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-status-red-bg text-status-red flex items-center gap-1">
              <TrendingDown size={12} /> -3
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {summary?.stok_menipis || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Produk Stok Kritis</div>
        </div>

        {/* Card 4: Total Produk */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-purple/10 text-status-purple">
              <Package size={18} />
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {summary?.total_produk || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Total Produk Aktif</div>
        </div>
      </div>

      {/* TABLE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        
        {/* ORDERS TABLE - Tampilan Visual */}
        <div className="bg-card border border-border-1 rounded-[14px] overflow-hidden flex flex-col">
          <div className="px-4 py-3.5 border-b border-border-1 flex items-center justify-between">
            <div className="text-[13px] font-bold text-text-main">Pesanan Masuk Terkini</div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-status-amber-bg text-status-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-status-amber"></span> 8 diproses
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">No. Pesanan</th>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">Marketplace</th>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">Status</th>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ORD-20260528-0042', mp: 'Shopee', status: 'Diproses', total: 'Rp 245k', mpColor: 'bg-brand-shopee/10 text-brand-shopee', statColor: 'bg-status-amber-bg text-status-amber', dot: 'bg-status-amber' },
                  { id: 'ORD-20260528-0041', mp: 'Tokopedia', status: 'Dikirim', total: 'Rp 180k', mpColor: 'bg-brand-tokopedia/10 text-brand-tokopedia', statColor: 'bg-accent-main/10 text-accent-main', dot: 'bg-accent-main' },
                  { id: 'ORD-20260527-0039', mp: 'Shopee', status: 'Selesai', total: 'Rp 520k', mpColor: 'bg-brand-shopee/10 text-brand-shopee', statColor: 'bg-status-green-bg text-status-green', dot: 'bg-status-green' },
                  { id: 'ORD-20260527-0038', mp: 'Lainnya', status: 'Diproses', total: 'Rp 95k', mpColor: 'bg-white/5 text-text-muted', statColor: 'bg-status-amber-bg text-status-amber', dot: 'bg-status-amber' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-4 text-[11px] font-mono text-text-main border-b border-border-1">{item.id}</td>
                    <td className="py-2.5 px-4 text-xs border-b border-border-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${item.mpColor}`}>{item.mp}</span>
                    </td>
                    <td className="py-2.5 px-4 text-xs border-b border-border-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${item.statColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`}></span> {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs font-semibold text-text-main border-b border-border-1">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODUCT STOCK - Tampilan Visual */}
        <div className="bg-card border border-border-1 rounded-[14px] overflow-hidden flex flex-col">
          <div className="px-4 py-3.5 border-b border-border-1 flex items-center justify-between">
            <div className="text-[13px] font-bold text-text-main">Stok Kritis Produk</div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-status-red-bg text-status-red">
              ⚠ 7 produk
            </span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">Produk</th>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">SKU</th>
                  <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-2 px-4 border-b border-border-1">Stok</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Kaos Polos Putih L', sku: 'KAO-WHT-L', stok: 3, isLow: true },
                  { name: 'Celana Jogger Abu M', sku: 'CLN-JGR-M', stok: 1, isLow: true },
                  { name: 'Tote Bag Canvas', sku: 'BAG-CNV-01', stok: 5, isLow: true },
                  { name: 'Hoodie Oversize XL', sku: 'HOD-OVS-XL', stok: 12, isLow: false },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-4 text-xs font-medium text-text-main border-b border-border-1">{item.name}</td>
                    <td className="py-2.5 px-4 text-[10px] font-mono text-text-dim border-b border-border-1">{item.sku}</td>
                    <td className="py-2.5 px-4 border-b border-border-1">
                      <span className={`text-[12px] font-mono ${item.isLow ? 'text-status-red font-bold' : 'text-status-green'}`}>
                        {item.stok} pcs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MARKETPLACE BREAKDOWN - Tampilan Visual */}
      <div className="bg-card border border-border-1 rounded-[14px] mt-2">
        <div className="px-4 py-3.5 border-b border-border-1 flex items-center justify-between">
          <div className="text-[13px] font-bold text-text-main">Distribusi Penjualan per Marketplace</div>
          <span className="text-[11px] text-text-dim">Bulan Mei 2026</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[
            { label: 'Shopee', val: '62%', width: '62%', bg: 'bg-brand-shopee' },
            { label: 'Tokopedia', val: '31%', width: '31%', bg: 'bg-brand-tokopedia' },
            { label: 'Lainnya', val: '7%', width: '7%', bg: 'bg-text-dim' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-[11px]">
              <div className="w-20 text-text-muted flex-shrink-0">{item.label}</div>
              <div className="flex-1 h-1.5 bg-bg-3 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.bg}`} style={{ width: item.width }}></div>
              </div>
              <div className="w-11 text-right text-text-main font-mono font-bold">{item.val}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};