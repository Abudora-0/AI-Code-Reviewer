import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "CODEREVIEW.SYS — AI Code Audit Terminal",
  description: "Paste your code and get an instant AI-powered audit: quality score, bug detection, security flags, and a refactored version. Powered by Groq + Llama.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
