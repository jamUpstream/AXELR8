import { Hero } from "@/components/sections/Hero";
import { LogoBar } from "@/components/sections/LogoBar";
import { ValueProp } from "@/components/sections/ValueProp";
import { AutomationFeature } from "@/components/sections/AutomationFeature";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { SystemArchitecture } from "@/components/sections/SystemArchitecture";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoBar />
      <ValueProp />
      <AutomationFeature />
      <Services />
      <Testimonials />
      <SystemArchitecture />
      <ProjectsPreview />
      <ClosingCTA />
    </>
  );
}
