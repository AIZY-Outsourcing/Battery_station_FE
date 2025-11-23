"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-top-bar";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset navigation state when route changes
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    // Listen for navigation clicks
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find the closest anchor tag that's an admin link
      const link = target.closest('a[href^="/admin"]') as HTMLAnchorElement;

      if (link) {
        const href = link.getAttribute("href");
        // Only show loading if navigating to a different page
        if (href && href !== pathname) {
          setIsNavigating(true);

          // Auto-hide loading after 5 seconds as fallback
          const timeout = setTimeout(() => {
            setIsNavigating(false);
          }, 5000);

          return () => clearTimeout(timeout);
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full">
      {/* Top loading bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999]">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
            <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 animate-pulse loading-bar" />
          </div>
          <style jsx>{`
            .loading-bar {
              animation: loading 1.5s ease-in-out infinite;
            }
            @keyframes loading {
              0% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      )}

      <AdminSidebar className="w-64 flex-shrink-0" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar />
        <main
          className={`flex-1 overflow-auto transition-opacity duration-200 ${
            isNavigating ? "opacity-75" : "opacity-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
