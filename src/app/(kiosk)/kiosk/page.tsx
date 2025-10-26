import KioskGrid from "@/components/kiosk/KioskGrid";

export default function KioskPage() {
  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🔋 Kiosk Đổi Pin – Mô phỏng</h1>
      <KioskGrid />
    </main>
  );
}
