'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function TokenPage() {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    // Initial check
    checkMobile();
    
    // Listen for changes
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => checkMobile();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen bg-black text-white ${
        !isMobile && !devSidebarCollapsed ? 'pl-[50px]' : ''
      } ${!isMobile && devSidebarCollapsed ? 'pl-[50px]' : ''}`}
      style={{
        marginTop: '112px', // Account for ProofOfConceptBar + TopMenuBar + AppHeader
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-white">The</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Bitcoin Art
            </span>{' '}
            <span className="text-white">Token</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create, collect, and trade digital art NFTs while earning revenue shares through our innovative tokenomics
          </p>
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-2xl font-bold">
            $bART
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Vision for Digital Art</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <p className="text-lg text-gray-300 mb-6">
              Bitcoin Art is revolutionizing the digital art space by creating a comprehensive ecosystem where artists, 
              collectors, and investors can participate in the value creation of digital artworks through blockchain technology.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              The $bART token represents our approach to creating a sustainable economic model that rewards 
              contributors while fostering creativity and innovation in the digital art space.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Artist Empowerment</h3>
                <p className="text-gray-300">Direct monetization, royalties, and community building tools</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Collector Benefits</h3>
                <p className="text-gray-300">Authentic ownership, trading opportunities, and exclusive access</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Community Driven</h3>
                <p className="text-gray-300">Governance rights and platform revenue sharing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Token Model Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">The $bART Token Model</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <h3 className="text-2xl font-bold mb-6">How It Works</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Art Revenue Sharing:</strong> Token holders receive dividends from 
                  platform fees, NFT sales commissions, and marketplace transactions
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Artist Rewards:</strong> Artists earn tokens through platform 
                  engagement, successful sales, and community contributions
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Governance Rights:</strong> Token holders vote on platform 
                  features, fee structures, and ecosystem development
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Staking Rewards:</strong> Stake tokens to earn additional 
                  rewards and unlock premium platform features
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20">
            <h3 className="text-2xl font-bold text-red-400 mb-6">Important Notices</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Not Financial Advice:</strong> Token allocation and rewards are 
                  subject to platform performance and market conditions
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Regulatory Compliance:</strong> All token operations comply with 
                  applicable regulations and may be subject to geographic restrictions
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-3">•</span>
                <div>
                  <strong className="text-white">Platform Risk:</strong> Token value and utility depend on the 
                  continued operation and success of the Bitcoin Art platform
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Business Model Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Revenue Streams</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h4 className="text-xl font-bold text-purple-400 mb-3">NFT Marketplace</h4>
              <p className="text-gray-300 mb-4">Primary and secondary art sales</p>
              <p className="text-2xl font-bold text-white">2.5% fee</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h4 className="text-xl font-bold text-purple-400 mb-3">Art Shares Trading</h4>
              <p className="text-gray-300 mb-4">Fractional ownership trading</p>
              <p className="text-2xl font-bold text-white">1.5% fee</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h4 className="text-xl font-bold text-purple-400 mb-3">Premium Features</h4>
              <p className="text-gray-300 mb-4">Advanced tools and analytics</p>
              <p className="text-2xl font-bold text-white">$29/month</p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-6 text-center">Value Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-center">Platform Revenue</div>
              <div className="text-purple-400">→</div>
              <div className="text-center">Token Holder Dividends</div>
              <div className="text-purple-400">→</div>
              <div className="text-center">Artist Rewards</div>
              <div className="text-purple-400">→</div>
              <div className="text-center">Community Growth</div>
            </div>
          </div>
        </section>

        {/* Token Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Token Statistics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Total Supply</h3>
              <p className="text-2xl font-bold text-white">1,000,000,000</p>
              <p className="text-gray-400">$bART tokens</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Circulating</h3>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-gray-400">Tokens in circulation</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Artists</h3>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-gray-400">Active creators</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Network</h3>
              <p className="text-2xl font-bold text-white">BSV</p>
              <p className="text-gray-400">Blockchain</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Digital Art?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              Start Creating
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 border border-purple-500 rounded-lg font-bold hover:bg-purple-500/10 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}