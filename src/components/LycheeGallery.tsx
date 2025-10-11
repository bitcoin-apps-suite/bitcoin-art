'use client';

import { useState, useEffect } from 'react';
import { Search, Grid, Image, Heart, Download, Share2, Eye, Calendar, User, Tag } from 'lucide-react';

interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  tags: string[];
  createdAt: string;
  price?: string;
  likes: number;
  views: number;
  collection?: string;
}

interface LycheeGalleryProps {
  onArtSelect?: (art: ArtPiece) => void;
}

export default function LycheeGallery({ onArtSelect }: LycheeGalleryProps) {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  // Sample Bitcoin Art pieces (in production, this would come from API/database)
  useEffect(() => {
    const sampleArt: ArtPiece[] = [
      {
        id: '1',
        title: 'Bitcoin Genesis',
        artist: 'SatoshiArtist',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'A stunning representation of the Bitcoin genesis block in abstract form.',
        tags: ['bitcoin', 'genesis', 'abstract', 'orange'],
        createdAt: '2024-01-15',
        price: '50,000 $BART',
        likes: 127,
        views: 1523,
        collection: 'Crypto Origins'
      },
      {
        id: '2',
        title: 'Digital Horizon',
        artist: 'CryptoCanvas',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'Exploring the intersection of traditional art and blockchain technology.',
        tags: ['digital', 'horizon', 'purple', 'futuristic'],
        createdAt: '2024-02-01',
        price: '75,000 $BART',
        likes: 89,
        views: 967,
        collection: 'Digital Futures'
      },
      {
        id: '3',
        title: 'Proof of Work',
        artist: 'HashArtist',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'Visual representation of computational proof through artistic expression.',
        tags: ['proof-of-work', 'computation', 'green', 'technical'],
        createdAt: '2024-01-28',
        price: '125,000 $BART',
        likes: 203,
        views: 2341,
        collection: 'Tech Art'
      },
      {
        id: '4',
        title: 'Lightning Network',
        artist: 'VoltageCreator',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'Dynamic visualization of lightning-fast Bitcoin transactions.',
        tags: ['lightning', 'network', 'blue', 'energy'],
        createdAt: '2024-02-10',
        price: '90,000 $BART',
        likes: 156,
        views: 1879,
        collection: 'Lightning Series'
      },
      {
        id: '5',
        title: 'Decentralized Dreams',
        artist: 'BlockchainBrush',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'An artistic interpretation of decentralized networks and freedom.',
        tags: ['decentralized', 'dreams', 'silver', 'freedom'],
        createdAt: '2024-01-20',
        price: '60,000 $BART',
        likes: 178,
        views: 1654,
        collection: 'Freedom Collection'
      },
      {
        id: '6',
        title: 'Hash Rate Harmony',
        artist: 'MinerMuse',
        imageUrl: '/api/placeholder/800/600',
        thumbnailUrl: '/api/placeholder/300/225',
        description: 'The rhythmic beauty of hash rate fluctuations visualized.',
        tags: ['hash-rate', 'harmony', 'gold', 'rhythm'],
        createdAt: '2024-02-05',
        price: '85,000 $BART',
        likes: 134,
        views: 1432,
        collection: 'Mining Art'
      }
    ];

    setTimeout(() => {
      setArtPieces(sampleArt);
      setLoading(false);
    }, 1000);
  }, []);

  const collections = ['all', ...Array.from(new Set(artPieces.map(art => art.collection).filter(Boolean)))];

  const filteredArt = artPieces.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         art.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         art.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCollection = selectedCollection === 'all' || art.collection === selectedCollection;
    return matchesSearch && matchesCollection;
  });

  const handleArtClick = (art: ArtPiece) => {
    setSelectedArt(art);
    onArtSelect?.(art);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#8b5cf6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTop: '3px solid #8b5cf6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading Bitcoin Art Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#ffffff'
    }}>
      {/* Gallery Header */}
      <div style={{
        marginBottom: '30px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#ffffff'
        }}>
          <span style={{ color: '#ffffff' }}>Bitcoin</span>{' '}
          <span style={{ color: '#8b5cf6' }}>Art Gallery</span>
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '16px'
        }}>
          Discover and collect unique digital art on the Bitcoin blockchain
        </p>
      </div>

      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '30px',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '300px', flex: 1 }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.5)'
          }} />
          <input
            type="text"
            placeholder="Search artworks, artists, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Collection Filter */}
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          {collections.map(collection => (
            <option key={collection} value={collection} style={{ background: '#1a1a1a' }}>
              {collection === 'all' ? 'All Collections' : collection}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '12px 16px',
              background: viewMode === 'grid' ? '#8b5cf6' : 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              borderRadius: '8px 0 0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Grid size={16} />
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '12px 16px',
              background: viewMode === 'list' ? '#8b5cf6' : 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Image size={16} />
            List
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {filteredArt.map(art => (
            <div
              key={art.id}
              onClick={() => handleArtClick(art)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image */}
              <div style={{
                height: '200px',
                background: `linear-gradient(45deg, #8b5cf6, #a855f7)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Image size={48} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '20px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Eye size={12} />
                  {art.views}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  color: '#ffffff'
                }}>
                  {art.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px'
                }}>
                  by {art.artist}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {art.description.length > 80 ? art.description.substring(0, 80) + '...' : art.description}
                </p>

                {/* Price and Stats */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#22c55e'
                  }}>
                    {art.price}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={12} />
                      {art.likes}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {art.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '10px',
                        padding: '4px 8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: '#8b5cf6',
                        borderRadius: '12px',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div style={{ marginBottom: '40px' }}>
          {filteredArt.map(art => (
            <div
              key={art.id}
              onClick={() => handleArtClick(art)}
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                marginBottom: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '120px',
                height: '90px',
                background: `linear-gradient(45deg, #8b5cf6, #a855f7)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Image size={32} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#ffffff' }}>
                      {art.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      by {art.artist}
                    </p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>
                    {art.price}
                  </span>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  {art.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    {art.tags.slice(0, 4).map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '10px',
                          padding: '4px 8px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          color: '#8b5cf6',
                          borderRadius: '12px',
                          border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={12} />
                      {art.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} />
                      {art.views}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        Showing {filteredArt.length} of {artPieces.length} artworks
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