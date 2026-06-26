import type { LucideIcon } from "lucide-react";

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

export interface Testimonial {
  quote: string;
  status: string;
  statusTone: "error" | "primary";
}
