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
- complianceStatus ("Compliant" | "Non-Compliant" | "Under Review")

Query: "${query}"

Only output a JSON object in key-value form ONLY, only provide a key if you are certain of its value, DO NOT PROVIDE ANY EXPLANATION, ONLY THE JSON OBJECT.
`;

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
    complianceStatus: z
      .enum(["Compliant", "Non-Compliant", "Under Review"])
      .optional(),
  }),
  execute: async (params) => {
    let filters: Partial<SupplierSearchParams> = {};

    // Check if query is provided
    if (!params.query) {
      throw new Error("Query parameter is required");
    }
    // Generate the query to pass to Gemini model
    let { text: geminiResponse } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      prompt: prompt(params.query),
    });

    geminiResponse = cleanupText(geminiResponse);

    // Try to parse the response as JSON
    try {
      // Ensure the response is a valid JSON (add double quotes around keys if necessary)
      const parsed = JSON.parse(JSON.stringify(geminiResponse));
      filters = { ...parsed };
    } catch (e) {
      console.log(e);
      console.error("Failed to parse Gemini response:", geminiResponse);
    }

    // Manual overrides from the parameters
    filters = {
      ...filters,
      ...Object.fromEntries(
        Object.entries(params).filter(([k]) => k !== "query")
      ),
    };

    // Query the supplier database using the generated filters
    const results = searchSuppliers(filters);

    return JSON.stringify({
      filtersUsed: filters,
      suppliers: results.suppliers,
      count: results.count,
      query: params.query,
      role: "tool",
      name: "supplierSearch",
    });
    return results.suppliers;
  },
});
