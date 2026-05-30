// src/components/shared/OrderModal.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { OrderService } from '../../api/OrderService';
import { ProductService } from '../../api/ProductService';
import { toast } from 'react-toastify';

export const OrderModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  // State untuk data utama pembeli
  const [formData, setFormData] = useState({
    marketplace: 'shopee',
    nama_pembeli: '',
    no_hp_pembeli: '',
    alamat_pengiriman: '',
    catatan: ''
  });

  // State array dinamis untuk item pesanan
  const [orderItems, setOrderItems] = useState([
    { produk_id: '', jumlah: 1, harga_satuan: 0 }
  ]);

  // Ngambil daftar produk buat dropdown pas modal dibuka
  useEffect(() => {
    if (isOpen) {
      const loadProducts = async () => {
        try {
          const res = await ProductService.getAll({ per_page: 100 });
          setProducts(res.data);
        } catch {
          toast.error("Gagal memuat pilihan produk");
        }
      };
      loadProducts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle perubahan input pembeli
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle perubahan produk di dalam baris dinamis
  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    
    // Kalau user milih produk, otomatis isi harga_satuan-nya
    if (field === 'produk_id') {
      const selectedProduct = products.find(p => p.id.toString() === value.toString());
      if (selectedProduct) {
        newItems[index].harga_satuan = selectedProduct.hargaJual;
      }
    }
    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { produk_id: '', jumlah: 1, harga_satuan: 0 }]);
  };

  const removeItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  // Hitung total harga otomatis
  const totalHarga = orderItems.reduce((total, item) => total + (item.jumlah * item.harga_satuan), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi basic: Pastikan semua item punya produk_id
    if (orderItems.some(item => !item.produk_id)) {
      toast.warning("Pilih produk untuk semua item pesanan!");
      return;
    }

    setIsLoading(true);
    try {
      // Gabungin data pembeli sama detail_pesanan sesuai kontrak API
      const payload = {
        ...formData,
        detail_pesanan: orderItems.map(item => ({
          produk_id: Number(item.produk_id),
          jumlah: Number(item.jumlah),
          harga_satuan: Number(item.harga_satuan)
        }))
      };

      await OrderService.create(payload);
      toast.success('Pesanan berhasil dibuat!');
      onSuccess();
      onClose();
      // Reset form
      setFormData({ marketplace: 'shopee', nama_pembeli: '', no_hp_pembeli: '', alamat_pengiriman: '', catatan: '' });
      setOrderItems([{ produk_id: '', jumlah: 1, harga_satuan: 0 }]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal membuat pesanan';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Input Pesanan Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={24} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Informasi Pembeli */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marketplace</label>
                <select name="marketplace" value={formData.marketplace} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <option value="shopee">Shopee</option>
                  <option value="tokopedia">Tokopedia</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pembeli</label>
                <input type="text" name="nama_pembeli" required value={formData.nama_pembeli} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Alamat Pengiriman</label>
                <textarea name="alamat_pengiriman" required value={formData.alamat_pengiriman} onChange={handleChange} rows="2" className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>

            {/* Detail Produk Dinamis */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">Daftar Produk</h3>
                <button type="button" onClick={addItem} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded border border-indigo-200 flex items-center gap-1 hover:bg-indigo-100">
                  <Plus size={16} /> Tambah Baris
                </button>
              </div>

              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-3 mb-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Pilih Produk</label>
                    <select 
                      required 
                      value={item.produk_id} 
                      onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="" disabled>-- Pilih Produk --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} - {p.namaProduk} (Stok: {p.stok})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Jumlah</label>
                    <input type="number" min="1" required value={item.jumlah} onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <button type="button" onClick={() => removeItem(index)} disabled={orderItems.length === 1} className="p-2 bg-red-50 text-red-600 rounded-md border border-red-200 disabled:opacity-50">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <div className="mt-4 text-right">
                <span className="text-gray-600">Total Harga: </span>
                <span className="text-xl font-bold text-blue-600">
                  Rp {new Intl.NumberFormat('id-ID').format(totalHarga)}
                </span>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100">Batal</button>
          <button type="submit" form="orderForm" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {isLoading ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </div>

      </div>
    </div>
  );
};