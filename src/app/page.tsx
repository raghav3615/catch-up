'use client';

import HomeComponent from '@/components/Home';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HomeComponent />
      </main>
      <Footer />
    </div>
  );
}
