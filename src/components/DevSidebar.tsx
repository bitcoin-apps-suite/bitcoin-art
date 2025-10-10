'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft,
  ChevronRight,
  Monitor,
  FileCode,
  Users,
  FileText,
  Coins,
  Github,
  GitPullRequest,
  ExternalLink,
  BookOpen,
  History,
  CheckCircle,
  ListTodo,
  Briefcase,
  Terminal,
  Package,
  Download,
  Upload,
  Lock,
  Unlock,
  Activity,
  Clock,
  Palette
} from 'lucide-react';
import '../styles/DevSidebar.css';

export default function DevSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devSidebarCollapsed');
      // Default to collapsed (closed) for first-time visitors
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });
  const [issueCount, setIssueCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('devSidebarCollapsed', isCollapsed.toString());
    }
  }, [isCollapsed]);

  // Fetch GitHub issues count
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-art/issues?state=open');
        const data = await response.json();
        setIssueCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setIssueCount(0);
      }
    };
    fetchIssues();
  }, []);

  const menuItems: Array<{
    path?: string;
    icon?: any;
    label?: string;
    badge?: string;
    divider?: boolean;
    section?: string;
    external?: boolean;
  }> = [
    // Token & Core at top
    { path: '/token', icon: Coins, label: '$bArt Token', badge: 'NEW' },
    { path: '/exchange', icon: Download, label: 'Token Exchange' },
    
    // Art System
    { divider: true },
    { section: 'ART SYSTEM' },
    { path: '/artists', icon: Users, label: 'Artists', badge: '42' },
    { path: '/docs', icon: BookOpen, label: 'Documentation' },
    
    // Development
    { divider: true },
    { section: 'DEVELOPMENT' },
    { path: '/contracts', icon: FileCode, label: 'Dev Contracts' },
    { path: '/tasks', icon: Terminal, label: 'Find Work', badge: issueCount > 0 ? String(issueCount) : '0' },
    { path: '/api', icon: Package, label: 'API Reference' },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-art', icon: Github, label: 'GitHub Repository', external: true },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-art/issues', icon: FileCode, label: 'Issues', badge: issueCount > 0 ? String(issueCount) : '0', external: true },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-art/pulls', icon: GitPullRequest, label: 'Pull Requests', external: true },
    
    // System Status
    { divider: true },
    { path: '/changelog', icon: History, label: 'Changelog' },
    { path: '/status', icon: CheckCircle, label: 'System Status', badge: 'OK' }
  ];

  const stats = {
    totalSupply: '1,000,000,000',
    distributed: '245,678,901',
    artworks: '12,456',
    openTasks: issueCount || 0,
    networkNodes: '150+'
  };

  return (
    <div className={`dev-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="dev-sidebar-header">
        {!isCollapsed && (
          <div className="dev-sidebar-title">
            <Palette className="dev-sidebar-logo" />
            <span>Art Developer Hub</span>
          </div>
        )}
        <button 
          className="dev-sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="dev-sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="dev-sidebar-divider" />;
          }

          if (item.section) {
            return !isCollapsed ? (
              <div key={index} className="dev-sidebar-section">
                {item.section}
              </div>
            ) : null;
          }

          const Icon = item.icon;
          const isActive = pathname === item.path;

          if (item.external) {
            return (
              <a
                key={`${item.path}-${index}`}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <>
                    <span className="dev-sidebar-label">{item.label}</span>
                    {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                  </>
                )}
              </a>
            );
          }

          return (
            <a
              key={`${item.path}-${index}`}
              href={item.path || '/'}
              className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <>
                  <span className="dev-sidebar-label">{item.label}</span>
                  {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                </>
              )}
            </a>
          );
        })}
      </nav>

      {/* Stats section */}
      {!isCollapsed && (
        <div className="dev-sidebar-stats">
          <h4>bArt Stats</h4>
          <div className="dev-stat">
            <span className="dev-stat-label">Total Supply</span>
            <span className="dev-stat-value">{stats.totalSupply}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Distributed</span>
            <span className="dev-stat-value">{stats.distributed}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Artworks</span>
            <span className="dev-stat-value">{stats.artworks}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Open Tasks</span>
            <span className="dev-stat-value">{stats.openTasks}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Network Nodes</span>
            <span className="dev-stat-value">{stats.networkNodes}</span>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      {!isCollapsed && (
        <div className="dev-sidebar-footer">
          <div className="dev-sidebar-cta">
            <p>Join Art Development</p>
            <a 
              href="https://github.com/bitcoin-apps-suite/bitcoin-art" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-sidebar-cta-button"
            >
              Start Contributing
            </a>
          </div>
        </div>
      )}
    </div>
  );
}