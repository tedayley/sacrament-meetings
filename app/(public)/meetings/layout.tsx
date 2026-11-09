import type { ReactNode } from "react";

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="space-y-8">{children}</div>;
}
