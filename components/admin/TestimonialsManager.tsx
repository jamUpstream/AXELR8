"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { uploadToBucket } from "@/lib/upload";
import {
  saveTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  bulkDeleteTestimonials,
  type TestimonialInput,
} from "@/app/admin/actions";
import {
  Field,
  TextInput,
  TextArea,
  AdminButton,
  StatusPill,
  BulkButton,
} from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import type { TestimonialRow } from "@/types";

const BUCKET = "avatars";

type Draft = TestimonialInput & { id?: string };

function toDraft(row?: TestimonialRow, sortOrder = 0): Draft {
  return {
    id: row?.id,
    quote: row?.quote ?? "",
    author_name: row?.author_name ?? "",
    company: row?.company ?? "",
    avatar_url: row?.avatar_url ?? "",
    published: row?.published ?? true,
    sort_order: row?.sort_order ?? sortOrder,
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsManager({
  testimonials,
}: {
  testimonials: TestimonialRow[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const confirm = useConfirm();
  const toast = useToast();

  function openNew() {
    setFormError(null);
    setEditing(toDraft(undefined, testimonials.length));
  }

  function openEdit(row: TestimonialRow) {
    setFormError(null);
    setEditing(toDraft(row));
  }

  async function uploadAvatar(file: File) {
    setFormError(null);
    const path = `${Date.now()}-${file.name}`;
    // Unique path → no upsert (avoids needing a storage UPDATE policy).
    const up = await uploadToBucket(BUCKET, path, file);
    if (up.error || !up.url) {
      setFormError(up.error ?? "Avatar upload failed.");
      toast.error(up.error ?? "Avatar upload failed.");
      return;
    }
    setEditing((d) => (d ? { ...d, avatar_url: up.url! } : d));
    toast.success("Avatar uploaded.");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    const { id, ...input } = editing;
    const res = await saveTestimonial(
      {
        ...input,
        company: input.company || null,
        avatar_url: input.avatar_url || null,
      },
      id
    );
    setSaving(false);
    if (res.error) {
      setFormError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success(id ? "Testimonial updated." : "Testimonial created.");
    setEditing(null);
    router.refresh();
  }

  function requestDelete(row: TestimonialRow) {
    confirm.open({
      title: "Delete testimonial",
      message: `Delete the testimonial from “${row.author_name}”? This cannot be undone.`,
      destructive: true,
      confirmLabel: "Delete testimonial",
      onConfirm: async () => {
        const res = await deleteTestimonial(row.id);
        if (res.error) return res;
        toast.success("Testimonial deleted.");
        router.refresh();
      },
    });
  }

  function bulkDelete(ids: string[], clear: () => void) {
    confirm.open({
      title: "Delete testimonials",
      message: `Delete ${ids.length} testimonial${
        ids.length === 1 ? "" : "s"
      }? This cannot be undone.`,
      destructive: true,
      confirmLabel: `Delete ${ids.length}`,
      onConfirm: async () => {
        const res = await bulkDeleteTestimonials(ids);
        if (res.error) return res;
        toast.success(
          `${ids.length} testimonial${ids.length === 1 ? "" : "s"} deleted.`
        );
        clear();
        router.refresh();
      },
    });
  }

  const columns: Column<TestimonialRow>[] = [
    {
      header: "Author",
      cell: (t) => (
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
            {t.avatar_url ? (
              <Image
                src={t.avatar_url}
                alt={t.author_name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-geist text-[10px] text-on-surface-variant">
                {initials(t.author_name)}
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-on-surface">
              {t.author_name}
            </span>
            {t.company && (
              <span className="block truncate font-geist text-mono-data text-on-surface-variant">
                {t.company}
              </span>
            )}
          </span>
        </span>
      ),
    },
    {
      header: "Quote",
      className: "max-w-md",
      hideOnMobile: true,
      cell: (t) => (
        <span className="line-clamp-2 italic text-on-surface-variant">
          &ldquo;{t.quote}&rdquo;
        </span>
      ),
    },
    { header: "Order", cell: (t) => t.sort_order },
    { header: "Status", cell: (t) => <StatusPill published={t.published} /> },
  ];

  return (
    <div>
      <DataTable
        rows={testimonials}
        columns={columns}
        getRowKey={(t) => t.id}
        searchableText={(t) =>
          `${t.author_name} ${t.company ?? ""} ${t.quote}`
        }
        searchPlaceholder="Search testimonials…"
        emptyMessage="No testimonials yet."
        sortable={{ onReorder: reorderTestimonials }}
        selection={{
          renderBulkActions: (ids, clear) => (
            <BulkButton variant="danger" onClick={() => bulkDelete(ids, clear)}>
              <Trash2 className="h-4 w-4" /> Delete
            </BulkButton>
          ),
        }}
        toolbar={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-2.5 font-geist text-label-caps uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Testimonial
          </button>
        }
        actions={(t) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openEdit(t)}
              aria-label="Edit"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => requestDelete(t)}
              aria-label="Delete"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title={editing?.id ? "Edit Testimonial" : "New Testimonial"}
        size="lg"
      >
        {editing && (
          <form onSubmit={submit} className="space-y-6">
            <Field label="Quote">
              <TextArea
                required
                autoFocus
                rows={3}
                value={editing.quote}
                onChange={(e) =>
                  setEditing((d) => (d ? { ...d, quote: e.target.value } : d))
                }
              />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Author name">
                <TextInput
                  required
                  value={editing.author_name}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, author_name: e.target.value } : d
                    )
                  }
                />
              </Field>
              <Field label="Company">
                <TextInput
                  value={editing.company ?? ""}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, company: e.target.value } : d
                    )
                  }
                />
              </Field>
            </div>
            <Field label="Avatar" hint="Uploads to the 'avatars' bucket.">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
                  {editing.avatar_url ? (
                    <Image
                      src={editing.avatar_url}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-geist text-mono-data text-on-surface-variant">
                      {initials(editing.author_name || "?")}
                    </span>
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && uploadAvatar(e.target.files[0])
                  }
                  className="font-geist text-mono-data text-on-surface-variant file:mr-4 file:border file:border-outline-variant file:bg-surface-container file:px-4 file:py-2 file:font-geist file:text-label-caps file:uppercase file:text-on-surface"
                />
              </div>
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Sort order">
                <TextInput
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, sort_order: Number(e.target.value) } : d
                    )
                  }
                />
              </Field>
              <label className="flex items-end gap-3 pb-2.5 font-body-md text-on-surface">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, published: e.target.checked } : d
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />
                Published
              </label>
            </div>

            {formError && (
              <p className="border-l-2 border-error bg-error/10 px-4 py-2 font-geist text-mono-data text-error">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <AdminButton
                variant="outline"
                onClick={() => !saving && setEditing(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </AdminButton>
            </div>
          </form>
        )}
      </Modal>

      {confirm.element}
    </div>
  );
}
