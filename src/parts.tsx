// 실제 포털(workflow-ui) parts.tsx의 화면 구성요소를 목 데이터용으로 이식.
// 라우터 대신 go 콜백으로 화면을 전환한다.
import { useState } from 'react'
import {
  byId,
  LINKABLE,
  linkCount,
  majorOf,
  MAJOR_COLOR,
  minorOf,
  REL_ORDER,
  REL_TYPES,
  ICU_BIO_BEFORE,
  type Dataset,
  type LinkItem,
  type Linkable,
} from './data'

export type Go = (screen: string, dataset?: string) => void

export const pct = (score: number) => `${Math.round(score * 100)}%`

export const linkableOf = (id: string): Linkable =>
  id === 'icu-bio' ? ICU_BIO_BEFORE : (LINKABLE[id] ?? { groups: {}, candidates: [] })

/** 검색어 강조 */
export function Highlight({ text, q }: { text: string; q?: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/** 출처 배지 — 기관 보유(1st)는 어두운 색 */
export function SourceBadge({ d }: { d: Pick<Dataset, 'source' | 'party'> }) {
  return <span className={`p-badge ${d.party === '1st' ? 'first' : ''}`}>{d.source}</span>
}

/** '대분류 > 중분류' 경로들 */
export function CategoryPath({ categories }: { categories: string[] }) {
  if (!categories.length) return <span className="p-path muted">미분류</span>
  return (
    <span className="p-path">
      {categories.map((c) => (
        <span key={c}>
          <b style={{ color: MAJOR_COLOR[majorOf(c)] }}>{majorOf(c)}</b> &gt; {minorOf(c)}
        </span>
      ))}
    </span>
  )
}

function Chevron() {
  return (
    <svg className="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Panel = '' | 'about' | 'links'

/** 검색 결과 카드 — 설명·연계 데이터를 그 자리에서 펼친다 */
export function DatasetResultCard({
  d,
  q,
  go,
  openLinks = false,
  tourTarget = false,
}: {
  d: Dataset
  q?: string
  go: Go
  /** 둘러보기에서 연계 데이터 패널을 미리 펼친다 */
  openLinks?: boolean
  tourTarget?: boolean
}) {
  const [panel, setPanel] = useState<Panel>(openLinks ? 'links' : '')
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? '' : p))
  const n = linkCount(linkableOf(d.id))

  return (
    <article className="p-card p-result" {...(tourTarget ? { 'data-tour': true } : {})}>
      <div className="p-result-top">
        <SourceBadge d={d} />
        <CategoryPath categories={d.categories} />
      </div>
      <h3>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('detail', d.id)
          }}
        >
          <Highlight text={d.name} q={q} />
        </a>
      </h3>
      <div className="p-result-meta">
        <span>{d.provider}</span>
        <span className="num">{d.cols ? `컬럼 ${d.cols}개 · 행 ${d.rows.toLocaleString()}` : '메타데이터'}</span>
        <span className="num">{d.created} 등록</span>
      </div>
      <p className="p-result-sum">
        <Highlight text={d.summary} q={q} />
      </p>

      <div className="p-result-actions">
        <button className={`p-act ${panel === 'about' ? 'on' : ''}`} onClick={() => toggle('about')} aria-expanded={panel === 'about'}>
          설명 <Chevron />
        </button>
        <button className={`p-act ${panel === 'links' ? 'on' : ''}`} onClick={() => toggle('links')} aria-expanded={panel === 'links'}>
          연계 데이터 <span className="n num">{n}</span> <Chevron />
        </button>
        <button className="p-act" onClick={() => go('detail', d.id)}>
          상세보기
        </button>
        <span className="p-act-spacer" />
        <a className="p-act" href="#" onClick={(e) => e.preventDefault()}>
          원본 ↗
        </a>
      </div>

      {panel === 'about' && (
        <div className="p-result-panel">
          <p>{d.summary}</p>
          {!!d.keywords.length && (
            <div>
              {d.keywords.map((k) => (
                <span key={k} className="p-tag">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {panel === 'links' && (
        <div className="p-result-panel">
          {n === 0 ? (
            <div className="muted">
              아직 확정된 연계 데이터가 없습니다.{' '}
              <a
                href="#"
                style={{ color: 'var(--p-primary)', fontWeight: 700 }}
                onClick={(e) => {
                  e.preventDefault()
                  go('detail', d.id)
                }}
              >
                상세보기
              </a>
              에서 관계 생성을 실행할 수 있습니다.
            </div>
          ) : (
            <RelationRadial anchor={d} linkable={linkableOf(d.id)} go={go} height={320} />
          )}
        </div>
      )}
    </article>
  )
}

/** 방사형 관계 지도 — 가운데 기준 데이터, 관계 유형 허브, 바깥에 연계 데이터 */
export function RelationRadial({
  anchor,
  linkable,
  go,
  height = 360,
}: {
  anchor: Dataset
  linkable: Linkable
  go: Go
  height?: number
}) {
  const groups = REL_ORDER.map((t) => ({ type: t, items: linkable.groups[t] ?? [] })).filter((g) => g.items.length)
  const W = 720
  const H = height
  const cx = W / 2
  const cy = H / 2
  const SQUASH = 0.7
  const MAX_LEAVES = 8
  const hubR = 120
  const PAD = 70
  const short = (s: string, n = 11) => (s.length > n ? `${s.slice(0, n)}…` : s)

  return (
    <div>
      <svg className="p-radial" viewBox={`${-PAD} 0 ${W + 2 * PAD} ${H}`} role="img" aria-label={`${anchor.name} 관계 지도`}>
        {groups.map((g, gi) => {
          const a = groups.length === 1 ? 0 : Math.PI + (2 * Math.PI * gi) / groups.length
          const hx = cx + hubR * Math.cos(a)
          const hy = cy + hubR * Math.sin(a) * SQUASH
          const color = REL_TYPES[g.type].color
          const leaves = g.items.slice(0, MAX_LEAVES)
          const hidden = g.items.length - leaves.length
          const m = leaves.length + (hidden ? 1 : 0)
          const leafR = Math.min(150, 70 + 8 * m)
          const spread = m === 1 ? 0 : Math.min(Math.PI * 0.75, 0.32 * (m - 1))
          const at = (k: number) => {
            const la = m === 1 ? a : a - spread / 2 + (spread * k) / (m - 1)
            return { la, x: hx + leafR * Math.cos(la), y: hy + leafR * Math.sin(la) * SQUASH }
          }
          return (
            <g key={g.type}>
              <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#cbd5e1" strokeWidth={1.5} />
              {leaves.map((it, k) => {
                const { la, x, y } = at(k)
                const right = Math.cos(la) >= 0
                return (
                  <g
                    key={it.name}
                    className="leaf"
                    onClick={() => it.id && go('detail', it.id)}
                    style={it.id ? undefined : { cursor: 'default' }}
                  >
                    <title>{`${it.name} · ${REL_TYPES[g.type].label} · 신뢰도 ${pct(it.score)}`}</title>
                    <line x1={hx} y1={hy} x2={x} y2={y} stroke={color} strokeOpacity={0.45} strokeWidth={1.5} />
                    <circle cx={x} cy={y} r={7} fill={color} fillOpacity={0.85} stroke="#fff" strokeWidth={2} />
                    <text x={x + (right ? 11 : -11)} y={y + 4} fontSize={12} fill="#0f172a" textAnchor={right ? 'start' : 'end'}>
                      {short(it.name)}
                    </text>
                  </g>
                )
              })}
              {hidden > 0 &&
                (() => {
                  const { la, x, y } = at(m - 1)
                  return (
                    <text key="more" x={x + (Math.cos(la) >= 0 ? 4 : -4)} y={y + 4} fontSize={12} fill="#64748b" textAnchor={Math.cos(la) >= 0 ? 'start' : 'end'}>
                      +{hidden}건
                    </text>
                  )
                })()}
              <circle cx={hx} cy={hy} r={13} fill="#fff" stroke={color} strokeWidth={3} />
              <text x={hx} y={hy - 20} fontSize={12.5} fontWeight={700} fill={color} textAnchor="middle">
                {REL_TYPES[g.type].label} {g.items.length}
              </text>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={40} fill="#3b4fd8" />
        <circle cx={cx} cy={cy} r={46} fill="none" stroke="#3b4fd8" strokeOpacity={0.25} strokeWidth={2} />
        <text x={cx} y={cy - 3} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">
          이 데이터
        </text>
        <text x={cx} y={cy + 13} fontSize={10.5} fill="#e0e7ff" textAnchor="middle">
          {short(anchor.name, 8)}
        </text>
      </svg>
      <div className="p-legend">
        {groups.map((g) => (
          <span key={g.type}>
            <i style={{ background: REL_TYPES[g.type].color }} />
            {REL_TYPES[g.type].label} — {REL_TYPES[g.type].desc}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 연계 데이터 1건 */
export function LinkRow({ item, go, candidate = false }: { item: LinkItem; go: Go; candidate?: boolean }) {
  return (
    <div className={`p-link ${candidate ? 'cand' : ''}`}>
      <div>
        <div className="t">
          {item.id && byId[item.id] ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                go('detail', item.id!)
              }}
            >
              {item.name}
            </a>
          ) : (
            <a href="#" onClick={(e) => e.preventDefault()}>
              {item.name}
            </a>
          )}
          {item.provider && <span className="muted" style={{ fontSize: 13 }}>{item.provider}</span>}
          {item.sub && <span className="sub">{item.sub}</span>}
        </div>
        {item.keys.length > 0 && (
          <div className="keys">
            결합 키{' '}
            {item.keys.map((k) => (
              <code key={k}>{k}</code>
            ))}
          </div>
        )}
        <p className="why">{item.reason}</p>
      </div>
      <div className="side">
        <div className="p-meter" title={candidate ? '의미 유사도' : '관계 신뢰도'}>
          <span className="muted">{candidate ? '유사도' : '신뢰도'}</span>
          <span className="tr">
            <span className="fl" style={{ width: pct(item.score) }} />
          </span>
          <span className="num">{pct(item.score)}</span>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--p-primary)' }}>
          원본 ↗
        </a>
      </div>
    </div>
  )
}

/** 관계 유형별 묶음 — 동종 판본은 접어 둔다 */
export function LinkGroups({ linkable, go }: { linkable: Linkable; go: Go }) {
  return (
    <div className="p-groups">
      {REL_ORDER.filter((t) => linkable.groups[t]?.length).map((t) => {
        const items = linkable.groups[t]!
        return (
          <details key={t} className="p-group" open={t !== 'SAME_KIND'}>
            <summary>
              <span className="dot" style={{ background: REL_TYPES[t].color }} />
              <span className="gl">{REL_TYPES[t].label}</span>
              <span className="p-badge soft num">{items.length}건</span>
              <span className="gd">{REL_TYPES[t].desc}</span>
            </summary>
            {items.map((it) => (
              <LinkRow key={it.name} item={it} go={go} />
            ))}
          </details>
        )
      })}
    </div>
  )
}

/** 판정 전 유사 후보 묶음 */
export function CandidateGroup({ linkable, go, open }: { linkable: Linkable; go: Go; open?: boolean }) {
  if (!linkable.candidates.length) return null
  return (
    <details className="p-group" style={{ marginTop: 14 }} open={open}>
      <summary>
        <span className="dot" style={{ background: '#cbd5e1' }} />
        <span className="gl">관계 미확정 유사 데이터</span>
        <span className="p-badge soft num">{linkable.candidates.length}건</span>
        <span className="gd">의미는 비슷하지만 확정된 관계가 없습니다. 관계 생성으로 판정하며 근거가 부족하면 여기에 남습니다</span>
      </summary>
      {linkable.candidates.map((c) => (
        <LinkRow key={c.name} item={{ ...c, keys: [], reason: '' }} go={go} candidate />
      ))}
    </details>
  )
}
