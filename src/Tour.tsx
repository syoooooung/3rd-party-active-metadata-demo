import { useEffect } from 'react'
import type { ScreenId } from './App'

type Step = { screen: ScreenId; title: string; body: string; spot?: boolean }

/** 처음 들어온 사람이 이 포털이 무엇을 하는지 8단계로 따라가게 한다. */
export const STEPS: Step[] = [
  {
    screen: 'v1',
    title: '흩어진 공공데이터를 관계로 이어주는 포털입니다',
    body: '어린이집이 인구 대비 충분한지 보려면, 지금은 공공데이터포털에서 시설 목록을 받고 통계청에서 인구를 따로 받아 엑셀에서 지역 이름을 맞춰야 합니다. 그 일을 포털이 대신하면 어떻게 되는지 8단계로 보여드립니다.',
  },
  {
    screen: 'v1',
    spot: true,
    title: '같은 자료 103건은 접어서 보여줍니다',
    body: '“어린이집” 검색 결과 196건 중 103건은 지자체가 각자 올린 같은 형식의 자료입니다. 데이터셋 사이의 관계를 미리 판정해 두기 때문에, 전국 통합본을 먼저 내놓고 나머지는 한 줄로 접을 수 있습니다.',
  },
  {
    screen: 'v2',
    spot: true,
    title: '합칠 수 있는 데이터를 먼저 꺼내 놓습니다',
    body: '무엇을 붙일 수 있는지 사용자가 검색으로 찾아 헤맬 필요가 없습니다. 무엇을 기준으로 붙는지(시군구·시설코드)까지 근거로 함께 보여줍니다.',
  },
  {
    screen: 'v3',
    spot: true,
    title: '결합 키와 표기 차이를 자동으로 맞춥니다',
    body: '어린이집 자료는 “성남시”, 인구 자료는 “경기도 성남시”로 적혀 있습니다. 같은 지역으로 자동으로 묶되, 묶이지 않은 3곳은 숨기지 않고 그대로 알려줍니다.',
  },
  {
    screen: 'v4',
    spot: true,
    title: '지표는 저장하지 않고 볼 때 계산합니다',
    body: '1천 명당 값 같은 파생값을 저장해 두면 원본이 보정될 때마다 뒤 구간을 전부 다시 계산해야 합니다. 원본 관측값만 보존하고 계산은 조회 시점에 합니다.',
  },
  {
    screen: 'v5',
    spot: true,
    title: '직접 안 붙는 데이터는 경로로 보여줍니다',
    body: '어린이집과 주민등록인구는 바로 붙지 않지만 법정동 코드를 거치면 붙습니다. 목록으로는 이걸 표현할 수 없어서 지도가 필요합니다. 지금 노드를 눌러보셔도 됩니다.',
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
  go: (id: ScreenId) => void
}

export default function Tour({ step, setStep, go }: Props) {
  const cur = STEPS[step]

  useEffect(() => go(cur.screen), [cur.screen])

  useEffect(() => {
    if (!cur.spot) return
    // 화면 전환 렌더가 끝난 뒤에 대상 요소를 찾는다.
    const t = window.setTimeout(() => {
      const el = document.querySelector('[data-tour]')
      if (!el) return
      el.classList.add('tour-hl')
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 120)
    return () => {
      window.clearTimeout(t)
      document.querySelector('.tour-hl')?.classList.remove('tour-hl')
    }
  }, [step, cur.spot])

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
