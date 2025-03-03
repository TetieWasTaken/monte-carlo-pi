import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const titleFont = localFont({
  src: "../fonts/Amulya.ttf",
  variable: "--titleFont",
});

const contentFont = localFont({
  src: "../fonts/Synonym.ttf",
  variable: "--contentFont",
});

export const metadata: Metadata = {
  title: "Monte Carlo Pi",
  description: "Approximate Pi using Monte Carlo method",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${contentFont.variable} ${titleFont.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
