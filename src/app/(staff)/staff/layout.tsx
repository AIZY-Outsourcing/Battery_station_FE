import type React from "react";
import { StaffLayoutWrapper } from "@/components/staff/layout-wrapper";

export default function StaffBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffLayoutWrapper>{children}</StaffLayoutWrapper>;
}
