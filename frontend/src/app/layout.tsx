import type { Metadata } from "next";
import { Geist } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: "Mini Kanban Board",
  description: "Real-time collaborative kanban board",
  icons: {
    icon: "/logo.svg",
  },
};

import { ThemeProvider } from "@/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-center" richColors style={{ fontFamily: 'var(--font-geist)' }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
