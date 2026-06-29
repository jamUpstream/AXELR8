import { Hero } from "@/components/sections/Hero";
import { LogoBar } from "@/components/sections/LogoBar";
import { ValueProp } from "@/components/sections/ValueProp";
import { AutomationFeature } from "@/components/sections/AutomationFeature";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { SystemArchitecture } from "@/components/sections/SystemArchitecture";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import {
  getPublishedProjects,
  getServices,
  getTestimonials,
  getSiteContent,
} from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [projects, services, testimonials, content] = await Promise.all([
    getPublishedProjects(),
    getServices(),
    getTestimonials(),
    getSiteContent(),
  ]);

  return (
    <>
      <Hero
        headlineLine1={content.hero_headline_line1 ?? "AUTOMATE YOUR BUSINESS."}
        headlineLine2={
          content.hero_headline_line2 ?? "ACCELERATE YOUR SUCCESS."
        }
        subheadline={
          content.hero_subheadline ??
          "Precision-engineered workflows designed for high-stakes scalability."
        }
      />
      <LogoBar />
      <ValueProp
        eyebrow={content.value_prop_eyebrow ?? "Our Core Mission"}
        statement={
          content.value_prop_statement ??
          "We build high-performance automations."
        }
      />
      <AutomationFeature />
      <Services
        services={services}
        eyebrow={content.services_eyebrow ?? "Automation—Handled End-to-End."}
        subheadline={
          content.services_subheadline ??
          "Our modular service suite provides everything your operation needs."
        }
      />
      <Testimonials testimonials={testimonials} />
      <SystemArchitecture />
      <ProjectsPreview projects={projects} />
      <ClosingCTA
        quote={content.closing_cta_quote ?? "Why didn't we do this earlier?"}
        attribution={content.closing_cta_attribution ?? "~ You, next week."}
        buttonLabel={
          content.closing_cta_button ?? "Let's Build Your System →"
        }
      />
    </>
  );
}
