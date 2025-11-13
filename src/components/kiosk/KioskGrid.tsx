"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PinItem from "./PinItem";
import SlotBox from "./SlotBox";
import StationInfo from "./StationInfo";
import Swal from "sweetalert2";
import NewBatteryDropZone from "./NewBatteryDropZone";

import QRCodePopup from "./QRCodePopup";
import SwapConfirmationPopup from "./SwapConfirmationPopup";
import VehicleSelectionPopup from "./VehicleSelectionPopup";
import { stationsApiService } from "@/services/stations.service";
import { KioskActionState, KioskSlot, KioskTransaction } from "@/types/kiosk.type";
import { Station } from "@/types/station.type";
import { Battery } from "@/types/battery.type";
import { Vehicle } from "@/types/vehicle.type";
import { kioskService } from "@/services/kiosk.service";

interface KioskGridProps {
  station: Station;
}

export default function KioskGrid({ station }: KioskGridProps) {
  // QR Flow State Management
  const [currentState, setCurrentState] = useState<KioskActionState>(KioskActionState.REQUESTED);
  const [transaction, setTransaction] = useState<KioskTransaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // User pin state
  const [userPin] = useState({ id: 999, status: "in-use" as const });

  // Kiosk slots với state mở rộng
  const [slots, setSlots] = useState<KioskSlot[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      hasPin: i < 15,
      pinId: i < 15 ? `100${i}` : null,
      pinStatus: i < 15 ? ("available" as const) : ("available" as const),
      isOpen: false,
      isReserved: false,
      isCoverOpen: false, // Tất cả nắp đều đóng ban đầu
    }))
  );

  const [logs, setLogs] = useState<string[]>([]);
  const [waitingForMobileQR, setWaitingForMobileQR] = useState(false);
  
  // Battery data states
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [batteriesLoading, setBatteriesLoading] = useState(true);
  const [batteriesError, setBatteriesError] = useState<string | null>(null);
  
  // Free batteries states (for user pin section)
  const [freeBatteries, setFreeBatteries] = useState<Battery[]>([]);
  const [freeBatteriesLoading, setFreeBatteriesLoading] = useState(true);
  const [freeBatteriesError, setFreeBatteriesError] = useState<string | null>(null);
  const [selectedUserBattery, setSelectedUserBattery] = useState<Battery | null>(null);

  // Swap states
  const [swapOrderId, setSwapOrderId] = useState<string | null>(null);
  const [emptySlotForOldBattery, setEmptySlotForOldBattery] = useState<number | null>(null);
  const [newBatteryInfo, setNewBatteryInfo] = useState<{
    battery_id: string;
    serial_number: string;
    slot_number: number;
    soh: string;
    capacity_kwh: string;
  } | null>(null);

  // Swap confirmation popup states
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);
  
  // QR Code states
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [qrData, setQrData] = useState<string>("");
  const [qrExpiresAt, setQrExpiresAt] = useState<string>("");
  const [qrSessionId, setQrSessionId] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Vehicle selection states
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  // Luồng 7 bước
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [targetEmptySlotId, setTargetEmptySlotId] = useState<number | null>(null);
  const [targetNewSlotId, setTargetNewSlotId] = useState<number | null>(null);
  const [oldPinInserted, setOldPinInserted] = useState(false);
  const [newPinTaken, setNewPinTaken] = useState(false);


  const log = useCallback(
    (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
      setLogs((prev) => [
        ...prev,
        `${timestamp} ${icon} ${message}`,
      ]);
    },
    []
  );

  // Load batteries when component mounts
  useEffect(() => {
    const loadBatteries = async () => {
      setBatteriesLoading(true);
      setBatteriesError(null);

      try {
        const response = await stationsApiService.getStationBatteries(station.id);
        
        if (response.success && response.data) {
          setBatteries(response.data.batteries);
          log(`Đã tải ${response.data.batteries.length} pin từ station`, 'success');
          
          // Update slots based on real battery data
          updateSlotsFromBatteries(response.data.batteries);
        } else {
          setBatteriesError(response.error || 'Failed to load batteries');
          log(`Lỗi tải batteries: ${response.error}`, 'error');
        }
      } catch (error: any) {
        setBatteriesError(error.message);
        log(`Lỗi kết nối API batteries: ${error.message}`, 'error');
      } finally {
        setBatteriesLoading(false);
      }
    };

    loadBatteries();
  }, [station.id, log]);

  // Load free batteries for user pin section - only when vehicle is selected
  useEffect(() => {
    const loadFreeBatteries = async () => {
      if (!selectedVehicle) {
        // Reset batteries if no vehicle selected
        setFreeBatteries([]);
        setFreeBatteriesLoading(false);
        setFreeBatteriesError(null);
        return;
      }

      setFreeBatteriesLoading(true);
      setFreeBatteriesError(null);

      try {
        const response = await stationsApiService.getFreeBatteries(selectedVehicle.id);
        
        if (response.success && response.data) {
          setFreeBatteries(response.data.batteries);
          log(`Đã tải ${response.data.batteries.length} pin free cho xe ${selectedVehicle.name}`, 'success');
        } else {
          setFreeBatteriesError(response.error || 'Failed to load free batteries');
          log(`Lỗi tải free batteries: ${response.error}`, 'error');
        }
      } catch (error: any) {
        setFreeBatteriesError(error.message);
        log(`Lỗi kết nối API free batteries: ${error.message}`, 'error');
      } finally {
        setFreeBatteriesLoading(false);
      }
    };

    loadFreeBatteries();
  }, [selectedVehicle, log]);

  // Update slots based on battery data
  const updateSlotsFromBatteries = (batteryData: Battery[]) => {
    setSlots(prev => prev.map(slot => {
      const battery = batteryData.find(b => b.station_kiosk_slot === slot.id);
      
      if (battery) {
        return {
          ...slot,
          hasPin: true,
          pinId: battery.id,
          pinStatus: battery.status,
          isOpen: false,
          isReserved: false,
          isCoverOpen: false,
        };
      } else {
        return {
          ...slot,
          hasPin: false,
          pinId: null,
          pinStatus: 'available',
          isOpen: false,
          isReserved: false,
          isCoverOpen: false,
        };
      }
    }));
  };

  const handleCloseQRPopup = () => {
    setShowQRPopup(false);
    setQrData("");
    setQrExpiresAt("");
    setQrSessionId("");
    log("QR popup đã được đóng", 'info');
  };

  const handleSessionSuccess = async (token: string) => {
    console.log("🎯 handleSessionSuccess called with token:", token.slice(0, 20) + "...");
    setSessionToken(token);
    setIsLoggedIn(true);
    log(`Session thành công! Token: ${token.slice(0, 20)}...`, 'success');
    log("Đã đăng nhập thành công! Vui lòng chọn phương tiện...", 'success');
    
    // Show vehicle selection popup instead of immediately calling start-swap
    setShowVehicleSelection(true);
  };

  const handleVehicleSelect = async (vehicle: Vehicle) => {
    console.log("🚗 Vehicle selected:", vehicle);
    setSelectedVehicle(vehicle);
    log(`Đã chọn phương tiện: ${vehicle.name} (${vehicle.plate_number})`, 'success');
    log("Đang bắt đầu quá trình swap...", 'info');
    
    // Move to step 2 and call start-swap API
    setCurrentStep(2);
    await startSwapWithToken(sessionToken, vehicle?.id || "");
  };

  const handleVehicleSelectionClose = () => {
    setShowVehicleSelection(false);
    log("Đã đóng popup chọn phương tiện", 'info');
  };

  const resetFlow = () => {
    setCurrentState(KioskActionState.REQUESTED);
    setTransaction(null);
    setIsProcessing(false);
    setWaitingForMobileQR(false);
    
    // Reset QR states
    setShowQRPopup(false);
    setQrData("");
    setQrExpiresAt("");
    setQrSessionId("");
    setSessionToken("");
    setIsLoggedIn(false);
    
    // Reset vehicle selection
    setShowVehicleSelection(false);
    setSelectedVehicle(null);
    
    // Reset luồng 7 bước
    setCurrentStep(0);
    setTargetEmptySlotId(null);
    setTargetNewSlotId(null);
    setOldPinInserted(false);
    setNewPinTaken(false);
    
    // Reset swap states
    setSwapOrderId(null);
    setEmptySlotForOldBattery(null);
    setNewBatteryInfo(null);
    setShowSwapConfirmation(false);
    
    // Reset slots
    setSlots(prev => prev.map(slot => ({
      ...slot,
      isOpen: false,
      isReserved: false,
      isCoverOpen: false, // Đóng tất cả nắp
    })));
    
    log("Hệ thống trở về trạng thái chờ giao dịch mới.", 'info');
  };

  // Handle QR data received from mobile app
  const handleMobileQRData = async (qrData: string) => {
    setIsProcessing(true);
    setWaitingForMobileQR(false);
    
    try {
      log(`Nhận QR data từ mobile: ${qrData}`, 'info');
      const response = await kioskService.scanQR(qrData);
      
      if (response.success && response.data) {
        setTransaction(response.data);
        setCurrentState(KioskActionState.RESERVATION_CONFIRMED);
        log("Xác nhận đặt chỗ thành công!", 'success');
      } else {
        log(`Lỗi xử lý QR: ${response.error || 'Không xác định'}`, 'error');
        setCurrentState(KioskActionState.FAILED);
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
      setCurrentState(KioskActionState.FAILED);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start waiting for mobile QR scan
  const startWaitingForMobileQR = async () => {
    setIsProcessing(true);
    setWaitingForMobileQR(true);
    setCurrentState(KioskActionState.REQUESTED);
    log("Đang tạo QR session...", 'info');
    
    try {
      const response = await stationsApiService.createQRSession({
        station_id: station.id
      });
      
      if (response.success && response.data) {
        setQrData(response.data.qr_data);
        setQrExpiresAt(response.data.expires_at);
        setQrSessionId(response.data.session_id);
        setShowQRPopup(true);
        log("QR session đã được tạo thành công!", 'success');
      } else {
        log(`Lỗi tạo QR session: ${response.error}`, 'error');
        setWaitingForMobileQR(false);
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
      setWaitingForMobileQR(false);
    } finally {
      setIsProcessing(false);
    }
  };



  // Luồng 7 bước mới
  const stepDescriptions = [
    "Chọn pin và bắt đầu",
    "Mở nắp slot trống",
    "Kéo pin vào slot",
    "Đóng nắp slot",
    "Mở nắp slot pin mới",
    "Kéo pin mới ra",
    "Đóng nắp và hoàn tất"
  ];

  // Bước 1: Mở nắp slot trống
  const openEmptySlotCover = () => {
    const emptySlot = slots.find(slot => !slot.hasPin && !slot.isReserved);
    if (!emptySlot) {
      log("Không có slot trống!", 'error');
      return;
    }

    setTargetEmptySlotId(emptySlot.id);
    setSlots(prev => prev.map(slot => 
      slot.id === emptySlot.id ? { ...slot, isCoverOpen: true } : slot
    ));
    setCurrentStep(1);
    log(`Bước 1: Đã mở nắp slot trống #${emptySlot.id}`, 'success');
  };

  // Bước 3: Đóng nắp slot sau khi bỏ pin cũ
  const closeEmptySlotCover = () => {
    if (!targetEmptySlotId) return;

    setSlots(prev => prev.map(slot => 
      slot.id === targetEmptySlotId ? { ...slot, isCoverOpen: false } : slot
    ));
    setCurrentStep(3);
    log(`Bước 3: Đã đóng nắp slot #${targetEmptySlotId}`, 'success');
    log("Pin cũ đã được bảo quản an toàn!", 'success');
    
    // Auto advance to step 4: Mở nắp slot pin mới
    setTimeout(() => {
      openNewSlotCover();
    }, 1000);
  };

  // Start swap process with token parameter
  const startSwapWithToken = async (token: string, vehicleId: string) => {
    console.log("🚀 Starting startSwapWithToken with token:", token.slice(0, 20) + "...");
    setIsProcessing(true);
    log("Đang gọi API start-swap...", 'info');

      try {
      console.log("📡 Calling stationsApiService.startSwap...");
      const response = await stationsApiService.startSwap(token, vehicleId);
      console.log("✅ API Response:", response);
      
      if (response.statusCode === 201 && response.data) {
        setSwapOrderId(response.data.swap_order_id);
        setEmptySlotForOldBattery(response.data.empty_slot_for_old_battery);
        setNewBatteryInfo(response.data.new_battery);
        
        log(`Swap order ID: ${response.data.swap_order_id}`, 'success');
        log(`Slot trống cho pin cũ: #${response.data.empty_slot_for_old_battery}`, 'info');
        log(`Pin mới: ${response.data.new_battery.serial_number} tại slot #${response.data.new_battery.slot_number}`, 'info');
        log(response.data.next_action, 'info');
        log("Swap đã được xác nhận! Hiển thị popup xác nhận.", 'success');
        
        console.log("🎉 Showing swap confirmation popup");
        // Show confirmation popup
        setShowSwapConfirmation(true);
      } else {
        console.log("❌ API Error:", response.message);
        log(`Lỗi start-swap: ${response.message}`, 'error');
        
        // Show error alert
        await Swal.fire({
          title: "Không thể bắt đầu swap",
          text: response.message || "Không thể bắt đầu quá trình đổi pin",
          icon: "error",
          confirmButtonText: "Đóng",
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      console.log("💥 API Exception:", error);
      
      // Parse error message if it's a response error
      let errorMessage = "Lỗi kết nối. Vui lòng thử lại sau.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Try to parse JSON error response
      try {
        const errorText = String(error);
        if (errorText.includes("No available batteries")) {
          errorMessage = "Không có pin khả dụng phù hợp tại trạm này";
        }
      } catch (e) {
        // Keep default error message
      }
      
      log(`Lỗi kết nối API start-swap: ${errorMessage}`, 'error');
      
      // Show error alert
      await Swal.fire({
        title: "Lỗi kết nối",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Start swap process
  const startSwap = async () => {
    if (!sessionToken) {
      log("Không có session token để bắt đầu swap", 'error');
      return;
    }

    setIsProcessing(true);
    log("Đang gọi API start-swap...", 'info');

    try {
      const response = await stationsApiService.startSwap(sessionToken, selectedVehicle ? selectedVehicle.id : "");
      
      if (response.statusCode === 201 && response.data) {
        setSwapOrderId(response.data.swap_order_id);
        setEmptySlotForOldBattery(response.data.empty_slot_for_old_battery);
        setNewBatteryInfo(response.data.new_battery);
        
        log(`Swap order ID: ${response.data.swap_order_id}`, 'success');
        log(`Slot trống cho pin cũ: #${response.data.empty_slot_for_old_battery}`, 'info');
        log(`Pin mới: ${response.data.new_battery.serial_number} tại slot #${response.data.new_battery.slot_number}`, 'info');
        log(response.data.next_action, 'info');
        log("Swap đã được xác nhận! Hiển thị popup xác nhận.", 'success');
        
        // Show confirmation popup
        setShowSwapConfirmation(true);
      } else {
        log(`Lỗi start-swap: ${response.message}`, 'error');
        
        // Show error alert
        await Swal.fire({
          title: "Không thể bắt đầu swap",
          text: response.message || "Không thể bắt đầu quá trình đổi pin",
          icon: "error",
          confirmButtonText: "Đóng",
          confirmButtonColor: "#ef4444"
        });
      }
    } catch (error) {
      log(`Lỗi kết nối API start-swap: ${error}`, 'error');
      
      // Show error alert
      await Swal.fire({
        title: "Lỗi kết nối",
        text: "Lỗi kết nối. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "Thử lại",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle swap confirmation popup
  const handleSwapConfirmationClose = () => {
    setShowSwapConfirmation(false);
    log("Popup xác nhận swap đã được đóng", 'info');
  };

  const handleSwapConfirmationConfirm = () => {
    setShowSwapConfirmation(false);
    log("Swap đã được xác nhận! Bây giờ bạn có thể chọn pin để đổi.", 'success');
    
    // Open the empty slot that was assigned by the API
    if (emptySlotForOldBattery) {
      openAssignedEmptySlot(emptySlotForOldBattery);
    }
  };

  // Open assigned empty slot cover (after confirm swap)
  const openAssignedEmptySlot = (slotId: number) => {
    console.log("🔓 openAssignedEmptySlot called for slot:", slotId);
    
    const targetSlot = slots.find(slot => slot.id === slotId);
    console.log("🔍 Target slot found:", targetSlot);
    
    if (!targetSlot) {
      log(`Không tìm thấy slot #${slotId}`, 'error');
      return;
    }

    if (targetSlot.hasPin) {
      log(`Slot #${slotId} không trống`, 'error');
      return;
    }

    setTargetEmptySlotId(slotId);
    setSlots(prev => {
      const updated = prev.map(slot => 
        slot.id === slotId ? { ...slot, isCoverOpen: true } : slot
      );
      console.log("✅ Slots updated, slot", slotId, "should now have isCoverOpen: true");
      console.log("Updated slot:", updated.find(s => s.id === slotId));
      return updated;
    });
    setCurrentStep(2);
    log(`Bước 2: Đã mở nắp slot trống #${slotId}`, 'success');
    log("Bây giờ bạn có thể kéo pin vào slot này!", 'info');
    
    console.log("🎯 Current state after opening slot:", {
      targetEmptySlotId: slotId,
      currentStep: 2,
      emptySlotForOldBattery,
      swapOrderId: swapOrderId?.slice(0, 8)
    });
  };

  // Bước 4: Mở nắp slot pin mới
  const openNewSlotCover = () => {
    if (!newBatteryInfo) {
      log("Không có thông tin pin mới từ API start-swap", 'error');
      return;
    }

    const targetSlot = slots.find(slot => slot.id === newBatteryInfo.slot_number);
    if (!targetSlot) {
      log(`Không tìm thấy slot #${newBatteryInfo.slot_number}`, 'error');
      return;
    }

    setTargetNewSlotId(newBatteryInfo.slot_number);
    setSlots(prev => prev.map(slot => 
      slot.id === newBatteryInfo.slot_number ? { ...slot, isCoverOpen: true } : slot
    ));
    setCurrentStep(4);
    log(`Bước 4: Đã mở nắp slot pin mới #${newBatteryInfo.slot_number}`, 'success');
    log(`Pin mới: ${newBatteryInfo.serial_number} (${newBatteryInfo.capacity_kwh}kWh, SOH: ${newBatteryInfo.soh}%)`, 'info');
  };

  // Bước 5: Lấy pin mới ra khỏi slot (drag from slot)
  const takeNewBattery = () => {
    if (!targetNewSlotId) return;
    
    setNewPinTaken(true);
    setCurrentStep(5);
    log(`Bước 5: Đã lấy pin mới từ slot #${targetNewSlotId}`, 'success');
    log("Bây giờ hãy đóng nắp slot!", 'info');
  };

  // Handle drag from slot to new battery area
  const handleTakeNewBatteryDrag = async (fromSlotId: number) => {
    console.log("🎯 handleTakeNewBatteryDrag:", { fromSlotId, targetNewSlotId, swapOrderId });
    
    if (currentStep !== 4) {
      console.log("❌ Not in step 4");
      await Swal.fire({
        title: "Chưa đến bước này!",
        text: "Vui lòng hoàn thành các bước trước.",
        icon: "warning",
        timer: 2000,
        toast: true,
        position: "top-end"
      });
      return;
    }
    
    if (fromSlotId !== targetNewSlotId) {
      console.log("❌ Wrong slot");
      await Swal.fire({
        title: "Sai slot!",
        text: `Vui lòng lấy pin từ slot #${targetNewSlotId}`,
        icon: "warning",
        timer: 2000,
        toast: true,
        position: "top-end"
      });
      return;
    }

    if (!swapOrderId) {
      console.log("❌ No swap order ID");
      await Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy swap order ID. Vui lòng thử lại.",
        icon: "error",
        timer: 2000,
        toast: true,
        position: "top-end"
      });
      return;
    }

    if (!sessionToken) {
      console.log("❌ No session token");
      await Swal.fire({
        title: "Lỗi!",
        text: "Không tìm thấy session token. Vui lòng đăng nhập lại.",
        icon: "error",
        timer: 2000,
        toast: true,
        position: "top-end"
      });
      return;
    }

    console.log("✅ All checks passed, recording new battery out...");
    
    try {
      // Call API to record new battery out
      const response = await stationsApiService.recordNewBatteryOut(sessionToken, {
        swap_order_id: swapOrderId,
        message: "Lấy pin mới thành công",
        slot_number: fromSlotId,
        old_battery_id: selectedUserBattery?.id || "",
      });

      if (!response.success) {
        console.log("❌ API Error:", response.error);
        await Swal.fire({
          title: "Lỗi API!",
          text: response.error || "Không thể ghi nhận lấy pin mới.",
          icon: "error",
          timer: 3000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      console.log("✅ API Success:", response.data);
      
      // Update slot: Remove battery from slot (make it empty)
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === fromSlotId
            ? {
                ...slot,
                hasPin: false,
                pinId: null,
                pinStatus: "available" as const,
                isCoverOpen: true, // Keep cover open for user to close
              }
            : slot
        )
      );
      
      // Update state: mark new battery as taken
      setNewPinTaken(true);
      setCurrentStep(5);
      log(`Bước 5: Đã lấy pin mới từ slot #${targetNewSlotId}`, 'success');
      log("Bây giờ hãy đóng nắp slot!", 'info');
      
      // Show success notification
      await Swal.fire({
        title: "Thành công!",
        text: `Đã lấy pin mới từ slot #${fromSlotId}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
    } catch (error) {
      console.log("💥 Exception:", error);
      await Swal.fire({
        title: "Lỗi!",
        text: "Đã xảy ra lỗi khi ghi nhận lấy pin. Vui lòng thử lại.",
        icon: "error",
        timer: 3000,
        toast: true,
        position: "top-end"
      });
    }
  };

  // Bước 6: Đóng nắp slot pin mới
  const closeNewSlotCover = async () => {
    if (!targetNewSlotId) return;

    setSlots(prev => prev.map(slot => 
      slot.id === targetNewSlotId ? { ...slot, isCoverOpen: false } : slot
    ));
    setCurrentStep(6);
    log(`Bước 6: Đã đóng nắp slot pin mới #${targetNewSlotId}`, 'success');
    
    // Show swap success notification
    await Swal.fire({
      title: "🎉 Đổi pin thành công!",
      html: `
        <div class="text-center">
          <p class="text-lg mb-2">Giao dịch hoàn tất</p>
          <p class="text-sm text-gray-600">Pin cũ: ${selectedUserBattery?.serial_number || 'N/A'}</p>
          <p class="text-sm text-gray-600">Pin mới: ${newBatteryInfo?.serial_number || 'N/A'}</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Hoàn tất",
      confirmButtonColor: "#10b981",
      allowOutsideClick: false,
    });
    
    // Complete transaction
    setCurrentStep(7);
    log("🎉 Hoàn tất luồng đổi pin!", 'success');
    
    // Reset flow after delay
    setTimeout(() => resetFlow(), 2000);
  };

  // Handle cover toggle
  const handleCoverToggle = (slotId: number) => {
    console.log("🔧 handleCoverToggle called:", { slotId, currentStep, targetEmptySlotId, targetNewSlotId, oldPinInserted, newPinTaken });
    
    // Bước 2: User đã thả pin vào slot trống, giờ đóng nắp
    if (currentStep === 2 && slotId === targetEmptySlotId && oldPinInserted) {
      closeEmptySlotCover();
    } 
    // Bước 5: User đã lấy pin mới, giờ đóng nắp
    else if (currentStep === 5 && slotId === targetNewSlotId && newPinTaken) {
      closeNewSlotCover();
    }
    else {
      console.log("⚠️ Cover toggle ignored - wrong step or slot");
    }
  };

  // Handle pin drop into slot
  // Handle pin drop into slot - SIMPLIFIED VERSION
  const handleDrop = useCallback(
    async (pinId: string, slotId: number) => {
      console.log("🎯 handleDrop called:", { pinId, slotId });
      
      // Check if we have a selected battery
      if (!selectedUserBattery) {
        console.log("❌ No battery selected");
        await Swal.fire({
          title: "Chưa chọn pin!",
          text: "Vui lòng chọn pin trước khi kéo thả.",
          icon: "warning",
          timer: 2000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      // Check if the dropped pin matches selected battery
      if (pinId !== selectedUserBattery.id) {
        console.log("❌ Wrong pin dropped");
        await Swal.fire({
          title: "Sai pin!",
          text: "Chỉ có thể kéo pin đã chọn.",
          icon: "warning",
          timer: 2000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      // Check if slot is empty
      const targetSlot = slots.find(slot => slot.id === slotId);
      if (!targetSlot) {
        console.log("❌ Slot not found");
        return;
      }

      if (targetSlot.hasPin) {
        console.log("❌ Slot already has pin");
        await Swal.fire({
          title: "Slot đã có pin!",
          text: `Slot #${slotId} không trống.`,
          icon: "warning",
          timer: 2000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      // Check if we have swap order ID
      if (!swapOrderId) {
        console.log("❌ No swap order ID");
        await Swal.fire({
          title: "Lỗi!",
          text: "Không tìm thấy swap order ID. Vui lòng thử lại.",
          icon: "error",
          timer: 2000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      // Check if we have session token
      if (!sessionToken) {
        console.log("❌ No session token");
        await Swal.fire({
          title: "Lỗi!",
          text: "Không tìm thấy session token. Vui lòng đăng nhập lại.",
          icon: "error",
          timer: 2000,
          toast: true,
          position: "top-end"
        });
        return;
      }

      console.log("✅ All checks passed, recording old battery in...");
      
      try {
        // Call API to record old battery in
        const response = await stationsApiService.recordOldBatteryIn(sessionToken, {
          swap_order_id: swapOrderId,
          message: "Battery inserted successfully",
          slot_number: slotId,
          old_battery_id: selectedUserBattery.id,
        });

        if (!response.success) {
          console.log("❌ API Error:", response.error);
          await Swal.fire({
            title: "Lỗi API!",
            text: response.error || "Không thể ghi nhận pin cũ vào slot.",
            icon: "error",
            timer: 3000,
            toast: true,
            position: "top-end"
          });
          return;
        }

        console.log("✅ API Success:", response.data);
        
        // Update slot to contain user's pin
        setSlots((prev) =>
          prev.map((slot) =>
            slot.id === slotId
              ? {
                  ...slot,
                  hasPin: true,
                  pinId: selectedUserBattery.id,
                  pinStatus: "stored" as const,
                }
              : slot
          )
        );

        // Hide the draggable pin item
        setOldPinInserted(true);
        
        console.log("🎉 Pin inserted successfully into slot", slotId);
        log(`Pin ${selectedUserBattery.name} đã được ghi nhận vào slot #${slotId}`, 'success');
        
        // Show success notification
        await Swal.fire({
          title: "Thành công!",
          text: `Pin ${selectedUserBattery.name} đã được đặt vào slot #${slotId}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end"
        });
      } catch (error) {
        console.log("💥 Exception:", error);
        await Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi ghi nhận pin. Vui lòng thử lại.",
          icon: "error",
          timer: 3000,
          toast: true,
          position: "top-end"
        });
      }
    },
    [selectedUserBattery, slots, swapOrderId, sessionToken, log]
  );

  // Action handlers for QR flow
  const handleOpenEmptySlot = async () => {
    setIsProcessing(true);
    
    try {
      const emptySlot = slots.find((s) => !s.hasPin && !s.isReserved);
        if (!emptySlot) {
        log("Không có ngăn trống để nhận pin cũ.", 'error');
          return;
        }

      const response = await kioskService.openEmptySlot(emptySlot.id);
      
      if (response.success) {
        setSlots(prev => prev.map(slot => 
          slot.id === emptySlot.id ? { ...slot, isOpen: true } : slot
        ));
        
        setTransaction(prev => prev ? { ...prev, emptySlotId: emptySlot.id } : null);
        setCurrentState(KioskActionState.OPEN_EMPTY_SLOT);
        log(`Đã mở ngăn trống để nhận pin cũ: #${emptySlot.id}`, 'success');
      } else {
        log(`Lỗi mở ngăn: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseEmptySlot = async (slotId: number) => {
    setIsProcessing(true);
    
    try {
      const response = await kioskService.closeEmptySlot(slotId);
      
      if (response.success) {
        setSlots(prev => prev.map(slot => 
          slot.id === slotId ? { ...slot, isOpen: false } : slot
        ));
        
        setCurrentState(KioskActionState.CLOSE_EMPTY_SLOT);
        log(`Đã đóng ngăn #${slotId}`, 'success');
        
        // Auto advance to open require slot
        setTimeout(async () => {
          await handleOpenRequireSlot();
        }, 1000);
      } else {
        log(`Lỗi đóng ngăn: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenRequireSlot = async () => {
    setIsProcessing(true);
    
    try {
      const availableSlot = slots.find(s => s.hasPin && s.pinStatus === "available");
        if (!availableSlot) {
        log("Không có pin khả dụng để phát.", 'error');
          return;
        }

      const response = await kioskService.openRequireSlot(availableSlot.id);
      
      if (response.success) {
        setSlots(prev => prev.map(slot => 
          slot.id === availableSlot.id ? { ...slot, isOpen: true } : slot
        ));
        
        setTransaction(prev => prev ? { ...prev, newSlotId: availableSlot.id } : null);
        setCurrentState(KioskActionState.OPEN_REQUIRE_SLOT);
        log(`Đã mở ngăn pin mới: #${availableSlot.id}`, 'success');
      } else {
        log(`Lỗi mở ngăn pin mới: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTakeNewBattery = async () => {
    if (!transaction?.newSlotId) {
      log("Chưa chọn ngăn pin mới.", 'warning');
          return;
        }

    setIsProcessing(true);
    
    try {
      const response = await kioskService.takeNewBattery(transaction.newSlotId);
      
      if (response.success) {
        setSlots(prev => prev.map(slot => 
          slot.id === transaction.newSlotId 
            ? { ...slot, hasPin: false, pinId: null, pinStatus: 'available' as const, isOpen: false }
              : slot
        ));
        
        setCurrentState(KioskActionState.NEW_BATTERY_OUT);
        log(`User đã lấy pin mới từ ngăn #${transaction.newSlotId}`, 'success');
        
        // Auto advance to close require slot
        setTimeout(async () => {
          if (transaction.newSlotId) {
            await handleCloseRequireSlot(transaction.newSlotId);
          }
        }, 1000);
      } else {
        log(`Lỗi lấy pin mới: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseRequireSlot = async (slotId: number) => {
    setIsProcessing(true);
    
    try {
      const response = await kioskService.closeRequireSlot(slotId);
      
      if (response.success) {
        setSlots(prev => prev.map(slot => 
          slot.id === slotId ? { ...slot, isOpen: false } : slot
        ));
        
        setCurrentState(KioskActionState.CLOSE_REQUIRE_SLOT);
        log(`Đã đóng ngăn pin mới #${slotId}`, 'success');
        
        // Auto complete transaction
        setTimeout(async () => {
          await handleCompleteTransaction();
        }, 1000);
      } else {
        log(`Lỗi đóng ngăn pin mới: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteTransaction = async () => {
    if (!transaction) {
      log("Không có giao dịch để hoàn tất.", 'warning');
          return;
        }

    setIsProcessing(true);
    
    try {
      const response = await kioskService.completeTransaction(transaction.id);
      
      if (response.success) {
        setCurrentState(KioskActionState.COMPLETED);
        log("🎉 Đổi pin thành công! Giao dịch hoàn tất.", 'success');
        
        // Reset after delay
        setTimeout(() => resetFlow(), 2000);
      } else {
        log(`Lỗi hoàn tất giao dịch: ${response.error}`, 'error');
      }
    } catch (error) {
      log(`Lỗi kết nối API: ${error}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* User Pin Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pin của bạn</h3>
              <p className="text-sm text-gray-600">
                {!isLoggedIn 
                  ? "Vui lòng đăng nhập trước"
                  : !selectedVehicle
                    ? "Vui lòng chọn phương tiện"
                    : !selectedUserBattery 
                      ? "Chọn pin để đổi"
                      : swapOrderId 
                        ? "Swap đã xác nhận - sẵn sàng kéo thả"
                        : "Đang xác nhận swap..."
                }
              </p>
            </div>

            {/* Login Required Message */}
            {!isLoggedIn && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">Cần đăng nhập</h4>
                <p className="text-gray-500 mb-6">
                  Vui lòng quét QR code để đăng nhập trước khi chọn pin
                </p>
                <button
                  onClick={startWaitingForMobileQR}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isProcessing ? "Đang xử lý..." : "Quét QR để đăng nhập"}
                </button>
              </div>
            )}

            {/* Vehicle Info Display */}
            {isLoggedIn && selectedVehicle && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm flex items-center">
                    <span className="mr-2">🚗</span>
                    Phương tiện đã chọn
                  </h4>
                  <button
                    onClick={() => setShowVehicleSelection(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Đổi xe
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên xe:</span>
                    <span className="font-medium">{selectedVehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biển số:</span>
                    <div className="bg-yellow-400 text-black px-2 py-0.5 rounded font-mono font-bold text-xs">
                      {selectedVehicle.plate_number}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{selectedVehicle.vehicle_model.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại pin:</span>
                    <span className="font-medium text-right max-w-[150px] break-words">{selectedVehicle.battery_type.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Năm SX:</span>
                    <span className="font-medium">{selectedVehicle.manufacturer_year}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Free Batteries Loading */}
            {isLoggedIn && freeBatteriesLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">Đang tải pin...</span>
              </div>
            )}

            {/* Vehicle Selection Required */}
            {isLoggedIn && !selectedVehicle && !freeBatteriesLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">Chọn phương tiện</h4>
                <p className="text-gray-500 mb-6">
                  Vui lòng chọn phương tiện trước khi đổi pin
                </p>
                <button
                  onClick={() => setShowVehicleSelection(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Chọn phương tiện
                </button>
              </div>
            )}

            {/* Free Batteries Error */}
            {isLoggedIn && freeBatteriesError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{freeBatteriesError}</p>
              </div>
            )}

            {/* Free Batteries List - Only show when no battery selected and vehicle is selected */}
            {isLoggedIn && selectedVehicle && !selectedUserBattery && !freeBatteriesLoading && !freeBatteriesError && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {freeBatteries.map((battery) => (
                  <div
                    key={battery.id}
                    onClick={() => setSelectedUserBattery(battery)}
                    className="p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {battery.name.split(' - ')[0]}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        battery.status === 'available' ? 'bg-green-100 text-green-800' :
                        battery.status === 'charging' ? 'bg-blue-100 text-blue-800' :
                        battery.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {battery.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Serial:</span>
                        <p className="font-mono">{battery.serial_number}</p>
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>
                        <p>{battery.capacity_kwh} kWh</p>
                      </div>
                      <div>
                        <span className="font-medium">SOH:</span>
                        <p>{battery.soh}%</p>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>
                        <p>{battery.name.split(' - ')[0].split(' ')[1]}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {freeBatteries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không có pin free nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Battery Display - Show when battery is selected */}
            {isLoggedIn && selectedUserBattery && !oldPinInserted && (
              <div className="mt-6">
                {/* Battery Info Card */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Pin đã chọn</h4>
                    <button
                      onClick={() => setSelectedUserBattery(null)}
                      className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Chọn lại
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedUserBattery.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial:</span>
                      <span className="font-mono">{selectedUserBattery.serial_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span>{selectedUserBattery.capacity_kwh} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SOH:</span>
                      <span>{selectedUserBattery.soh}%</span>
                    </div>
                  </div>
                </div>

                {/* Draggable Battery Component */}
                <div className="text-center">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Kéo pin này vào slot trống</h5>
                  <div className="flex justify-center">
            <PinItem
                      id={selectedUserBattery.id}
                      status={selectedUserBattery.status === "in_use" ? "in_use" : selectedUserBattery.status as any}
                      isDraggable={currentStep === 2 && swapOrderId !== null}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {currentStep === 2 && swapOrderId ? "Pin có thể kéo thả" : 
                     currentStep === 2 ? "Đang xác nhận swap..." : "Chờ mở slot trống"}
                  </p>
                  {/* Debug info */}
                  <div className="mt-2 text-xs text-gray-400">
                    Status: {selectedUserBattery.status} | Step: {currentStep} | Draggable: {currentStep === 2 ? "Yes" : "No"} | Target: {targetEmptySlotId || "None"}
                    {swapOrderId && <div>Swap ID: {swapOrderId.slice(0, 8)}...</div>}
                    {newBatteryInfo && <div>New Battery: Slot #{newBatteryInfo.slot_number}</div>}
                  </div>
                </div>
              </div>
            )}

            {/* Battery Already Inserted Message */}
            {isLoggedIn && selectedUserBattery && oldPinInserted && !newPinTaken && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h4 className="font-semibold text-green-800 mb-2">Pin đã được bỏ vào slot</h4>
                  <p className="text-sm text-green-600 mb-2">
                    Pin {selectedUserBattery.name} đã được đặt vào slot #{targetEmptySlotId}
                  </p>
                  <p className="text-xs text-green-600">
                    Vui lòng đóng nắp slot để tiếp tục
                  </p>
                </div>
              </div>
            )}

            {/* New Battery Drop Zone - Step 4 */}
            {isLoggedIn && currentStep === 4 && newBatteryInfo && !newPinTaken && targetNewSlotId && (
              <NewBatteryDropZone
                onDrop={handleTakeNewBatteryDrag}
                batteryInfo={{
                  serial_number: newBatteryInfo.serial_number,
                  capacity_kwh: newBatteryInfo.capacity_kwh,
                  soh: newBatteryInfo.soh,
                  slot_number: newBatteryInfo.slot_number,
                }}
                targetSlotId={targetNewSlotId}
              />
            )}

            {/* New Battery Taken Success */}
            {isLoggedIn && newPinTaken && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-2">Đã lấy pin mới!</h4>
                  <p className="text-sm text-purple-600 mb-2">
                    Pin {newBatteryInfo?.serial_number} đã được lấy
                  </p>
                  <p className="text-xs text-purple-600">
                    Vui lòng đóng nắp slot #{targetNewSlotId}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isLoggedIn && (
              <div className="mt-8 space-y-4">
                {/* Step Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Luồng đổi pin</h4>
                  <div className="text-xs text-gray-600 mb-2">
                    Bước {currentStep + 1}/7: {stepDescriptions[currentStep] || "Hoàn tất"}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {currentStep === 0 && !waitingForMobileQR && (
                  <button
                    onClick={startWaitingForMobileQR}
                    disabled={isProcessing || !selectedUserBattery}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? "Đang xử lý..." : selectedUserBattery ? "Bắt đầu đổi pin" : "Vui lòng chọn pin"}
                  </button>
                )}

                {currentStep === 2 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      {swapOrderId ? 
                        `Pin đã sẵn sàng để kéo thả vào slot #${emptySlotForOldBattery}` :
                        "Đang xác nhận swap với hệ thống..."
                      }
                    </p>
                    <div className={`w-full border rounded-xl p-4 ${
                      swapOrderId ? 
                        'bg-gradient-to-r from-green-100 to-blue-100 border-green-300' :
                        'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
                    }`}>
                      <p className={`text-sm font-medium ${
                        swapOrderId ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {swapOrderId ? '✅ Swap đã được xác nhận' : '⏳ Đang xác nhận swap...'}
                      </p>
                      {swapOrderId && newBatteryInfo && (
                        <div className="mt-2 text-xs text-green-700">
                          <p>Pin mới: {newBatteryInfo.serial_number}</p>
                          <p>Slot: #{newBatteryInfo.slot_number} | SOH: {newBatteryInfo.soh}%</p>
                        </div>
                      )}
                      {swapOrderId && emptySlotForOldBattery && (
                        <div className="mt-2 text-xs text-blue-700">
                          <p>Slot trống đã mở: #{emptySlotForOldBattery}</p>
                          <p>Kéo pin vào slot này để tiếp tục</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && !oldPinInserted && (
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600">📦</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-sm mb-1">Kéo pin vào slot #{emptySlotForOldBattery}</h4>
                    <p className="text-xs text-yellow-600">Thả pin vào slot trống đang mở</p>
                  </div>
                )}

                {currentStep === 2 && oldPinInserted && (
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <span className="text-orange-600">🔒</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-sm mb-1">Đóng nắp slot #{targetEmptySlotId}</h4>
                    <p className="text-xs text-orange-600">Click nút &ldquo;🔒 Đóng nắp&rdquo; trên slot</p>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600">⏳</span>
                    </div>
                    <h4 className="font-semibold text-blue-800 text-sm mb-1">Đang chuẩn bị pin mới</h4>
                    <p className="text-xs text-blue-600">Hệ thống đang mở slot pin mới...</p>
                  </div>
                )}

                {currentStep === 4 && !newPinTaken && (
                  <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <span className="text-teal-600">🎁</span>
                    </div>
                    <h4 className="font-semibold text-teal-800 text-sm mb-1">Lấy pin mới từ slot #{newBatteryInfo?.slot_number}</h4>
                    <p className="text-xs text-teal-600">Click nút &ldquo;👋 Lấy pin&rdquo; trên slot</p>
                    {newBatteryInfo && (
                      <div className="mt-2 text-xs text-teal-700">
                        <p>Pin: {newBatteryInfo.serial_number}</p>
                        <p>Dung lượng: {newBatteryInfo.capacity_kwh} kWh | SOH: {newBatteryInfo.soh}%</p>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <span className="text-purple-600">🔒</span>
                    </div>
                    <h4 className="font-semibold text-purple-800 text-sm mb-1">Đóng nắp slot #{targetNewSlotId}</h4>
                    <p className="text-xs text-purple-600">Click nút &ldquo;🔒 Đóng nắp&rdquo; để hoàn tất</p>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="text-center p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-xl">✅</span>
                    </div>
                    <h4 className="font-semibold text-green-800 text-base mb-2">Hoàn tất!</h4>
                    <p className="text-sm text-green-600">Giao dịch thành công</p>
                  </div>
                )}
              </div>
            )}

            {/* Transaction Status */}
            {transaction && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Giao dịch</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono">{transaction.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-semibold text-blue-600">{currentState}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Session Token Status */}
            {/* {sessionToken && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Session Token</h4>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs font-mono text-green-600 break-all">
                    {sessionToken.slice(0, 50)}...
                  </p>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Kiosk Grid Section */}
        <div className="lg:col-span-6">
          <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${!isLoggedIn ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kiosk Đổi Pin</h3>
              <p className="text-sm text-gray-600">
                {isLoggedIn ? "Ma trận ngăn chứa pin" : "Vui lòng đăng nhập để sử dụng"}
              </p>
              
              {/* Battery Loading State */}
              {batteriesLoading && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Đang tải thông tin pin...</span>
                </div>
              )}
              
              {/* Battery Error State */}
              {batteriesError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{batteriesError}</p>
                </div>
              )}
              
              {/* Battery Summary */}
              {!batteriesLoading && !batteriesError && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <span className="text-green-600 font-semibold">Available: </span>
                    <span className="text-green-800">{batteries.filter(b => b.status === 'available').length}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <span className="text-blue-600 font-semibold">Charging: </span>
                    <span className="text-blue-800">{batteries.filter(b => b.status === 'charging').length}</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <span className="text-yellow-600 font-semibold">Maintenance: </span>
                    <span className="text-yellow-800">{batteries.filter(b => b.status === 'maintenance').length}</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <span className="text-red-600 font-semibold">Damaged: </span>
                    <span className="text-red-800">{batteries.filter(b => b.status === 'damaged').length}</span>
                  </div>
            </div>
          )}
        </div>

            <div className="grid grid-cols-5 gap-4">
              {slots.map((slot) => {
                const battery = batteries.find(b => b.station_kiosk_slot === slot.id);
                // If slot has user's pin, get battery info from selectedUserBattery
                const slotBatteryInfo = slot.hasPin && slot.pinId === selectedUserBattery?.id 
                  ? selectedUserBattery 
                  : battery;
                
                return (
            <SlotBox
              key={slot.id}
              id={slot.id}
              hasPin={slot.hasPin}
              onDrop={handleDrop}
                    isActive={slot.isOpen}
              pinId={slot.pinId}
              pinStatus={slot.pinStatus}
                    isReserved={slot.isReserved}
                    isCoverOpen={slot.isCoverOpen}
                    onCoverToggle={handleCoverToggle}
                    onTakeBattery={takeNewBattery}
                    currentStep={currentStep}
                    batteryInfo={slotBatteryInfo ? {
                      name: slotBatteryInfo.name,
                      serial_number: slotBatteryInfo.serial_number,
                      capacity_kwh: slotBatteryInfo.capacity_kwh,
                      soh: slotBatteryInfo.soh,
                    } : undefined}
                  />
                );
              })}
            </div>

            {/* Slot Legend */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-400 rounded"></div>
                <span className="text-gray-600">Stored</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded"></div>
                <span className="text-gray-600">In Use</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-50 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Empty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Station Info Section */}
        <div className="lg:col-span-3">
          <StationInfo station={station} />
        </div>
      </div>

      {/* QR Code Popup */}
      <QRCodePopup
        isOpen={showQRPopup}
        onClose={handleCloseQRPopup}
        qrData={qrData}
        expiresAt={qrExpiresAt}
        sessionId={qrSessionId}
        onSessionSuccess={handleSessionSuccess}
      />

      {/* Vehicle Selection Popup */}
      <VehicleSelectionPopup
        isOpen={showVehicleSelection}
        onClose={handleVehicleSelectionClose}
        onVehicleSelect={handleVehicleSelect}
        sessionToken={sessionToken}
      />

      {/* Swap Confirmation Popup */}
      {swapOrderId && selectedUserBattery && newBatteryInfo && (
        <SwapConfirmationPopup
          isOpen={showSwapConfirmation}
          onClose={handleSwapConfirmationClose}
          onConfirm={handleSwapConfirmationConfirm}
          swapOrderId={swapOrderId}
          selectedUserBattery={selectedUserBattery}
          newBatteryInfo={newBatteryInfo}
          sessionToken={sessionToken}
          selectedVehicle={selectedVehicle!}
          setSwapOrderId={setSwapOrderId}
        />
      )}
    </DndProvider>
  );
}
