import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TeamUp - The Ultimate Student Collab Platform",
  description: "Find your perfect team at ITS. Match skills, apply for roles, and build something great together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-slate-50 text-slate-800 selection:bg-blue-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
