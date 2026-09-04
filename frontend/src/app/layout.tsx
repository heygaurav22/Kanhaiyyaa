import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';
import { CartProvider } from '../lib/cart-context';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GoogleOneTap } from '../components/GoogleOneTap';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'KANHAIYYA — Handcrafted Devotional Wear | Made with Love in India',
  description:
    'Handcrafted devotional wear, poshaks, silk dresses, mukut, and shringar collections for Shri Kanha, Shri Radha Rani, and Laddu Gopal Ji.',
  keywords: [
    'KANHAIYYA',
    'Kanha poshak',
    'Radha dresses',
    'Laddu Gopal poshak',
    'Janmashtami poshak',
    'Silk poshak',
    'Handcrafted devotional wear',
  ],
  icons: {
    icon: [
      { url: '/kanhaiyya-logo-transparent.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/kanhaiyya-logo-transparent.png',
    apple: '/kanhaiyya-logo-transparent.png',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#1A1A1A] font-sans">
        <AuthProvider>
          <CartProvider>
            <GoogleOneTap />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

