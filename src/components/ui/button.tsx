import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover shadow-[0_1px_0_rgba(255,255,255,0.12)_inset] disabled:opacity-50",
  secondary:
    "bg-bg-raised text-text-primary border border-border hover:border-[color:var(--border-strong)] hover:bg-bg-surface",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-raised",
  danger:
    "bg-red-tint text-brand border border-brand/25 hover:bg-brand hover:text-white",
  outline:
    "bg-transparent border border-border text-text-primary hover:border-brand/40 hover:bg-bg-raised/50",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
};

const base =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:pointer-events-none";

export function buttonClassName(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  href,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  /** When set, renders a Next.js Link styled as a button (avoids button-in-anchor). */
  href?: string;
}) {
  const classes = buttonClassName(variant, size, className);
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
