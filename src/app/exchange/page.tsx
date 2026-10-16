'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function ExchangePage() {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => checkMobile();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen bg-black text-white ${
        !isMobile && !devSidebarCollapsed ? 'pl-[50px]' : ''
      } ${!isMobile && devSidebarCollapsed ? 'pl-[50px]' : ''}`}
      style={{
        marginTop: '112px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Art Exchange
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Trade digital art NFTs, tokens, and fractional art shares
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-gray-900/50 p-8 text-center text-gray-300">
          No artworks, tokens or art shares are listed yet. When artists list work it will appear here, and trades
          will settle from your own wallet.
        </div>
      </div>
      <Footer />
    </div>
  );
}