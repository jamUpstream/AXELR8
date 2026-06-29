import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-margin-mobile text-center">
      <p className="mb-4 font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
        Error 404
      </p>
      <h1 className="mb-6 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-display">
        Lost in Orbit
      </h1>
      <p className="mb-10 max-w-md text-on-surface-variant">
        The page you&rsquo;re looking for has drifted off course. Let&rsquo;s
        get you back to mission control.
      </p>
      <Button href="/" variant="primary">
        Return Home →
      </Button>
    </section>
  );
}
