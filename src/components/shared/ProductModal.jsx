// src/components/shared/ProductModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { ProductService } from '../../api/ProductService';
import { toast } from 'react-toastify';

export const ProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_produk: '',
    sku: '',
    harga_jual: '',
    stok: '',
    satuan: 'pcs'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await ProductService.create(formData);
      toast.success('Produk berhasil ditambahkan!');
      onSuccess(); // Panggil fungsi buat ngereload tabel
      onClose(); // Tutup modal
    } catch {
      toast.error('Gagal menambahkan produk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
            <input type="text" name="nama_produk" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input type="text" name="sku" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Harga Jual</label>
              <input type="number" name="harga_jual" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Stok Awal</label>
              <input type="number" name="stok" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Satuan</label>
            <select name="satuan" onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="pcs">Pcs</option>
              <option value="lusin">Lusin</option>
              <option value="kg">Kg</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};