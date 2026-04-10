import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./components/nav-bar";

export const metadata: Metadata = {
  title: "Plantometer",
  description: "Track your weekly plant diversity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
