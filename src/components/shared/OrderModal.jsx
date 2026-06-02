// src/components/shared/OrderModal.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { OrderService } from '../../api/OrderService';
import { ProductService } from '../../api/ProductService';
import { toast } from 'react-toastify';

export const OrderModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    marketplace: 'shopee',
    nama_pembeli: '',
    no_hp_pembeli: '',
    alamat_pengiriman: '',
    catatan: ''
  });

  const [orderItems, setOrderItems] = useState([
    { produk_id: '', jumlah: 1, harga_satuan: 0 }
  ]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    
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

  const totalHarga = orderItems.reduce((total, item) => total + (item.jumlah * item.harga_satuan), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderItems.some(item => !item.produk_id)) {
      toast.warning("Pilih produk untuk semua item pesanan!");
      return;
    }
    setIsLoading(true);
    try {
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
      setFormData({ marketplace: 'shopee', nama_pembeli: '', no_hp_pembeli: '', alamat_pengiriman: '', catatan: '' });
      setOrderItems([{ produk_id: '', jumlah: 1, harga_satuan: 0 }]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper styling form
  const inputClass = "w-full bg-bg-3 border border-border-1 rounded-lg px-3 py-2 text-xs text-text-main placeholder-text-muted focus:border-accent-main focus:outline-none transition-colors";
  const labelClass = "block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-card border border-border-1 rounded-[14px] w-full max-w-3xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-1 bg-bg-2">
          <h2 className="text-[15px] font-bold text-text-main">Input Pesanan Baru</h2>
          <button onClick={onClose} className="text-text-muted hover:text-status-red transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Info Pembeli */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-2 p-5 rounded-xl border border-border-1">
              <div>
                <label className={labelClass}>Marketplace</label>
                <select name="marketplace" value={formData.marketplace} onChange={handleChange} className={inputClass}>
                  <option value="shopee">Shopee</option>
                  <option value="tokopedia">Tokopedia</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <input type="text" name="nama_pembeli" required value={formData.nama_pembeli} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Alamat Pengiriman</label>
                <textarea name="alamat_pengiriman" required value={formData.alamat_pengiriman} onChange={handleChange} rows="2" className={inputClass} />
              </div>
            </div>

            {/* Dynamic Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[13px] font-bold text-text-main">Daftar Produk</h3>
                <button type="button" onClick={addItem} className="text-[11px] bg-accent-main/10 text-accent-main px-3 py-1.5 rounded-lg border border-accent-main/20 flex items-center gap-1.5 hover:bg-accent-main/20 font-semibold transition-colors">
                  <Plus size={14} /> Tambah Baris
                </button>
              </div>

              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start bg-bg-2 p-3 rounded-xl border border-border-1">
                    <div className="flex-1">
                      <label className="block text-[10px] text-text-muted mb-1 font-mono">Pilih Produk</label>
                      <select required value={item.produk_id} onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)} className={inputClass}>
                        <option value="" disabled>-- Pilih Produk --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.sku} - {p.namaProduk} (Stok: {p.stok})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-text-muted mb-1 font-mono">Jumlah</label>
                      <input type="number" min="1" required value={item.jumlah} onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)} className={`${inputClass} font-mono`} />
                    </div>
                    <div className="pt-5.5">
                      <button type="button" onClick={() => removeItem(index)} disabled={orderItems.length === 1} className="p-2 bg-status-red-bg text-status-red rounded-lg border border-status-red/20 disabled:opacity-30 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-end bg-bg-2 p-4 rounded-xl border border-border-1">
                <span className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">Total Keseluruhan</span>
                <span className="text-2xl font-bold text-accent-main font-mono">
                  Rp {new Intl.NumberFormat('id-ID').format(totalHarga)}
                </span>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-border-1 flex justify-end gap-3 bg-bg-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border-1 rounded-lg text-xs font-semibold text-text-main hover:bg-bg-3 transition-colors">Batal</button>
          <button type="submit" form="orderForm" disabled={isLoading} className="px-4 py-2 bg-accent-main text-white rounded-lg text-xs font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors">
            {isLoading ? 'Memproses...' : 'Buat Pesanan'}
          </button>
        </div>

      </div>
    </div>
  );
};