import type { ScreenProps } from '../App'

const FILTERS = [
  {
    title: '분류',
    items: [
      ['사회복지', '142', true],
      ['보건의료', '31', false],
      ['교육', '18', false],
      ['공공행정', '5', false],
    ],
  },
  {
    title: '제공 형태',
    items: [
      ['파일 (CSV·XLSX)', '171', true],
      ['오픈API', '25', true],
    ],
  },
  {
    title: '지역',
    items: [
      ['전국', '4', false],
      ['경기도', '28', false],
      ['서울특별시', '24', false],
      ['부산광역시', '15', false],
    ],
  },
  {
    title: '갱신 주기',
    items: [
      ['매일', '6', false],
      ['연 1회 이상', '124', true],
    ],
  },
] as const

const REGIONS = [
  ['경기도 성남시', '412개소'],
  ['경기도 수원시', '508개소'],
  ['경기도 용인시', '441개소'],
  ['서울특별시 송파구', '297개소'],
  ['서울특별시 강남구', '213개소'],
  ['부산광역시 해운대구', '186개소'],
  ['인천광역시 서구', '344개소'],
  ['대구광역시 수성구', '168개소'],
]

const OTHERS = [
  {
    title: '보건복지부_어린이집 이용 현황',
    desc: '전국 어린이집의 정원·현원·이용률을 시군구 단위로 집계한 자료입니다. 시설 목록과 함께 쓰면 지역별 수급 현황을 볼 수 있습니다.',
    pill: '시군구 집계',
    meta: ['보건복지부', '229행', '2026-06-30'],
  },
  {
    title: '한국사회보장정보원_어린이집 교직원 현황',
    desc: '어린이집별 교사 수와 자격 구분입니다. 시설 목록과 같은 시설 코드를 쓰고 있어 바로 붙습니다.',
    pill: '함께 쓰기 좋음',
    meta: ['한국사회보장정보원', '39,412행', '2026-05-29'],
  },
  {
    title: '근로복지공단_전국 직장어린이집 현황',
    desc: '사업장 내 설치 어린이집만 따로 모은 자료입니다.',
    meta: ['근로복지공단', '1,483행', '2026-04-01'],
  },
  {
    title: '교육부_유치원 현황',
    desc: '어린이집과 함께 보육·교육 수요를 함께 보려는 경우 쓰입니다.',
    meta: ['교육부', '8,441행', '2026-03-01'],
  },
]

export default function SearchResults({ go }: ScreenProps) {
  return (
    <main className="wrap">
      <div className="cols">
        <aside className="card filt">
          {FILTERS.map((f) => (
            <section key={f.title}>
              <h3>{f.title}</h3>
              {f.items.map(([label, count, checked]) => (
                <label key={label as string}>
                  <input type="checkbox" defaultChecked={checked as boolean} />
                  {label}
                  <span className="c">{count}</span>
                </label>
              ))}
            </section>
          ))}
        </aside>

        <div>
          <div className="rhead">
            <span className="n">
              <b>어린이집</b> 검색 결과 196건
            </span>
            <div className="sort">
              <button className="on">추천순</button>
              <button>최신순</button>
              <button>많이 받은 순</button>
            </div>
          </div>

          <div className="hero">
            <div className="tag">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1l2 4.5 5 .5-3.7 3.3 1 4.9L8 11.8 3.7 14.2l1-4.9L1 6l5-.5z" />
              </svg>
              찾으시는 게 이것일 수 있습니다
            </div>
            <div className="bd">
              <h2>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    go('v2')
                  }}
                >
                  전국 어린이집 통합 현황
                </a>
              </h2>
              <p className="why">
                전국 <b>103개 기관</b>이 따로 올린 어린이집 데이터를 하나로 합쳐 둔 자료입니다.
                지역별로 내려받아 붙이지 않아도 됩니다.
              </p>
              <div className="meta">
                <span>한국사회보장정보원</span>
                <span className="num">39,412행 · 11개 항목</span>
                <span>매일 갱신</span>
                <span>CSV · 오픈API</span>
              </div>
              <div className="btns">
                <button className="btn p" onClick={() => go('v2')}>
                  데이터 보기
                </button>
                <button className="btn">CSV 내려받기</button>
                <button className="btn">오픈API 신청</button>
              </div>
            </div>
          </div>

          <details className="fold" data-tour>
            <summary>
              <span className="ic">103</span>
              <span className="tx">
                지역별 어린이집 현황 103건
                <small>항목 구성이 같아 서로 비교할 수 있습니다</small>
              </span>
              <span className="ch">지역 펼쳐보기 ▾</span>
            </summary>
            <div className="rgrid">
              {REGIONS.map(([name, count]) => (
                <a key={name} href="#" onClick={(e) => e.preventDefault()}>
                  {name}
                  <span className="num">{count}</span>
                </a>
              ))}
              <a href="#" className="pri" onClick={(e) => e.preventDefault()}>
                95곳 더 보기 ›
              </a>
            </div>
          </details>

          <div className="card">
            {OTHERS.map((o) => (
              <div className="item" key={o.title}>
                <h3>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    {o.title}
                  </a>
                </h3>
                <p className="d">{o.desc}</p>
                <div className="m">
                  {o.pill && <span className="pill">{o.pill}</span>}
                  {o.meta.map((m, i) => (
                    <span key={m} className={i === 1 ? 'num' : undefined}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
