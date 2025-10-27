"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationControlsProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function PaginationControls({
  meta,
  onPageChange,
  onLimitChange,
  disabled = false,
  className = "",
}: PaginationControlsProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const { page, limit, total, totalPages } = meta;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Page Info */}
      <div className="text-sm text-muted-foreground">
        Trang {page} / {totalPages} ({total} mục)
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Page Size Selector */}
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(parseInt(value))}
          disabled={disabled}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 / trang</SelectItem>
            <SelectItem value="10">10 / trang</SelectItem>
            <SelectItem value="20">20 / trang</SelectItem>
            <SelectItem value="50">50 / trang</SelectItem>
            <SelectItem value="100">100 / trang</SelectItem>
          </SelectContent>
        </Select>

        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Trước
        </Button>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Tiếp
        </Button>
      </div>
    </div>
  );
}
