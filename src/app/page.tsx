'use client';

import { useState, useEffect, useRef } from 'react';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import { BitcoinDock } from '@bitcoin-os/dock';
import ArtSidebar from '@/components/ArtSidebar';
import StudioInterface from '@/components/StudioInterface';
import MarketplaceView from '@/components/MarketplaceView';
import GalleryView from '@/components/GalleryView';
import LycheeGallery from '@/components/LycheeGallery';
import ArtExchangeView from '@/components/ArtExchangeView';
import AppHeader from '@/components/AppHeader';
import AuthModal from '@/components/AuthModal';
import { HandCashService } from '@/services/HandCashService';

type ViewMode = 'studio' | 'marketplace' | 'gallery' | 'exchange';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewMode>('gallery');
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Authentication state
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(200, e.clientX), 600);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const handleOpenExchange = () => {
      setCurrentView('exchange');
    };

    window.addEventListener('openExchange', handleOpenExchange);
    return () => window.removeEventListener('openExchange', handleOpenExchange);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track dev sidebar state
  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('devSidebarCollapsed');
        setDevSidebarCollapsed(saved !== null ? saved === 'true' : true);
      }
    };

    // Initial check
    checkSidebarState();

    // Poll for changes since localStorage events don't fire in same tab
    const interval = setInterval(checkSidebarState, 100);

    return () => clearInterval(interval);
  }, []);

  const renderMainContent = () => {
    switch (currentView) {
      case 'studio':
        return <StudioInterface />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'gallery':
        return <LycheeGallery onArtSelect={(art) => console.log('Selected art:', art)} />;
      case 'exchange':
        return <ArtExchangeView />;
      default:
        return <LycheeGallery onArtSelect={(art) => console.log('Selected art:', art)} />;
    }
  };

  const handleViewChange = (viewName: string) => {
    if (viewName === 'studio' || viewName === 'marketplace' || viewName === 'gallery' || viewName === 'exchange') {
      setCurrentView(viewName);
    } else if (viewName === 'token') {
      window.location.href = '/token';
    } else if (viewName === 'docs') {
      window.location.href = '/docs';
    } else if (viewName === 'features') {
      window.location.href = '/features';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0a',
        margin: 0,
        padding: 0,
      }}
    >
      {/* PoC Bar at the very top */}
      <ProofOfConceptBar />
      
      {/* Task Bar below PoC Bar */}
      <TopMenuBar onOpenApp={handleViewChange} />

      {/* Developer Sidebar on the left - Desktop Only */}
      {!isMobile && <DevSidebar />}

      {/* Header */}
      <AppHeader onTitleClick={() => setCurrentView('studio')} />

      {/* Main Content Area - adjusted for DevSidebar */}
      <div
        className="app-main-container"
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          marginLeft: isMobile ? '0' : (devSidebarCollapsed ? '60px' : '260px'), // Responsive to DevSidebar state
          transition: 'margin-left 0.3s ease' // Smooth transition
        }}
      >
        {/* Sidebar */}
        <div
          className="art-sidebar-container"
          style={{
            width: `${sidebarWidth}px`,
            background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
            borderRight: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <ArtSidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            onAuthRequired={() => setShowAuthModal(true)}
          />

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={() => setIsResizing(true)}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              cursor: 'col-resize',
              background: isResizing ? 'rgba(139, 92, 246, 0.5)' : 'transparent',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          />
        </div>

        {/* Main Content Area */}
        <div
          className="main-content-area"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#0a0a0a',
          }}
        >
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
        style={{
          display: isMobile ? 'flex' : 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
          zIndex: 1000,
        }}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setShowMobileMenu(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1001,
            }}
          />
          <div
            className="mobile-menu-panel"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
              zIndex: 1002,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="mobile-menu-header"
              style={{
                padding: '20px',
                borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className="mobile-menu-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🎨</span>
                <span style={{ fontWeight: 'bold' }}>Bitcoin Art</span>
              </div>
              <button
                className="mobile-menu-close"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '28px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            <div className="mobile-menu-content" style={{ flex: 1, padding: '20px' }}>
              <div className="mobile-menu-section" style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '15px', color: '#8b5cf6' }}>Navigation</h4>
                <button
                  className={`mobile-menu-item ${currentView === 'studio' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('studio');
                    setShowMobileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: currentView === 'studio' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span>🎨</span>
                  <span>Art Studio</span>
                </button>
                <button
                  className={`mobile-menu-item ${currentView === 'marketplace' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('marketplace');
                    setShowMobileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: currentView === 'marketplace' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span>🛍️</span>
                  <span>Marketplace</span>
                </button>
                <button
                  className={`mobile-menu-item ${currentView === 'gallery' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('gallery');
                    setShowMobileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: currentView === 'gallery' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span>🖼️</span>
                  <span>Gallery</span>
                </button>
                <button
                  className={`mobile-menu-item ${currentView === 'exchange' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('exchange');
                    setShowMobileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: currentView === 'exchange' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span>📈</span>
                  <span>Art Exchange</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          googleUser={googleUser}
          setGoogleUser={setGoogleUser}
          isHandCashAuthenticated={isAuthenticated}
          currentHandCashUser={currentUser}
          handcashService={handcashService}
          onHandCashLogin={() => handcashService.login()}
          onHandCashLogout={() => {
            handcashService.logout();
            setIsAuthenticated(false);
            setCurrentUser(null);
          }}
          hasTwitter={false}
          onTwitterConnect={() => console.log('Twitter connect not implemented')}
        />
      )}

      {/* Floating Dock at the bottom */}
      <BitcoinDock />
    </div>
  );
}