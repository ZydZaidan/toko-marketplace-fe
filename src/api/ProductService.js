// src/api/ProductService.js
import axiosInstance from './axiosInstance';
import { Product } from '../models/Product';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Database bohong-bohongan di memori FE
let mockProducts = [
  { id: 1, nama_produk: "Kaos Polos Putih", sku: "KPP-001", harga_jual: 75000, stok: 120, satuan: "pcs" },
  { id: 2, nama_produk: "Kemeja Flanel", sku: "KMF-002", harga_jual: 150000, stok: 5, satuan: "pcs" }
];

export class ProductService {
  static async getAll(params = {}) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi loading
      const products = mockProducts.map(item => new Product(item));
      return { 
        data: products, 
        meta: { current_page: 1, last_page: 1, total: mockProducts.length } 
      };
    }

    const response = await axiosInstance.get('/produk', { params });
    const products = response.data.data.map(item => new Product(item));
    return { data: products, meta: response.data.meta };
  }

  static async create(data) {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Bikin ID random dan masukin ke database MOCK
      const newProduct = { id: Date.now(), ...data };
      mockProducts.push(newProduct);
      return { data: { success: true, message: "Produk berhasil ditambahkan (MOCK)" } };
    }
    return await axiosInstance.post('/produk', data);
  }
}