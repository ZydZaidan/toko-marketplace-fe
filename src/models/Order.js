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


  getStatusColor() {
    switch (this.status) {
      case 'selesai': return 'bg-status-green-bg text-status-green';
      case 'dikirim': return 'bg-accent-main/10 text-accent-main';
      case 'diproses': return 'bg-status-amber-bg text-status-amber';
      default: return 'bg-bg-3 text-text-muted';
    }
  }
}