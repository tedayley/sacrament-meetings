
interface HeaderProps {
  wardName?: string;
}

export default function Header({
  wardName = "Sacrament Meeting Planner",
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface px-6 py-5 shadow-neon-blue">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-neon-blue">
            {wardName}
          </h1>

          <p className="text-sm text-muted">
            Sacrament Meeting Planner
          </p>
        </div>

        <p className="text-sm text-muted">
          Ward Meeting Planner
        </p>
      </div>
    </header>
  );
}
