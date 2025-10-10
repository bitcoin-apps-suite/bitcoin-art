'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import AppHeader from '@/components/AppHeader';
import Dock from '@/components/Dock';
import { HandCashService } from '@/services/HandCashService';

interface DevelopmentContract {
  id: number;
  githubNumber: number;
  title: string;
  description: string;
  reward: string;
  estimatedHours: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'open' | 'closed';
  category: 'Developer' | 'Designer' | 'Artist' | 'Developer/Designer' | 'Developer/Artist';
  assignee?: { login: string; avatar_url: string };
  url: string;
  skills: string[];
  deliverables: string[];
  acceptanceCriteria: string[];
  createdAt: string;
  updatedAt: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  assignee?: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    name: string;
    color: string;
    description?: string;
  }>;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<DevelopmentContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<DevelopmentContract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [handcashService] = useState(new HandCashService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'development' | 'enhancement' | 'bug'>('development');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const checkSidebar = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setSidebarCollapsed(saved !== null ? saved === 'true' : true);
    };
    
    checkMobile();
    checkSidebar();
    fetchContracts();
    checkAuthentication();
    
    const handleResize = () => checkMobile();
    const sidebarInterval = setInterval(checkSidebar, 100);
    
    window.addEventListener('resize', handleResize);
    
    // Set loaded immediately - no more flash
    setIsLoaded(true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(sidebarInterval);
    };
  }, []);

  const checkAuthentication = () => {
    setIsAuthenticated(handcashService.isAuthenticated());
  };

  const parseTaskFromIssue = (issue: GitHubIssue): DevelopmentContract => {
    const lines = issue.body?.split('\n') || [];
    const taskMatch = lines.find(line => line.startsWith('## Task:'))?.replace('## Task:', '').trim();
    const rewardMatch = lines.find(line => line.startsWith('## Reward:'))?.replace('## Reward:', '').trim();
    const estimatedHoursMatch = lines.find(line => line.startsWith('## Estimated Hours:'))?.replace('## Estimated Hours:', '').trim();
    const skillsMatch = lines.find(line => line.startsWith('## Skills Required:'))?.replace('## Skills Required:', '').trim();
    
    // Determine category from labels
    let category: 'Developer' | 'Designer' | 'Artist' | 'Developer/Designer' | 'Developer/Artist' = 'Developer';
    if (issue.labels.some(label => label.name.includes('design'))) {
      category = 'Developer/Designer';
    } else if (issue.labels.some(label => label.name.includes('art') || label.name.includes('ui'))) {
      category = 'Developer/Artist';
    }
    
    // Determine priority from labels and calculate appropriate reward
    let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
    let defaultReward = '100,000 $BART'; // 0.01% of 1B tokens - base rate
    
    if (issue.labels.some(label => label.name.includes('critical') || label.name.includes('urgent'))) {
      priority = 'Critical';
      defaultReward = '1,000,000 $BART'; // 0.1% - maximum for critical tasks
    } else if (issue.labels.some(label => label.name.includes('high'))) {
      priority = 'High';
      defaultReward = '500,000 $BART'; // 0.05% - high priority
    } else if (issue.labels.some(label => label.name.includes('low'))) {
      priority = 'Low';
      defaultReward = '50,000 $BART'; // 0.005% - simple tasks
    }
    
    // Adjust for complexity based on category
    if (category.includes('Designer') || category.includes('Artist')) {
      const currentAmount = parseInt(defaultReward.replace(/[^0-9]/g, ''));
      defaultReward = `${Math.floor(currentAmount * 1.2).toLocaleString()} $BART`; // 20% bonus for design work
    }
    
    const skills = skillsMatch ? skillsMatch.split(',').map(s => s.trim()) : ['Development'];
    
    return {
      id: issue.id,
      githubNumber: issue.number,
      title: issue.title,
      description: taskMatch || issue.body || 'No description provided',
      reward: rewardMatch || defaultReward,
      estimatedHours: estimatedHoursMatch || '8-16 hours',
      priority,
      status: issue.state,
      category,
      assignee: issue.assignee,
      url: issue.html_url,
      skills,
      deliverables: [
        'Complete implementation of the feature/fix',
        'Unit tests for new functionality',
        'Documentation updates if applicable',
        'Code review and approval from maintainers'
      ],
      acceptanceCriteria: [
        'All requirements specified in the issue are met',
        'Code follows project coding standards',
        'Tests pass and coverage is maintained',
        'No breaking changes unless explicitly required'
      ],
      createdAt: issue.created_at,
      updatedAt: issue.updated_at
    };
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-art/issues?state=all&per_page=100');
      const githubIssues: GitHubIssue[] = await response.json();
      
      const developmentContracts = githubIssues.map(parseTaskFromIssue);
      setContracts(developmentContracts);
    } catch (error) {
      console.error('Error loading GitHub issues for contracts:', error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimContract = (contract: DevelopmentContract) => {
    setSelectedContract(contract);
    setShowClaimModal(true);
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
    if (activeTab === 'development') {
      return contract.category === 'Developer';
    } else if (activeTab === 'enhancement') {
      return ['Developer/Designer', 'Developer/Artist'].includes(contract.category);
    } else if (activeTab === 'bug') {
      return contract.priority === 'Critical' || contract.priority === 'High';
    }
    return true;
  });

  const formatCreatedDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Created today';
    if (diffDays === 1) return 'Created yesterday';
    if (diffDays < 7) return `Created ${diffDays} days ago`;
    if (diffDays < 30) return `Created ${Math.floor(diffDays / 7)} weeks ago`;
    return `Created ${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="App">
      <ProofOfConceptBar />
      <TopMenuBar />
      <AppHeader />
      
      {/* Developer Sidebar - only on desktop */}
      {!isMobile && <DevSidebar />}
      
      <div className={`contracts-page ${isLoaded ? 'loaded' : 'loading'} ${!isMobile ? (sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded') : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1><span style={{color: '#ffffff'}}>Development</span> <span style={{color: '#8b5cf6'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              Professional development contracts between Bitcoin Art platform and developers
            </p>
            <div className="contracts-badge">DEVELOPMENT CONTRACTS</div>
          </section>

          {/* Tab Navigation */}
          <section className="contracts-tabs-section">
            <div className="contracts-tabs">
              <button 
                className={activeTab === 'development' ? 'active' : ''}
                onClick={() => setActiveTab('development')}
              >
                Core Development
              </button>
              <button 
                className={activeTab === 'enhancement' ? 'active' : ''}
                onClick={() => setActiveTab('enhancement')}
              >
                UI/UX Enhancement
              </button>
              <button 
                className={activeTab === 'bug' ? 'active' : ''}
                onClick={() => setActiveTab('bug')}
              >
                Critical Issues
              </button>
            </div>
          </section>

          <div className="contracts-stats">
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'open').length}</span>
              <span className="stat-label">Open Contracts</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.assignee).length}</span>
              <span className="stat-label">Assigned</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.filter(c => c.status === 'closed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{contracts.reduce((sum, c) => sum + parseInt(c.reward.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}</span>
              <span className="stat-label">Total $BART Pool</span>
            </div>
          </div>

          {loading ? (
            <div className="contracts-loading">Loading development contracts...</div>
          ) : (
            <div className="contracts-grid">
              {filteredContracts.map(contract => (
                <div 
                  key={contract.id} 
                  className={`contract-card ${contract.status !== 'open' ? 'contract-unavailable' : ''}`}
                  onClick={() => contract.status === 'open' && setSelectedContract(contract)}
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
                    <strong>GitHub Issue:</strong> #{contract.githubNumber}
                  </div>
                  
                  <div className="contract-meta">
                    <span 
                      className="contract-priority"
                      style={{ background: getPriorityColor(contract.priority) }}
                    >
                      {contract.priority}
                    </span>
                    <span className="contract-reward">{contract.reward}</span>
                    <span className="contract-time">{contract.estimatedHours}</span>
                  </div>

                  <div className="contract-deadline">
                    {formatCreatedDate(contract.createdAt)}
                  </div>

                  {contract.assignee && (
                    <div className="contract-assignee">
                      <span>Assigned to: {contract.assignee.login}</span>
                      <a href={contract.url} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                      </a>
                    </div>
                  )}

                  {contract.status === 'open' && !contract.assignee && (
                    <button 
                      className="claim-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(contract.url, '_blank');
                      }}
                    >
                      Apply on GitHub
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Contract Detail Modal */}
          {selectedContract && (
            <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{selectedContract.title}</h2>
                  <button onClick={() => setSelectedContract(null)}>×</button>
                </div>
                
                <div className="modal-content">
                  <div className="modal-section">
                    <h4>Contract Description</h4>
                    <p>{selectedContract.description}</p>
                  </div>

                  <div className="modal-section">
                    <h4>GitHub Issue</h4>
                    <p>Issue #{selectedContract.githubNumber}</p>
                    <a href={selectedContract.url} target="_blank" rel="noopener noreferrer" className="github-link">
                      View full issue on GitHub →
                    </a>
                  </div>

                  <div className="modal-section">
                    <h4>Required Skills</h4>
                    <div className="skills-list">
                      {selectedContract.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
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
                    <h4>Acceptance Criteria</h4>
                    <ul>
                      {selectedContract.acceptanceCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-section">
                    <h4>Contract Terms</h4>
                    <div className="contract-terms">
                      <div><strong>Reward:</strong> {selectedContract.reward}</div>
                      <div><strong>Estimated Time:</strong> {selectedContract.estimatedHours}</div>
                      <div><strong>Priority Level:</strong> {selectedContract.priority}</div>
                      <div><strong>Category:</strong> {selectedContract.category}</div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button 
                      onClick={() => window.open(selectedContract.url, '_blank')}
                      className="modal-button primary"
                    >
                      Apply on GitHub ({selectedContract.reward})
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
          transition: margin-left 0.3s ease;
          overflow-y: auto;
        }

        /* Sidebar responsive states */
        .contracts-page.sidebar-expanded {
          margin-left: 260px;
        }
        
        .contracts-page.sidebar-collapsed {
          margin-left: 60px;
        }

        /* Mobile - no sidebar margin */
        @media (max-width: 768px) {
          .contracts-page {
            margin-left: 0 !important;
            padding-bottom: 160px; /* Account for mobile dock */
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

        .github-link {
          color: #8b5cf6;
          text-decoration: none;
          margin-top: 8px;
          display: inline-block;
        }

        .github-link:hover {
          text-decoration: underline;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .skill-tag {
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .contract-terms {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 16px;
        }

        .contract-terms div {
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
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