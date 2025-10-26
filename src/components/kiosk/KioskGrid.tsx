"use client";

import { useState, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PinItem from "./PinItem";
import SlotBox from "./SlotBox";
import ActionPanel from "./ActionPanel";
import LogPanel from "./LogPanel";

type PinStatus = "available" | "in-use" | "stored";

export default function KioskGrid() {
  // User chỉ có 1 pin cần đổi
  const [userPin] = useState({ id: 999, status: "in-use" as PinStatus });

  // Kiosk có sẵn pin trong một số ngăn, một số ngăn trống
  const [slots, setSlots] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      hasPin: i < 15, // 15 ngăn đầu có pin, 5 ngăn cuối trống
      pinId: i < 15 ? 100 + i : null, // pin ID từ 100-114
      pinStatus: i < 15 ? ("available" as PinStatus) : null,
    }))
  );

  const [logs, setLogs] = useState<string[]>([]);

  // simplified flow state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;

  const [targetOldSlotId, setTargetOldSlotId] = useState<number | null>(null);
  const targetOldSlotIdRef = useRef(targetOldSlotId);
  targetOldSlotIdRef.current = targetOldSlotId;

  const [selectedNewSlotId, setSelectedNewSlotId] = useState<number | null>(
    null
  );
  const [oldPinInserted, setOldPinInserted] = useState(false);
  const [newPinTaken, setNewPinTaken] = useState(false);

  const log = useCallback(
    (message: string) =>
      setLogs((prev) => [
        ...prev,
        `${new Date().toLocaleTimeString()} - ${message}`,
      ]),
    []
  );

  const resetFlow = () => {
    setCurrentStep(0);
    setTargetOldSlotId(null);
    setSelectedNewSlotId(null);
    setOldPinInserted(false);
    setNewPinTaken(false);
    log("Hệ thống trở về trạng thái chờ giao dịch mới.");
  };

  // drop behavior for user pin into empty slot
  const handleDrop = useCallback(
    (pinId: number, slotId: number) => {
      const currentStepValue = currentStepRef.current;
      const targetSlotValue = targetOldSlotIdRef.current;

      console.log("handleDrop called:", {
        pinId,
        slotId,
        currentStep: currentStepValue,
        targetOldSlotId: targetSlotValue,
        oldPinInserted,
      });

      // Only accept user pin (999) into empty slots during step 1
      if (pinId !== 999) {
        log(`❌ Chỉ có thể kéo pin của user vào kiosk.`);
        return;
      }

      if (currentStepValue !== 1) {
        log(
          `❌ Hãy mở cửa ngăn trống trước khi bỏ pin. (Bước hiện tại: ${currentStepValue})`
        );
        return;
      }

      if (oldPinInserted) {
        log(`❌ Pin cũ đã được bỏ vào ngăn rồi.`);
        return;
      }

      // Check if dropping into the correct target slot
      if (targetSlotValue !== slotId) {
        log(`❌ Vui lòng bỏ pin vào ngăn được mở: #${targetSlotValue}`);
        return;
      }

      // Update slot to contain user's old pin
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                hasPin: true,
                pinId: 999,
                pinStatus: "stored" as PinStatus,
              }
            : slot
        )
      );

      setOldPinInserted(true);
      log(`Pin cũ #${pinId} đã được bỏ vào ngăn #${slotId}`);

      // auto advance to next step
      setTimeout(() => {
        log("Pin cũ đã được đặt, chuyển sang bước lấy pin mới.");
        setCurrentStep(2);
      }, 500);
    },
    [oldPinInserted, log]
  );

  const handleError = (msg: string) => log(`❌ Lỗi: ${msg}`);

  const performAction = () => {
    switch (currentStep) {
      case 0: {
        log("Bắt đầu giao dịch đổi pin...");
        setCurrentStep((prev) => {
          console.log("Setting currentStep from", prev, "to 1");
          return 1;
        });

        // Tự động mở ngăn trống đầu tiên
        const emptySlot = slots.find((s) => !s.hasPin);
        if (!emptySlot) {
          handleError("Không có ngăn trống để nhận pin cũ.");
          return;
        }

        setTargetOldSlotId((prev) => {
          console.log("Setting targetOldSlotId from", prev, "to", emptySlot.id);
          return emptySlot.id;
        });

        log(`Đã mở ngăn trống để nhận pin cũ: #${emptySlot.id}`);
        break;
      }
      case 1: {
        // This step is handled by drag & drop
        handleError("Vui lòng kéo pin cũ của bạn vào ngăn được mở.");
        break;
      }
      case 2: {
        // Select a slot with available pin for user to take
        const availableSlot = slots.find(
          (s) => s.hasPin && s.pinStatus === "available"
        );
        if (!availableSlot) {
          handleError("Không có pin khả dụng để phát.");
          return;
        }

        setSelectedNewSlotId(availableSlot.id);
        log(`Đã chọn pin mới từ ngăn #${availableSlot.id} cho user`);
        setCurrentStep(3);
        break;
      }
      case 3: {
        // User confirms taking the new pin
        if (!selectedNewSlotId) {
          handleError("Chưa chọn ngăn pin mới.");
          return;
        }

        // Remove pin from selected slot (simulate user taking it)
        setSlots((prev) =>
          prev.map((slot) =>
            slot.id === selectedNewSlotId
              ? { ...slot, hasPin: false, pinId: null, pinStatus: null }
              : slot
          )
        );

        setNewPinTaken(true);
        log(`User đã lấy pin mới từ ngăn #${selectedNewSlotId}`);
        setCurrentStep(4);
        break;
      }
      case 4: {
        if (!newPinTaken) {
          handleError("Bạn cần lấy pin mới trước khi xác nhận.");
          return;
        }
        log(
          `🎉 Đổi pin thành công! User đã nhận pin mới từ ngăn #${selectedNewSlotId}.`
        );
        // finalize and reset after small delay
        setTimeout(() => resetFlow(), 800);
        setCurrentStep(5);
        break;
      }
      default: {
        handleError("Bước không hợp lệ hoặc đã hoàn tất.");
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-6">
        {/* Pin của user */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg">User Pin</h3>
          {!oldPinInserted && (
            <PinItem
              id={userPin.id}
              status={userPin.status}
              isSelected={false}
            />
          )}
          {oldPinInserted && (
            <div className="rounded-lg border p-3 text-center bg-gray-200 border-gray-400">
              <p className="text-sm">Pin đã nộp</p>
            </div>
          )}
        </div>

        {/* Ma trận kiosk */}
        <div className="grid grid-cols-5 gap-3">
          {slots.map((slot) => (
            <SlotBox
              key={slot.id}
              id={slot.id}
              hasPin={slot.hasPin}
              onDrop={handleDrop}
              isActive={
                targetOldSlotId === slot.id || selectedNewSlotId === slot.id
              }
              pinId={slot.pinId}
              pinStatus={slot.pinStatus}
            />
          ))}
        </div>

        {/* Panel thao tác */}
        <div className="flex flex-col gap-4">
          <ActionPanel
            currentStep={currentStep}
            onAction={performAction}
            onError={handleError}
          />
          <LogPanel logs={logs} />
        </div>
      </div>
    </DndProvider>
  );
}
