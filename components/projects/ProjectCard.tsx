import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col bg-surface-container-lowest thin-border transition-all hover:border-primary/50"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full border border-outline-variant bg-black/70 px-3 py-1 font-geist text-label-caps uppercase tracking-[0.1em] text-primary backdrop-blur-sm">
          {project.industry}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <h3 className="mb-2 font-inter text-headline-md font-semibold">
          {project.title}
        </h3>
        <p className="mb-6 flex-1 font-body-md text-body-md text-on-surface-variant">
          {project.summary}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-outline-variant px-3 py-1 font-geist text-mono-data text-on-surface-variant"
            >
              {tool}
            </span>
          ))}
        </div>

        <span className="flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-primary transition-all group-hover:gap-4">
          View Case Study <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
