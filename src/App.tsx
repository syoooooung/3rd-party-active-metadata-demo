import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage'
import WorkflowUpload from './components/WorkflowUpload'
import RelationDiscoveryPage from './pages/RelationDiscoveryPage'

const navItems = [
  { path: '/', icon: '/icons/search.png', label: 'Search', active: true },
  { path: '/pipeline', icon: '/icons/pipeline.png', label: 'Pipeline' },
  { path: '/relation-discovery', icon: '🔗', label: 'Relation Discovery' }
]

const systemItems = [
  { icon: '/icons/analytics.png', label: 'Analytics' },
  { icon: '/icons/settings.png', label: 'Settings' }
]

function App() {
  const location = useLocation()

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-icon">A</div>
          <span className="logo-text">Active Metadata™</span>
        </div>

        {/* Project Info */}
        <div className="project-info">
          <div className="project-name">Metadata Graph</div>
          <div className="project-meta">3 modules active</div>
        </div>

        {/* Main Navigation */}
        <div className="nav-section">
          <div className="nav-section-label">MAIN FEATURES</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">
                {item.icon.startsWith('/icons/') ? (
                  <img src={item.icon} alt={item.label} style={{ width: '20px', height: '20px' }} />
                ) : (
                  item.icon
                )}
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* System Section */}
        <div className="nav-section">
          <div className="nav-section-label">SYSTEM</div>
          {systemItems.map((item, idx) => (
            <div key={idx} className="nav-item">
              <span className="nav-icon">
                {item.icon.startsWith('/icons/') ? (
                  <img src={item.icon} alt={item.label} style={{ width: '20px', height: '20px' }} />
                ) : (
                  item.icon
                )}
              </span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-spacer" />

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <div className="nav-item">
            <span className="nav-icon">🔔</span>
            <span className="nav-label">Notifications</span>
            <span className="notification-badge">3</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">💬</span>
            <span className="nav-label">Support</span>
          </div>
          <div className="user-profile">
            <div className="user-avatar">U</div>
            <div className="user-info">
              <div className="user-name">User Admin</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/pipeline" element={<WorkflowUpload />} />
          <Route path="/relation-discovery" element={<RelationDiscoveryPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
