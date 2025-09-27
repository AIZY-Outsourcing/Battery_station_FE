"use client";

import type React from "react";

import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-top-bar";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar className="w-64 flex-shrink-0" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
