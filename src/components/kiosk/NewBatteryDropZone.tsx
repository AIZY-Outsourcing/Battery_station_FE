"use client";

import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";

interface NewBatteryDropZoneProps {
  onDrop: (slotId: number) => void;
  batteryInfo: {
    serial_number: string;
    capacity_kwh: string;
    soh: string;
    slot_number: number;
  };
  targetSlotId: number;
}

export default function NewBatteryDropZone({
  onDrop,
  batteryInfo,
  targetSlotId,
}: NewBatteryDropZoneProps) {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: "SLOT_BATTERY",
      drop: (item: { slotId: number }) => {
        console.log("📦 NewBatteryDropZone drop triggered:", {
          itemSlotId: item.slotId,
          targetSlotId,
        });
        onDrop(item.slotId);
      },
      canDrop: (item: { slotId: number }) => {
        const can = item.slotId === targetSlotId;
        console.log("🔍 NewBatteryDropZone canDrop:", {
          itemSlotId: item.slotId,
          targetSlotId,
          canDrop: can,
        });
        return can;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [targetSlotId]
  );

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
        Kéo pin mới vào đây 👇
      </h4>
      <div
        ref={dropRef as any}
        className={cn(
          "p-6 rounded-xl border-2 border-dashed transition-all duration-300",
          isOver && canDrop
            ? "bg-gradient-to-br from-green-100 to-emerald-100 border-green-500 scale-105 shadow-2xl"
            : canDrop
            ? "bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-400 hover:border-teal-600 hover:shadow-lg animate-pulse"
            : "bg-gray-100 border-gray-300 opacity-50"
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">
              {isOver && canDrop ? "✅" : "🎁"}
            </span>
          </div>
          <h5 className="font-bold text-teal-800 mb-2">
            {isOver && canDrop ? "Thả pin vào đây!" : "Vùng nhận pin mới"}
          </h5>
          <p className="text-xs text-teal-600 mb-3">
            Kéo pin từ slot #{batteryInfo.slot_number} vào đây
          </p>
          <div className="bg-white rounded-lg p-3 text-left">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Serial:</span>
                <span className="font-mono font-semibold">
                  {batteryInfo.serial_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-semibold">
                  {batteryInfo.capacity_kwh} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SOH:</span>
                <span className="font-semibold text-green-600">
                  {batteryInfo.soh}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
