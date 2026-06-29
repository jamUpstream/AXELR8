"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadToBucket } from "@/lib/upload";
import {
  upsertProject,
  type ProjectInput,
} from "@/app/admin/actions";
import {
  Field,
  TextInput,
  TextArea,
  AdminButton,
  SectionCard,
} from "@/components/admin/ui";
import { TagInput } from "@/components/admin/TagInput";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { useToast } from "@/components/admin/ToastProvider";
import type { ProjectRow } from "@/types";

const SKILL_OPTIONS = [
  "CRM Setup",
  "API Integration",
  "Automation Logic",
  "Workflow Design",
  "AI Implementation",
  "Data Handling",
  "Reporting & Dashboards",
  "Client Onboarding Systems",
];

const BUCKET = "project-assets";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectForm({ project }: { project?: ProjectRow }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(project);
  const originalSlug = project?.slug;

  const [form, setForm] = useState<ProjectInput>({
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    client_name: project?.client_name ?? "",
    industry: project?.industry ?? "",
    summary: project?.summary ?? "",
    cover_image: project?.cover_image ?? null,
    tools: project?.tools ?? [],
    published: project?.published ?? false,
    what_business_does: project?.what_business_does ?? "",
    problem_before_automation: project?.problem_before_automation ?? "",
    pain_manual_work: project?.pain_manual_work ?? "",
    pain_repetitive_tasks: project?.pain_repetitive_tasks ?? "",
    pain_mistakes_or_delays: project?.pain_mistakes_or_delays ?? "",
    pain_bottlenecks: project?.pain_bottlenecks ?? "",
    automation_description: project?.automation_description ?? "",
    flow_diagram_image: project?.flow_diagram_image ?? null,
    tool_connections: project?.tool_connections ?? "",
    value_time_saved: project?.value_time_saved ?? "",
    value_manual_work_removed: project?.value_manual_work_removed ?? "",
    value_errors_reduced: project?.value_errors_reduced ?? "",
    value_client_experience: project?.value_client_experience ?? "",
    value_revenue_impact: project?.value_revenue_impact ?? "",
    skills_showcased: project?.skills_showcased ?? [],
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onTitleChange(title: string) {
    set("title", title);
    if (!slugTouched) set("slug", slugify(title));
  }

  async function uploadImage(
    file: File,
    folder: "covers" | "diagrams",
    key: "cover_image" | "flow_diagram_image"
  ) {
    setError(null);
    const path = `${folder}/${form.slug || "untitled"}-${Date.now()}-${file.name}`;
    // Path is unique (timestamp) so no upsert needed — and upsert:true would
    // require a storage UPDATE policy that may not be installed.
    const up = await uploadToBucket(BUCKET, path, file);
    if (up.error || !up.url) {
      setError(up.error ?? "Upload failed.");
      toast.error(up.error ?? "Upload failed.");
      return;
    }
    set(key, up.url);
    toast.success(
      key === "cover_image" ? "Cover image uploaded." : "Diagram uploaded."
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Normalize empty strings on optional value fields to null.
    const payload: ProjectInput = {
      ...form,
      cover_image: form.cover_image || null,
      flow_diagram_image: form.flow_diagram_image || null,
      value_time_saved: form.value_time_saved || null,
      value_manual_work_removed: form.value_manual_work_removed || null,
      value_errors_reduced: form.value_errors_reduced || null,
      value_client_experience: form.value_client_experience || null,
      value_revenue_impact: form.value_revenue_impact || null,
    };

    const res = await upsertProject(payload, originalSlug);
    setSaving(false);
    if (res.error) {
      setError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success(isEdit ? "Project saved." : "Project created.");
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <SectionCard title="Basic Info">
        <Field label="Title" htmlFor="title">
          <TextInput
            id="title"
            required
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Slug" htmlFor="slug" hint="Used in the URL: /work/[slug]">
            <TextInput
              id="slug"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Industry" htmlFor="industry">
            <TextInput
              id="industry"
              required
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Client Name" htmlFor="client">
          <TextInput
            id="client"
            required
            value={form.client_name}
            onChange={(e) => set("client_name", e.target.value)}
          />
        </Field>
        <Field label="Summary" htmlFor="summary">
          <TextArea
            id="summary"
            rows={2}
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </Field>
        <Field label="Tools">
          <TagInput
            value={form.tools}
            onChange={(v) => set("tools", v)}
            placeholder="e.g. Zapier, Stripe…"
          />
        </Field>
      </SectionCard>

      {/* Cover image */}
      <SectionCard title="Cover Image">
        {form.cover_image && (
          <div className="relative aspect-[16/9] w-full overflow-hidden thin-border">
            <Image
              src={form.cover_image}
              alt="cover"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] &&
            uploadImage(e.target.files[0], "covers", "cover_image")
          }
          className="font-geist text-mono-data text-on-surface-variant file:mr-4 file:border file:border-outline-variant file:bg-surface-container file:px-4 file:py-2 file:font-geist file:text-label-caps file:uppercase file:text-on-surface"
        />
      </SectionCard>

      {/* Overview */}
      <SectionCard title="Overview">
        <Field label="What the business does" htmlFor="wbd">
          <TextArea
            id="wbd"
            rows={2}
            value={form.what_business_does}
            onChange={(e) => set("what_business_does", e.target.value)}
          />
        </Field>
        <Field label="Problem before automation" htmlFor="pba">
          <TextArea
            id="pba"
            rows={2}
            value={form.problem_before_automation}
            onChange={(e) =>
              set("problem_before_automation", e.target.value)
            }
          />
        </Field>
      </SectionCard>

      {/* Pain points */}
      <SectionCard title="Pain Points">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Manual work" htmlFor="pmw">
            <TextArea
              id="pmw"
              rows={2}
              value={form.pain_manual_work}
              onChange={(e) => set("pain_manual_work", e.target.value)}
            />
          </Field>
          <Field label="Repetitive tasks" htmlFor="prt">
            <TextArea
              id="prt"
              rows={2}
              value={form.pain_repetitive_tasks}
              onChange={(e) => set("pain_repetitive_tasks", e.target.value)}
            />
          </Field>
          <Field label="Mistakes or delays" htmlFor="pmd">
            <TextArea
              id="pmd"
              rows={2}
              value={form.pain_mistakes_or_delays}
              onChange={(e) =>
                set("pain_mistakes_or_delays", e.target.value)
              }
            />
          </Field>
          <Field label="Bottlenecks" htmlFor="pb">
            <TextArea
              id="pb"
              rows={2}
              value={form.pain_bottlenecks}
              onChange={(e) => set("pain_bottlenecks", e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      {/* Automation built */}
      <SectionCard title="Automation Built">
        <Field label="Description" htmlFor="ad">
          <TextArea
            id="ad"
            rows={4}
            value={form.automation_description}
            onChange={(e) => set("automation_description", e.target.value)}
          />
        </Field>
        <Field label="Tool connections" htmlFor="tc">
          <TextArea
            id="tc"
            rows={4}
            value={form.tool_connections}
            onChange={(e) => set("tool_connections", e.target.value)}
          />
        </Field>
        <Field label="Flow diagram image">
          {form.flow_diagram_image && (
            <div className="relative mb-2 aspect-[16/9] w-full overflow-hidden thin-border">
              <Image
                src={form.flow_diagram_image}
                alt="flow diagram"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files?.[0] &&
              uploadImage(e.target.files[0], "diagrams", "flow_diagram_image")
            }
            className="font-geist text-mono-data text-on-surface-variant file:mr-4 file:border file:border-outline-variant file:bg-surface-container file:px-4 file:py-2 file:font-geist file:text-label-caps file:uppercase file:text-on-surface"
          />
        </Field>
      </SectionCard>

      {/* Media gallery */}
      <SectionCard title="Media Gallery">
        <MediaUploader
          projectId={project?.id ?? null}
          projectSlug={form.slug}
          initialMedia={project?.project_media ?? []}
        />
      </SectionCard>

      {/* Value created */}
      <SectionCard title="Value Created">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Time saved" htmlFor="vts">
            <TextInput
              id="vts"
              value={form.value_time_saved ?? ""}
              onChange={(e) => set("value_time_saved", e.target.value)}
              placeholder="40 hrs/month"
            />
          </Field>
          <Field label="Manual work removed" htmlFor="vmwr">
            <TextInput
              id="vmwr"
              value={form.value_manual_work_removed ?? ""}
              onChange={(e) =>
                set("value_manual_work_removed", e.target.value)
              }
              placeholder="12 workflows"
            />
          </Field>
          <Field label="Errors reduced" htmlFor="ver">
            <TextInput
              id="ver"
              value={form.value_errors_reduced ?? ""}
              onChange={(e) => set("value_errors_reduced", e.target.value)}
              placeholder="94%"
            />
          </Field>
          <Field label="Client experience" htmlFor="vce">
            <TextInput
              id="vce"
              value={form.value_client_experience ?? ""}
              onChange={(e) =>
                set("value_client_experience", e.target.value)
              }
            />
          </Field>
        </div>
        <Field label="Revenue / operational impact" htmlFor="vri">
          <TextInput
            id="vri"
            value={form.value_revenue_impact ?? ""}
            onChange={(e) => set("value_revenue_impact", e.target.value)}
          />
        </Field>
      </SectionCard>

      {/* Skills */}
      <SectionCard title="Skills Showcased">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SKILL_OPTIONS.map((skill) => {
            const checked = form.skills_showcased.includes(skill);
            return (
              <label
                key={skill}
                className="flex cursor-pointer items-center gap-3 font-body-md text-on-surface"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    set(
                      "skills_showcased",
                      checked
                        ? form.skills_showcased.filter((s) => s !== skill)
                        : [...form.skills_showcased, skill]
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />
                {skill}
              </label>
            );
          })}
        </div>
      </SectionCard>

      {/* Publish + submit */}
      <SectionCard title="Status">
        <label className="flex cursor-pointer items-center gap-3 font-body-md text-on-surface">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Published (visible on the public site)
        </label>
      </SectionCard>

      {error && (
        <p className="border-l-2 border-error bg-error/10 px-4 py-3 font-geist text-mono-data text-error">
          {error}
        </p>
      )}

      <div className="flex gap-4">
        <AdminButton type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
        </AdminButton>
        <AdminButton
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
