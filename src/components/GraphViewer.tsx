import { useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import './GraphViewer.css'

interface GraphNode {
  id: string
  labels: string[]
  properties: Record<string, any>
}

interface GraphRelationship {
  start: string
  end: string
  type: string
}

interface GraphData {
  nodes: GraphNode[]
  relationships: GraphRelationship[]
}

interface Props {
  graph: GraphData | null
  onNodeClick?: (nodeId: string) => void
}

const COLOR_MAP: Record<string, { background: string; border: string }> = {
  Document: { background: '#dbeafe', border: '#2563eb' },
  Hospital: { background: '#dcfce7', border: '#16a34a' },
  ClinicalTrial: { background: '#fef3c7', border: '#f59e0b' },
  ResearchPaper: { background: '#e0e7ff', border: '#6366f1' },
  MedicalDevice: { background: '#fce7f3', border: '#ec4899' },
  Topic: { background: '#fed7aa', border: '#ea580c' },
  Tag: { background: '#f3e8ff', border: '#a855f7' },
  Key: { background: '#d1fae5', border: '#059669' },
  Value: { background: '#fef3c7', border: '#f59e0b' },
  NormalizedValue: { background: '#e9d5ff', border: '#9333ea' },
  Centrality: { background: '#fbcfe8', border: '#db2777' },
  Disease: { background: '#fee2e2', border: '#dc2626' },
  Technology: { background: '#ddd6fe', border: '#7c3aed' },
}

function formatTooltip(node: GraphNode): string {
  const label = node.labels[0] || 'Unknown'
  const props = node.properties

  // 임베딩 제외한 주요 속성만 추출
  const displayProps: Record<string, any> = {}
  for (const [key, value] of Object.entries(props)) {
    if (!key.includes('embedding') && value !== null && value !== undefined) {
      displayProps[key] = value
    }
  }

  // 툴팁 HTML 생성
  let tooltip = `<div style="font-family: monospace; font-size: 12px; max-width: 300px;">
    <div style="font-weight: bold; margin-bottom: 8px; color: #1a1d29;">
      ${label}
    </div>
    <div style="margin-bottom: 8px; color: #64748b;">
      ID: ${node.id}
    </div>`

  // 주요 속성 표시
  if (Object.keys(displayProps).length > 0) {
    tooltip += `<div style="margin-bottom: 8px; border-top: 1px solid #e1e7ef; padding-top: 8px;">`
    for (const [key, value] of Object.entries(displayProps)) {
      const displayValue = typeof value === 'string' && value.length > 50
        ? value.substring(0, 50) + '...'
        : String(value)
      tooltip += `<div style="margin: 4px 0; color: #475569;">
        <span style="color: #94a3b8;">${key}:</span> ${displayValue}
      </div>`
    }
    tooltip += `</div>`
  }

  tooltip += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e1e7ef; color: #3b82f6; font-size: 11px;">
    💡 클릭하면 1-hop 탐색
  </div></div>`

  return tooltip
}

export default function GraphViewer({ graph, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)

  useEffect(() => {
    if (!graph || !containerRef.current) return

    // 중복 노드 병합
    const nodeMap = new Map<string, GraphNode>()
    const idMapping = new Map<string, string>()

    graph.nodes.forEach(node => {
      const label = node.labels[0] || 'Unknown'
      let mergeKey: string

      if (label === 'Key' || label === 'Value') {
        mergeKey = `${label}:${node.properties.name}`
      } else {
        mergeKey = node.id
      }

      if (!nodeMap.has(mergeKey)) {
        nodeMap.set(mergeKey, node)
      }
      idMapping.set(node.id, mergeKey)
    })

    // 노드 변환
    const nodes = Array.from(nodeMap.values()).map(node => {
      const label = node.labels[0] || 'Unknown'
      const colors = COLOR_MAP[label] || { background: '#f1f5f9', border: '#94a3b8' }

      let displayLabel = ''
      if (label === 'Document' || label === 'Hospital' || label === 'ClinicalTrial' || label === 'ResearchPaper' || label === 'MedicalDevice') {
        displayLabel = node.properties.name || node.properties.doc_id?.substring(0, 12) || node.properties.id?.substring(0, 12) || 'Doc'
      } else {
        displayLabel = node.properties.name || node.id
      }

      // 길이에 따라 라벨 자르기
      if (displayLabel.length > 15) {
        displayLabel = displayLabel.substring(0, 15) + '...'
      }

      const mergeKey = (label === 'Key' || label === 'Value')
        ? `${label}:${node.properties.name}`
        : node.id

      return {
        id: mergeKey,
        label: displayLabel,
        title: formatTooltip(node),  // 툴팁 추가
        color: {
          background: colors.background,
          border: colors.border,
          highlight: {
            background: colors.background,
            border: colors.border
          },
          hover: {
            background: colors.background,
            border: colors.border
          }
        },
        shape: 'dot',  // 모든 노드를 원형으로
        size: 25,  // 노드 크기 증가
        font: {
          size: 14,
          color: '#1a1a1a',
          face: 'system-ui, -apple-system, sans-serif',
          bold: {
            color: '#1a1a1a'
          }
        },
        borderWidth: 3,
        borderWidthSelected: 4,
      }
    })

    // 엣지 변환 (중복 제거)
    const edgeSet = new Set<string>()
    const edges: any[] = []

    graph.relationships.forEach(rel => {
      const fromId = idMapping.get(rel.start) || rel.start
      const toId = idMapping.get(rel.end) || rel.end
      const edgeKey = `${fromId}-${toId}-${rel.type}`

      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey)
        edges.push({
          from: fromId,
          to: toId,
          label: rel.type,
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.8
            }
          },
          font: {
            size: 11,
            align: 'horizontal',
            color: '#64748b',
            strokeWidth: 0,
            face: 'system-ui, -apple-system, sans-serif'
          },
          color: {
            color: '#cbd5e1',
            highlight: '#3b82f6',
            hover: '#3b82f6'
          },
          width: 2.5,
          smooth: {
            enabled: true,
            type: 'curvedCW',
            roundness: 0.15
          }
        })
      }
    })

    const data = { nodes, edges }

    const options = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -12000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.5
        },
        stabilization: {
          iterations: 200,
          updateInterval: 25
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true,
      },
      layout: {
        improvedLayout: true,
        randomSeed: 42
      }
    }

    // 기존 네트워크 삭제
    if (networkRef.current) {
      networkRef.current.destroy()
    }

    // 새 네트워크 생성
    networkRef.current = new Network(containerRef.current, data, options)

    // 노드 클릭 이벤트 등록
    if (onNodeClick) {
      networkRef.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0]
          onNodeClick(nodeId)
        }
      })
    }

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [graph, onNodeClick])

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className="graph-viewer">
        <div className="graph-empty">
          <p>그래프 데이터가 없습니다</p>
          <p className="graph-hint">검색을 실행하면 관련 그래프가 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="graph-viewer">
      <div className="graph-header">
        <h3>Knowledge Graph</h3>
        <div className="graph-stats">
          {graph.nodes.length} nodes · {graph.relationships.length} relationships
        </div>
      </div>
      <div ref={containerRef} className="graph-canvas"></div>
    </div>
  )
}
