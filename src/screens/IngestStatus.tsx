import type { ScreenProps } from '../App'
import { INGEST_RUNS, PIPELINE } from '../data'

export default function IngestStatus({ go }: ScreenProps) {
  return (
    <main className="wrap">
      <h1 className="pg">수집 현황</h1>
      <p className="crumb mb20">수집 작업의 처리 단계별 현황과 실행 이력</p>

      <div className="card mb22">
        <div className="pipe" data-tour>
          {PIPELINE.map((p) => (
            <div className={p.hit ? 'pst hit' : 'pst'} key={p.label}>
              <div className="pt">{p.label}</div>
              <div className="pc num">{p.count}</div>
            </div>
          ))}
        </div>
        <div className="pad ingest-sum">
          <span>
            자동 확정률 <b className="num ok">96.5%</b>{' '}
            <span className="num mut">(1,239 / 1,284)</span>
          </span>
          <span className="mut">실패 8</span>
          <span className="sp" />
          <button className="btn p sm" onClick={() => go('v7')}>
            검토 대기 37건
          </button>
        </div>
      </div>

      <h3 className="h3s">실행 이력</h3>
      <div className="tblbox">
        <div className="tblscroll">
          <table className="dt">
            <thead>
              <tr>
                <th>실행시각</th>
                <th>수집원</th>
                <th>대상</th>
                <th className="n">건수</th>
                <th>상태</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {INGEST_RUNS.map((r) => (
                <tr key={r.at}>
                  <td>{r.at}</td>
                  <td>{r.source}</td>
                  <td>{r.target}</td>
                  <td className="n">{r.count}</td>
                  <td>
                    <span className={`st ${r.state}`}>{r.stateLabel}</span>
                  </td>
                  <td>
                    {r.action &&
                      (r.state === 'wait' ? (
                        <button className="btn p sm" onClick={() => go('v7')}>
                          {r.action}
                        </button>
                      ) : (
                        <button className="btn sm">{r.action}</button>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="note-sm">
        재수집 시점은 데이터셋의 갱신 주기와 차기 등록 예정일로 판단합니다. 전량 조회 없이 예정일
        경과분만 대상으로 합니다.
      </p>
    </main>
  )
}
