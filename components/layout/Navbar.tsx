"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-outline-variant/30 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-black/80" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
        <Link href="/" className="flex items-center" aria-label="AXLER8 home">
          <Image
            src="/logo/banner_logo.png"
            alt="AXLER8"
            width={220}
            height={52}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-geist text-label-caps uppercase tracking-[0.1em] transition-colors duration-300 ${
                isActive(link.href)
                  ? "border-b border-primary pb-1 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-primary px-6 py-2 font-geist text-label-caps uppercase tracking-widest text-on-primary transition-all duration-100 hover:brightness-110 active:scale-95"
          >
            Book a Call
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-on-surface transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-on-surface transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-on-surface transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-outline-variant/30 bg-black/95 px-margin-mobile py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 font-geist text-label-caps uppercase tracking-[0.1em] ${
                isActive(link.href) ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 bg-primary px-6 py-3 text-center font-geist text-label-caps uppercase tracking-widest text-on-primary"
          >
            Book a Call
          </Link>
        </div>
      )}
    </nav>
  );
}
