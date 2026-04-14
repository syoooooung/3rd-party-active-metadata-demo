// Mock data for demo purposes

export const mockConfig = {
  x_token: "demo-token"
}

export const mockSearchResult = {
  documents: [
    {
      doc_id: "hospital_001",
      score: 0.92,
      description: "서울대학교병원 - 병상수 150개, 의료진 500명, 종합병원"
    },
    {
      doc_id: "hospital_002",
      score: 0.87,
      description: "연세세브란스병원 - 병상수 180개, 의료진 600명, 종합병원"
    },
    {
      doc_id: "hospital_003",
      score: 0.81,
      description: "삼성서울병원 - 병상수 200개, 의료진 700명, 종합병원"
    }
  ],
  graph: {
    nodes: [
      {
        id: "doc_hospital_001",
        labels: ["Document"],
        properties: { id: "hospital_001", name: "서울대학교병원" }
      },
      {
        id: "key_병상수",
        labels: ["Key"],
        properties: { name: "병상수" }
      },
      {
        id: "value_150",
        labels: ["Value"],
        properties: { name: "150개" }
      },
      {
        id: "key_의료진",
        labels: ["Key"],
        properties: { name: "의료진" }
      },
      {
        id: "value_500",
        labels: ["Value"],
        properties: { name: "500명" }
      },
      {
        id: "doc_hospital_002",
        labels: ["Document"],
        properties: { id: "hospital_002", name: "연세세브란스병원" }
      },
      {
        id: "value_180",
        labels: ["Value"],
        properties: { name: "180개" }
      },
      {
        id: "value_600",
        labels: ["Value"],
        properties: { name: "600명" }
      }
    ],
    relationships: [
      { start: "doc_hospital_001", end: "key_병상수", type: "HAS_KEY" },
      { start: "key_병상수", end: "value_150", type: "HAS_VALUE" },
      { start: "doc_hospital_001", end: "key_의료진", type: "HAS_KEY" },
      { start: "key_의료진", end: "value_500", type: "HAS_VALUE" },
      { start: "doc_hospital_002", end: "key_병상수", type: "HAS_KEY" },
      { start: "key_병상수", end: "value_180", type: "HAS_VALUE" },
      { start: "doc_hospital_002", end: "key_의료진", type: "HAS_KEY" },
      { start: "key_의료진", end: "value_600", type: "HAS_VALUE" }
    ]
  }
}

export const mockRelationDiscovery = {
  source_doc_id: "patient_001",
  source_doc_info: {
    key_values: {
      "환자명": ["김철수"],
      "진료과": ["내과"],
      "진단명": ["고혈압", "당뇨"],
      "담당의": ["박의사"],
      "입원일": ["2024-01-15"]
    },
    important_keys: ["환자명", "진료과", "담당의"],
    important_values: {
      "환자명": ["김철수"],
      "진료과": ["내과"]
    }
  },
  candidates: [
    {
      doc_id: "medical_record_001",
      score: 0.95,
      matched_keys: ["환자명", "진료과", "담당의"],
      matched_values: {
        "환자명": "김철수",
        "진료과": "내과",
        "담당의": "박의사"
      },
      breakdown: {
        aligned_attribute: 0.92,
        typed_value_match: 0.96,
        graph_structure: 0.88,
        document_semantic: 0.90
      }
    },
    {
      doc_id: "prescription_001",
      score: 0.88,
      matched_keys: ["환자명", "진단명"],
      matched_values: {
        "환자명": "김철수",
        "진단명": ["고혈압", "당뇨"]
      },
      breakdown: {
        aligned_attribute: 0.85,
        typed_value_match: 0.92,
        graph_structure: 0.82,
        document_semantic: 0.87
      }
    },
    {
      doc_id: "lab_result_001",
      score: 0.82,
      matched_keys: ["환자명", "진료과"],
      matched_values: {
        "환자명": "김철수",
        "진료과": "내과"
      },
      breakdown: {
        aligned_attribute: 0.80,
        typed_value_match: 0.85,
        graph_structure: 0.78,
        document_semantic: 0.83
      }
    },
    {
      doc_id: "billing_001",
      score: 0.75,
      matched_keys: ["환자명", "입원일"],
      matched_values: {
        "환자명": "김철수",
        "입원일": "2024-01-15"
      },
      breakdown: {
        aligned_attribute: 0.72,
        typed_value_match: 0.78,
        graph_structure: 0.71,
        document_semantic: 0.76
      }
    }
  ],
  search_strategy: "중요 키(환자명, 진료과, 담당의)를 기반으로 검색하여 높은 신뢰도의 관계를 발굴합니다. 의료 기록 도메인에서 환자 식별자와 진료 정보를 중심으로 매칭합니다.",
  important_keys: ["환자명", "진료과", "담당의"]
}

export const mockWorkflowEvents = [
  {
    step: 1,
    status: "processing" as const,
    message: "📥 데이터 파일 수신 중...",
    timestamp: Date.now() / 1000
  },
  {
    step: 1,
    status: "completed" as const,
    message: "✅ 데이터 수신 완료 (250 records)",
    timestamp: Date.now() / 1000 + 1,
    data: { records: 250, format: "JSONL" }
  },
  {
    step: 2,
    status: "processing" as const,
    message: "🔍 데이터 스키마 분석 중...",
    timestamp: Date.now() / 1000 + 2
  },
  {
    step: 2,
    status: "completed" as const,
    message: "✅ 스키마 분석 완료",
    timestamp: Date.now() / 1000 + 3,
    data: { detected_keys: 12, schema_confidence: 0.95 }
  },
  {
    step: 3,
    status: "processing" as const,
    message: "🔨 Key-Value 그래프 생성 중...",
    timestamp: Date.now() / 1000 + 4
  },
  {
    step: 3,
    status: "completed" as const,
    message: "✅ 그래프 생성 완료",
    timestamp: Date.now() / 1000 + 5,
    data: { nodes: 850, relationships: 1200 }
  },
  {
    step: 4,
    status: "processing" as const,
    message: "🔄 데이터 정규화 중...",
    timestamp: Date.now() / 1000 + 6
  },
  {
    step: 4,
    status: "completed" as const,
    message: "✅ 정규화 완료",
    timestamp: Date.now() / 1000 + 7,
    data: { normalized_values: 350, clusters: 45 }
  },
  {
    step: 5,
    status: "completed" as const,
    message: "🎉 파이프라인 실행 완료!",
    timestamp: Date.now() / 1000 + 8,
    data: { total_time: "8.2s", success: true }
  }
]
