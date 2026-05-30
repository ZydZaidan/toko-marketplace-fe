import { useState, useEffect } from "react";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ReportService } from "../../api/ReportService";
import { toast } from "react-toastify";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await ReportService.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Error detail:", error); // Gunakan variabelnya di sini
        toast.error("Gagal ngambil data dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading data...
      </div>
    );
  }

  const formatRupiah = (angka) => {
    if (angka === null || angka === undefined) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Halo, {user?.name}! 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Role lo saat ini:{" "}
        <span className="font-semibold text-blue-600 uppercase">
          {user?.role}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Produk</p>
            <p className="text-2xl font-bold">{summary?.total_produk || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stok Menipis</p>
            <p className="text-2xl font-bold">{summary?.stok_menipis || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pesanan Diproses</p>
            <p className="text-2xl font-bold">
              {summary?.pesanan_diproses || 0}
            </p>
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Omzet Bulan Ini</p>
              <p className="text-xl font-bold">
                {formatRupiah(summary?.omzet_bulan_ini)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
