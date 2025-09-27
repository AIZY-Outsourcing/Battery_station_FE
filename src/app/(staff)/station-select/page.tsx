"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const stations = [
  {
    id: 1,
    name: "Trạm Quận 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    status: "active",
    batteryCount: 45,
    staffCount: 8,
    utilization: 85,
  },
  {
    id: 2,
    name: "Trạm Quận 3",
    address: "456 Võ Văn Tần, Quận 3, TP.HCM",
    status: "active",
    batteryCount: 38,
    staffCount: 6,
    utilization: 72,
  },
  {
    id: 3,
    name: "Trạm Bình Thạnh",
    address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
    status: "maintenance",
    batteryCount: 42,
    staffCount: 5,
    utilization: 0,
  },
  {
    id: 4,
    name: "Trạm Quận 7",
    address: "321 Nguyễn Thị Thập, Quận 7, TP.HCM",
    status: "active",
    batteryCount: 52,
    staffCount: 10,
    utilization: 91,
  },
];

export default function StationSelectPage() {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const router = useRouter();

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
  };

  const handleContinue = () => {
    if (selectedStation) {
      // Store selected station in localStorage or context
      localStorage.setItem("selectedStation", selectedStation.toString());
      router.push("/staff/dashboard");
    }
  };

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
                selectedStation === station.id
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
                    {station.status === "active" ? "Hoạt động" : "Bảo trì"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {station.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Battery className="w-4 h-4 mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">{station.batteryCount}</div>
                      <div className="text-gray-500">Pin</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    <div>
                      <div className="font-medium">{station.staffCount}</div>
                      <div className="text-gray-500">Nhân viên</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-500" />
                    <div>
                      <div className="font-medium">{station.utilization}%</div>
                      <div className="text-gray-500">Sử dụng</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedStation}
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
