"use client";

import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import React from "react";

interface SlotBoxProps {
  id: number;
  onDrop: (pinId: string, slotId: number) => void;
  hasPin: boolean;
  isActive?: boolean;
  pinId?: string | null;
  pinStatus?: string | null;
  isReserved?: boolean;
  isCoverOpen?: boolean;
  onCoverToggle?: (slotId: number) => void;
  batteryInfo?: {
    name: string;
    serial_number: string;
    capacity_kwh: string;
    soh: string;
  };
}

export default function SlotBox({
  id,
  onDrop,
  hasPin,
  isActive,
  pinId,
  pinStatus,
  isReserved,
  isCoverOpen = false,
  onCoverToggle,
  batteryInfo,
}: SlotBoxProps) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useDrop } = require("react-dnd");

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "PIN",
    drop: (item: { id: string }) => onDrop(item.id, id),
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const getSlotStyle = () => {
    if (isReserved) {
      return "bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300";
    }
    if (isActive) {
      return "bg-blue-100 border-blue-400 ring-4 ring-blue-300 animate-pulse";
    }
    if (hasPin) {
      switch (pinStatus) {
        case "available":
          return "bg-green-100 border-green-400 hover:bg-green-200";
        case "stored":
          return "bg-purple-100 border-purple-400";
        case "in-use":
          return "bg-blue-100 border-blue-400";
        default:
          return "bg-gray-100 border-gray-400";
      }
    }
    return "bg-gray-50 border-gray-300 hover:bg-gray-100";
  };

  const getPinIcon = () => {
    if (!hasPin) return null;
    
    switch (pinStatus) {
      case "available":
        return "🔋";
      case "stored":
        return "📦";
      case "in-use":
        return "⚡";
      default:
        return "🔋";
    }
  };

  const getStatusText = () => {
    if (isReserved) return "Reserved";
    if (isActive) return "Open";
    if (hasPin) {
      switch (pinStatus) {
        case "available":
          return "Available";
        case "stored":
          return "Stored";
        case "in-use":
          return "In Use";
        default:
          return "Unknown";
      }
    }
    return "Empty";
  };

  return (
    <div className="relative h-28 w-28">
      {/* Slot Container */}
      <div
        ref={dropRef as any}
        className={cn(
          "border-2 rounded-xl flex flex-col items-center justify-center h-28 w-28 text-xs transition-all duration-200 cursor-pointer relative overflow-hidden",
          getSlotStyle(),
          isOver && "bg-yellow-200 border-yellow-500 scale-105",
          isActive && "shadow-lg"
        )}
      >
        <div className="text-center z-10">
          <div className="text-xl mb-1">{getPinIcon()}</div>
          <div className="font-bold text-gray-800">#{id}</div>
          {hasPin && (
            <>
              <div className="text-xs font-semibold text-gray-600">
                Pin #{pinId}
              </div>
              <div className="text-xs capitalize text-gray-500">
                {getStatusText()}
              </div>
            </>
          )}
          {!hasPin && (
            <div className="text-xs text-gray-500">Empty</div>
          )}
          {isReserved && (
            <div className="text-xs font-semibold text-yellow-700 mt-1">
              Reserved
            </div>
          )}
          {isActive && (
            <div className="text-xs font-bold text-blue-700 mt-1 animate-bounce">
              OPEN
            </div>
          )}
        </div>

        {/* Slot Cover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl transition-transform duration-500 ease-in-out z-20",
            isCoverOpen ? "transform -translate-y-full" : "transform translate-y-0"
          )}
        >
          {/* Cover Handle */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-400 rounded-full"></div>
          
          {/* Cover Content */}
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="text-lg mb-1">🔒</div>
            <div className="text-xs font-semibold">Slot #{id}</div>
            <div className="text-xs opacity-75">
              {isCoverOpen ? "Mở" : "Đóng"}
            </div>
          </div>

          {/* Cover Toggle Button */}
          {onCoverToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCoverToggle(id);
              }}
              className="absolute bottom-2 right-2 w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-xs text-white">
                {isCoverOpen ? "🔽" : "🔼"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
