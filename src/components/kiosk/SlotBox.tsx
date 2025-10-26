"use client";

import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import React from "react";

interface SlotBoxProps {
  id: number;
  onDrop: (pinId: number, slotId: number) => void;
  hasPin: boolean;
  isActive?: boolean;
  pinId?: number | null;
  pinStatus?: string | null;
}

export default function SlotBox({
  id,
  onDrop,
  hasPin,
  isActive,
  pinId,
  pinStatus,
}: SlotBoxProps) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useDrop } = require("react-dnd");

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "PIN",
    drop: (item: { id: number }) => onDrop(item.id, id),
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef as any}
      className={cn(
        "border rounded-lg flex items-center justify-center h-20 w-20 text-sm transition-all",
        hasPin
          ? "bg-green-100 border-green-400"
          : "bg-gray-100 border-gray-300",
        isOver && "bg-yellow-200 border-yellow-500",
        isActive && "ring-4 ring-yellow-300"
      )}
    >
      {hasPin ? (
        <div className="text-center">
          <div className="text-xs font-semibold">Pin #{pinId}</div>
          <div className="text-xs capitalize">{pinStatus}</div>
        </div>
      ) : (
        `Slot #${id}`
      )}
    </div>
  );
}
