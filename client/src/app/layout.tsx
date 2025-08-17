import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import classNames from 'classnames';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dictionary Game',
  description: 'A game where you guess the right definition of a word.',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          inter.className,
          'h-screen bg-gradient-to-b from-blue-900 to-purple-900',
        )}
      >
        {/* <div className="topButtons">
          <Button href="/">Home</Button>
          <Button href="/canvas">Canvas</Button>
          </div> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
