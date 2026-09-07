import type { ScreenProps } from '../App'

const SCALE = [
  { score: '1.00', label: '항목명 동일' },
  { score: '0.99 – 0.89', label: '표기 상이' },
  { score: '0.70', label: '동의 가능', low: true },
  { score: '0.50', label: '불확실', low: true },
]

const NEEDS_CHOICE = [
  {
    id: 'c2',
    value: 'DF_CHILDCARE_2026',
    path: 'sdmx-str:Dataflow / @id',
    score: '0.70',
    grade: '동의 가능',
    options: [
      ['고유 식별자', '0.70 · 추천'],
      ['외부 식별자', '0.62'],
    ],
  },
  {
    id: 'c1',
    value: '사회복지 > 보육',
    path: 'sdmx-str:Categorisation / Source',
    score: '0.50',
    grade: '불확실',
    options: [
      ['주제분류', '0.50 · 추천'],
      ['외부 식별자', '0.45'],
      ['설명', '0.31'],
      ['매핑 제외', '—'],
    ],
  },
]

const AUTO_CONFIRMED = [
  ['어린이집 현황 (시군구별)', 'sdmx-common:Name', '0.99', '제목'],
  ['보건복지부', 'sdmx-msg:Sender / Name', '0.99', '제공기관'],
  ['2026-08-31', 'sdmx-msg:Prepared', '0.89', '발행일'],
  ['시군구별 어린이집 정원과 현원을 집계한 통계', 'sdmx-str:Description', '1.00', '설명'],
]

export default function ReviewQueue({ go }: ScreenProps) {
  return (
    <main className="wrap">
      <p className="crumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('v6')
          }}
        >
          수집 현황
        </a>{' '}
        › 등재 검토
      </p>
      <div className="fl" style={{ marginBottom: 5 }}>
        <h1 className="pg m0">등재 검토</h1>
        <span className="sp" />
        <span className="num small-mut mut" style={{ fontSize: 12.5 }}>
          37건 중 1번째
        </span>
        <button className="btn sm">이전</button>
        <button className="btn sm">다음</button>
      </div>
      <p className="crumb mb20">
        자동 확정 기준 미달 건입니다. 매핑 결과와 중복 여부를 확인한 뒤 처리합니다.
      </p>

      <div className="card mb20">
        <div className="pad">
          <div className="kv">
            <span className="k">대상</span>
            <span className="v">
              <b className="ink">어린이집 현황 (시군구별)</b>
            </span>
            <span className="k">수집원</span>
            <span className="v">국가통계포털 · 통계표 상세 설명 · 2026-09-02 06:12</span>
            <span className="k">원본 스냅샷</span>
            <span className="v">
              <a href="#" onClick={(e) => e.preventDefault()}>
                원본 보기
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="qa" data-tour>
        <div className="qh">
          <span className="qn">1</span>
          <b>메타데이터 매핑</b>
          <span className="qc">6개 항목 · 2개 선택 필요</span>
        </div>
        <div className="inner">
          <div className="scale">
            {SCALE.map((s) => (
              <div key={s.score} className={s.low ? 'lo' : undefined}>
                <b>{s.score}</b>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="tblscroll">
          <table className="mp">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>원본 항목</th>
                <th className="c">유사도</th>
                <th>표준 항목</th>
              </tr>
            </thead>
            <tbody>
              {NEEDS_CHOICE.map((row) => (
                <tr className="rv" key={row.id}>
                  <td>
                    <div className="val">{row.value}</div>
                    <div className="path">{row.path}</div>
                  </td>
                  <td className="cc">
                    <div className="sv">{row.score}</div>
                    <div className="sl">{row.grade}</div>
                  </td>
                  <td>
                    <span className="need">선택 필요</span>
                    <div className="cands cands-tight">
                      {row.options.map(([label, note], i) => (
                        <label key={label}>
                          <input type="radio" name={row.id} defaultChecked={i === 0} />
                          {label}
                          <span className="s3">{note}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="skip">
          <summary>
            <b>자동 확정 4개 항목</b> — 제목, 제공기관, 발행일, 설명 <span className="cv">▾</span>
          </summary>
          <div className="tblscroll">
            <table className="mp">
              <tbody>
                {AUTO_CONFIRMED.map(([value, path, score, std]) => (
                  <tr key={path}>
                    <td>
                      <div className="val">{value}</div>
                      <div className="path">{path}</div>
                    </td>
                    <td className="cc">
                      <div className="sv">{score}</div>
                    </td>
                    <td>
                      <div className="std2">{std}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div className="gauge">
          <span className="gv acc">0.87</span>
          <span className="gl">평균 유사도</span>
          <span className="gtrack">
            <i style={{ width: '87%' }} />
            <u style={{ left: '90%' }} />
          </span>
          <span className="gl">자동 확정 기준 0.90</span>
        </div>
      </div>

      <div className="qa">
        <div className="qh">
          <span className="qn">2</span>
          <b>중복 판정</b>
          <span className="qc">기존 항목과 일치</span>
        </div>
        <div className="inner">
          <div className="diff">
            <div>
              <div className="dh">
                수집 건<small>2026-09-02 06:12</small>
              </div>
              <div className="r2">
                <span className="k2">제목</span>
                <span>어린이집 현황 (시군구별)</span>
              </div>
              <div className="r2">
                <span className="k2">제공기관</span>
                <span>보건복지부</span>
              </div>
              <div className="r2">
                <span className="k2">관리번호</span>
                <span>보건복지부 · 15101471</span>
              </div>
              <div className="r2 diffr">
                <span className="k2">발행일</span>
                <span>
                  <b>2026-08-31</b>
                </span>
              </div>
              <div className="r2 diffr">
                <span className="k2">키워드</span>
                <span>
                  어린이집, 보육, 시군구, <b>정원</b>
                </span>
              </div>
            </div>
            <div>
              <div className="dh">
                기존 카탈로그 항목<small>2026-06-30 등재 · 갱신 4회</small>
              </div>
              <div className="r2">
                <span className="k2">제목</span>
                <span>어린이집 현황 (시군구별)</span>
              </div>
              <div className="r2">
                <span className="k2">제공기관</span>
                <span>보건복지부</span>
              </div>
              <div className="r2">
                <span className="k2">관리번호</span>
                <span>보건복지부 · 15101471</span>
              </div>
              <div className="r2 diffr">
                <span className="k2">발행일</span>
                <span>2026-06-30</span>
              </div>
              <div className="r2 diffr">
                <span className="k2">키워드</span>
                <span>어린이집, 보육, 시군구</span>
              </div>
            </div>
          </div>
          <p className="diff-note">
            음영은 상이 항목입니다. <b className="ink2">기관 관리번호 일치</b>가 동일 데이터 판정의
            1차 근거입니다.
          </p>
        </div>

        <div className="gauge">
          <span className="gv ok">0.94</span>
          <span className="gl">동일 데이터 판정 점수</span>
          <span className="gtrack">
            <i style={{ width: '94%', background: 'var(--ok)' }} />
            <u style={{ left: '90%' }} />
          </span>
          <span className="gl">자동 병합 기준 0.90</span>
        </div>

        <div className="inner pick-sub">
          <div className="pick2">
            <div className="rec">
              <div className="pq">권고</div>
              <div className="pt2">기존 항목에 병합</div>
              <ul>
                <li>
                  발행일 <b>2026-06-30 → 2026-08-31</b> 갱신
                </li>
                <li>
                  키워드에 <b>정원</b> 추가
                </li>
                <li>
                  <b>데이터셋 식별자 유지</b> — 포털 진열·즐겨찾기 참조 보존
                </li>
                <li>
                  기존 <b>연관 데이터 12건 재판정</b>
                </li>
              </ul>
            </div>
            <div>
              <div className="pq">대안</div>
              <div className="pt2">신규 등재</div>
              <ul>
                <li>
                  별개 데이터셋으로 <b>신규 식별자 부여</b>
                </li>
                <li>
                  검색 결과에 <b>동명 항목 2건 노출</b>
                </li>
                <li>
                  관리번호 동일로 <b>차기 수집 시 중복 재검출</b>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="decide">
        <span className="dl">
          선택값·판정자·판정시각이 기록됩니다. 동일 수집원의 같은 항목은 이 선택을 우선 제안합니다.
        </span>
        <button className="btn">반려</button>
        <button className="btn">보류</button>
        <button className="btn p">병합 등재</button>
      </div>
    </main>
  )
}
