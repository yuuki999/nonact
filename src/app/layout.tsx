// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from '../components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'レンタル何もしない人 | 何もしないをレンタル',
  description: '何もしない人のマッチングプラットフォーム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-amber-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow flex-shrink-0">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}