import { useState } from 'react'
import type { ScreenProps } from '../App'
import { LINK_CANDIDATES, LINK_GROUPS, PREVIEW_ROWS, REL_TYPES, SNAPSHOTS } from '../data'

const LINK_COUNT = LINK_GROUPS.reduce((n, g) => n + g.items.length, 0)

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
              함께 쓸 수 있는 데이터 <span>{LINK_COUNT}건</span>
            </h3>
            <p className="lgnote">
              결합하거나 비교해 쓸 수 있는 데이터를 <b>관계 유형별로</b> 보여줍니다. 자동 판정으로
              확정 {LINK_COUNT}건, 확신도 0.6~0.85 구간 2건은 검토 대기로 남아 있습니다.
            </p>

            {LINK_GROUPS.map((g) => {
              const t = REL_TYPES[g.type]
              const rows = g.items.map((it) => (
                <div className="sug" key={it.title}>
                  <div className="t">
                    {it.title}
                    {it.sub && <span className="subchip">{it.sub}</span>}
                  </div>
                  <p className="w">{it.reason}</p>
                  <p className="f">
                    {it.provider} · 결합 키 <code className="jk">{it.joinKey}</code> · 신뢰도{' '}
                    <span className="num">{it.score.toFixed(2)}</span>
                  </p>
                  {it.detail && (
                    <details className="jdetail">
                      <summary>판정 상세</summary>
                      <ul>
                        {it.detail.normalize && (
                          <li>
                            <b>값 정규화 필요</b> — {it.detail.normalize}
                          </li>
                        )}
                        {it.detail.unmatched && (
                          <li>
                            <b>미결합 예상</b> — {it.detail.unmatched}
                          </li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              ))

              const head = (
                <>
                  <span className="dot" style={{ background: t.color }} />
                  <span className="gl">{t.label}</span>
                  <span className="gc num">{g.items.length}건</span>
                  <span className="gd">{t.desc}</span>
                </>
              )

              return g.type === 'SAME_KIND' ? (
                <details className="lgroup" key={g.type}>
                  <summary>{head}</summary>
                  {rows}
                </details>
              ) : (
                <div className="lgroup open" key={g.type}>
                  <div className="lhead">{head}</div>
                  {rows}
                </div>
              )
            })}

            <details className="lgroup">
              <summary>
                <span className="dot" style={{ background: 'var(--mut)' }} />
                <span className="gl">관계 미확정 유사 데이터</span>
                <span className="gc num">{LINK_CANDIDATES.length}건</span>
                <span className="gd">의미는 비슷하지만 판정 근거가 부족해 확정하지 않았습니다</span>
              </summary>
              {LINK_CANDIDATES.map((c) => (
                <div className="sug" key={c.title}>
                  <div className="t">{c.title}</div>
                  <p className="f">
                    {c.provider} · 의미 유사도 <span className="num">{c.sim.toFixed(2)}</span>
                  </p>
                </div>
              ))}
            </details>

            <div className="lgfoot">
              <button className="btn sm">연계 데이터 CSV</button>
              <button className="btn sm">연동 API 복사</button>
            </div>
          </div>

          <div className="card side bound" data-tour-boundary>
            <h3>판정까지가 이 포털의 몫입니다</h3>
            <p className="boundtx">
              이 화면은 <b>결합 키 · 값 정규화 필요 여부 · 미결합 예상</b>까지 판정해 전달합니다.
              실제 결합 실행과 지표 계산은 이 판정을 받아 포털의 데이터 결합 기능이 수행합니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
