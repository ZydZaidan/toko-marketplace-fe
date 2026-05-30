// src/pages/laporan/LaporanPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Wallet } from 'lucide-react';
import { ReportService } from '../../api/ReportService';
import { toast } from 'react-toastify';

export const LaporanPage = () => {
  const [laporan, setLaporan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [periode, setPeriode] = useState('bulanan'); // default bulanan

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

  if (isLoading) return <div className="p-10 text-center text-gray-500">Menghitung cuan...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h1>
        
        {/* Filter Periode */}
        <select 
          value={periode} 
          onChange={(e) => setPeriode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
        >
          <option value="harian">Hari Ini</option>
          <option value="bulanan">Bulan Ini</option>
          <option value="tahunan">Tahun Ini</option>
        </select>
      </div>

      {/* Grid Statistik Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ShoppingBag size={20} /> <span className="font-semibold text-sm">Total Pesanan</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{laporan?.total_pesanan} Transaksi</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign size={20} /> <span className="font-semibold text-sm">Total Omzet</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{formatRupiah(laporan?.total_penjualan)}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Wallet size={20} /> <span className="font-semibold text-sm">Total Modal</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{formatRupiah(laporan?.total_modal)}</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <TrendingUp size={20} /> <span className="font-semibold text-sm">Keuntungan Bersih</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{formatRupiah(laporan?.total_keuntungan)}</p>
        </div>
      </div>

      {/* Tabel Produk Terlaris */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Produk Terlaris</h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Terjual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sumbangan Omzet</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {laporan?.produk_terlaris?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{item.nama_produk}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.total_terjual} pcs</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatRupiah(item.total_omzet)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};