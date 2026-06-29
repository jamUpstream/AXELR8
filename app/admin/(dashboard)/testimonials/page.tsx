import { getAdminTestimonials } from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="font-geist text-mono-data text-on-surface-variant">
        Supabase not configured — see the dashboard.
      </p>
    );
  }
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <h1 className="mb-2 font-inter text-headline-lg-mobile font-bold">
        Testimonials
      </h1>
      <p className="mb-8 font-geist text-mono-data text-on-surface-variant">
        Manage the testimonial cards on the homepage.
      </p>
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
