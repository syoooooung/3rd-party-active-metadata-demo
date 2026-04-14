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
  Document: { background: '#eff6ff', border: '#3b82f6' },
  Key: { background: '#f0fdf4', border: '#22c55e' },
  Value: { background: '#fef9c3', border: '#eab308' },
  NormalizedValue: { background: '#f3e8ff', border: '#a855f7' },
  Centrality: { background: '#fce7f3', border: '#ec4899' },
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
      const colors = COLOR_MAP[label] || { background: '#f8fafc', border: '#cbd5e1' }

      let displayLabel = ''
      if (label === 'Document') {
        displayLabel = node.properties.id?.substring(0, 10) || 'Doc'
      } else {
        displayLabel = node.properties.name || node.id
      }

      const mergeKey = (label === 'Key' || label === 'Value')
        ? `${label}:${node.properties.name}`
        : node.id

      return {
        id: mergeKey,
        label: displayLabel,
        title: formatTooltip(node),  // 툴팁 추가
        color: colors,
        shape: label === 'Document' ? 'box' : 'ellipse',
        font: { size: 12, color: '#1a1d29' },
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
          arrows: { to: { enabled: true } },
          font: { size: 10, align: 'top', color: '#64748b' },
          color: { color: '#cbd5e1', highlight: '#3b82f6' },
          width: 2,
        })
      }
    })

    const data = { nodes, edges }

    const options = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 150,
        },
        stabilization: { iterations: 150 },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
      },
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
