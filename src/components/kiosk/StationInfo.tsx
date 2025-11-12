"use client";

import { Station } from "@/types/station.type";
import { MapPin, Clock, User, Wifi } from "lucide-react";

interface StationInfoProps {
  station: Station;
}

export default function StationInfo({ station }: StationInfoProps) {
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
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thông tin Station</h3>
        <p className="text-sm text-gray-600">Chi tiết trạm sạc</p>
      </div>

      {/* Station Image */}
      <div className="mb-6">
        <img
          src={station.image_url}
          alt={station.name}
          className="w-full h-32 object-cover rounded-xl shadow-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x128/6366f1/ffffff?text=${encodeURIComponent(station.name)}`;
          }}
        />
      </div>

      {/* Station Details */}
      <div className="space-y-4">
        {/* Station Name & Status */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-800">{station.name}</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(station.status)}`}>
            {getStatusText(station.status)}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">{station.address}</p>
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

        {/* Timestamps */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <div className="text-xs text-gray-600">
              <div>Tạo: {new Date(station.created_at).toLocaleString('vi-VN')}</div>
              <div>Cập nhật: {new Date(station.updated_at).toLocaleString('vi-VN')}</div>
            </div>
          </div>
        </div>

        {/* Staff Info */}
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4 text-gray-500" />
          <div className="text-xs text-gray-600">
            {station.staff_id ? (
              <span>Nhân viên: {station.staff_id}</span>
            ) : (
              <span className="text-gray-400">Chưa có nhân viên</span>
            )}
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
  );
}
