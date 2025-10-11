'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProofOfConceptBar from '@/components/ProofOfConceptBar';
import TopMenuBar from '@/components/TopMenuBar';
import DevSidebar from '@/components/DevSidebar';
import AppHeader from '@/components/AppHeader';
import { BitcoinDock } from '@bitcoin-os/dock';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: 'open' | 'closed';
  labels: Array<{ name: string; color: string }>;
  assignee?: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  milestone?: { title: string };
}

interface ParsedTask {
  id: number;
  githubNumber: number;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  estimatedHours: string;
  reward: string;
  category: 'Developer' | 'Designer' | 'Artist' | 'Developer/Designer' | 'Developer/Artist';
  status: 'open' | 'closed';
  assignee?: { login: string; avatar_url: string };
  url: string;
  skills: string[];
  deliverables: string[];
  acceptanceCriteria: string[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<ParsedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<ParsedTask | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    
    checkMobile();
    fetchGitHubIssues();
    
    const handleResize = () => checkMobile();
    window.addEventListener('resize', handleResize);
    
    // Set loaded after a brief delay to prevent FOUC
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const fetchGitHubIssues = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-art/issues?state=all&per_page=100');
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const issues: GitHubIssue[] = await response.json();
      
      // Parse issues into task format
      const parsedTasks: ParsedTask[] = issues.map(issue => {
        const body = issue.body || '';
        
        // Extract metadata from issue body
        const priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i);
        const hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*([\d-]+)/i);
        const rewardMatch = body.match(/\*\*Reward:\*\*\s*([\d,]+\s*\$BART)/i);
        const categoryMatch = body.match(/\*\*Category:\*\*\s*([^\\n]+)/i);
        
        // Extract skills, deliverables, and acceptance criteria
        const skillsSection = body.match(/## Skills Required([\\s\\S]*?)(?=##|$)/i);
        const deliverablesSection = body.match(/## Deliverables([\\s\\S]*?)(?=##|$)/i);
        const acceptanceSection = body.match(/## Acceptance Criteria([\\s\\S]*?)(?=##|$)/i);
        
        const extractListItems = (section: string | undefined) => {
          if (!section) return [];
          return section.match(/- \[[ x]\] (.+)|^\s*- (.+)/gm)?.map(item => 
            item.replace(/- \[[ x]\] /, '').replace(/^\s*- /, '').trim()
          ) || [];
        };

        // Calculate appropriate reward based on priority (0.005% - 0.1% of 1B tokens)
        const priority = (priorityMatch?.[1] as any) || 'Medium';
        const category = (categoryMatch?.[1]?.trim() as any) || 'Developer';
        let calculatedReward = '100,000 $BART'; // 0.01% - base rate for medium priority

        switch (priority.toLowerCase()) {
          case 'critical':
            calculatedReward = '1,000,000 $BART'; // 0.1% - maximum for critical
            break;
          case 'high':
            calculatedReward = '500,000 $BART'; // 0.05% - high priority
            break;
          case 'low':
            calculatedReward = '50,000 $BART'; // 0.005% - simple tasks
            break;
          default: // medium
            calculatedReward = '100,000 $BART'; // 0.01% - standard rate
        }

        // Adjust for design/artist work (20% bonus)
        if (category.includes('Designer') || category.includes('Artist')) {
          const amount = parseInt(calculatedReward.replace(/[^0-9]/g, ''));
          calculatedReward = `${Math.floor(amount * 1.2).toLocaleString()} $BART`;
        }

        return {
          id: issue.id,
          githubNumber: issue.number,
          title: issue.title,
          description: body.split('## Requirements')[0].replace(/\*\*[^*]+\*\*[^\\n]*\\n/g, '').trim(),
          priority: priority,
          estimatedHours: hoursMatch?.[1] || '20-40',
          reward: rewardMatch?.[1] || calculatedReward,
          category: category,
          status: issue.state,
          assignee: issue.assignee,
          url: issue.html_url,
          skills: extractListItems(skillsSection?.[1]),
          deliverables: extractListItems(deliverablesSection?.[1]),
          acceptanceCriteria: extractListItems(acceptanceSection?.[1])
        };
      });
      
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'developer': return '#3b82f6';
      case 'designer': return '#8b5cf6';
      case 'artist': return '#ec4899';
      default: return '#6b7280';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const categoryMatch = filterCategory === 'all' || task.category.toLowerCase().includes(filterCategory.toLowerCase());
    const priorityMatch = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority.toLowerCase();
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="App">
      <ProofOfConceptBar />
      <TopMenuBar />
      <AppHeader />
      
      {/* Developer Sidebar - only on desktop */}
      {!isMobile && <DevSidebar />}
      
      <div className={`tasks-page ${isLoaded ? 'loaded' : 'loading'}`}>
        <div className="tasks-container">
          {/* Hero Section */}
          <section className="tasks-hero">
            <h1><span style={{color: '#ffffff'}}>Development</span> <span style={{color: '#8b5cf6'}}>Tasks</span></h1>
            <p className="tasks-tagline">
              Platform development tasks and GitHub issues for building Bitcoin Art
            </p>
            <div className="tasks-badge">GITHUB ISSUES</div>
          </section>

          {/* Filters */}
          <section className="tasks-filters">
            <div className="filter-group">
              <label>Category:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="artist">Artist</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Priority:</label>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </section>

          {/* Stats */}
          <div className="tasks-stats">
            <div className="stat-card">
              <span className="stat-value">{tasks.filter(t => t.status === 'open').length}</span>
              <span className="stat-label">Open Tasks</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{tasks.filter(t => t.assignee).length}</span>
              <span className="stat-label">Assigned</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{tasks.filter(t => t.status === 'closed').length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          {loading ? (
            <div className="tasks-loading">Loading development tasks...</div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-card ${task.status === 'closed' ? 'task-completed' : ''}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className="task-number">#{task.githubNumber}</span>
                  </div>
                  
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <span 
                      className="task-priority"
                      style={{ background: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span 
                      className="task-category"
                      style={{ background: getCategoryColor(task.category) }}
                    >
                      {task.category}
                    </span>
                    <span className="task-reward">{task.reward}</span>
                  </div>

                  <div className="task-details">
                    <span className="task-hours">{task.estimatedHours}h</span>
                    {task.assignee && (
                      <div className="task-assignee">
                        <img src={task.assignee.avatar_url} alt={task.assignee.login} />
                        <span>{task.assignee.login}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Task Detail Modal */}
          {selectedTask && (
            <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
              <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                <div className="task-modal-header">
                  <h2>{selectedTask.title}</h2>
                  <button onClick={() => setSelectedTask(null)}>×</button>
                </div>
                
                <div className="task-modal-content">
                  <div className="task-modal-meta">
                    <span className="task-modal-number">GitHub Issue #{selectedTask.githubNumber}</span>
                    <span 
                      className="task-modal-priority"
                      style={{ background: getPriorityColor(selectedTask.priority) }}
                    >
                      {selectedTask.priority} Priority
                    </span>
                    <span 
                      className="task-modal-category"
                      style={{ background: getCategoryColor(selectedTask.category) }}
                    >
                      {selectedTask.category}
                    </span>
                  </div>

                  <div className="task-modal-reward">
                    <strong>Reward: {selectedTask.reward}</strong>
                  </div>

                  <div className="task-modal-section">
                    <h4>Description</h4>
                    <p>{selectedTask.description}</p>
                  </div>

                  {selectedTask.skills.length > 0 && (
                    <div className="task-modal-section">
                      <h4>Required Skills</h4>
                      <ul>
                        {selectedTask.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTask.deliverables.length > 0 && (
                    <div className="task-modal-section">
                      <h4>Deliverables</h4>
                      <ul>
                        {selectedTask.deliverables.map((deliverable, index) => (
                          <li key={index}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTask.acceptanceCriteria.length > 0 && (
                    <div className="task-modal-section">
                      <h4>Acceptance Criteria</h4>
                      <ul>
                        {selectedTask.acceptanceCriteria.map((criteria, index) => (
                          <li key={index}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="task-modal-actions">
                    <a 
                      href={selectedTask.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="task-modal-button primary"
                    >
                      View on GitHub
                    </a>
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="task-modal-button secondary"
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
      
      {/* Bitcoin Dock at the bottom */}
      <BitcoinDock />
      
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

        /* Tasks Page - Bitcoin Art Purple Theme */
        .tasks-page {
          background: transparent;
          color: #ffffff;
          min-height: calc(100vh - 128px);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding-top: 128px;
          padding-bottom: 120px;
          font-weight: 300;
          transition: margin-left 0.3s ease, opacity 0.3s ease;
          margin-left: 260px;
          overflow-y: auto;
        }

        /* Prevent FOUC */
        .tasks-page.loading {
          opacity: 0;
          visibility: hidden;
        }

        .tasks-page.loaded {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .tasks-page {
            margin-left: 0;
            padding-bottom: 100px;
          }
        }

        .tasks-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Hero Section */
        .tasks-hero {
          min-height: 30vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px 40px;
          position: relative;
        }

        .tasks-hero h1 {
          font-size: 42px;
          font-weight: 200;
          margin: 0 0 16px 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .tasks-tagline {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto 30px;
          line-height: 1.4;
          font-weight: 300;
        }

        .tasks-badge {
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

        /* Filters */
        .tasks-filters {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .filter-group select {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #ffffff;
          font-size: 14px;
        }

        /* Stats */
        .tasks-stats {
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

        /* Tasks Grid */
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .task-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .task-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.1);
        }

        .task-completed {
          opacity: 0.6;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .task-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
          flex: 1;
        }

        .task-number {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .task-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .task-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .task-priority, .task-category {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        .task-reward {
          font-size: 12px;
          color: #22c55e;
          font-weight: 600;
          background: rgba(34, 197, 94, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .task-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-hours {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .task-assignee img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .task-assignee span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Task Modal */
        .task-modal-overlay {
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

        .task-modal {
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .task-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
        }

        .task-modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 24px 0;
          line-height: 1.3;
        }

        .task-modal-header button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .task-modal-content {
          padding: 0 24px 24px;
        }

        .task-modal-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .task-modal-number {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .task-modal-priority, .task-modal-category {
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .task-modal-reward {
          font-size: 16px;
          color: #22c55e;
          margin-bottom: 24px;
          padding: 12px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .task-modal-section {
          margin-bottom: 24px;
        }

        .task-modal-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #8b5cf6;
        }

        .task-modal-section p {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .task-modal-section ul {
          margin: 0;
          padding-left: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .task-modal-section li {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .task-modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .task-modal-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .task-modal-button.primary {
          background: #8b5cf6;
          color: white;
        }

        .task-modal-button.primary:hover {
          background: #7c3aed;
        }

        .task-modal-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .task-modal-button.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .tasks-loading {
          text-align: center;
          padding: 60px 20px;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .tasks-hero h1 {
            font-size: 32px;
          }
          
          .tasks-filters {
            flex-direction: column;
          }
          
          .tasks-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .tasks-grid {
            grid-template-columns: 1fr;
          }
          
          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}