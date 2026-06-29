import type { LucideIcon } from "lucide-react";

// ============================================================================
// App-facing types (consumed by components). Mappers convert DB rows → these.
// ============================================================================

export interface Project {
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  coverImage: string;
  summary: string;
  tools: string[];

  overview: {
    whatBusinessDoes: string;
    problemBeforeAutomation: string;
  };

  painPoints: {
    manualWork: string;
    repetitiveTasks: string;
    mistakesOrDelays: string;
    bottlenecks: string;
  };

  automationBuilt: {
    description: string;
    flowDiagramImage?: string;
    toolConnections: string;
  };

  media: ProjectMedia[];

  valueCreated: {
    timeSaved?: string;
    manualWorkRemoved?: string;
    errorsReduced?: string;
    clientExperienceImproved?: string;
    revenueImpact?: string;
  };

  skillsShowcased: string[];
}

export interface ProjectMedia {
  type: "image" | "gif" | "video";
  src: string;
  caption: string;
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

/** Redesigned in Phase 2 to match the author/company/avatar schema. */
export interface Testimonial {
  quote: string;
  authorName: string;
  company?: string;
  avatarUrl?: string;
}

// ============================================================================
// Database row types (snake_case, as returned by Supabase).
// ============================================================================

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  cover_image: string | null;
  summary: string | null;
  tools: string[] | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  what_business_does: string | null;
  problem_before_automation: string | null;
  pain_manual_work: string | null;
  pain_repetitive_tasks: string | null;
  pain_mistakes_or_delays: string | null;
  pain_bottlenecks: string | null;
  automation_description: string | null;
  flow_diagram_image: string | null;
  tool_connections: string | null;
  value_time_saved: string | null;
  value_manual_work_removed: string | null;
  value_errors_reduced: string | null;
  value_client_experience: string | null;
  value_revenue_impact: string | null;
  skills_showcased: string[] | null;
  project_media?: ProjectMediaRow[];
}

export interface ProjectMediaRow {
  id: string;
  project_id: string;
  type: "image" | "gif" | "video";
  src: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  details: string[] | null;
  icon: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface TestimonialRow {
  id: string;
  quote: string;
  author_name: string;
  company: string | null;
  avatar_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteContentRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

/** Flattened key → value map of site_content rows. */
export type SiteContent = Record<string, string>;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  tools: string[] | null;
  tools_other: string | null;
  service_slugs: string[] | null;
  status: LeadStatus;
  created_at: string;
}

export interface LeadEmailRow {
  id: string;
  lead_id: string;
  to_email: string;
  subject: string;
  body_html: string;
  error: string | null;
  sent_at: string;
}
