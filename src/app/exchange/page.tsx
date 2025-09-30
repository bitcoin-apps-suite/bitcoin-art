'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';

export default function ExchangePage() {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      return saved === 'true';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');

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

  const mockArtworks = [
    {
      id: 1,
      title: "Digital Sunset",
      artist: "CryptoArtist",
      price: 0.5,
      currency: "BSV",
      image: "/api/placeholder/300/300",
      category: "Digital Art"
    },
    {
      id: 2,
      title: "Neon Dreams",
      artist: "PixelMaster",
      price: 1.2,
      currency: "BSV",
      image: "/api/placeholder/300/300",
      category: "Abstract"
    },
    {
      id: 3,
      title: "Bitcoin Genesis",
      artist: "BlockchainArt",
      price: 2.1,
      currency: "BSV",
      image: "/api/placeholder/300/300",
      category: "Crypto Art"
    }
  ];

  const mockTokens = [
    {
      symbol: "$bART",
      name: "Bitcoin Art Token",
      price: 0.001,
      change: "+5.2%",
      volume: "125,400",
      marketCap: "1,000,000"
    },
    {
      symbol: "$PAINT",
      name: "Digital Paint Shares",
      price: 0.0005,
      change: "+2.1%",
      volume: "89,200",
      marketCap: "500,000"
    }
  ];

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Art Exchange
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Trade digital art NFTs, tokens, and fractional art shares
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            NFT Marketplace
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'tokens'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Token Trading
          </button>
          <button
            onClick={() => setActiveTab('shares')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'shares'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Art Shares
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'marketplace' && (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h3 className="text-sm text-gray-400 mb-1">Total Volume</h3>
                <p className="text-xl font-bold text-white">1,234.5 BSV</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h3 className="text-sm text-gray-400 mb-1">Active Listings</h3>
                <p className="text-xl font-bold text-white">256</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h3 className="text-sm text-gray-400 mb-1">Floor Price</h3>
                <p className="text-xl font-bold text-white">0.1 BSV</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <h3 className="text-sm text-gray-400 mb-1">Artists</h3>
                <p className="text-xl font-bold text-white">48</p>
              </div>
            </div>

            {/* Artwork Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockArtworks.map((artwork) => (
                <div key={artwork.id} className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                  <div className="aspect-square bg-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      🎨 Artwork Preview
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1">{artwork.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">by {artwork.artist}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold text-white">{artwork.price} {artwork.currency}</p>
                        <p className="text-xs text-gray-400">{artwork.category}</p>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div>
            {/* Token Trading Interface */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-6">
                  <h3 className="text-xl font-bold mb-4">Token Prices</h3>
                  <div className="space-y-4">
                    {mockTokens.map((token, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="font-bold text-white">{token.symbol}</h4>
                          <p className="text-sm text-gray-400">{token.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{token.price} BSV</p>
                          <p className={`text-sm ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Vol: {token.volume}</p>
                          <p className="text-sm text-gray-400">Cap: ${token.marketCap}</p>
                        </div>
                        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition-colors">
                          Trade
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-bold mb-4">Quick Trade</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">From</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white">
                        <option>BSV</option>
                        <option>$bART</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">To</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white">
                        <option>$bART</option>
                        <option>BSV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Amount</label>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white"
                      />
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity">
                      Swap Tokens
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shares' && (
          <div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center">
              <h3 className="text-2xl font-bold mb-4">Art Shares Coming Soon</h3>
              <p className="text-gray-300 mb-6">
                Fractional ownership of high-value artworks will enable broader participation in the art market.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Fractional Ownership</h4>
                  <p className="text-sm text-gray-300">Own shares of expensive artworks</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Dividend Rights</h4>
                  <p className="text-sm text-gray-300">Earn from artwork appreciation</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-400 mb-2">Liquid Trading</h4>
                  <p className="text-sm text-gray-300">Trade shares on the open market</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-purple-500/50 rounded-lg font-bold cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}