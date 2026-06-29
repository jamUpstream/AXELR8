/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage. Either keep this wildcard or replace with your
      // exact project hostname, e.g. "your-project-ref.supabase.co".
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
