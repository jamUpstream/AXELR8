import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-gutter border-t border-outline-variant bg-black px-margin-mobile py-20 md:flex-row md:px-margin-desktop">
      <div className="flex flex-col items-center gap-4 md:items-start">
        <Link href="/" aria-label="AXLER8 home">
          <Image
            src="/logo/banner_logo.png"
            alt="AXLER8"
            width={160}
            height={38}
            className="h-9 w-auto"
          />
        </Link>
        <p className="font-body-md text-body-md uppercase tracking-wide text-on-surface-variant opacity-60">
          © {new Date().getFullYear()} AXLER8 Automation. All rights reserved.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-body-md text-body-md text-on-surface-variant underline-offset-4 transition-all hover:text-on-surface hover:underline"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="https://www.linkedin.com"
          aria-label="LinkedIn"
          className="text-on-surface-variant transition-colors hover:text-primary"
        >
          <Linkedin className="h-5 w-5" />
        </Link>
      </div>
    </footer>
  );
}
