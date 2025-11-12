"use client";

import StationList from "@/components/kiosk/StationList";
import { useRouter } from "next/navigation";

export default function KioskPage() {
  const router = useRouter();

  const handleSelectStation = (station: any) => {
    router.push(`/kiosk/${station.id}`);
  };

  return <StationList onSelectStation={handleSelectStation} />;
}
