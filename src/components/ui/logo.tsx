import { cn } from "@/lib/cn";
import Link from "next/link";

export function SynseraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-7 w-7", className)}
      aria-hidden
    >
      <path
        d="M16 2.5L27 8.2V18.8C27 24.1 22.2 28.5 16 29.5C9.8 28.5 5 24.1 5 18.8V8.2L16 2.5Z"
        fill="currentColor"
        className="text-brand"
      />
      <path
        d="M11 16.2L14.2 19.4L21.2 12.4"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SynseraLogo({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 text-text-primary", className)}
    >
      <SynseraMark />
      {!compact && (
        <span className="text-[17px] font-semibold tracking-[-0.03em]">
          Synsera
        </span>
      )}
    </Link>
  );
}
