import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmSans = IBM_Plex_Sans({ 
  variable: "--font-ibm-sans", 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
});
const ibmMono = IBM_Plex_Mono({ 
  variable: "--font-ibm-mono", 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Audit Service -- Practical audits of how you actually use AI",
  description: "Fixed-price audits of AI usage across business, personal, local, and dev setups. 48 hours starting at $75.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ibmSans.variable} ${ibmMono.variable} antialiased`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
