import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harshit Anand | Frontend Engineer",
  description:
    "Software Engineer at TCS specializing in React Native, Next.js, and TypeScript. Building production mobile and web experiences.",
  openGraph: {
    title: "Harshit Anand | Frontend Engineer",
    description:
      "Software Engineer at TCS specializing in React Native, Next.js, and TypeScript. Building production mobile and web experiences.",
    type: "website",
    url: "https://harshitanand.in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
