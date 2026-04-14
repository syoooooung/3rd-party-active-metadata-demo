// Mock data for demo purposes

export const mockConfig = {
  x_token: "demo-token"
}

export const mockSearchResult = {
  documents: [
    {
      doc_id: "enterprise_customer_0001",
      score: 0.96,
      description: "Global Technology Solutions Inc. - Enterprise customer with $2.5M ARR, 500+ licenses, Fortune 500 company specializing in cloud infrastructure and AI solutions. Contract renewal: Q2 2025"
    },
    {
      doc_id: "enterprise_customer_0002",
      score: 0.93,
      description: "NextGen Financial Services Ltd. - Premium tier customer with $1.8M ARR, 350 licenses, leading fintech provider with international presence across 15 countries. Strong growth trajectory: +45% YoY"
    },
    {
      doc_id: "enterprise_customer_0003",
      score: 0.89,
      description: "HealthTech Innovations Corp. - Healthcare sector enterprise with $1.2M ARR, 280 licenses, pioneering digital health solutions. Multiple successful integrations with major hospital networks"
    },
    {
      doc_id: "mid_market_0045",
      score: 0.85,
      description: "DataSync Analytics - Mid-market segment with $450K ARR, 120 licenses, rapidly growing SaaS platform for business intelligence. Recently expanded to 3 new regions"
    },
    {
      doc_id: "enterprise_customer_0004",
      score: 0.82,
      description: "RetailMax Corporation - Retail sector leader with $980K ARR, 200 licenses, omnichannel retail platform. Strong seasonal performance with 150% increase during Q4"
    }
  ],
  graph: {
    nodes: [
      {
        id: "doc_enterprise_0001",
        labels: ["Document", "Enterprise"],
        properties: { id: "enterprise_customer_0001", name: "Global Technology Solutions Inc.", tier: "Enterprise" }
      },
      {
        id: "key_annual_revenue",
        labels: ["Key", "Financial"],
        properties: { name: "Annual Recurring Revenue" }
      },
      {
        id: "value_2500000",
        labels: ["Value", "Revenue"],
        properties: { name: "$2.5M", value: 2500000 }
      },
      {
        id: "key_license_count",
        labels: ["Key", "Usage"],
        properties: { name: "License Count" }
      },
      {
        id: "value_500",
        labels: ["Value", "Count"],
        properties: { name: "500 licenses", value: 500 }
      },
      {
        id: "key_industry",
        labels: ["Key", "Category"],
        properties: { name: "Industry Sector" }
      },
      {
        id: "value_technology",
        labels: ["Value", "Category"],
        properties: { name: "Technology & Cloud Services" }
      },
      {
        id: "doc_enterprise_0002",
        labels: ["Document", "Enterprise"],
        properties: { id: "enterprise_customer_0002", name: "NextGen Financial Services Ltd.", tier: "Premium" }
      },
      {
        id: "value_1800000",
        labels: ["Value", "Revenue"],
        properties: { name: "$1.8M", value: 1800000 }
      },
      {
        id: "value_350",
        labels: ["Value", "Count"],
        properties: { name: "350 licenses", value: 350 }
      },
      {
        id: "value_fintech",
        labels: ["Value", "Category"],
        properties: { name: "Financial Technology" }
      },
      {
        id: "key_growth_rate",
        labels: ["Key", "Metrics"],
        properties: { name: "YoY Growth Rate" }
      },
      {
        id: "value_45_percent",
        labels: ["Value", "Percentage"],
        properties: { name: "45%", value: 0.45 }
      }
    ],
    relationships: [
      { start: "doc_enterprise_0001", end: "key_annual_revenue", type: "HAS_ATTRIBUTE" },
      { start: "key_annual_revenue", end: "value_2500000", type: "HAS_VALUE" },
      { start: "doc_enterprise_0001", end: "key_license_count", type: "HAS_ATTRIBUTE" },
      { start: "key_license_count", end: "value_500", type: "HAS_VALUE" },
      { start: "doc_enterprise_0001", end: "key_industry", type: "HAS_ATTRIBUTE" },
      { start: "key_industry", end: "value_technology", type: "HAS_VALUE" },
      { start: "doc_enterprise_0002", end: "key_annual_revenue", type: "HAS_ATTRIBUTE" },
      { start: "key_annual_revenue", end: "value_1800000", type: "HAS_VALUE" },
      { start: "doc_enterprise_0002", end: "key_license_count", type: "HAS_ATTRIBUTE" },
      { start: "key_license_count", end: "value_350", type: "HAS_VALUE" },
      { start: "doc_enterprise_0002", end: "key_industry", type: "HAS_ATTRIBUTE" },
      { start: "key_industry", end: "value_fintech", type: "HAS_VALUE" },
      { start: "doc_enterprise_0002", end: "key_growth_rate", type: "HAS_ATTRIBUTE" },
      { start: "key_growth_rate", end: "value_45_percent", type: "HAS_VALUE" },
      { start: "value_technology", end: "value_fintech", type: "SIMILAR_SECTOR" }
    ]
  }
}

export const mockRelationDiscovery = {
  source_doc_id: "customer_project_A247",
  source_doc_info: {
    key_values: {
      "Project Name": ["Digital Transformation Initiative"],
      "Customer": ["Acme Corporation"],
      "Budget": ["$850,000"],
      "Start Date": ["2024-01-15"],
      "Team Size": ["12 members"],
      "Technology Stack": ["React", "Node.js", "PostgreSQL", "AWS"],
      "Project Manager": ["Sarah Johnson"],
      "Status": ["Active"],
      "Completion": ["65%"]
    },
    important_keys: ["Project Name", "Customer", "Technology Stack", "Project Manager"],
    important_values: {
      "Customer": ["Acme Corporation"],
      "Technology Stack": ["React", "Node.js", "PostgreSQL", "AWS"],
      "Project Manager": ["Sarah Johnson"]
    }
  },
  candidates: [
    {
      doc_id: "project_invoice_A247_Q1",
      score: 0.97,
      matched_keys: ["Project Name", "Customer", "Budget", "Project Manager"],
      matched_values: {
        "Project Name": "Digital Transformation Initiative",
        "Customer": "Acme Corporation",
        "Budget": "$850,000",
        "Project Manager": "Sarah Johnson"
      },
      breakdown: {
        aligned_attribute: 0.96,
        typed_value_match: 0.98,
        graph_structure: 0.95,
        document_semantic: 0.97
      }
    },
    {
      doc_id: "technical_specification_A247",
      score: 0.94,
      matched_keys: ["Project Name", "Technology Stack", "Team Size"],
      matched_values: {
        "Project Name": "Digital Transformation Initiative",
        "Technology Stack": ["React", "Node.js", "PostgreSQL", "AWS"],
        "Team Size": "12 members"
      },
      breakdown: {
        aligned_attribute: 0.93,
        typed_value_match: 0.96,
        graph_structure: 0.92,
        document_semantic: 0.94
      }
    },
    {
      doc_id: "project_status_report_March",
      score: 0.91,
      matched_keys: ["Customer", "Project Manager", "Status", "Completion"],
      matched_values: {
        "Customer": "Acme Corporation",
        "Project Manager": "Sarah Johnson",
        "Status": "Active",
        "Completion": "65%"
      },
      breakdown: {
        aligned_attribute: 0.89,
        typed_value_match: 0.94,
        graph_structure: 0.88,
        document_semantic: 0.92
      }
    },
    {
      doc_id: "resource_allocation_Q1_2024",
      score: 0.87,
      matched_keys: ["Project Manager", "Team Size", "Start Date"],
      matched_values: {
        "Project Manager": "Sarah Johnson",
        "Team Size": "12 members",
        "Start Date": "2024-01-15"
      },
      breakdown: {
        aligned_attribute: 0.85,
        typed_value_match: 0.90,
        graph_structure: 0.84,
        document_semantic: 0.88
      }
    },
    {
      doc_id: "customer_contract_Acme_2024",
      score: 0.84,
      matched_keys: ["Customer", "Budget", "Start Date"],
      matched_values: {
        "Customer": "Acme Corporation",
        "Budget": "$850,000",
        "Start Date": "2024-01-15"
      },
      breakdown: {
        aligned_attribute: 0.82,
        typed_value_match: 0.87,
        graph_structure: 0.81,
        document_semantic: 0.85
      }
    },
    {
      doc_id: "technology_roadmap_2024",
      score: 0.78,
      matched_keys: ["Technology Stack"],
      matched_values: {
        "Technology Stack": ["React", "Node.js", "AWS"]
      },
      breakdown: {
        aligned_attribute: 0.75,
        typed_value_match: 0.82,
        graph_structure: 0.73,
        document_semantic: 0.79
      }
    }
  ],
  search_strategy: "Identifying related documents based on critical project identifiers (Project Name, Customer, Technology Stack, Project Manager). Prioritizing exact matches on customer name and project manager, with strong weighting on technology stack alignment for technical documentation discovery.",
  important_keys: ["Project Name", "Customer", "Technology Stack", "Project Manager"]
}

export const mockWorkflowEvents = [
  {
    step: 1,
    status: "processing" as const,
    message: "📥 Receiving data file...",
    timestamp: Date.now() / 1000
  },
  {
    step: 1,
    status: "completed" as const,
    message: "✅ Data ingestion complete (1,250 records)",
    timestamp: Date.now() / 1000 + 1,
    data: { records: 1250, format: "JSONL", size: "4.2 MB" }
  },
  {
    step: 2,
    status: "processing" as const,
    message: "🔍 Analyzing data schema...",
    timestamp: Date.now() / 1000 + 2
  },
  {
    step: 2,
    status: "completed" as const,
    message: "✅ Schema analysis complete",
    timestamp: Date.now() / 1000 + 3,
    data: { detected_keys: 28, schema_confidence: 0.97, data_types: 12 }
  },
  {
    step: 3,
    status: "processing" as const,
    message: "🔨 Building knowledge graph...",
    timestamp: Date.now() / 1000 + 4
  },
  {
    step: 3,
    status: "completed" as const,
    message: "✅ Knowledge graph constructed",
    timestamp: Date.now() / 1000 + 6,
    data: { nodes: 3850, relationships: 5420, graph_density: 0.73 }
  },
  {
    step: 4,
    status: "processing" as const,
    message: "🔄 Normalizing and enriching data...",
    timestamp: Date.now() / 1000 + 7
  },
  {
    step: 4,
    status: "completed" as const,
    message: "✅ Data normalization complete",
    timestamp: Date.now() / 1000 + 9,
    data: { normalized_values: 892, clusters: 67, enrichment_rate: 0.85 }
  },
  {
    step: 5,
    status: "processing" as const,
    message: "🎯 Building search indexes...",
    timestamp: Date.now() / 1000 + 10
  },
  {
    step: 5,
    status: "completed" as const,
    message: "✅ Search indexes optimized",
    timestamp: Date.now() / 1000 + 11,
    data: { vector_dimensions: 768, index_size: "156 MB" }
  },
  {
    step: 6,
    status: "completed" as const,
    message: "🎉 Pipeline execution successful!",
    timestamp: Date.now() / 1000 + 12,
    data: { total_time: "12.4s", success: true, processed_records: 1250 }
  }
]
