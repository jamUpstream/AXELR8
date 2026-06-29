"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { saveSiteContent } from "@/app/admin/actions";
import {
  Field,
  TextArea,
  AdminButton,
  SectionCard,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/ToastProvider";
import type { SiteContentRow } from "@/types";

/** Human labels + grouping for known content keys. Unknown keys still render. */
const GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Hero",
    keys: [
      "hero_headline_line1",
      "hero_headline_line2",
      "hero_subheadline",
    ],
  },
  {
    title: "Value Prop",
    keys: ["value_prop_eyebrow", "value_prop_statement"],
  },
  {
    title: "Services",
    keys: ["services_eyebrow", "services_subheadline"],
  },
  {
    title: "Closing CTA",
    keys: [
      "closing_cta_quote",
      "closing_cta_attribution",
      "closing_cta_button",
    ],
  },
];

function label(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SiteContentManager({ rows }: { rows: SiteContentRow[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.key, r.value]))
  );
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const known = new Set(GROUPS.flatMap((g) => g.keys));
  const extraKeys = rows.map((r) => r.key).filter((k) => !known.has(k));
  const groups = extraKeys.length
    ? [...GROUPS, { title: "Other", keys: extraKeys }]
    : GROUPS;

  function save() {
    const entries = Object.entries(values).map(([key, value]) => ({
      key,
      value,
    }));
    startTransition(async () => {
      const res = await saveSiteContent(entries);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Site content saved.");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <SectionCard key={group.title} title={group.title}>
          {group.keys.map((key) => (
            <Field key={key} label={label(key)} hint={key}>
              <TextArea
                rows={key.includes("subheadline") || key.includes("statement") ? 3 : 1}
                value={values[key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [key]: e.target.value }))
                }
              />
            </Field>
          ))}
        </SectionCard>
      ))}

      <AdminButton onClick={save} disabled={pending}>
        <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save All"}
      </AdminButton>
    </div>
  );
}
