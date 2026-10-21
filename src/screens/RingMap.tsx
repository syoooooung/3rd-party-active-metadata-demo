import { useMemo, useState } from 'react'
import {
  GRAPH_FILTERS,
  NODE_KINDS,
  REL_TYPES,
  RING_RADIUS,
  type GraphNode,
  type RelKey,
} from '../data'
import type { Go } from '../parts'

type Placed = GraphNode & { x: number; y: number }

type Props = { nodes: GraphNode[]; go: Go }

/** 고리형 관계 지도 — 바로 붙는 것(1단계)과 코드·기준표를 거쳐 붙는 것(2단계)을 거리로 보여준다.
 *  노드 위치는 각도와 고리 반지름으로 정해 물리 시뮬레이션 없이 항상 같은 배치가 나온다. */
export default function RingMap({ nodes, go }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | RelKey>('all')
  const [asTable, setAsTable] = useState(false)

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])
  const placed = useMemo<Placed[]>(
    () =>
      nodes.map((n) => {
        const rad = (n.angle * Math.PI) / 180
        const r = RING_RADIUS[n.ring]
        return { ...n, x: Math.cos(rad) * r, y: Math.sin(rad) * r }
      }),
    [nodes],
  )
  const placedMap = useMemo(() => Object.fromEntries(placed.map((n) => [n.id, n])), [placed])

  const bridgeUsers = useMemo(() => {
    const m: Record<string, string[]> = {}
    for (const n of nodes) if (n.via && nodeMap[n.via]?.bridge) (m[n.via] ??= []).push(n.id)
    return m
  }, [nodes, nodeMap])

  function pathTo(id: string): [string, string][] {
    const chain: [string, string][] = []
    let cur: GraphNode | undefined = nodeMap[id]
    while (cur && cur.via) {
      chain.unshift([cur.via, cur.id])
      cur = nodeMap[cur.via]
    }
    return chain
  }

  const onPath = useMemo(() => {
    const set = new Set<string>()
    if (selected) pathTo(selected).forEach(([a, b]) => set.add(`${a}>${b}`))
    return set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const visible = (n: Placed): boolean =>
    n.ring === 0 ||
    filter === 'all' ||
    n.rel === filter ||
    (!!n.bridge && (bridgeUsers[n.id] ?? []).some((id) => nodeMap[id].rel === filter))

  const onChain = (id: string) => selected != null && pathTo(selected).some(([a, b]) => a === id || b === id)

  const sel = selected ? placedMap[selected] : null

  const shape = (n: Placed) => {
    const fill = NODE_KINDS[n.kind].color
    const s = n.ring === 0 ? 19 : 12
    if (n.kind === 2) return <rect className="sh" x={n.x - s} y={n.y - s} width={s * 2} height={s * 2} rx={4} fill={fill} />
    if (n.kind === 3) {
      const d = `M${n.x} ${n.y - s - 2}L${n.x + s + 2} ${n.y}L${n.x} ${n.y + s + 2}L${n.x - s - 2} ${n.y}z`
      return <path className="sh" d={d} fill={fill} />
    }
    return <circle className="sh" cx={n.x} cy={n.y} r={s} fill={fill} />
  }

  return (
    <div className="viz">
      <div className="gwrap">
        <div className="gbox">
          <div className="gbar">
            <div className="chips chips-inline">
              {GRAPH_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={filter === f.key ? 'on' : undefined}
                  style={f.key !== 'all' ? ({ '--chip': REL_TYPES[f.key].color } as React.CSSProperties) : undefined}
                  onClick={() => {
                    setFilter(f.key)
                    setSelected(null)
                  }}
                >
                  {f.key !== 'all' && <i className="cdot" />}
                  {f.label}
                </button>
              ))}
            </div>
            <span className="sp2" />
            <button className="btn sm" onClick={() => setAsTable(!asTable)}>
              {asTable ? '지도로 보기' : '표로 보기'}
            </button>
          </div>

          {asTable ? (
            <div className="gstage">
              <div className="tblscroll">
                <table className="dt">
                  <thead>
                    <tr>
                      <th>데이터</th>
                      <th>관계 유형</th>
                      <th>몇 단계</th>
                      <th>결합 키</th>
                      <th className="n">신뢰도</th>
                      <th>어떻게 이어지나</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.filter((n) => n.ring > 0).map((n) => (
                      <tr key={n.id}>
                        <td>
                          {n.name}
                          <span className="tdorg">{n.org}</span>
                        </td>
                        <td>
                          {n.bridge ? (
                            '결합 다리'
                          ) : (
                            <span style={{ color: REL_TYPES[n.rel!].color, fontWeight: 700 }}>
                              {REL_TYPES[n.rel!].label}
                              {n.sub ? ` · ${n.sub}` : ''}
                            </span>
                          )}
                        </td>
                        <td>{n.ring === 1 ? '바로' : '한 단계 거쳐'}</td>
                        <td className="num">{n.joinKey ?? '—'}</td>
                        <td className="n num">{n.score?.toFixed(2) ?? '—'}</td>
                        <td style={{ whiteSpace: 'normal', minWidth: 230, maxWidth: 320 }}>{n.how}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="gstage">
              <svg
                className="graph"
                viewBox="-408 -242 851 549"
                role="img"
                aria-label={`${nodes[0]?.name ?? ''} 중심의 데이터 관계 지도`}
              >
                {[1, 2].map((i) => (
                  <circle key={i} className="ring" cx={0} cy={0} r={RING_RADIUS[i]} />
                ))}
                <text className="rlab" x={0} y={-RING_RADIUS[1] + 15} textAnchor="middle">
                  바로 붙음
                </text>
                <text className="rlab" x={0} y={-RING_RADIUS[2] + 15} textAnchor="middle">
                  한 단계 거쳐
                </text>

                {placed.filter((n) => n.via).map((n) => {
                  const from = placedMap[n.via!]
                  const key = `${n.via}>${n.id}`
                  const hot = onPath.has(key)
                  const dim = !hot && (selected != null || !visible(n))
                  return <line key={key} className={`e${hot ? ' on' : dim ? ' off' : ''}`} x1={from.x} y1={from.y} x2={n.x} y2={n.y} />
                })}

                {placed.filter((n) => n.via && onPath.has(`${n.via}>${n.id}`) && n.ring === 2).map((n) => {
                  const from = placedMap[n.via!]
                  return (
                    <text key={`lab-${n.id}`} className="elab" x={(from.x + n.x) / 2} y={(from.y + n.y) / 2 - 7} textAnchor="middle">
                      {from.name.replace(/ .*$/, '')} 거쳐서
                    </text>
                  )
                })}

                {placed.map((n) => {
                  const dim = !visible(n) || (selected != null && n.id !== selected && n.ring !== 0 && !onChain(n.id))
                  const mid = Math.abs(n.x) <= 4
                  const right = n.x > 4
                  const lx = mid ? n.x : right ? n.x + 20 : n.x - 20
                  const ly = mid ? n.y + (n.ring === 0 ? 38 : 30) : n.y - 2
                  const anchor = mid ? 'middle' : right ? 'start' : 'end'
                  return (
                    <g
                      key={n.id}
                      className={`nd${n.id === selected ? ' sel' : ''}${dim ? ' off' : ''}`}
                      tabIndex={0}
                      role="button"
                      aria-label={n.name}
                      onClick={() => setSelected(selected === n.id ? null : n.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelected(selected === n.id ? null : n.id)
                        }
                      }}
                    >
                      {shape(n)}
                      <text className="lb" x={lx} y={ly} textAnchor={anchor}>
                        {n.name}
                      </text>
                      <text className="sb" x={lx} y={ly + 14} textAnchor={anchor}>
                        {n.org} · {n.rows}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          )}

          <div className="glegend">
            <span>
              <svg width="15" height="15">
                <circle cx="7.5" cy="7.5" r="6" fill="var(--n1)" />
              </svg>
              개체·임상 데이터
            </span>
            <span>
              <svg width="15" height="15">
                <rect x="1.5" y="1.5" width="12" height="12" rx="3" fill="var(--n2)" />
              </svg>
              집계 통계
            </span>
            <span>
              <svg width="15" height="15">
                <path d="M7.5 1L14 7.5 7.5 14 1 7.5z" fill="var(--n3)" />
              </svg>
              코드·기준표
            </span>
            <span className="mut">가운데가 지금 보는 데이터, 바깥으로 갈수록 한 단계씩 멉니다</span>
          </div>
        </div>

        <div className="card gpanel">
          {!sel ? (
            <>
              <h3>데이터 고르기</h3>
              <p className="hint">지도에서 아무 데이터나 누르면 어떤 관계인지, 무엇으로 붙는지 여기에 나옵니다.</p>
              <button className="btn p sm hintgo" onClick={() => setSelected('prev24')}>
                암 유병률 통계로 해보기
              </button>
              <p className="hint">직접 붙지 않는 자료입니다. 무엇을 거쳐 붙는지 보여줍니다.</p>
            </>
          ) : (
            <>
              <h3>{sel.ring === 2 ? '한 단계 거쳐 붙습니다' : sel.ring === 1 ? '바로 이어집니다' : '지금 보는 데이터'}</h3>
              <div className="pb">
                <div className="nm">{sel.name}</div>
                <div className="og">
                  {sel.org} · {sel.rows}
                </div>
                {sel.bridge ? (
                  <span className="kind" style={{ color: 'var(--acc)', background: 'color-mix(in srgb, var(--acc) 14%, transparent)' }}>
                    결합 다리 · 기준표
                  </span>
                ) : sel.rel ? (
                  <span
                    className="kind"
                    style={{
                      color: REL_TYPES[sel.rel].color,
                      background: `color-mix(in srgb, ${REL_TYPES[sel.rel].color} 14%, transparent)`,
                    }}
                  >
                    {REL_TYPES[sel.rel].label}
                    {sel.sub ? ` · ${sel.sub}` : ''}
                  </span>
                ) : (
                  <span
                    className="kind"
                    style={{
                      color: NODE_KINDS[sel.kind].color,
                      background: `color-mix(in srgb, ${NODE_KINDS[sel.kind].color} 14%, transparent)`,
                    }}
                  >
                    {NODE_KINDS[sel.kind].name}
                  </span>
                )}
                {sel.how && <div className="how">{sel.how}</div>}
                {sel.ring > 0 && sel.joinKey && (
                  <div className="jrow">
                    결합 키 <code className="jk">{sel.joinKey}</code>
                    {sel.score != null && (
                      <>
                        {' '}
                        · 신뢰도 <span className="num">{sel.score.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                )}
                {sel.ring > 0 && (
                  <>
                    <div className="tinytag" style={{ letterSpacing: '.06em', marginBottom: 5 }}>
                      이어지는 순서
                    </div>
                    <ul className="path">
                      {[nodeMap[pathTo(sel.id)[0][0]].name, ...pathTo(sel.id).map(([, b]) => nodeMap[b].name)].map((name, i) => (
                        <li key={name}>
                          <em>{i + 1}</em>
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {sel.dataset && sel.ring > 0 && (
                  <div className="acts">
                    <button className="btn p sm" onClick={() => go('detail', sel.dataset!)}>
                      데이터 보기
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
