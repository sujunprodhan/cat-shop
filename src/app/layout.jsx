import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import NextAuthProvider from '@/provider/NextAuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'CatShop — Premium Pets & Accessories',
    template: '%s | CatShop',
  },
  description: 'CatShop is your premium destination for high-quality cat products, accessories, food, and toys. Give your feline friend the best life possible.',
  keywords: ['cat', 'pets', 'cat food', 'cat toys', 'premium cat products', 'pet shop', 'cat accessories', 'ecommerce'],
  authors: [{ name: 'CatShop' }],
  creator: 'CatShop',
  openGraph: {
    title: 'CatShop — Premium Pets & Accessories',
    description: 'CatShop is your premium destination for high-quality cat products, accessories, food, and toys.',
    url: '/',
    siteName: 'CatShop',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'CatShop Premium Pets',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CatShop — Premium Pets & Accessories',
    description: 'CatShop is your premium destination for high-quality cat products, accessories, food, and toys.',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { CartProvider } from '@/provider/CartProvider';
import { FavoriteProvider } from '@/provider/FavoriteProvider';
import { ThemeProvider } from '@/provider/ThemeProvider';
import FloatingSupport from '@/components/layouts/FloatingSupport';

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <html
            lang="en"
            data-theme="night"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          >
            <head>
              {/* Anti-flash: apply saved theme before first paint */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function(){try{var t=localStorage.getItem('catshop-theme')||'night';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
                }}
              />
            </head>
            <body>
              <ThemeProvider>
                <header>
                  <Navbar />
                </header>
                <main className="pt-24 min-h-screen">{children}</main>
                <footer className="md:w-11/12 mx-auto">
                  <Footer />
                </footer>
                <FloatingSupport />
              </ThemeProvider>
            </body>
          </html>
        </FavoriteProvider>
      </CartProvider>
    </NextAuthProvider>
  );
}

