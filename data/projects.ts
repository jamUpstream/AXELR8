import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "ecommerce-order-fulfillment",
    title: "Order Fulfillment & Abandoned Cart Engine",
    clientName: "Northwind Supply Co.",
    industry: "E-Commerce",
    coverImage:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Connected Shopify, Klaviyo, and Google Sheets to fully automate order routing and recover abandoned carts without manual touch.",
    tools: ["Shopify", "Klaviyo", "Google Sheets", "Zapier"],
    overview: {
      whatBusinessDoes:
        "Northwind Supply Co. is a direct-to-consumer home goods brand shipping thousands of orders per month across North America.",
      problemBeforeAutomation:
        "Every order was manually exported from Shopify into spreadsheets, then re-keyed into the fulfillment system. Abandoned carts were never followed up because no one had time.",
    },
    painPoints: {
      manualWork:
        "Staff manually exported and re-entered every order into the 3PL portal each morning.",
      repetitiveTasks:
        "Daily copy-paste of order data into Google Sheets and the shipping tool.",
      mistakesOrDelays:
        "Mistyped addresses caused returned shipments and angry customers.",
      bottlenecks:
        "Fulfillment paused entirely whenever the operations lead was on leave.",
    },
    automationBuilt: {
      description:
        "A Shopify webhook fires on every paid order, normalizing the payload and pushing it to a Google Sheets ledger and the 3PL via Zapier. A parallel Klaviyo flow watches for checkout-started-but-not-completed events and triggers a three-stage recovery sequence.",
      flowDiagramImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      toolConnections:
        "Shopify (trigger: order paid → action: create row in Google Sheets + create 3PL shipment). Klaviyo (trigger: checkout started → wait 1h, 24h, 72h → send recovery emails with dynamic cart contents). Zapier orchestrates retries and error logging back into a dedicated sheet tab.",
    },
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        caption: "Live fulfillment dashboard in Google Sheets.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
        caption: "Abandoned-cart recovery sequence in Klaviyo.",
      },
    ],
    valueCreated: {
      timeSaved: "38 hrs/month",
      manualWorkRemoved: "9 workflows",
      errorsReduced: "91%",
      clientExperienceImproved:
        "Orders ship same-day and customers get timely cart reminders.",
      revenueImpact: "Recovered 14% of abandoned carts in the first quarter.",
    },
    skillsShowcased: [
      "API Integration",
      "Workflow Design",
      "Automation Logic",
      "Data Handling",
    ],
  },
  {
    slug: "healthcare-patient-intake",
    title: "Patient Intake & Scheduling System",
    clientName: "Cedar Clinic Group",
    industry: "Healthcare",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Replaced paper intake and phone-tag scheduling with an automated Jotform, Calendly, and ActiveCampaign pipeline.",
    tools: ["Jotform", "Calendly", "ActiveCampaign", "Zapier"],
    overview: {
      whatBusinessDoes:
        "Cedar Clinic Group operates three outpatient clinics handling hundreds of new patient enquiries each week.",
      problemBeforeAutomation:
        "New patients filled out paper forms in the waiting room, and front-desk staff booked appointments over the phone, leading to double-bookings and lost paperwork.",
    },
    painPoints: {
      manualWork:
        "Front-desk staff transcribed paper intake forms into the EHR by hand.",
      repetitiveTasks:
        "Phone calls back and forth to find an appointment slot.",
      mistakesOrDelays:
        "Double-bookings and missing consent forms delayed care.",
      bottlenecks:
        "A single receptionist became the chokepoint for all scheduling.",
    },
    automationBuilt: {
      description:
        "Patients complete a HIPAA-conscious Jotform that conditionally routes them to the right Calendly booking link. On booking, an ActiveCampaign automation sends confirmations, reminders, and pre-visit instructions, while structured intake data is delivered to staff.",
      flowDiagramImage:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
      toolConnections:
        "Jotform (trigger: intake submitted → branch by visit type → present Calendly embed). Calendly (trigger: event booked → push contact to ActiveCampaign). ActiveCampaign (automation: confirmation → 48h reminder → 2h SMS reminder → post-visit follow-up). Zapier syncs structured fields into the staff worksheet.",
    },
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
        caption: "Conditional intake form built in Jotform.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
        caption: "Automated reminder sequence in ActiveCampaign.",
      },
    ],
    valueCreated: {
      timeSaved: "52 hrs/month",
      manualWorkRemoved: "11 workflows",
      errorsReduced: "96%",
      clientExperienceImproved:
        "Patients self-schedule in minutes and arrive prepared.",
      revenueImpact: "No-show rate dropped by 31%.",
    },
    skillsShowcased: [
      "Client Onboarding Systems",
      "Workflow Design",
      "Data Handling",
      "CRM Setup",
    ],
  },
  {
    slug: "real-estate-lead-pipeline",
    title: "Lead Capture & CRM Follow-Up Pipeline",
    clientName: "Summit Realty Partners",
    industry: "Real Estate",
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Unified inbound calls and web leads into a Monday.com pipeline with automatic follow-up sequences via CallRail and Zapier.",
    tools: ["CallRail", "Monday.com", "Zapier", "ActiveCampaign"],
    overview: {
      whatBusinessDoes:
        "Summit Realty Partners is a residential brokerage with a team of 20 agents fielding leads from listings, ads, and referrals.",
      problemBeforeAutomation:
        "Leads arrived through five channels and were tracked in scattered notebooks and inboxes. Hot leads went cold because no one followed up fast enough.",
    },
    painPoints: {
      manualWork:
        "Agents manually logged every call and web enquiry into spreadsheets.",
      repetitiveTasks: "Copy-pasting lead details between email, phone, and CRM.",
      mistakesOrDelays:
        "Leads waited hours or days for a first response.",
      bottlenecks:
        "No single source of truth for which agent owned which lead.",
    },
    automationBuilt: {
      description:
        "CallRail captures and attributes inbound calls; web forms and call data flow into a single Monday.com board where leads are auto-assigned by territory. New leads instantly enter an ActiveCampaign nurture sequence until an agent makes contact.",
      flowDiagramImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      toolConnections:
        "CallRail (trigger: inbound call → capture source + recording). Zapier (route call + web form → create Monday.com item, assign by ZIP). Monday.com (status change automations notify agents). ActiveCampaign (instant SMS + email nurture until status = contacted).",
    },
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
        caption: "Unified lead pipeline board in Monday.com.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
        caption: "Call attribution and routing in CallRail.",
      },
    ],
    valueCreated: {
      timeSaved: "44 hrs/month",
      manualWorkRemoved: "8 workflows",
      errorsReduced: "88%",
      clientExperienceImproved:
        "Every lead gets a response within 60 seconds.",
      revenueImpact: "Lead-to-appointment conversion up 27%.",
    },
    skillsShowcased: [
      "CRM Setup",
      "Automation Logic",
      "Reporting & Dashboards",
      "API Integration",
    ],
  },
  {
    slug: "saas-trial-onboarding",
    title: "Trial-to-Paid Onboarding & Billing Automation",
    clientName: "Helmsly Analytics",
    industry: "SaaS",
    coverImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Automated trial onboarding, Stripe billing transitions, and Slack alerts so the team could focus on high-intent accounts.",
    tools: ["Stripe", "Slack", "Segment", "Zapier"],
    overview: {
      whatBusinessDoes:
        "Helmsly Analytics provides a self-serve product analytics platform for B2B software teams.",
      problemBeforeAutomation:
        "Trial signups were handled ad hoc, billing edge cases were caught late, and the team had no visibility into which trials were converting.",
    },
    painPoints: {
      manualWork:
        "Founders manually emailed each new trial and watched Stripe for conversions.",
      repetitiveTasks:
        "Checking dashboards daily to see which trials were active.",
      mistakesOrDelays:
        "Failed payments and expiring trials slipped through unnoticed.",
      bottlenecks:
        "Onboarding quality depended entirely on who happened to be online.",
    },
    automationBuilt: {
      description:
        "Product events from Segment drive a milestone-based onboarding sequence. Stripe webhooks manage trial-end conversions, dunning on failed payments, and upgrade/downgrade events—each surfaced to the right Slack channel in real time.",
      flowDiagramImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      toolConnections:
        "Segment (trigger: activation milestones → tag account health). Stripe (webhooks: trial_will_end, invoice.payment_failed, subscription.updated → automated emails + dunning). Zapier (routes events → posts enriched alerts to #revenue and #at-risk Slack channels).",
    },
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=1200&q=80",
        caption: "Real-time revenue alerts in Slack.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        caption: "Stripe billing automation flow.",
      },
    ],
    valueCreated: {
      timeSaved: "60 hrs/month",
      manualWorkRemoved: "14 workflows",
      errorsReduced: "94%",
      clientExperienceImproved:
        "New users hit activation faster with timely nudges.",
      revenueImpact: "Trial-to-paid conversion improved by 22%.",
    },
    skillsShowcased: [
      "API Integration",
      "Automation Logic",
      "AI Implementation",
      "Reporting & Dashboards",
    ],
  },
  {
    slug: "professional-services-onboarding",
    title: "Client Onboarding, Contracts & Invoicing",
    clientName: "Meridian Advisory",
    industry: "Professional Services",
    coverImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Built a hands-off onboarding flow connecting Jotform, DocuSign, and QuickBooks from first enquiry to first invoice.",
    tools: ["Jotform", "DocuSign", "QuickBooks", "Zapier"],
    overview: {
      whatBusinessDoes:
        "Meridian Advisory is a boutique consulting firm delivering financial and operations advisory to mid-market clients.",
      problemBeforeAutomation:
        "Onboarding a new client took a week of back-and-forth emails to gather details, send contracts, and set up invoicing.",
    },
    painPoints: {
      manualWork:
        "Partners drafted contracts and invoices by hand for every engagement.",
      repetitiveTasks:
        "Re-entering the same client details into three separate systems.",
      mistakesOrDelays:
        "Contracts sat unsigned and invoices went out late.",
      bottlenecks:
        "Billable work couldn't start until paperwork cleared.",
    },
    automationBuilt: {
      description:
        "A single onboarding Jotform captures scope and client details, auto-generates a DocuSign agreement from a template, and—once signed—creates the customer and first invoice in QuickBooks while kicking off the internal project setup.",
      flowDiagramImage:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
      toolConnections:
        "Jotform (trigger: onboarding submitted → map fields). Zapier (generate DocuSign envelope from template, prefilled). DocuSign (trigger: envelope completed → create QuickBooks customer + draft invoice + notify delivery team).",
    },
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
        caption: "Automated contract generation via DocuSign.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
        caption: "Invoice creation in QuickBooks on signature.",
      },
    ],
    valueCreated: {
      timeSaved: "33 hrs/month",
      manualWorkRemoved: "10 workflows",
      errorsReduced: "92%",
      clientExperienceImproved:
        "Clients are onboarded and invoiced within a day, not a week.",
      revenueImpact: "Time-to-first-invoice cut from 7 days to under 24 hours.",
    },
    skillsShowcased: [
      "Client Onboarding Systems",
      "Workflow Design",
      "API Integration",
      "Data Handling",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
