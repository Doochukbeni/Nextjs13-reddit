import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/Toaster";

import "@/styles/globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased font-light",
        fontSans.variable
      )}
      // className={cn("bg-white text-slate-900 antialiased", inter.className)}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />

          {authModal}
          <div className="container max-w-7xl mx-auto h-full pt-12 ">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
