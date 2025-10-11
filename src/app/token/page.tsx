'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import AppHeader from '@/components/AppHeader';
import Dock from '@/components/Dock';

export default function TokenPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const checkSidebar = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setSidebarCollapsed(saved !== null ? saved === 'true' : true);
    };
    
    // Initial checks
    checkMobile();
    checkSidebar();
    
    const handleResize = () => checkMobile();
    
    // Poll for sidebar changes since localStorage events don't fire in same tab
    const sidebarInterval = setInterval(checkSidebar, 100);
    
    window.addEventListener('resize', handleResize);
    
    // Set loaded immediately - no more flash
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(sidebarInterval);
    };
  }, []);

  return (
    <div className="App">
      <ProofOfConceptBar />
      <TopMenuBar />
      <AppHeader />
      
      {/* Developer Sidebar - only on desktop */}
      {!isMobile && <DevSidebar />}
      
      <div className={`token-page ${isLoaded ? 'loaded' : 'loading'} ${!isMobile ? (sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded') : ''}`}>
        <div className="token-container">
          {/* Hero Section */}
          <section className="token-hero">
            <h1><span style={{color: '#ffffff'}}>The</span> <span style={{color: '#8b5cf6'}}>Bitcoin Art</span> <span style={{color: '#ffffff'}}>Token</span></h1>
            <p className="token-tagline">
              Create, collect, and trade digital art while earning revenue shares
            </p>
            <div className="token-badge">$BART</div>
          </section>

          {/* Philosophy Section */}
          <section className="philosophy-section">
            <h2>Our Digital Art Philosophy</h2>
            <div className="philosophy-content">
              <p>
                Bitcoin Art is revolutionizing the digital art space by creating a comprehensive ecosystem where artists, 
                collectors, and investors can participate in the value creation of digital artworks through blockchain technology.
              </p>
              <p>
                The $BART token represents our approach to creating a sustainable economic model that 
                rewards contributors while fostering creativity and innovation in the digital art space.
              </p>
              <div className="philosophy-points">
                <div className="point">
                  <h3>Artist Empowerment</h3>
                  <p>Direct monetization, royalties, and community building tools</p>
                </div>
                <div className="point">
                  <h3>Collector Benefits</h3>
                  <p>Authentic ownership, trading opportunities, and exclusive access</p>
                </div>
                <div className="point">
                  <h3>Community Driven</h3>
                  <p>Governance rights and platform revenue sharing</p>
                </div>
              </div>
            </div>
          </section>

          {/* Token Model Section */}
          <section className="token-model-section">
            <h2>The $BART Token Model</h2>
            <div className="model-card">
              <h3>How It Works</h3>
              <ul>
                <li>
                  <strong>Art Revenue Sharing:</strong> Token holders receive dividends from 
                  platform fees, NFT sales commissions, and marketplace transactions
                </li>
                <li>
                  <strong>Artist Rewards:</strong> Artists earn tokens through platform 
                  engagement, successful sales, and community contributions
                </li>
                <li>
                  <strong>Governance Rights:</strong> Token holders vote on platform 
                  features, fee structures, and ecosystem development
                </li>
                <li>
                  <strong>Staking Rewards:</strong> Stake tokens to earn additional 
                  rewards and unlock premium platform features
                </li>
              </ul>
            </div>

            <div className="model-card warning">
              <h3>Important Notices</h3>
              <ul>
                <li>
                  <strong>Not Financial Advice:</strong> Token allocation and rewards are 
                  subject to platform performance and market conditions
                </li>
                <li>
                  <strong>Regulatory Compliance:</strong> All token operations comply with 
                  applicable regulations and may be subject to geographic restrictions
                </li>
                <li>
                  <strong>Platform Risk:</strong> Token value and utility depend on the 
                  continued operation and success of the Bitcoin Art platform
                </li>
              </ul>
            </div>
          </section>

          {/* Business Model Section */}
          <section className="business-section">
            <h2>Revenue Streams</h2>
            <div className="business-content">
              <p className="intro">
                Our vision is to create sustainable digital art marketplace through a hybrid model that 
                preserves artistic freedom while generating value for all participants.
              </p>

              <div className="business-model">
                <h3>Marketplace Revenue</h3>
                <div className="revenue-streams">
                  <div className="stream">
                    <h4>NFT Sales</h4>
                    <p>Primary and secondary art sales</p>
                    <p className="price">2.5% fee</p>
                  </div>
                  <div className="stream featured">
                    <h4>Art Shares</h4>
                    <p>Fractional ownership trading</p>
                    <p className="price">1.5% fee</p>
                  </div>
                  <div className="stream">
                    <h4>Premium Features</h4>
                    <p>Advanced tools and analytics</p>
                    <p className="price">$29/month</p>
                  </div>
                </div>
                
                <h3 style={{marginTop: '40px'}}>Art Services</h3>
                <div className="revenue-streams">
                  <div className="stream">
                    <h4>Commission Platform</h4>
                    <p>Artist-client project matching</p>
                    <p className="price">5% fee</p>
                  </div>
                  <div className="stream featured">
                    <h4>IP Protection</h4>
                    <p>Blockchain copyright registration</p>
                    <p className="price">0.1% fee</p>
                  </div>
                  <div className="stream">
                    <h4>Gallery Hosting</h4>
                    <p>Professional portfolio sites</p>
                    <p className="price">$15/month</p>
                  </div>
                </div>
              </div>

              <div className="value-flow">
                <h3>Value Flow</h3>
                <div className="flow-diagram">
                  <div className="flow-item">
                    <span>Art sales + Platform fees</span>
                    <span className="arrow">→</span>
                  </div>
                  <div className="flow-item">
                    <span>Revenue to Bitcoin Art Ltd</span>
                    <span className="arrow">→</span>
                  </div>
                  <div className="flow-item">
                    <span>Dividends to $BART holders</span>
                    <span className="arrow">→</span>
                  </div>
                  <div className="flow-item">
                    <span>Artists rewarded for creating</span>
                  </div>
                </div>
                <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)'}}>
                  The Bitcoin Art platform enables creators to tokenize, sell shares, and trade their work,
                  generating platform fees that contribute to the ecosystem's sustainability.
                </p>
              </div>
            </div>
          </section>

          {/* How to Contribute Section */}
          <section className="contribute-section">
            <h2>How to Earn $BART Tokens</h2>
            <div className="contribute-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Create Art</h3>
                <p>Upload original artwork to the platform and build your portfolio</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Engage Community</h3>
                <p>Participate in discussions, collaborations, and platform governance</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Complete Contracts</h3>
                <p>Fulfill commissioned work and deliver quality art projects</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Receive Tokens</h3>
                <p>Tokens allocated based on sales, engagement, and contribution quality</p>
              </div>
            </div>

            <div className="contribution-examples">
              <h3>What We Value</h3>
              <ul>
                <li>✅ Original artwork creation</li>
                <li>✅ Community engagement</li>
                <li>✅ Platform development contributions</li>
                <li>✅ Educational content and tutorials</li>
                <li>✅ Marketing and promotion efforts</li>
                <li>✅ Technical improvements and bug reports</li>
              </ul>
            </div>
          </section>

          {/* Token Stats Section */}
          <section className="stats-section">
            <h2>Token Statistics</h2>
            <div className="stats-grid">
              <div className="stat">
                <h3>Total Supply</h3>
                <p className="stat-value">1,000,000,000</p>
                <p className="stat-label">$BART tokens</p>
              </div>
              <div className="stat">
                <h3>Distributed</h3>
                <p className="stat-value">0</p>
                <p className="stat-label">Tokens allocated</p>
              </div>
              <div className="stat">
                <h3>Artists</h3>
                <p className="stat-value">1</p>
                <p className="stat-label">Active creators</p>
              </div>
              <div className="stat">
                <h3>Network</h3>
                <p className="stat-value">BSV</p>
                <p className="stat-label">Blockchain</p>
              </div>
            </div>
          </section>

          {/* Legal Section */}
          <section className="legal-section">
            <h2>Legal & Regulatory Notice</h2>
            <div className="legal-content">
              <p>
                <strong>Revenue Sharing Model:</strong> The $BART token is designed to enable revenue 
                sharing with contributors through dividend distributions. Token holders may receive dividends 
                based on platform revenues from art sales, commissions, and marketplace fees.
              </p>
              <p>
                <strong>Trading & Liquidity:</strong> The $BART token is intended to be freely tradable 
                on the Bitcoin Art Exchange and associated platforms. We encourage an active secondary 
                market to provide liquidity and price discovery for contributors' work.
              </p>
              <p>
                <strong>Art Tokenization:</strong> The Bitcoin Art platform enables artists to tokenize 
                their individual artworks and issue dividend-bearing shares, creating new opportunities 
                for art investment and ownership.
              </p>
              <p>
                By participating in the token ecosystem, you acknowledge that token allocation may vary, 
                regulatory frameworks may evolve, and you should conduct your own due diligence regarding 
                tax and legal implications in your jurisdiction.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h2>Ready to Create Digital Art?</h2>
            <div className="cta-buttons">
              <a 
                href="/" 
                className="cta-btn primary"
              >
                Start Creating
              </a>
              <a 
                href="/exchange" 
                className="cta-btn secondary"
              >
                Browse Marketplace
              </a>
            </div>
          </section>
        </div>
      </div>
      
      {/* Mini Dock at the bottom */}
      <Dock />
      
      <Footer />
      
      <style jsx>{`
        /* App Layout */
        .App {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          overflow-x: hidden;
          position: relative;
        }

        /* Token Page - Bitcoin Art Purple Theme */
        .token-page {
          background: transparent;
          color: #ffffff;
          min-height: calc(100vh - 128px);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding-top: 128px;
          padding-bottom: 120px;
          font-weight: 300;
          transition: margin-left 0.3s ease;
          overflow-y: auto;
        }

        /* Sidebar responsive states */
        .token-page.sidebar-expanded {
          margin-left: 260px;
        }
        
        .token-page.sidebar-collapsed {
          margin-left: 60px;
        }

        /* Mobile - no sidebar margin */
        @media (max-width: 768px) {
          .token-page {
            margin-left: 0 !important;
            padding-bottom: 160px; /* Account for mobile dock */
          }
        }

        .token-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Token Hero - Full Width Black */
        .token-hero {
          min-height: 40vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px 40px;
          text-align: center;
          margin-bottom: 40px;
          background: #000000;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          margin-top: -24px;
          width: 100vw;
          position: relative;
          left: 0;
          right: 0;
        }

        .token-badge {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-top: 20px;
          color: #000;
        }

        .token-hero h1 {
          font-size: 42px;
          font-weight: 200;
          margin: 0 0 16px 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .token-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.4;
          font-weight: 300;
        }

        /* Sections */
        section {
          padding: 40px 0;
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        section:first-of-type {
          border-top: none;
        }

        section h2 {
          font-size: 28px;
          font-weight: 200;
          margin-bottom: 30px;
          text-align: center;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        /* Philosophy Section */
        .philosophy-section {
          background: #0a0a0a;
        }

        .philosophy-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .philosophy-content p {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 18px;
          font-weight: 300;
        }

        .philosophy-content strong {
          font-weight: 500;
          color: #8b5cf6;
        }

        .philosophy-points {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .point {
          padding: 20px;
          text-align: left;
          border-left: 2px solid #8b5cf6;
          padding-left: 20px;
        }

        .point h3 {
          font-size: 16px;
          font-weight: 400;
          margin: 0 0 8px 0;
          color: #8b5cf6;
          letter-spacing: 0;
        }

        .point p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          line-height: 1.5;
          font-weight: 300;
        }

        /* Token Model Section */
        .token-model-section {
          background: #0a0a0a;
        }

        .model-card {
          background: transparent;
          border-left: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          padding: 0 0 0 24px;
          margin-bottom: 30px;
        }

        .model-card.warning {
          border-left-color: rgba(139, 92, 246, 0.3);
        }

        .model-card h3 {
          font-size: 20px;
          font-weight: 300;
          margin: 0 0 20px 0;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .model-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .model-card li {
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
        }

        .model-card li:last-child {
          border-bottom: none;
        }

        .model-card li strong {
          color: #8b5cf6;
          font-weight: 500;
          margin-right: 8px;
        }

        /* Business Section */
        .business-section {
          background: #0a0a0a;
        }

        .business-content .intro {
          font-size: 18px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          max-width: 800px;
          margin: 0 auto 40px;
          font-weight: 300;
        }

        .business-model {
          margin-bottom: 40px;
        }

        .business-model h3 {
          font-size: 22px;
          font-weight: 300;
          margin-bottom: 24px;
          text-align: center;
          color: #8b5cf6;
          letter-spacing: -0.5px;
        }

        .revenue-streams {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .stream {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s ease;
          position: relative;
        }

        .stream:hover {
          border-color: rgba(139, 92, 246, 0.3);
          background: rgba(255, 255, 255, 0.01);
        }

        .stream.featured {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.01);
        }

        .stream.featured::before {
          content: 'POPULAR';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #8b5cf6;
          color: #fff;
          padding: 2px 8px;
          border-radius: 100px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .stream h4 {
          font-size: 18px;
          font-weight: 400;
          margin: 0 0 10px 0;
          color: #8b5cf6;
        }

        .stream p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 12px 0;
          line-height: 1.5;
          font-weight: 300;
        }

        .stream .price {
          font-size: 24px;
          font-weight: 200;
          color: #ffffff;
          margin: 0;
        }

        .value-flow {
          background: transparent;
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          padding: 24px;
        }

        .value-flow h3 {
          font-size: 18px;
          font-weight: 300;
          margin: 0 0 20px 0;
          text-align: center;
          color: #8b5cf6;
        }

        .flow-diagram {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .flow-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 300;
        }

        .flow-item .arrow {
          color: #8b5cf6;
          font-size: 14px;
        }

        /* Contribute Section */
        .contribute-section {
          background: #0a0a0a;
        }

        .contribute-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 100%;
          margin: 0 auto 40px;
        }

        .step {
          text-align: left;
          padding: 16px;
          border-left: 2px solid rgba(139, 92, 246, 0.3);
          padding-left: 16px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid #8b5cf6;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 300;
          color: #8b5cf6;
          margin-bottom: 12px;
        }

        .step h3 {
          font-size: 15px;
          font-weight: 400;
          margin: 0 0 8px 0;
          color: #ffffff;
        }

        .step p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.5;
          font-weight: 300;
        }

        .contribution-examples {
          background: transparent;
          border-left: 2px solid rgba(139, 92, 246, 0.3);
          padding-left: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .contribution-examples h3 {
          font-size: 18px;
          font-weight: 300;
          margin: 0 0 16px 0;
          color: #8b5cf6;
        }

        .contribution-examples ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .contribution-examples li {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
          padding-left: 20px;
          position: relative;
          font-weight: 300;
        }

        .contribution-examples li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4CAF50;
          font-size: 14px;
        }

        /* Stats Section */
        .stats-section {
          background: #0a0a0a;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 100%;
          margin: 0 auto;
        }

        .stat {
          text-align: center;
          padding: 20px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }

        .stat:hover {
          border-color: rgba(139, 92, 246, 0.3);
          background: rgba(255, 255, 255, 0.01);
        }

        .stat h3 {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0 0 12px 0;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 200;
          color: #8b5cf6;
          margin: 0 0 4px 0;
          letter-spacing: -1px;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-weight: 300;
        }

        /* Legal Section */
        .legal-section {
          background: #0a0a0a;
        }

        .legal-content {
          background: transparent;
          border-left: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 0;
          padding: 0 0 0 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .legal-content p {
          font-size: 15px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 16px;
          font-weight: 300;
        }

        .legal-content p:last-child {
          margin-bottom: 0;
        }

        .legal-content strong {
          color: #8b5cf6;
          font-weight: 500;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 60px 20px;
          background: #0a0a0a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cta-section h2 {
          font-size: 32px;
          font-weight: 200;
          margin: 0 0 24px 0;
          color: #ffffff;
          letter-spacing: -1px;
        }

        .cta-buttons {
          display: inline-flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 400;
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.5px;
        }

        .cta-btn.primary {
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          color: #fff;
          border: none;
        }

        .cta-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.2);
        }

        .cta-btn.secondary {
          background: transparent;
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.5);
        }

        .cta-btn.secondary:hover {
          background: rgba(139, 92, 246, 0.05);
          border-color: #8b5cf6;
        }

        /* Additional Mobile Responsive */
        @media (max-width: 768px) {
          .token-hero h1 {
            font-size: 32px;
          }
          
          .token-tagline {
            font-size: 14px;
          }
          
          section h2 {
            font-size: 24px;
          }
          
          .philosophy-points,
          .revenue-streams,
          .contribute-steps,
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .contribution-examples ul {
            grid-template-columns: 1fr;
          }
          
          .flow-diagram {
            flex-direction: column;
            gap: 8px;
          }
          
          .flow-item {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}