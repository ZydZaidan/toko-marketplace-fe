// src/pages/laporan/LaporanPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import { ReportService } from '../../api/ReportService';
import { toast } from 'react-toastify';

export const LaporanPage = () => {
  const [laporan, setLaporan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periode, setPeriode] = useState('bulanan');

  const fetchLaporan = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ReportService.getLaporanPenjualan({ periode });
      setLaporan(response.data);
    } catch {
      toast.error('Gagal memuat data laporan');
    } finally {
      setIsLoading(false);
    }
  }, [periode]);

  useEffect(() => {
    const loadData = async () => {
      await fetchLaporan();
    };
    loadData();
  }, [fetchLaporan]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-text-muted">Menghitung cuan...</div>;
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      
      {/* Header & Filter */}
      <div className="bg-card border border-border-1 rounded-[14px] p-6 flex justify-between items-center">
        <h1 className="text-[15px] font-bold text-text-main">Laporan Keuangan</h1>
        
        <select 
          value={periode} 
          onChange={(e) => setPeriode(e.target.value)}
          className="bg-bg-3 border border-border-1 rounded-lg px-3 py-1.5 text-xs text-text-main focus:border-accent-main focus:outline-none transition-colors"
        >
          <option value="harian">Hari Ini</option>
          <option value="bulanan">Bulan Ini</option>
          <option value="tahunan">Tahun Ini</option>
        </select>
      </div>

      {/* Grid Statistik Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Pesanan */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-accent-main/10 text-accent-main">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {laporan?.total_pesanan} <span className="text-sm text-text-muted font-sans">Trx</span>
          </div>
          <div className="text-[11px] text-text-muted mt-1">Total Pesanan</div>
        </div>
        
        {/* Total Omzet */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-green/10 text-status-green">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {formatRupiah(laporan?.total_penjualan)}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Total Omzet</div>
        </div>

        {/* Total Modal */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-red/10 text-status-red">
              <Wallet size={18} />
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {formatRupiah(laporan?.total_modal)}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Total Modal</div>
        </div>

        {/* Keuntungan Bersih */}
        <div className="bg-card border border-border-1 rounded-[14px] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-status-purple/10 text-status-purple">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-[22px] font-bold text-text-main font-mono tracking-tight mt-2">
            {formatRupiah(laporan?.total_keuntungan)}
          </div>
          <div className="text-[11px] text-text-muted mt-1">Keuntungan Bersih</div>
        </div>
      </div>

      {/* Tabel Produk Terlaris */}
      <div className="bg-card border border-border-1 rounded-[14px] overflow-hidden flex flex-col mt-2">
        <div className="px-6 py-4 border-b border-border-1">
          <h3 className="text-[13px] font-bold text-text-main">Produk Terlaris</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-bg-3 border-b border-border-1">
              <tr>
                <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-6">Nama Produk</th>
                <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-6">Total Terjual</th>
                <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-6">Sumbangan Omzet</th>
              </tr>
            </thead>
            <tbody>
              {laporan?.produk_terlaris?.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors border-b border-border-1 last:border-0">
                  <td className="px-6 py-3.5 text-xs font-medium text-text-main">{item.nama_produk}</td>
                  <td className="px-6 py-3.5 text-xs text-text-muted font-mono">{item.total_terjual} pcs</td>
                  <td className="px-6 py-3.5 text-xs font-semibold text-status-green font-mono">{formatRupiah(item.total_omzet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};