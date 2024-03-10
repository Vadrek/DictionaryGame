import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Button } from "antd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dictionary Game",
  description: "A game where you guess the right definition of a word.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="topButtons">
          <Button href="/">Home</Button>
          <Button href="/canvas">Canvas</Button>
          <Button href="/chat">Chat</Button>
          <Button href="/chatLogin">Chat Login</Button>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
