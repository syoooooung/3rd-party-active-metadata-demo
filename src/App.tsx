import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage'
import WorkflowUpload from './components/WorkflowUpload'
import RelationDiscoveryPage from './pages/RelationDiscoveryPage'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Active Metadata Graph</div>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Search
          </Link>
          <Link to="/pipeline" className={location.pathname === '/pipeline' ? 'active' : ''}>
            Pipeline
          </Link>
          <Link to="/relation-discovery" className={location.pathname === '/relation-discovery' ? 'active' : ''}>
            Relation Discovery
          </Link>
        </nav>
      </header>
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
