// Mock data for demo purposes

export const mockConfig = {
  x_token: "demo-token"
}

export const mockSearchResult = {
  documents: [
    {
      doc_id: "DOC-HOSP-001",
      score: 0.98,
      description: "세브란스병원 - 3차 의료기관, 대장암 특화 센터 운영. AI 기반 환자 선별 시스템(OncoScreen Match) 도입으로 임상시험 적격 환자 식별 효율 40% 향상. 연간 대장암 수술 1,200건, 임상시험 참여 환자 850명"
    },
    {
      doc_id: "DOC-TRIAL-001",
      score: 0.96,
      description: "대장암 3상 임상시험 - OncoScreen Match를 활용한 환자 선별 시스템 검증. 참여기관: 세브란스병원, 목표 모집: 240명, 현재 등록: 187명(78%). 주요 평가지표: 무진행 생존기간(PFS), 전체 생존율(OS)"
    },
    {
      doc_id: "DOC-PAPER-001",
      score: 0.94,
      description: "Nature Medicine 논문(2025) - 'AI 기반 대장암 환자 선별의 임상적 유용성'. 세브란스병원 주도 연구, OncoScreen Match 시스템의 민감도 92.3%, 특이도 88.7% 입증. 전통적 방법 대비 선별 시간 65% 단축"
    },
    {
      doc_id: "DOC-DEVICE-002",
      score: 0.91,
      description: "GlucoWatch CGM Pro - 연속혈당측정(CGM) 의료기기. 삼성서울병원, 분당서울대병원에서 제2형 당뇨병 환자 모니터링에 활용. 실시간 혈당 데이터 전송, 저혈당/고혈당 알림 기능. FDA 승인(2024), MFDS 인증(2024)"
    },
    {
      doc_id: "DOC-PAPER-003",
      score: 0.89,
      description: "Diabetes Care 논문(2025) - 'CGM 기반 당뇨병 관리의 장기 효과'. 삼성서울병원·분당서울대병원 공동연구, GlucoWatch CGM Pro 사용 환자군에서 HbA1c 평균 1.2% 감소, 저혈당 발생 빈도 58% 감소"
    }
  ],
  graph: {
    nodes: [
      {
        id: "doc_hosp_001",
        labels: ["Document", "Hospital"],
        properties: { doc_id: "DOC-HOSP-001", name: "세브란스병원", type: "3차 의료기관" }
      },
      {
        id: "topic_colorectal_cancer",
        labels: ["Topic", "Disease"],
        properties: { name: "대장암", category: "종양학" }
      },
      {
        id: "topic_ai_screening",
        labels: ["Topic", "Technology"],
        properties: { name: "AI 환자 선별 시스템", product: "OncoScreen Match" }
      },
      {
        id: "doc_trial_001",
        labels: ["Document", "ClinicalTrial"],
        properties: { doc_id: "DOC-TRIAL-001", name: "대장암 3상 임상시험", phase: "Phase 3" }
      },
      {
        id: "doc_paper_001",
        labels: ["Document", "ResearchPaper"],
        properties: { doc_id: "DOC-PAPER-001", journal: "Nature Medicine", year: 2025 }
      },
      {
        id: "doc_hosp_002",
        labels: ["Document", "Hospital"],
        properties: { doc_id: "DOC-HOSP-002", name: "삼성서울병원", type: "3차 의료기관" }
      },
      {
        id: "doc_hosp_003",
        labels: ["Document", "Hospital"],
        properties: { doc_id: "DOC-HOSP-003", name: "분당서울대병원", type: "3차 의료기관" }
      },
      {
        id: "topic_diabetes",
        labels: ["Topic", "Disease"],
        properties: { name: "제2형 당뇨병", category: "내분비내과" }
      },
      {
        id: "doc_device_002",
        labels: ["Document", "MedicalDevice"],
        properties: { doc_id: "DOC-DEVICE-002", name: "GlucoWatch CGM Pro", type: "CGM" }
      },
      {
        id: "doc_paper_003",
        labels: ["Document", "ResearchPaper"],
        properties: { doc_id: "DOC-PAPER-003", journal: "Diabetes Care", year: 2025 }
      },
      {
        id: "tag_clinical_trial",
        labels: ["Tag"],
        properties: { name: "임상시험" }
      },
      {
        id: "tag_ai_healthcare",
        labels: ["Tag"],
        properties: { name: "AI 헬스케어" }
      },
      {
        id: "tag_continuous_monitoring",
        labels: ["Tag"],
        properties: { name: "연속 모니터링" }
      }
    ],
    relationships: [
      { start: "doc_hosp_001", end: "topic_colorectal_cancer", type: "SPECIALIZES_IN" },
      { start: "doc_hosp_001", end: "topic_ai_screening", type: "USES_TECHNOLOGY" },
      { start: "doc_trial_001", end: "doc_hosp_001", type: "CONDUCTED_AT" },
      { start: "doc_trial_001", end: "topic_colorectal_cancer", type: "TARGETS_DISEASE" },
      { start: "doc_trial_001", end: "topic_ai_screening", type: "VALIDATES_TECHNOLOGY" },
      { start: "doc_paper_001", end: "doc_hosp_001", type: "LED_BY" },
      { start: "doc_paper_001", end: "topic_ai_screening", type: "STUDIES" },
      { start: "doc_paper_001", end: "tag_ai_healthcare", type: "TAGGED_AS" },
      { start: "doc_hosp_002", end: "topic_diabetes", type: "SPECIALIZES_IN" },
      { start: "doc_hosp_003", end: "topic_diabetes", type: "SPECIALIZES_IN" },
      { start: "doc_device_002", end: "doc_hosp_002", type: "DEPLOYED_AT" },
      { start: "doc_device_002", end: "doc_hosp_003", type: "DEPLOYED_AT" },
      { start: "doc_device_002", end: "topic_diabetes", type: "MONITORS_DISEASE" },
      { start: "doc_paper_003", end: "doc_hosp_002", type: "LED_BY" },
      { start: "doc_paper_003", end: "doc_hosp_003", type: "LED_BY" },
      { start: "doc_paper_003", end: "doc_device_002", type: "EVALUATES_DEVICE" },
      { start: "doc_paper_003", end: "tag_continuous_monitoring", type: "TAGGED_AS" },
      { start: "topic_colorectal_cancer", end: "topic_diabetes", type: "CO_OCCURS_WITH" },
      { start: "doc_trial_001", end: "tag_clinical_trial", type: "TAGGED_AS" }
    ]
  }
}

export const mockRelationDiscovery = {
  source_doc_id: "DOC-HOSP-001",
  source_doc_info: {
    key_values: {
      "기관명": ["세브란스병원"],
      "기관유형": ["3차 의료기관"],
      "특화분야": ["대장암"],
      "도입기술": ["AI 환자 선별 시스템"],
      "기술명": ["OncoScreen Match"],
      "연간 수술건수": ["1,200건"],
      "임상시험 참여환자": ["850명"],
      "효율 향상": ["40%"],
      "소재지": ["서울시 서대문구"]
    },
    important_keys: ["기관명", "특화분야", "도입기술", "기술명"],
    important_values: {
      "기관명": ["세브란스병원"],
      "특화분야": ["대장암"],
      "도입기술": ["AI 환자 선별 시스템"],
      "기술명": ["OncoScreen Match"]
    }
  },
  candidates: [
    {
      doc_id: "DOC-TRIAL-001",
      score: 0.98,
      matched_keys: ["기관명", "특화분야", "도입기술", "기술명"],
      matched_values: {
        "기관명": "세브란스병원",
        "특화분야": "대장암",
        "도입기술": "AI 환자 선별 시스템",
        "기술명": "OncoScreen Match"
      },
      breakdown: {
        aligned_attribute: 0.97,
        typed_value_match: 0.99,
        graph_structure: 0.98,
        document_semantic: 0.98
      }
    },
    {
      doc_id: "DOC-PAPER-001",
      score: 0.96,
      matched_keys: ["기관명", "도입기술", "특화분야"],
      matched_values: {
        "기관명": "세브란스병원",
        "도입기술": "AI 환자 선별 시스템",
        "특화분야": "대장암"
      },
      breakdown: {
        aligned_attribute: 0.95,
        typed_value_match: 0.97,
        graph_structure: 0.95,
        document_semantic: 0.97
      }
    },
    {
      doc_id: "DOC-NEWS-001",
      score: 0.93,
      matched_keys: ["기관명", "도입기술", "기술명"],
      matched_values: {
        "기관명": "세브란스병원",
        "도입기술": "AI 환자 선별 시스템",
        "기술명": "OncoScreen Match"
      },
      breakdown: {
        aligned_attribute: 0.92,
        typed_value_match: 0.95,
        graph_structure: 0.91,
        document_semantic: 0.94
      }
    },
    {
      doc_id: "DOC-GUIDE-001",
      score: 0.90,
      matched_keys: ["특화분야", "도입기술"],
      matched_values: {
        "특화분야": "대장암",
        "도입기술": "AI 기반 환자 선별"
      },
      breakdown: {
        aligned_attribute: 0.88,
        typed_value_match: 0.93,
        graph_structure: 0.87,
        document_semantic: 0.92
      }
    },
    {
      doc_id: "DOC-DEVICE-003",
      score: 0.87,
      matched_keys: ["기관명", "도입기술"],
      matched_values: {
        "기관명": "세브란스병원",
        "도입기술": "AI 시스템"
      },
      breakdown: {
        aligned_attribute: 0.85,
        typed_value_match: 0.90,
        graph_structure: 0.84,
        document_semantic: 0.89
      }
    },
    {
      doc_id: "DOC-PAPER-005",
      score: 0.84,
      matched_keys: ["특화분야", "기관유형"],
      matched_values: {
        "특화분야": "대장암",
        "기관유형": "3차 의료기관"
      },
      breakdown: {
        aligned_attribute: 0.82,
        typed_value_match: 0.87,
        graph_structure: 0.81,
        document_semantic: 0.86
      }
    }
  ],
  search_strategy: "의료기관의 핵심 식별자(기관명, 특화분야, 도입기술)를 기반으로 관련 문서를 탐색합니다. 기관명과 기술명의 정확한 매칭을 우선시하며, 임상시험·논문·뉴스·가이드라인 문서 발굴을 위해 특화분야와 도입기술의 의미론적 연관성에 높은 가중치를 부여합니다.",
  important_keys: ["기관명", "특화분야", "도입기술", "기술명"]
}

// 의료 데이터 파일 목 데이터 (7개 이기종 파일)
export const mockMedicalFiles = {
  hospital_registry: `hospital_id,hospital_name,hospital_type,specialized_dept,location,annual_surgeries,clinical_trial_patients,adopted_technology
HOSP-001,연세의료원 세브란스병원,3차 의료기관,대장암,서울시 서대문구,1200,850,AI 선별 시스템
HOSP-002,삼성서울병원,3차 의료기관,당뇨,서울시 강남구,2800,1200,CGM
HOSP-003,서울대학교병원,3차 의료기관,부정맥,서울시 종로구,3200,1500,웨어러블 ECG
HOSP-004,분당서울대병원,3차 의료기관,당뇨,경기도 성남시,1800,920,CGM
HOSP-005,강남세브란스병원,3차 의료기관,부정맥,서울시 강남구,1600,780,웨어러블 ECG
HOSP-006,용인세브란스병원,3차 의료기관,부정맥,경기도 용인시,900,450,웨어러블 ECG`,

  clinical_trials: JSON.stringify([
    {
      trial_id: "TRIAL-001",
      trial_name: "대장암 3상 임상시험",
      phase: "Phase 3",
      disease: "대장암",
      institution: "세브란스병원",
      technology: "OncoScreen Match",
      target_enrollment: 240,
      current_enrollment: 187,
      enrollment_rate: 0.78,
      primary_endpoint: ["무진행 생존기간(PFS)", "전체 생존율(OS)"],
      start_date: "2024-03-15",
      status: "진행중",
      sponsor: "연세의료원",
      description: "AI 기반 환자 선별 시스템을 활용한 대장암 환자 임상시험 적격성 검증"
    },
    {
      trial_id: "TRIAL-002",
      trial_name: "부정맥 2상 임상시험",
      phase: "Phase 2",
      disease: "부정맥",
      institution: "서울대병원",
      technology: "CardioPatch One",
      target_enrollment: 180,
      current_enrollment: 142,
      enrollment_rate: 0.79,
      primary_endpoint: ["심박수 변이도", "부정맥 발생 빈도"],
      start_date: "2024-06-01",
      status: "진행중",
      sponsor: "서울대학교병원",
      description: "웨어러블 ECG 기반 실시간 부정맥 모니터링 및 조기 예측 검증"
    }
  ], null, 2),

  medical_devices: `device_id,device_name,device_type,manufacturer,indication,fda_approval,mfds_certification,deployment_hospitals,clinical_features
DEV-001,CardioPatch One,웨어러블 ECG,CardioTech Inc,부정맥 모니터링,2023-08-15,2023-11-20,"서울대병원,강남세브란스,용인세브란스","실시간 ECG 전송, 부정맥 자동 감지"
DEV-002,GlucoWatch CGM Pro,연속혈당측정기,DiabetesMonitor Corp,제2형 당뇨병,2024-01-10,2024-03-05,"삼성서울병원,분당서울대병원","실시간 혈당 데이터, 저혈당/고혈당 알림"
DEV-003,OncoScreen Match,AI 환자 선별,OncoAI Solutions,대장암 환자 선별,2024-05-20,2024-07-12,세브란스병원,"AI 기반 적격성 판단, 선별 시간 65% 단축"`,

  research_papers: `{"paper_id":"PAPER-001","title":"AI 기반 대장암 환자 선별의 임상적 유용성","journal":"Nature Medicine","year":2025,"authors":["김철수","이영희","박민수"],"affiliation":"세브란스병원","technology":"OncoScreen Match","disease":"대장암","key_findings":{"sensitivity":0.923,"specificity":0.887,"time_reduction":"65%"},"citation_count":142}
{"paper_id":"PAPER-002","title":"CGM 기반 당뇨병 관리의 장기 효과","journal":"Diabetes Care","year":2025,"authors":["정수연","최지훈"],"affiliation":["삼성서울병원","분당서울대병원"],"technology":"GlucoWatch CGM Pro","disease":"제2형 당뇨병","key_findings":{"hba1c_reduction":"1.2%","hypoglycemia_reduction":"58%"},"citation_count":87}
{"paper_id":"PAPER-003","title":"웨어러블 ECG 기반 부정맥 조기 예측 모델","journal":"Circulation","year":2025,"authors":["한지민","오성훈"],"affiliation":"서울대병원","technology":"CardioPatch One","disease":"부정맥","key_findings":{"prediction_accuracy":0.91,"early_detection_rate":"72%"},"citation_count":93}
{"paper_id":"PAPER-004","title":"다기관 임상시험에서의 AI 환자 선별 효율성","journal":"JAMA Oncology","year":2024,"authors":["김철수","강혜진"],"affiliation":"세브란스병원","technology":"OncoScreen Match","disease":"대장암","key_findings":{"enrollment_speed_increase":"40%","protocol_violation_reduction":"28%"},"citation_count":68}
{"paper_id":"PAPER-005","title":"CGM 데이터 기반 당뇨 합병증 예측","journal":"The Lancet Diabetes & Endocrinology","year":2024,"authors":["정수연","박준영"],"affiliation":"삼성서울병원","technology":"CGM","disease":"당뇨","key_findings":{"complication_prediction_auc":0.89,"intervention_timing_improvement":"3.2개월"},"citation_count":76}`,

  news_reports: `[뉴스1] 세브란스병원, AI 기반 대장암 환자 선별로 임상시험 효율 40% 향상
DOC-NEWS-001
2025-02-15

세브란스병원이 OncoScreen Match AI 시스템을 도입해 대장암 임상시험 환자 선별 효율을 40% 향상시켰다고 발표했다. 기존 수작업 방식 대비 선별 시간이 65% 단축되었으며, 현재 진행 중인 3상 임상시험에서 목표 환자의 78%를 이미 등록 완료했다.

---

[메디컬타임즈] 삼성서울병원·분당서울대병원, CGM 기반 당뇨 관리로 저혈당 58% 감소
DOC-NEWS-002
2025-03-10

삼성서울병원과 분당서울대병원의 공동 연구 결과, GlucoWatch CGM Pro를 활용한 제2형 당뇨병 환자에서 HbA1c가 평균 1.2% 감소하고 저혈당 발생 빈도가 58% 감소한 것으로 나타났다. 연구 결과는 Diabetes Care 저널에 게재되었다.

---

[헬스조선] 서울대병원, 웨어러블 ECG로 부정맥 조기 감지율 72% 달성
DOC-NEWS-003
2025-01-20

서울대병원이 CardioPatch One 웨어러블 ECG 기기를 활용해 부정맥 조기 감지율 72%, 예측 정확도 91%를 달성했다. 강남세브란스병원과 용인세브란스병원도 동일 기술을 도입하여 다기관 검증을 진행 중이다.`,

  care_guidelines: `guideline_id,title,disease,technology,publication_date,issuing_organization,recommendation_level,key_recommendations
GUIDE-001,AI 기반 임상시험 환자 선별 가이드라인,대장암,AI 환자 선별,2025-01-15,대한종양학회,1A,"적격성 기준 자동 검증, 프로토콜 준수율 향상, 선별 시간 단축"
GUIDE-002,CGM 기반 당뇨병 관리 권고안,제2형 당뇨병,연속혈당측정,2024-11-20,대한당뇨병학회,1A,"실시간 혈당 모니터링, 저혈당 예방, HbA1c 관리"
GUIDE-003,웨어러블 ECG 기반 부정맥 모니터링 지침,부정맥,웨어러블 ECG,2024-09-30,대한부정맥학회,2A,"연속 심전도 모니터링, 조기 경고 시스템, 원격 진료 연계"
GUIDE-004,AI 헬스케어 기술 도입 표준안,다학제,AI 시스템,2025-02-01,보건복지부,권고,"윤리 검토, 데이터 보안, 임상 검증"`,

  normalization_map: JSON.stringify({
    "병원명_정규화": {
      "연세의료원 세브란스병원": "세브란스병원",
      "연세대학교 세브란스병원": "세브란스병원",
      "세브란스": "세브란스병원",
      "서울대학교병원": "서울대병원",
      "서울대병원": "서울대병원",
      "SNUH": "서울대병원",
      "삼성서울병원": "삼성서울병원",
      "SMC": "삼성서울병원"
    },
    "질병명_정규화": {
      "당뇨": "제2형 당뇨병",
      "제2형당뇨": "제2형 당뇨병",
      "Type 2 Diabetes": "제2형 당뇨병",
      "대장암": "대장암",
      "결장직장암": "대장암",
      "Colorectal Cancer": "대장암",
      "부정맥": "부정맥",
      "심방세동": "부정맥",
      "Arrhythmia": "부정맥"
    },
    "기술명_정규화": {
      "AI 선별 시스템": "OncoScreen Match",
      "AI 환자 선별": "OncoScreen Match",
      "OncoScreen": "OncoScreen Match",
      "CGM": "GlucoWatch CGM Pro",
      "연속혈당측정": "GlucoWatch CGM Pro",
      "GlucoWatch": "GlucoWatch CGM Pro",
      "웨어러블 ECG": "CardioPatch One",
      "웨어러블 심전도": "CardioPatch One",
      "CardioPatch": "CardioPatch One"
    },
    "기관유형_정규화": {
      "상급종합병원": "3차 의료기관",
      "3차병원": "3차 의료기관",
      "tertiary hospital": "3차 의료기관"
    }
  }, null, 2)
}

// 데모 추천 검색어 (자연어 검색용)
export const mockRecommendedQueries = [
  {
    query: "대장암 임상시험과 관련된 병원과 문서를 보여줘",
    category: "임상시험",
    expectedResults: ["DOC-HOSP-001", "DOC-TRIAL-001", "DOC-PAPER-001", "DOC-NEWS-001", "DOC-GUIDE-001"]
  },
  {
    query: "CGM 기반 당뇨 모니터링 관련 그래프를 찾아줘",
    category: "의료기기",
    expectedResults: ["DOC-DEVICE-002", "DOC-HOSP-002", "DOC-HOSP-004", "DOC-PAPER-002", "DOC-NEWS-002"]
  },
  {
    query: "부정맥과 CardioPatch One이 함께 나오는 문서를 보여줘",
    category: "질병-기기 연관",
    expectedResults: ["DOC-DEVICE-001", "DOC-HOSP-003", "DOC-TRIAL-002", "DOC-PAPER-003", "DOC-NEWS-003"]
  },
  {
    query: "세브란스병원과 관계있는 AI 환자선별 문서를 찾아줘",
    category: "병원-기술",
    expectedResults: ["DOC-HOSP-001", "DOC-DEVICE-003", "DOC-TRIAL-001", "DOC-PAPER-001", "DOC-PAPER-004"]
  },
  {
    query: "제2형 당뇨병 관리를 위한 가이드라인과 연구논문",
    category: "가이드라인",
    expectedResults: ["DOC-GUIDE-002", "DOC-PAPER-002", "DOC-PAPER-005", "DOC-NEWS-002"]
  }
]

// 데모 추천 문서 ID (관계 탐색용)
export const mockRecommendedDocIds = [
  {
    doc_id: "DOC-HOSP-001",
    name: "세브란스병원",
    description: "대장암 특화, AI 환자선별 시스템 도입",
    relatedDocs: ["DOC-TRIAL-001", "DOC-PAPER-001", "DOC-PAPER-004", "DOC-NEWS-001", "DOC-GUIDE-001", "DOC-DEVICE-003"],
    relationChain: "병원 → 임상시험 → 논문 → 뉴스 → 가이드라인"
  },
  {
    doc_id: "DOC-TRIAL-001",
    name: "대장암 3상 임상시험",
    description: "OncoScreen Match 검증, 세브란스병원 주관",
    relatedDocs: ["DOC-HOSP-001", "DOC-PAPER-001", "DOC-PAPER-004", "DOC-DEVICE-003", "DOC-NEWS-001"],
    relationChain: "임상시험 → 병원 → AI기술 → 논문 → 뉴스"
  },
  {
    doc_id: "DOC-PAPER-003",
    name: "웨어러블 ECG 기반 부정맥 조기 예측 모델",
    description: "Circulation 게재, 서울대병원 주도 연구",
    relatedDocs: ["DOC-HOSP-003", "DOC-DEVICE-001", "DOC-TRIAL-002", "DOC-NEWS-003", "DOC-GUIDE-003"],
    relationChain: "논문 → 병원 → 의료기기 → 임상시험 → 가이드라인"
  },
  {
    doc_id: "DOC-DEVICE-001",
    name: "CardioPatch One",
    description: "웨어러블 ECG, 부정맥 실시간 모니터링",
    relatedDocs: ["DOC-HOSP-003", "DOC-HOSP-005", "DOC-HOSP-006", "DOC-TRIAL-002", "DOC-PAPER-003", "DOC-NEWS-003"],
    relationChain: "의료기기 → 다기관(서울대/강남세브/용인세브) → 임상시험 → 논문"
  },
  {
    doc_id: "DOC-DEVICE-002",
    name: "GlucoWatch CGM Pro",
    description: "연속혈당측정, 제2형 당뇨병 관리",
    relatedDocs: ["DOC-HOSP-002", "DOC-HOSP-004", "DOC-PAPER-002", "DOC-PAPER-005", "DOC-NEWS-002", "DOC-GUIDE-002"],
    relationChain: "의료기기 → 병원(삼성서울/분당서울대) → 논문 → 가이드라인"
  }
]

// 데모 데이터 요약 정보
export const mockDataSummary = {
  totalFiles: 7,
  fileTypes: {
    "CSV": ["hospital_registry.csv", "medical_devices.csv", "care_guidelines.csv"],
    "JSON": ["clinical_trials.json", "normalization_map.json"],
    "JSONL": ["research_papers.jsonl"],
    "TXT": ["news_reports.txt"]
  },
  dataCategories: {
    "병원": { count: 6, documents: ["DOC-HOSP-001", "DOC-HOSP-002", "DOC-HOSP-003", "DOC-HOSP-004", "DOC-HOSP-005", "DOC-HOSP-006"] },
    "임상시험": { count: 2, documents: ["DOC-TRIAL-001", "DOC-TRIAL-002"] },
    "의료기기": { count: 3, documents: ["DOC-DEVICE-001", "DOC-DEVICE-002", "DOC-DEVICE-003"] },
    "연구논문": { count: 5, documents: ["DOC-PAPER-001", "DOC-PAPER-002", "DOC-PAPER-003", "DOC-PAPER-004", "DOC-PAPER-005"] },
    "뉴스": { count: 3, documents: ["DOC-NEWS-001", "DOC-NEWS-002", "DOC-NEWS-003"] },
    "가이드라인": { count: 4, documents: ["DOC-GUIDE-001", "DOC-GUIDE-002", "DOC-GUIDE-003", "DOC-GUIDE-004"] }
  },
  relationClusters: {
    "A-대장암-AI선별": {
      name: "세브란스병원 대장암 AI 환자선별",
      core_entities: ["세브란스병원", "대장암", "OncoScreen Match"],
      documents: ["DOC-HOSP-001", "DOC-TRIAL-001", "DOC-DEVICE-003", "DOC-PAPER-001", "DOC-PAPER-004", "DOC-NEWS-001", "DOC-GUIDE-001"]
    },
    "B-당뇨-CGM": {
      name: "다기관 제2형 당뇨병 CGM 관리",
      core_entities: ["삼성서울병원", "분당서울대병원", "제2형 당뇨병", "GlucoWatch CGM Pro"],
      documents: ["DOC-HOSP-002", "DOC-HOSP-004", "DOC-DEVICE-002", "DOC-PAPER-002", "DOC-PAPER-005", "DOC-NEWS-002", "DOC-GUIDE-002"]
    },
    "C-부정맥-웨어러블ECG": {
      name: "다기관 부정맥 웨어러블 ECG 모니터링",
      core_entities: ["서울대병원", "강남세브란스", "용인세브란스", "부정맥", "CardioPatch One"],
      documents: ["DOC-HOSP-003", "DOC-HOSP-005", "DOC-HOSP-006", "DOC-TRIAL-002", "DOC-DEVICE-001", "DOC-PAPER-003", "DOC-NEWS-003", "DOC-GUIDE-003"]
    }
  },
  normalizationStats: {
    total_rules: 18,
    categories: ["병원명", "질병명", "기술명", "기관유형"],
    example_normalizations: [
      "연세의료원 세브란스병원 → 세브란스병원",
      "당뇨 → 제2형 당뇨병",
      "CGM → GlucoWatch CGM Pro",
      "AI 선별 시스템 → OncoScreen Match"
    ]
  }
}

export const mockWorkflowEvents = [
  {
    step: 1,
    status: "processing" as const,
    message: "📥 의료 데이터 파일 수신 중...",
    timestamp: Date.now() / 1000
  },
  {
    step: 1,
    status: "completed" as const,
    message: "✅ 데이터 수신 완료 (7개 파일, 이기종 데이터)",
    timestamp: Date.now() / 1000 + 1,
    data: {
      files: 7,
      formats: ["CSV", "JSON", "JSONL", "TXT"],
      types: ["병원등록정보", "임상시험", "의료기기", "논문", "뉴스", "가이드라인", "정규화사전"],
      total_size: "6.8 MB"
    }
  },
  {
    step: 2,
    status: "processing" as const,
    message: "🔍 이기종 데이터 스키마 분석 중...",
    timestamp: Date.now() / 1000 + 2
  },
  {
    step: 2,
    status: "completed" as const,
    message: "✅ 스키마 분석 및 액티브 메타데이터 추출 완료",
    timestamp: Date.now() / 1000 + 4,
    data: {
      detected_schemas: 7,
      extracted_keys: 42,
      medical_entities: ["병원", "질병", "임상시험", "의료기기", "논문", "뉴스"],
      schema_confidence: 0.96,
      data_types: 18
    }
  },
  {
    step: 3,
    status: "processing" as const,
    message: "🔨 의료 지식 그래프 구축 중...",
    timestamp: Date.now() / 1000 + 5
  },
  {
    step: 3,
    status: "completed" as const,
    message: "✅ 지식 그래프 구축 완료 (다중 관계 연결)",
    timestamp: Date.now() / 1000 + 8,
    data: {
      nodes: 4820,
      relationships: 7340,
      relation_types: ["CONDUCTED_AT", "TARGETS_DISEASE", "VALIDATES_TECHNOLOGY", "LED_BY", "DEPLOYED_AT"],
      graph_density: 0.78
    }
  },
  {
    step: 4,
    status: "processing" as const,
    message: "🔄 데이터 정규화 및 통합 중...",
    timestamp: Date.now() / 1000 + 9
  },
  {
    step: 4,
    status: "completed" as const,
    message: "✅ 데이터 정규화 완료 (의료용어 표준화)",
    timestamp: Date.now() / 1000 + 12,
    data: {
      normalized_entities: 1247,
      normalization_rules: 156,
      clusters: 89,
      merged_duplicates: ["연세의료원→세브란스병원", "당뇨→제2형 당뇨병", "CGM→GlucoWatch CGM Pro"],
      enrichment_rate: 0.91
    }
  },
  {
    step: 5,
    status: "processing" as const,
    message: "🎯 의료 데이터 검색 인덱스 구축 중...",
    timestamp: Date.now() / 1000 + 13
  },
  {
    step: 5,
    status: "completed" as const,
    message: "✅ 검색 인덱스 최적화 완료 (의미론적 검색 지원)",
    timestamp: Date.now() / 1000 + 15,
    data: {
      vector_dimensions: 768,
      index_size: "223 MB",
      indexed_documents: 27,
      semantic_similarity_enabled: true
    }
  },
  {
    step: 6,
    status: "completed" as const,
    message: "🎉 의료 데이터 파이프라인 실행 성공!",
    timestamp: Date.now() / 1000 + 16,
    data: {
      total_time: "16.2s",
      success: true,
      processed_files: 7,
      total_documents: 27,
      relation_chains: ["병원→임상시험→논문→뉴스→가이드", "병원→의료기기→논문", "질병→기술→가이드"]
    }
  }
]
