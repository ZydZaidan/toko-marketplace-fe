// src/api/OrderService.js
import axiosInstance from './axiosInstance';
import { Order } from '../models/Order';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let mockOrders = [
  {
    id: 1,
    nomor_pesanan: "ORD-20260528-001",
    marketplace: "shopee",
    nama_pembeli: "Budi Santoso",
    status: "diproses",
    total_harga: 150000,
    detail_pesanan: [
      { produk_id: 1, nama_produk: "Kaos Polos Putih", jumlah: 2, harga_satuan: 75000, subtotal: 150000 }
    ]
  }
];

export class OrderService {
  static async getAll(params = {}) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const orders = mockOrders.map(item => new Order(item));
      return { data: orders, meta: { current_page: 1, last_page: 1, total: mockOrders.length } };
    }
    const response = await axiosInstance.get('/pesanan', { params });
    const orders = response.data.data.map(item => new Order(item));
    return { data: orders, meta: response.data.meta };
  }

  // Tambahin method create ini
  static async create(data) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulasi bikin nomor pesanan otomatis
      const newOrder = {
        id: Date.now(),
        nomor_pesanan: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`,
        status: "diproses",
        total_harga: data.detail_pesanan.reduce((sum, item) => sum + (item.jumlah * item.harga_satuan), 0),
        ...data
      };
      mockOrders.unshift(newOrder); // Masukin ke paling atas
      return { data: { success: true, message: "Pesanan berhasil dibuat (MOCK)" } };
    }
    return await axiosInstance.post('/pesanan', data);
  }
}