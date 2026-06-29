import { Button } from "@/components/ui/Button";

export default function ProjectNotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-margin-mobile text-center">
      <p className="mb-4 font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
        Error 404
      </p>
      <h1 className="mb-6 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-display">
        Project Not Found
      </h1>
      <p className="mb-10 max-w-md text-on-surface-variant">
        This case study has drifted out of orbit. Browse the full archive
        instead.
      </p>
      <Button href="/work" variant="primary">
        View All Projects →
      </Button>
    </section>
  );
}
