'use client'

import { useState, useRef, useEffect } from 'react'
import { Github, BookOpen, FileText, ExternalLink } from 'lucide-react'
import '../styles/TopMenuBar.css'

interface MenuItem {
  label?: string
  action?: () => void
  href?: string
  divider?: boolean
  shortcut?: string
  icon?: string
  external?: boolean
}

interface Menu {
  label: string
  items: MenuItem[]
}

interface TopMenuBarProps {
  onOpenApp?: (appName: string) => void
}

export default function TopMenuBar({ onOpenApp }: TopMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showBAppsMenu, setShowBAppsMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const bitcoinApps = [
    { name: 'Bitcoin Auth', color: '#ef4444', url: '#' },
    { name: 'Bitcoin Calendar', color: '#d946ef', url: 'https://bitcoin-calendar.vercel.app' },
    { name: 'Bitcoin Chat', color: '#ff6500', url: '#' },
    { name: 'Bitcoin Domains', color: '#eab308', url: '#' },
    { name: 'Bitcoin Draw', color: '#10b981', url: '#' },
    { name: 'Bitcoin Drive', color: '#22c55e', url: 'https://bitcoin-drive.vercel.app' },
    { name: 'Bitcoin Email', color: '#06b6d4', url: 'https://bitcoin-email.vercel.app' },
    { name: 'Bitcoin Exchange', color: '#3b82f6', url: 'https://bitcoin-exchange.vercel.app' },
    { name: 'Bitcoin Jobs', color: '#6b7280', url: '#' },
    { name: 'Bitcoin Music', color: '#8b5cf6', url: 'https://bitcoin-music.vercel.app' },
    { name: 'Bitcoin Paint', color: '#a855f7', url: '#' },
    { name: 'Bitcoin Pics', color: '#ec4899', url: '#' },
    { name: 'Bitcoin Registry', color: '#f43f5e', url: '#' },
    { name: 'Bitcoin Search', color: '#6b7280', url: 'https://bitcoin-search.vercel.app' },
    { name: 'Bitcoin Shares', color: '#f43f5e', url: 'https://bitcoin-shares.vercel.app' },
    { name: 'Bitcoin Spreadsheets', color: '#3b82f6', url: 'https://bitcoin-spreadsheet.vercel.app' },
    { name: 'Bitcoin Video', color: '#65a30d', url: '#' },
    { name: 'Bitcoin Wallet', color: '#f59e0b', url: 'https://bitcoin-wallet-sable.vercel.app' },
    { name: 'Bitcoin Writer', color: '#ff9500', url: 'https://bitcoin-writer.vercel.app' }
  ]

  const menus: Menu[] = [
    {
      label: 'Bitcoin Art',
      items: [
        { 
          label: 'About Bitcoin Art', 
          action: () => alert('Bitcoin Art v1.0\n\nCreate, collect, and trade digital art NFTs on Bitcoin\n\n© 2025 The Bitcoin Corporation LTD\nRegistered in England and Wales • Company No. 16735102') 
        },
        { 
          label: 'Features', 
          action: () => onOpenApp?.('features')
        },
        { divider: true },
        { 
          label: 'System Preferences', 
          shortcut: '⌘,',
          action: () => onOpenApp?.('Settings')
        },
        { 
          label: 'Authentication Settings', 
          action: () => console.log('Auth Settings')
        },
        { divider: true },
        { 
          label: 'Lock Screen', 
          shortcut: '⌘L',
          action: () => console.log('Lock Screen')
        },
        { 
          label: 'Log Out', 
          action: () => console.log('Log Out')
        },
        { 
          label: 'Shut Down', 
          action: () => console.log('Shut Down')
        },
      ]
    },
    {
      label: 'File',
      items: [
        { 
          label: 'New Window', 
          shortcut: '⌘N',
          action: () => console.log('New Window')
        },
        { 
          label: 'New Folder', 
          shortcut: '⇧⌘N',
          action: () => console.log('New Folder')
        },
        { divider: true },
        { 
          label: 'Open', 
          shortcut: '⌘O',
          action: () => console.log('Open')
        },
        { 
          label: 'Save', 
          shortcut: '⌘S',
          action: () => console.log('Save')
        },
        { divider: true },
        { 
          label: 'Close Window', 
          shortcut: '⌘W',
          action: () => console.log('Close')
        }
      ]
    },
    {
      label: 'Edit',
      items: [
        { 
          label: 'Undo', 
          shortcut: '⌘Z',
          action: () => document.execCommand('undo')
        },
        { 
          label: 'Redo', 
          shortcut: '⇧⌘Z',
          action: () => document.execCommand('redo')
        },
        { divider: true },
        { 
          label: 'Cut', 
          shortcut: '⌘X',
          action: () => document.execCommand('cut')
        },
        { 
          label: 'Copy', 
          shortcut: '⌘C',
          action: () => document.execCommand('copy')
        },
        { 
          label: 'Paste', 
          shortcut: '⌘V',
          action: () => document.execCommand('paste')
        },
        { divider: true },
        { 
          label: 'Select All', 
          shortcut: '⌘A',
          action: () => document.execCommand('selectAll')
        },
        { 
          label: 'Find...', 
          shortcut: '⌘F',
          action: () => console.log('Find')
        }
      ]
    },
    {
      label: 'Art',
      items: [
        { 
          label: 'New Canvas', 
          shortcut: '⌘N',
          action: () => onOpenApp?.('studio')
        },
        { 
          label: 'Open Artwork...', 
          shortcut: '⌘O',
          action: () => console.log('Open Artwork')
        },
        { 
          label: 'Import Image...', 
          shortcut: '⌘I',
          action: () => console.log('Import Image')
        },
        { divider: true },
        { 
          label: 'Gallery View', 
          action: () => onOpenApp?.('gallery')
        },
        { 
          label: 'My Collections', 
          action: () => console.log('My Collections')
        },
        { 
          label: 'Art Studio', 
          action: () => onOpenApp?.('studio')
        },
        { divider: true },
        { 
          label: 'Export as PNG', 
          action: () => console.log('Export PNG')
        },
        { 
          label: 'Export as SVG', 
          action: () => console.log('Export SVG')
        },
        { 
          label: 'Export as GIF', 
          action: () => console.log('Export GIF')
        }
      ]
    },
    {
      label: 'NFT',
      items: [
        { 
          label: 'Mint Art as NFT', 
          shortcut: '⌥⌘N',
          action: () => console.log('Mint NFT')
        },
        { 
          label: 'Create Art Collection', 
          action: () => console.log('Create Collection')
        },
        { divider: true },
        { 
          label: 'Set Royalties', 
          action: () => console.log('Set Royalties')
        },
        { 
          label: 'Configure Revenue Splits', 
          action: () => console.log('Configure Splits')
        },
        { 
          label: 'License Settings', 
          action: () => console.log('License Settings')
        },
        { divider: true },
        { 
          label: 'My Art NFTs', 
          action: () => onOpenApp?.('gallery')
        },
        { 
          label: 'Art Marketplace', 
          action: () => onOpenApp?.('marketplace')
        },
        { 
          label: 'Trading History', 
          action: () => console.log('Trading History')
        }
      ]
    },
    {
      label: 'Blockchain',
      items: [
        { 
          label: 'Register Copyright', 
          action: () => console.log('Register Copyright')
        },
        { 
          label: 'Timestamp Creation', 
          action: () => console.log('Timestamp on Chain')
        },
        { divider: true },
        { 
          label: 'Encrypt Artwork', 
          shortcut: '⌘L',
          action: () => console.log('Encrypt Master')
        },
        { 
          label: 'Set Paywall', 
          action: () => console.log('Set Paywall')
        },
        { 
          label: 'Revenue Share', 
          action: () => console.log('Setup Revenue Sharing')
        },
        { divider: true },
        { 
          label: 'Art Exchange', 
          action: () => {
            const event = new CustomEvent('openExchange')
            window.dispatchEvent(event)
          }
        },
        { 
          label: 'Trading Hub', 
          action: () => onOpenApp?.('exchange')
        },
        { 
          label: 'Token Information', 
          action: () => onOpenApp?.('token')
        },
        { divider: true },
        { 
          label: 'Verify on Chain', 
          action: () => console.log('Verify')
        },
        { 
          label: 'View on Explorer', 
          href: 'https://whatsonchain.com',
          external: true
        }
      ]
    },
    {
      label: 'Marketplace',
      items: [
        { 
          label: 'Browse Artworks', 
          action: () => onOpenApp?.('marketplace')
        },
        { 
          label: 'Featured Collections', 
          action: () => console.log('Featured Collections')
        },
        { 
          label: 'New Releases', 
          action: () => console.log('New Releases')
        },
        { divider: true },
        { 
          label: 'Buy Art', 
          action: () => onOpenApp?.('marketplace')
        },
        { 
          label: 'Sell Art', 
          action: () => console.log('Sell Art')
        },
        { 
          label: 'Place Bid', 
          action: () => console.log('Place Bid')
        },
        { divider: true },
        { 
          label: 'My Purchases', 
          action: () => console.log('My Purchases')
        },
        { 
          label: 'My Sales', 
          action: () => console.log('My Sales')
        },
        { 
          label: 'Watchlist', 
          action: () => console.log('Watchlist')
        }
      ]
    },
    {
      label: 'View',
      items: [
        { 
          label: 'Show Desktop', 
          action: () => window.location.href = '/'
        },
        { 
          label: 'Show All Windows', 
          action: () => console.log('Show All Windows')
        },
        { divider: true },
        { 
          label: 'Toggle Developer Sidebar', 
          shortcut: '⌘D',
          action: () => {
            const event = new KeyboardEvent('keydown', { metaKey: true, key: 'd' })
            document.dispatchEvent(event)
          }
        },
        { 
          label: 'Enter Full Screen', 
          shortcut: '⌃⌘F',
          action: () => document.documentElement.requestFullscreen()
        },
        { divider: true },
        { 
          label: 'Actual Size', 
          shortcut: '⌘0',
          action: () => (document.body.style as any).zoom = '100%'
        },
        { 
          label: 'Zoom In', 
          shortcut: '⌘+',
          action: () => (document.body.style as any).zoom = '110%'
        },
        { 
          label: 'Zoom Out', 
          shortcut: '⌘-',
          action: () => (document.body.style as any).zoom = '90%'
        }
      ]
    },
    {
      label: 'Window',
      items: [
        { 
          label: 'App Mode: Fullscreen URLs', 
          action: () => {
            localStorage.setItem('appMode', 'fullscreen')
            alert('Apps will now open in fullscreen mode (current page)')
          }
        },
        { 
          label: 'App Mode: Windowed Apps', 
          action: () => {
            localStorage.setItem('appMode', 'windowed')
            alert('Apps will now open in draggable windows')
          }
        },
        { divider: true },
        { 
          label: 'Minimize', 
          shortcut: '⌘M',
          action: () => console.log('Minimize')
        },
        { 
          label: 'Zoom', 
          action: () => console.log('Zoom')
        },
        { divider: true },
        { 
          label: 'Bring All to Front', 
          action: () => console.log('Bring All to Front')
        },
        { divider: true },
        { 
          label: 'Art Studio', 
          action: () => onOpenApp?.('studio')
        },
        { 
          label: 'Art Gallery', 
          action: () => onOpenApp?.('gallery')
        },
        { 
          label: 'Marketplace', 
          action: () => onOpenApp?.('marketplace')
        },
        { 
          label: 'Art Exchange', 
          action: () => onOpenApp?.('exchange')
        },
        { divider: true },
        { 
          label: 'Documentation', 
          href: '/docs'
        },
        { 
          label: 'Tasks', 
          href: '/tasks'
        },
        { 
          label: 'Contracts', 
          href: '/contracts'
        },
        { 
          label: '$bArt Token', 
          href: '/token'
        }
      ]
    },
    {
      label: 'Help',
      items: [
        { 
          label: 'Bitcoin Art Help', 
          shortcut: '⌘?',
          action: () => alert('Bitcoin Art v1.0\n\nThe Digital Art Platform for Bitcoin')
        },
        { divider: true },
        { 
          label: 'Documentation', 
          action: () => window.location.href = '/docs'
        },
        { 
          label: 'GitHub Repository', 
          href: 'https://github.com/bitcoin-apps-suite/bitcoin-art',
          external: true
        },
        { divider: true },
        { 
          label: 'Report an Issue', 
          href: 'https://github.com/bitcoin-apps-suite/bitcoin-art/issues',
          external: true
        }
      ]
    }
  ]

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
        setShowBAppsMenu(false)
        setShowMobileMenu(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null)
        setShowBAppsMenu(false)
        setShowMobileMenu(false)
      }
    }

    const handleResize = () => checkMobile();

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={menuRef} className="bitcoin-os-taskbar" style={{ justifyContent: isMobile ? 'space-between' : 'flex-start' }}>
      {/* Bitcoin Logo with BApps Menu */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <button 
          className={`taskbar-logo ${showBAppsMenu ? 'menu-open' : ''}`}
          onClick={() => {
            setShowBAppsMenu(!showBAppsMenu)
            setActiveMenu(null)
          }}
          onDoubleClick={() => window.location.href = '/'}
          title="Click for apps • Double-click to go home"
          style={{ 
            background: showBAppsMenu ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            transition: 'background 0.15s ease'
          }}
        >
          <span className="bitcoin-symbol">₿</span>
        </button>
        
        {/* BApps Dropdown */}
        {showBAppsMenu && (
          <div style={{
            position: 'absolute',
            top: '28px',
            left: 0,
            minWidth: '220px',
            background: '#1a1a1a',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            padding: '8px 0',
            zIndex: 1000
          }}>
            <div style={{
              padding: '8px 16px',
              fontSize: '12px',
              color: '#8b5cf6',
              fontWeight: '600',
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              marginBottom: '4px'
            }}>
              Bitcoin Apps
            </div>
            
            {bitcoinApps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  color: '#ffffff',
                  background: 'transparent',
                  textDecoration: 'none',
                  fontSize: '13px',
                  transition: 'background 0.15s ease',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  if (app.url === '#') {
                    e.preventDefault()
                  } else {
                    e.preventDefault()
                    window.location.href = app.url
                  }
                  setShowBAppsMenu(false)
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span 
                  style={{ 
                    color: app.color,
                    marginRight: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ₿
                </span>
                <span>
                  {app.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="taskbar-menus">
        {menus.map((menu) => (
          <div key={menu.label} className="menu-container">
            <button
              className={`menu-button ${activeMenu === menu.label ? 'active' : ''}`}
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <div className="dropdown-menu">
                {menu.items.map((item, index) => (
                  item.divider ? (
                    <div key={index} className="menu-divider" />
                  ) : item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="menu-item"
                      onClick={() => setActiveMenu(null)}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button
                      key={index}
                      className="menu-item"
                      onClick={() => {
                        item.action?.()
                        setActiveMenu(null)
                      }}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Center title */}
      {isMobile && (
        <div style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: '#8b5cf6',
          textAlign: 'center'
        }}>
          Bitcoin Art
        </div>
      )}

      {/* Mobile Menu Button - Only visible on mobile */}
      {isMobile && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            padding: '0 12px',
            height: '24px',
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          {showMobileMenu ? '×' : '☰'}
        </button>
      )}

      {/* Right side - Status */}
      {!isMobile && (
        <div className="taskbar-status">
          <a 
            href="https://github.com/bitcoin-apps-suite/bitcoin-art" 
            target="_blank" 
            rel="noopener noreferrer"
            className="taskbar-link"
            title="GitHub"
          >
            <Github className="taskbar-link-icon" />
          </a>
          <a 
            href="/docs" 
            className="taskbar-link"
            title="Documentation"
          >
            <BookOpen className="taskbar-link-icon" />
          </a>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && isMobile && (
        <div style={{
          position: 'fixed',
          top: '72px', // Below POC banner (40px) and taskbar (32px)
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(26, 26, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          overflowY: 'auto'
        }}>
          <div style={{ padding: '16px' }}>
            {/* Menu Sections */}
            {menus.map((menu) => (
              <div key={menu.label} style={{
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#8b5cf6',
                  borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  {menu.label}
                </div>
                <div style={{ padding: '8px' }}>
                  {menu.items.map((item, index) => (
                    item.divider ? (
                      <div 
                        key={index}
                        style={{
                          height: '1px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          margin: '8px 0'
                        }}
                      />
                    ) : item.href ? (
                      <a
                        key={index}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setShowMobileMenu(false)}
                        style={{
                          display: 'block',
                          padding: '10px 12px',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontSize: '13px',
                          borderRadius: '4px',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        key={index}
                        onClick={() => {
                          item.action?.()
                          setShowMobileMenu(false)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 12px',
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '13px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}