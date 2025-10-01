'use client';

import { useState } from 'react';
import { Palette, Bitcoin, Menu, X } from 'lucide-react';

interface AppHeaderProps {
  onTitleClick?: () => void;
}

export default function AppHeader({ onTitleClick }: AppHeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header
      style={{
        height: '60px',
        background: 'linear-gradient(90deg, #1a1a1a 0%, #141414 100%)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'relative',
      }}
    >
      {/* Logo and Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: onTitleClick ? 'pointer' : 'default',
        }}
        onClick={onTitleClick}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img 
            src="/bitcoin-art.jpg" 
            alt="Bitcoin Art Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Bitcoin Art Gallery
          </h1>
          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
            Create & Trade Digital Art on Bitcoin
          </p>
        </div>
      </div>

      {/* Center Status */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '20px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <Bitcoin size={16} color="#8b5cf6" />
        <span style={{ fontSize: '14px', color: '#8b5cf6' }}>
          Powered by Bitcoin
        </span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            padding: '8px 16px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#8b5cf6',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {showInfo ? <X size={16} /> : <Menu size={16} />}
          Info
        </button>
      </div>

      {/* Info Dropdown */}
      {showInfo && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '20px',
            marginTop: '8px',
            width: '300px',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ color: '#8b5cf6', marginBottom: '12px' }}>About Bitcoin Art</h3>
          <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '16px' }}>
            The premier platform for creating, collecting, and trading digital art NFTs on the Bitcoin blockchain.
          </p>
          <div style={{ borderTop: '1px solid rgba(139, 92, 246, 0.2)', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              <strong>$bArt Token:</strong> Native platform token
            </p>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              <strong>Network:</strong> Bitcoin BSV
            </p>
            <p style={{ fontSize: '12px', color: '#888' }}>
              <strong>Version:</strong> 1.0.0
            </p>
          </div>
        </div>
      )}
    </header>
  );
}