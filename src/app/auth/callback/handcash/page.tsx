'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function HandCashCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing HandCash authentication...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'oauth_callback',
          providerId: 'handcash',
          error: error
        }, window.location.origin);
        window.close();
      }
      return;
    }

    if (code && state) {
      setStatus('success');
      setMessage('HandCash wallet connected! Bitcoin payments are now enabled.');
      
      // Send success to parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'oauth_callback',
          providerId: 'handcash',
          code: code,
          state: state
        }, window.location.origin);
        
        // Close popup after a short delay
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        // If not in popup, redirect to main app
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } else {
      setStatus('error');
      setMessage('Missing authentication parameters');
    }
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(0, 212, 170, 0.3)',
          maxWidth: '400px',
          width: '100%',
          margin: '20px'
        }}
      >
        {status === 'processing' && (
          <>
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(0, 212, 170, 0.2)',
                borderTop: '4px solid #00d4aa',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }}
            />
            <h2 style={{ color: 'white', marginBottom: '12px' }}>
              Connecting to HandCash
            </h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #00d4aa, #00b894)',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}
            >
              ₿
            </div>
            <h2 style={{ color: '#00d4aa', marginBottom: '12px' }}>
              HandCash Connected!
            </h2>
          </>
        )}

        {status === 'error' && (
          <>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}
            >
              ✗
            </div>
            <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>
              Connection Failed
            </h2>
          </>
        )}

        <p style={{ color: '#888', margin: 0, lineHeight: '1.5' }}>
          {message}
        </p>

        {status === 'success' && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(0, 212, 170, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 212, 170, 0.3)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ color: '#00d4aa', fontSize: '16px' }}>✓</span>
                <span style={{ color: '#00d4aa', fontSize: '14px' }}>Bitcoin payments enabled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ color: '#00d4aa', fontSize: '16px' }}>✓</span>
                <span style={{ color: '#00d4aa', fontSize: '14px' }}>Identity verification active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{ color: '#00d4aa', fontSize: '16px' }}>✓</span>
                <span style={{ color: '#00d4aa', fontSize: '14px' }}>NFT minting ready</span>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && !window.opener && (
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Return to App
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function HandCashCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white'
      }}>
        Loading...
      </div>
    }>
      <HandCashCallbackContent />
    </Suspense>
  );
}