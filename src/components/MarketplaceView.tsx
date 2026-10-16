'use client';

import { useState } from 'react';
import {
  Search,
  
  TrendingUp,
  
  Heart,
  ShoppingCart,
  Eye,
  Bitcoin,
  Sparkles,
  Grid,
  List,
} from 'lucide-react';

interface ArtworkItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  likes: number;
  views: number;
  imageUrl: string;
  category: string;
  isNew: boolean;
  isTrending: boolean;
}

export default function MarketplaceView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // Listings will come from artists listing on-chain; none yet.
  const artworks: ArtworkItem[] = [];

  const categories = [
    { id: 'all', label: 'All Artworks', icon: Grid },
    { id: 'digital', label: 'Digital Art', icon: Sparkles },
    { id: 'crypto', label: 'Crypto Art', icon: Bitcoin },
    { id: 'abstract', label: 'Abstract', icon: Grid },
    { id: 'landscape', label: 'Landscapes', icon: Grid },
    { id: 'generative', label: 'Generative', icon: Sparkles },
  ];

  const filteredArtworks = artworks.filter(
    (art) => selectedCategory === 'all' || art.category === selectedCategory
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      {/* Header */}
      <div
        style={{
          padding: '24px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            Art Marketplace
          </h1>
          <p style={{ color: '#999' }}>
            Discover, collect, and trade unique digital artworks on Bitcoin
          </p>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <Search size={20} style={{ color: '#8b5cf6', marginRight: '12px' }} />
              <input
                type="text"
                placeholder="Search artworks, artists, or collections..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '16px',
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
                color: '#8b5cf6',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="trending">Trending</option>
              <option value="new">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="most-liked">Most Liked</option>
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '12px',
                  background: viewMode === 'grid' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                }}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '12px',
                  background: viewMode === 'list' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                }}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === cat.id ? 'linear-gradient(135deg, #8b5cf6, #c084fc)' : 'rgba(139, 92, 246, 0.1)',
                  border: 'none',
                  borderRadius: '20px',
                  color: selectedCategory === cat.id ? 'white' : '#8b5cf6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: selectedCategory === cat.id ? 600 : 400,
                }}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Artworks Grid/List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {viewMode === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {filteredArtworks.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.6)' }}>No artworks are listed for sale yet.</p>}
              {filteredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  style={{
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Artwork Image */}
                  <div
                    style={{
                      height: '280px',
                      background: `linear-gradient(135deg, #8b5cf6, #c084fc)`,
                      position: 'relative',
                    }}
                  >
                    {artwork.isNew && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 12px',
                          background: 'rgba(139, 92, 246, 0.9)',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        NEW
                      </span>
                    )}
                    {artwork.isTrending && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: '#8b5cf6',
                          borderRadius: '50%',
                        }}
                      >
                        <TrendingUp size={16} />
                      </span>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {artwork.title}
                    </div>
                  </div>

                  {/* Artwork Details */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                      {artwork.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>
                      by {artwork.artist}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bitcoin size={18} color="#8b5cf6" />
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>
                          {artwork.price}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Heart size={16} color="#999" />
                          <span style={{ fontSize: '14px', color: '#999' }}>{artwork.likes}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={16} color="#999" />
                          <span style={{ fontSize: '14px', color: '#999' }}>{artwork.views}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <ShoppingCart size={16} />
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  style={{
                    display: 'flex',
                    background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    padding: '16px',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      background: `linear-gradient(135deg, #8b5cf6, #c084fc)`,
                      borderRadius: '8px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                      {artwork.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
                      by {artwork.artist}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bitcoin size={18} color="#8b5cf6" />
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>
                          {artwork.price}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Heart size={16} color="#999" />
                          <span style={{ fontSize: '14px', color: '#999' }}>{artwork.likes}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={16} color="#999" />
                          <span style={{ fontSize: '14px', color: '#999' }}>{artwork.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShoppingCart size={16} />
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}