"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  deleteProject,
  duplicateProject,
  toggleProjectPublished,
} from "@/app/admin/actions";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";

export function ProjectRowActions({
  slug,
  title,
  published,
}: {
  slug: string;
  title: string;
  published: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();
  const toast = useToast();

  function run(fn: () => Promise<{ error?: string }>, success: string) {
    setOpen(false);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(success);
      }
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label="Actions"
        className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-on-surface disabled:opacity-50"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 border border-outline-variant bg-surface-container-lowest py-1 shadow-lg">
            <MenuItem
              icon={published ? EyeOff : Eye}
              label={published ? "Unpublish" : "Publish"}
              onClick={() =>
                run(
                  () => toggleProjectPublished(slug, !published),
                  published ? "Project unpublished." : "Project published."
                )
              }
            />
            <MenuItem
              icon={Copy}
              label="Duplicate"
              onClick={() =>
                run(() => duplicateProject(slug), "Project duplicated as a draft.")
              }
            />
            <MenuItem
              icon={Trash2}
              label="Delete"
              danger
              onClick={() => {
                setOpen(false);
                confirm.open({
                  title: "Delete project",
                  message: `Permanently delete “${title}” and its media? This cannot be undone.`,
                  destructive: true,
                  confirmLabel: "Delete project",
                  onConfirm: async () => {
                    const res = await deleteProject(slug);
                    if (!res.error) {
                      toast.success("Project deleted.");
                      router.refresh();
                    }
                    return res;
                  },
                });
              }}
            />
          </div>
        </>
      )}

      {confirm.element}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-2 text-left font-geist text-mono-data transition-colors hover:bg-surface-container ${
        danger ? "text-error" : "text-on-surface"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
