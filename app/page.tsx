import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">

      {/* Welcome section */}
      <section className="grid items-center gap-8 md:grid-cols-2">

        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-neon-blue">
            Ward Organization
          </p>

          <h1 className="text-4xl font-bold">
            Sacrament Meeting Planner
          </h1>

          <p className="text-muted">
            Organize sacrament meetings, manage agendas, and keep track
            of speakers, hymns, prayers, and ward business.
          </p>

          <Link
            href="/meetings"
            className="inline-block rounded-md border border-neon-blue px-6 py-3 font-semibold text-neon-blue transition-colors hover:bg-neon-blue hover:text-background"
          >
            View Meetings
          </Link>
        </div>

        {/* Section image */}
        <div className="flex justify-center">
          <Image
            src="/globe.svg"
            alt="Decorative globe illustration"
            width={250}
            height={250}
            priority
          />
        </div>

      </section>

      {/* Features section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">
          Meeting Management
        </h2>

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="mb-2 text-lg font-semibold text-neon-blue">
              Meeting Agendas
            </h3>
            <p className="text-sm text-muted">
              View meeting schedules and organize each part of the agenda.
            </p>
          </div>

          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="mb-2 text-lg font-semibold text-neon-pink">
              Speakers
            </h3>
            <p className="text-sm text-muted">
              Keep track of assigned speakers and their topics.
            </p>
          </div>

          <div className="rounded-card border border-border bg-surface p-6">
            <h3 className="mb-2 text-lg font-semibold text-neon-green">
              Hymns and Prayers
            </h3>
            <p className="text-sm text-muted">
              Organize hymns, opening prayers, and closing prayers.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
