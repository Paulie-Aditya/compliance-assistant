import { Tool } from "ai";
import { searchSuppliers } from "@/lib/data/supplier-queries";
import type { SupplierSearchParams } from "@/lib/types";

export const supplierSearchTool: Tool = {
  description:
    "Search for suppliers based on risk criteria, location, industry, and other parameters",
  parameters: {
    type: "object",
    properties: {
      minRiskScore: {
        type: "number",
        description: "Minimum risk score (1-10) to filter suppliers",
      },
      maxRiskScore: {
        type: "number",
        description: "Maximum risk score (1-10) to filter suppliers",
      },
      location: {
        type: "string",
        description: "Filter suppliers by location (country or region)",
      },
      industry: {
        type: "string",
        description: "Filter suppliers by industry sector",
      },
      riskCategory: {
        type: "string",
        description:
          "Filter suppliers by risk category (e.g., 'Data Security', 'Environmental')",
      },
      complianceStatus: {
        type: "string",
        enum: ["Compliant", "Non-Compliant", "Under Review"],
        description: "Filter suppliers by compliance status",
      },
      query: {
        type: "string",
        description:
          "General search query to find suppliers by name or description",
      },
    },
    required: [],
  },
  execute: async (params: SupplierSearchParams) => {
    try {
      if (
        params.minRiskScore !== undefined &&
        (params.minRiskScore < 0 || params.minRiskScore > 10)
      ) {
        throw new Error("minRiskScore must be between 0 and 10");
      }

      if (
        params.maxRiskScore !== undefined &&
        (params.maxRiskScore < 0 || params.maxRiskScore > 10)
      ) {
        throw new Error("maxRiskScore must be between 0 and 10");
      }

      if (
        params.minRiskScore !== undefined &&
        params.maxRiskScore !== undefined &&
        params.minRiskScore > params.maxRiskScore
      ) {
        throw new Error("minRiskScore cannot be greater than maxRiskScore");
      }

      // Execute search
      const results = searchSuppliers(params);

      return {
        suppliers: results.suppliers,
        count: results.count,
        query: results.query,
      };
    } catch (error) {
      console.error("Error in supplier search tool:", error);
      throw error;
    }
  },
};
