// src/api/ReportService.js
import axiosInstance from './axiosInstance';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export class ReportService {
  static async getDashboardSummary() {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        total_produk: 45,
        stok_menipis: 3,
        pesanan_diproses: 5,
        omzet_bulan_ini: 15600000
      };
    }
    const response = await axiosInstance.get('/dashboard');
    return response.data.data;
  }

  // Method baru untuk narik Laporan Penjualan
  static async getLaporanPenjualan(params = {}) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return {
        success: true,
        data: {
          periode: params.periode || "bulanan",
          total_pesanan: 25,
          total_penjualan: 3750000,
          total_modal: 2250000,
          total_keuntungan: 1500000,
          produk_terlaris: [
            { produk_id: 1, nama_produk: "Kaos Polos Putih", total_terjual: 48, total_omzet: 3600000 },
            { produk_id: 2, nama_produk: "Kemeja Flanel", total_terjual: 12, total_omzet: 150000 }
          ]
        }
      };
    }
    const response = await axiosInstance.get('/laporan/penjualan', { params });
    return response.data;
  }
}