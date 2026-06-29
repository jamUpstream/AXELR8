"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { Field, TextInput, AdminButton } from "@/components/admin/ui";
import { useToast } from "@/components/admin/ToastProvider";
import { upsertProject, type ProjectInput } from "@/app/admin/actions";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY: Omit<
  ProjectInput,
  "slug" | "title" | "client_name" | "industry"
> = {
  summary: "",
  cover_image: null,
  tools: [],
  published: false,
  what_business_does: "",
  problem_before_automation: "",
  pain_manual_work: "",
  pain_repetitive_tasks: "",
  pain_mistakes_or_delays: "",
  pain_bottlenecks: "",
  automation_description: "",
  flow_diagram_image: null,
  tool_connections: "",
  value_time_saved: null,
  value_manual_work_removed: null,
  value_errors_reduced: null,
  value_client_experience: null,
  value_revenue_impact: null,
  skills_showcased: [],
};

/** "New Project" button + modal capturing the essentials, then → edit page. */
export function CreateProjectModal() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setClientName("");
    setIndustry("");
    setError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const finalSlug = slug || slugify(title);
    const res = await upsertProject({
      ...EMPTY,
      title,
      slug: finalSlug,
      client_name: clientName,
      industry,
    });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success("Draft created. Add the full case study.");
    setOpen(false);
    reset();
    router.push(`/admin/projects/${finalSlug}/edit`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 font-geist text-label-caps uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-95"
      >
        <Plus className="h-4 w-4" /> New Project
      </button>

      <Modal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title="New Project"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <p className="font-geist text-mono-data text-on-surface-variant">
            Create a draft with the essentials — you&rsquo;ll add the full case
            study on the next screen.
          </p>

          <Field label="Title" htmlFor="cp-title">
            <TextInput
              id="cp-title"
              required
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Order Fulfillment Engine"
            />
          </Field>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Slug" htmlFor="cp-slug" hint="/work/[slug]">
              <TextInput
                id="cp-slug"
                required
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="order-fulfillment-engine"
              />
            </Field>
            <Field label="Industry" htmlFor="cp-industry">
              <TextInput
                id="cp-industry"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="E-Commerce"
              />
            </Field>
          </div>

          <Field label="Client Name" htmlFor="cp-client">
            <TextInput
              id="cp-client"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Northwind Supply Co."
            />
          </Field>

          {error && (
            <p className="border-l-2 border-error bg-error/10 px-4 py-2 font-geist text-mono-data text-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <AdminButton
              variant="outline"
              onClick={() => !saving && setOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create & Edit"}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
