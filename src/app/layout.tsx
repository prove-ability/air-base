import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Nav } from "./_components/nav";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={GeistSans.variable}>
      <body className="bg-white dark:bg-[#0A0A0A]">
        <TRPCReactProvider>
          <Nav>{children}</Nav>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
