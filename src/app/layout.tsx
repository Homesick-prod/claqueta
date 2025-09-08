import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import ThemeScript from '../components/ThemeScript';
import '../styles/tw.css';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
});

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
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased bg-[var(--page-bg)] text-[var(--text)]`}>
        {children}
      </body>
    </html>
  );
}