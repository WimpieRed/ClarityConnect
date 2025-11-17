import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

