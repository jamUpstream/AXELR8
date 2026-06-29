import {
  Building2,
  LineChart,
  Headset,
  Workflow,
  Zap,
  Cog,
  Database,
  ShieldCheck,
  Gauge,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon-name string stored in the `services.icon` column to a Lucide
 * component. Extend this when new icons are offered in the admin form.
 */
export const iconMap: Record<string, LucideIcon> = {
  Building2,
  LineChart,
  Headset,
  Workflow,
  Zap,
  Cog,
  Database,
  ShieldCheck,
  Gauge,
};

/** Icon names offered in the admin service form (the select options). */
export const iconNames = Object.keys(iconMap);

export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && iconMap[name]) || Cog;
}
