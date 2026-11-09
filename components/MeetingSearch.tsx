"use client";

import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MeetingSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("query") ?? "";

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== query) {
      inputRef.current.value = query;
    }
  }, [query]);

  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("query", trimmedValue);
    } else {
      params.delete("query");
    }

    params.set("page", "1");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, 400);

  return (
    <form
      role="search"
      className="flex w-full max-w-xl gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        updateSearch.flush();
      }}
    >
      <input
        ref={inputRef}
        type="search"
        aria-label="Search meetings"
        placeholder="Search meeting type, leaders, speakers, or topics"
        defaultValue={query}
        onChange={(event) => updateSearch(event.target.value)}
        className="w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
      />
      <button
        type="submit"
        className="neon-button shrink-0 rounded-md px-4 py-2 text-sm font-semibold"
      >
        Search
      </button>
    </form>
  );
}
