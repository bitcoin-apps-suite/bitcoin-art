'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import AppHeader from '@/components/AppHeader';
import Dock from '@/components/Dock';
import { HandCashService } from '@/services/HandCashService';

interface Contract {
  id: string;
  githubIssueNumber: number;
  githubIssueUrl: string;
  title: string;
  description: string;
  reward: string;
  estimatedHours: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'available' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'expired';
  category: 'artist' | 'developer' | 'designer';
  assignee?: {
    githubUsername: string;
    handcashHandle?: string;
    claimedAt: string;
    deadline: string;
  };
  pullRequest?: {
    number: number;
    url: string;
    status: 'open' | 'closed' | 'merged';
  };
  skills: string[];
  deliverables: string[];
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'artist' | 'developer' | 'designer'>('artist');
  const [isMobile, setIsMobile] = useState(false);
  
  // Form state for claim modal
  const [claimForm, setClaimForm] = useState({
    githubUsername: '',
    handcashHandle: '',
    estimatedDays: 7
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    fetchContracts();
    checkAuthentication();
    
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const checkAuthentication = () => {
    setIsAuthenticated(handcashService.isAuthenticated());
  };

  const fetchContracts = async () => {
    try {
      // Fetch GitHub issues from Bitcoin-Art repository
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-art/issues?state=all&per_page=100');
      
      if (!response.ok) {
        console.warn('GitHub API response not OK:', response.status);
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const issues = await response.json();
      
      if (!Array.isArray(issues)) {
        throw new Error('Invalid response format');
      }
      
      // Also fetch pull requests to match with issues
      const prsResponse = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-art/pulls?state=all&per_page=100');
      const pullRequests = prsResponse.ok ? await prsResponse.json() : [];
      
      // Map issues to contracts
      const mappedContracts: Contract[] = issues.map((issue: any) => {
        const body = issue.body || '';
        
        // Parse contract details from issue body
        let priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i);
        let hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*([\d,]+)/i);
        let rewardMatch = body.match(/\*\*Token Reward:\*\*\s*([\d,]+)\s*BART/i);
        let categoryMatch = body.match(/\*\*Category:\*\*\s*([^\n]+)/i);
        
        // Find matching PR if exists
        const matchingPR = pullRequests.find((pr: any) => 
          pr.body && pr.body.includes(`#${issue.number}`)
        );
        
        // Extract description
        let description = '';
        const descMatch = body.match(/##\s*(?:📋\s*)?Description\s*\n([\s\S]*?)(?=##|$)/i);
        if (descMatch) {
          description = descMatch[1].trim().split('\n\n')[0];
        } else {
          description = body.split('## Requirements')[0].replace('## Description', '').trim();
        }
        
        // Parse requirements for skills
        let skills: string[] = ['Digital Art', 'Blockchain'];
        const requirementsMatch = body.match(/##\s*(?:🎯\s*)?Requirements\s*\n([\s\S]*?)(?=##|$)/i);
        if (requirementsMatch) {
          const requirements = requirementsMatch[1];
          if (requirements.includes('NFT')) skills.push('NFT Creation');
          if (requirements.includes('3D')) skills.push('3D Modeling');
          if (requirements.includes('Photography')) skills.push('Photography');
          if (requirements.includes('Video')) skills.push('Video Editing');
          if (requirements.includes('Music')) skills.push('Music Production');
          if (requirements.includes('AI')) skills.push('AI Art');
          if (requirements.includes('Typography')) skills.push('Typography');
          if (requirements.includes('Illustration')) skills.push('Illustration');
        }
        
        // Handle bounty format
        if (!rewardMatch) {
          const bountyMatch = body.match(/([\d.]+)%\s*(?:of\s+tokens|Bounty)/i);
          if (bountyMatch) {
            const percentage = parseFloat(bountyMatch[1]);
            const tokens = Math.round(percentage * 10000000);
            rewardMatch = ['', tokens.toLocaleString()];
          }
        }
        
        // Extract deliverables
        const deliverables: string[] = [];
        const criteriaMatch = body.match(/##\s*(?:✅\s*)?Acceptance Criteria\s*\n([\s\S]*?)(?=##|$)/i);
        if (criteriaMatch) {
          const criteria = criteriaMatch[1];
          const items = criteria.match(/- \[ \] .*/g) || [];
          items.forEach((item: string) => {
            deliverables.push(item.replace('- [ ] ', '').trim());
          });
        }
        
        // Determine contract status
        let status: Contract['status'] = 'available';
        if (issue.state === 'closed') {
          status = 'completed';
        } else if (matchingPR) {
          if (matchingPR.state === 'closed' && matchingPR.merged_at) {
            status = 'completed';
          } else if (matchingPR.state === 'open') {
            status = 'submitted';
          }
        } else if (issue.assignee) {
          status = 'in_progress';
        }
        
        // Determine category based on title and content
        let category: 'artist' | 'developer' | 'designer' = 'artist';
        const titleLower = issue.title.toLowerCase();
        const bodyLower = body.toLowerCase();
        
        if (titleLower.includes('developer') || titleLower.includes('code') || 
            titleLower.includes('api') || bodyLower.includes('programming')) {
          category = 'developer';
        } else if (titleLower.includes('design') || titleLower.includes('ui') || 
                   titleLower.includes('ux') || bodyLower.includes('interface')) {
          category = 'designer';
        }
        
        // Get contract from localStorage if it exists
        const storedContract = localStorage.getItem(`contract-${issue.number}`);
        const contractData = storedContract ? JSON.parse(storedContract) : null;
        
        return {
          id: `contract-${issue.number}`,
          githubIssueNumber: issue.number,
          githubIssueUrl: issue.html_url,
          title: issue.title,
          description: description,
          reward: rewardMatch ? `${rewardMatch[1]} BART` : '5,000 BART',
          estimatedHours: hoursMatch ? parseInt(hoursMatch[1].replace(/,/g, '')) : 10,
          priority: (priorityMatch ? priorityMatch[1] : 'Medium') as Contract['priority'],
          category: category,
          status,
          assignee: contractData?.assignee || (issue.assignee ? {
            githubUsername: issue.assignee.login,
            claimedAt: issue.assigned_at || new Date().toISOString(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          } : undefined),
          pullRequest: matchingPR ? {
            number: matchingPR.number,
            url: matchingPR.html_url,
            status: matchingPR.state
          } : undefined,
          skills: Array.from(new Set(skills)),
          deliverables: deliverables.length > 0 ? deliverables.slice(0, 8) : ['See issue for details']
        };
      });
      
      setContracts(mappedContracts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      
      // Show a message directing users to GitHub
      setContracts([
        {
          id: 'github-redirect',
          githubIssueNumber: 0,
          githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-art/issues',
          title: '📋 View Contracts on GitHub',
          description: 'Unable to load contracts from GitHub API. This may be due to rate limiting or network issues. Click below to view all available contracts directly on GitHub.',
          priority: 'Low' as const,
          reward: 'Various',
          status: 'available' as const,
          category: 'artist' as const,
          estimatedHours: 0,
          skills: ['Visit GitHub'],
          deliverables: ['View and claim contracts on GitHub', 'Create new issues', 'Discuss bounties']
        }
      ]);
      setLoading(false);
    }
  };

  const handleClaimContract = async () => {
    if (!selectedContract || !claimForm.githubUsername || !claimForm.handcashHandle) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Calculate deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + claimForm.estimatedDays);
    
    // Store contract claim locally
    const contractClaim = {
      assignee: {
        githubUsername: claimForm.githubUsername,
        handcashHandle: claimForm.handcashHandle,
        claimedAt: new Date().toISOString(),
        deadline: deadline.toISOString()
      }
    };
    
    localStorage.setItem(`contract-${selectedContract.githubIssueNumber}`, JSON.stringify(contractClaim));
    
    // Update local state
    const updatedContracts = contracts.map(c => 
      c.id === selectedContract.id 
        ? { ...c, status: 'claimed' as Contract['status'], assignee: contractClaim.assignee }
        : c
    );
    setContracts(updatedContracts);
    
    // Close modals
    setShowClaimModal(false);
    setSelectedContract(null);
    
    alert(`Contract claimed successfully! You have ${claimForm.estimatedDays} days to complete this task.`);
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'claimed': return '#8b5cf6';
      case 'in_progress': return '#3b82f6';
      case 'submitted': return '#a78bfa';
      case 'completed': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Less than 1 hour';
  };

  return (
    <div className="App">
      <ProofOfConceptBar />
      <TopMenuBar />
      <AppHeader />
      
      {/* Developer Sidebar - only on desktop */}
      {!isMobile && <DevSidebar />}
      
      <div className="contracts-page">
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1><span style={{color: '#ffffff'}}>Bitcoin Art</span> <span style={{color: '#8b5cf6'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              {activeTab === 'artist' 
                ? 'Create stunning digital art, fulfill contracts, earn BART tokens'
                : activeTab === 'developer'
                ? 'Build platform features, integrate tools, get rewarded in BART'
                : 'Design beautiful interfaces, enhance UX, receive BART tokens'}
            </p>
            <div className="contracts-badge">CONTRACTS</div>
          </section>

          {/* Tab Navigation */}
          <section className="contracts-tabs-section">
            <div className="contracts-tabs">
              <button 
                className={activeTab === 'artist' ? 'active' : ''}
                onClick={() => setActiveTab('artist')}
              >
                Artist Contracts
              </button>
              <button 
                className={activeTab === 'developer' ? 'active' : ''}
                onClick={() => setActiveTab('developer')}
              >
                Developer Contracts
              </button>
              <button 
                className={activeTab === 'designer' ? 'active' : ''}
                onClick={() => setActiveTab('designer')}
              >
                Designer Contracts
              </button>
            </div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'available').length}</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.category === activeTab && (c.status === 'in_progress' || c.status === 'claimed')).length}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'submitted').length}</span>
              <span className="stat-label">Under Review</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.category === activeTab && c.status === 'completed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          {loading ? (
            <div className="contracts-loading">Loading contracts...</div>
          ) : (
            <div className="contracts-grid">
              {contracts.filter(c => c.category === activeTab).map(contract => (
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
                  
                  <div className="contract-meta">
                    <span className={`contract-priority priority-${contract.priority.toLowerCase()}`}>
                      {contract.priority}
                    </span>
                    <span className="contract-reward">{contract.reward}</span>
                    <span className="contract-time">{contract.estimatedHours}h</span>
                  </div>

                  {contract.assignee && (
                    <div className="contract-assignee">
                      <span className="assignee-label">Assigned to:</span>
                      <span className="assignee-name">@{contract.assignee.githubUsername}</span>
                      {contract.status === 'in_progress' && (
                        <span className="assignee-deadline">
                          {getTimeRemaining(contract.assignee.deadline)}
                        </span>
                      )}
                    </div>
                  )}

                  {contract.pullRequest && (
                    <div className="contract-pr">
                      <a 
                        href={contract.pullRequest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        PR #{contract.pullRequest.number} ({contract.pullRequest.status})
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contract Details Modal */}
          {selectedContract && (
            <div className="contract-modal" onClick={() => setSelectedContract(null)}>
              <div className="contract-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setSelectedContract(null)}>×</button>
                
                <h2>{selectedContract.title}</h2>
                
                <div className="contract-modal-meta">
                  <span className={`priority-badge priority-${selectedContract.priority.toLowerCase()}`}>
                    {selectedContract.priority} Priority
                  </span>
                  <span className="reward-badge">{selectedContract.reward}</span>
                  <span className="time-badge">{selectedContract.estimatedHours} hours</span>
                </div>

                <div className="contract-modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>

                <div className="contract-modal-section">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {selectedContract.skills.map(skill => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="contract-modal-section">
                  <h3>Deliverables</h3>
                  <ul className="deliverables-list">
                    {selectedContract.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="contract-modal-section">
                  <h3>Sign in to Claim</h3>
                  <div className="auth-options">
                    <button className="auth-button github-auth">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Sign in with GitHub
                    </button>
                    <button className="auth-button handcash-auth">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                      </svg>
                      Sign in with HandCash
                    </button>
                  </div>
                </div>

                <div className="contract-actions">
                  <a 
                    href={selectedContract.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-button"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Claim Contract Modal */}
          {showClaimModal && (
            <div className="claim-modal" onClick={() => setShowClaimModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setShowClaimModal(false)}>×</button>
                
                <h2>Claim Contract</h2>
                <p>By claiming this contract, you agree to deliver the work within the specified timeframe.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleClaimContract(); }}>
                  <div className="form-group">
                    <label>GitHub Username *</label>
                    <input
                      type="text"
                      value={claimForm.githubUsername}
                      onChange={(e) => setClaimForm({...claimForm, githubUsername: e.target.value})}
                      placeholder="your-github-username"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>HandCash Handle *</label>
                    <input
                      type="text"
                      value={claimForm.handcashHandle}
                      onChange={(e) => setClaimForm({...claimForm, handcashHandle: e.target.value})}
                      placeholder="$yourhandle"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Days to Complete *</label>
                    <select
                      value={claimForm.estimatedDays}
                      onChange={(e) => setClaimForm({...claimForm, estimatedDays: parseInt(e.target.value)})}
                    >
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days (default)</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                    </select>
                  </div>
                  
                  <div className="claim-terms">
                    <h4>Terms & Conditions:</h4>
                    <ul>
                      <li>You must submit a PR or deliverable within the agreed timeframe</li>
                      <li>Work must meet all acceptance criteria</li>
                      <li>Token rewards are distributed upon completion approval</li>
                      <li>Inactive contracts may be reassigned after deadline</li>
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
          min-height: calc(100vh - 176px); /* Account for header space */
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding-top: 96px;
          padding-bottom: 120px; /* Extra space for dock */
          font-weight: 300;
          transition: margin-left 0.3s ease;
          margin-left: 260px; /* Account for sidebar */
          overflow-y: auto;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .contracts-page {
            margin-left: 0;
            padding-bottom: 100px; /* Account for mobile dock */
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

        .contracts-badge {
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
          margin: 0 auto;
          line-height: 1.4;
          font-weight: 300;
        }

        /* Tab Navigation */
        .contracts-tabs-section {
          margin-bottom: 40px;
        }

        .contracts-tabs {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .contracts-tabs button {
          background: transparent;
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: rgba(255, 255, 255, 0.7);
          padding: 12px 24px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 400;
        }

        .contracts-tabs button:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }

        .contracts-tabs button.active {
          background: #8b5cf6;
          color: #ffffff;
          border-color: #8b5cf6;
        }

        /* Stats */
        .contracts-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.15);
        }

        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 200;
          color: #8b5cf6;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Loading */
        .contracts-loading {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
        }

        /* Contracts Grid */
        .contracts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 60px;
        }

        .contract-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .contract-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(139, 92, 246, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.1);
        }

        .contract-card.contract-unavailable {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contract-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .contract-header h3 {
          font-size: 18px;
          font-weight: 400;
          margin: 0;
          color: #ffffff;
          flex: 1;
          line-height: 1.4;
        }

        .contract-status {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #ffffff;
          white-space: nowrap;
        }

        .contract-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .contract-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .contract-priority {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .contract-priority.priority-critical {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .contract-priority.priority-high {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .contract-priority.priority-medium {
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        }

        .contract-priority.priority-low {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .contract-reward {
          font-weight: 600;
          color: #8b5cf6;
          font-size: 14px;
        }

        .contract-time {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .contract-assignee {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
        }

        .assignee-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          display: block;
          margin-bottom: 4px;
        }

        .assignee-name {
          color: #8b5cf6;
          font-weight: 500;
          font-size: 14px;
          display: block;
        }

        .assignee-deadline {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          display: block;
          margin-top: 4px;
        }

        .contract-pr {
          margin-top: 16px;
        }

        .contract-pr a {
          color: #8b5cf6;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }

        .contract-pr a:hover {
          text-decoration: underline;
        }

        /* Modal Styles */
        .contract-modal, .claim-modal {
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

        .contract-modal-content, .claim-modal-content {
          background: #1a1a1a;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 24px;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .contract-modal-content {
          padding: 32px;
          position: relative;
        }

        .contract-modal-content h2 {
          margin: 0 0 20px 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 400;
          padding-right: 40px;
        }

        .contract-modal-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .priority-badge, .reward-badge, .time-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .priority-badge {
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        }

        .reward-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .time-badge {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .contract-modal-section {
          margin-bottom: 32px;
        }

        .contract-modal-section h3 {
          margin: 0 0 16px 0;
          color: #8b5cf6;
          font-size: 18px;
          font-weight: 400;
        }

        .contract-modal-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-badge {
          padding: 4px 10px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 6px;
          color: #8b5cf6;
          font-size: 12px;
          font-weight: 500;
        }

        .deliverables-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .deliverables-list li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .deliverables-list li:last-child {
          border-bottom: none;
        }

        .auth-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .auth-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .contract-actions {
          text-align: center;
        }

        .github-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #8b5cf6;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .github-button:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        /* Claim Modal */
        .claim-modal-content {
          padding: 32px;
          position: relative;
        }

        .claim-modal-content h2 {
          margin: 0 0 16px 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 400;
          padding-right: 40px;
        }

        .claim-modal-content p {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #8b5cf6;
          font-size: 14px;
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