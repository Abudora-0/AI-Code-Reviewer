import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeReview AI — Instant AI Code Reviews",
  description: "Paste your code and get instant AI-powered code reviews with quality scores, bug detection, and refactoring suggestions. Powered by Groq + Llama.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
