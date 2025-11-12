"use client";

import { useEffect, useRef, useState } from "react";
import { X, Clock, Smartphone } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import Swal from "sweetalert2";
import { stationsApiService } from "@/services/stations.service";

interface QRCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  qrData: string;
  expiresAt: string;
  sessionId: string;
  onSessionSuccess: (sessionToken: string) => void;
}

export default function QRCodePopup({ isOpen, onClose, qrData, expiresAt, sessionId, onSessionSuccess }: QRCodePopupProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && qrData && qrRef.current) {
      generateQRCode(qrData);
    }
  }, [isOpen, qrData]);

  // Start polling for session status
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const startPolling = () => {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await stationsApiService.checkSessionStatus(sessionId);
          
          if (response.success && response.data) {
            if (response.data.status === 'active') {
              // Stop polling
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              
              // Show success alert
              await Swal.fire({
                title: 'Thành công!',
                text: 'Người dùng đã đăng nhập thành công',
                icon: 'success',
                confirmButtonText: 'Tiếp tục',
                confirmButtonColor: '#3b82f6',
                timer: 3000,
                timerProgressBar: true,
              });
              
              // Call success callback
              onSessionSuccess(response.data.session_token);
              
              // Close popup
              onClose();
            }
          }
        } catch (error) {
          console.error('Error checking session status:', error);
        }
      }, 5000); // Poll every 5 seconds
    };

    startPolling();

    // Cleanup on unmount or close
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, sessionId, onSessionSuccess, onClose]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !expiresAt) return;

    const updateCountdown = () => {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      const diffMs = expiryDate.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeLeft("Đã hết hạn");
        return;
      }
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (diffMins < 60) {
        setTimeLeft(`${diffMins}:${diffSecs.toString().padStart(2, '0')}`);
      } else {
        const diffHours = Math.floor(diffMins / 60);
        const remainingMins = diffMins % 60;
        setTimeLeft(`${diffHours}:${remainingMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen, expiresAt]);

  const generateQRCode = async (data: string) => {
    try {
      // Clear previous QR code
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }

      // Create new QR code instance with larger size
      qrCodeRef.current = new QRCodeStyling({
        width: 400,
        height: 400,
        type: "svg",
        data: data,
        image: undefined,
        margin: 15,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "M"
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0
        },
        dotsOptions: {
          color: "#000000",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#FFFFFF"
        },
        cornersSquareOptions: {
          color: "#000000",
          type: "extra-rounded"
        },
        cornersDotOptions: {
          color: "#000000",
          type: "dot"
        }
      });

      // Append QR code to container
      if (qrRef.current && qrCodeRef.current) {
        qrCodeRef.current.append(qrRef.current);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup - Rectangle Layout */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quét QR Code</h2>
                <p className="text-blue-100 text-sm">Sử dụng mobile app để quét</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Horizontal Layout */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - QR Code */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-6">
                {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Mã QR Code</h3> */}
                <div className="inline-block p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 shadow-lg">
                  <div ref={qrRef} className="flex justify-center"></div>
                </div>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="space-y-6">
              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-800">Thời gian hết hạn</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2 font-mono">
                    {timeLeft}
                  </div>
                  <p className="text-sm text-red-600">
                    {new Date(expiresAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">Hướng dẫn:</h4>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Mở mobile app trên điện thoại</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Chọn chức năng "Quét QR"</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Quét mã QR này</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Làm theo hướng dẫn trên app</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Đã quét xong
            </button>
            
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
