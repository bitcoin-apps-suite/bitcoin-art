'use client';
import React, { useState, useEffect } from 'react';
import { HandCashService } from '../services/HandCashService';
import AuthModal from './AuthModal';

interface UnifiedAuthProps {
  googleUser: any;
  setGoogleUser: (user: any) => void;
  isHandCashAuthenticated: boolean;
  currentHandCashUser: any;
  handcashService: HandCashService;
  onHandCashLogin: () => void;
  onHandCashLogout: () => void;
}

const UnifiedAuth: React.FC<UnifiedAuthProps> = ({
  googleUser,
  setGoogleUser,
  isHandCashAuthenticated,
  currentHandCashUser,
  handcashService,
  onHandCashLogin,
  onHandCashLogout
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [twitterUser, setTwitterUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored Twitter user
    const storedTwitterUser = localStorage.getItem('twitterUser');
    if (storedTwitterUser) {
      setTwitterUser(JSON.parse(storedTwitterUser));
    }
  }, []);

  // Determine auth state
  const hasGoogle = !!googleUser;
  const hasHandCash = isHandCashAuthenticated;
  const hasTwitter = !!twitterUser;
  const hasFullAuth = hasGoogle && hasHandCash;

  const handleGoogleLogout = () => {
    localStorage.removeItem('googleUser');
    localStorage.removeItem('googleCredential');
    setGoogleUser(null);
    setShowDropdown(false);
  };

  const handleHandCashLogout = () => {
    if (onHandCashLogout) {
      onHandCashLogout();
    }
    setShowDropdown(false);
  };

  const handleTwitterConnect = () => {
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Use Next.js API route for Twitter auth
    const authUrl = '/api/auth/twitter/authorize';
    const windowName = 'TwitterAuthWindow' + Date.now();
    
    const authWindow = window.open(
      authUrl,
      windowName,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    
    if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
      alert('Please allow popups for Twitter authentication. Check your browser\'s address bar for a blocked popup notification.');
      return;
    }
    
    // Listen for messages from the popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'twitter-auth-success') {
        setTwitterUser(event.data.user);
        localStorage.setItem('twitterUser', JSON.stringify(event.data.user));
        window.removeEventListener('message', handleMessage);
        setShowAuthModal(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Clean up listener after 5 minutes
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 300000);
  };

  const handleTwitterLogout = () => {
    setTwitterUser(null);
    localStorage.removeItem('twitterUser');
    setShowDropdown(false);
  };

  const renderAuthButton = () => {
    if (hasFullAuth) {
      // Both Google and HandCash authenticated
      return (
        <div className="auth-container">
          <button 
            className="auth-button authenticated"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="auth-status">
              <div className="user-info">
                <img 
                  src={googleUser?.picture || '/default-avatar.png'} 
                  alt="Avatar" 
                  className="user-avatar"
                />
                <span className="user-name">
                  {currentHandCashUser?.handle || googleUser?.name}
                </span>
              </div>
              <div className="auth-indicators">
                <span className="auth-badge google" title="Google Account Connected">G</span>
                <span className="auth-badge handcash" title="HandCash Wallet Connected">₿</span>
                {hasTwitter && (
                  <span className="auth-badge twitter" title="Twitter Connected">𝕏</span>
                )}
              </div>
            </div>
          </button>
        </div>
      );
    } else if (hasHandCash || hasGoogle) {
      // Partial authentication
      return (
        <div className="auth-container">
          <button 
            className="auth-button partial-auth"
            onClick={() => setShowAuthModal(true)}
          >
            <div className="auth-status">
              <span className="auth-text">Complete Setup</span>
              <div className="auth-indicators">
                <span className={`auth-badge google ${hasGoogle ? 'connected' : 'disconnected'}`}>G</span>
                <span className={`auth-badge handcash ${hasHandCash ? 'connected' : 'disconnected'}`}>₿</span>
              </div>
            </div>
          </button>
        </div>
      );
    } else {
      // No authentication
      return (
        <div className="auth-container">
          <button 
            className="auth-button sign-in"
            onClick={() => setShowAuthModal(true)}
          >
            <span className="auth-text">Sign In</span>
          </button>
        </div>
      );
    }
  };

  return (
    <>
      {renderAuthButton()}
      
      {/* Dropdown Menu */}
      {showDropdown && hasFullAuth && (
        <>
          <div 
            className="dropdown-overlay" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="auth-dropdown">
            <div className="dropdown-header">
              <img 
                src={googleUser?.picture || '/default-avatar.png'} 
                alt="Avatar" 
                className="dropdown-avatar"
              />
              <div className="dropdown-user-info">
                <div className="dropdown-name">{googleUser?.name}</div>
                <div className="dropdown-handle">@{currentHandCashUser?.handle}</div>
                <div className="dropdown-email">{googleUser?.email}</div>
              </div>
            </div>
            
            <div className="dropdown-section">
              <div className="dropdown-title">Connected Accounts</div>
              <div className="connected-account">
                <span className="account-icon google">G</span>
                <span className="account-name">Google Account</span>
                <button 
                  className="disconnect-btn"
                  onClick={handleGoogleLogout}
                >
                  Disconnect
                </button>
              </div>
              <div className="connected-account">
                <span className="account-icon handcash">₿</span>
                <span className="account-name">HandCash Wallet</span>
                <button 
                  className="disconnect-btn"
                  onClick={handleHandCashLogout}
                >
                  Disconnect
                </button>
              </div>
              {hasTwitter ? (
                <div className="connected-account">
                  <span className="account-icon twitter">𝕏</span>
                  <span className="account-name">Twitter Account</span>
                  <button 
                    className="disconnect-btn"
                    onClick={handleTwitterLogout}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="disconnected-account" onClick={handleTwitterConnect}>
                  <span className="account-icon twitter disabled">𝕏</span>
                  <span className="account-name">Connect Twitter</span>
                </div>
              )}
            </div>
            
            <div className="dropdown-section">
              <button 
                className="dropdown-item"
                onClick={() => {
                  // Navigate to portfolio/profile
                  setShowDropdown(false);
                }}
              >
                🎨 My Art Portfolio
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  // Navigate to contracts
                  setShowDropdown(false);
                }}
              >
                📋 My Contracts
              </button>
              <button 
                className="dropdown-item"
                onClick={() => {
                  // Open wallet/balance view
                  setShowDropdown(false);
                }}
              >
                💰 Wallet & Earnings
              </button>
            </div>
            
            <div className="dropdown-footer">
              <button 
                className="sign-out-btn"
                onClick={() => {
                  handleGoogleLogout();
                  handleHandCashLogout();
                  if (hasTwitter) handleTwitterLogout();
                }}
              >
                Sign Out of All Accounts
              </button>
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
          isHandCashAuthenticated={isHandCashAuthenticated}
          currentHandCashUser={currentHandCashUser}
          handcashService={handcashService}
          onHandCashLogin={onHandCashLogin}
          onHandCashLogout={onHandCashLogout}
          hasTwitter={hasTwitter}
          onTwitterConnect={handleTwitterConnect}
        />
      )}
      
      <style jsx>{`
        .auth-container {
          position: relative;
        }
        
        .auth-button {
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 16px;
          transition: all 0.3s ease;
          min-width: 120px;
        }
        
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .auth-button.authenticated {
          background: linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%);
        }
        
        .auth-button.partial-auth {
          background: linear-gradient(45deg, #feca57 0%, #ff9ff3 100%);
          color: #333;
        }
        
        .auth-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        
        .auth-indicators {
          display: flex;
          gap: 4px;
        }
        
        .auth-badge {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }
        
        .auth-badge.google {
          background: #4285F4;
          color: white;
        }
        
        .auth-badge.handcash {
          background: #ff6b6b;
          color: white;
        }
        
        .auth-badge.twitter {
          background: #1DA1F2;
          color: white;
        }
        
        .auth-badge.disconnected {
          background: #ddd;
          color: #666;
        }
        
        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
        }
        
        .auth-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 300px;
          z-index: 999;
          overflow: hidden;
          margin-top: 8px;
        }
        
        .dropdown-header {
          padding: 16px;
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .dropdown-user-info {
          flex: 1;
        }
        
        .dropdown-name {
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .dropdown-handle {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 2px;
        }
        
        .dropdown-email {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .dropdown-section {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }
        
        .dropdown-title {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .connected-account, .disconnected-account {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 4px;
        }
        
        .disconnected-account {
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .disconnected-account:hover {
          background: #f8f9fa;
        }
        
        .account-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }
        
        .account-icon.google {
          background: #4285F4;
          color: white;
        }
        
        .account-icon.handcash {
          background: #ff6b6b;
          color: white;
        }
        
        .account-icon.twitter {
          background: #1DA1F2;
          color: white;
        }
        
        .account-icon.disabled {
          background: #ddd;
          color: #666;
        }
        
        .account-name {
          flex: 1;
          font-size: 14px;
        }
        
        .disconnect-btn {
          background: none;
          border: 1px solid #ddd;
          border-radius: 6px;
          color: #666;
          cursor: pointer;
          font-size: 12px;
          padding: 4px 8px;
          transition: all 0.2s;
        }
        
        .disconnect-btn:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }
        
        .dropdown-item {
          background: none;
          border: none;
          color: #333;
          cursor: pointer;
          display: block;
          font-size: 14px;
          padding: 12px 16px;
          text-align: left;
          transition: background 0.2s;
          width: 100%;
          border-radius: 8px;
          margin-bottom: 4px;
        }
        
        .dropdown-item:hover {
          background: #f8f9fa;
        }
        
        .dropdown-footer {
          padding: 12px;
        }
        
        .sign-out-btn {
          background: #dc3545;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 12px;
          transition: background 0.2s;
          width: 100%;
        }
        
        .sign-out-btn:hover {
          background: #c82333;
        }
      `}</style>
    </>
  );
};

export default UnifiedAuth;