'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function DocsPage() {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => checkMobile();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
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

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'art-studio', title: 'Art Studio', icon: '🎨' },
    { id: 'nft-minting', title: 'NFT Minting', icon: '💎' },
    { id: 'marketplace', title: 'Marketplace', icon: '🛍️' },
    { id: 'blockchain', title: 'Blockchain Features', icon: '⛓️' },
    { id: 'api', title: 'API Reference', icon: '🔗' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Getting Started with Bitcoin Art</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6">
                Welcome to Bitcoin Art, the premier platform for creating, collecting, and trading digital art NFTs on the Bitcoin blockchain.
              </p>
              
              <h3 className="text-2xl font-bold mb-4">Quick Start Guide</h3>
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">1. Create Your First Artwork</h4>
                  <p className="text-gray-300 mb-3">Use our Art Studio to create digital masterpieces with professional tools:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Multiple brush types and textures</li>
                    <li>Layer management</li>
                    <li>Color palettes and gradients</li>
                    <li>Vector and raster support</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">2. Mint as NFT</h4>
                  <p className="text-gray-300 mb-3">Transform your artwork into a tradeable NFT:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Set metadata and descriptions</li>
                    <li>Configure royalties (1-10%)</li>
                    <li>Choose license terms</li>
                    <li>Pay minting fees in BSV</li>
                  </ul>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                  <h4 className="text-xl font-bold text-purple-400 mb-3">3. List on Marketplace</h4>
                  <p className="text-gray-300 mb-3">Make your art available for collectors:</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Set fixed price or auction</li>
                    <li>Configure sale terms</li>
                    <li>Promote through collections</li>
                    <li>Track sales and earnings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'art-studio':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Art Studio Documentation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Tools & Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>Brush Engine:</strong> Professional brush system with pressure sensitivity</li>
                  <li>• <strong>Layers:</strong> Unlimited layers with blend modes</li>
                  <li>• <strong>Vector Tools:</strong> Paths, shapes, and text tools</li>
                  <li>• <strong>Filters:</strong> Real-time effects and transformations</li>
                  <li>• <strong>Color Tools:</strong> Advanced color picker and palette management</li>
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex justify-between">
                    <span>New Canvas</span>
                    <span className="font-mono">⌘ + N</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Save Artwork</span>
                    <span className="font-mono">⌘ + S</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Undo</span>
                    <span className="font-mono">⌘ + Z</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zoom In/Out</span>
                    <span className="font-mono">⌘ + / ⌘ -</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle Layers</span>
                    <span className="font-mono">⌘ + L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'nft-minting':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">NFT Minting Guide</h2>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Minting Process</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-white">Step 1: Prepare Artwork</h4>
                    <p className="text-gray-300">Ensure your artwork meets quality standards and is saved in high resolution.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-white">Step 2: Add Metadata</h4>
                    <p className="text-gray-300">Title, description, tags, and properties that describe your artwork.</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-white">Step 3: Set Royalties</h4>
                    <p className="text-gray-300">Configure ongoing royalty percentage for secondary sales (1-10%).</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-white">Step 4: Pay Fees & Mint</h4>
                    <p className="text-gray-300">Pay blockchain fees and mint your NFT to the Bitcoin network.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Minting Costs</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-bold text-white">Platform Fee</h4>
                    <p className="text-2xl font-bold text-purple-400">0.001 BSV</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white">Network Fee</h4>
                    <p className="text-2xl font-bold text-purple-400">~0.0001 BSV</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white">Storage Fee</h4>
                    <p className="text-2xl font-bold text-purple-400">Variable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'marketplace':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Marketplace Guide</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">For Sellers</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Listing Fees:</strong> 2.5% on successful sales
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Pricing:</strong> Set fixed price or start auctions
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Promotion:</strong> Feature in collections and trending
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Analytics:</strong> Track views, favorites, and sales
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">For Buyers</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Discovery:</strong> Browse by category, artist, or price
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Verification:</strong> All NFTs verified on-chain
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Payment:</strong> Secure BSV transactions
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <div>
                      <strong>Ownership:</strong> Instant transfer to your wallet
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'blockchain':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Blockchain Features</h2>
            <div className="space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Bitcoin SV Integration</h3>
                <p className="text-gray-300 mb-4">
                  Bitcoin Art leverages the Bitcoin SV blockchain for secure, scalable, and cost-effective NFT operations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-white mb-2">Benefits</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Low transaction fees</li>
                      <li>• Unlimited scalability</li>
                      <li>• Immutable ownership records</li>
                      <li>• Global accessibility</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Technical Details</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Metanet protocol for metadata</li>
                      <li>• On-chain art storage options</li>
                      <li>• Smart contract capabilities</li>
                      <li>• Micropayment support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Security Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">🔐 Encryption</h4>
                    <p className="text-gray-300 text-sm">Optional artwork encryption for premium access</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">⏰ Timestamps</h4>
                    <p className="text-gray-300 text-sm">Immutable creation timestamps on-chain</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-white mb-2">🔍 Verification</h4>
                    <p className="text-gray-300 text-sm">Cryptographic proof of authenticity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">API Reference</h2>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-purple-400 mb-4">Coming Soon</h3>
              <p className="text-gray-300 mb-6">
                Our comprehensive API will allow developers to integrate Bitcoin Art functionality into their applications.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-white mb-3">Planned Endpoints</h4>
                  <ul className="text-gray-300 space-y-2 font-mono text-sm">
                    <li>GET /api/artworks</li>
                    <li>POST /api/artworks/mint</li>
                    <li>GET /api/collections</li>
                    <li>POST /api/marketplace/list</li>
                    <li>GET /api/user/portfolio</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-3">Features</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• RESTful API design</li>
                    <li>• Authentication via API keys</li>
                    <li>• Rate limiting and quotas</li>
                    <li>• Webhook notifications</li>
                    <li>• SDK for popular languages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`min-h-screen bg-black text-white ${
        !isMobile && !devSidebarCollapsed ? 'pl-[50px]' : ''
      } ${!isMobile && devSidebarCollapsed ? 'pl-[50px]' : ''}`}
      style={{
        marginTop: '112px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 sticky top-8">
              <h3 className="font-bold text-white mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}