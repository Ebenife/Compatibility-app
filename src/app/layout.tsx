import type { Metadata } from "next";
import "./globals.css";
import { Container, TopBar } from "@/components/ui";

export const metadata: Metadata = {
  title: "GenoCheck — Genotype & Rh Compatibility Checker (Nigeria)",
  description:
    "Upload your genotype/blood-group document, understand what it means in plain language, optionally check a pairing, and see your options. Educational tool, not medical advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <TopBar />
        <main>
          <Container>{children}</Container>
        </main>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-3xl px-5 py-6 text-xs leading-5 text-stone-500">
            <p className="font-semibold text-stone-700">GenoCheck · test build</p>
            <p className="mt-1">
              Educational and decision-support tool — not a diagnostic or medical
              advice product. No accounts, no verification. Uploaded documents are
              processed and then deleted; nothing is retained after your result is
              generated.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
