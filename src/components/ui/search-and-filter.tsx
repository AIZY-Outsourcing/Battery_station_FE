"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  limit: number;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  limit,
  onLimitChange,
  onRefresh,
  isLoading = false,
  className = "",
}: SearchAndFilterProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Page Size Selector */}
      <Select
        value={limit.toString()}
        onValueChange={(value) => onLimitChange(parseInt(value))}
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

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="h-9 px-3"
      >
        <RotateCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
