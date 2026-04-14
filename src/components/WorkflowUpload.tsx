import { useState } from 'react'
import WorkflowVisualization from './WorkflowVisualization'
import { mockWorkflowEvents } from '../mockData'
import './WorkflowUpload.css'

interface WorkflowEvent {
  step: number
  status: 'processing' | 'completed' | 'error'
  message: string
  timestamp: number
  data?: Record<string, any>
}

export default function WorkflowUpload() {
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
    if (!file) return

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
          disabled={!file || isRunning}
        >
          {isRunning ? 'Running Pipeline...' : 'Execute Pipeline'}
        </button>
      </div>

      <div className="visualization-panel">
        <WorkflowVisualization events={events} isRunning={isRunning} />
      </div>
    </div>
  )
}
