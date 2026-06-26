import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 font-geist text-label-caps tracking-widest uppercase transition-all duration-150";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary px-10 py-4 hover:brightness-110 active:scale-95 hover:shadow-[0_0_30px_rgba(163,201,255,0.25)]",
  outline:
    "border border-on-surface text-on-surface px-10 py-4 hover:bg-on-surface/10",
  ghost:
    "text-primary border-b border-primary pb-1 hover:tracking-[0.18em] px-0 py-1",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
