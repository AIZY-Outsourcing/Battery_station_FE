"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useNavigationState() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Reset loading state when route changes
  useEffect(() => {
    setIsNavigating(false);
    setLoadingRoute(null);
  }, [pathname]);

  // Enhanced navigation function with loading state
  const navigateWithLoading = useCallback((href: string) => {
    if (href === pathname) return;
    
    setIsNavigating(true);
    setLoadingRoute(href);
    
    // Prefetch the route for faster loading
    router.prefetch(href);
    
    // Navigate after a small delay to show loading state
    setTimeout(() => {
      router.push(href);
    }, 100);
    
    // Fallback to reset loading state after timeout
    const timeout = setTimeout(() => {
      setIsNavigating(false);
      setLoadingRoute(null);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [pathname, router]);

  return {
    isNavigating,
    loadingRoute,
    navigateWithLoading,
  };
}