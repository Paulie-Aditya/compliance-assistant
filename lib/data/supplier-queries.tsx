import { suppliers } from "./suppliers"
import type { SupplierSearchParams, SupplierSearchResult, SupplierResult } from "@/lib/types"

export function searchSuppliers(params: SupplierSearchParams): SupplierSearchResult {
  let filteredSuppliers = [...suppliers]

  // Filter by risk score range
  if (params.minRiskScore !== undefined) {
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.riskScore >= params.minRiskScore!)
  }

  if (params.maxRiskScore !== undefined) {
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.riskScore <= params.maxRiskScore!)
  }

  // Filter by location (case-insensitive partial match)
  if (params.location) {
    const locationLower = params.location.toLowerCase()
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.location.toLowerCase().includes(locationLower))
  }

  // Filter by industry (case-insensitive partial match)
  if (params.industry) {
    const industryLower = params.industry.toLowerCase()
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.industry.toLowerCase().includes(industryLower))
  }

  // Filter by risk category (case-insensitive partial match)
  if (params.riskCategory) {
    const categoryLower = params.riskCategory.toLowerCase()
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.riskCategories.some((category) => category.toLowerCase().includes(categoryLower)),
    )
  }

  // Filter by compliance status (exact match)
  if (params.complianceStatus) {
    filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.complianceStatus === params.complianceStatus)
  }

  // Filter by general query (search across name and description)
  if (params.query) {
    const queryLower = params.query.toLowerCase()
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(queryLower) || supplier.description.toLowerCase().includes(queryLower),
    )
  }

  // Map to result format (omitting sensitive fields)
  const results: SupplierResult[] = filteredSuppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    riskScore: supplier.riskScore,
    riskCategories: supplier.riskCategories,
    location: supplier.location,
    industry: supplier.industry,
  }))

  return {
    suppliers: results,
    count: results.length,
    query: params,
  }
}
