import type { Metadata } from "next";
import { Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "saroku · Pre-Execution Agent Action Safety",
  description:
    "saroku intercepts an agent's proposed tool call before it executes and asks saroku-guard, its default judge, whether it should run.",
  keywords: [
    "agent safety",
    "pre-execution action safety",
    "AI agent security",
    "tool call safety",
    "PDP PEP",
    "ML engineering",
    "AI alignment",
  ],
  openGraph: {
    title: "saroku · Pre-Execution Agent Action Safety",
    description:
      "Every proposed tool call is judged before it runs, not after. Catch policy violations, scope violations, injection, goal drift, and corrigibility failures before they reach production.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('saroku-theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
