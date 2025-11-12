"use client";

import { useState } from "react";
import { stationsApiService } from "@/services/stations.service";
import Swal from "sweetalert2";

interface SwapConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  swapOrderId: string;
  newBatteryInfo: {
    battery_id: string;
    serial_number: string;
    slot_number: number;
    soh: string;
    capacity_kwh: string;
  };
  sessionToken: string;
}

export default function SwapConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  swapOrderId,
  newBatteryInfo,
  sessionToken
}: SwapConfirmationPopupProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      const response = await stationsApiService.confirmSwap(sessionToken, newBatteryInfo.battery_id);
      
      if (response.statusCode === 200) {
        await Swal.fire({
          title: "Xác nhận thành công!",
          text: response.message,
          icon: "success",
          confirmButtonText: "Tiếp tục",
          confirmButtonColor: "#10b981"
        });
        
        onConfirm();
        onClose();
      } else {
        await Swal.fire({
          title: "Lỗi xác nhận",
          text: response.message,
          icon: "error",
          confirmButtonText: "Thử lại",
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Lỗi kết nối",
        text: `Không thể xác nhận swap: ${error}`,
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    
    try {
      const response = await stationsApiService.cancelSwap(sessionToken, swapOrderId, "User cancelled the swap process");
      
      if (response.statusCode === 200) {
        await Swal.fire({
          title: "Đã hủy swap",
          text: response.message,
          icon: "info",
          confirmButtonText: "Đóng",
          confirmButtonColor: "#6b7280"
        });
        
        onClose();
      } else {
        await Swal.fire({
          title: "Lỗi hủy swap",
          text: response.message,
          icon: "error",
          confirmButtonText: "Thử lại",
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "Lỗi kết nối",
        text: `Không thể hủy swap: ${error}`,
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Xác nhận đổi pin</h2>
              <p className="text-blue-100 text-sm mt-1">Kiểm tra thông tin pin mới</p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Battery Info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">🔋</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Pin mới được đề xuất</h3>
                <p className="text-sm text-gray-600">Thông tin chi tiết pin</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Serial Number:</span>
                <p className="font-mono text-gray-800">{newBatteryInfo.serial_number}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Slot:</span>
                <p className="text-gray-800">#{newBatteryInfo.slot_number}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Capacity:</span>
                <p className="text-gray-800">{newBatteryInfo.capacity_kwh} kWh</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">SOH:</span>
                <p className="text-gray-800">{newBatteryInfo.soh}%</p>
              </div>
            </div>
          </div>

          {/* Swap Order Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-2">Thông tin giao dịch</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Swap Order ID:</span>
                <span className="font-mono text-gray-800">{swapOrderId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Battery ID:</span>
                <span className="font-mono text-gray-800">{newBatteryInfo.battery_id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-yellow-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Hướng dẫn</h4>
                <p className="text-sm text-yellow-700">
                  Pin này sẽ được đổi cho pin cũ của bạn. Vui lòng xác nhận để tiếp tục quá trình đổi pin.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Đang xử lý..." : "Từ chối"}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
