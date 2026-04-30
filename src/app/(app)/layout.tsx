'use client';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Tutorial from '@/components/Tutorial';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div className="sidebar-desktop" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div className="main-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, height: '100%' }}>
        {children}
      </div>
      <BottomNav />
      <Tutorial />
    </div>
  );
}
