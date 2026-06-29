import { Building2, LineChart, Headset } from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "strategy-setup",
    icon: Building2,
    title: "Strategy & Setup",
    description:
      "End-to-end automation architecture including process review, system design, and configuration. Built for speed and accuracy.",
    details: [
      "Full process audit and bottleneck mapping",
      "System architecture and tool selection",
      "Configuration, build, and end-to-end testing",
    ],
  },
  {
    slug: "ongoing-optimization",
    icon: LineChart,
    title: "Ongoing Optimization",
    description:
      "Continuous monitoring and refinement of your automation systems to ensure peak performance and long-term reliability.",
    details: [
      "Live monitoring and error alerting",
      "Performance tuning and workflow refactoring",
      "Monthly reporting on time and cost saved",
    ],
  },
  {
    slug: "unlimited-support",
    icon: Headset,
    title: "Unlimited Support",
    description:
      "Full support with the flexibility to adjust or modify your workflows as your business evolves—no limits, no delays.",
    details: [
      "Unlimited change requests",
      "Priority response on mission-critical flows",
      "Quarterly system reviews as you scale",
    ],
  },
];

/**
 * DB-shaped seed rows for the `services` table (icon stored as a Lucide name
 * string). Used by scripts/seed.ts. Kept in sync with the array above.
 */
export const servicesSeed = [
  {
    slug: "strategy-setup",
    title: "Strategy & Setup",
    description:
      "End-to-end automation architecture including process review, system design, and configuration. Built for speed and accuracy.",
    details: [
      "Full process audit and bottleneck mapping",
      "System architecture and tool selection",
      "Configuration, build, and end-to-end testing",
    ],
    icon: "Building2",
    published: true,
  },
  {
    slug: "ongoing-optimization",
    title: "Ongoing Optimization",
    description:
      "Continuous monitoring and refinement of your automation systems to ensure peak performance and long-term reliability.",
    details: [
      "Live monitoring and error alerting",
      "Performance tuning and workflow refactoring",
      "Monthly reporting on time and cost saved",
    ],
    icon: "LineChart",
    published: true,
  },
  {
    slug: "unlimited-support",
    title: "Unlimited Support",
    description:
      "Full support with the flexibility to adjust or modify your workflows as your business evolves—no limits, no delays.",
    details: [
      "Unlimited change requests",
      "Priority response on mission-critical flows",
      "Quarterly system reviews as you scale",
    ],
    icon: "Headset",
    published: true,
  },
];
