// src/pages/produk/ProdukPage.jsx
import { useState, useEffect } from 'react';
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

  // Fungsi dipisah dan parameternya dibikin eksplisit
  const fetchProducts = async (currentPage) => {
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
  };

  useEffect(() => {
    // Dibungkus fungsi async di dalam useEffect biar linter nggak marah
    const loadData = async () => {
      await fetchProducts(page);
    };
    loadData();
  }, [page]); // Bakal jalan ulang tiap 'page' berubah

  const handleDelete = (id) => {
    alert(`Fitur hapus produk id: ${id} coming soon!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
        
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga Jual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">Loading data...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">Belum ada data.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium">{product.namaProduk}</td>
                  <td className="px-6 py-4 text-sm">{product.getHargaRupiah()}</td>
                  <td className="px-6 py-4 text-sm">{product.stok} {product.satuan}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${product.getStatusStok() === 'Aman' ? 'bg-green-100 text-green-800' : 
                        product.getStatusStok() === 'Menipis' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {product.getStatusStok()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-3">
                    {user?.role === 'admin' ? (
                      <>
                        <button className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Hanya lihat</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Fitur Pagination yang tadi ngilang udah gue balikin ke sini */}
      {!isLoading && meta && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Halaman <span className="font-medium">{meta.current_page || 1}</span> dari <span className="font-medium">{meta.last_page || 1}</span>
          </div>
          <div className="space-x-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:bg-gray-100"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (meta.last_page || 1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:bg-gray-100"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchProducts(page)} // Biar pas sukses tambah data, dia narik data di halaman yang sama
      />
    </div>
  );
};