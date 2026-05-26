import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Garfield Roast — Your Code Will Be Judged',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          defer
        />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
