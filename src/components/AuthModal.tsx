'use client';
import React, { useState, useEffect } from 'react';
import { HandCashService } from '../services/HandCashService';
import { MultiAuthService } from '../services/MultiAuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [multiAuthService] = useState(() => new MultiAuthService());
  const [authState, setAuthState] = useState(multiAuthService.getState());
  const [activeTab, setActiveTab] = useState<'connect' | 'profile'>('connect');
  
  useEffect(() => {
    const unsubscribe = multiAuthService.subscribe(setAuthState);
    return unsubscribe;
  }, [multiAuthService]);

  useEffect(() => {
    if (authState.isAuthenticated && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [authState.isAuthenticated, onAuthSuccess]);

  if (!isOpen) return null;

  const handleProviderConnect = async (providerId: string) => {
    try {
      await multiAuthService.authenticate(providerId);
    } catch (error) {
      console.error(`Failed to connect ${providerId}:`, error);
      alert(`Failed to connect ${providerId}. Please try again.`);
    }
  };

  const handleProviderDisconnect = async (providerId: string) => {
    try {
      await multiAuthService.disconnectProvider(providerId);
    } catch (error) {
      console.error(`Failed to disconnect ${providerId}:`, error);
    }
  };

  const handleLogout = () => {
    multiAuthService.logout();
  };

  const renderConnectTab = () => {
    const providers = multiAuthService.getProviders();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Welcome to Bitcoin Art</h3>
          <p style={{ color: '#888', margin: 0 }}>
            Connect your accounts to start creating, collecting, and trading digital art on Bitcoin
          </p>
        </div>

        {providers.map((provider) => {
          const isConnected = authState.connectedAccounts[provider.id];
          
          return (
            <div
              key={provider.id}
              style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isConnected ? provider.color : 'rgba(139, 92, 246, 0.2)'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${provider.color}, ${provider.color}88)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: provider.id === 'handcash' ? '20px' : '18px'
                  }}
                >
                  {provider.id === 'handcash' ? '₿' : provider.name[0]}
                </div>
                <div>
                  <h4 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    {provider.name}
                  </h4>
                  <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>
                    {provider.id === 'google' && 'Sign in with Google for easy authentication'}
                    {provider.id === 'deviantart' && 'Import your portfolio and connect with the community'}
                    {provider.id === 'handcash' && 'Connect for Bitcoin payments and identity verification'}
                  </p>
                  {isConnected && (
                    <p style={{ color: provider.color, margin: '4px 0 0 0', fontSize: '12px', fontWeight: '600' }}>
                      ✓ Connected as {isConnected.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => isConnected ? handleProviderDisconnect(provider.id) : handleProviderConnect(provider.id)}
                style={{
                  padding: '10px 20px',
                  background: isConnected 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : `linear-gradient(135deg, ${provider.color}, ${provider.color}88)`,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}

        {authState.isAuthenticated && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#8b5cf6', margin: '0 0 12px 0', fontWeight: '600' }}>
              🎉 You're all set up!
            </p>
            <p style={{ color: '#888', margin: '0 0 16px 0', fontSize: '14px' }}>
              Primary account: {authState.user?.name} ({authState.primaryProvider})
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Manage Profile
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileTab = () => {
    const overlayData = multiAuthService.getOverlayNetworkData();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'white', marginBottom: '8px' }}>Your Artist Network</h3>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            Overlay network data from all connected accounts
          </p>
        </div>

        {/* Network Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Platforms', value: overlayData.totalAccounts, color: '#8b5cf6' },
            { label: 'Followers', value: overlayData.totalFollowers.toLocaleString(), color: '#06b6d4' },
            { label: 'Artworks', value: overlayData.totalWorks.toLocaleString(), color: '#10b981' }
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                padding: '16px',
                background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                border: `1px solid ${color}40`,
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                {value}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Connected Accounts */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '16px' }}>Connected Accounts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.values(authState.connectedAccounts).map((account) => (
              <div
                key={account.id}
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: account.avatar ? `url(${account.avatar}) center/cover` : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {!account.avatar && account.name[0]}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                      {account.name}
                    </div>
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      {account.provider} • {account.username}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {authState.primaryProvider === account.provider && (
                    <span style={{ 
                      padding: '2px 6px', 
                      background: '#8b5cf6', 
                      borderRadius: '4px', 
                      color: 'white', 
                      fontSize: '10px',
                      fontWeight: '600'
                    }}>
                      PRIMARY
                    </span>
                  )}
                  <button
                    onClick={() => multiAuthService.switchPrimaryProvider(account.provider)}
                    disabled={authState.primaryProvider === account.provider}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '4px',
                      color: '#8b5cf6',
                      cursor: 'pointer',
                      fontSize: '12px',
                      opacity: authState.primaryProvider === account.provider ? 0.5 : 1
                    }}
                  >
                    Set Primary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Links */}
        {overlayData.portfolioUrls.length > 0 && (
          <div>
            <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '16px' }}>Portfolio Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {overlayData.portfolioUrls.map(({ provider, url, username }) => (
                <a
                  key={provider}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '6px',
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px'
                  }}
                >
                  <span>{provider} - @{username}</span>
                  <span>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >
              🎨
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              {authState.isAuthenticated ? 'Artist Dashboard' : 'Join Bitcoin Art'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '8px',
              fontSize: '24px'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        {authState.isAuthenticated && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
            }}
          >
            {[
              { id: 'connect', label: 'Connections', icon: '🔗' },
              { id: 'profile', label: 'Network Profile', icon: '👤' }
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  border: 'none',
                  color: activeTab === id ? '#8b5cf6' : '#888',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: activeTab === id ? '600' : '400',
                  borderBottom: activeTab === id ? '2px solid #8b5cf6' : '2px solid transparent'
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {activeTab === 'connect' ? renderConnectTab() : renderProfileTab()}
        </div>

        {/* Footer */}
        {!authState.isAuthenticated && (
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid rgba(139, 92, 246, 0.2)',
              background: 'rgba(139, 92, 246, 0.05)'
            }}
          >
            <h4 style={{ color: '#8b5cf6', marginBottom: '12px', fontSize: '16px' }}>
              Why connect your accounts?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              {[
                '🎨 Create and showcase art portfolios',
                '💰 Earn Bitcoin from sales',
                '🔒 Secure IP on blockchain',
                '📈 Trade artwork as NFTs',
                '🤝 Connect with collectors',
                '🌍 Cross-platform sharing'
              ].map((benefit, index) => (
                <div key={index} style={{ color: '#888', fontSize: '14px' }}>
                  {benefit}
                </div>
              ))}
            </div>
            <p style={{ color: '#666', fontSize: '12px', margin: '16px 0 0 0', textAlign: 'center' }}>
              Your data is secure. We only access what's necessary to provide our services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;