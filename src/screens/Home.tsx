import { useState, type ReactNode } from 'react'
import { MAJOR_COLOR, STATS, TAXONOMY } from '../data'

// 대분류 아이콘 (Lucide 도형, 24px 선 아이콘) — 실제 포털과 동일
const MAJOR_ICON: Record<string, ReactNode> = {
  과학: <><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7M7 16h10" /></>,
  기술: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  인문: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  사회: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  교육: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  의료: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></>,
  문화: <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
}

type Props = { onSearch: (q: string, category?: string) => void }

/** 홈 — 검색 한 줄, 분야별 데이터 */
export default function Home({ onSearch }: Props) {
  const [q, setQ] = useState('')

  return (
    <div className="portal">
      <div className="p-wrap">
        <section className="p-hero">
          <h1>데이터 통합 검색</h1>
          <p>공공데이터와 기관 보유 데이터를 분야별로 찾고, 함께 쓸 수 있는 데이터를 확인합니다.</p>
          <form
            className="p-searchbar big"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              onSearch(q.trim())
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="키워드로 데이터를 찾아보세요 (예: 병원, 어린이집, 드라마 시청률)"
              aria-label="데이터 검색어"
            />
            <button>검색</button>
          </form>
          <div className="p-stats">
            <div className="p-card p-stat"><span className="l">등록 데이터</span><span className="v num">{STATS.datasets.toLocaleString()}<small>개</small></span></div>
            <div className="p-card p-stat"><span className="l">연계 관계</span><span className="v num">{STATS.relations}<small>건</small></span></div>
            <div className="p-card p-stat"><span className="l">제공기관</span><span className="v num">{STATS.providers}<small>곳</small></span></div>
          </div>
        </section>

        <section className="p-section">
          <h2>분야별 데이터</h2>
          <div className="p-tiles">
            {TAXONOMY.map((m) => (
              <a
                key={m.name}
                className="p-card p-tile"
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onSearch('', m.name)
                }}
              >
                <span className="ic" style={{ background: MAJOR_COLOR[m.name] }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {MAJOR_ICON[m.name]}
                  </svg>
                </span>
                <span className="nm">{m.name}</span>
                <span className="ct num">{m.count.toLocaleString()}개</span>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
