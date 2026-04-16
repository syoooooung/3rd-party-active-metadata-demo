import { useEffect, useRef } from 'react'
import './WorkflowVisualization.css'

interface WorkflowEvent {
  step: number
  status: 'processing' | 'completed' | 'error'
  message: string
  timestamp: number
  data?: Record<string, any>
}

interface Props {
  events: WorkflowEvent[]
  isRunning: boolean
}

const BASE_URL = import.meta.env.BASE_URL

const WORKFLOW_STEPS = [
  { id: 1, name: 'Data Ingestion', icon: '📥', description: '입력 데이터 수신', color: '#6366f1' },
  { id: 2, name: 'Schema Analysis', icon: `${BASE_URL}icons/search.png`, description: '데이터 구조 분석', color: '#8b5cf6' },
  { id: 3, name: 'Graph Construction', icon: '🕸️', description: 'Key-Value 추출 및 그래프 생성', color: '#ec4899' },
  { id: 4, name: 'Value Normalization', icon: `${BASE_URL}icons/settings.png`, description: '데이터 정규화 및 통합', color: '#f59e0b' },
  { id: 5, name: 'Completion', icon: '✅', description: '파이프라인 완료', color: '#10b981' },
]

const CARD_WIDTH = 200
const CARD_HEIGHT = 180
const CARD_GAP = 120

export default function WorkflowVisualization({ events, isRunning }: Props) {
  const logsEndRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const getStepStatus = (stepId: number): 'idle' | 'processing' | 'completed' | 'error' => {
    const stepEvents = events.filter(e => e.step === stepId)
    if (stepEvents.length === 0) return 'idle'

    const lastEvent = stepEvents[stepEvents.length - 1]
    return lastEvent.status
  }

  const getStepData = (stepId: number) => {
    const stepEvents = events.filter(e => e.step === stepId)
    if (stepEvents.length === 0) return null

    const completedEvent = stepEvents.find(e => e.status === 'completed')
    return completedEvent?.data || null
  }

  const getStepPosition = (index: number) => {
    return {
      x: 40 + index * (CARD_WIDTH + CARD_GAP),
      y: 60
    }
  }

  const renderConnections = () => {
    const paths = []

    for (let i = 0; i < WORKFLOW_STEPS.length - 1; i++) {
      const fromPos = getStepPosition(i)
      const toPos = getStepPosition(i + 1)
      const status = getStepStatus(WORKFLOW_STEPS[i].id)

      const fromX = fromPos.x + CARD_WIDTH
      const fromY = fromPos.y + CARD_HEIGHT / 2
      const toX = toPos.x
      const toY = toPos.y + CARD_HEIGHT / 2

      const dx = toX - fromX
      const cp1x = fromX + dx * 0.5
      const cp2x = toX - dx * 0.5

      const d = `M ${fromX} ${fromY} C ${cp1x} ${fromY}, ${cp2x} ${toY}, ${toX} ${toY}`

      const isActive = status === 'completed'

      paths.push(
        <path
          key={i}
          d={d}
          fill="none"
          stroke={isActive ? '#4CAF50' : '#cbd5e1'}
          strokeWidth="2"
          markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
          markerStart={isActive ? 'url(#dot-active)' : 'url(#dot)'}
          className="connection-path"
          style={{
            transition: 'stroke 0.3s ease'
          }}
        />
      )
    }

    return paths
  }

  return (
    <div className="workflow-visualization">
      <div className="workflow-header">
        <h2>Data Lineage Pipeline</h2>
        {isRunning && (
          <div className="running-indicator">
            <span className="pulse-dot"></span>
            Running
          </div>
        )}
      </div>

      <div className="lineage-container">
        {/* Grid background */}
        <svg className="lineage-bg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection lines */}
        <svg ref={svgRef} className="lineage-connections">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="#cbd5e1" />
            </marker>
            <marker id="dot" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill="#cbd5e1" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 z" fill="#4CAF50" />
            </marker>
            <marker id="dot-active" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill="#4CAF50" />
            </marker>
          </defs>
          {renderConnections()}
        </svg>

        {/* Step cards */}
        <div className="lineage-steps">
          {WORKFLOW_STEPS.map((step, index) => {
            const status = getStepStatus(step.id)
            const data = getStepData(step.id)
            const pos = getStepPosition(index)

            return (
              <div
                key={step.id}
                className={`lineage-step-card step-${status}`}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: CARD_WIDTH
                }}
              >
                {/* Top accent bar */}
                <div className="step-accent" style={{ background: step.color }} />

                {/* Header */}
                <div className="step-header">
                  <div className="step-icon-wrapper">
                    <span className="step-icon" style={{ fontSize: 20 }}>
                      {step.icon.includes('/icons/') ? (
                        <img src={step.icon} alt={step.name} style={{ width: '20px', height: '20px' }} />
                      ) : (
                        step.icon
                      )}
                    </span>
                  </div>
                  <div className="step-number-badge">{step.id}</div>
                </div>

                {/* Content */}
                <div className="step-body">
                  <div className="step-title">{step.name}</div>
                  <div className="step-description">{step.description}</div>

                  <div className="step-status-badge">
                    {status === 'idle' && <span className="status-idle">● Pending</span>}
                    {status === 'processing' && (
                      <span className="status-processing">▶ Processing...</span>
                    )}
                    {status === 'completed' && <span className="status-completed">✓ Completed</span>}
                    {status === 'error' && <span className="status-error">✗ Error</span>}
                  </div>

                  {data && (
                    <div className="step-data">
                      {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-key">{key}:</span>
                          <span className="data-value">
                            {typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="logs-panel">
        <h3>Execution Logs</h3>
        <div className="logs">
          {events.length === 0 ? (
            <div className="empty-logs">
              Logs will appear here when the workflow runs
            </div>
          ) : (
            <>
              {events.map((event, index) => (
                <div key={index} className={`log-entry log-${event.status}`}>
                  <span className="log-time">
                    {new Date(event.timestamp * 1000).toLocaleTimeString()}
                  </span>
                  <span className="log-message">{event.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
