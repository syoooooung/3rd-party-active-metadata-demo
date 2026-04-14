import { useState } from 'react'
import GraphViewer from '../components/GraphViewer'
import { mockSearchResult } from '../mockData'
import './SearchPage.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(3)
  const [results, setResults] = useState<any[]>([])
  const [graph, setGraph] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return

    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setResults(mockSearchResult.documents)
      setGraph(mockSearchResult.graph)
      setIsLoading(false)
    }, 1000)
  }

  const handleNodeClick = async (nodeId: string) => {
    console.log('Node clicked:', nodeId)
    // In demo mode, just show current graph
  }

  return (
    <div className="search-page">
      <div className="search-layout">
        <div className="search-sidebar">
          <div className="search-panel">
          <h2>Graph Search</h2>
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="검색어를 입력하세요 (예: 병상수가 100개 이상인 병원)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <div className="search-option">
              <label>
                Top K Results
                <input
                  type="number"
                  value={topK}
                  onChange={e => setTopK(Number(e.target.value))}
                  min={1}
                  max={20}
                />
              </label>
            </div>
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={!query || isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          </div>

          <div className="results-panel">
            <h3>Search Results</h3>
            {results.length === 0 ? (
              <div className="empty-state">
                {isLoading ? 'Searching...' : 'Enter a query and click Search'}
              </div>
            ) : (
              <div className="results-list">
                {results.map((doc, idx) => (
                  <div key={idx} className="result-card">
                    <div className="result-header">
                      <span className="result-title">{doc.doc_id}</span>
                      <span className="result-score">{(doc.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="result-content">
                      {doc.description || doc.text?.substring(0, 200) || 'No description'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="graph-section">
          <GraphViewer graph={graph} onNodeClick={handleNodeClick} />
        </div>
      </div>
    </div>
  )
}
