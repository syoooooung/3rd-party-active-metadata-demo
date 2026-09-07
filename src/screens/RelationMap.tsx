import { useMemo, useState } from 'react'
import type { ScreenProps } from '../App'
import {
  GRAPH_FILTERS,
  GRAPH_NODES,
  NODE_KINDS,
  RING_RADIUS,
  type GraphNode,
  type RelationGroup,
} from '../data'

type Placed = GraphNode & { x: number; y: number }

const NODE_MAP: Record<string, GraphNode> = Object.fromEntries(
  GRAPH_NODES.map((n) => [n.id, n]),
)

/** 각도와 고리 반지름으로 좌표를 정한다. 물리 시뮬레이션 없이 항상 같은 배치가 나온다. */
const PLACED: Placed[] = GRAPH_NODES.map((n) => {
  const rad = (n.angle * Math.PI) / 180
  const r = RING_RADIUS[n.ring]
  return { ...n, x: Math.cos(rad) * r, y: Math.sin(rad) * r }
})

const PLACED_MAP: Record<string, Placed> = Object.fromEntries(PLACED.map((n) => [n.id, n]))

/** 기준 노드에서 대상까지의 경유 순서 */
function pathTo(id: string): [string, string][] {
  const chain: [string, string][] = []
  let cur: GraphNode | undefined = NODE_MAP[id]
  while (cur && cur.via) {
    chain.unshift([cur.via, cur.id])
    cur = NODE_MAP[cur.via]
  }
  return chain
}

function shape(n: Placed) {
  const fill = NODE_KINDS[n.kind].color
  const s = n.ring === 0 ? 19 : 12
  if (n.kind === 2) {
    return (
      <rect className="sh" x={n.x - s} y={n.y - s} width={s * 2} height={s * 2} rx={4} fill={fill} />
    )
  }
  if (n.kind === 3) {
    const d = `M${n.x} ${n.y - s - 2}L${n.x + s + 2} ${n.y}L${n.x} ${n.y + s + 2}L${n.x - s - 2} ${n.y}z`
    return <path className="sh" d={d} fill={fill} />
  }
  return <circle className="sh" cx={n.x} cy={n.y} r={s} fill={fill} />
}

export default function RelationMap({ go }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | RelationGroup>('all')
  const [asTable, setAsTable] = useState(false)

  const onPath = useMemo(() => {
    const set = new Set<string>()
    if (selected) pathTo(selected).forEach(([a, b]) => set.add(`${a}>${b}`))
    return set
  }, [selected])

  const visible = (n: Placed) =>
    n.ring === 0 || filter === 'all' || (n.groups ?? []).includes(filter)

  const onChain = (id: string) =>
    selected != null &&
    pathTo(selected).some(([a, b]) => a === id || b === id)

  const sel = selected ? PLACED_MAP[selected] : null

  return (
    <main className="wrap viz">
      <p className="crumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('v2')
          }}
        >
          전국 어린이집 통합 현황
        </a>{' '}
        › 관계 지도
      </p>
      <h1 className="pg">관계 지도</h1>
      <p className="crumb mb18">
        이 데이터에서 시작해 어디까지 이어지는지 봅니다. <b className="ink2">바로 붙는 것</b>과{' '}
        <b className="ink2">한 단계 거쳐야 붙는 것</b>을 함께 보여줍니다. 목록에서는 두 번째가
        보이지 않습니다.
      </p>

      <div className="gwrap">
        <div className="gbox" data-tour>
          <div className="gbar">
            <div className="chips chips-inline">
              {GRAPH_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={filter === f.key ? 'on' : undefined}
                  onClick={() => {
                    setFilter(f.key)
                    setSelected(null)
                  }}
                >
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
                      <th>제공기관</th>
                      <th>성격</th>
                      <th>몇 단계</th>
                      <th>어떻게 이어지나</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRAPH_NODES.filter((n) => n.ring > 0).map((n) => (
                      <tr key={n.id}>
                        <td>{n.name}</td>
                        <td>{n.org}</td>
                        <td>{NODE_KINDS[n.kind].name}</td>
                        <td>{n.ring === 1 ? '바로' : '한 단계 거쳐'}</td>
                        <td style={{ whiteSpace: 'normal', maxWidth: 340 }}>{n.how}</td>
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
                viewBox="-326 -242 769 549"
                role="img"
                aria-label="전국 어린이집 통합 현황을 중심으로 이어지는 데이터 관계 지도"
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

                {PLACED.filter((n) => n.via).map((n) => {
                  const from = PLACED_MAP[n.via!]
                  const key = `${n.via}>${n.id}`
                  const hot = onPath.has(key)
                  const dim = !hot && (selected != null || !visible(n))
                  return (
                    <line
                      key={key}
                      className={`e${hot ? ' on' : dim ? ' off' : ''}`}
                      x1={from.x}
                      y1={from.y}
                      x2={n.x}
                      y2={n.y}
                    />
                  )
                })}

                {PLACED.filter((n) => n.via && onPath.has(`${n.via}>${n.id}`) && n.ring === 2).map(
                  (n) => {
                    const from = PLACED_MAP[n.via!]
                    return (
                      <text
                        key={`lab-${n.id}`}
                        className="elab"
                        x={(from.x + n.x) / 2}
                        y={(from.y + n.y) / 2 - 7}
                        textAnchor="middle"
                      >
                        {from.name.replace(/ .*$/, '')} 거쳐서
                      </text>
                    )
                  },
                )}

                {PLACED.map((n) => {
                  const dim =
                    !visible(n) ||
                    (selected != null && n.id !== selected && n.ring !== 0 && !onChain(n.id))
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
              개체 목록
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
            <span className="mut">
              가운데가 지금 보고 있는 데이터, 바깥으로 갈수록 한 단계씩 멉니다
            </span>
          </div>
        </div>

        <div className="card gpanel">
          {!sel ? (
            <>
              <h3>데이터 고르기</h3>
              <p className="hint">
                지도에서 아무 데이터나 누르면 어떻게 이어지는지 여기에 나옵니다.
              </p>
              <button className="btn p sm hintgo" onClick={() => setSelected('pop')}>
                주민등록인구로 해보기
              </button>
              <p className="hint">
                어린이집과 직접 붙지 않는 자료입니다. 무엇을 거쳐 붙는지 보여줍니다.
              </p>
            </>
          ) : (
            <>
              <h3>
                {sel.ring === 2
                  ? '한 단계 거쳐 붙습니다'
                  : sel.ring === 1
                    ? '바로 이어집니다'
                    : '지금 보는 데이터'}
              </h3>
              <div className="pb">
                <div className="nm">{sel.name}</div>
                <div className="og">
                  {sel.org} · {sel.rows}
                </div>
                <span
                  className="kind"
                  style={{
                    color: NODE_KINDS[sel.kind].color,
                    background: `color-mix(in srgb, ${NODE_KINDS[sel.kind].color} 14%, transparent)`,
                  }}
                >
                  {NODE_KINDS[sel.kind].name}
                </span>
                {sel.how && <div className="how">{sel.how}</div>}
                {sel.ring > 0 && (
                  <>
                    <div className="tinytag" style={{ letterSpacing: '.06em', marginBottom: 5 }}>
                      이어지는 순서
                    </div>
                    <ul className="path">
                      {[NODE_MAP[pathTo(sel.id)[0][0]].name, ...pathTo(sel.id).map(([, b]) => NODE_MAP[b].name)].map(
                        (name, i) => (
                          <li key={name}>
                            <em>{i + 1}</em>
                            <span>{name}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </>
                )}
                <div className="acts">
                  {sel.ring === 0 ? (
                    <button className="btn sm" onClick={() => go('v2')}>
                      데이터 보기
                    </button>
                  ) : (
                    <>
                      <button className="btn p sm" onClick={() => go('v3')}>
                        합쳐보기
                      </button>
                      <button className="btn sm" onClick={() => go('v2')}>
                        데이터 보기
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
