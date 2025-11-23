"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for route changes
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      handleStart();
      originalPush.apply(window.history, args);
      // Simulate loading time for better UX
      setTimeout(handleComplete, 300);
    };

    window.history.replaceState = function (...args) {
      handleStart();
      originalReplace.apply(window.history, args);
      setTimeout(handleComplete, 300);
    };

    // Handle browser back/forward
    const handlePopState = () => {
      handleStart();
      setTimeout(handleComplete, 300);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-1 bg-blue-200">
        <div className="h-full bg-blue-600 animate-pulse transition-all duration-300 ease-out loading-bar" />
      </div>
      <style jsx>{`
        .loading-bar {
          animation: loading 1s ease-in-out infinite;
        }
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
