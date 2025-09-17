import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@lib/chat";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const message = typeof payload.message === "string" ? payload.message : "";
    const context = payload.context ?? {};
    const response = await generateChatResponse({ message, context });
    return NextResponse.json(response);
  } catch (error) {
    console.error("chat-error", error);
    return NextResponse.json(
      {
        answer:
          "Something went wrong while I tried to help. Please try again or adjust your question.",
        citations: [],
        actions: [],
        confidence: "low",
      },
      { status: 500 }
    );
  }
}
