// src/models/Product.js
export class Product {
  constructor(data) {
    this.id = data.id || null;
    this.namaProduk = data.nama_produk || '';
    this.sku = data.sku || '';
    this.hargaJual = Number(data.harga_jual) || 0;
    this.hargaModal = Number(data.harga_modal) || 0;
    this.stok = Number(data.stok) || 0;
    this.satuan = data.satuan || 'pcs';
  }

  // Method OOP untuk nampilin harga dalam format Rupiah
  getHargaRupiah() {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(this.hargaJual);
  }

  // Method OOP untuk ngecek status stok
  getStatusStok() {
    if (this.stok === 0) return 'Habis';
    if (this.stok < 10) return 'Menipis';
    return 'Aman';
  }
}