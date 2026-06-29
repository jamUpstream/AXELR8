"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Mail, Send, Clock, CalendarClock } from "lucide-react";
import {
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
  bulkSetLeadStatus,
  sendLeadReply,
  getLeadEmails,
} from "@/app/admin/actions";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Field, TextInput, AdminButton } from "@/components/admin/ui";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { calendlyUrl, openCalendlyPopup } from "@/lib/calendly";
import type { LeadEmailRow } from "@/types";
import { useToast } from "@/components/admin/ToastProvider";

/** Branded "Schedule a Call" button block for the email body (inline styles). */
function schedulingButtonHtml(url: string): string {
  return `<p><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#a3c9ff;color:#00315d;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:12px 28px;font-size:13px;">Schedule a Call →</a></p>`;
}
import { adminInputClass, BulkButton } from "@/components/admin/ui";
import { LEAD_STATUSES, type LeadRow, type LeadStatus } from "@/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "border-primary/40 text-primary",
  contacted: "border-outline text-on-surface",
  qualified: "border-primary/40 text-primary",
  won: "border-primary/60 text-primary",
  lost: "border-error/50 text-error",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function LeadsManager({
  leads,
  serviceTitles,
}: {
  leads: LeadRow[];
  /** slug → title map for displaying chosen services. */
  serviceTitles: Record<string, string>;
}) {
  const router = useRouter();
  const [viewing, setViewing] = useState<LeadRow | null>(null);
  const [composing, setComposing] = useState<LeadRow | null>(null);
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();
  const toast = useToast();

  // Compose state (scoped to the compose modal).
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [history, setHistory] = useState<LeadEmailRow[]>([]);
  const insertHtmlRef = useRef<((html: string) => void) | null>(null);
  const hasCalendly = Boolean(calendlyUrl());

  async function scheduleViaCalendly() {
    if (!composing) return;
    const url = calendlyUrl();
    if (!url) return;
    setScheduling(true);
    const booked = await openCalendlyPopup({
      name: composing.name,
      email: composing.email,
    });
    setScheduling(false);
    if (booked) {
      insertHtmlRef.current?.(schedulingButtonHtml(url));
      toast.success("Booking scheduled — scheduling button added to the email.");
    }
  }

  // Load email history + reset the composer whenever the compose modal opens.
  useEffect(() => {
    if (!composing) return;
    setSubject("Re: Your enquiry to AXLER8");
    setBody("");
    setHistory([]);
    getLeadEmails(composing.id).then(setHistory);
  }, [composing]);

  async function sendReply() {
    if (!composing) return;
    setSending(true);
    const res = await sendLeadReply({
      leadId: composing.id,
      toEmail: composing.email,
      subject,
      bodyHtml: body,
    });
    setSending(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(`Reply sent to ${composing.email}.`);
    setBody("");
    getLeadEmails(composing.id).then(setHistory);
    router.refresh();
  }

  function setStatus(lead: LeadRow, status: LeadStatus) {
    startTransition(async () => {
      const res = await updateLeadStatus(lead.id, status);
      if (res.error) toast.error(res.error);
      else {
        toast.success(`Marked “${lead.name}” as ${STATUS_LABEL[status]}.`);
        router.refresh();
      }
    });
  }

  function requestDelete(lead: LeadRow) {
    confirm.open({
      title: "Delete lead",
      message: `Delete the lead from “${lead.name}”? This cannot be undone.`,
      destructive: true,
      confirmLabel: "Delete lead",
      onConfirm: async () => {
        const res = await deleteLead(lead.id);
        if (res.error) return res;
        toast.success("Lead deleted.");
        if (viewing?.id === lead.id) setViewing(null);
        router.refresh();
      },
    });
  }

  function bulkSetStatus(ids: string[], status: LeadStatus, clear: () => void) {
    startTransition(async () => {
      const res = await bulkSetLeadStatus(ids, status);
      if (res.error) toast.error(res.error);
      else {
        toast.success(
          `${ids.length} lead${ids.length === 1 ? "" : "s"} marked ${
            STATUS_LABEL[status]
          }.`
        );
        clear();
        router.refresh();
      }
    });
  }

  function bulkDelete(ids: string[], clear: () => void) {
    confirm.open({
      title: "Delete leads",
      message: `Delete ${ids.length} lead${
        ids.length === 1 ? "" : "s"
      }? This cannot be undone.`,
      destructive: true,
      confirmLabel: `Delete ${ids.length}`,
      onConfirm: async () => {
        const res = await bulkDeleteLeads(ids);
        if (res.error) return res;
        toast.success(`${ids.length} lead${ids.length === 1 ? "" : "s"} deleted.`);
        clear();
        router.refresh();
      },
    });
  }

  const columns: Column<LeadRow>[] = [
    {
      header: "Lead",
      cell: (l) => (
        <span className="min-w-0">
          <span className="block truncate text-on-surface">{l.name}</span>
          <span className="block truncate font-geist text-mono-data text-on-surface-variant">
            {l.email}
          </span>
        </span>
      ),
    },
    {
      header: "Company",
      cell: (l) => (
        <span className="font-geist text-mono-data text-on-surface-variant">
          {l.company || "—"}
        </span>
      ),
    },
    {
      header: "Received",
      hideOnMobile: true,
      cell: (l) => (
        <span className="font-geist text-mono-data text-on-surface-variant">
          {formatDate(l.created_at)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (l) => (
        <select
          value={l.status}
          disabled={pending}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setStatus(l, e.target.value as LeadStatus)}
          className={`${adminInputClass} max-w-[10rem] cursor-pointer px-3 py-1.5`}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        rows={leads}
        columns={columns}
        getRowKey={(l) => l.id}
        searchableText={(l) =>
          `${l.name} ${l.email} ${l.company ?? ""} ${l.message}`
        }
        searchPlaceholder="Search leads…"
        emptyMessage="No leads yet. Submissions from the contact form appear here."
        selection={{
          renderBulkActions: (ids, clear) => (
            <>
              <select
                defaultValue=""
                disabled={pending}
                onChange={(e) => {
                  if (e.target.value) {
                    bulkSetStatus(ids, e.target.value as LeadStatus, clear);
                    e.target.value = "";
                  }
                }}
                className={`${adminInputClass} cursor-pointer px-3 py-2`}
                aria-label="Set status for selected"
              >
                <option value="" disabled>
                  Set status…
                </option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <BulkButton variant="danger" onClick={() => bulkDelete(ids, clear)}>
                <Trash2 className="h-4 w-4" /> Delete
              </BulkButton>
            </>
          ),
        }}
        actions={(l) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setViewing(l)}
              aria-label="View lead"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setComposing(l)}
              aria-label="Email lead"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => requestDelete(l)}
              aria-label="Delete lead"
              className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      {/* Detail modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Lead Details"
        size="lg"
      >
        {viewing && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-inter text-headline-md font-semibold">
                  {viewing.name}
                </h3>
                <a
                  href={`mailto:${viewing.email}`}
                  className="mt-1 inline-flex items-center gap-2 font-geist text-mono-data text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {viewing.email}
                </a>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 font-geist text-label-caps uppercase tracking-[0.1em] ${
                  STATUS_STYLE[viewing.status]
                }`}
              >
                {STATUS_LABEL[viewing.status]}
              </span>
            </div>

            <Detail label="Company" value={viewing.company || "—"} />
            <Detail label="Received" value={formatDate(viewing.created_at)} />

            <div>
              <p className="mb-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                Message
              </p>
              <p className="whitespace-pre-wrap border-l-2 border-primary bg-surface-container px-4 py-3 font-body-md text-on-surface">
                {viewing.message}
              </p>
            </div>

            <ChipList
              label="Tools used"
              items={[
                ...(viewing.tools ?? []),
                ...(viewing.tools_other ? [`${viewing.tools_other} (other)`] : []),
              ]}
            />

            <ChipList
              label="Services of interest"
              items={(viewing.service_slugs ?? []).map(
                (slug) => serviceTitles[slug] ?? slug
              )}
            />

            <div className="flex flex-wrap items-center gap-3 border-t border-outline-variant pt-6">
              <span className="font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                Set status:
              </span>
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={pending || viewing.status === s}
                  onClick={() => setStatus(viewing, s)}
                  className={`rounded-full border px-3 py-1 font-geist text-label-caps uppercase tracking-[0.1em] transition-colors disabled:opacity-100 ${
                    viewing.status === s
                      ? STATUS_STYLE[s]
                      : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="border-t border-outline-variant pt-6">
              <AdminButton
                onClick={() => {
                  const lead = viewing;
                  setViewing(null);
                  setComposing(lead);
                }}
              >
                <Send className="h-4 w-4" /> Compose Reply
              </AdminButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Compose / email modal */}
      <Modal
        open={Boolean(composing)}
        onClose={() => !sending && setComposing(null)}
        title={composing ? `Email ${composing.name}` : "Email"}
        size="lg"
      >
        {composing && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 bg-surface-container px-4 py-2.5 font-geist text-mono-data text-on-surface-variant thin-border">
              <Mail className="h-4 w-4 text-primary" />
              To: <span className="text-on-surface">{composing.email}</span>
            </div>

            <Field label="Subject">
              <TextInput
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Re: Your enquiry"
              />
            </Field>
            <Field label="Message">
              <RichTextEditor
                value={body}
                onChange={setBody}
                onInsertReady={(fn) => (insertHtmlRef.current = fn)}
              />
            </Field>

            {hasCalendly && (
              <BulkButton onClick={scheduleViaCalendly} disabled={scheduling}>
                <CalendarClock className="h-4 w-4" />
                {scheduling ? "Opening Calendly…" : "Schedule via Calendly"}
              </BulkButton>
            )}

            <div className="flex justify-end gap-3">
              <AdminButton
                variant="outline"
                onClick={() => !sending && setComposing(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton onClick={sendReply} disabled={sending}>
                {sending ? "Sending…" : "Send Reply"}
                <Send className="h-4 w-4" />
              </AdminButton>
            </div>

            {history.length > 0 && (
              <div className="border-t border-outline-variant pt-5">
                <p className="mb-3 flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                  <Clock className="h-4 w-4" /> Sent History
                </p>
                <div className="space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="bg-surface-container px-4 py-2.5 thin-border"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-body-md text-on-surface">
                          {h.subject}
                        </span>
                        <span className="font-geist text-mono-data text-on-surface-variant">
                          {new Date(h.sent_at).toLocaleString()}
                        </span>
                      </div>
                      {h.error ? (
                        <p className="mt-1 font-geist text-mono-data text-error">
                          Failed: {h.error}
                        </p>
                      ) : (
                        <p className="mt-1 font-geist text-mono-data text-primary">
                          Delivered to {h.to_email}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {confirm.element}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
        {label}
      </span>
      <span className="font-body-md text-on-surface">{value}</span>
    </div>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
        {label}
      </p>
      {items.length === 0 ? (
        <p className="font-geist text-mono-data text-on-surface-variant/60">
          None selected
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-outline-variant bg-surface-container px-3 py-1 font-geist text-mono-data text-on-surface"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
