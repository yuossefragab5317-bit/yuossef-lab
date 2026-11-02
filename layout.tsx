import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YUOSSEF LAB — Digital Studio",
  description: "A creative space for websites, apps and digital experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
