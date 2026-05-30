// src/models/Order.js
import { OrderDetail } from './OrderDetail';

export class Order {
  constructor(data) {
    this.id = data.id || null;
    this.nomorPesanan = data.nomor_pesanan || '';
    this.marketplace = data.marketplace || 'lainnya';
    this.namaPembeli = data.nama_pembeli || '';
    this.status = data.status || 'diproses';
    this.totalHarga = Number(data.total_harga) || 0;
    
    // Konversi array data mentah jadi array of Object OrderDetail
    this.detailPesanan = Array.isArray(data.detail_pesanan) 
      ? data.detail_pesanan.map(item => new OrderDetail(item)) 
      : [];
  }

  getTotalRupiah() {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(this.totalHarga);
  }

  // Method buat nentuin warna badge status
  getStatusColor() {
    switch (this.status) {
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'dikirim': return 'bg-blue-100 text-blue-800';
      case 'diproses': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}