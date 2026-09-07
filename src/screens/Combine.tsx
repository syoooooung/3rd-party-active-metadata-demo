import type { ScreenProps } from '../App'

/** 두 자료에서 서로 대응하는 항목 — 이름이 달라도 뜻이 같으면 찾아낸다. */
const PAIRS = [
  { a: '시군구', b: '행정구역(시군구)', tag: '맞물리는 기준', key: true },
  { a: '시도', b: '행정구역(시도)' },
  { a: '데이터기준일', b: '기준연월', tag: '이름이 다름' },
]

/** 표기가 다른 같은 지역을 하나로 묶은 결과 (대표값 ← 원래 표기들). */
const CLUSTERS = [
  { rep: '경기도 성남시', vars: ['성남시', '성남', '경기 성남시'] },
  { rep: '서울특별시 강남구', vars: ['강남구', '서울 강남구'] },
  { rep: '전북특별자치도 전주시', vars: ['전라북도 전주시', '전주시'] },
]

const UNMATCHED = [
  ['세종특별자치시', '시군구 단계가 없어 인구 자료와 단위가 맞지 않습니다'],
  ['창원시', '인구 자료는 구 단위로, 어린이집 자료는 시 단위로 적혀 있습니다'],
  ['고양시', '인구 자료는 구 단위로, 어린이집 자료는 시 단위로 적혀 있습니다'],
]

export default function Combine({ go }: ScreenProps) {
  return (
    <main className="wrap">
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
        › 데이터 통합
      </p>
      <h1 className="pg">데이터 통합</h1>
      <p className="crumb mb18">
        두 자료를 같은 기준으로 놓습니다. 항목 이름과 값 표기가 달라도 맞춰서 보여줍니다.
      </p>

      <div className="card mb20" data-tour>
        <div className="pad">
          <div className="mix slim">
            <div className="slot b">
              <div className="sh">
                <div className="n">전국 어린이집 통합 현황</div>
                <div className="o">한국사회보장정보원 · 39,412행 · 11개 항목</div>
              </div>
            </div>
            <div className="join">
              <span className="k">시군구</span>
              <div className="ln" />
              <p className="l">
                226개 지역이
                <br />
                양쪽에 있습니다
              </p>
            </div>
            <div className="slot b">
              <div className="sh">
                <div className="n">주민등록인구 (연령별·시군구)</div>
                <div className="o">국가통계포털 · 2026-04 기준 · 6개 항목</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qa">
        <div className="qh">
          <span className="qn">1</span>
          <b>맞물리는 항목</b>
          <span className="qc">3쌍</span>
        </div>
        <div className="inner">
          <div className="pairs">
            {PAIRS.map((p) => (
              <div className={p.key ? 'pr key' : 'pr'} key={p.a}>
                <span className="a">
                  <span className="nm">{p.a}</span>
                  <span className="ds">어린이집 자료</span>
                </span>
                <span className="ar">↔</span>
                <span className="b">
                  <span className="nm">{p.b}</span>
                  <span className="ds">인구 자료</span>
                </span>
                {p.tag && <span className={p.key ? 'tg pri' : 'tg'}>{p.tag}</span>}
              </div>
            ))}
          </div>
          <p className="note-sm">
            <b className="ink2">데이터기준일</b>과 <b className="ink2">기준연월</b>은 이름이 다르지만
            같은 뜻으로 판단했습니다. 어린이집 자료에만 있는 항목 8개, 인구 자료에만 있는 항목
            3개는 그대로 둡니다.
          </p>
        </div>
      </div>

      <div className="qa">
        <div className="qh">
          <span className="qn">2</span>
          <b>값 표기 맞추기</b>
          <span className="qc">3곳 확인 필요</span>
        </div>
        <div className="inner">
          <div className="clus">
            {CLUSTERS.map((c) => (
              <div className="cu" key={c.rep}>
                <span className="rep">{c.rep}</span>
                <span className="ar">←</span>
                <span className="vs">
                  {c.vars.map((v) => (
                    <em key={v}>{v}</em>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className="note-sm">
            같은 지역이 자료마다 다르게 적혀 있어 하나로 묶었습니다. 226곳 중{' '}
            <b className="ink2">223곳</b>이 자동으로 묶였습니다.
          </p>

          <details className="skip mt12">
            <summary>
              <b>확인이 필요한 3곳</b> — 세종특별자치시, 창원시, 고양시{' '}
              <span className="cv">▾</span>
            </summary>
            <div className="pairs">
              {UNMATCHED.map(([name, why]) => (
                <div className="pr wide" key={name}>
                  <span className="a">
                    <span className="nm">{name}</span>
                  </span>
                  <span className="why">{why}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="card">
        <div className="mkrow">
          <span className="lb">이 통합 기준으로</span>
          <button className="btn">표준 스키마로 내려받기</button>
          <button className="btn">두 자료 한 표로 보기</button>
          <span className="sp" />
          <button className="btn sm" onClick={() => go('v2')}>
            돌아가기
          </button>
          <button className="btn p" onClick={() => go('v4')}>
            지표 만들기
          </button>
        </div>
      </div>
    </main>
  )
}
