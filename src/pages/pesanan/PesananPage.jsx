// src/pages/pesanan/PesananPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Eye } from "lucide-react";
import { OrderService } from "../../api/OrderService";
import { toast } from "react-toastify";
import { OrderModal } from "../../components/shared/OrderModal";

export const PesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getAll();
      setOrders(response.data);
    } catch {
      toast.error("Gagal memuat data pesanan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
    };
    loadData();
  }, [fetchOrders]);

  return (
    <div className="bg-card border border-border-1 rounded-[14px] p-6 flex flex-col min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[15px] font-bold text-text-main">Manajemen Pesanan</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent-main hover:bg-accent-hover text-white px-3.5 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors"
        >
          <Plus size={14} /> Input Pesanan
        </button>
      </div>

      <div className="overflow-x-auto border border-border-1 rounded-[10px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-bg-3 border-b border-border-1">
            <tr>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">No. Pesanan</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Pembeli</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Marketplace</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Total</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Status</th>
              <th className="text-[10px] font-semibold text-text-dim uppercase tracking-wider py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-xs text-text-muted">Loading data...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-xs text-text-muted">Belum ada pesanan.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors border-b border-border-1 last:border-0">
                  <td className="px-4 py-3 text-xs font-mono text-accent-main font-medium">
                    {order.nomorPesanan}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-text-main">
                    {order.namaPembeli}
                  </td>
                  <td className="px-4 py-3 text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded-md uppercase ${order.marketplace.toLowerCase() === 'shopee' ? 'bg-brand-shopee/10 text-brand-shopee' : order.marketplace.toLowerCase() === 'tokopedia' ? 'bg-brand-tokopedia/10 text-brand-tokopedia' : 'bg-bg-3 text-text-muted'}`}>
                      {order.marketplace}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-text-main">
                    {order.getTotalRupiah()}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${order.getStatusColor()}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'selesai' ? 'bg-status-green' : order.status === 'dikirim' ? 'bg-accent-main' : 'bg-status-amber'}`}></span>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    <button className="text-text-muted hover:text-accent-main flex items-center gap-1.5 transition-colors">
                      <Eye size={16} /> Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};