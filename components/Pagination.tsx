"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousDisabled = currentPage <= 1 || totalPages === 0;
  const nextDisabled = currentPage >= totalPages || totalPages === 0;

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Meeting pagination"
      className="flex items-center justify-center gap-4"
    >
      <Link
        href={pageHref(previousDisabled ? currentPage : currentPage - 1)}
        aria-disabled={previousDisabled}
        tabIndex={previousDisabled ? -1 : undefined}
        onClick={(event) => {
          if (previousDisabled) {
            event.preventDefault();
          }
        }}
        className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-neon-blue aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        Previous
      </Link>
      <p className="text-sm text-muted" aria-live="polite">
        {totalPages === 0
          ? "No pages"
          : `Page ${currentPage} of ${totalPages}`}
      </p>
      <Link
        href={pageHref(nextDisabled ? currentPage : currentPage + 1)}
        aria-disabled={nextDisabled}
        tabIndex={nextDisabled ? -1 : undefined}
        onClick={(event) => {
          if (nextDisabled) {
            event.preventDefault();
          }
        }}
        className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-neon-blue aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        Next
      </Link>
    </nav>
  );
}
