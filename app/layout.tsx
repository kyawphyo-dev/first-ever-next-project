import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Project",
  description: "A Next.js project to practice",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`  ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="  min-h-screen flex flex-col bg-bg text-white">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
