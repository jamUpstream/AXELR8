export const partnerLogos: string[] = [
  "ZAPIER",
  "HUBSPOT",
  "MAKE",
  "OPENAI",
  "AIRTABLE",
];

/**
 * DB-shaped seed rows for the `testimonials` table (author/company/avatar
 * schema). Used by scripts/seed.ts and rendered by the redesigned
 * Testimonials section.
 */
export const testimonialsSeed = [
  {
    quote:
      "AXLER8 connected five tools we'd been running by hand and gave us back our mornings. Orders that took an hour now take seconds.",
    author_name: "Dana Okafor",
    company: "Northwind Supply Co.",
    avatar_url: null as string | null,
    published: true,
  },
  {
    quote:
      "They didn't just hand us a Zapier zap — they architected a system. Six months in, it has not missed a beat.",
    author_name: "Marcus Reyes",
    company: "Summit Realty Partners",
    avatar_url: null as string | null,
    published: true,
  },
];
