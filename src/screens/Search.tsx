import { useMemo, useState } from 'react'
import { DATASETS, majorOf, PROVIDERS, SEP, STATS, TAXONOMY } from '../data'
import { DatasetResultCard, type Go } from '../parts'

const PARTIES = [
  { v: '', label: '전체' },
  { v: '3rd', label: '외부 개방 데이터' },
  { v: '1st', label: '기관 보유 데이터' },
]

export type SearchState = { q?: string; category?: string; subcategory?: string }

type Props = { go: Go; initial?: SearchState; tourLinksFor?: string }

/** 데이터 찾기 — 왼쪽 대분류, 위 중분류 칩, 조건, 결과 카드 */
export default function Search({ go, initial, tourLinksFor }: Props) {
  const [q, setQ] = useState(initial?.q ?? '')
  const [draft, setDraft] = useState(initial?.q ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? '')
  const [party, setParty] = useState('')
  const [provider, setProvider] = useState('')
  const [note, setNote] = useState(false)

  const major = TAXONOMY.find((m) => m.name === category)

  const items = useMemo(
    () =>
      DATASETS.filter(
        (d) =>
          (!category || d.categories.some((c) => majorOf(c) === category)) &&
          (!subcategory || d.categories.includes(subcategory)) &&
          (!party || d.party === party) &&
          (!provider || d.provider === provider) &&
          (!q || (d.name + d.summary + d.keywords.join(' ')).toLowerCase().includes(q.toLowerCase())),
      ),
    [q, category, subcategory, party, provider],
  )

  /** 표시용 총 건수 — 분야 집계값, 조건이 더 붙으면 목록 수 */
  const total =
    party || provider || q
      ? items.length
      : subcategory && major
        ? (major.children.find(([n]) => subcategory === `${major.name}${SEP}${n}`)?.[1] ?? items.length)
        : major
          ? major.count
          : STATS.datasets

  return (
    <div className="portal">
      <div className="p-wrap">
        <div className="p-search">
          <nav className="p-rail" aria-label="분야">
            <h3>분야</h3>
            <button
              className={`p-rail-item ${!category ? 'on' : ''}`}
              onClick={() => {
                setCategory('')
                setSubcategory('')
              }}
            >
              전체 <span className="c num">{STATS.datasets.toLocaleString()}</span>
            </button>
            {TAXONOMY.map((m) => (
              <button
                key={m.name}
                className={`p-rail-item ${category === m.name ? 'on' : ''}`}
                onClick={() => {
                  setCategory(m.name)
                  setSubcategory('')
                }}
              >
                {m.name} <span className="c num">{m.count.toLocaleString()}</span>
              </button>
            ))}
          </nav>

          <main>
            <form
              className="p-searchbar"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                setQ(draft.trim())
              }}
            >
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="키워드로 데이터를 찾아보세요" aria-label="데이터 검색어" />
              <button>검색</button>
            </form>

            {major && (
              <div className="p-subpanel">
                <h4>{major.name} · 중분류</h4>
                <div className="p-chips">
                  <button className={`p-chip ${!subcategory ? 'on' : ''}`} onClick={() => setSubcategory('')}>
                    전체 <span className="cnt num">{major.count.toLocaleString()}</span>
                  </button>
                  {major.children.map(([name, count]) => {
                    const value = `${major.name}${SEP}${name}`
                    return (
                      <button key={name} className={`p-chip ${subcategory === value ? 'on' : ''}`} onClick={() => setSubcategory(value)} disabled={!count}>
                        {name} <span className="cnt num">{count.toLocaleString()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="p-filters">
              <label>구분</label>
              <div className="p-seg" role="group" aria-label="데이터 구분">
                {PARTIES.map((p) => (
                  <button key={p.v} className={party === p.v ? 'on' : ''} onClick={() => setParty(p.v)}>
                    {p.label}
                  </button>
                ))}
              </div>
              <label htmlFor="p-provider">제공기관</label>
              <select id="p-provider" value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="">전체</option>
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-result-head">
              {q && <span className="q">"{q}"</span>}
              <span className="t">
                {subcategory || category || '전체 분야'} 검색결과 <b className="num">{total.toLocaleString()}</b>건
              </span>
            </div>

            {items.length === 0 && <div className="p-card empty">조건에 맞는 데이터가 없습니다. 검색어를 바꾸거나 분야 조건을 풀어 보세요.</div>}
            <div className="p-results">
              {items.map((d) => (
                <DatasetResultCard key={d.id} d={d} q={q} go={go} openLinks={tourLinksFor === d.id} tourTarget={tourLinksFor === d.id} />
              ))}
            </div>
            {items.length < total && (
              <div className="p-more">
                {note ? (
                  <span className="muted">데모에는 분야별 대표 데이터 {items.length}건만 담았습니다.</span>
                ) : (
                  <button className="p-btn" onClick={() => setNote(true)}>
                    더 보기 ({items.length}/{total.toLocaleString()})
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
