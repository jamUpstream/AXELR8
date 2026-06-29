import { getAdminServices } from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="font-geist text-mono-data text-on-surface-variant">
        Supabase not configured — see the dashboard.
      </p>
    );
  }
  const services = await getAdminServices();

  return (
    <div>
      <h1 className="mb-2 font-inter text-headline-lg-mobile font-bold">
        Services
      </h1>
      <p className="mb-8 font-geist text-mono-data text-on-surface-variant">
        Manage the service cards shown on the homepage and /services.
      </p>
      <ServicesManager services={services} />
    </div>
  );
}
