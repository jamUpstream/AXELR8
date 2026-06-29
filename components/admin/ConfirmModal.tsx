"use client";

import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { AdminButton } from "@/components/admin/ui";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  /** The async work to run on confirm. Return { error } to show it inline. */
  onConfirm: () => Promise<{ error?: string } | void>;
}

/**
 * Imperative confirm dialog. Usage:
 *   const confirm = useConfirm();
 *   <button onClick={() => confirm.open({ title, message, onConfirm })} />
 *   {confirm.element}
 */
export function useConfirm() {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback((options: ConfirmOptions) => {
    setError(null);
    setOpts(options);
  }, []);

  const close = useCallback(() => {
    if (pending) return;
    setOpts(null);
    setError(null);
  }, [pending]);

  const confirm = useCallback(async () => {
    if (!opts) return;
    setPending(true);
    setError(null);
    const res = await opts.onConfirm();
    setPending(false);
    if (res && "error" in res && res.error) {
      setError(res.error);
      return;
    }
    setOpts(null);
  }, [opts]);

  const element = (
    <Modal open={Boolean(opts)} onClose={close} title={opts?.title} size="md">
      {opts && (
        <div>
          <div className="mb-6 flex gap-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                opts.destructive
                  ? "bg-error/10 text-error"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
            <p className="font-body-md text-on-surface-variant">
              {opts.message}
            </p>
          </div>

          {error && (
            <p className="mb-4 border-l-2 border-error bg-error/10 px-4 py-2 font-geist text-mono-data text-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <AdminButton variant="outline" onClick={close} disabled={pending}>
              Cancel
            </AdminButton>
            <AdminButton
              variant={opts.destructive ? "danger" : "primary"}
              onClick={confirm}
              disabled={pending}
            >
              {pending
                ? "Working…"
                : opts.confirmLabel ?? (opts.destructive ? "Delete" : "Confirm")}
            </AdminButton>
          </div>
        </div>
      )}
    </Modal>
  );

  return { open, element };
}
