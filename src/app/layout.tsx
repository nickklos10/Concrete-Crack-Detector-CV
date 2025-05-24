import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Concrete Crack Detector - AI-Powered Analysis",
  description:
    "Advanced AI-powered concrete crack detection using deep learning technology. Upload images to detect structural issues with high accuracy.",
  keywords: [
    "concrete",
    "crack detection",
    "AI",
    "machine learning",
    "structural analysis",
    "construction",
  ],
  authors: [{ name: "Concrete Detection Team" }],
  openGraph: {
    title: "Concrete Crack Detector - AI-Powered Analysis",
    description:
      "Advanced AI-powered concrete crack detection using deep learning technology.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Crack Detector",
    description: "AI-powered concrete crack detection with deep learning.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
