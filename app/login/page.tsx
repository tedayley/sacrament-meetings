import type { Metadata } from "next";
import Link from "next/link";

import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to create, edit, and manage Sacrament Meeting Planner agendas.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md items-center">
      <div className="neon-panel w-full space-y-6 rounded-card p-8">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-neon-blue">
            Sacrament Meeting Planner
          </p>
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-sm text-muted">
            Sign in to manage meeting agendas.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm">
          <Link href="/" className="neon-link font-semibold">
            Return to the application
          </Link>
        </p>
      </div>
    </section>
  );
}
