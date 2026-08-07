import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import ConditionalSiteChrome from "@/components/layout/ConditionalSiteChrome";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const themeScript = `(function () {
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
})();`;

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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      <body className={`${inter.className} min-h-full font-sans antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
