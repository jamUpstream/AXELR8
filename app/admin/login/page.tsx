"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase-browser";
import { TextInput, Field, AdminButton } from "@/components/admin/ui";

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const dest = searchParams.get("redirectedFrom") || "/admin";
    router.replace(dest);
    router.refresh();
  }

  return (
    <main className="grid-overlay flex min-h-screen items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 thin-border md:p-10">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/banner_logo.png"
            alt="AXLER8"
            width={180}
            height={42}
            priority
            className="h-9 w-auto"
          />
        </div>
        <h1 className="mb-2 text-center font-inter text-headline-md font-semibold">
          Admin Access
        </h1>
        <p className="mb-8 text-center font-geist text-mono-data text-on-surface-variant">
          Sign in to manage content.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@axler8.io"
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <TextInput
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="border-l-2 border-error bg-error/10 px-4 py-2 font-geist text-mono-data text-error">
              {error}
            </p>
          )}

          <AdminButton type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </AdminButton>
        </form>
      </div>
    </main>
  );
}
