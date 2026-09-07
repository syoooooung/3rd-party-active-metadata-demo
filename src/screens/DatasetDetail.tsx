import { useState } from 'react'
import type { ScreenProps } from '../App'
import { PREVIEW_ROWS, SNAPSHOTS } from '../data'

const COMBINE = [
  {
    title: '주민등록인구 (연령별·시군구)',
    why: ['시군구가 같아 바로 붙습니다. 합치면 ', '영유아 1천 명당 어린이집 수', '를 지역별로 낼 수 있습니다.'],
    from: '국가통계포털 · 매월 갱신',
    primary: true,
  },
  {
    title: '어린이집 교직원 현황',
    why: ['같은 시설코드를 쓰고 있어 시설 단위로 붙습니다. 합치면 ', '교사 1인당 아동 수', '가 나옵니다.'],
    from: '한국사회보장정보원 · 2026-05-29',
  },
  {
    title: '시군구별 출생아 수',
    why: ['시군구와 연도가 같아 붙습니다. 합치면 ', '수요 증감 추이', '를 볼 수 있습니다.'],
    from: '국가통계포털 · 연 1회',
  },
]

const CO_USED = [
  ['유치원 현황', '412명이 함께 받았습니다'],
  ['주민등록인구 (연령별·시군구)', '388명이 함께 받았습니다'],
  ['법정동 코드 연계정보', '156명이 함께 받았습니다'],
]

export default function DatasetDetail({ go }: ScreenProps) {
  const [snap, setSnap] = useState(0)

  return (
    <main className="wrap">
      <p className="crumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('v1')
          }}
        >
          데이터 찾기
        </a>{' '}
        › 사회복지 › 전국 어린이집 통합 현황
      </p>
      <h1 className="pg">전국 어린이집 통합 현황</h1>
      <p className="crumb mb18">한국사회보장정보원 · 매일 갱신 · 최근 갱신 2026-05-29</p>

      <div className="banner">
        <div className="tx">
          <b>성남시 담당자시군요</b>
          성남시 어린이집 412개소가 이 자료에 포함돼 있습니다. 성남시만 걸러서 보거나, 다른
          지역과 비교해볼 수 있습니다.
        </div>
        <button className="btn sm">성남시만 보기</button>
        <button className="btn sm">다른 지역과 비교</button>
      </div>

      <div className="cols3">
        <div>
          <div className="tblbox">
            <div className="tblbar">
              <span>시점</span>
              <select value={snap} onChange={(e) => setSnap(Number(e.target.value))}>
                {SNAPSHOTS.map((s, i) => (
                  <option key={s.date} value={i}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button className="btn sm">이전 시점과 비교</button>
              <span className="r">{SNAPSHOTS[snap].rows}</span>
            </div>
            <div className="tblscroll">
              <table className="dt">
                <thead>
                  <tr>
                    <th>시도</th>
                    <th>시군구</th>
                    <th>어린이집명</th>
                    <th>설립유형</th>
                    <th className="n">정원</th>
                    <th className="n">현원</th>
                    <th>주소</th>
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map((r) => (
                    <tr key={r[2] as string}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>{r[3]}</td>
                      <td className="n">{r[4]}</td>
                      <td className="n">{r[5]}</td>
                      <td>{r[6]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="fl mt12">
            <button className="btn p">CSV 내려받기</button>
            <button className="btn">XLSX 내려받기</button>
            <button className="btn">오픈API 신청</button>
            <span className="sp" />
            <button className="btn sm">전체 39,412행 보기</button>
          </div>

          <h3 className="h3s-top">데이터 설명</h3>
          <div className="card pad">
            <div className="kv">
              <span className="k">제공기관</span>
              <span className="v">한국사회보장정보원</span>
              <span className="k">담은 범위</span>
              <span className="v">전국 103개 기관 · 어린이집 39,412개소</span>
              <span className="k">갱신</span>
              <span className="v">매일 · 다음 갱신 2026-05-30</span>
              <span className="k">이용 조건</span>
              <span className="v">이용허락범위 제한 없음</span>
              <span className="k">보유 항목</span>
              <span className="v">
                시도, 시군구, 어린이집명, 설립유형, 정원, 현원, 주소, 전화번호, 인가일, 시설코드,
                데이터기준일
              </span>
            </div>
          </div>
        </div>

        <div>
          <button className="relmap" onClick={() => go('v5')}>
            <svg viewBox="0 0 74 60" aria-hidden="true">
              <line x1="37" y1="30" x2="12" y2="14" />
              <line x1="37" y1="30" x2="64" y2="17" />
              <line x1="37" y1="30" x2="16" y2="48" />
              <line x1="37" y1="30" x2="58" y2="47" />
              <line x1="64" y1="17" x2="70" y2="41" />
              <circle cx="37" cy="30" r="7.5" fill="var(--pri)" />
              <circle cx="12" cy="14" r="4.5" fill="var(--pri)" />
              <rect x="59.5" y="12.5" width="9" height="9" rx="2" fill="var(--acc)" />
              <path d="M16 43l5 5-5 5-5-5z" fill="var(--ok)" />
              <circle cx="58" cy="47" r="4.5" fill="var(--pri)" />
              <rect x="65.5" y="36.5" width="9" height="9" rx="2" fill="var(--acc)" />
            </svg>
            <span className="tx">
              <b>이어지는 데이터 10건</b>
              <em>
                바로 붙는 것 6건, 다른 데이터를 거쳐 붙는 것 4건. 관계 지도에서 한눈에 봅니다.
              </em>
            </span>
            <span className="go" aria-hidden="true">→</span>
          </button>

          <div className="card side mb16" data-tour>
            <h3>
              이 데이터와 합쳐보기 <span>3건</span>
            </h3>
            {COMBINE.map((c) => (
              <div className="sug" key={c.title}>
                <div className="t">{c.title}</div>
                <p className="w">
                  {c.why[0]}
                  <b>{c.why[1]}</b>
                  {c.why[2]}
                </p>
                <p className="f">{c.from}</p>
                <button
                  className={c.primary ? 'btn p sm' : 'btn sm'}
                  onClick={() => go('v3')}
                >
                  합쳐보기
                </button>
              </div>
            ))}
          </div>

          <div className="card side mb16">
            <h3>이 자료 대신 쓸 수 있는 것</h3>
            <div className="sug">
              <div className="t">지역별 어린이집 현황 103건</div>
              <p className="w">한 지역만 필요하면 해당 지자체 자료가 더 가볍습니다.</p>
              <button className="btn sm" onClick={() => go('v1')}>
                지역 목록 보기
              </button>
            </div>
            <div className="sug">
              <div className="t">같은 자료 오픈API</div>
              <p className="w">매일 자동으로 받아가려면 API가 편합니다. 항목은 같습니다.</p>
              <button className="btn sm">API 문서 보기</button>
            </div>
          </div>

          <div className="card side">
            <h3>이 데이터를 받은 분들이 함께 받은 것</h3>
            {CO_USED.map(([title, note]) => (
              <div className="sug" key={title}>
                <div className="t">{title}</div>
                <p className="f">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
