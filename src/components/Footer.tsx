import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      padding: '3rem 0 1rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#8b5cf6',
                marginRight: '0.5rem'
              }}>₿</span>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white'
              }}>Art</span>
            </div>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Create, collect, and trade digital art NFTs on the Bitcoin blockchain
            </p>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Platform</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/docs" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Documentation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/exchange" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Art Exchange
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/token" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  $bART Token
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Community</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="https://github.com/bitcoin-apps-suite/bitcoin-art" target="_blank" rel="noopener noreferrer" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  GitHub
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="https://twitter.com/bitcoin_art" target="_blank" rel="noopener noreferrer" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Twitter
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="https://discord.gg/bitcoin-art" target="_blank" rel="noopener noreferrer" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Discord
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Artists</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Art Studio
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  Marketplace
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/" style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }} onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                   onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
                  NFT Minting
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          paddingTop: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#6b7280',
            fontSize: '12px',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0.25rem 0' }}>© 2025 The Bitcoin Corporation LTD</p>
            <p style={{ margin: '0.25rem 0' }}>Registered in England and Wales • Company No. 16735102</p>
            <p style={{ margin: '0.25rem 0' }}>Built on Bitcoin SV blockchain</p>
            <p style={{ margin: '0.5rem 0' }}>
              <a href="/terms" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                fontSize: '12px'
              }}>Terms of Service</a>
              <span style={{ margin: '0 0.5rem', color: '#6b7280' }}>•</span>
              <a href="/privacy" style={{
                color: '#9ca3af',
                textDecoration: 'none',
                fontSize: '12px'
              }}>Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;