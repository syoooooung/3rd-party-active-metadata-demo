import { useState } from 'react'
import OnboardingTour from '../components/OnboardingTour'
import type { TourStep } from '../components/OnboardingTour'
import { mockRelationDiscovery, mockRecommendedDocIds } from '../mockData'
import './RelationDiscoveryPage.css'

interface Candidate {
  doc_id: string
  score: number
  matched_keys: string[]
  matched_values: Record<string, any>
  breakdown?: {
    aligned_attribute: number
    typed_value_match: number
    graph_structure: number
    document_semantic: number
  }
}

interface SourceDocInfo {
  key_values: Record<string, string[]>
  important_keys: string[]
  important_values: Record<string, string[]>
}

interface DiscoveryResult {
  source_doc_id: string
  source_doc_info: SourceDocInfo
  candidates: Candidate[]
  search_strategy: string
  important_keys: string[]
}

const BASE_URL = import.meta.env.BASE_URL

const tourSteps: TourStep[] = [
  {
    element: '.discovery-panel h2',
    popover: {
      title: '🔗 관계 후보 발굴',
      description: '특정 문서와 연관될 수 있는 다른 문서들을 자동으로 찾아주는 기능입니다. AI가 문서의 속성을 분석하여 관계 가능성이 높은 문서들을 추천합니다.',
    }
  },
  {
    element: '.discovery-input-group label:first-child',
    popover: {
      title: '📝 Document ID 입력',
      description: '기준이 되는 문서 ID를 입력하세요. 예시: data_0001',
    }
  },
  {
    element: '.discovery-input-group label:nth-child(2)',
    popover: {
      title: '📊 Top K 설정',
      description: '발굴할 후보 문서의 최대 개수를 설정합니다 (1-50). 숫자가 클수록 더 많은 후보를 확인할 수 있습니다.',
    }
  },
  {
    element: '.discovery-button',
    popover: {
      title: '✨ 후보 발굴 버튼',
      description: '버튼을 클릭하거나 Enter 키를 눌러 관계 후보 발굴을 시작하세요.',
    }
  },
  {
    element: '.recommended-docs',
    popover: {
      title: '💡 추천 문서 ID',
      description: '예시로 사용할 수 있는 문서 ID 목록입니다. 클릭하면 자동으로 입력란에 채워집니다.',
    }
  },
  {
    element: '.discovery-sidebar',
    popover: {
      title: '📄 원본 문서 및 결과',
      description: '발굴 후, 원본 문서의 정보와 관계 가능성이 높은 후보 문서들이 이 영역에 표시됩니다. ★ 표시는 중요한 속성을 나타냅니다.',
    }
  }
]

export default function RelationDiscoveryPage() {
  const [sourceDocId, setSourceDocId] = useState('')
  const [topK, setTopK] = useState(10)
  const [result, setResult] = useState<DiscoveryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const handleDiscover = async () => {
    if (!sourceDocId) return

    setIsLoading(true)
    setResult(null)
    setSelectedCandidate(null)

    // Simulate API delay
    setTimeout(() => {
      setResult(mockRelationDiscovery as DiscoveryResult)
      setIsLoading(false)
    }, 1500)
  }

  const handleProposeRelation = async (targetDocId: string) => {
    alert(`관계 제안이 생성되었습니다!\nSource: ${sourceDocId}\nTarget: ${targetDocId}\nProposal ID: proposal_${Date.now()}`)
  }

  const handleRecommendedDocId = (docId: string) => {
    setSourceDocId(docId)
  }

  return (
    <div className="relation-discovery-page">
      <OnboardingTour
        steps={tourSteps}
        tourKey="relation-discovery-tour-completed"
        onComplete={() => {}}
      />
      <div className="discovery-layout">
        {/* 좌측 입력 패널 */}
        <div className="discovery-sidebar">
          <div className="discovery-panel">
            <h2>
              <img src={`${BASE_URL}icons/search.png`} alt="search" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
              관계 후보 발굴
            </h2>
            <div className="discovery-input-group">
              <label className="input-label">
                Document ID
                <input
                  type="text"
                  className="discovery-input"
                  placeholder="예: data_0001"
                  value={sourceDocId}
                  onChange={e => setSourceDocId(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleDiscover()}
                />
              </label>

              <label className="input-label">
                Top K 후보 수
                <input
                  type="number"
                  className="discovery-input-number"
                  value={topK}
                  onChange={e => setTopK(Number(e.target.value))}
                  min={1}
                  max={50}
                />
              </label>

              <button
                className="discovery-button"
                onClick={handleDiscover}
                disabled={!sourceDocId || isLoading}
              >
                {isLoading ? (
                  <>
                    <img src={`${BASE_URL}icons/refresh.png`} alt="loading" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                    발굴 중...
                  </>
                ) : (
                  '✨ 후보 발굴'
                )}
              </button>
            </div>

            <div className="recommended-docs">
              <h4>💡 추천 문서 ID</h4>
              <div className="doc-id-cards">
                {mockRecommendedDocIds.map((item, idx) => (
                  <button
                    key={idx}
                    className="doc-id-card"
                    onClick={() => handleRecommendedDocId(item.doc_id)}
                    title={item.relationChain}
                  >
                    <div className="doc-id-header">
                      <span className="doc-id-badge">{item.doc_id}</span>
                      <span className="doc-id-count">+{item.relatedDocs.length}</span>
                    </div>
                    <div className="doc-id-name">{item.name}</div>
                    <div className="doc-id-desc">{item.description}</div>
                    <div className="doc-id-chain">{item.relationChain}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 원본 문서 정보 */}
          {result && (
            <>
              {result.source_doc_info && (
                <div className="source-doc-panel">
                  <h3>📄 원본 문서</h3>
                  <div className="source-doc-id">{result.source_doc_id}</div>
                  <div className="source-doc-keys">
                    {Object.entries(result.source_doc_info.key_values || {}).map(([key, values], idx) => {
                      const isImportant = result.important_keys?.includes(key) || false
                      return (
                        <div key={idx} className={`source-kv-row ${isImportant ? 'important' : ''}`}>
                          <div className="source-key">
                            {isImportant && <span className="important-mark">★</span>}
                            {key}
                          </div>
                          <div className="source-value">
                            {Array.isArray(values) ? values.join(', ') : String(values)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {result.search_strategy && (
                <div className="strategy-panel">
                  <h3>📋 검색 전략</h3>
                  <p className="strategy-text">{result.search_strategy}</p>
                </div>
              )}

              {result.important_keys && result.important_keys.length > 0 && (
                <div className="keys-panel">
                  <h3>🔑 중요 키</h3>
                  <div className="keys-list">
                    {result.important_keys.map((key, idx) => (
                      <span key={idx} className="key-badge">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 우측 결과 영역 */}
        <div className="discovery-main">
          {!result ? (
            <div className="empty-state">
              <div className="empty-icon">
                <img src={`${BASE_URL}icons/analytics.png`} alt="analytics" style={{ width: '48px', height: '48px' }} />
              </div>
              <h3>관계 후보를 발굴하세요</h3>
              <p>Document ID를 입력하고 발굴 버튼을 클릭하세요</p>
            </div>
          ) : result.candidates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <img src={`${BASE_URL}icons/search.png`} alt="search" style={{ width: '48px', height: '48px' }} />
              </div>
              <h3>후보를 찾지 못했습니다</h3>
              <p>검색 조건을 변경해보세요</p>
            </div>
          ) : (
            <div className="candidates-container">
              <div className="candidates-header">
                <h2>관계 후보 목록</h2>
                <span className="candidates-count">{result.candidates.length}개 발견</span>
              </div>

              <div className="candidates-grid">
                {result.candidates.map((candidate, idx) => (
                  <div
                    key={idx}
                    className={`candidate-card ${selectedCandidate === candidate.doc_id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidate(candidate.doc_id)}
                  >
                    <div className="candidate-header">
                      <div className="candidate-title">
                        <span className="candidate-rank">#{idx + 1}</span>
                        <span className="candidate-doc-id">{candidate.doc_id}</span>
                      </div>
                      <div className="candidate-score-badge">
                        <span className="score-label">SCORE</span>
                        <span className="score-value">{(candidate.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="candidate-body">
                      {/* 매칭된 키 */}
                      <div className="candidate-section">
                        <h4>🔗 매칭된 키</h4>
                        <div className="common-keys">
                          {candidate.matched_keys.map((key, keyIdx) => (
                            <span key={keyIdx} className="common-key-badge">
                              {key}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 매칭된 값 */}
                      <div className="candidate-section">
                        <h4>📌 매칭된 값</h4>
                        <div className="common-values">
                          {Object.entries(candidate.matched_values).map(([key, value], valIdx) => (
                            <div key={valIdx} className="value-row">
                              <span className="value-key">{key}:</span>
                              <span className="value-value">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 선택 이유 요약 */}
                      <div className="candidate-reason">
                        <div className="reason-icon">💡</div>
                        <div className="reason-text">
                          <strong>{candidate.matched_keys.length}개의 키</strong>에서 매칭되었으며,
                          유사도 점수는 <strong>{(candidate.score * 100).toFixed(1)}%</strong>입니다.
                          {candidate.breakdown && (
                            <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.8 }}>
                              속성 정렬: {(candidate.breakdown.aligned_attribute * 100).toFixed(0)}% |
                              값 매칭: {(candidate.breakdown.typed_value_match * 100).toFixed(0)}% |
                              구조 유사도: {(candidate.breakdown.graph_structure * 100).toFixed(0)}% |
                              문서 의미: {(candidate.breakdown.document_semantic * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="candidate-footer">
                      <button
                        className="propose-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProposeRelation(candidate.doc_id)
                        }}
                      >
                        ➕ 관계 제안
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
