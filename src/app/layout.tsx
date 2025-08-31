import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeScript from '../components/ThemeScript';
import '../styles/tw.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Claqueta',
  description: 'Film production management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased bg-[var(--page-bg)] text-[var(--text)]`}>
        {children}
      </body>
    </html>
  );
}