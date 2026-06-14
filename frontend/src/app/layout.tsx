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
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased gradient-bg text-white selection:bg-indigo-500 selection:text-white`}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[128px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        {children}
      </body>
    </html>
  );
}
