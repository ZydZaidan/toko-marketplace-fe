// src/api/AuthService.js
import axiosInstance from './axiosInstance';

// Cek dari .env apakah kita lagi mode MOCK (Backend belum siap)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export class AuthService {
  static async login(email, password) {
    if (USE_MOCK) {
      // Simulasi loading 1 detik biar kerasa kayak nembak API beneran
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulasi login sukses untuk Admin
      if (email === 'admin@toko.com' && password === 'password123') {
        return {
          success: true,
          message: "Login berhasil (Mode MOCK)",
          data: {
            token: "mock-token-admin-12345",
            user: { id: 1, name: "Admin Toko", email: "admin@toko.com", role: "admin" }
          }
        };
      } 
      // Simulasi login sukses untuk Staff
      else if (email === 'staff@toko.com' && password === 'password123') {
        return {
          success: true,
          message: "Login berhasil (Mode MOCK)",
          data: {
            token: "mock-token-staff-12345",
            user: { id: 2, name: "Staff Gudang", email: "staff@toko.com", role: "staff" }
          }
        };
      } 
      // Simulasi error kalau password salah
      else {
        throw { response: { data: { message: "Email atau password salah nih bro (MOCK)" } } };
      }
    }

    // Kalau USE_MOCK = false, dia bakal nembak ke backend asli
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  }

  static async logout() {
    if (USE_MOCK) return { success: true };
    return await axiosInstance.post('/auth/logout');
  }
}