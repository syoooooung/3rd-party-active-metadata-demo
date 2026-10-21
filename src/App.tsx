import { useEffect, useState } from 'react'
import './portal.css'
import './amm.css'

import Tour, { STEPS } from './Tour'
import Home from './screens/Home'
import Search, { type SearchState } from './screens/Search'
import Detail from './screens/Detail'
import IngestStatus from './screens/IngestStatus'
import ReviewQueue from './screens/ReviewQueue'

export type ScreenId = 'home' | 'search' | 'detail' | 'v6' | 'v7'
export type ScreenProps = { go: (id: ScreenId) => void }

// 실제 포털과 동일하게 라이트 테마로 고정한다 (관리 화면의 다크 토큰 비활성화)
document.documentElement.dataset.theme = 'light'

const SEEN = 'tour-seen'

const seenTour = () => {
  try {
    return sessionStorage.getItem(SEEN) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [datasetId, setDatasetId] = useState('cancer-lib')
  const [searchInit, setSearchInit] = useState<SearchState>({})
  const [searchKey, setSearchKey] = useState(0)
  const [tour, setTour] = useState<number | null>(() => (seenTour() ? null : 0))

  const go = (id: string, arg?: string) => {
    if (id === 'detail' && arg) setDatasetId(arg)
    if (id === 'search') {
      setSearchInit({})
      setSearchKey((k) => k + 1)
    }
    setScreen(id as ScreenId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const search = (q: string, category?: string) => {
    setSearchInit({ q: q || undefined, category })
    setSearchKey((k) => k + 1)
    setScreen('search')
    window.scrollTo({ top: 0 })
  }

  // 둘러보기 단계에 맞춰 화면을 전환한다
  const step = tour != null ? STEPS[tour] : null
  useEffect(() => {
    if (!step) return
    if (step.screen === 'search') {
      setSearchInit({ category: '의료', subcategory: '의료 > 의학' })
      setSearchKey((k) => k + 1)
    }
    if (step.screen === 'detail' && step.dataset) setDatasetId(step.dataset)
    setScreen(step.screen)
    window.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour])

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

  const inAdmin = screen === 'v6' || screen === 'v7'
  const inSearch = screen === 'search' || screen === 'detail'

  return (
    <>
      <header className="header">
        <button className="header-logo" onClick={() => go('home')}>
          <span className="header-mark" aria-hidden="true">A</span>
          <span className="header-name">
            <b>Active Metadata Management</b>
            <small>데이터 찾기 · 연계 플랫폼</small>
          </span>
        </button>
        <nav className="header-nav" aria-label="주 메뉴">
          <a
            href="#"
            className={inSearch ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault()
              go('search')
            }}
          >
            데이터 찾기
          </a>
          <a
            href="#"
            className={inAdmin ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault()
              go('v6')
            }}
          >
            관리
          </a>
          <button className="tourbtn2" onClick={() => setTour(0)}>
            둘러보기
          </button>
        </nav>
      </header>

      {screen === 'home' && <Home onSearch={search} />}
      {screen === 'search' && (
        <Search key={searchKey} go={go} initial={searchInit} tourLinksFor={step?.screen === 'search' ? step.links : undefined} />
      )}
      {screen === 'detail' && <Detail go={go} id={datasetId} forceView={step?.screen === 'detail' && step.view === 'map' ? 'map' : undefined} />}
      {screen === 'v6' && <IngestStatus go={go} />}
      {screen === 'v7' && <ReviewQueue go={go} />}

      {tour != null && <Tour step={tour} setStep={setTourStep} />}
    </>
  )
}
