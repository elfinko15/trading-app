import type { Metadata, Viewport } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Tutorial from '@/components/Tutorial';

export const metadata: Metadata = {
  title: 'TradeMaster Pro',
  description: 'Lerne Trading wie ein Profi — gamifiziert & risikolos',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Desktop sidebar — hidden on iPad/mobile via .sidebar-desktop CSS class */}
        <div className="sidebar-desktop" style={{ flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* Main scrollable area */}
        <div className="main-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0 }}>
          {children}
        </div>

        {/* Bottom nav — shown only on iPad/mobile via CSS */}
        <BottomNav />

        <Tutorial />
      </body>
    </html>
  );
}
