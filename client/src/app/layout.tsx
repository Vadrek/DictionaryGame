import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dictionary Game",
  description: "A game where you guess the right definition of a word.",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <h1 style={{ justifyContent: "center" }}>Jeu du Dictionnaire 📚</h1>
        </div>
        {/* <div className="topButtons">
          <Button href="/">Home</Button>
          <Button href="/canvas">Canvas</Button>
        </div> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
