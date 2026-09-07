// 데모용 목 데이터. 실제 시스템의 응답 형태를 재현한다.

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

/** 결합 결과 — 어린이집 수, 0~4세 인구에서 1천 명당 값을 계산 */
const RAW: [string, number, number][] = [
  ['경기도 성남시', 412, 28140],
  ['경기도 수원시', 508, 41320],
  ['서울특별시 송파구', 297, 24880],
  ['서울특별시 강남구', 213, 19640],
  ['부산광역시 해운대구', 186, 15720],
  ['인천광역시 서구', 344, 23050],
  ['대구광역시 수성구', 168, 14310],
  ['경기도 용인시', 441, 33470],
]

export type MetricRow = {
  area: string
  facilities: number
  population: number
  per1k: number
}

export const METRIC_ROWS: MetricRow[] = RAW.map(([area, facilities, population]) => ({
  area,
  facilities,
  population,
  per1k: Number(((facilities / population) * 1000).toFixed(1)),
}))

export const NATIONAL_AVG = 13.2

/** 관계 지도 — 노드 종류 */
export const NODE_KINDS = {
  1: { name: '개체 목록', color: 'var(--n1)' },
  2: { name: '집계 통계', color: 'var(--n2)' },
  3: { name: '코드·기준표', color: 'var(--n3)' },
} as const

export type NodeKind = keyof typeof NODE_KINDS
export type RelationGroup = 'join' | 'same' | 'co'

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
  groups?: RelationGroup[]
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
    kind: 3, ring: 1, angle: 0, via: 'anchor', groups: ['join'],
    how: '지역 이름과 코드를 서로 바꿔주는 자료입니다. 이걸 거치면 통계청 자료와 붙습니다.',
  },
  {
    id: 'use', name: '어린이집 이용 현황', org: '보건복지부', rows: '229행',
    kind: 2, ring: 1, angle: 62, via: 'anchor', groups: ['join'],
    how: '이 목록을 시군구별로 집계한 자료입니다. 숫자가 맞는지 확인하거나 추세를 볼 때 씁니다.',
  },
  {
    id: 'kinder', name: '유치원 현황', org: '교육부', rows: '8,441행',
    kind: 1, ring: 1, angle: 124, via: 'anchor', groups: ['co'],
    how: '이 데이터를 받은 분들 412명이 함께 받았습니다. 보육과 교육 수요를 같이 볼 때 씁니다.',
  },
  {
    id: 'local', name: '지역별 어린이집 현황 103건', org: '각 지자체', rows: '묶음',
    kind: 1, ring: 1, angle: 180, via: 'anchor', groups: ['same'],
    how: '항목 구성이 같은 지역별 자료 103건입니다. 한 지역만 필요하면 이쪽이 가볍습니다.',
  },
  {
    id: 'api', name: '같은 자료 오픈API', org: '한국사회보장정보원', rows: '동일 항목',
    kind: 1, ring: 1, angle: 236, via: 'anchor', groups: ['same'],
    how: '내용은 같고 받는 방법만 다릅니다. 매일 자동으로 받아가려면 이쪽입니다.',
  },
  {
    id: 'staff', name: '어린이집 교직원 현황', org: '한국사회보장정보원', rows: '39,412행',
    kind: 1, ring: 1, angle: 298, via: 'anchor', groups: ['join', 'co'],
    how: '같은 시설코드를 쓰고 있어 시설 하나하나 바로 붙습니다. 교사 1인당 아동 수가 나옵니다.',
  },

  {
    id: 'pop', name: '주민등록인구 (연령별·시군구)', org: '국가통계포털', rows: '매월 갱신',
    kind: 2, ring: 2, angle: -22, via: 'code', groups: ['join'],
    how: '직접은 붙지 않습니다. 지역 표기가 이 자료는 ‘경기도 성남시’, 어린이집 자료는 ‘성남시’로 달라서입니다. 법정동 코드를 거치면 붙습니다.',
  },
  {
    id: 'birth', name: '시군구별 출생아 수', org: '국가통계포털', rows: '연 1회',
    kind: 2, ring: 2, angle: 22, via: 'code', groups: ['join'],
    how: '법정동 코드를 거쳐 붙습니다. 앞으로의 수요 증감을 볼 때 씁니다.',
  },
  {
    id: 'childstat', name: '보육통계 (시도·연도)', org: '국가통계포털', rows: '연 1회',
    kind: 2, ring: 2, angle: 74, via: 'use', groups: ['join'],
    how: '이용 현황을 다시 시도 단위로 묶은 자료입니다. 전국 추세를 볼 때 씁니다.',
  },
  {
    id: 'eval', name: '어린이집 평가 결과', org: '한국보육진흥원', rows: '36,890행',
    kind: 1, ring: 2, angle: 310, via: 'staff', groups: ['join'],
    how: '교직원 현황을 거쳐 시설코드로 붙습니다. 평가 등급과 교사 수를 함께 볼 수 있습니다.',
  },
]

/** 고리 반지름 — ring 인덱스로 참조 */
export const RING_RADIUS = [0, 132, 258]

export const GRAPH_FILTERS: { key: 'all' | RelationGroup; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'join', label: '합칠 수 있는 것' },
  { key: 'same', label: '같은 자료 다른 판' },
  { key: 'co', label: '함께 쓰인 것' },
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
