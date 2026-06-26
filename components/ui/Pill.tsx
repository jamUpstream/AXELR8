import { Wrench } from "lucide-react";

/**
 * Tool / tag badge — pill-shaped per the design system (sharp everywhere else).
 */
export function Pill({
  label,
  withIcon = false,
}: {
  label: string;
  withIcon?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-1.5 font-geist text-mono-data text-on-surface-variant">
      {withIcon && <Wrench className="h-3.5 w-3.5 text-primary" />}
      {label}
    </span>
  );
}

export function EyebrowLabel({ children }: { children: string }) {
  return (
    <span className="block font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
      {children}
    </span>
  );
}
