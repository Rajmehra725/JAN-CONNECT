import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jan Connect | Citizen Connectivity Portal",
    template: "%s | Jan Connect",
  },
  description:
    "Jan Connect - नागरिकों को सार्वजनिक सेवाओं, सूचनाओं और डिजिटल सुविधाओं से जोड़ने वाला नागरिक संपर्क पोर्टल।",
  keywords: [
    "Jan Connect",
    "Citizen Portal",
    "Citizen Services",
    "Public Services",
    "Government Services",
    "Madhya Pradesh",
  ],
  authors: [{ name: "Jan Connect" }],
  creator: "Jan Connect",
  applicationName: "Jan Connect",
  icons: {
    icon: "/favicon.ico",
  },
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AuthProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}