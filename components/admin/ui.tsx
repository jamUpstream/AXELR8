import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Shared admin form primitives, themed to the dark AXLER8 system. */

export const adminInputClass =
  "w-full border border-outline-variant bg-surface-container-lowest px-4 py-2.5 font-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none focus:ring-0 transition-colors";

export const adminLabelClass =
  "mb-2 block font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant";

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={adminLabelClass}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 font-geist text-mono-data text-on-surface-variant/60">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={adminInputClass} />;
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  // min-h keeps two lines visible so the resize handle can't collapse it.
  return (
    <textarea
      {...props}
      className={`${adminInputClass} min-h-[5rem] resize-y leading-relaxed ${className}`}
    />
  );
}

export function AdminButton({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "danger";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    primary: "bg-primary text-on-primary hover:brightness-110",
    outline:
      "border border-outline-variant text-on-surface hover:border-primary",
    danger: "border border-error/50 text-error hover:bg-error/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 font-geist text-label-caps uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

/** Compact button for the bulk-action bar. */
export function BulkButton({
  children,
  onClick,
  disabled,
  variant = "outline",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "outline" | "danger";
}) {
  const variants = {
    outline:
      "border border-outline-variant text-on-surface hover:border-primary",
    danger: "border border-error/50 text-error hover:bg-error/10",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-geist text-label-caps uppercase tracking-[0.1em] transition-all active:scale-95 disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-surface-container-lowest p-6 thin-border md:p-8">
      <h2 className="mb-6 font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
        {title}
      </h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-geist text-label-caps uppercase tracking-[0.1em] ${
        published
          ? "border-primary/40 text-primary"
          : "border-outline-variant text-on-surface-variant"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published ? "bg-primary" : "bg-outline"
        }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
