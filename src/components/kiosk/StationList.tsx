"use client";

import { useState, useEffect } from "react";
import { Station } from "@/types/station.type";
import { MapPin, Clock, Wifi, ArrowRight, Search, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { stationsApiService, StationsApiParams } from "@/services/stations.service";

interface StationListProps {
  onSelectStation: (station: Station) => void;
}

export default function StationList({ onSelectStation }: StationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Load stations from API
  const loadStations = async (params: StationsApiParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiParams: StationsApiParams = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'created_at',
        ...params,
      };

      // Add search and status filters if provided
      if (searchTerm) {
        apiParams.search = searchTerm;
      }
      if (selectedStatus !== 'all') {
        apiParams.status = selectedStatus;
      }

      const response = await stationsApiService.getStations(apiParams);
      
      if (response.success) {
        setStations(response.data.stations);
        setPagination(response.data.pagination);
      } else {  
        setError(response.error || 'Failed to load stations');
        setStations([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load stations on component mount
  useEffect(() => {
    loadStations();
  }, []);

  // Reload when search term or status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadStations({ page: 1 }); // Reset to first page when filtering
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Tạm dừng';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-4xl">🏪</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Danh Sách Kiosk Station
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Chọn một trạm sạc để bắt đầu giao dịch đổi pin
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, địa chỉ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="maintenance">Bảo trì</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={() => loadStations({ page: 1 })}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Đang tải stations...</h3>
              <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => loadStations({ page: 1 })}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Stations Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations && stations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => onSelectStation(station)}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Station Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={station.image_url}
                      alt={station.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(station.name)}`;
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(station.status)}`}>
                        {getStatusText(station.status)}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <ArrowRight className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {station.name}
                    </h3>
                    
                    <div className="space-y-3">
                      {/* Address */}
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700">{station.address}</p>
                          <p className="text-xs text-gray-500">{station.city}</p>
                        </div>
                      </div>

                      {/* Coordinates */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Lat: {station.lat}</span>
                          <span>Lng: {station.lng}</span>
                        </div>
                      </div>

                      {/* Staff & Timestamps */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Wifi className="w-4 h-4 text-gray-500" />
                          <div className="text-xs text-gray-600">
                            {station.staff ? (
                              <div>
                                <div className="font-medium">{station.staff.name}</div>
                                <div className="text-gray-500">{station.staff.email}</div>
                                <div className="text-gray-500">{station.staff.phone}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Chưa có nhân viên</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div className="text-xs text-gray-600">
                            <div>Cập nhật: {new Date(station.updated_at).toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Station ID */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-blue-800">Station ID</p>
                            <p className="text-xs font-mono text-blue-600">{station.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && stations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-gray-400">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy station</h3>
              <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && stations.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => loadStations({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({pagination.total} stations)
                    </span>
                  </div>
                  
                  <button
                    onClick={() => loadStations({ page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
