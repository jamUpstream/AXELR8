import type { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    quote:
      "We're using five different tools but none of them are connected. Everything still has to be done manually.",
    status: "CRITICAL FAILURE",
    statusTone: "error",
  },
  {
    quote:
      "I don't have time to figure out Zapier or APIs. I need someone who can just build the system.",
    status: "RESOURCE DEPLETED",
    statusTone: "error",
  },
];

export const partnerLogos: string[] = [
  "ZAPIER",
  "HUBSPOT",
  "MAKE",
  "OPENAI",
  "AIRTABLE",
];
