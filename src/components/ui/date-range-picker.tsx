"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  // Use controlled date if provided, otherwise use internal state
  const currentDate = date !== undefined ? date : internalDate;
  const handleDateChange = onDateChange || setInternalDate;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !currentDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate?.from ? (
              currentDate.to ? (
                <>
                  {currentDate.from.toLocaleDateString("vi-VN")} -{" "}
                  {currentDate.to.toLocaleDateString("vi-VN")}
                </>
              ) : (
                currentDate.from.toLocaleDateString("vi-VN")
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={currentDate?.from}
            selected={currentDate}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
