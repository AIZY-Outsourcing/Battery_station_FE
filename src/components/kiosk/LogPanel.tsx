"use client";

interface LogPanelProps {
  logs: string[];
}

export default function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="border rounded-lg p-4 w-[300px] bg-gray-50 shadow overflow-y-auto h-[400px]">
      <h3 className="text-lg font-semibold mb-2">📜 Log giao dịch</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        {logs.length === 0 && <li>Chưa có hoạt động nào...</li>}
        {logs.map((log, index) => (
          <li key={index}>• {log}</li>
        ))}
      </ul>
    </div>
  );
}
