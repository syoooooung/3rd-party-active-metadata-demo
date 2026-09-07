import type { ScreenProps } from '../App'

const LEFT = [
  { icon: '◆', label: '시군구', cls: 'key' },
  { icon: '✓', label: '어린이집명', cls: 'use', agg: '개수 세기' },
  { icon: '·', label: '설립유형' },
  { icon: '·', label: '정원' },
  { icon: '·', label: '현원' },
]

const RIGHT = [
  { icon: '◆', label: '행정구역(시군구)', cls: 'key' },
  { icon: '✓', label: '0~4세 인구', cls: 'use', agg: '합계' },
  { icon: '·', label: '5~9세 인구' },
  { icon: '·', label: '총인구' },
]

function ColumnList({ items }: { items: typeof LEFT }) {
  return (
    <div className="cols-l">
      {items.map((c) => (
        <div className={c.cls ? `cl ${c.cls}` : 'cl'} key={c.label}>
          <span className="ic">{c.icon}</span>
          {c.label}
          {c.agg && <span className="agg">{c.agg}</span>}
        </div>
      ))}
    </div>
  )
}

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
        › 데이터 합치기
      </p>
      <h1 className="pg">데이터 합치기</h1>
      <p className="crumb mb18">두 자료를 같은 기준으로 묶어 새 표를 만듭니다.</p>

      <div className="card" data-tour>
        <div className="pad">
          <div className="mix">
            <div className="slot b">
              <div className="sh">
                <div className="n">전국 어린이집 통합 현황</div>
                <div className="o">한국사회보장정보원 · 39,412행</div>
              </div>
              <ColumnList items={LEFT} />
            </div>

            <div className="join">
              <span className="k">시군구 기준</span>
              <div className="ln" />
              <p className="l">
                229개 시군구가
                <br />
                양쪽 모두에 있습니다
              </p>
            </div>

            <div className="slot b">
              <div className="sh">
                <div className="n">주민등록인구 (연령별·시군구)</div>
                <div className="o">국가통계포털 · 2026-04 기준</div>
              </div>
              <ColumnList items={RIGHT} />
            </div>
          </div>

          <div className="note">
            <b>지역 이름 표기를 맞췄습니다.</b> 어린이집 자료는 <span className="num">성남시</span>,
            인구 자료는 <span className="num">경기도 성남시</span>로 적혀 있어 자동으로 같은 지역으로
            묶었습니다. 묶이지 않은 지역 <span className="num">3곳</span>은 결과에서 빠집니다.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              어디인지 보기
            </a>
          </div>
        </div>

        <div className="mkrow">
          <span className="lb">만들 값</span>
          <select defaultValue="영유아 1천 명당 어린이집 수">
            <option>영유아 1천 명당 어린이집 수</option>
            <option>어린이집 1개소당 영유아 수</option>
            <option>어린이집 정원 대비 영유아 수</option>
          </select>
          <span className="lb">묶는 단위</span>
          <select defaultValue="시군구">
            <option>시군구</option>
            <option>시도</option>
          </select>
          <span className="sp" />
          <button className="btn" onClick={() => go('v2')}>
            취소
          </button>
          <button className="btn p" onClick={() => go('v4')}>
            합치기
          </button>
        </div>
      </div>
    </main>
  )
}
