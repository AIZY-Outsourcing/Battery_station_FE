"use client";

import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";

interface PinItemProps {
  id: number;
  status: "available" | "in-use" | "stored";
  isSelected?: boolean;
}

export default function PinItem({ id, status, isSelected }: PinItemProps) {
  // only allow dragging when available
  // import useDrag lazily to avoid errors when server-side
  // but this is a client component so useDrag is safe
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useDrag } = require("react-dnd");

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "PIN",
    item: { id },
    canDrag: status === "available" || status === "in-use", // Allow both available and in-use pins to be dragged
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef as any}
      className={cn(
        "rounded-lg border p-3 text-center transition-all",
        status === "available" || status === "in-use"
          ? "cursor-move"
          : "cursor-default",
        status === "available"
          ? "bg-green-200 border-green-500"
          : status === "in-use"
          ? "bg-blue-200 border-blue-500" // Make in-use pins blue instead of gray
          : "bg-yellow-50 border-yellow-300",
        isSelected && "ring-4 ring-yellow-300",
        isDragging && "opacity-50"
      )}
    >
      <p className="text-sm font-semibold">Pin #{id}</p>
      <p className="text-xs capitalize">{status}</p>
    </div>
  );
}
