"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

interface NavigationButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
  showLoadingOnActive?: boolean;
  className?: string;
}

export const NavigationButton = forwardRef<
  HTMLButtonElement,
  NavigationButtonProps
>(
  (
    { href, children, showLoadingOnActive = true, className, ...props },
    ref
  ) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Button
        ref={ref}
        asChild
        className={cn(
          "transition-all duration-200 relative overflow-hidden",
          "hover:scale-105 active:scale-95",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
          className
        )}
        {...props}
      >
        <Link href={href} className="flex items-center gap-2 w-full">
          {children}
          {isActive && showLoadingOnActive && (
            <Loader2 className="h-3 w-3 animate-spin ml-auto opacity-50" />
          )}
        </Link>
      </Button>
    );
  }
);

NavigationButton.displayName = "NavigationButton";
