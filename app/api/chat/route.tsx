import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { supplierSearchTool } from "@/lib/tools/supplier-search-tool";
import { generateText } from "ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
        }
      );
    }
    const { text } = await generateText({
      model: google("models/gemini-2.0-flash-exp"),
      messages,
      // tools: { supplierSearch: supplierSearchTool },
      providerOptions: {
        google: { stream: false },
      },
    });
    console.log(text);
    return Response.json({ text });
  } catch (error) {
    console.error("Chat route error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
