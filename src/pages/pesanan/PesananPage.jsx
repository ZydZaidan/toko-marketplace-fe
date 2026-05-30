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

  // Tarik keluar fungsinya dan bungkus pake useCallback
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

  // useEffect sekarang tinggal manggil fungsinya aja
// useEffect sekarang dibungkus fungsi async biar linter nggak marah
  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
    };
    loadData();
  }, [fetchOrders]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pesanan</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Input Pesanan
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                No. Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pembeli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Marketplace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  Loading data...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">
                    {order.nomorPesanan}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {order.namaPembeli}
                  </td>
                  <td className="px-6 py-4 text-sm uppercase">
                    {order.marketplace}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.getTotalRupiah()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${order.getStatusColor()}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
                      <Eye size={18} /> Detail
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