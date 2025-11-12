"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PinItem from "./PinItem";
import SlotBox from "./SlotBox";
import StationInfo from "./StationInfo";

import QRCodePopup from "./QRCodePopup";
import SwapConfirmationPopup from "./SwapConfirmationPopup";
import { stationsApiService } from "@/services/stations.service";
import { KioskActionState, KioskSlot, KioskTransaction } from "@/types/kiosk.type";
import { Station } from "@/types/station.type";
import { Battery } from "@/types/battery.type";
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

  // Load free batteries for user pin section
  useEffect(() => {
    const loadFreeBatteries = async () => {
      setFreeBatteriesLoading(true);
      setFreeBatteriesError(null);

      try {
        const response = await stationsApiService.getFreeBatteries();
        
        if (response.success && response.data) {
          setFreeBatteries(response.data.batteries);
          log(`Đã tải ${response.data.batteries.length} pin free`, 'success');
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
  }, [log]);

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
    setCurrentStep(2); // Move to step 2: Ready to drag battery
    log(`Session thành công! Token: ${token.slice(0, 20)}...`, 'success');
    log("Đã đăng nhập thành công! Đang xác nhận swap...", 'success');
    
    // Call start-swap API immediately after login with the token
    console.log("🔄 About to call startSwapWithToken...");
    await startSwapWithToken(token);
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

  // Bước 2: Đóng nắp slot sau khi bỏ pin
  const closeEmptySlotCover = () => {
    if (!targetEmptySlotId) return;

    setSlots(prev => prev.map(slot => 
      slot.id === targetEmptySlotId ? { ...slot, isCoverOpen: false } : slot
    ));
    setCurrentStep(3);
    log(`Bước 3: Đã đóng nắp slot #${targetEmptySlotId}`, 'success');
    
    // Auto advance to step 4
    setTimeout(() => {
      startSwap();
    }, 1000);
  };

  // Start swap process with token parameter
  const startSwapWithToken = async (token: string) => {
    console.log("🚀 Starting startSwapWithToken with token:", token.slice(0, 20) + "...");
    setIsProcessing(true);
    log("Đang gọi API start-swap...", 'info');

    try {
      console.log("📡 Calling stationsApiService.startSwap...");
      const response = await stationsApiService.startSwap(token);
      console.log("✅ API Response:", response);
      
      if (response.statusCode === 201) {
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
      }
    } catch (error) {
      console.log("💥 API Exception:", error);
      log(`Lỗi kết nối API start-swap: ${error}`, 'error');
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
      const response = await stationsApiService.startSwap(sessionToken);
      
      if (response.statusCode === 201) {
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
      }
    } catch (error) {
      log(`Lỗi kết nối API start-swap: ${error}`, 'error');
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
    const targetSlot = slots.find(slot => slot.id === slotId);
    if (!targetSlot) {
      log(`Không tìm thấy slot #${slotId}`, 'error');
      return;
    }

    if (targetSlot.hasPin) {
      log(`Slot #${slotId} không trống`, 'error');
      return;
    }

    setTargetEmptySlotId(slotId);
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, isCoverOpen: true } : slot
    ));
    setCurrentStep(2);
    log(`Bước 2: Đã mở nắp slot trống #${slotId}`, 'success');
    log("Bây giờ bạn có thể kéo pin vào slot này!", 'info');
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

  // Bước 6: Đóng nắp slot pin mới
  const closeNewSlotCover = () => {
    if (!targetNewSlotId) return;

    setSlots(prev => prev.map(slot => 
      slot.id === targetNewSlotId ? { ...slot, isCoverOpen: false } : slot
    ));
    setCurrentStep(6);
    log(`Bước 6: Đã đóng nắp slot pin mới #${targetNewSlotId}`, 'success');
    
    // Complete transaction
    setTimeout(() => {
      setCurrentStep(7);
      log("🎉 Hoàn tất luồng đổi pin!", 'success');
      setTimeout(() => resetFlow(), 2000);
    }, 1000);
  };

  // Handle cover toggle
  const handleCoverToggle = (slotId: number) => {
    if (currentStep === 2 && slotId === targetEmptySlotId) {
      // User đóng nắp slot trống
      closeEmptySlotCover();
    } else if (currentStep === 5 && slotId === targetNewSlotId) {
      // User đóng nắp slot pin mới
      closeNewSlotCover();
    }
  };

  // Handle pin drop into slot
  const handleDrop = useCallback(
    async (pinId: string, slotId: number) => {
      // Check if the dropped pin is the selected user battery
      if (!selectedUserBattery || pinId !== selectedUserBattery.id) {
        log("Chỉ có thể kéo pin đã chọn vào kiosk.", 'warning');
        return;
      }

      if (currentStep !== 2) {
        log("Pin chưa sẵn sàng để kéo thả.", 'warning');
        return;
      }

      // Check if swap info is available
      if (!swapOrderId || !emptySlotForOldBattery) {
        log("Chưa có thông tin swap. Vui lòng đợi hệ thống xác nhận.", 'warning');
        return;
      }

      // Check if dropping into the correct empty slot
      if (slotId !== emptySlotForOldBattery) {
        log(`Vui lòng bỏ pin vào slot #${emptySlotForOldBattery} được chỉ định.`, 'warning');
        return;
      }

      // Find the empty slot and check if it's open
      const emptySlot = slots.find(slot => slot.id === emptySlotForOldBattery);
      if (!emptySlot || emptySlot.hasPin) {
        log(`Slot #${emptySlotForOldBattery} không trống hoặc không tồn tại.`, 'warning');
        return;
      }

      if (!emptySlot.isCoverOpen) {
        log(`Slot #${emptySlotForOldBattery} chưa được mở. Vui lòng đợi hệ thống mở slot.`, 'warning');
        return;
      }

      // Set target empty slot
      setTargetEmptySlotId(slotId);
      
      // Update slot to contain user's old pin (slot is already open)
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                hasPin: true,
                pinId: selectedUserBattery.id,
                pinStatus: "stored" as const,
                // Keep isCoverOpen as true (already opened by confirm)
              }
            : slot
        )
      );

      setOldPinInserted(true);
      setCurrentStep(3);
      log(`Bước 3: Pin ${selectedUserBattery.name} đã được bỏ vào slot #${slotId}`, 'success');
      log("Slot đã mở sẵn! Bây giờ hãy đóng nắp slot!", 'info');
    },
    [currentStep, selectedUserBattery, slots, log, swapOrderId, emptySlotForOldBattery]
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

            {/* Free Batteries Loading */}
            {isLoggedIn && freeBatteriesLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">Đang tải pin...</span>
              </div>
            )}

            {/* Free Batteries Error */}
            {isLoggedIn && freeBatteriesError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{freeBatteriesError}</p>
              </div>
            )}

            {/* Free Batteries List - Only show when no battery selected */}
            {isLoggedIn && !selectedUserBattery && !freeBatteriesLoading && !freeBatteriesError && (
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
            {isLoggedIn && selectedUserBattery && (
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

                {currentStep === 2 && (
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600">📦</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-sm mb-1">Kéo pin vào slot</h4>
                    <p className="text-xs text-yellow-600">Sau đó đóng nắp slot</p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-teal-600">🎁</span>
                    </div>
                    <h4 className="font-semibold text-teal-800 text-sm mb-1">Lấy pin mới</h4>
                    <p className="text-xs text-teal-600">Sau đó đóng nắp slot</p>
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

      {/* Swap Confirmation Popup */}
      {swapOrderId && newBatteryInfo && (
        <SwapConfirmationPopup
          isOpen={showSwapConfirmation}
          onClose={handleSwapConfirmationClose}
          onConfirm={handleSwapConfirmationConfirm}
          swapOrderId={swapOrderId}
          newBatteryInfo={newBatteryInfo}
          sessionToken={sessionToken}
        />
      )}
    </DndProvider>
  );
}
