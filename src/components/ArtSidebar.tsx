'use client';

import { useState, useSyncExternalStore } from 'react';
import WalletButton from './WalletButton';
import {
  Palette,
  Store,
  Image,
  TrendingUp,
  Plus,
  Upload,
  
  Clock,
  Star,
  Brush,
  Users,
  Settings,
  HardDrive,
  
  
  ChevronRight,
  ChevronDown,
  Search,
  Grid,
  Frame,
  Sparkles,
} from 'lucide-react';

interface ArtSidebarProps {
  currentView: string;
  onViewChange: (view: 'studio' | 'marketplace' | 'gallery' | 'exchange') => void;
  onAuthRequired: () => void;
}

const noopSubscribe = () => () => {};

/** Bytes used by saved projects in localStorage. */
function readStorageUsed(): number {
  try {
    const savedProjects = localStorage.getItem('artProjects');
    return savedProjects ? new Blob([savedProjects]).size : 0;
  } catch {
    return 0;
  }
}

export default function ArtSidebar({ currentView, onViewChange }: ArtSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['studio', 'gallery']);
  const [searchQuery, setSearchQuery] = useState('');
  const storageUsed = useSyncExternalStore(noopSubscribe, readStorageUsed, () => 0);
  const [storageTotal] = useState(10737418240); // 10GB in bytes

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const menuItems = [
    {
      id: 'studio',
      label: 'Art Studio',
      icon: Palette,
      view: 'studio' as const,
      children: [
        { label: 'New Artwork', icon: Plus, action: 'new' },
        { label: 'Recent Projects', icon: Clock, action: 'recent' },
        { label: 'Templates', icon: Grid, action: 'templates' },
        { label: 'AI Tools', icon: Sparkles, action: 'ai' },
      ],
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      view: 'marketplace' as const,
      children: [
        { label: 'Browse Art', icon: Image, action: 'browse' },
        { label: 'Trending', icon: TrendingUp, action: 'trending' },
        { label: 'New Drops', icon: Sparkles, action: 'new' },
        { label: 'Artists', icon: Users, action: 'artists' },
      ],
    },
    {
      id: 'gallery',
      label: 'My Gallery',
      icon: Frame,
      view: 'gallery' as const,
      children: [
        { label: 'My Collection', icon: Image, action: 'collection' },
        { label: 'Created Artworks', icon: Brush, action: 'created' },
        { label: 'Favorites', icon: Star, action: 'favorites' },
        { label: 'Upload Art', icon: Upload, action: 'upload' },
      ],
    },
    {
      id: 'exchange',
      label: 'Art Exchange',
      icon: TrendingUp,
      view: 'exchange' as const,
      children: [
        { label: '$bArt Token', icon: TrendingUp, action: 'token' },
        { label: 'Trade History', icon: Clock, action: 'history' },
        { label: 'Analytics', icon: TrendingUp, action: 'analytics' },
      ],
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <div style={{ padding: '16px' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <Search size={16} style={{ color: '#8b5cf6', marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'white',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {menuItems.map((item) => (
          <div key={item.id} style={{ marginBottom: '16px' }}>
            <button
              onClick={() => {
                onViewChange(item.view);
                toggleSection(item.id);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: currentView === item.view ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: currentView === item.view ? '#8b5cf6' : '#ccc',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.view) {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.view) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <item.icon size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
              </div>
              {expandedSections.includes(item.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Submenu */}
            {expandedSections.includes(item.id) && (
              <div style={{ marginTop: '4px', paddingLeft: '12px' }}>
                {item.children.map((child, index) => (
                  <button
                    key={index}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#8b5cf6';
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#999';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <child.icon size={14} />
                    <span>{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
        {/* Storage Info */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={14} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '12px', color: '#999' }}>Storage</span>
            </div>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {formatBytes(storageUsed)} / {formatBytes(storageTotal)}
            </span>
          </div>
          <div
            style={{
              height: '4px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(storageUsed / storageTotal) * 100}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #c084fc)',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>

        {/* User Section */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <WalletButton />
          </div>
          <button
            style={{
              padding: '8px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '8px',
              color: '#8b5cf6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}