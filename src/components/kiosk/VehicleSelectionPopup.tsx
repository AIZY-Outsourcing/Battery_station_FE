"use client";

import { useEffect, useState } from "react";
import { X, Car, CheckCircle2 } from "lucide-react";
import { Vehicle } from "@/types/vehicle.type";
import { stationsApiService } from "@/services/stations.service";

interface VehicleSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleSelect: (vehicle: Vehicle) => void;
  sessionToken: string;
}

export default function VehicleSelectionPopup({
  isOpen,
  onClose,
  onVehicleSelect,
  sessionToken
}: VehicleSelectionPopupProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sessionToken) {
      loadVehicles();
    }
  }, [isOpen, sessionToken]);

  const loadVehicles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await stationsApiService.getUserVehicles(sessionToken, {
        page: 1,
        limit: 10,
        sortBy: 'created_at'
      });

      if (response.success && response.data) {
        setVehicles(response.data);
        
        if (response.data.length === 0) {
          setError("Bạn chưa có phương tiện nào. Vui lòng thêm phương tiện trong app.");
        }
      } else {
        setError(response.error || "Không thể tải danh sách phương tiện");
      }
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setError("Lỗi kết nối. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    // All vehicles from API are active, so we can select them
    setSelectedVehicle(vehicle);
  };

  const handleConfirm = () => {
    if (selectedVehicle) {
      onVehicleSelect(selectedVehicle);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chọn phương tiện</h2>
                <p className="text-blue-100 text-sm">Vui lòng chọn phương tiện để tiếp tục</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách phương tiện...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 text-center">{error}</p>
              <button
                onClick={loadVehicles}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-center">Bạn chưa có phương tiện nào</p>
              <p className="text-gray-500 text-sm text-center mt-2">Vui lòng thêm phương tiện trong app</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
                  className={`
                    relative border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02]
                    ${selectedVehicle?.id === vehicle.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200'}
                  `}
                >
                  {/* Selection Indicator */}
                  {selectedVehicle?.id === vehicle.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                  )}

                  {/* Vehicle Icon */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-8 h-8 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Vehicle Name */}
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {vehicle.name}
                      </h3>

                      {/* License Plate */}
                      <div className="mt-1 inline-block bg-yellow-400 text-black px-3 py-1 rounded font-mono font-bold text-sm">
                        {vehicle.plate_number}
                      </div>

                      {/* Vehicle Details */}
                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Model:</span>
                          <span>{vehicle.vehicle_model.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">VIN:</span>
                          <span className="font-mono text-xs">{vehicle.vin}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Năm sản xuất:</span>
                          <span>{vehicle.manufacturer_year}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Loại pin:</span>
                          <span>{vehicle.battery_type.name}</span>
                        </div>
                      </div>

                      {/* Active Badge */}
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-300">
                          Hoạt động
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          {vehicles.length > 0 && !error && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm">ℹ️</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Lưu ý</h4>
                  <p className="text-sm text-blue-700">
                    Vui lòng chọn phương tiện mà bạn muốn đổi pin. Tất cả các phương tiện hiển thị đều sẵn sàng sử dụng.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {vehicles.length > 0 && !error && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedVehicle}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
