"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Battery, Zap } from "lucide-react";
import { useStaffStations } from "@/hooks/staff/useStaffStations";
import type { StaffStation } from "@/types/staff/station.type";

export default function StationSelectPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const router = useRouter();
  const { data: stations = [], isLoading, error } = useStaffStations();

  // Find selected station object
  const selectedStation = stations.find((s) => s.id === selectedStationId);

  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
  };

  const handleContinue = () => {
    if (selectedStation) {
      // Store FULL station data in localStorage
      localStorage.setItem("selectedStation", JSON.stringify({
        id: selectedStation.id,
        name: selectedStation.name,
        address: selectedStation.address,
        city: selectedStation.city,
        lat: selectedStation.lat,
        lng: selectedStation.lng,
        status: selectedStation.status,
        image_url: selectedStation.image_url,
        staff_id: selectedStation.staff_id,
        created_at: selectedStation.created_at,
        updated_at: selectedStation.updated_at,
      }));
      router.push("/staff/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách trạm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải danh sách trạm</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Bạn chưa được phân công trạm nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chọn Trạm Làm Việc
          </h1>
          <p className="text-gray-600">
            Vui lòng chọn trạm bạn muốn làm việc hôm nay
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stations.map((station) => (
            <Card
              key={station.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedStationId === station.id
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : "hover:shadow-md"
              }`}
              onClick={() => handleStationSelect(station.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <Badge
                    variant={
                      station.status === "active" ? "default" : "secondary"
                    }
                    className={
                      station.status === "active"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }
                  >
                    {station.status === "active"
                      ? "Hoạt động"
                      : station.status === "maintenance"
                      ? "Bảo trì"
                      : "Không hoạt động"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {station.address}, {station.city}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Thành phố:</span>
                    <span>{station.city}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-20">Mã trạm:</span>
                    <span className="font-mono text-xs">{station.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedStationId}
            size="lg"
            className="px-8"
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
}
