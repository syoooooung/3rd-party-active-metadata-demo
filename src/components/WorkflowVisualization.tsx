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

const WORKFLOW_STEPS = [
  { id: 1, name: 'Data Ingestion', description: '입력 데이터 수신' },
  { id: 2, name: 'Schema Analysis', description: '데이터 구조 분석' },
  { id: 3, name: 'Graph Construction', description: 'Key-Value 추출 및 그래프 생성' },
  { id: 4, name: 'Value Normalization', description: '데이터 정규화 및 통합' },
  { id: 5, name: 'Completion', description: '파이프라인 완료' },
]

export default function WorkflowVisualization({ events, isRunning }: Props) {
  const logsEndRef = useRef<HTMLDivElement>(null)

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

      <div className="workflow-steps">
        {WORKFLOW_STEPS.map((step, index) => {
          const status = getStepStatus(step.id)
          const data = getStepData(step.id)

          return (
            <div key={step.id} className="step-wrapper">
              <div className={`step-card step-${status}`}>
                <div className="step-number">{step.id}</div>
                <div className="step-content">
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
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className={`step-arrow ${status === 'completed' ? 'active' : ''}`}>
                  ↓
                </div>
              )}
            </div>
          )
        })}
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
