"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, ImageOff, Eye, EyeOff, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { StatusPill, BulkButton } from "@/components/admin/ui";
import { CreateProjectModal } from "@/components/admin/CreateProjectModal";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import {
  reorderProjects,
  bulkDeleteProjects,
  bulkSetProjectsPublished,
} from "@/app/admin/actions";
import type { ProjectRow } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();

  async function bulkPublish(slugs: string[], published: boolean, clear: () => void) {
    const res = await bulkSetProjectsPublished(slugs, published);
    if (res.error) toast.error(res.error);
    else {
      toast.success(
        `${slugs.length} project${slugs.length === 1 ? "" : "s"} ${
          published ? "published" : "unpublished"
        }.`
      );
      clear();
      router.refresh();
    }
  }

  function bulkDelete(slugs: string[], clear: () => void) {
    confirm.open({
      title: "Delete projects",
      message: `Permanently delete ${slugs.length} project${
        slugs.length === 1 ? "" : "s"
      } and their media? This cannot be undone.`,
      destructive: true,
      confirmLabel: `Delete ${slugs.length}`,
      onConfirm: async () => {
        const res = await bulkDeleteProjects(slugs);
        if (res.error) return res;
        toast.success(`${slugs.length} project${slugs.length === 1 ? "" : "s"} deleted.`);
        clear();
        router.refresh();
      },
    });
  }

  const columns: Column<ProjectRow>[] = [
    {
      header: "Project",
      className: "w-full max-w-0",
      cell: (p) => (
        <Link
          href={`/admin/projects/${p.slug}/edit`}
          className="group flex w-full min-w-0 items-center gap-3"
        >
          <span className="relative h-10 w-16 shrink-0 overflow-hidden border border-outline-variant/50 bg-surface-container">
            {p.cover_image ? (
              <Image
                src={p.cover_image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <ImageOff className="h-4 w-4" />
              </span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-on-surface group-hover:text-primary">
                {p.title}
              </span>
              <Pencil className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="block truncate font-geist text-mono-data text-on-surface-variant">
              {p.client_name}
            </span>
          </span>
        </Link>
      ),
    },
    {
      header: "Industry",
      cell: (p) => (
        <span className="font-geist text-mono-data text-on-surface-variant">
          {p.industry}
        </span>
      ),
    },
    { header: "Status", cell: (p) => <StatusPill published={p.published} /> },
    {
      header: "Updated",
      hideOnMobile: true,
      cell: (p) => (
        <span className="font-geist text-mono-data text-on-surface-variant">
          {formatDate(p.updated_at)}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        rows={projects}
        columns={columns}
        getRowKey={(p) => p.slug}
        searchableText={(p) =>
          `${p.title} ${p.client_name} ${p.industry} ${p.slug}`
        }
        searchPlaceholder="Search projects…"
        emptyMessage="No projects yet. Click New Project to create one."
        sortable={{ onReorder: reorderProjects }}
        toolbar={<CreateProjectModal />}
        selection={{
          renderBulkActions: (slugs, clear) => (
            <>
              <BulkButton onClick={() => bulkPublish(slugs, true, clear)}>
                <Eye className="h-4 w-4" /> Publish
              </BulkButton>
              <BulkButton onClick={() => bulkPublish(slugs, false, clear)}>
                <EyeOff className="h-4 w-4" /> Unpublish
              </BulkButton>
              <BulkButton variant="danger" onClick={() => bulkDelete(slugs, clear)}>
                <Trash2 className="h-4 w-4" /> Delete
              </BulkButton>
            </>
          ),
        }}
        actions={(p) => (
          <ProjectRowActions
            slug={p.slug}
            title={p.title}
            published={p.published}
          />
        )}
      />
      {confirm.element}
    </>
  );
}
