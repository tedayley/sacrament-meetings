import { Suspense, type ReactNode } from "react";
import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import { redirect } from "next/navigation";
import { connection } from "next/server";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <p className="animate-pulse text-neon-blue">Checking access...</p>
        </div>
      }
    >
      <AuthenticatedAdmin>{children}</AuthenticatedAdmin>
    </Suspense>
  );
}

async function AuthenticatedAdmin({ children }: AdminLayoutProps) {
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <SignOutButton />
      </div>
      {children}
    </div>
  );
}
