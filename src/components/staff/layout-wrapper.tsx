"use client";

import type React from "react";

import { StaffSidebar } from "./sidebar";
import { StaffTopBar } from "./top-bar";

interface StaffLayoutWrapperProps {
  children: React.ReactNode;
}

export function StaffLayoutWrapper({ children }: StaffLayoutWrapperProps) {
  return (
    <div className="flex h-screen w-full">
      <StaffSidebar className="w-64 flex-shrink-0" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <StaffTopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
