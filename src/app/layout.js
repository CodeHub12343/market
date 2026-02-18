import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "@/components/Providers";
import { SocketProvider } from '@/context/SocketContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/common/Toast';
import { useNotification } from '@/context/NotificationContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import WebVitalsReporter from '@/components/WebVitalsReporter';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "University Market",
  description: "University Marketplace Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Preload Inter font weights for faster loading */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* ✅ Preload Inter CSS */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        />
        {/* ✅ DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <SocketProvider>
                <NotificationProvider>
                  {/* ✅ Lazy load to avoid blocking render */}
                  <WebVitalsReporter />
                  {children}
                </NotificationProvider>
              </SocketProvider>
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
