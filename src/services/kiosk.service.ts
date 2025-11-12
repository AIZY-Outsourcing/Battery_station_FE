import { KioskActionState, ApiResponse, KioskTransaction } from '@/types/kiosk.type';

class KioskService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  async callAction(state: KioskActionState, data?: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/kiosk/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: state,
          data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error calling action ${state}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async scanQR(qrCode: string): Promise<ApiResponse<KioskTransaction>> {
    return this.callAction(KioskActionState.REQUESTED, { qrCode });
  }

  async confirmReservation(transactionId: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.RESERVATION_CONFIRMED, { transactionId });
  }

  async openEmptySlot(slotId: number): Promise<ApiResponse> {
    return this.callAction(KioskActionState.OPEN_EMPTY_SLOT, { slotId });
  }

  async insertOldBattery(slotId: number, batteryId: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.OLD_BATTERY_IN, { slotId, batteryId });
  }

  async closeEmptySlot(slotId: number): Promise<ApiResponse> {
    return this.callAction(KioskActionState.CLOSE_EMPTY_SLOT, { slotId });
  }

  async openRequireSlot(slotId: number): Promise<ApiResponse> {
    return this.callAction(KioskActionState.OPEN_REQUIRE_SLOT, { slotId });
  }

  async takeNewBattery(slotId: number): Promise<ApiResponse> {
    return this.callAction(KioskActionState.NEW_BATTERY_OUT, { slotId });
  }

  async closeRequireSlot(slotId: number): Promise<ApiResponse> {
    return this.callAction(KioskActionState.CLOSE_REQUIRE_SLOT, { slotId });
  }

  async completeTransaction(transactionId: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.COMPLETED, { transactionId });
  }

  async failTransaction(transactionId: string, reason: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.FAILED, { transactionId, reason });
  }

  async cancelTransaction(transactionId: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.CANCELLED, { transactionId });
  }

  async expireTransaction(transactionId: string): Promise<ApiResponse> {
    return this.callAction(KioskActionState.EXPIRED, { transactionId });
  }
}

export const kioskService = new KioskService();
