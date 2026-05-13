import { useState, useRef } from 'react'
import WorkflowVisualization from './WorkflowVisualization'
import OnboardingTour, { type OnboardingTourRef } from './OnboardingTour'
import type { TourStep } from './OnboardingTour'
import { mockWorkflowEvents, mockDataSummary } from '../mockData'
import './WorkflowUpload.css'

interface WorkflowEvent {
  step: number
  status: 'processing' | 'completed' | 'error'
  message: string
  timestamp: number
  data?: Record<string, any>
}

const BASE_URL = import.meta.env.BASE_URL

const tourSteps: TourStep[] = [
  {
    element: '.upload-panel h2',
    popover: {
      title: '📊 데이터 업로드',
      description: '이기종 의료 데이터를 업로드하고 자동으로 처리하는 파이프라인입니다. JSON 파일을 선택하여 시작하세요.',
    }
  },
  {
    element: '.file-input-wrapper',
    popover: {
      title: '📁 파일 선택',
      description: 'JSON 형식의 이기종 의료 데이터 파일을 선택하세요. 파일이 선택되면 파일명이 표시됩니다.',
    }
  },
  {
    element: '.options h3',
    popover: {
      title: '⚙️ 파이프라인 설정',
      description: '데이터 처리 방식을 제어하는 다양한 옵션을 설정할 수 있습니다.',
    }
  },
  {
    element: '.checkbox-label',
    popover: {
      title: '🔍 Auto-detect Schema',
      description: '데이터 구조를 자동으로 감지합니다. 체크하면 스키마를 자동으로 분석하여 처리합니다.',
    }
  },
  {
    element: '.option-group:nth-of-type(1)',
    popover: {
      title: '📏 Sample Size',
      description: '스키마 탐지에 사용할 샘플 개수를 설정합니다 (1-20). 샘플이 많을수록 더 정확한 스키마를 탐지합니다.',
    }
  },
  {
    element: '.option-group:nth-of-type(2)',
    popover: {
      title: '🎯 Similarity Threshold',
      description: '유사도 임계값을 설정합니다 (0.0-1.0). 값이 높을수록 더 유사한 항목만 클러스터링됩니다.',
    }
  },
  {
    element: '.option-group:nth-of-type(3)',
    popover: {
      title: '📦 Min Cluster Size',
      description: '최소 클러스터 크기를 설정합니다 (1-10). 이 크기 이상의 클러스터만 생성됩니다.',
    }
  },
  {
    element: '.upload-panel button',
    popover: {
      title: '▶️ 파이프라인 실행',
      description: '버튼을 클릭하여 파이프라인을 실행하세요. 실행 과정을 실시간으로 확인할 수 있습니다.',
    }
  }
]

export default function WorkflowUpload() {
  const tourRef = useRef<OnboardingTourRef>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState<WorkflowEvent[]>([])
  const [autoDetectSchema, setAutoDetectSchema] = useState(true)
  const [sampleSize, setSampleSize] = useState(5)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.85)
  const [minClusterSize, setMinClusterSize] = useState(2)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    setEvents([])

    // Simulate workflow execution
    for (let i = 0; i < mockWorkflowEvents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setEvents(prev => [...prev, mockWorkflowEvents[i]])
    }

    setIsRunning(false)
  }

  return (
    <div className="workflow-container">
      <OnboardingTour
        ref={tourRef}
        steps={tourSteps}
        tourKey="pipeline-tour-completed"
        onComplete={() => {}}
      />
      <button
        className="help-tour-button"
        onClick={() => tourRef.current?.startTour()}
        title="도움말 투어 시작"
      >
        ?
      </button>
      <div className="upload-panel">
        <h2>Data Upload</h2>

        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            disabled={isRunning}
          />
          {file && <p className="file-name">{file.name}</p>}
        </div>

        <div className="options">
          <h3>Pipeline Configuration</h3>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoDetectSchema}
              onChange={e => setAutoDetectSchema(e.target.checked)}
              disabled={isRunning}
            />
            Auto-detect Schema
          </label>

          {autoDetectSchema && (
            <div className="option-group">
              <label>
                Sample Size
                <input
                  type="number"
                  value={sampleSize}
                  onChange={e => setSampleSize(Number(e.target.value))}
                  min={1}
                  max={20}
                  disabled={isRunning}
                />
              </label>
            </div>
          )}

          <div className="option-group">
            <label>
              Similarity Threshold
              <input
                type="number"
                value={similarityThreshold}
                onChange={e => setSimilarityThreshold(Number(e.target.value))}
                min={0}
                max={1}
                step={0.05}
                disabled={isRunning}
              />
            </label>
          </div>

          <div className="option-group">
            <label>
              Min Cluster Size
              <input
                type="number"
                value={minClusterSize}
                onChange={e => setMinClusterSize(Number(e.target.value))}
                min={1}
                max={10}
                disabled={isRunning}
              />
            </label>
          </div>
        </div>

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={isRunning}
        >
          {isRunning ? 'Running Pipeline...' : 'Execute Pipeline'}
        </button>

        {/* 데모 데이터 정보 */}
        <div className="demo-data-info">
          <h3>
            <img src={`${BASE_URL}icons/analytics.png`} alt="analytics" style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '6px' }} />
            데모 데이터 정보
          </h3>
          <div className="data-summary">
            <div className="summary-item">
              <span className="summary-label">총 파일 수</span>
              <span className="summary-value">{mockDataSummary.totalFiles}개</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">파일 형식</span>
              <span className="summary-value">CSV, JSON, JSONL, TXT</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">데이터 유형</span>
              <span className="summary-value">이기종 의료 데이터</span>
            </div>
          </div>

          <div className="file-types">
            <h4>파일 구성</h4>
            <div className="file-list">
              {Object.entries(mockDataSummary.fileTypes).map(([type, files]) => (
                <div key={type} className="file-type-group">
                  <div className="file-type-badge">{type}</div>
                  <div className="file-type-files">
                    {(files as string[]).map((file, idx) => (
                      <span key={idx} className="file-item">{file}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relation-clusters">
            <h4>관계 묶음 (Relation Clusters)</h4>
            {Object.entries(mockDataSummary.relationClusters).map(([key, cluster]) => (
              <div key={key} className="cluster-card">
                <div className="cluster-name">{cluster.name}</div>
                <div className="cluster-entities">
                  {cluster.core_entities.map((entity, idx) => (
                    <span key={idx} className="entity-tag">{entity}</span>
                  ))}
                </div>
                <div className="cluster-doc-count">{cluster.documents.length}개 문서</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="visualization-panel">
        <WorkflowVisualization events={events} isRunning={isRunning} />
      </div>
    </div>
  )
}
