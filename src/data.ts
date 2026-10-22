// 데모용 목 데이터. 실제 포털(workflow-ui)의 API 응답 형태를 재현한다.
// 관계 유형·묶음 이름·판정 흐름·기관 구성은 실제 운영 화면과 동일하고, 수치·판정 결과는 목업이다.

/** 관계 유형 4종 — 코드·묶음 이름·안내문·색은 실제 서비스와 동일 */
export type RelKey = 'DETAIL_FOR' | 'STATISTIC_FOR' | 'ADJACENT_TO' | 'SAME_KIND'

export const REL_TYPES: Record<RelKey, { label: string; desc: string; color: string }> = {
  DETAIL_FOR: { label: '속성 보완', desc: '같은 대상의 다른 정보', color: '#3b4fd8' },
  STATISTIC_FOR: { label: '집계 맥락', desc: '비교 기준이 되는 통계', color: '#0f9f6e' },
  ADJACENT_TO: { label: '인접 맥락', desc: '이어서 보면 좋은 관련 데이터', color: '#d97706' },
  SAME_KIND: { label: '동종 판본', desc: '같은 종류의 다른 지역·기관 데이터', color: '#64748b' },
}

export const REL_ORDER: RelKey[] = ['DETAIL_FOR', 'STATISTIC_FOR', 'ADJACENT_TO', 'SAME_KIND']

/** 대분류 색 — 분류 경로·타일에 같은 색. 채도·명도를 맞춘 한 벌(Open Color 계열) */
export const MAJOR_COLOR: Record<string, string> = {
  과학: '#3b5bdb',
  기술: '#0b7285',
  인문: '#6741d9',
  사회: '#d9480f',
  교육: '#2b8a3e',
  의료: '#c92a2a',
  문화: '#a61e4d',
}

export const SEP = ' > '
export const majorOf = (c: string) => c.split(SEP)[0]
export const minorOf = (c: string) => c.split(SEP)[1] ?? ''

/** 분야별 건수 — 디지털 집현전 7대분류 */
export const TAXONOMY: { name: string; count: number; children: [string, number][] }[] = [
  { name: '과학', count: 162, children: [['수학', 8], ['물리학', 12], ['화학', 9], ['생명과학', 71], ['지구과학', 24], ['통계학', 38]] },
  { name: '기술', count: 597, children: [['인공지능·컴퓨팅', 214], ['소프트웨어', 102], ['전기·전자', 64], ['기계', 41], ['건설·교통', 176]] },
  { name: '인문', count: 62, children: [['역사', 21], ['언어', 14], ['철학', 6], ['문학', 21]] },
  { name: '사회', count: 4931, children: [['사회복지', 1420], ['행정', 1103], ['경제', 876], ['법률', 312], ['노동', 489], ['인구', 731]] },
  { name: '교육', count: 752, children: [['유아교육', 118], ['초중등교육', 294], ['고등교육', 187], ['평생교육', 153]] },
  {
    name: '의료', count: 5225,
    children: [['의학', 1540], ['치의학', 125], ['한의학', 107], ['약학', 219], ['간호학', 42], ['공중보건', 3542], ['질병관리', 1356], ['건강검진', 149], ['재활', 57], ['요양', 204], ['의료공학', 404], ['의약품', 351]],
  },
  {
    name: '문화', count: 337,
    children: [['방송·미디어', 251], ['축제·전시', 42], ['스포츠', 19], ['게임·오락', 7], ['디자인', 7], ['미술', 4], ['영상·영화', 3], ['음악', 3]],
  },
]

export const STATS = { datasets: 7470, relations: 110, providers: 369 }

export const PROVIDERS = [
  '국립암센터', '보건복지부', '건강보험심사평가원', '국민건강보험공단',
  'B대학병원', 'B대학병원 분원',
  'A방송사', '한국방송광고진흥공사', '방송미디어통신위원회', '통계청',
]

/** 데이터셋 카드 */
export type Dataset = {
  id: string
  name: string
  provider: string
  party: '1st' | '3rd'
  /** 출처 배지 문구 */
  source: string
  categories: string[]
  cols: number
  rows: number
  created: string
  summary: string
  keywords: string[]
  columns?: string[]
}

export const DATASETS: Dataset[] = [
  // ── B대학병원 (기관 보유) ──
  {
    id: 'icu-bio', name: '중환자 생체신호 빅데이터', provider: 'B대학병원', party: '1st', source: '기관 보유',
    categories: ['의료 > 의학', '의료 > 의료공학', '기술 > 인공지능·컴퓨팅'], cols: 0, rows: 0, created: '2026-10-13',
    summary:
      '중환자 특화 생체신호 빅데이터. 중환자실 환자 모니터링 기기로부터 수집한 생체신호데이터(수치형, 열거형, 파형 데이터). 수집기간: 2024.01.01.~2026.05.09. 환자수: 약 9,800. 테이블 6개, 컬럼 102개. 업데이트 주기: 매주.',
    keywords: ['ICU', '생체신호', '모니터링', '파형데이터'],
  },
  {
    id: 'kcure', name: 'K-CURE 암환자 데이터셋', provider: 'B대학병원', party: '1st', source: '기관 보유',
    categories: ['의료 > 의학', '의료 > 질병관리'], cols: 0, rows: 0, created: '2026-10-13',
    summary:
      '병원 임상 데이터를 이용하여 표준화된 K-CURE 규격으로 변환한 데이터셋(간암, 위암, 췌장암, 신장암). 수집기간: 2010.01.01.~2024.12.31. 환자수: 약 42,000. 테이블 72개, 컬럼 1,180개. 업데이트 주기: 연 1회 적재.',
    keywords: ['K-CURE', '암', '표준화', '임상데이터'],
  },
  {
    id: 'cancer-lib', name: '암 임상 데이터 라이브러리', provider: 'B대학병원', party: '1st', source: '기관 보유',
    categories: ['의료 > 의학', '의료 > 질병관리'], cols: 0, rows: 0, created: '2026-10-13',
    summary:
      '병원이 보유한 11개 암종 환자의 진단·치료·예후 정보를 암종별 라이브러리와 레지스트리로 표준화해 구축한 임상 데이터. 테이블 90여 개. 업데이트 주기: 분기.',
    keywords: ['암종별', '레지스트리', '예후'],
  },
  {
    id: 'cdw', name: '임상 데이터 웨어하우스 핵심 테이블', provider: 'B대학병원', party: '1st', source: '기관 보유',
    categories: ['의료 > 의학', '의료 > 의료공학'], cols: 0, rows: 0, created: '2026-10-13',
    summary:
      '임상 데이터 웨어하우스 핵심 테이블. 진단·처방·검사 결과를 환자 단위로 통합한 연구용 데이터. 가명화 환자번호로 원내 데이터와 연결된다.',
    keywords: ['CDW', '진단', '처방', '검사'],
  },
  {
    id: 'ecg', name: '안정시 심전도 검사', provider: 'B대학병원', party: '1st', source: '기관 보유',
    categories: ['의료 > 의학', '의료 > 건강검진', '기술 > 인공지능·컴퓨팅'], cols: 0, rows: 0, created: '2026-10-13',
    summary: '안정시 심전도(Rest-ECG) 검사 파형·판독 결과. AI 판독 모델 학습용으로 정제된 데이터.',
    keywords: ['심전도', 'ECG', 'AI판독'],
  },
  {
    id: 'meta-life', name: '대사증후군 환자 라이프로그', provider: 'B대학병원 분원', party: '1st', source: '기관 보유',
    categories: ['의료 > 질병관리', '의료 > 공중보건'], cols: 0, rows: 0, created: '2026-10-13',
    summary: '대사증후군 환자의 활동량·수면·심박 라이프로그. 웨어러블 기기로 수집해 주 단위로 집계한 데이터.',
    keywords: ['라이프로그', '대사증후군', '웨어러블'],
  },
  {
    id: 'diab-life', name: '당뇨환자 라이프로그 데이터', provider: 'B대학병원 분원', party: '1st', source: '기관 보유',
    categories: ['의료 > 질병관리', '의료 > 공중보건'], cols: 0, rows: 0, created: '2026-10-13',
    summary: '당뇨 환자의 혈당·활동량·식이 라이프로그. 대사증후군 라이프로그와 같은 수집 체계를 쓴다.',
    keywords: ['라이프로그', '당뇨', '혈당'],
  },
  {
    id: 'cohort', name: '코호트 데이터베이스', provider: 'B대학병원 분원', party: '1st', source: '기관 보유',
    categories: ['의료 > 공중보건', '의료 > 질병관리', '과학 > 통계학'], cols: 0, rows: 0, created: '2026-10-13',
    summary: '지역사회 기반 추적 관찰 코호트 데이터베이스. 기반 조사와 반복 추적 조사로 구성된다.',
    keywords: ['코호트', '추적관찰', '역학'],
  },

  // ── 외부 개방 (의료) ──
  {
    id: 'cancer-stat', name: '암 발생 지표 정보제공 서비스', provider: '국립암센터', party: '3rd', source: '공공데이터포털',
    categories: ['의료 > 질병관리'], cols: 12, rows: 18240, created: '2026-09-02',
    summary: '국가 암등록통계 기반 암 발생 지표. 연도·성별·연령군·암종별 발생자수와 발생률을 제공한다.',
    keywords: ['암등록통계', '발생률', '국가통계'],
  },
  {
    id: 'prev24', name: '24개 암종/성/연령(5세)별 5년 암유병자수, 유병률', provider: '보건복지부', party: '3rd', source: '공공데이터포털',
    categories: ['의료 > 질병관리'], cols: 9, rows: 4320, created: '2026-09-02',
    summary: '24개 암종을 성·연령(5세 구간)별로 집계한 5년 암유병자수와 유병률.',
    keywords: ['암유병률', '암종별', '연령별'],
  },
  {
    id: 'lung-cnt', name: '폐암 라이브러리 환자수', provider: '국립암센터', party: '3rd', source: '공공데이터포털',
    categories: ['의료 > 질병관리'], cols: 6, rows: 264, created: '2026-09-02',
    summary: '국립암센터 폐암 라이브러리의 연도별·성별·연령대별 환자 수 통계.',
    keywords: ['폐암', '환자수', '라이브러리'],
  },
  {
    id: 'hira-org', name: '요양기관 개설현황', provider: '건강보험심사평가원', party: '3rd', source: '보건의료빅데이터',
    categories: ['의료 > 요양'], cols: 21, rows: 103309, created: '2026-09-02',
    summary: '전국 요양기관의 개설·폐업 현황. 기관 종별·지역별 분포와 영업 상태를 담는다.',
    keywords: ['요양기관', '개설', '폐업'],
  },

  // ── A방송사 (기관 보유) ──
  {
    id: 'drama-prog', name: '드라마 프로그램 정보', provider: 'A방송사', party: '1st', source: '기관 보유',
    categories: ['문화 > 방송·미디어'], cols: 9, rows: 24, created: '2026-10-13',
    summary:
      '자사 드라마 프로그램 24편의 장르, 시청연령, 방영기간, 출연진, 검색키워드, 줄거리. program_id 로 회차·출연진 데이터와 연결된다.',
    keywords: ['드라마', '프로그램', '편성'],
    columns: ['program_id', '프로그램명', '장르', '시청연령', '방영시작일', '방영종료일', '출연진', '검색키워드', '줄거리'],
  },
  {
    id: 'drama-ep', name: '드라마 회차 정보', provider: 'A방송사', party: '1st', source: '기관 보유',
    categories: ['문화 > 방송·미디어'], cols: 8, rows: 312, created: '2026-10-13',
    summary: '드라마 24편의 회차별 제목, 재생시간, 시청연령, 줄거리. program_id 로 프로그램과 연결된다.',
    keywords: ['드라마', '회차', 'VOD'],
    columns: ['program_id', '회차', '제목', '재생시간', '시청연령', '방영일', '줄거리', 'VOD여부'],
  },
  {
    id: 'drama-cast', name: '드라마 출연진 정보', provider: 'A방송사', party: '1st', source: '기관 보유',
    categories: ['문화 > 방송·미디어', '문화 > 연극'], cols: 4, rows: 520, created: '2026-10-13',
    summary: '드라마 출연 배우와 출연 프로그램. actor_id 로 인물 상세, program_id 로 프로그램과 연결된다.',
    keywords: ['출연진', '배우', '드라마'],
    columns: ['actor_id', '배우명', 'program_id', '배역명'],
  },

  // ── 외부 개방 (문화) ──
  {
    id: 'rating', name: '프로그램 시청률 통계', provider: 'A방송사', party: '1st', source: '기관 보유',
    categories: ['문화 > 방송·미디어'], cols: 7, rows: 8912, created: '2026-10-13',
    summary: '프로그램별 방송일 기준 시청률과 동시간대 순위. program_id 로 프로그램 정보와 연결된다.',
    keywords: ['시청률', '순위', '통계'],
  },
  {
    id: 'kobaco-net', name: '방송콘텐츠 국내 인터넷반응 지표', provider: '한국방송광고진흥공사', party: '3rd', source: '공공데이터포털',
    categories: ['문화 > 방송·미디어'], cols: 11, rows: 41200, created: '2026-09-02',
    summary: '방송 프로그램별 주간 인터넷 반응(게시글, 댓글, 동영상 조회수) 집계 지표.',
    keywords: ['화제성', '인터넷반응', '주간지표'],
  },
  {
    id: 'ki', name: '시청자평가지수 정보', provider: '방송미디어통신위원회', party: '3rd', source: '공공데이터포털',
    categories: ['문화 > 방송·미디어'], cols: 8, rows: 6730, created: '2026-09-02',
    summary: '지상파·종편 프로그램의 시청자평가지수(KI)와 만족도·질평가 점수.',
    keywords: ['KI', '만족도', '평가'],
  },
  {
    id: 'pei', name: '프로그램 몰입도 조사', provider: '한국방송광고진흥공사', party: '3rd', source: '공공데이터포털',
    categories: ['문화 > 방송·미디어'], cols: 6, rows: 2140, created: '2026-09-02',
    summary: '프로그램별 몰입도 지수(PEI). 시청률이 담지 못하는 질적 몰입 정도를 측정한다.',
    keywords: ['몰입도', 'PEI', '광고효과'],
  },
]

export const byId = Object.fromEntries(DATASETS.map((d) => [d.id, d])) as Record<string, Dataset>

/** 연계 데이터 1건 — 실제 LinkableItem 형태 */
export type LinkItem = {
  /** 포털에 등록된 데이터면 상세로 이동 */
  id?: string
  name: string
  provider: string
  /** 하위라벨 */
  sub?: string
  score: number
  /** '기준 컬럼 = 상대 컬럼' (같은 이름이면 하나) */
  keys: string[]
  reason: string
}

export type Linkable = {
  groups: Partial<Record<RelKey, LinkItem[]>>
  candidates: { id?: string; name: string; provider: string; score: number }[]
}

export const LINKABLE: Record<string, Linkable> = {
  'cancer-lib': {
    groups: {
      DETAIL_FOR: [
        {
          id: 'cdw', name: '임상 데이터 웨어하우스 핵심 테이블', provider: 'B대학병원', sub: '원내 연계',
          score: 0.89, keys: ['환자번호(가명화)'],
          reason: '같은 기관 환자의 검사·처방 상세를 가명화 환자번호로 붙여, 암종별 라이브러리에 없는 진료 맥락을 보완합니다.',
        },
      ],
      STATISTIC_FOR: [
        {
          id: 'cancer-stat', name: '암 발생 지표 정보제공 서비스', provider: '국립암센터', sub: '비교 기준',
          score: 0.91, keys: ['암종 = KCD 분류', '진단연도 = 연도'],
          reason: '병원 환자군의 암종별 분포를 전국 발생률·생존율과 비교해, 표본의 대표성과 특성 차이를 파악할 수 있습니다.',
        },
        {
          name: '국가암정보센터 통계로 보는 암', provider: '국립암센터', sub: '비교 기준',
          score: 0.87, keys: ['진단연도 = 연도', '성별'],
          reason: '연도별·성별·연령별 국가 발생률·생존율 통계가 환자 데이터 해석의 기준이 됩니다.',
        },
        {
          id: 'prev24', name: '24개 암종/성/연령(5세)별 5년 암유병자수, 유병률', provider: '보건복지부', sub: '분모',
          score: 0.88, keys: ['암종 = KCD 분류', '성별', '연령군'],
          reason: '병원 환자군이 전국 유병 분포 대비 어떤 특성을 보이는지 비교합니다. 암종 표기가 달라 KCD 분류 코드를 거쳐 붙습니다.',
        },
        {
          name: '시군구/24개 암종/성별 암발생자수·조발생률', provider: '보건복지부', sub: '비교 기준',
          score: 0.86, keys: ['암종 = KCD 분류', '시군구'],
          reason: '환자군의 지역 분포를 시군구별 전국 발생률과 비교합니다. KCD 분류 코드를 거쳐 붙습니다.',
        },
        {
          id: 'lung-cnt', name: '폐암 라이브러리 환자수', provider: '국립암센터', sub: '비교 기준',
          score: 0.84, keys: ['진단연도 = 연도', '성별', '연령대'],
          reason: '폐암 라이브러리 환자 수를 국립암센터 통계와 비교해 표본 특성 차이를 파악합니다.',
        },
        {
          name: '담도암_라이브러리_환자수', provider: '국립암센터', sub: '비교 기준',
          score: 0.83, keys: ['진단연도 = 연도'],
          reason: '담도암 환자 규모를 전국 발생 추이·타 센터와 비교·평가할 수 있습니다.',
        },
      ],
      ADJACENT_TO: [
        {
          name: '국가암검진 수검 통계', provider: '국민건강보험공단', sub: '선행 단계',
          score: 0.78, keys: ['시군구', '검진연도 = 연도'],
          reason: '검진 수검률과 진단 시점 분포를 이어 보면 조기 발견 경로를 분석할 수 있습니다.',
        },
        {
          id: 'hira-org', name: '요양기관 개설현황', provider: '건강보험심사평가원', sub: '관련 주제',
          score: 0.73, keys: ['시군구'],
          reason: '환자 거주 지역의 진료 기관 분포와 함께 보면 접근성 맥락이 생깁니다.',
        },
      ],
      SAME_KIND: [
        {
          id: 'kcure', name: 'K-CURE 암환자 데이터셋', provider: 'B대학병원', sub: '규격 판본',
          score: 0.95, keys: ['환자번호(가명화)'],
          reason: '같은 기관 데이터를 K-CURE 표준 규격으로 변환한 판본입니다. 규격 호환이 필요하면 이쪽을 씁니다.',
        },
        {
          name: '갑상선암 레지스트리 메타정보', provider: '국립암센터', sub: '기관',
          score: 0.85, keys: [],
          reason: '같은 질환의 임상 레지스트리를 다른 기관에서 수집한 판본. 기관별 치료 패턴·생존율 비교와 표본 확대에 씁니다.',
        },
        {
          name: '담도암 레지스트리 메타정보', provider: '국립암센터', sub: '기관',
          score: 0.84, keys: [],
          reason: '두 기관의 담도암 레지스트리를 비교하면 더 큰 규모의 코호트 연구를 설계할 수 있습니다.',
        },
        {
          name: '담도암 라이브러리 환자 기본정보 메타정보', provider: '국립암센터', sub: '기관',
          score: 0.83, keys: [],
          reason: '같은 암종 환자 데이터 라이브러리로, 제공 기관만 다릅니다.',
        },
      ],
    },
    candidates: [
      { name: '육종암 레지스트리 메타정보', provider: '국립암센터', score: 0.76 },
      { name: 'PRE위암_라이브러리_메타정보', provider: '국립암센터', score: 0.76 },
      { name: '소아청소년암 레지스트리 메타정보', provider: '국립암센터', score: 0.75 },
    ],
  },

  kcure: {
    groups: {
      DETAIL_FOR: [
        {
          name: 'KCURE 운영관리_공통_테이블정의서', provider: '한국보건의료정보원', sub: '규격 정의',
          score: 0.93, keys: ['테이블명', '컬럼명'],
          reason: '76개 테이블·1,272개 컬럼 구조를 정의서로 확인해, 암종별 데이터 항목과 수집 기준을 사전에 파악할 수 있습니다.',
        },
      ],
      STATISTIC_FOR: [
        {
          name: '췌장암_라이브러리_환자수', provider: '국립암센터', sub: '비교 기준',
          score: 0.86, keys: ['진단연도 = 연도', '성별'],
          reason: '췌장암 환자 데이터를 연도별·성별·연령대별 전국 통계와 비교해 분포 경향을 파악합니다.',
        },
      ],
      SAME_KIND: [
        {
          name: '간암 라이브러리 간암_병리_외과 메타정보', provider: '국립암센터', sub: '기관',
          score: 0.82, keys: [],
          reason: '같은 질환의 표준화 임상 데이터 라이브러리. 기관 간 치료 패턴 차이, 다기관 연구 설계에 씁니다.',
        },
      ],
    },
    candidates: [
      { name: '의료급여종합전문병원관리', provider: '건강보험심사평가원', score: 0.77 },
      { name: '간암_라이브러리_환자수', provider: '국립암센터', score: 0.77 },
      { id: 'lung-cnt', name: '폐암 라이브러리 환자수', provider: '국립암센터', score: 0.76 },
    ],
  },

  cdw: {
    groups: {
      DETAIL_FOR: [
        {
          id: 'cancer-lib', name: '암 임상 데이터 라이브러리', provider: 'B대학병원', sub: '원내 연계',
          score: 0.89, keys: ['환자번호(가명화)'],
          reason: '암종별 표준화 라이브러리와 붙이면 진료 기록에 암 병기·예후 정보가 보완됩니다.',
        },
      ],
    },
    candidates: [
      { id: 'ecg', name: '안정시 심전도 검사', provider: 'B대학병원', score: 0.69 },
      { id: 'icu-bio', name: '중환자 생체신호 빅데이터', provider: 'B대학병원', score: 0.68 },
    ],
  },

  'meta-life': {
    groups: {
      SAME_KIND: [
        {
          id: 'diab-life', name: '당뇨환자 라이프로그 데이터', provider: 'B대학병원 분원', sub: '질환',
          score: 0.9, keys: ['측정주차', '항목코드'],
          reason: '같은 수집 체계의 라이프로그로 대상 질환만 다릅니다. 측정 항목이 같아 바로 비교됩니다.',
        },
      ],
    },
    candidates: [{ id: 'cohort', name: '코호트 데이터베이스', provider: 'B대학병원 분원', score: 0.66 }],
  },

  'diab-life': {
    groups: {
      SAME_KIND: [
        {
          id: 'meta-life', name: '대사증후군 환자 라이프로그', provider: 'B대학병원 분원', sub: '질환',
          score: 0.9, keys: ['측정주차', '항목코드'],
          reason: '같은 수집 체계의 라이프로그로 대상 질환만 다릅니다.',
        },
      ],
    },
    candidates: [{ id: 'cohort', name: '코호트 데이터베이스', provider: 'B대학병원 분원', score: 0.64 }],
  },

  'drama-prog': {
    groups: {
      DETAIL_FOR: [
        {
          id: 'drama-cast', name: '드라마 출연진 정보', provider: 'A방송사', sub: '원내 연계',
          score: 0.94, keys: ['program_id'],
          reason: '출연 배우·배역을 프로그램 단위로 보완합니다. actor_id 로 인물 상세까지 이어집니다.',
        },
        {
          id: 'drama-ep', name: '드라마 회차 정보', provider: 'A방송사', sub: '원내 연계',
          score: 0.93, keys: ['program_id'],
          reason: '회차별 제목·재생시간·줄거리를 붙여 프로그램 단위 정보를 회차 단위로 확장합니다.',
        },
      ],
      STATISTIC_FOR: [
        {
          id: 'rating', name: '프로그램 시청률 통계', provider: 'A방송사', sub: '성과 지표',
          score: 0.92, keys: ['program_id', '프로그램명'],
          reason: '방송일별 시청률 추이와 동시간대 순위를 붙여, 어떤 드라마가 얼마나 인기를 끌었는지 분석합니다.',
        },
        {
          id: 'kobaco-net', name: '방송콘텐츠 국내 인터넷반응 지표', provider: '한국방송광고진흥공사', sub: '화제성',
          score: 0.87, keys: ['프로그램명 = 프로그램', '채널'],
          reason: '주간 게시글·댓글·동영상 조회 지표를 붙여 각 드라마의 화제성을 정량적으로 파악합니다.',
        },
        {
          id: 'pei', name: '프로그램 몰입도 조사', provider: '한국방송광고진흥공사', sub: '질적 평가',
          score: 0.86, keys: ['프로그램명 = 프로그램', '채널'],
          reason: '시청률 외에 시청자의 질적 몰입 정도(PEI)를 함께 봐 실제 영향력과 광고 효과를 평가합니다.',
        },
        {
          name: '방송콘텐츠 종합반응 지표', provider: '한국방송광고진흥공사', sub: '화제성',
          score: 0.85, keys: ['프로그램명 = 프로그램'],
          reason: '주간 시청량과 인터넷 반응을 묶은 종합 지표로 방영 기간의 반응 추이를 봅니다.',
        },
        {
          id: 'ki', name: '시청자평가지수 정보', provider: '방송미디어통신위원회', sub: '질적 평가',
          score: 0.84, keys: ['프로그램명', '채널'],
          reason: '시청자평가지수(KI)·만족도 점수를 붙여 프로그램 성과를 다각도로 분석합니다.',
        },
        {
          name: '방송콘텐츠 해외 인터넷반응 지표', provider: '한국방송광고진흥공사', sub: '화제성',
          score: 0.83, keys: ['프로그램명 = 프로그램'],
          reason: '해외 뉴스·게시글·동영상 조회 반응을 붙여 프로그램의 해외 경쟁력을 파악합니다.',
        },
      ],
      SAME_KIND: [
        {
          name: '방송 콘텐츠 메타데이터 전체본', provider: 'A방송사', sub: '범위',
          score: 0.9, keys: ['program_id'],
          reason: '드라마는 이 데이터의 부분집합입니다. 다른 장르와 비교하거나 제작사 등 추가 항목이 필요하면 전체판을 씁니다.',
        },
      ],
    },
    candidates: [
      { name: '스마트폰_PC시청기록조사', provider: '방송미디어통신위원회', score: 0.61 },
      { name: '교통방송 TV 편성표 정보', provider: '서울특별시', score: 0.56 },
    ],
  },

  'drama-ep': {
    groups: {
      DETAIL_FOR: [
        {
          id: 'drama-prog', name: '드라마 프로그램 정보', provider: 'A방송사', sub: '원내 연계',
          score: 0.95, keys: ['program_id'],
          reason: '회차가 속한 프로그램의 장르·출연진·방영기간을 보완합니다.',
        },
      ],
      STATISTIC_FOR: [
        {
          id: 'rating', name: '프로그램 시청률 통계', provider: 'A방송사', sub: '성과 지표',
          score: 0.88, keys: ['program_id', '방영일 = 방송일'],
          reason: '회차가 방영된 날의 시청률과 동시간대 순위를 붙여 회차별 성과를 분석합니다.',
        },
        {
          id: 'kobaco-net', name: '방송콘텐츠 국내 인터넷반응 지표', provider: '한국방송광고진흥공사', sub: '화제성',
          score: 0.85, keys: ['프로그램명 = 프로그램', '방영주차 = 주차'],
          reason: '회차별로 인터넷 반응을 붙이면 어떤 회차가 화제가 됐는지 파악할 수 있습니다.',
        },
        {
          id: 'ki', name: '시청자평가지수 정보', provider: '방송미디어통신위원회', sub: '질적 평가',
          score: 0.83, keys: ['프로그램명', '채널'],
          reason: '시청률뿐 아니라 만족도와 질적 우수성을 함께 평가합니다.',
        },
      ],
    },
    candidates: [
      { name: '프로그램 편성 정보', provider: 'A방송사', score: 0.7 },
      { name: '교양 프로그램 회차 정보', provider: 'A방송사', score: 0.69 },
    ],
  },

  'drama-cast': {
    groups: {
      DETAIL_FOR: [
        {
          id: 'drama-prog', name: '드라마 프로그램 정보', provider: 'A방송사', sub: '원내 연계',
          score: 0.93, keys: ['program_id'],
          reason: '배우가 출연한 프로그램의 장르·방영기간·줄거리를 보완합니다.',
        },
      ],
    },
    candidates: [{ id: 'drama-ep', name: '드라마 회차 정보', provider: 'A방송사', score: 0.66 }],
  },

  rating: {
    groups: {
      DETAIL_FOR: [
        {
          id: 'drama-prog', name: '드라마 프로그램 정보', provider: 'A방송사', sub: '원내 연계',
          score: 0.92, keys: ['program_id', '프로그램명'],
          reason: '시청률 수치에 프로그램의 장르·출연진·방영기간 맥락을 보완합니다.',
        },
      ],
    },
    candidates: [{ id: 'ki', name: '시청자평가지수 정보', provider: '방송미디어통신위원회', score: 0.71 }],
  },
}

/** 중환자 생체신호 — 아직 판정 전. '관계 생성 실행'을 누르면 이 결과가 생긴다 (확정 2 · 검토 대기 1) */
export const ICU_BIO_BEFORE: Linkable = {
  groups: {},
  candidates: [
    { id: 'cdw', name: '임상 데이터 웨어하우스 핵심 테이블', provider: 'B대학병원', score: 0.69 },
    { id: 'ecg', name: '안정시 심전도 검사', provider: 'B대학병원', score: 0.67 },
    { name: '건강보험 중환자실 이용 현황', provider: '건강보험심사평가원', score: 0.64 },
  ],
}

export const ICU_BIO_AFTER: Linkable = {
  groups: {
    DETAIL_FOR: [
      {
        id: 'cdw', name: '임상 데이터 웨어하우스 핵심 테이블', provider: 'B대학병원', sub: '원내 연계',
        score: 0.87, keys: ['환자번호(가명화)'],
        reason: '생체신호에 같은 환자의 진단·처방 맥락을 붙여 중증도 분석의 설명 변수를 보완합니다.',
      },
    ],
    STATISTIC_FOR: [
      {
        name: '건강보험 중환자실 이용 현황', provider: '건강보험심사평가원', sub: '비교 기준',
        score: 0.84, keys: ['연도', '병상종류'],
        reason: '전국 중환자실 이용 규모와 비교해 수집 환자군의 대표성을 가늠합니다.',
      },
    ],
  },
  candidates: [{ id: 'ecg', name: '안정시 심전도 검사', provider: 'B대학병원', score: 0.67 }],
}

export const linkCount = (l?: Linkable) =>
  l ? Object.values(l.groups).reduce((n, items) => n + (items?.length ?? 0), 0) : 0

/** 관계 지도(고리형) — 암 임상 데이터 라이브러리 기준. ring 0 = 기준, 1 = 바로 붙음, 2 = 한 단계 거쳐 */
export const NODE_KINDS = {
  1: { name: '개체·임상 데이터', color: 'var(--n1)' },
  2: { name: '집계 통계', color: 'var(--n2)' },
  3: { name: '코드·기준표', color: 'var(--n3)' },
} as const

export type NodeKind = keyof typeof NODE_KINDS

export type GraphNode = {
  id: string
  name: string
  org: string
  rows: string
  kind: NodeKind
  ring: 0 | 1 | 2
  angle: number
  via?: string
  rel?: RelKey
  sub?: string
  joinKey?: string
  score?: number
  bridge?: boolean
  how?: string
  /** 포털 등록 데이터면 상세로 이동 */
  dataset?: string
}

export const CANCER_LIB_GRAPH: GraphNode[] = [
  {
    id: 'anchor', name: '암 임상 데이터 라이브러리', org: 'B대학병원',
    rows: '11개 암종 · 90여 개 테이블', kind: 1, ring: 0, angle: 0, dataset: 'cancer-lib',
  },

  {
    id: 'kcd', name: 'KCD-8 질병분류 코드', org: '통계청', rows: '기준표',
    kind: 3, ring: 1, angle: 0, via: 'anchor', bridge: true, joinKey: '암종명 = KCD 코드',
    how: '암종 이름과 질병분류 코드를 서로 바꿔주는 기준표입니다. 암종 표기가 다른 국가 통계와 이걸 거치면 붙습니다.',
  },
  {
    id: 'cancer-stat', name: '암 발생 지표 서비스', org: '국립암센터', rows: '18,240행',
    kind: 2, ring: 1, angle: 52, via: 'anchor', dataset: 'cancer-stat',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '진단연도 = 연도', score: 0.91,
    how: '병원 환자군의 암종별 분포를 전국 발생률·생존율과 비교하는 기준입니다.',
  },
  {
    id: 'ncc-stat', name: '통계로 보는 암', org: '국립암센터', rows: '연 1회',
    kind: 2, ring: 1, angle: 104, via: 'anchor',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '진단연도 = 연도', score: 0.87,
    how: '연도별·성별·연령별 국가 통계가 환자 데이터 해석의 기준이 됩니다.',
  },
  {
    id: 'screen', name: '국가암검진 수검 통계', org: '국민건강보험공단', rows: '연 1회',
    kind: 2, ring: 1, angle: 152, via: 'anchor',
    rel: 'ADJACENT_TO', sub: '선행 단계', joinKey: '시군구', score: 0.78,
    how: '검진 수검률과 진단 시점 분포를 이어 보면 조기 발견 경로가 분석됩니다.',
  },
  {
    id: 'kcure', name: 'K-CURE 암환자 데이터셋', org: 'B대학병원', rows: '테이블 72개',
    kind: 1, ring: 1, angle: 206, via: 'anchor', dataset: 'kcure',
    rel: 'SAME_KIND', sub: '규격 판본', joinKey: '환자번호(가명화)', score: 0.95,
    how: '같은 기관 데이터를 K-CURE 표준 규격으로 변환한 판본입니다. 규격 호환이 필요하면 이쪽입니다.',
  },
  {
    id: 'registry', name: '암종별 레지스트리 3건', org: '국립암센터', rows: '묶음',
    kind: 1, ring: 1, angle: 258, via: 'anchor',
    rel: 'SAME_KIND', sub: '기관', score: 0.85,
    how: '갑상선암·담도암 등 같은 질환의 레지스트리를 다른 기관에서 수집한 판본입니다. 다기관 연구 표본 확대에 씁니다.',
  },
  {
    id: 'cdw', name: '임상 데이터 웨어하우스', org: 'B대학병원', rows: '핵심 테이블',
    kind: 1, ring: 1, angle: 308, via: 'anchor', dataset: 'cdw',
    rel: 'DETAIL_FOR', sub: '원내 연계', joinKey: '환자번호(가명화)', score: 0.89,
    how: '같은 환자의 검사·처방 상세를 붙여 라이브러리에 없는 진료 맥락을 보완합니다.',
  },

  {
    id: 'prev24', name: '24개 암종 유병자수·유병률', org: '보건복지부', rows: '4,320행',
    kind: 2, ring: 2, angle: -24, via: 'kcd', dataset: 'prev24',
    rel: 'STATISTIC_FOR', sub: '분모', joinKey: '암종 = KCD 분류', score: 0.88,
    how: '직접은 붙지 않습니다. 이 자료의 암종 구분이 KCD 분류 기준이라서입니다. 질병분류 코드를 거치면 붙습니다.',
  },
  {
    id: 'region24', name: '시군구별 암발생자수·조발생률', org: '보건복지부', rows: '연 1회',
    kind: 2, ring: 2, angle: 24, via: 'kcd',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '암종 = KCD 분류', score: 0.86,
    how: '질병분류 코드를 거쳐 붙습니다. 환자군의 지역 분포를 전국과 비교합니다.',
  },
  {
    id: 'lung-cnt', name: '폐암 라이브러리 환자수', org: '국립암센터', rows: '264행',
    kind: 2, ring: 2, angle: 76, via: 'cancer-stat', dataset: 'lung-cnt',
    rel: 'STATISTIC_FOR', sub: '비교 기준', joinKey: '진단연도 = 연도', score: 0.84,
    how: '암 발생 지표를 거쳐 암종 단위로 내려갑니다. 폐암 표본 특성 비교에 씁니다.',
  },
  {
    id: 'hira-org', name: '요양기관 개설현황', org: '건강보험심사평가원', rows: '103,309행',
    kind: 1, ring: 2, angle: 180, via: 'screen', dataset: 'hira-org',
    rel: 'ADJACENT_TO', sub: '관련 주제', joinKey: '시군구', score: 0.73,
    how: '검진·진료 기관의 지역 분포와 함께 보면 접근성 맥락이 생깁니다.',
  },
]

export const RING_RADIUS = [0, 132, 258]

export const GRAPH_FILTERS: { key: 'all' | RelKey; label: string }[] = [
  { key: 'all', label: '전체' },
  ...REL_ORDER.map((key) => ({ key, label: REL_TYPES[key].label })),
]

/** 수집 실행 이력 (관리 화면) */
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
