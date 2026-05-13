import { useState, useRef } from 'react'
import GraphViewer from '../components/GraphViewer'
import OnboardingTour, { type OnboardingTourRef } from '../components/OnboardingTour'
import type { TourStep } from '../components/OnboardingTour'
import { mockSearchResult, mockRecommendedQueries } from '../mockData'
import './SearchPage.css'

const BASE_URL = import.meta.env.BASE_URL

const tourSteps: TourStep[] = [
  {
    element: '.search-panel h2',
    popover: {
      title: '🔍 자연어 검색 (Semantic Search)',
      description: '이 기능은 자연어로 의료 데이터를 검색할 수 있게 해줍니다. 일반적인 검색어가 아닌, 문장으로 질문하듯이 검색할 수 있습니다.',
    }
  },
  {
    element: '.search-input',
    popover: {
      title: '📝 검색 입력란',
      description: '자연어로 검색 쿼리를 입력하세요. 예시: "대장암 임상시험과 관련된 병원 찾기"',
    }
  },
  {
    element: '.search-option',
    popover: {
      title: '⚙️ Top K 설정',
      description: '검색 결과로 반환할 최대 문서 수를 설정합니다. 숫자가 클수록 더 많은 결과를 볼 수 있습니다.',
    }
  },
  {
    element: '.search-button',
    popover: {
      title: '🔎 검색 실행',
      description: '검색 버튼을 클릭하거나 Enter 키를 눌러 검색을 실행하세요.',
    }
  },
  {
    element: '.recommended-queries',
    popover: {
      title: '💡 추천 검색어',
      description: '다양한 카테고리의 예시 검색어를 제공합니다. 클릭하면 검색어가 자동으로 입력됩니다.',
    }
  },
  {
    element: '.results-panel',
    popover: {
      title: '📋 검색 결과',
      description: '검색 결과가 관련도 점수와 함께 표시됩니다. 점수가 높을수록 검색어와 더 관련이 높습니다.',
    }
  },
  {
    element: '.graph-section',
    popover: {
      title: '🕸️ 관계 그래프',
      description: '검색된 문서들 간의 관계를 시각적으로 표현합니다. 노드를 클릭하면 해당 문서로 이동할 수 있습니다.',
    }
  }
]

export default function SearchPage() {
  const tourRef = useRef<OnboardingTourRef>(null)
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
      <OnboardingTour
        ref={tourRef}
        steps={tourSteps}
        tourKey="search-tour-completed"
        onComplete={() => {}}
      />
      <button
        className="help-tour-button"
        onClick={() => tourRef.current?.startTour()}
        title="도움말 투어 시작"
      >
        ?
      </button>
      <div className="search-layout">
        <div className="search-sidebar">
          <div className="search-panel">
          <h2>
            <img src={`${BASE_URL}icons/search.png`} alt="search" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
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
