import { getAdminLeads, getAdminServices } from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { LeadsManager } from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="font-geist text-mono-data text-on-surface-variant">
        Supabase not configured — see the dashboard.
      </p>
    );
  }

  const [leads, services] = await Promise.all([
    getAdminLeads(),
    getAdminServices(),
  ]);

  const serviceTitles = Object.fromEntries(
    services.map((s) => [s.slug, s.title])
  );
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-headline-lg-mobile font-bold">Leads</h1>
        <p className="mt-1 font-geist text-mono-data text-on-surface-variant">
          {leads.length} total · {newCount} new
        </p>
      </div>

      <LeadsManager leads={leads} serviceTitles={serviceTitles} />
    </div>
  );
}
