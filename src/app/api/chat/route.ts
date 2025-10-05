import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Fetch past conversations for context
    let history: { role: string; parts: { text: string }[] }[] = []; // Corrected type for history
    const { data: pastConversations } = await supabase
      .from("conversations")
      .select("message, response")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(10); // Limit to last 10 exchanges

    if (pastConversations && pastConversations.length > 0) {
      history = pastConversations.flatMap(conv => [
        { role: 'user', parts: [{ text: conv.message }] }, // 'parts' is an array of objects with 'text'
        { role: 'model', parts: [{ text: conv.response }] }, // 'parts' is an array of objects with 'text'
      ]);
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
      systemInstruction: 'You are an AI assistant that remembers past conversations to provide context-aware responses. Use the provided context to inform your replies.'
    });

    // Start a chat session
    const chat = model.startChat({
      history: history,
    });

    // Send the current message
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Optionally save to Supabase
    await supabase.from("conversations").insert({
      user_id: userId,
      message,
      response: text,
      created_at: new Date().toISOString(),
    });

    // Return the response
    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Handle different types of errors
    if (error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    if (error.message?.includes('RATE_LIMIT')) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    if (error.message?.includes('SAFETY')) {
      return NextResponse.json({
        error: 'Content blocked by safety filters',
        fallback: "I understand you're going through a difficult time. While I can't respond to that specific message, I want you to know that your feelings are valid and support is available. Please consider reaching out to a mental health professional if you need immediate help."
      }, { status: 400 });
    }

    // Generic error response
    return NextResponse.json({
      error: 'Failed to generate response',
      fallback: "I'm sorry, I'm having technical difficulties right now. Your feelings are important, and if you're in crisis, please reach out to a mental health professional or crisis hotline immediately."
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}