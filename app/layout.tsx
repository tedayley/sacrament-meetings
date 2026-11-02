import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NavLinks from "@/components/NavLinks";

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Website metadata
export const metadata: Metadata = {
  title: "Sacrament Meeting Planner",
  description: "Plan and organize ward sacrament meetings.",
};

// Root layout for the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">

        {/* Site header */}
        <Header wardName="Crosswinds 3rd" />

        {/* Site navigation */}
        <Suspense fallback={<div className="h-12" />}>
          <NavLinks />
        </Suspense>

        {/* Current page content */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          {children}
        </main>

        {/* Site footer */}
        <Footer />

      </body>
    </html>
  );
}
