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
  title: 'CatShop — Premium Pets',
  description: 'Premium cat products and accessories',
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

