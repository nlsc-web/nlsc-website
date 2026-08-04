import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConditionalSiteChrome from "@/components/layout/ConditionalSiteChrome";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Level Solutions Campus | Colombo",
  description:
    "Industry-focused courses in Colombo, designed to get you job-ready.",
  icons: {
    icon: [{ url: "/icon", sizes: "64x64", type: "image/png" }],
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
