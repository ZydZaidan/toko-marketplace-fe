// src/pages/produk/ProdukPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProductService } from '../../api/ProductService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { ProductModal } from '../../components/shared/ProductModal';

export const ProdukPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = useCallback(async (currentPage) => {
    setIsLoading(true);
    try {
      const response = await ProductService.getAll({ page: currentPage, per_page: 10 });
      setProducts(response.data); 
      setMeta(response.meta);
    } catch {
      toast.error('Gagal memuat data produk');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts(page);
    };
    loadData();
  }, [page, fetchProducts]);

  const handleDelete = (id) => {
    alert(`Fitur hapus produk id: ${id} coming soon!`);
  };

  return (
    <div className="bg-card border border-border-1 rounded-[14px] p-6 flex flex-col min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[15px] font-bold text-text-main">Manajemen Produk</h1>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-accent-main hover:bg-accent-hover text-white px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors"
          >
            <Plus size={14} /> Tambah Produk
          </button>
        )}
      </div>

      {/* Tabel Produk Dark Mode */}
      <div className="overflow-x-auto border border-border-1 rounded-[10px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-bg-3 border-b border-border-1">
            <tr>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">SKU</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Nama Produk</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Harga Jual</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Stok</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Status</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-xs text-text-muted">Loading data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-xs text-text-muted">Belum ada data.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors border-b border-border-1 last:border-0">
                  <td className="px-4 py-3 text-xs font-mono text-text-muted">{product.sku}</td>
                  <td className="px-4 py-3 text-xs font-medium text-text-main">{product.namaProduk}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-text-main">{product.getHargaRupiah()}</td>
                  <td className="px-4 py-3 text-xs text-text-muted font-mono">{product.stok} <span className="text-[10px]">{product.satuan}</span></td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold rounded-md 
                      ${product.getStatusStok() === 'Aman' ? 'bg-status-green-bg text-status-green' : 
                        product.getStatusStok() === 'Menipis' ? 'bg-status-amber-bg text-status-amber' : 
                        'bg-status-red-bg text-status-red'}`}>
                      {product.getStatusStok()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium space-x-3">
                    {user?.role === 'admin' ? (
                      <div className="flex items-center gap-3">
                        <button className="text-text-muted hover:text-accent-main transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-text-muted hover:text-status-red transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ) : (
                      <span className="text-text-dim italic text-[10px]">Read-only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Dark Mode */}
      {!isLoading && meta && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-1">
          <div className="text-xs text-text-muted">
            Halaman <span className="font-bold text-text-main">{meta.current_page || 1}</span> dari <span className="font-bold text-text-main">{meta.last_page || 1}</span>
          </div>
          <div className="space-x-2 flex">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-border-1 rounded-md text-xs font-medium text-text-main bg-bg-3 hover:bg-bg-2 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (meta.last_page || 1)}
              className="px-3 py-1.5 border border-border-1 rounded-md text-xs font-medium text-text-main bg-bg-3 hover:bg-bg-2 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchProducts(page)} 
      />
    </div>
  );
};