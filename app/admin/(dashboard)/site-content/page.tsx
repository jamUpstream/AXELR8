import { getAdminSiteContent } from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { SiteContentManager } from "@/components/admin/SiteContentManager";

export const dynamic = "force-dynamic";

export default async function AdminSiteContentPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="font-geist text-mono-data text-on-surface-variant">
        Supabase not configured — see the dashboard.
      </p>
    );
  }
  const rows = await getAdminSiteContent();

  return (
    <div>
      <h1 className="mb-2 font-inter text-headline-lg-mobile font-bold">
        Site Content
      </h1>
      <p className="mb-8 font-geist text-mono-data text-on-surface-variant">
        Edit homepage copy. Changes go live on the next revalidation.
      </p>
      <SiteContentManager rows={rows} />
    </div>
  );
}
