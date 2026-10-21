// 데모용 목 데이터. 실제 시스템의 응답 형태를 재현한다.
// 관계 유형·묶음 이름·판정 흐름은 실제 설계값(관계 유형 정의서 4종 + 하위라벨)을 따른다.

/** 데이터 미리보기 — 파일 시점별 */
export const SNAPSHOTS = [
  { date: '2026-05-29', label: '2026-05-29 (최신)', rows: '39,412행 · 11개 항목' },
  { date: '2025-05-30', label: '2025-05-30', rows: '39,187행 · 11개 항목' },
  { date: '2024-06-10', label: '2024-06-10', rows: '38,904행 · 10개 항목' },
] as const

export const PREVIEW_ROWS = [
  ['경기도', '성남시', '햇살어린이집', '민간', 99, 87, '분당구 판교로 –'],
  ['경기도', '성남시', '성남시립 하늘어린이집', '국공립', 120, 118, '수정구 산성대로 –'],
  ['경기도', '수원시', '영통구립 별빛어린이집', '국공립', 86, 80, '영통구 봉영로 –'],
  ['서울특별시', '송파구', '가락 푸른숲어린이집', '가정', 20, 19, '송파구 가락로 –'],
  ['서울특별시', '강남구', '대치 아이사랑어린이집', '민간', 64, 51, '강남구 도곡로 –'],
  ['부산광역시', '해운대구', '반송 해맑은어린이집', '사회복지법인', 75, 69, '해운대구 반송로 –'],
  ['인천광역시', '서구', '청라 하나어린이집', '민간', 110, 104, '서구 청라대로 –'],
  ['대구광역시', '수성구', '범어 어울림어린이집', '국공립', 92, 90, '수성구 달구벌대로 –'],
] as const

/** 관계 유형 4종 — 코드·묶음 이름·안내문은 실제 서비스 응답과 동일 */
export type RelKey = 'DETAIL_FOR' | 'STATISTIC_FOR' | 'ADJACENT_TO' | 'SAME_KIND'

export const REL_TYPES: Record<
  RelKey,
  { label: string; desc: string; color: string }
> = {
  DETAIL_FOR: { label: '속성 보완', desc: '같은 대상의 다른 정보', color: 'var(--rel-d)' },
  STATISTIC_FOR: { label: '집계 맥락', desc: '비교 기준이 되는 통계', color: 'var(--rel-s)' },
  ADJACENT_TO: { label: '인접 맥락', desc: '이어서 보면 좋은 관련 데이터', color: 'var(--rel-a)' },
  SAME_KIND: { label: '동종 판본', desc: '같은 종류의 다른 지역·기관 데이터', color: 'var(--rel-k)' },
}

export const REL_ORDER: RelKey[] = ['DETAIL_FOR', 'STATISTIC_FOR', 'ADJACENT_TO', 'SAME_KIND']

/** 데이터 상세의 "함께 쓸 수 있는 데이터" — 확정 관계를 유형별로 묶는다 */
export type LinkItem = {
  title: string
  provider: string
  /** 하위라벨 — 유형 안에서 왜 나왔는지 */
  sub: string
  /** '기준 컬럼 = 상대 컬럼' (같은 이름이면 하나) */
  joinKey: string
  score: number
  reason: string
  /** 판정 상세 — 결합 키 외에 전달되는 것 */
  detail?: { normalize?: string; unmatched?: string }
}

export const LINK_GROUPS: { type: RelKey; items: LinkItem[] }[] = [
  {
    type: 'DETAIL_FOR',
    items: [
      {
        title: '어린이집 교직원 현황',
        provider: '한국사회보장정보원',
        sub: '',
        joinKey: '시설코드',
        score: 0.94,
        reason: '같은 시설코드를 쓰고 있어 시설 단위로 바로 붙습니다. 교사 1인당 아동 수가 나옵니다.',
      },
      {
        title: '어린이집 평가 결과',
        provider: '한국보육진흥원',
        sub: '',
        joinKey: '시설코드',
        score: 0.88,
        reason: '평가 등급을 시설 목록에 열로 붙여 볼 수 있습니다.',
      },
    ],
  },
  {
    type: 'STATISTIC_FOR',
    items: [
      {
        title: '주민등록인구 (연령별·시군구)',
        provider: '국가통계포털',
        sub: '분모',
        joinKey: '시군구 = 행정구역(시군구)',
        score: 0.9,
        reason: '영유아 1천 명당 어린이집 수의 분모가 됩니다.',
        detail: {
          normalize:
            '지역 표기가 다릅니다 — 이 자료는 ‘성남시’, 인구 자료는 ‘경기도 성남시’. 법정동 코드를 거쳐 같은 지역으로 묶입니다.',
          unmatched: '3곳(세종·옹진·울릉)은 구분 단위가 달라 결합에서 빠질 것으로 예상됩니다.',
        },
      },
      {
        title: '어린이집 이용 현황',
        provider: '보건복지부',
        sub: '비교 기준',
        joinKey: '시군구',
        score: 0.87,
        reason: '이 목록을 시군구별로 집계한 자료입니다. 숫자 검증과 추세 확인에 씁니다.',
      },
      {
        title: '시군구별 출생아 수',
        provider: '국가통계포털',
        sub: '분모',
        joinKey: '시군구 = 행정구역별',
        score: 0.84,
        reason: '앞으로의 수요 증감을 볼 때 씁니다.',
      },
    ],
  },
  {
    type: 'ADJACENT_TO',
    items: [
      {
        title: '유치원 현황',
        provider: '교육부',
        sub: '다음 단계',
        joinKey: '시군구',
        score: 0.81,
        reason: '보육에서 교육으로 이어지는 다음 생애 단계입니다. 수요를 같이 볼 때 씁니다.',
      },
      {
        title: '지역아동센터 현황',
        provider: '보건복지부',
        sub: '관련 주제',
        joinKey: '시군구',
        score: 0.74,
        reason: '방과후 돌봄 수요를 함께 볼 때 씁니다.',
      },
    ],
  },
  {
    type: 'SAME_KIND',
    items: [
      {
        title: '같은 자료 오픈API',
        provider: '한국사회보장정보원',
        sub: '제공 채널',
        joinKey: '항목 동일',
        score: 0.98,
        reason: '내용은 같고 받는 방법만 다릅니다. 매일 자동으로 받아가려면 이쪽입니다.',
      },
      {
        title: '지역별 어린이집 현황 103건',
        provider: '각 지자체',
        sub: '지역',
        joinKey: '항목 구성 동일',
        score: 0.96,
        reason: '전국 통합본이 대표입니다. 한 지역만 필요하면 해당 지자체 자료가 가볍습니다.',
      },
      {
        title: '전국 직장어린이집 현황',
        provider: '근로복지공단',
        sub: '하위 유형',
        joinKey: '항목 구성 동일',
        score: 0.89,
        reason: '사업장 내 설치 어린이집만 따로 모은 판본입니다.',
      },
    ],
  },
]

/** 의미는 비슷하지만 아직 판정되지 않은 후보 — 관계 생성이 판정하며 근거가 부족하면 여기 남는다 */
export const LINK_CANDIDATES: { title: string; provider: string; sim: number }[] = [
  { title: '전국 어린이놀이시설 현황', provider: '행정안전부', sim: 0.64 },
  { title: '아동복지시설 현황', provider: '보건복지부', sim: 0.61 },
]

/** 관계 지도 — 노드 종류 */
export const NODE_KINDS = {
  1: { name: '개체 목록', color: 'var(--n1)' },
  2: { name: '집계 통계', color: 'var(--n2)' },
  3: { name: '코드·기준표', color: 'var(--n3)' },
} as const

export type NodeKind = keyof typeof NODE_KINDS

export type GraphNode = {
  id: string
  name: string
  org: string
  rows: string
  /** 자료 성격 */
  kind: NodeKind
  /** 기준 데이터셋에서 몇 단계 떨어졌는가 (0 = 기준) */
  ring: 0 | 1 | 2
  /** 배치 각도(도) */
  angle: number
  /** 이 노드로 오는 직전 경유 노드 */
  via?: string
  /** 기준 데이터셋과의 관계 유형 (결합 다리 노드는 없음) */
  rel?: RelKey
  /** 하위라벨 */
  sub?: string
  /** 결합 키 — '기준 컬럼 = 상대 컬럼' */
  joinKey?: string
  /** 판정 신뢰도 */
  score?: number
  /** 다른 데이터를 잇는 변환표 (JOIN_KEY.bridge) */
  bridge?: boolean
  /** 어떻게 이어지는지 — 사용자에게 보이는 설명 */
  how?: string
}

export const GRAPH_NODES: GraphNode[] = [
  {
    id: 'anchor', name: '전국 어린이집 통합 현황', org: '한국사회보장정보원',
    rows: '39,412행', kind: 1, ring: 0, angle: 0,
  },

  {
    id: 'code', name: '법정동 코드 연계정보', org: '행정안전부', rows: '20,560행',
    kind: 3, ring: 1, angle: 0, via: 'anchor', bridge: true, joinKey: '시군구 = 법정동명',
    how: '지역 이름과 코드를 서로 바꿔주는 변환표입니다. 이걸 거치면 표기가 다른 통계청 자료와 붙습니다.',
  },
  {
    id: 'use', name: '어린이집 이용 현황', org: '보건복지부', rows: '229행',
    kind: 2, ring: 1, angle: 62, via: 'anchor',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '시군구', score: 0.87,
    how: '이 목록을 시군구별로 집계한 자료입니다. 숫자가 맞는지 확인하거나 추세를 볼 때 씁니다.',
  },
  {
    id: 'kinder', name: '유치원 현황', org: '교육부', rows: '8,441행',
    kind: 1, ring: 1, angle: 124, via: 'anchor',
    rel: 'ADJACENT_TO', sub: '다음 단계', joinKey: '시군구', score: 0.81,
    how: '보육에서 교육으로 이어지는 다음 생애 단계 데이터입니다. 수요를 같이 볼 때 씁니다.',
  },
  {
    id: 'local', name: '지역별 어린이집 현황 103건', org: '각 지자체', rows: '묶음',
    kind: 1, ring: 1, angle: 180, via: 'anchor',
    rel: 'SAME_KIND', sub: '지역', joinKey: '항목 구성 동일', score: 0.96,
    how: '항목 구성이 같은 지역별 판본 103건입니다. 한 지역만 필요하면 이쪽이 가볍습니다.',
  },
  {
    id: 'api', name: '같은 자료 오픈API', org: '한국사회보장정보원', rows: '동일 항목',
    kind: 1, ring: 1, angle: 236, via: 'anchor',
    rel: 'SAME_KIND', sub: '제공 채널', joinKey: '항목 동일', score: 0.98,
    how: '내용은 같고 받는 방법만 다릅니다. 매일 자동으로 받아가려면 이쪽입니다.',
  },
  {
    id: 'staff', name: '어린이집 교직원 현황', org: '한국사회보장정보원', rows: '39,412행',
    kind: 1, ring: 1, angle: 298, via: 'anchor',
    rel: 'DETAIL_FOR', joinKey: '시설코드', score: 0.94,
    how: '같은 시설코드를 쓰고 있어 시설 하나하나 바로 붙습니다. 교사 1인당 아동 수가 나옵니다.',
  },

  {
    id: 'pop', name: '주민등록인구 (연령별·시군구)', org: '국가통계포털', rows: '매월 갱신',
    kind: 2, ring: 2, angle: -22, via: 'code',
    rel: 'STATISTIC_FOR', sub: '분모', joinKey: '시군구 = 행정구역(시군구)', score: 0.9,
    how: '직접은 붙지 않습니다. 지역 표기가 이 자료는 ‘경기도 성남시’, 어린이집 자료는 ‘성남시’로 달라서입니다. 법정동 코드를 거치면 붙습니다.',
  },
  {
    id: 'birth', name: '시군구별 출생아 수', org: '국가통계포털', rows: '연 1회',
    kind: 2, ring: 2, angle: 22, via: 'code',
    rel: 'STATISTIC_FOR', sub: '분모', joinKey: '시군구 = 행정구역별', score: 0.84,
    how: '법정동 코드를 거쳐 붙습니다. 앞으로의 수요 증감을 볼 때 씁니다.',
  },
  {
    id: 'childstat', name: '보육통계 (시도·연도)', org: '국가통계포털', rows: '연 1회',
    kind: 2, ring: 2, angle: 74, via: 'use',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '시도', score: 0.82,
    how: '이용 현황을 다시 시도 단위로 묶은 자료입니다. 전국 추세를 볼 때 씁니다.',
  },
  {
    id: 'eval', name: '어린이집 평가 결과', org: '한국보육진흥원', rows: '36,890행',
    kind: 1, ring: 2, angle: 310, via: 'staff',
    rel: 'DETAIL_FOR', joinKey: '시설코드', score: 0.88,
    how: '교직원 현황을 거쳐 시설코드로 붙습니다. 평가 등급과 교사 수를 함께 볼 수 있습니다.',
  },
]

/** 고리 반지름 — ring 인덱스로 참조 */
export const RING_RADIUS = [0, 132, 258]

export const GRAPH_FILTERS: { key: 'all' | RelKey; label: string }[] = [
  { key: 'all', label: '전체' },
  ...REL_ORDER.map((key) => ({ key, label: REL_TYPES[key].label })),
]

/** 수집 실행 이력 */
export type RunState = 'done' | 'wait' | 'run' | 'fail'

export const INGEST_RUNS: {
  at: string
  source: string
  target: string
  count: number
  state: RunState
  stateLabel: string
  action?: string
}[] = [
  { at: '06:00', source: '공공데이터포털', target: '표준데이터셋 목록', count: 300, state: 'done', stateLabel: '완료', action: '상세' },
  { at: '06:04', source: '공공데이터포털', target: '파일데이터 목록', count: 842, state: 'done', stateLabel: '완료', action: '상세' },
  { at: '06:12', source: '국가통계포털', target: '통계표 목록', count: 109, state: 'wait', stateLabel: '검토 대기 37', action: '검토' },
  { at: '06:18', source: '국가통계포털', target: '통계표 상세 설명', count: 25, state: 'run', stateLabel: '매핑 중' },
  { at: '06:21', source: '공공데이터포털', target: '오픈API 목록', count: 8, state: 'fail', stateLabel: '실패', action: '오류 상세' },
]

export const PIPELINE = [
  { label: '수집', count: '1,284' },
  { label: '매핑', count: '1,284' },
  { label: '검토 대기', count: '37', hit: true },
  { label: '등재', count: '1,239' },
]
