"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KioskGrid from "@/components/kiosk/KioskGrid";
import { Station } from "@/types/station.type";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { stationsApiService } from "@/services/stations.service";

export default function KioskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id as string;
  
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStation = async () => {
      if (!stationId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await stationsApiService.getStationById(stationId);
        
        if (response.success && response.data) {
          setStation(response.data);
        } else {
          setError(response.error || 'Station not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadStation();
  }, [stationId]);

  const handleBackToList = () => {
    router.push('/kiosk');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Đang tải station...</h3>
            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !station) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group mb-8"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Quay lại danh sách</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Lỗi tải station</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleBackToList}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Back Button */}
      <div className="px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>
        </div>
      </div>

      {/* Kiosk Grid */}
      <div className="px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <KioskGrid station={station} />
        </div>
      </div>
    </main>
  );
}
