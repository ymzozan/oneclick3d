import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CreditsProvider } from "@/components/CreditsProvider";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneClick3D — Image to casting-ready jewelry",
  description:
    "A production pipeline for jewelers and artists: turn a reference image into a 3D model, map gemstone seats, and prepare for sculpting, CAD and casting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <CreditsProvider>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
          </CreditsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
