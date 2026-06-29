import type {
  Project,
  ProjectRow,
  Service,
  ServiceRow,
  Testimonial,
  TestimonialRow,
  SiteContent,
  SiteContentRow,
} from "@/types";
import { resolveIcon } from "@/lib/icon-map";

/** DB project row (with joined media) → app Project. */
export function mapProject(row: ProjectRow): Project {
  const media = (row.project_media ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      type: m.type,
      src: m.src,
      caption: m.caption ?? "",
    }));

  return {
    slug: row.slug,
    title: row.title,
    clientName: row.client_name,
    industry: row.industry,
    coverImage: row.cover_image ?? "",
    summary: row.summary ?? "",
    tools: row.tools ?? [],
    overview: {
      whatBusinessDoes: row.what_business_does ?? "",
      problemBeforeAutomation: row.problem_before_automation ?? "",
    },
    painPoints: {
      manualWork: row.pain_manual_work ?? "",
      repetitiveTasks: row.pain_repetitive_tasks ?? "",
      mistakesOrDelays: row.pain_mistakes_or_delays ?? "",
      bottlenecks: row.pain_bottlenecks ?? "",
    },
    automationBuilt: {
      description: row.automation_description ?? "",
      flowDiagramImage: row.flow_diagram_image ?? undefined,
      toolConnections: row.tool_connections ?? "",
    },
    media,
    valueCreated: {
      timeSaved: row.value_time_saved ?? undefined,
      manualWorkRemoved: row.value_manual_work_removed ?? undefined,
      errorsReduced: row.value_errors_reduced ?? undefined,
      clientExperienceImproved: row.value_client_experience ?? undefined,
      revenueImpact: row.value_revenue_impact ?? undefined,
    },
    skillsShowcased: row.skills_showcased ?? [],
  };
}

/** DB service row → app Service (resolves icon name → component). */
export function mapService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    icon: resolveIcon(row.icon),
    title: row.title,
    description: row.description ?? "",
    details: row.details ?? [],
  };
}

/** DB testimonial row → app Testimonial. */
export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    quote: row.quote,
    authorName: row.author_name,
    company: row.company ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
  };
}

/** site_content rows → flat key/value map. */
export function mapSiteContent(rows: SiteContentRow[]): SiteContent {
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
