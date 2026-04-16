import { useState } from 'react'
import GraphViewer from '../components/GraphViewer'
import { mockSearchResult, mockRecommendedQueries } from '../mockData'
import './SearchPage.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(5)
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

  const handleRecommendedQuery = (recommendedQuery: string) => {
    setQuery(recommendedQuery)
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
          <h2>
            <img src="/icons/search.png" alt="search" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
            자연어 검색 (Semantic Search)
          </h2>
          <div className="search-input-group">
            <input
              type="text"
              className="search-input"
              placeholder="자연어로 검색하세요 (예: 대장암 임상시험과 관련된 병원 찾기)"
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

          <div className="recommended-queries">
            <h4>💡 추천 검색어</h4>
            <div className="query-chips">
              {mockRecommendedQueries.map((item, idx) => (
                <button
                  key={idx}
                  className="query-chip"
                  onClick={() => handleRecommendedQuery(item.query)}
                  title={`카테고리: ${item.category}`}
                >
                  <span className="chip-icon">{
                    item.category === '임상시험' ? '🧪' :
                    item.category === '의료기기' ? '⚕️' :
                    item.category === '질병-기기 연관' ? '🔗' :
                    item.category === '병원-기술' ? '🏥' :
                    '📋'
                  }</span>
                  <span className="chip-text">{item.query}</span>
                </button>
              ))}
            </div>
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
