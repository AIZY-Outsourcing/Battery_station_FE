"use client";

import { Button } from "@/components/ui/button";

interface ActionPanelProps {
  currentStep: number;
  onAction: () => void;
  onError: (msg: string) => void;
}

const steps = [
  "Bắt đầu đổi pin",
  "Bỏ pin cũ vào ngăn trống",
  "Chọn pin mới",
  "Lấy pin mới",
  "Hoàn tất giao dịch",
];

export default function ActionPanel({
  currentStep,
  onAction,
  onError,
}: ActionPanelProps) {
  const handleClick = () => {
    if (currentStep >= steps.length) {
      onError("Giao dịch đã hoàn tất. Hãy bắt đầu giao dịch mới.");
      return;
    }
    onAction();
  };

  return (
    <div className="border rounded-lg p-4 w-[250px] flex flex-col gap-3 bg-white shadow">
      <h3 className="text-lg font-semibold">🧩 Action Panel</h3>
      <p className="text-sm text-gray-600">
        Bước hiện tại: {steps[currentStep] || "Hoàn tất"}
      </p>
      <Button onClick={handleClick}>
        {currentStep < steps.length ? steps[currentStep] : "Đã hoàn tất"}
      </Button>
    </div>
  );
}
