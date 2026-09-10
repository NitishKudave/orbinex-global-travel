import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'OrbinexGlobal Travel | Luxury Flights, Hotels, Umrah, Visas & Curated Tours',
  description: 'Enterprise full-stack travel booking platform covering international flights, 5-star hotels, intercity buses, electronic visas, travel insurance, Umrah packages, and medical tourism.',
  keywords: 'travel booking, flights, luxury hotels, umrah packages, visa assistance, travel insurance, holidays, europamundo, medical tourism, forex, esim',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <CartDrawer />
            <ScrollToTop />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
