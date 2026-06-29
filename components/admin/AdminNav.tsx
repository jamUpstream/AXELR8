"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Quote,
  FileText,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/site-content", label: "Site Content", icon: FileText },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const navBody = (
    <>
      <Link
        href="/admin"
        className="mb-6 flex items-center px-2 py-2"
        onClick={() => setOpen(false)}
      >
        <Image
          src="/logo/banner_logo.png"
          alt="AXLER8 admin"
          width={200}
          height={48}
          className="h-10 w-auto"
        />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 font-geist text-label-caps uppercase tracking-[0.1em] transition-colors ${
              isActive(href, exact)
                ? "bg-surface-container text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant pt-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-error"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logo/banner_logo.png"
            alt="AXLER8 admin"
            width={140}
            height={33}
            className="h-7 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center text-on-surface"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop fixed sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest p-4 lg:flex">
        {navBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col border-r border-outline-variant bg-surface-container-lowest p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <X className="h-5 w-5" />
            </button>
            {navBody}
          </aside>
        </div>
      )}
    </>
  );
}
