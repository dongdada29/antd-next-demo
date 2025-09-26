import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from '@/providers/QueryProvider';
import { cn } from "@/lib/utils";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'shadcn/ui Next.js Template',
  description: 'A modern web application template built with Next.js, shadcn/ui, and Tailwind CSS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}