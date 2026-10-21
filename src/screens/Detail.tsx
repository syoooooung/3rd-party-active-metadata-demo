import { useEffect, useState } from 'react'
import { byId, linkCount, majorOf, minorOf, ICU_BIO_AFTER, CANCER_LIB_GRAPH, type Linkable } from '../data'
import { CandidateGroup, CategoryPath, LinkGroups, linkableOf, RelationRadial, SourceBadge, type Go } from '../parts'
import RingMap from './RingMap'

type Props = { go: Go; id: string; forceView?: 'map' }

/** 데이터 상세 — 기본 정보, 요약, 함께 쓸 수 있는 데이터(관계 생성 포함), 컬럼 */
export default function Detail({ go, id, forceView }: Props) {
  const d = byId[id]
  const [view, setView] = useState<'list' | 'map'>(forceView ?? 'list')
  const [gen, setGen] = useState<'idle' | 'running' | 'done'>('idle')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setView(forceView ?? 'list')
    setGen('idle')
  }, [id, forceView])

  if (!d) return null

  // 중환자 생체신호 데이터는 판정 전 — 관계 생성 실행을 누르면 결과가 생기는 흐름을 재현한다
  const linkable: Linkable = id === 'icu-bio' && gen === 'done' ? ICU_BIO_AFTER : linkableOf(id)
  const judged = linkCount(linkable)
  const primary = d.categories[0]
  const hasRing = id === 'cancer-lib'

  const generate = () => {
    setGen('running')
    window.setTimeout(() => setGen('done'), 1800)
  }

  const copyApi = async () => {
    try {
      await navigator.clipboard.writeText(`GET /explore/datasets/${encodeURIComponent(d.name)}/linkable`)
    } catch {
      /* 데모 — 복사 실패해도 무시 */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="portal">
      <div className="p-wrap">
        <nav className="p-crumb" aria-label="위치">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              go('search')
            }}
          >
            데이터 찾기
          </a>
          {primary && (
            <span>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {majorOf(primary)}
              </a>
            </span>
          )}
          {primary && (
            <span>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {minorOf(primary)}
              </a>
            </span>
          )}
        </nav>

        <section className="p-card p-detail-head">
          <div className="p-result-top">
            <SourceBadge d={d} />
            <CategoryPath categories={d.categories} />
          </div>
          <h1>{d.name}</h1>
          <dl className="p-meta">
            <dt>제공기관</dt>
            <dd>{d.provider}</dd>
            <dt>구분</dt>
            <dd>{d.party === '1st' ? '기관 보유 데이터' : `외부 개방 데이터 · ${d.source}`}</dd>
            <dt>규모</dt>
            <dd className="num">{d.cols ? `컬럼 ${d.cols}개 · 행 ${d.rows.toLocaleString()}` : '메타데이터만 등록 (컬럼 정보 없음)'}</dd>
            <dt>등록일</dt>
            <dd className="num">{d.created}</dd>
          </dl>
          <div className="p-detail-actions">
            <a className="p-btn" href="#" onClick={(e) => e.preventDefault()}>
              출처 바로가기 ↗
            </a>
            <button className="p-btn" disabled={!judged}>
              연계 데이터 CSV
            </button>
            <button className="p-btn" onClick={copyApi}>
              {copied ? '복사됨' : '연동 API 복사'}
            </button>
          </div>
        </section>

        <section className="p-card p-block p-section">
          <h2>요약</h2>
          {!!d.keywords.length && (
            <div style={{ marginBottom: 10 }}>
              {d.keywords.map((k) => (
                <span key={k} className="p-tag">
                  {k}
                </span>
              ))}
            </div>
          )}
          <p style={{ margin: 0, color: 'var(--p-ink-2)' }}>{d.summary}</p>
        </section>

        <section className="p-card p-block p-section" data-tour>
          <h2>
            함께 쓸 수 있는 데이터
            <span className="p-badge soft num">{judged}건</span>
            <span className="sp" />
            <button className={`p-btn sm ${judged ? '' : 'primary'}`} onClick={generate} disabled={gen === 'running'}>
              {gen === 'running' ? (
                <>
                  <span className="spin" /> 관계 생성 중
                </>
              ) : judged ? (
                '관계 다시 생성'
              ) : (
                '관계 생성 실행'
              )}
            </button>
          </h2>
          <p className="lead">
            이 데이터와 결합하거나 비교해 쓸 수 있는 외부 개방 데이터를 관계 유형별로 보여줍니다. 관계 생성은 의미가 가까운 데이터 20건과
            컬럼이 겹치는 데이터를 골라 판정합니다.
          </p>

          {gen === 'running' && (
            <div className="p-banner">
              <span className="spin" /> 관계를 판정하고 있습니다. 후보마다 판정하므로 수 분 걸립니다. 화면을 떠나도 서버에서 계속 진행됩니다.
            </div>
          )}
          {gen === 'done' && (
            <div className="p-banner done">
              관계 생성 완료 — 확정 <b>{judged}</b>건 · 검토 대기 <b>1</b>건
            </div>
          )}

          {judged > 0 ? (
            <>
              <div className="p-tabs" role="tablist">
                <button role="tab" aria-selected={view === 'list'} className={`p-chip ${view === 'list' ? 'on' : ''}`} onClick={() => setView('list')}>
                  목록
                </button>
                <button role="tab" aria-selected={view === 'map'} className={`p-chip ${view === 'map' ? 'on' : ''}`} onClick={() => setView('map')} data-tour-map-tab>
                  관계 지도
                </button>
              </div>
              {view === 'list' ? (
                <LinkGroups linkable={linkable} go={go} />
              ) : (
                <div data-tour-map>{hasRing ? <RingMap nodes={CANCER_LIB_GRAPH} go={go} /> : <RelationRadial anchor={d} linkable={linkable} go={go} />}</div>
              )}
            </>
          ) : (
            gen !== 'done' && (
              <div className="p-banner">
                아직 확정된 연계 데이터가 없습니다. <b>관계 생성 실행</b>을 누르면 판정을 시작합니다.
              </div>
            )
          )}

          <CandidateGroup linkable={linkable} go={go} open={judged === 0} />
        </section>

        {!!d.columns?.length && (
          <section className="p-card p-block p-section">
            <h2>
              컬럼 <span className="p-badge soft num">{d.columns.length}개</span>
            </h2>
            <div>
              {d.columns.map((c) => (
                <span key={c} className="p-tag">
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
