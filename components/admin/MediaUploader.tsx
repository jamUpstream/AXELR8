"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, GripVertical, Pencil, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { uploadToBucket } from "@/lib/upload";
import {
  addProjectMedia,
  deleteProjectMedia,
  updateProjectMediaCaption,
  reorderProjectMedia,
} from "@/app/admin/actions";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { Modal } from "@/components/admin/Modal";
import { Field, TextInput, AdminButton } from "@/components/admin/ui";
import type { ProjectMediaRow } from "@/types";

const BUCKET = "project-assets";

function mediaType(file: File): "image" | "gif" | "video" {
  if (file.type === "image/gif") return "gif";
  if (file.type.startsWith("video/")) return "video";
  return "image";
}

export function MediaUploader({
  projectId,
  projectSlug,
  initialMedia,
}: {
  projectId: string | null;
  projectSlug: string;
  initialMedia: ProjectMediaRow[];
}) {
  const [items, setItems] = useState<ProjectMediaRow[]>(
    [...initialMedia].sort((a, b) => a.sort_order - b.sort_order)
  );
  // Names of files currently uploading (rendered as loading placeholder cards).
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProjectMediaRow | null>(null);
  const [captionDraft, setCaptionDraft] = useState("");
  const [savingCaption, setSavingCaption] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();
  const toast = useToast();

  if (!projectId) {
    return (
      <p className="border border-dashed border-outline-variant p-6 text-center font-geist text-mono-data text-on-surface-variant">
        Save the project first to enable media uploads.
      </p>
    );
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    for (const file of Array.from(files)) {
      setPendingFiles((p) => [...p, file.name]);
      const path = `media/${projectSlug}/${Date.now()}-${file.name}`;
      const up = await uploadToBucket(BUCKET, path, file);

      if (up.error || !up.url) {
        toast.error(up.error ?? "Upload failed.");
        setPendingFiles((p) => p.filter((n) => n !== file.name));
        continue;
      }
      const publicUrl = up.url;

      const res = await addProjectMedia({
        project_id: projectId!,
        type: mediaType(file),
        src: publicUrl,
        caption: "",
        sort_order: items.length,
      });
      setPendingFiles((p) => p.filter((n) => n !== file.name));

      if (res.error || !res.id) {
        toast.error(res.error ?? "Could not save media.");
        continue;
      }
      toast.success(`Uploaded ${file.name}.`);
      setItems((prev) => [
        ...prev,
        {
          id: res.id!,
          project_id: projectId!,
          type: mediaType(file),
          src: publicUrl,
          caption: "",
          sort_order: prev.length,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  function requestDelete(item: ProjectMediaRow) {
    confirm.open({
      title: "Delete media",
      message: `Remove this ${item.type}${
        item.caption ? ` (“${item.caption}”)` : ""
      }? This deletes the file from storage and cannot be undone.`,
      destructive: true,
      confirmLabel: "Delete media",
      onConfirm: async () => {
        const res = await deleteProjectMedia(item.id);
        if (res.error) return res;
        setItems((prev) => prev.filter((m) => m.id !== item.id));
        try {
          const supabase = createClient();
          const marker = `/${BUCKET}/`;
          const idx = item.src.indexOf(marker);
          if (idx !== -1) {
            const path = item.src.slice(idx + marker.length);
            await supabase.storage.from(BUCKET).remove([path]);
          }
        } catch {
          /* ignore */
        }
        toast.success("Media deleted.");
      },
    });
  }

  function openCaption(item: ProjectMediaRow) {
    setEditing(item);
    setCaptionDraft(item.caption ?? "");
  }

  async function saveCaption(e: React.FormEvent) {
    e.preventDefault();
    // The caption modal is portaled but still a React descendant of the parent
    // ProjectForm; without this, the submit bubbles up and saves the project.
    e.stopPropagation();
    if (!editing) return;
    setSavingCaption(true);
    const res = await updateProjectMediaCaption(editing.id, captionDraft);
    setSavingCaption(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setItems((prev) =>
      prev.map((m) =>
        m.id === editing.id ? { ...m, caption: captionDraft } : m
      )
    );
    setEditing(null);
    toast.success("Caption saved.");
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }
    const ids = items.map((m) => m.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;

    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next); // optimistic
    setDragId(null);
    setOverId(null);

    const orderedIds = next.map((m) => m.id);
    reorderProjectMedia(orderedIds).then((res) => {
      if (res.error) {
        toast.error(`Reorder failed: ${res.error}`);
        setItems(items); // revert
      } else {
        toast.success("Order updated.");
      }
    });
  }

  const isUploading = pendingFiles.length > 0;

  return (
    <div>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center transition-colors hover:border-primary"
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <Upload className="h-6 w-6 text-primary" />
        )}
        <span className="font-geist text-mono-data text-on-surface-variant">
          {isUploading
            ? `Uploading ${pendingFiles.length} file${
                pendingFiles.length === 1 ? "" : "s"
              }…`
            : "Drag & drop images, GIFs, or videos — or click to browse"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {(items.length > 0 || isUploading) && (
        <div className="mt-6 grid grid-cols-1 gap-gutter sm:grid-cols-2">
          {items.map((item) => {
            const isDragging = dragId === item.id;
            const isOver = overId === item.id && dragId !== item.id;
            return (
              <div
                key={item.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(item.id);
                }}
                onDrop={() => handleDrop(item.id)}
                className={`flex flex-col bg-surface-container-lowest thin-border transition-all ${
                  isDragging ? "opacity-40" : ""
                } ${isOver ? "ring-2 ring-primary" : ""}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.caption || "media"}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-outline-variant bg-black/70 px-2 py-0.5 font-geist text-label-caps uppercase text-primary">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3">
                  <span
                    draggable
                    onDragStart={() => setDragId(item.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverId(null);
                    }}
                    aria-label="Drag to reorder"
                    className="shrink-0 cursor-grab text-on-surface-variant/50 hover:text-on-surface active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <span
                    className={`flex-1 truncate font-geist text-mono-data ${
                      item.caption
                        ? "text-on-surface"
                        : "text-on-surface-variant/50 italic"
                    }`}
                  >
                    {item.caption || "(no caption)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openCaption(item)}
                    aria-label="Edit caption"
                    className="text-on-surface-variant transition-colors hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(item)}
                    aria-label="Delete media"
                    className="text-on-surface-variant transition-colors hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Loading placeholder cards for in-flight uploads. */}
          {pendingFiles.map((name) => (
            <div
              key={`pending-${name}`}
              className="flex flex-col bg-surface-container-lowest thin-border"
            >
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-black">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
              <div className="flex items-center gap-2 p-3">
                <span className="flex-1 truncate font-geist text-mono-data text-on-surface-variant">
                  {name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 font-geist text-mono-data text-on-surface-variant/60">
        Uploads go to Storage bucket{" "}
        <code className="text-primary">{BUCKET}</code>. Drag the handle to
        reorder; click the pencil to edit a caption.
      </p>

      {/* Caption edit modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => !savingCaption && setEditing(null)}
        title="Edit Caption"
        size="md"
      >
        {editing && (
          <form
            onSubmit={saveCaption}
            onClick={(e) => e.stopPropagation()}
            className="space-y-6"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden thin-border">
              {editing.type === "video" ? (
                <video
                  src={editing.src}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <Image
                  src={editing.src}
                  alt={editing.caption || "media"}
                  fill
                  sizes="(max-width: 768px) 100vw, 28rem"
                  className="object-cover"
                />
              )}
            </div>
            <Field label="Caption">
              <TextInput
                autoFocus
                value={captionDraft}
                onChange={(e) => setCaptionDraft(e.target.value)}
                placeholder="Describe what this shows…"
              />
            </Field>
            <div className="flex justify-end gap-3">
              <AdminButton
                variant="outline"
                onClick={() => !savingCaption && setEditing(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton type="submit" disabled={savingCaption}>
                {savingCaption ? "Saving…" : "Save Caption"}
              </AdminButton>
            </div>
          </form>
        )}
      </Modal>

      {confirm.element}
    </div>
  );
}
