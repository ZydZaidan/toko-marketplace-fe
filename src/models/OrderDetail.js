// src/models/OrderDetail.js
export class OrderDetail {
  constructor(data) {
    this.id = data.id || null;
    this.produkId = data.produk_id || data.product_id;
    this.namaProduk = data.nama_produk || '';
    this.jumlah = Number(data.jumlah) || 0;
    this.hargaSatuan = Number(data.harga_satuan) || 0;
    this.subtotal = Number(data.subtotal) || (this.jumlah * this.hargaSatuan);
  }

  getSubtotalRupiah() {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(this.subtotal);
  }
}