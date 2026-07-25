import { NextRequest, NextResponse } from "next/server";
import { generateGuidance } from "@/lib/gemini";
import type { GuidanceRequest } from "@/types/recovery";

export async function POST(request: NextRequest) {
  try {
    const body: GuidanceRequest = await request.json();

    // Validate profile
    if (!body.profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Recovery profile is required.",
        },
        { status: 400 }
      );
    }

    // Validate conversation
    if (
      !Array.isArray(body.conversation) ||
      body.conversation.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Conversation is required.",
        },
        { status: 400 }
      );
    }

    // Validate latest message
    const latestMessage = body.conversation.at(-1);

    if (
      !latestMessage ||
      latestMessage.role !== "user" ||
      !latestMessage.message.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Latest conversation entry must be a user message.",
        },
        { status: 400 }
      );
    }

    const guidance = await generateGuidance(body);

    return NextResponse.json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate recovery guidance.",
      },
      { status: 500 }
    );
  }
}