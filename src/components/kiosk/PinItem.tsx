"use client";

import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";

interface PinItemProps {
  id: string;
  status: "available" | "in-use" | "in_use" | "stored" | "charging" | "maintenance" | "damaged";
  isSelected?: boolean;
  isDraggable?: boolean;
}

export default function PinItem({ id, status, isSelected, isDraggable = true }: PinItemProps) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PIN",
    item: { id },
    canDrag: isDraggable && (status === "available" || status === "in-use" || status === "in_use" || status === "charging"),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return {
          icon: "🔋",
          bgColor: "bg-gradient-to-r from-green-200 to-green-300",
          borderColor: "border-green-500",
          textColor: "text-green-800",
          statusText: "Available",
        };
      case "in-use":
      case "in_use":
        return {
          icon: "⚡",
          bgColor: "bg-gradient-to-r from-blue-200 to-blue-300",
          borderColor: "border-blue-500",
          textColor: "text-blue-800",
          statusText: "In Use",
        };
      case "stored":
        return {
          icon: "📦",
          bgColor: "bg-gradient-to-r from-purple-200 to-purple-300",
          borderColor: "border-purple-500",
          textColor: "text-purple-800",
          statusText: "Stored",
        };
      default:
        return {
          icon: "🔋",
          bgColor: "bg-gradient-to-r from-gray-200 to-gray-300",
          borderColor: "border-gray-500",
          textColor: "text-gray-800",
          statusText: "Unknown",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      ref={dragRef as any}
      className={cn(
        "rounded-xl border-2 p-4 text-center transition-all duration-200 shadow-lg hover:shadow-xl",
        config.bgColor,
        config.borderColor,
        status === "available" || status === "in-use" || status === "in_use"
          ? "cursor-move hover:scale-105"
          : "cursor-default",
        isSelected && "ring-4 ring-yellow-300 scale-105",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="text-3xl mb-2">{config.icon}</div>
      <p className={`text-sm font-bold ${config.textColor}`}>
        Pin #{id}
      </p>
      <p className={`text-xs font-medium ${config.textColor} opacity-80`}>
        {config.statusText}
      </p>
      
      {(status === "available" || status === "in-use" || status === "in_use") && (
        <div className="mt-2 text-xs text-gray-600">
          Drag to slot
        </div>
      )}
    </div>
  );
}
