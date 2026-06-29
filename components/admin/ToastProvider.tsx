"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DURATION = 4000;

const config: Record<
  ToastTone,
  { icon: typeof CheckCircle2; accent: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    accent: "border-l-primary",
    iconColor: "text-primary",
  },
  error: {
    icon: AlertTriangle,
    accent: "border-l-error",
    iconColor: "text-error",
  },
  info: { icon: Info, accent: "border-l-outline", iconColor: "text-on-surface" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  // Only portal after mount so server and first client render agree (both
  // render no overlay) — avoids a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = ++counter.current;
      setToasts((t) => [...t, { id, tone, message }]);
      setTimeout(() => remove(id), DURATION);
    },
    [remove]
  );

  const api = useRef<ToastApi>({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  });
  // Keep the closures fresh.
  api.current = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  };

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-4 bottom-6 z-[200] flex flex-col items-center gap-3 sm:left-auto sm:right-6 sm:items-end">
            {toasts.map((t) => {
              const { icon: Icon, accent, iconColor } = config[t.tone];
              return (
                <div
                  key={t.id}
                  role="status"
                  className={`animate-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 border border-outline-variant border-l-2 ${accent} bg-surface-container-lowest px-4 py-3 shadow-2xl`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
                  <p className="flex-1 font-body-md text-on-surface">
                    {t.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    aria-label="Dismiss"
                    className="text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
