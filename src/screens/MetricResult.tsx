import { useState } from 'react'
import type { ScreenProps } from '../App'
import { METRIC_ROWS, NATIONAL_AVG, type MetricRow } from '../data'

type SortKey = keyof MetricRow

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'area', label: '시군구', numeric: false },
  { key: 'facilities', label: '어린이집 수', numeric: true },
  { key: 'population', label: '0~4세 인구', numeric: true },
  { key: 'per1k', label: '1천 명당', numeric: true },
]

const CHIPS = ['전체', '경기도', '서울특별시', '평균 이하만', '내 지역 주변']

export default function MetricResult({ go }: ScreenProps) {
  const [sortKey, setSortKey] = useState<SortKey>('per1k')
  const [desc, setDesc] = useState(true)

  const sort = (key: SortKey) => {
    if (key === sortKey) setDesc(!desc)
    else {
      setSortKey(key)
      setDesc(key !== 'area')
    }
  }

  const max = Math.max(...METRIC_ROWS.map((r) => r.per1k))
  const rows = [...METRIC_ROWS].sort((a, b) => {
    const x = a[sortKey]
    const y = b[sortKey]
    const cmp = typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number)
    return desc ? -cmp : cmp
  })

  return (
    <main className="wrap">
      <p className="crumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('v3')
          }}
        >
          데이터 합치기
        </a>{' '}
        › 결과
      </p>
      <h1 className="pg">시군구별 영유아 1천 명당 어린이집 수</h1>
      <p className="crumb mb18">
        전국 어린이집 통합 현황 + 주민등록인구 · 2026-04 기준 · 226개 시군구
      </p>

      <div className="done">
        <span className="ic">✓</span>
        <div className="tx">
          <b>표가 만들어졌습니다.</b> 226개 시군구가 계산됐고 3곳은 지역 구분이 맞지 않아
          빠졌습니다.
        </div>
        <button className="btn sm">CSV 내려받기</button>
        <button className="btn sm">내 작업에 저장</button>
      </div>

      <div className="kpis" data-tour>
        <div>
          <div className="n num">13.2</div>
          <div className="l">전국 평균 · 영유아 1천 명당</div>
        </div>
        <div>
          <div className="n num up">14.6</div>
          <div className="l">성남시 · 평균보다 높음</div>
        </div>
        <div>
          <div className="n num">226</div>
          <div className="l">계산된 시군구</div>
        </div>
        <div>
          <div className="n num">39,412</div>
          <div className="l">집계에 쓰인 어린이집</div>
        </div>
      </div>

      <div className="chips">
        {CHIPS.map((c, i) => (
          <button key={c} className={i === 0 ? 'on' : undefined}>
            {c}
          </button>
        ))}
      </div>

      <div className="tblbox">
        <div className="tblbar">
          <span>정렬 기준으로 항목 이름을 누르세요</span>
          <span className="r">226행 중 8행 표시</span>
        </div>
        <div className="tblscroll">
          <table className="dt">
            <thead>
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    className={c.numeric ? 'n srt' : 'srt'}
                    onClick={() => sort(c.key)}
                  >
                    {c.label}
                    {sortKey === c.key ? (desc ? ' ▾' : ' ▴') : ''}
                  </th>
                ))}
                <th className="w150">전국 평균 13.2 대비</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area}>
                  <td>{r.area}</td>
                  <td className="n">{r.facilities.toLocaleString()}</td>
                  <td className="n">{r.population.toLocaleString()}</td>
                  <td className="n">
                    <b>{r.per1k.toFixed(1)}</b>
                  </td>
                  <td>
                    <span className={r.per1k < NATIONAL_AVG ? 'bar hi' : 'bar'}>
                      <i style={{ width: `${((r.per1k / max) * 100).toFixed(0)}%` }} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fl mt14">
        <button className="btn p">CSV 내려받기</button>
        <button className="btn">그래프로 보기</button>
        <button className="btn">지도로 보기</button>
        <span className="sp" />
        <button className="btn sm" onClick={() => go('v3')}>
          조건 바꾸기
        </button>
      </div>

      <h3 className="h3s-gap">이어서 해볼 것</h3>
      <div className="card side mx640">
        <div className="sug">
          <div className="t">교직원 현황을 더 붙이기</div>
          <p className="w">
            같은 시설코드로 붙습니다. <b>교사 1인당 아동 수</b>까지 한 표에 넣을 수 있습니다.
          </p>
          <button className="btn sm" onClick={() => go('v3')}>
            붙여보기
          </button>
        </div>
        <div className="sug">
          <div className="t">작년 값과 비교하기</div>
          <p className="w">
            두 자료 모두 이전 시점이 있습니다. <b>1년 전 대비 증감</b>을 같은 표에 넣습니다.
          </p>
          <button className="btn sm">비교 열 추가</button>
        </div>
      </div>
    </main>
  )
}
