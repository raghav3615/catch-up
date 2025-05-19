'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* No Navbar here, as we want a clean interface for video conferencing */}
      {children}
    </div>
  );
}
