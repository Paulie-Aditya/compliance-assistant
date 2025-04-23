import { suppliers } from "./suppliers";
import type {
  SupplierSearchParams,
  SupplierSearchResult,
  SupplierResult,
} from "@/lib/types";

export function searchSuppliers(
  params: SupplierSearchParams
): SupplierSearchResult {
  let filteredSuppliers = [...suppliers];

  // Filter by risk score range
  if (params.minRiskScore !== undefined) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) => supplier.riskScore >= params.minRiskScore!
    );
  }

  if (params.maxRiskScore !== undefined) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) => supplier.riskScore <= params.maxRiskScore!
    );
  }

  // Filter by location (case-insensitive partial match)
  if (params.location) {
    const locationLower = params.location.toLowerCase();
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.location.toLowerCase().includes(locationLower)
    );
  }

  // Filter by industry (case-insensitive partial match)
  if (params.industry) {
    const industryLower = params.industry.toLowerCase();
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.industry.toLowerCase().includes(industryLower)
    );
  }

  // Filter by risk category (case-insensitive partial match)
  if (params.riskCategory) {
    const categoryLower = params.riskCategory.toLowerCase();
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.riskCategories.some((category) =>
        category.toLowerCase().includes(categoryLower)
      )
    );
  }

  // Filter by compliance status (exact match)
  if (params.complianceStatus && params.complianceStatus.length > 0) {
    const validStatuses = new Set(params.complianceStatus);
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      validStatuses.has(supplier.complianceStatus)
    );
  }

  // Filter by general query (search across name and description)
  if (params.query) {
    const queryLower = params.query.toLowerCase();
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(queryLower) ||
        supplier.description.toLowerCase().includes(queryLower)
    );
  }

  if (params.sortBy) {
    const order = params.sortOrder === "desc" ? -1 : 1;
    filteredSuppliers.sort((a, b) => {
      const aVal = a[params.sortBy as keyof typeof a];
      const bVal = b[params.sortBy as keyof typeof b];
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });
  }

  if (params.limit !== undefined) {
    filteredSuppliers = filteredSuppliers.slice(0, params.limit);
  }

  // Map to result format (omitting sensitive fields)
  const results: SupplierResult[] = filteredSuppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name,
    riskScore: supplier.riskScore,
    riskCategories: supplier.riskCategories,
    location: supplier.location,
    industry: supplier.industry,
  }));

  return {
    suppliers: results,
    count: results.length,
    query: params,
  };
}
