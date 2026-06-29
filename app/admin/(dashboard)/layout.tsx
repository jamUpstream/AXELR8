import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { ToastProvider } from "@/components/admin/ToastProvider";

export const metadata: Metadata = {
  title: "Admin | AXLER8",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen">
        <AdminNav />
        {/* Offset by the fixed sidebar width on desktop. */}
        <div className="lg:pl-64">
          <main className="mx-auto w-full max-w-5xl px-5 py-8 md:px-8 lg:py-12">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
