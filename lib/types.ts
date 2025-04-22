export interface Supplier {
    id: string
    name: string
    riskScore: number
    riskCategories: string[]
    location: string
    industry: string
    lastAuditDate: string
    complianceStatus: "Compliant" | "Non-Compliant" | "Under Review"
    description: string
  }
  
  export interface SupplierResult {
    id: string
    name: string
    riskScore: number
    riskCategories: string[]
    location: string
    industry: string
  }
  
  export interface SupplierSearchParams {
    minRiskScore?: number
    maxRiskScore?: number
    location?: string
    industry?: string
    riskCategory?: string
    complianceStatus?: string
    query?: string
  }
  
  export interface SupplierSearchResult {
    suppliers: SupplierResult[]
    count: number
    query: SupplierSearchParams
  }
  