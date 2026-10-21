import { byId, ORGS } from '../data'
import { DatasetResultCard, type Go } from '../parts'

type Props = { go: Go; orgId?: string }

/** 실증 기관 — 기관 보유 데이터를 고르면 상세에서 함께 쓸 외부 데이터를 본다 */
export default function Org({ go, orgId }: Props) {
  const org = ORGS.find((o) => o.id === orgId) ?? ORGS[0]

  return (
    <div className="portal">
      <div className="p-wrap">
        <div className="p-orgtabs" role="tablist">
          {ORGS.map((o) => (
            <a
              key={o.id}
              href="#"
              className={`p-chip ${o.id === org.id ? 'on' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                go('org', o.id)
              }}
            >
              {o.name}
            </a>
          ))}
        </div>

        <section className="p-card p-org-head">
          <h1>{org.name}</h1>
          <p>{org.summary}</p>
        </section>
        <div className="p-result-head">
          <span className="t">
            보유 데이터 <b className="num">{org.datasets.length}</b>건 — 데이터를 열면 함께 쓸 수 있는 외부 데이터를 볼 수 있습니다
          </span>
        </div>
        <div className="p-results">
          {org.datasets.map((id) => (
            <DatasetResultCard key={id} d={byId[id]} go={go} />
          ))}
        </div>
      </div>
    </div>
  )
}
