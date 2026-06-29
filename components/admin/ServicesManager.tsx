"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  saveService,
  deleteService,
  reorderServices,
  bulkDeleteServices,
  type ServiceInput,
} from "@/app/admin/actions";
import {
  Field,
  TextInput,
  TextArea,
  AdminButton,
  BulkButton,
  StatusPill,
  adminInputClass,
} from "@/components/admin/ui";
import { TagInput } from "@/components/admin/TagInput";
import { Modal } from "@/components/admin/Modal";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { iconNames, resolveIcon } from "@/lib/icon-map";
import type { ServiceRow } from "@/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Draft = ServiceInput & { id?: string };

function toDraft(row?: ServiceRow, sortOrder = 0): Draft {
  return {
    id: row?.id,
    slug: row?.slug ?? "",
    title: row?.title ?? "",
    description: row?.description ?? "",
    details: row?.details ?? [],
    icon: row?.icon ?? iconNames[0],
    published: row?.published ?? true,
    sort_order: row?.sort_order ?? sortOrder,
  };
}

export function ServicesManager({ services }: { services: ServiceRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const confirm = useConfirm();
  const toast = useToast();

  function openNew() {
    setFormError(null);
    setEditing(toDraft(undefined, services.length));
  }

  function openEdit(row: ServiceRow) {
    setFormError(null);
    setEditing(toDraft(row));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    const { id, ...input } = editing;
    const res = await saveService(
      { ...input, slug: input.slug || slugify(input.title) },
      id
    );
    setSaving(false);
    if (res.error) {
      setFormError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success(id ? "Service updated." : "Service created.");
    setEditing(null);
    router.refresh();
  }

  function requestDelete(row: ServiceRow) {
    confirm.open({
      title: "Delete service",
      message: `Delete the “${row.title}” service? This cannot be undone.`,
      destructive: true,
      confirmLabel: "Delete service",
      onConfirm: async () => {
        const res = await deleteService(row.id);
        if (res.error) return res;
        toast.success("Service deleted.");
        router.refresh();
      },
    });
  }

  function bulkDelete(ids: string[], clear: () => void) {
    confirm.open({
      title: "Delete services",
      message: `Delete ${ids.length} service${
        ids.length === 1 ? "" : "s"
      }? This cannot be undone.`,
      destructive: true,
      confirmLabel: `Delete ${ids.length}`,
      onConfirm: async () => {
        const res = await bulkDeleteServices(ids);
        if (res.error) return res;
        toast.success(`${ids.length} service${ids.length === 1 ? "" : "s"} deleted.`);
        clear();
        router.refresh();
      },
    });
  }

  const columns: Column<ServiceRow>[] = [
    {
      header: "Service",
      cell: (s) => {
        const Icon = resolveIcon(s.icon);
        return (
          <span className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block truncate text-on-surface">{s.title}</span>
              <span className="block truncate font-geist text-mono-data text-on-surface-variant">
                /{s.slug}
              </span>
            </span>
          </span>
        );
      },
    },
    {
      header: "Description",
      className: "max-w-xs",
      hideOnMobile: true,
      cell: (s) => (
        <span className="line-clamp-2 text-on-surface-variant">
          {s.description}
        </span>
      ),
    },
    { header: "Order", cell: (s) => s.sort_order },
    { header: "Status", cell: (s) => <StatusPill published={s.published} /> },
  ];

  return (
    <div>
      <DataTable
        rows={services}
        columns={columns}
        getRowKey={(s) => s.id}
        searchableText={(s) => `${s.title} ${s.slug} ${s.description ?? ""}`}
        searchPlaceholder="Search services…"
        emptyMessage="No services yet."
        sortable={{ onReorder: reorderServices }}
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
            <Plus className="h-4 w-4" /> New Service
          </button>
        }
        actions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openEdit(s)}
              aria-label="Edit"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => requestDelete(s)}
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
        title={editing?.id ? "Edit Service" : "New Service"}
        size="lg"
      >
        {editing && (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Title">
                <TextInput
                  required
                  autoFocus
                  value={editing.title}
                  onChange={(e) =>
                    setEditing((d) =>
                      d
                        ? {
                            ...d,
                            title: e.target.value,
                            slug: d.id ? d.slug : slugify(e.target.value),
                          }
                        : d
                    )
                  }
                />
              </Field>
              <Field label="Slug">
                <TextInput
                  required
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, slug: slugify(e.target.value) } : d
                    )
                  }
                />
              </Field>
            </div>
            <Field label="Description">
              <TextArea
                rows={2}
                value={editing.description}
                onChange={(e) =>
                  setEditing((d) =>
                    d ? { ...d, description: e.target.value } : d
                  )
                }
              />
            </Field>
            <Field label="Details (bullet points)">
              <TagInput
                value={editing.details}
                onChange={(v) =>
                  setEditing((d) => (d ? { ...d, details: v } : d))
                }
                placeholder="Add a bullet and press Enter"
              />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Icon">
                <select
                  value={editing.icon}
                  onChange={(e) =>
                    setEditing((d) =>
                      d ? { ...d, icon: e.target.value } : d
                    )
                  }
                  className={adminInputClass}
                >
                  {iconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>
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
            </div>
            <label className="flex cursor-pointer items-center gap-3 font-body-md text-on-surface">
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
