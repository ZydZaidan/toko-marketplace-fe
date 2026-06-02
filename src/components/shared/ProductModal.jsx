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
      onSuccess(); 
      onClose(); 
    } catch {
      toast.error('Gagal menambahkan produk');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-card border border-border-1 rounded-[14px] p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[15px] font-bold text-text-main">Tambah Produk Baru</h2>
          <button onClick={onClose} className="text-text-muted hover:text-status-red transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Nama Produk</label>
            <input type="text" name="nama_produk" required onChange={handleChange} className="w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main placeholder-text-muted focus:border-accent-main focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">SKU</label>
            <input type="text" name="sku" required onChange={handleChange} className="w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main placeholder-text-muted focus:border-accent-main focus:outline-none transition-colors font-mono" />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Harga Jual</label>
              <input type="number" name="harga_jual" required onChange={handleChange} className="w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main placeholder-text-muted focus:border-accent-main focus:outline-none transition-colors font-mono" />
            </div>
            <div className="w-1/2">
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Stok Awal</label>
              <input type="number" name="stok" required onChange={handleChange} className="w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main placeholder-text-muted focus:border-accent-main focus:outline-none transition-colors font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">Satuan</label>
            <select name="satuan" onChange={handleChange} className="w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main focus:border-accent-main focus:outline-none transition-colors">
              <option value="pcs">Pcs</option>
              <option value="lusin">Lusin</option>
              <option value="kg">Kg</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border-1">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border-1 rounded-lg text-xs font-semibold text-text-main bg-bg-3 hover:bg-bg-2 transition-colors">Batal</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-accent-main text-white rounded-lg text-xs font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};