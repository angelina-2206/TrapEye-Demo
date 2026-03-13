import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, Fira_Code, Ramabhadra } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ramabhadra = Ramabhadra({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "TrapEye — Next-Gen Cybersecurity Detection Platform",
  description:
    "TrapEye is a cutting-edge cybersecurity platform powered by AI for deepfake detection, fake news analysis, and URL threat scanning. Protect your digital world with explainable AI.",
  keywords: [
    "cybersecurity",
    "deepfake detection",
    "phishing",
    "AI security",
    "threat detection",
    "TrapEye",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${firaCode.variable} ${ramabhadra.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
