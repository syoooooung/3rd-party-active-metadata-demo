import { useEffect } from 'react'
import type { ScreenId } from './App'

export type Step = {
  screen: ScreenId
  /** detail 화면에서 열 데이터 */
  dataset?: string
  /** detail 화면 보기 모드 */
  view?: 'map'
  /** search 화면에서 연계 데이터 패널을 미리 펼칠 카드 */
  links?: string
  /** 하이라이트할 요소 (기본 [data-tour]) */
  sel?: string
  spot?: boolean
  title: string
  body: string
}

/** 처음 들어온 사람이 이 포털이 무엇을 하는지 7단계로 따라가게 한다. */
export const STEPS: Step[] = [
  {
    screen: 'home',
    title: '공공데이터와 기관 보유 데이터를 관계로 이어주는 포털입니다',
    body: '외부 개방 데이터와 기관이 올린 보유 데이터를 한곳에서 찾습니다. 데이터를 올리면 함께 쓸 수 있는 데이터를 포털이 자동으로 판정해 둡니다. 어떻게 쓰는지 6단계로 보여드립니다.',
  },
  {
    screen: 'search',
    links: 'kcure',
    spot: true,
    title: '검색 결과에서 연계 데이터를 바로 펼쳐 봅니다',
    body: '카드의 "연계 데이터"를 누르면 그 자리에서 관계 지도가 열립니다. 가운데가 이 데이터, 가지 끝이 함께 쓸 수 있는 데이터입니다. 속성 보완 · 집계 맥락 · 동종 판본 — 같이 보여주는 이유가 가지마다 다릅니다.',
  },
  {
    screen: 'detail',
    dataset: 'cancer-lib',
    spot: true,
    title: '함께 쓸 수 있는 데이터를 관계 유형별로 묶습니다',
    body: '속성 보완 · 집계 맥락 · 인접 맥락 · 동종 판본 네 유형으로 묶고, 결합 키와 판정 신뢰도를 근거로 붙입니다. 확신도 0.6~0.85 구간은 자동 확정하지 않고 검토 대기로 남깁니다. 포털의 판정은 결합 키·정규화 필요 여부까지고, 실제 결합은 이 판정을 받아 수행됩니다.',
  },
  {
    screen: 'detail',
    dataset: 'cancer-lib',
    view: 'map',
    sel: '[data-tour-map]',
    spot: true,
    title: '직접 안 붙는 데이터는 경로로 보여줍니다',
    body: '암 환자 데이터와 국가 암 유병률 통계는 암종 표기가 달라 바로 붙지 않습니다. KCD 질병분류 코드를 거치면 붙습니다. 목록으로는 표현할 수 없어서 지도가 필요합니다. 노드를 눌러보셔도 됩니다.',
  },
  {
    screen: 'v6',
    spot: true,
    title: '여기서부터는 운영자 화면입니다',
    body: '형식이 제각각인 외부 소스에서 수집한 메타데이터가 표준 카탈로그에 올라가기까지의 단계입니다. 1,284건 중 96.5%는 사람 손을 거치지 않고 확정됩니다.',
  },
  {
    screen: 'v7',
    spot: true,
    title: '확신이 부족한 건만 사람에게 올립니다',
    body: '자동 확정 기준은 유사도 0.90입니다. 미달 항목은 후보·추천·결정을 나눠 기록하기 때문에, 나중에 왜 그렇게 매핑됐는지 되짚을 수 있습니다.',
  },
]

type Props = {
  step: number
  setStep: (s: number | null) => void
}

export default function Tour({ step, setStep }: Props) {
  const cur = STEPS[step]

  useEffect(() => {
    if (!cur.spot) return
    // 화면 전환 렌더가 끝난 뒤에 대상 요소를 찾는다.
    const t = window.setTimeout(() => {
      const el = document.querySelector(cur.sel ?? '[data-tour]')
      if (!el) return
      el.classList.add('tour-hl')
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 220)
    return () => {
      window.clearTimeout(t)
      document.querySelector('.tour-hl')?.classList.remove('tour-hl')
    }
  }, [step, cur.spot, cur.sel])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStep(null)
      if (e.key === 'ArrowRight' && step < STEPS.length - 1) setStep(step + 1)
      if (e.key === 'ArrowLeft' && step > 0) setStep(step - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, setStep])

  const last = step === STEPS.length - 1

  return (
    <div className="tour" role="dialog" aria-label="포털 둘러보기">
      <div className="th">
        <span className="tn num">
          {step + 1} / {STEPS.length}
        </span>
        <b>{cur.title}</b>
        <button className="tx" onClick={() => setStep(null)} aria-label="둘러보기 끝내기">
          ✕
        </button>
      </div>
      <p className="tb">{cur.body}</p>
      <div className="tf">
        <span className="tdots">
          {STEPS.map((_, i) => (
            <i key={i} className={i === step ? 'on' : undefined} />
          ))}
        </span>
        <span className="sp" />
        <button className="btn sm" onClick={() => setStep(null)}>
          건너뛰기
        </button>
        <button className="btn sm" disabled={step === 0} onClick={() => setStep(step - 1)}>
          이전
        </button>
        <button className="btn p sm" onClick={() => setStep(last ? null : step + 1)}>
          {last ? '둘러보기 마치기' : '다음'}
        </button>
      </div>
    </div>
  )
}
