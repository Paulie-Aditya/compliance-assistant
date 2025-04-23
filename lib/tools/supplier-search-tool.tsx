import { generateText, tool } from "ai";
import { z } from "zod";
import { searchSuppliers } from "@/lib/data/supplier-queries";
import { google } from "@ai-sdk/google";
import { cleanupText } from "@/lib/utils";
import type { SupplierSearchParams } from "@/lib/types";

const prompt = (query: string) => `
You are a supplier query parser. Convert this natural language query into a JSON object with the following optional fields:

- minRiskScore (number)
- maxRiskScore (number)
- location (string)
- industry (string)
- riskCategory (string)
- complianceStatus (array of "Compliant" | "Non-Compliant" | "Under Review")
- sortBy ("riskScore" | "name")
- sortOrder ("asc" | "desc")
- limit (integer)

Assume minRiskScore to be 0 unless specified in query, and assume maxRiskScore to be 10 unless specified in query

Query: "${query}"

Only output a JSON object in key-value form ONLY, only provide a key if you are certain of its value, DO NOT PROVIDE ANY EXPLANATION, ONLY THE JSON OBJECT.
`;

const ComplianceEnum = z.enum(["Compliant", "Non-Compliant", "Under Review"]);
export const supplierSearchTool = tool({
  description:
    "Search suppliers using structured filters or natural language queries.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "Natural language query like 'Suppliers in Asia with high risk'"
      ),
    minRiskScore: z.number().min(0).max(10).optional(),
    maxRiskScore: z.number().min(0).max(10).optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    riskCategory: z.string().optional(),
    complianceStatus: z.array(ComplianceEnum).optional(), // now an array
    sortBy: z.enum(["riskScore", "name"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    limit: z.number().int().min(1).optional(),
  }),
  execute: async (params) => {
    let filters: Partial<SupplierSearchParams> = {};

    // Check if query is provided
    if (!params.query) {
      throw new Error("Query parameter is required");
    }
    // Generate the query to pass to Gemini model
    const { text: geminiResponse } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: prompt(params.query),
    });

    const cleaned = cleanupText(geminiResponse)
      .trim()
      .replace(/^```(?:json)?\s*/, "")
      .replace(/```$/, "")
      .trim();
    try {
      const parsed = JSON.parse(cleaned);
      filters = parsed; // now an object, not a string
    } catch (err) {
      console.error("Failed to JSON.parse Gemini output:", cleaned, err);
    }
    filters = {
      ...filters,
      ...Object.fromEntries(
        Object.entries(params).filter(([k]) => k !== "query")
      ),
    };

    // Query the supplier database using the generated filters
    const results = searchSuppliers(filters);
    let sliced = results.suppliers;
    if (filters.limit !== undefined) {
      sliced = sliced.slice(0, filters.limit);
    }
    return {
      filtersUsed: filters,
      suppliers: sliced,
      count: results.count,
      query: params.query,
      role: "tool",
      name: "supplierSearch",
    };
  },
});
