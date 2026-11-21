import { signOut } from "@/auth";

export default function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-neon-blue px-4 py-2 text-sm font-semibold text-neon-blue transition hover:bg-neon-blue hover:text-background"
      >
        Sign Out
      </button>
    </form>
  );
}
