import { useState } from 'react'
import './portal.css'

import Tour from './Tour'
import SearchResults from './screens/SearchResults'
import DatasetDetail from './screens/DatasetDetail'
import Combine from './screens/Combine'
import MetricResult from './screens/MetricResult'
import RelationMap from './screens/RelationMap'
import IngestStatus from './screens/IngestStatus'
import ReviewQueue from './screens/ReviewQueue'

export type ScreenId = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7'
export type ScreenProps = { go: (id: ScreenId) => void }

const ADMIN_SCREENS: ScreenId[] = ['v6', 'v7']

const GNB: { label: string; go?: ScreenId; owns?: ScreenId[] }[] = [
  { label: '데이터 찾기', go: 'v1', owns: ['v1', 'v2'] },
  { label: '관계 지도', go: 'v5', owns: ['v5'] },
  { label: '데이터 통합', go: 'v3', owns: ['v3', 'v4'] },
  { label: '내 작업' },
  { label: '수집 관리', go: 'v6', owns: ['v6', 'v7'] },
]

const SEEN = 'tour-seen'

const seenTour = () => {
  try {
    return sessionStorage.getItem(SEEN) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('v1')
  const [tour, setTour] = useState<number | null>(() => (seenTour() ? null : 0))
  const isAdmin = ADMIN_SCREENS.includes(screen)

  const go = (id: ScreenId) => {
    setScreen(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setTourStep = (s: number | null) => {
    setTour(s)
    if (s == null) {
      try {
        sessionStorage.setItem(SEEN, '1')
      } catch {
        /* 저장 못 해도 투어 동작에는 영향 없음 */
      }
    }
  }

  return (
    <>
      <header className="hdr">
        <div className="in">
          <span className="brand">
            ThirdEye<em>써드파티 데이터 포털</em>
          </span>
          <form className="sform" onSubmit={(e) => e.preventDefault()}>
            <input defaultValue="어린이집" aria-label="데이터 검색" />
            <button type="submit">검색</button>
          </form>
          <button className="tourbtn" onClick={() => setTour(0)}>
            둘러보기
          </button>
          <span className="me">
            <span className="av">{isAdmin ? '오' : '황'}</span>
            <span>{isAdmin ? '오재욱 · 운영관리자' : '황세영 · 성남시'}</span>
          </span>
        </div>
        <nav className="gnb">
          {GNB.map((m) => (
            <a
              key={m.label}
              href="#"
              className={m.owns?.includes(screen) ? 'on' : undefined}
              onClick={(e) => {
                e.preventDefault()
                if (m.go) go(m.go)
              }}
            >
              {m.label}
            </a>
          ))}
        </nav>
      </header>

      {screen === 'v1' && <SearchResults go={go} />}
      {screen === 'v2' && <DatasetDetail go={go} />}
      {screen === 'v3' && <Combine go={go} />}
      {screen === 'v4' && <MetricResult go={go} />}
      {screen === 'v5' && <RelationMap go={go} />}
      {screen === 'v6' && <IngestStatus go={go} />}
      {screen === 'v7' && <ReviewQueue go={go} />}

      {tour != null && <Tour step={tour} setStep={setTourStep} go={go} />}
    </>
  )
}
