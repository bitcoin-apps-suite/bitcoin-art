'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import AppHeader from '@/components/AppHeader';
import Dock from '@/components/Dock';
import { HandCashService } from '@/services/HandCashService';

interface ArtContract {
  id: string;
  title: string;
  description: string;
  client: string;
  reward: string;
  estimatedDays: number;
  priority: 'Urgent' | 'High' | 'Standard' | 'Flexible';
  status: 'available' | 'claimed' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  category: 'digital_art' | 'nft_creation' | 'album_cover' | 'portrait' | 'concept_art' | 'logo_design' | 'animation' | 'illustration';
  medium: 'digital_painting' | '3d_modeling' | 'photography' | 'vector_art' | 'pixel_art' | 'mixed_media';
  assignee?: {
    artistName: string;
    handcashHandle?: string;
    claimedAt: string;
    deadline: string;
    portfolio?: string;
  };
  requirements: string[];
  deliverables: string[];
  artSpecs: {
    dimensions?: string;
    format?: string;
    colorProfile?: string;
    resolution?: string;
    style?: string;
  };
  createdAt: string;
  deadline: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ArtContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ArtContract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'digital_art' | 'nft_creation' | 'commissions'>('digital_art');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Form state for claim modal
  const [claimForm, setClaimForm] = useState({
    artistName: '',
    handcashHandle: '',
    portfolioUrl: '',
    estimatedDays: 7
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    fetchContracts();
    checkAuthentication();
    
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    // Set loaded after a brief delay to prevent FOUC
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const checkAuthentication = () => {
    setIsAuthenticated(handcashService.isAuthenticated());
  };

  const fetchContracts = async () => {
    try {
      // For now, use sample art contracts data
      // In production, this would fetch from a dedicated art contracts API
      const sampleContracts: ArtContract[] = [
        {
          id: '1',
          title: 'Bitcoin Art Logo Redesign',
          description: 'Create a modern, vibrant logo for Bitcoin Art platform that captures the essence of digital creativity and blockchain innovation.',
          client: 'Bitcoin Art Platform',
          reward: '50,000 $BART',
          estimatedDays: 5,
          priority: 'High',
          status: 'available',
          category: 'logo_design',
          medium: 'vector_art',
          requirements: [
            'Modern and professional design',
            'Scalable vector format',
            'Works in both light and dark themes',
            'Incorporates Bitcoin and art elements'
          ],
          deliverables: [
            'Final logo in SVG, PNG, and PDF formats',
            'Logo variations (horizontal, vertical, icon-only)',
            'Brand guidelines document',
            'Color palette specifications'
          ],
          artSpecs: {
            format: 'SVG, PNG, PDF',
            style: 'Modern, minimalist',
            colorProfile: 'RGB/CMYK'
          },
          createdAt: '2025-10-10T10:00:00Z',
          deadline: '2025-10-20T23:59:59Z'
        },
        {
          id: '2',
          title: 'Abstract Digital Art Series',
          description: 'Create a collection of 10 abstract digital artworks exploring themes of decentralization, freedom, and digital transformation.',
          client: 'CryptoCollector_47',
          reward: '150,000 $BART',
          estimatedDays: 14,
          priority: 'Standard',
          status: 'available',
          category: 'digital_art',
          medium: 'digital_painting',
          requirements: [
            'Abstract style with bold colors',
            'Each piece should be unique but cohesive',
            'High resolution for printing',
            'Crypto/blockchain thematic elements'
          ],
          deliverables: [
            '10 original digital artworks',
            'High-resolution files (300 DPI)',
            'NFT-ready metadata',
            'Artist statement for collection'
          ],
          artSpecs: {
            dimensions: '3000x3000 pixels',
            format: 'PNG, JPEG',
            resolution: '300 DPI',
            style: 'Abstract, contemporary'
          },
          createdAt: '2025-10-09T14:30:00Z',
          deadline: '2025-10-25T23:59:59Z'
        },
        {
          id: '3',
          title: 'Animated Bitcoin Mascot',
          description: 'Design and animate a friendly mascot character for Bitcoin Art that can be used across marketing materials and the platform.',
          client: 'Marketing Team',
          reward: '75,000 $BART',
          estimatedDays: 10,
          priority: 'High',
          status: 'claimed',
          category: 'animation',
          medium: 'digital_painting',
          assignee: {
            artistName: 'PixelMaster99',
            handcashHandle: 'pixelmaster',
            claimedAt: '2025-10-08T16:20:00Z',
            deadline: '2025-10-22T23:59:59Z',
            portfolio: 'https://pixelmaster99.art'
          },
          requirements: [
            'Friendly and approachable character',
            'Multiple animation cycles (idle, excited, working)',
            'Consistent with brand colors',
            'Suitable for web and mobile use'
          ],
          deliverables: [
            'Character design sheets',
            'Animation files (GIF, MP4)',
            'Individual frame assets',
            'Usage guidelines document'
          ],
          artSpecs: {
            dimensions: '512x512 pixels base',
            format: 'GIF, MP4, PNG sequences',
            style: 'Cartoon, friendly',
            colorProfile: 'RGB'
          },
          createdAt: '2025-10-05T09:15:00Z',
          deadline: '2025-10-22T23:59:59Z'
        },
        {
          id: '4',
          title: 'Album Cover: "Digital Dreams"',
          description: 'Create an eye-catching album cover for an electronic music album themed around cryptocurrency and digital art.',
          client: 'SynthWave_Producer',
          reward: '25,000 $BART',
          estimatedDays: 3,
          priority: 'Urgent',
          status: 'available',
          category: 'album_cover',
          medium: 'mixed_media',
          requirements: [
            'Synthwave/retrowave aesthetic',
            'Incorporate neon colors and grid patterns',
            'Include album title and artist name',
            'Square format for digital release'
          ],
          deliverables: [
            'Final album cover design',
            'High-resolution print version',
            'Social media variants',
            'Source files for future edits'
          ],
          artSpecs: {
            dimensions: '3000x3000 pixels',
            format: 'PNG, JPEG, PSD',
            resolution: '300 DPI',
            style: 'Synthwave, retro-futuristic'
          },
          createdAt: '2025-10-10T18:45:00Z',
          deadline: '2025-10-15T12:00:00Z'
        },
        {
          id: '5',
          title: 'Portrait Commission: Crypto Pioneer',
          description: 'Create a digital portrait of a cryptocurrency pioneer in a modern artistic style for display in virtual gallery.',
          client: 'VirtualGallery_X',
          reward: '40,000 $BART',
          estimatedDays: 7,
          priority: 'Standard',
          status: 'review',
          category: 'portrait',
          medium: 'digital_painting',
          assignee: {
            artistName: 'PortraitPro_Sarah',
            handcashHandle: 'sarahpaints',
            claimedAt: '2025-10-01T11:30:00Z',
            deadline: '2025-10-15T23:59:59Z',
            portfolio: 'https://sarahportraits.crypto'
          },
          requirements: [
            'Photorealistic style with artistic flair',
            'Suitable for large display in VR',
            'Incorporate subtle tech/crypto elements',
            'Professional quality for gallery exhibition'
          ],
          deliverables: [
            'Final portrait in ultra-high resolution',
            'VR-optimized version',
            'Time-lapse creation video',
            'Artist signature and authentication'
          ],
          artSpecs: {
            dimensions: '6000x8000 pixels',
            format: 'PNG, TIFF',
            resolution: '300 DPI',
            style: 'Photorealistic with artistic interpretation'
          },
          createdAt: '2025-09-28T13:20:00Z',
          deadline: '2025-10-15T23:59:59Z'
        },
        {
          id: '6',
          title: 'NFT Collection: Pixel Bitcoins',
          description: 'Design a 100-piece NFT collection featuring pixelated Bitcoin symbols with different rarity traits and attributes.',
          client: 'NFT_Entrepreneur',
          reward: '200,000 $BART',
          estimatedDays: 21,
          priority: 'Standard',
          status: 'available',
          category: 'nft_creation',
          medium: 'pixel_art',
          requirements: [
            '100 unique variations',
            'Rarity system with different traits',
            'Consistent 32x32 pixel art style',
            'Metadata JSON for each NFT'
          ],
          deliverables: [
            '100 unique pixel art pieces',
            'Rarity breakdown document',
            'NFT metadata files',
            'Collection description and story'
          ],
          artSpecs: {
            dimensions: '1024x1024 pixels (32x32 scaled)',
            format: 'PNG',
            style: 'Pixel art, retro gaming',
            colorProfile: 'Limited palette'
          },
          createdAt: '2025-10-07T08:00:00Z',
          deadline: '2025-11-05T23:59:59Z'
        }
      ];
      
      setContracts(sampleContracts);
    } catch (error) {
      console.error('Error loading art contracts:', error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimContract = (contract: ArtContract) => {
    setSelectedContract(contract);
    setShowClaimModal(true);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContract) return;
    
    try {
      // In production, this would submit to an API
      console.log('Claiming contract:', selectedContract.id, claimForm);
      
      // Update local state
      setContracts(prev => prev.map(contract => 
        contract.id === selectedContract.id 
          ? {
              ...contract,
              status: 'claimed' as const,
              assignee: {
                artistName: claimForm.artistName,
                handcashHandle: claimForm.handcashHandle,
                claimedAt: new Date().toISOString(),
                deadline: new Date(Date.now() + claimForm.estimatedDays * 24 * 60 * 60 * 1000).toISOString(),
                portfolio: claimForm.portfolioUrl
              }
            }
          : contract
      ));
      
      setShowClaimModal(false);
      setSelectedContract(null);
      setClaimForm({
        artistName: '',
        handcashHandle: '',
        portfolioUrl: '',
        estimatedDays: 7
      });
      
      alert('Contract claimed successfully!');
    } catch (error) {
      console.error('Error claiming contract:', error);
      alert('Error claiming contract. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'claimed': return '#eab308';
      case 'in_progress': return '#3b82f6';
      case 'review': return '#8b5cf6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'standard': return '#eab308';
      case 'flexible': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'digital_art') {
      return ['digital_art', 'illustration', 'concept_art'].includes(contract.category);
    } else if (activeTab === 'nft_creation') {
      return contract.category === 'nft_creation';
    } else if (activeTab === 'commissions') {
      return ['portrait', 'album_cover', 'logo_design', 'animation'].includes(contract.category);
    }
    return true;
  });

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    return `${Math.ceil(diffDays / 7)} weeks left`;
  };

  return (
    <div className="App">
      <ProofOfConceptBar />
      <TopMenuBar />
      <AppHeader />
      
      {/* Developer Sidebar - only on desktop */}
      {!isMobile && <DevSidebar />}
      
      <div className={`contracts-page ${isLoaded ? 'loaded' : 'loading'}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1><span style={{color: '#ffffff'}}>Art</span> <span style={{color: '#8b5cf6'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              Find and claim art commissions, create beautiful works, earn BART tokens
            </p>
            <div className="contracts-badge">ART COMMISSIONS</div>
          </section>

          {/* Tab Navigation */}
          <section className="contracts-tabs-section">
            <div className="contracts-tabs">
              <button 
                className={activeTab === 'digital_art' ? 'active' : ''}
                onClick={() => setActiveTab('digital_art')}
              >
                Digital Art
              </button>
              <button 
                className={activeTab === 'nft_creation' ? 'active' : ''}
                onClick={() => setActiveTab('nft_creation')}
              >
                NFT Collections
              </button>
              <button 
                className={activeTab === 'commissions' ? 'active' : ''}
                onClick={() => setActiveTab('commissions')}
              >
                Commissions
              </button>
            </div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'claimed' || c.status === 'in_progress').length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'review').length}</span>
              <span className="stat-label">Under Review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          {loading ? (
            <div className="contracts-loading">Loading art contracts...</div>
          ) : (
            <div className="contracts-grid">
              {filteredContracts.map(contract => (
                <div 
                  key={contract.id} 
                  className={`contract-card ${contract.status !== 'available' ? 'contract-unavailable' : ''}`}
                  onClick={() => contract.status === 'available' && setSelectedContract(contract)}
                >
                  <div className="contract-header">
                    <h3>{contract.title}</h3>
                    <span 
                      className="contract-status"
                      style={{ background: getStatusColor(contract.status) }}
                    >
                      {contract.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="contract-description">{contract.description}</p>
                  
                  <div className="contract-client">
                    <strong>Client:</strong> {contract.client}
                  </div>
                  
                  <div className="contract-meta">
                    <span 
                      className="contract-priority"
                      style={{ background: getPriorityColor(contract.priority) }}
                    >
                      {contract.priority}
                    </span>
                    <span className="contract-reward">{contract.reward}</span>
                    <span className="contract-time">{contract.estimatedDays}d</span>
                  </div>

                  <div className="contract-deadline">
                    {formatDeadline(contract.deadline)}
                  </div>

                  {contract.assignee && (
                    <div className="contract-assignee">
                      <span>Artist: {contract.assignee.artistName}</span>
                      {contract.assignee.portfolio && (
                        <a href={contract.assignee.portfolio} target="_blank" rel="noopener noreferrer">
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}

                  {contract.status === 'available' && (
                    <button 
                      className="claim-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaimContract(contract);
                      }}
                    >
                      Claim Contract
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contract Detail Modal */}
          {selectedContract && !showClaimModal && (
            <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{selectedContract.title}</h2>
                  <button onClick={() => setSelectedContract(null)}>×</button>
                </div>
                
                <div className="modal-content">
                  <div className="modal-section">
                    <h4>Description</h4>
                    <p>{selectedContract.description}</p>
                  </div>

                  <div className="modal-section">
                    <h4>Client</h4>
                    <p>{selectedContract.client}</p>
                  </div>

                  <div className="modal-section">
                    <h4>Requirements</h4>
                    <ul>
                      {selectedContract.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-section">
                    <h4>Deliverables</h4>
                    <ul>
                      {selectedContract.deliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-section">
                    <h4>Art Specifications</h4>
                    <div className="art-specs">
                      {selectedContract.artSpecs.dimensions && (
                        <div><strong>Dimensions:</strong> {selectedContract.artSpecs.dimensions}</div>
                      )}
                      {selectedContract.artSpecs.format && (
                        <div><strong>Format:</strong> {selectedContract.artSpecs.format}</div>
                      )}
                      {selectedContract.artSpecs.resolution && (
                        <div><strong>Resolution:</strong> {selectedContract.artSpecs.resolution}</div>
                      )}
                      {selectedContract.artSpecs.style && (
                        <div><strong>Style:</strong> {selectedContract.artSpecs.style}</div>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={() => setShowClaimModal(true)}
                      className="modal-button primary"
                    >
                      Claim Contract ({selectedContract.reward})
                    </button>
                    <button 
                      onClick={() => setSelectedContract(null)}
                      className="modal-button secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Claim Modal */}
          {showClaimModal && selectedContract && (
            <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Claim Contract: {selectedContract.title}</h2>
                  <button onClick={() => setShowClaimModal(false)}>×</button>
                </div>
                
                <form onSubmit={handleSubmitClaim} className="modal-content">
                  <div className="contract-summary">
                    <p><strong>Reward:</strong> {selectedContract.reward}</p>
                    <p><strong>Estimated Time:</strong> {selectedContract.estimatedDays} days</p>
                    <p><strong>Deadline:</strong> {formatDeadline(selectedContract.deadline)}</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="artistName">Artist Name *</label>
                    <input
                      type="text"
                      id="artistName"
                      value={claimForm.artistName}
                      onChange={(e) => setClaimForm({...claimForm, artistName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="handcashHandle">HandCash Handle</label>
                    <input
                      type="text"
                      id="handcashHandle"
                      value={claimForm.handcashHandle}
                      onChange={(e) => setClaimForm({...claimForm, handcashHandle: e.target.value})}
                      placeholder="your-handcash-handle"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolioUrl">Portfolio URL</label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      value={claimForm.portfolioUrl}
                      onChange={(e) => setClaimForm({...claimForm, portfolioUrl: e.target.value})}
                      placeholder="https://your-portfolio.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="estimatedDays">Estimated Completion (days)</label>
                    <input
                      type="number"
                      id="estimatedDays"
                      value={claimForm.estimatedDays}
                      onChange={(e) => setClaimForm({...claimForm, estimatedDays: parseInt(e.target.value)})}
                      min="1"
                      max="30"
                    />
                  </div>

                  <div className="claim-terms">
                    <h4>Contract Terms</h4>
                    <ul>
                      <li>Payment in $BART tokens upon completion and approval</li>
                      <li>Work must meet all specified requirements</li>
                      <li>Original artwork with full rights transfer</li>
                      <li>Revisions may be requested during review</li>
                      <li>Cancellation possible with 24h notice</li>
                    </ul>
                  </div>
                  
                  <button type="submit" className="submit-claim-button">
                    Accept & Claim Contract
                  </button>
                </form>
              </div>
            </div>
          )}
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

        /* Contracts Page - Bitcoin Art Purple Theme */
        .contracts-page {
          background: transparent;
          color: #ffffff;
          min-height: calc(100vh - 96px);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding-top: 96px;
          padding-bottom: 120px;
          font-weight: 300;
          transition: margin-left 0.3s ease, opacity 0.3s ease;
          margin-left: 260px;
          overflow-y: auto;
        }

        /* Prevent FOUC */
        .contracts-page.loading {
          opacity: 0;
          visibility: hidden;
        }

        .contracts-page.loaded {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .contracts-page {
            margin-left: 0;
            padding-bottom: 100px;
          }
        }

        .contracts-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Hero Section */
        .contracts-hero {
          min-height: 30vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px 40px;
          position: relative;
        }

        .contracts-hero h1 {
          font-size: 42px;
          font-weight: 200;
          margin: 0 0 16px 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .contracts-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto 30px;
          line-height: 1.4;
          font-weight: 300;
        }

        .contracts-badge {
          display: inline-block;
          padding: 8px 24px;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 16px;
        }

        /* Tabs */
        .contracts-tabs-section {
          margin: 40px 0;
          display: flex;
          justify-content: center;
        }

        .contracts-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .contracts-tabs button {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .contracts-tabs button.active {
          background: #8b5cf6;
          color: white;
        }

        .contracts-tabs button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
        }

        /* Stats */
        .contracts-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 600;
          color: #8b5cf6;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        /* Contracts Grid */
        .contracts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .contract-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .contract-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
        }

        .contract-unavailable {
          opacity: 0.6;
          cursor: default;
        }

        .contract-unavailable:hover {
          transform: none;
          border-color: rgba(255, 255, 255, 0.05);
          box-shadow: none;
        }

        .contract-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .contract-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .contract-status {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
          flex-shrink: 0;
        }

        .contract-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .contract-client {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 16px;
        }

        .contract-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .contract-priority {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .contract-reward {
          font-size: 12px;
          color: #22c55e;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .contract-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .contract-deadline {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 12px;
        }

        .contract-assignee {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contract-assignee a {
          color: #8b5cf6;
          text-decoration: none;
        }

        .claim-button {
          width: 100%;
          padding: 12px;
          background: #8b5cf6;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .claim-button:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 24px 0;
          line-height: 1.3;
        }

        .modal-header button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .modal-content {
          padding: 0 24px 24px;
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #8b5cf6;
        }

        .modal-section p {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .modal-section ul {
          margin: 0;
          padding-left: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .modal-section li {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .art-specs div {
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .modal-button.primary {
          background: #8b5cf6;
          color: white;
        }

        .modal-button.primary:hover {
          background: #7c3aed;
        }

        .modal-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .modal-button.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Form */
        .contract-summary {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .contract-summary p {
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        .claim-terms {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .claim-terms h4 {
          margin: 0 0 12px 0;
          color: #8b5cf6;
          font-size: 16px;
        }

        .claim-terms ul {
          margin: 0;
          padding-left: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .claim-terms li {
          margin-bottom: 8px;
          font-size: 13px;
        }

        .submit-claim-button {
          width: 100%;
          padding: 16px;
          background: #8b5cf6;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-claim-button:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .contracts-loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contracts-hero h1 {
            font-size: 32px;
          }
          
          .contracts-tagline {
            font-size: 14px;
          }
          
          .contracts-tabs {
            flex-direction: column;
            align-items: center;
          }
          
          .contracts-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .contracts-grid {
            grid-template-columns: 1fr;
          }
          
          .contract-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}