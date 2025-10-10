'use client';
import React, { useState } from 'react';
import { HandCashService } from '../services/HandCashService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleUser: any;
  setGoogleUser: (user: any) => void;
  isHandCashAuthenticated: boolean;
  currentHandCashUser: any;
  handcashService: HandCashService;
  onHandCashLogin: () => void;
  onHandCashLogout: () => void;
  hasTwitter: boolean;
  onTwitterConnect: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  googleUser,
  setGoogleUser,
  isHandCashAuthenticated,
  currentHandCashUser,
  handcashService,
  onHandCashLogin,
  onHandCashLogout,
  hasTwitter,
  onTwitterConnect
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'handcash' | 'social'>('google');
  const [emailForMagicLink, setEmailForMagicLink] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Google OAuth logic will be implemented
    console.log('Google login not yet implemented in Next.js version');
  };

  const handleMagicLinkRequest = async () => {
    try {
      const result = await handcashService.requestMagicLink(emailForMagicLink);
      if (result.success) {
        setMagicLinkSent(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Magic link request failed:', error);
      alert('Failed to send magic link. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'google':
        return (
          <div className="tab-content">
            <div className="auth-option">
              <div className="auth-icon google">G</div>
              <div className="auth-details">
                <h3>Google Account</h3>
                <p>Sign in with your Google account for seamless access</p>
                {googleUser ? (
                  <div className="auth-status connected">
                    <span>✅ Connected as {googleUser.name}</span>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        localStorage.removeItem('googleUser');
                        setGoogleUser(null);
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={handleGoogleLogin}>
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'handcash':
        return (
          <div className="tab-content">
            <div className="auth-option">
              <div className="auth-icon handcash">₿</div>
              <div className="auth-details">
                <h3>HandCash Wallet</h3>
                <p>Connect your Bitcoin wallet for payments and earnings</p>
                {isHandCashAuthenticated ? (
                  <div className="auth-status connected">
                    <span>✅ Connected as @{currentHandCashUser?.handle}</span>
                    <button className="btn-secondary" onClick={onHandCashLogout}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="handcash-auth-options">
                    <button className="btn-primary" onClick={onHandCashLogin}>
                      Connect HandCash Wallet
                    </button>
                    
                    <div className="magic-link-section">
                      <h4>Or use Magic Link</h4>
                      <div className="magic-link-form">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={emailForMagicLink}
                          onChange={(e) => setEmailForMagicLink(e.target.value)}
                          disabled={magicLinkSent}
                        />
                        <button 
                          className="btn-secondary"
                          onClick={handleMagicLinkRequest}
                          disabled={!emailForMagicLink || magicLinkSent}
                        >
                          {magicLinkSent ? 'Link Sent!' : 'Send Magic Link'}
                        </button>
                      </div>
                      {magicLinkSent && (
                        <p className="magic-link-message">
                          Check your email for a login link from HandCash
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="tab-content">
            <div className="auth-option">
              <div className="auth-icon twitter">𝕏</div>
              <div className="auth-details">
                <h3>Twitter Integration</h3>
                <p>Connect Twitter to share your art and engage with collectors</p>
                {hasTwitter ? (
                  <div className="auth-status connected">
                    <span>✅ Twitter Connected</span>
                    <button className="btn-secondary">
                      Manage Connection
                    </button>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={onTwitterConnect}>
                    Connect Twitter
                  </button>
                )}
              </div>
            </div>
            
            <div className="auth-option">
              <div className="auth-icon github">📁</div>
              <div className="auth-details">
                <h3>GitHub Portfolio</h3>
                <p>Connect GitHub to showcase your coding art and digital projects</p>
                <button className="btn-primary" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎨 Join Bitcoin Art</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="auth-tabs">
            <button 
              className={`tab ${activeTab === 'google' ? 'active' : ''}`}
              onClick={() => setActiveTab('google')}
            >
              <span className="tab-icon">G</span>
              Google
            </button>
            <button 
              className={`tab ${activeTab === 'handcash' ? 'active' : ''}`}
              onClick={() => setActiveTab('handcash')}
            >
              <span className="tab-icon">₿</span>
              HandCash
            </button>
            <button 
              className={`tab ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <span className="tab-icon">🌐</span>
              Social
            </button>
          </div>
          
          {renderTabContent()}
          
          <div className="auth-benefits">
            <h4>Why connect your accounts?</h4>
            <ul>
              <li>🎨 Create and showcase your art portfolio</li>
              <li>💰 Earn Bitcoin from art sales and commissions</li>
              <li>🔒 Secure your intellectual property on blockchain</li>
              <li>📈 Issue dividend-bearing shares in your artwork</li>
              <li>🤝 Connect with clients and other artists</li>
              <li>🌍 Share your work across social platforms</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <p className="privacy-note">
            Your data is secure. We only access what's necessary to provide our services.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .auth-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 4px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          background: #f5f5f5;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .auth-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #eee;
        }
        
        .tab {
          background: none;
          border: none;
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s;
          color: #666;
        }
        
        .tab.active {
          background: #f8f9fa;
          color: #333;
          border-bottom: 2px solid #667eea;
        }
        
        .tab-icon {
          font-weight: bold;
        }
        
        .tab-content {
          min-height: 200px;
        }
        
        .auth-option {
          display: flex;
          gap: 16px;
          padding: 16px;
          border: 1px solid #eee;
          border-radius: 12px;
          margin-bottom: 16px;
        }
        
        .auth-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .auth-icon.google {
          background: #4285F4;
          color: white;
        }
        
        .auth-icon.handcash {
          background: #ff6b6b;
          color: white;
        }
        
        .auth-icon.twitter {
          background: #1DA1F2;
          color: white;
        }
        
        .auth-icon.github {
          background: #333;
          color: white;
        }
        
        .auth-details {
          flex: 1;
        }
        
        .auth-details h3 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .auth-details p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }
        
        .auth-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .auth-status.connected {
          color: #28a745;
          font-weight: 500;
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          padding: 12px 24px;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          color: #666;
          cursor: pointer;
          font-weight: 500;
          padding: 8px 16px;
          transition: all 0.2s;
        }
        
        .btn-secondary:hover {
          background: #f8f9fa;
          border-color: #ccc;
        }
        
        .handcash-auth-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .magic-link-section h4 {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
        }
        
        .magic-link-form {
          display: flex;
          gap: 8px;
        }
        
        .magic-link-form input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .magic-link-message {
          color: #28a745;
          font-size: 14px;
          margin: 8px 0 0 0;
        }
        
        .auth-benefits {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }
        
        .auth-benefits h4 {
          margin: 0 0 12px 0;
          color: #333;
        }
        
        .auth-benefits ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .auth-benefits li {
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
        }
        
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #eee;
          background: #f8f9fa;
        }
        
        .privacy-note {
          margin: 0;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;