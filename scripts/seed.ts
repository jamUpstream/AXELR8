/**
 * One-time seed: migrate Phase 1 static content into Supabase.
 *
 * Usage:
 *   1. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   2. Run schema.sql in the Supabase SQL editor first
 *   3. npx tsx scripts/seed.ts          (or: npx ts-node --esm scripts/seed.ts)
 *
 * Idempotent: upserts by unique slug/key so re-running won't duplicate rows.
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { projects } from "../data/projects";
import { servicesSeed } from "../data/services";
import { testimonialsSeed } from "../data/testimonials";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedProjects() {
  for (const project of projects) {
    const { data, error } = await supabase
      .from("projects")
      .upsert(
        {
          slug: project.slug,
          title: project.title,
          client_name: project.clientName,
          industry: project.industry,
          cover_image: project.coverImage,
          summary: project.summary,
          tools: project.tools,
          published: true,
          what_business_does: project.overview.whatBusinessDoes,
          problem_before_automation: project.overview.problemBeforeAutomation,
          pain_manual_work: project.painPoints.manualWork,
          pain_repetitive_tasks: project.painPoints.repetitiveTasks,
          pain_mistakes_or_delays: project.painPoints.mistakesOrDelays,
          pain_bottlenecks: project.painPoints.bottlenecks,
          automation_description: project.automationBuilt.description,
          flow_diagram_image: project.automationBuilt.flowDiagramImage ?? null,
          tool_connections: project.automationBuilt.toolConnections,
          value_time_saved: project.valueCreated.timeSaved ?? null,
          value_manual_work_removed:
            project.valueCreated.manualWorkRemoved ?? null,
          value_errors_reduced: project.valueCreated.errorsReduced ?? null,
          value_client_experience:
            project.valueCreated.clientExperienceImproved ?? null,
          value_revenue_impact: project.valueCreated.revenueImpact ?? null,
          skills_showcased: project.skillsShowcased,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error || !data) {
      console.error(`✗ project ${project.slug}:`, error?.message);
      continue;
    }
    console.log(`✓ project: ${project.slug}`);

    // Replace media for a clean re-seed.
    await supabase.from("project_media").delete().eq("project_id", data.id);
    const mediaRows = project.media.map((m, i) => ({
      project_id: data.id,
      type: m.type,
      src: m.src,
      caption: m.caption,
      sort_order: i,
    }));
    if (mediaRows.length) {
      const { error: mediaErr } = await supabase
        .from("project_media")
        .insert(mediaRows);
      if (mediaErr) console.error(`  ✗ media ${project.slug}:`, mediaErr.message);
    }
  }
}

async function seedServices() {
  const rows = servicesSeed.map((s, i) => ({ ...s, sort_order: i }));
  const { error } = await supabase
    .from("services")
    .upsert(rows, { onConflict: "slug" });
  if (error) console.error("✗ services:", error.message);
  else console.log(`✓ services: ${rows.length}`);
}

async function seedTestimonials() {
  // testimonials have no natural unique key — clear and re-insert.
  await supabase
    .from("testimonials")
    .delete()
    .gte("created_at", "1970-01-01");
  const rows = testimonialsSeed.map((t, i) => ({ ...t, sort_order: i }));
  const { error } = await supabase.from("testimonials").insert(rows);
  if (error) console.error("✗ testimonials:", error.message);
  else console.log(`✓ testimonials: ${rows.length}`);
}

async function main() {
  await seedProjects();
  await seedServices();
  await seedTestimonials();
  console.log("\nSeed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
