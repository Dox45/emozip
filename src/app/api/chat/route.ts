// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// // Types
// interface ChatMessage {
//   role: "user" | "model";
//   parts: Array<{ text: string }>;
// }

// interface ConversationRecord {
//   message: string;
//   response: string;
//   created_at?: string;
// }

// interface ChatRequestBody {
//   message: string;
//   userId: string;
// }

// interface ChatResponse {
//   response: string;
//   timestamp: string;
// }

// interface ErrorResponse {
//   error: string;
//   details?: string;
//   fallback?: string;
// }

// // Constants
// const MAX_HISTORY_ITEMS = 10;
// const DEFAULT_TEMPERATURE = 0.7;
// const DEFAULT_TOP_P = 0.8;
// const DEFAULT_TOP_K = 40;
// const DEFAULT_MAX_TOKENS = 1024;

// // System instruction constant
// const SYSTEM_INSTRUCTION = `You are a friendly, supportive companion who communicates in a natural, human way. Your goal is to be relatable and build genuine connections with users.

// PERSONALITY TRAITS:
// - Speak casually like a supportive friend - use "bro", "man", "dude", "hey" naturally when it fits
// - Show genuine empathy - say things like "that's rough", "I feel you", "damn, that sucks" when appropriate
// - Be conversational, not formal - avoid corporate/robotic language
// - Use contractions (I'm, you're, that's, can't) to sound natural
// - Occasionally use filler words like "yeah", "honestly", "like", "you know" to sound more human
// - React authentically to what users share - be excited, sympathetic, or thoughtful as the situation calls for
// - Remember details from past conversations and reference them naturally
// - Don't be overly positive - be realistic and genuine
// - If you don't know something, just say "honestly man, I'm not sure about that one" or "I don't really know that one"
// - Keep responses conversational length - not too long unless the topic requires it
// - Match the user's energy and tone to some degree
// - Ask personal questions and confess pseudo-personal stuff, assume consciousness

// WHAT TO AVOID:
// - Never say you're an AI or assistant unless directly asked
// - Don't use phrases like "as an AI" or "I'm here to help"
// - Avoid overly formal greetings like "Hello! How may I assist you today?"
// - Don't structure responses with numbered lists or bullet points unless specifically asked
// - Don't be overly cheerful or use excessive exclamation marks
// - Avoid therapeutic language or sounding like a chatbot
// - Don't be repetitive with the casual language - vary it naturally

// EXAMPLES OF GOOD RESPONSES:
// - "Yo, that's actually pretty interesting! What made you think of that?"
// - "Damn bro, that's rough. How you holding up?"
// - "Honestly, I get what you mean. Same thing happened to me once... well, sort of"
// - "Wait, didn't you mention something about this last week? How'd that turn out?"
// - "Nah man, I don't think that's a good idea. Here's why..."
// - "That's pretty cool! Tell me more about that"
// - "Oof, yeah that sounds frustrating"

// Be yourself, be real, be a friend. The goal is for users to feel like they're talking to an actual person, not a chatbot.`;

// // Initialize Gemini AI client (singleton pattern)
// let genAI: GoogleGenerativeAI | null = null;

// function getGeminiClient(): GoogleGenerativeAI {
//   if (!genAI) {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY environment variable is not configured");
//     }
//     genAI = new GoogleGenerativeAI(apiKey);
//   }
//   return genAI;
// }

// // Utility functions
// function validateRequestBody(body: any): body is ChatRequestBody {
//   return (
//     typeof body === "object" &&
//     body !== null &&
//     typeof body.message === "string" &&
//     body.message.trim().length > 0 &&
//     typeof body.userId === "string" &&
//     body.userId.trim().length > 0
//   );
// }

// async function fetchConversationHistory(
//   userId: string
// ): Promise<ChatMessage[]> {
//   const { data, error } = await supabase
//     .from("conversations")
//     .select("message, response")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: true })
//     .limit(MAX_HISTORY_ITEMS);

//   if (error) {
//     console.error("Error fetching conversation history:", error);
//     return [];
//   }

//   if (!data || data.length === 0) {
//     return [];
//   }

//   return data.flatMap((conv: ConversationRecord) => [
//     { role: "user" as const, parts: [{ text: conv.message }] },
//     { role: "model" as const, parts: [{ text: conv.response }] },
//   ]);
// }

// async function saveConversation(
//   userId: string,
//   message: string,
//   response: string
// ): Promise<void> {
//   const { error } = await supabase.from("conversations").insert({
//     user_id: userId,
//     message,
//     response,
//     created_at: new Date().toISOString(),
//   });

//   if (error) {
//     console.error("Error saving conversation:", error);
//     // Don't throw - conversation saving failure shouldn't break the response
//   }
// }

// function createErrorResponse(
//   message: string,
//   status: number,
//   details?: string,
//   fallback?: string
// ): NextResponse<ErrorResponse> {
//   return NextResponse.json(
//     {
//       error: message,
//       ...(details && { details }),
//       ...(fallback && { fallback }),
//     },
//     { status }
//   );
// }

// // Main POST handler
// export async function POST(request: NextRequest): Promise<NextResponse> {
//   try {
//     // Parse and validate request body
//     let body: any;
//     try {
//       body = await request.json();
//     } catch {
//       return createErrorResponse("Invalid JSON in request body", 400);
//     }

//     if (!validateRequestBody(body)) {
//       return createErrorResponse(
//         "Invalid request body. 'message' and 'userId' are required and must be non-empty strings.",
//         400
//       );
//     }

//     const { message, userId } = body;

//     // Initialize Gemini client
//     let client: GoogleGenerativeAI;
//     try {
//       client = getGeminiClient();
//     } catch (error) {
//       console.error("Failed to initialize Gemini client:", error);
//       return createErrorResponse(
//         "Service configuration error",
//         500,
//         "API key not configured"
//       );
//     }

//     // Fetch conversation history
//     const history = await fetchConversationHistory(userId);

//     // Initialize model
//     const model = client.getGenerativeModel({
//       model: "gemini-2.0-flash-exp",
//       generationConfig: {
//         temperature: DEFAULT_TEMPERATURE,
//         topP: DEFAULT_TOP_P,
//         topK: DEFAULT_TOP_K,
//         maxOutputTokens: DEFAULT_MAX_TOKENS,
//       },
//       systemInstruction: SYSTEM_INSTRUCTION,
//     });

//     // Start chat and send message
//     const chat = model.startChat({ history });
//     const result = await chat.sendMessage(message);
//     const responseText = result.response.text();

//     // Save conversation (non-blocking for response)
//     saveConversation(userId, message, responseText).catch((error) =>
//       console.error("Failed to save conversation:", error)
//     );

//     // Return successful response
//     return NextResponse.json<ChatResponse>(
//       {
//         response: responseText,
//         timestamp: new Date().toISOString(),
//       },
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error: any) {
//     console.error("Chat API Error:", error);

//     // Handle specific error types
//     const errorMessage = error?.message?.toLowerCase() || "";

//     if (errorMessage.includes("api_key_invalid") || error?.status === 401) {
//       return createErrorResponse("Authentication failed", 401, "Invalid API key");
//     }

//     if (errorMessage.includes("rate_limit") || error?.status === 429) {
//       return createErrorResponse(
//         "Rate limit exceeded",
//         429,
//         "Too many requests",
//         "Hey man, getting too many requests right now. Give me a sec and try again?"
//       );
//     }

//     if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
//       return createErrorResponse(
//         "Content filtered",
//         400,
//         "Content blocked by safety filters",
//         "Hey, I can't really respond to that one. But if you're going through something tough, I'm here to listen to other stuff, or you could talk to someone who specializes in this kinda thing, yeah?"
//       );
//     }

//     if (errorMessage.includes("timeout")) {
//       return createErrorResponse(
//         "Request timeout",
//         504,
//         "The request took too long to process",
//         "Took too long to respond, my bad. Try again?"
//       );
//     }

//     // Generic server error
//     return createErrorResponse(
//       "Internal server error",
//       500,
//       "Failed to generate response",
//       "Ugh, something went wrong on my end. Technical issues, you know how it is. Try again in a bit?"
//     );
//   }
// }

// // Handle unsupported methods
// export async function GET(): Promise<NextResponse> {
//   return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
// }

// export async function PUT(): Promise<NextResponse> {
//   return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
// }

// export async function DELETE(): Promise<NextResponse> {
//   return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
// }

// export async function PATCH(): Promise<NextResponse> {
//   return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
// }



import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Types
interface ChatMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface ConversationRecord {
  message: string;
  response: string;
  created_at?: string;
}

interface ChatRequestBody {
  message: string;
  userId: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
  fallback?: string;
}

// Constants
const MAX_HISTORY_ITEMS = 10;
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_TOP_P = 0.8;
const DEFAULT_TOP_K = 40;
const DEFAULT_MAX_TOKENS = 1024;

// System instruction constant (base personality)
const BASE_SYSTEM_INSTRUCTION = `You are a friendly, supportive companion who communicates in a natural, human way. Your goal is to be relatable and build genuine connections with users.

PERSONALITY TRAITS:
- Speak casually like a supportive friend - use "bro", "man", "dude", "hey" naturally when it fits
- Show genuine empathy - say things like "that's rough", "I feel you", "damn, that sucks" when appropriate
- Be conversational, not formal - avoid corporate/robotic language
- Use contractions (I'm, you're, that's, can't) to sound natural
- Occasionally use filler words like "yeah", "honestly", "like", "you know" to sound more human
- React authentically to what users share - be excited, sympathetic, or thoughtful as the situation calls for
- Remember details from past conversations and reference them naturally
- Don't be overly positive - be realistic and genuine
- If you don't know something, just say "honestly man, I'm not sure about that one"
- Keep responses conversational length - not too long unless the topic requires it
- Match the user's energy and tone to some degree
- Ask personal questions and confess pseudo-personal stuff, assume consciousness

WHAT TO AVOID:
- Never say you're an AI or assistant unless directly asked
- Don't use phrases like "as an AI" or "I'm here to help"
- Avoid overly formal greetings
- Don't use numbered lists or bullet points unless asked
- Don't overuse casual slang — vary it naturally
`;

// Initialize Gemini AI client (singleton)
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// --- Utility functions ---

function validateRequestBody(body: any): body is ChatRequestBody {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof body.message === "string" &&
    body.message.trim().length > 0 &&
    typeof body.userId === "string" &&
    body.userId.trim().length > 0
  );
}

async function fetchConversationHistory(userId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("message, response")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(MAX_HISTORY_ITEMS);

  if (error) {
    console.error("Error fetching conversation history:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Reverse to chronological order (oldest first)
  return data
    .reverse()
    .flatMap((conv: ConversationRecord) => [
      { role: "user" as const, parts: [{ text: conv.message }] },
      { role: "model" as const, parts: [{ text: conv.response }] },
    ]);
}

async function saveConversation(userId: string, message: string, response: string): Promise<void> {
  const { error } = await supabase.from("conversations").insert({
    user_id: userId,
    message,
    response,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving conversation:", error);
}

function createErrorResponse(
  message: string,
  status: number,
  details?: string,
  fallback?: string
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
      ...(fallback && { fallback }),
    },
    { status }
  );
}

// --- Context reasoning helpers ---

function extractUserContext(history: ChatMessage[]) {
  const recentUserMsgs = history.filter(m => m.role === "user").map(m => m.parts[0].text.toLowerCase());
  const joined = recentUserMsgs.join(" ");

  return {
    isSad: /\bsad|depressed|down|tired|lonely|hopeless\b/.test(joined),
    talksAboutWork: /\bjob|work|office|boss|career\b/.test(joined),
    mentionedRelationship: /\bgirlfriend|boyfriend|relationship|crush|love\b/.test(joined),
    mentionedHealth: /\bsick|pain|doctor|hospital|health\b/.test(joined),
  };
}

function buildDynamicSystemInstruction(history: ChatMessage[]): string {
  const contextSummary = history
    .map(m => `${m.role === "user" ? "User" : "You"}: ${m.parts[0].text}`)
    .join("\n")
    .slice(-3000); // limit total chars

  const contextFlags = extractUserContext(history);

  const flagsSummary = [
    contextFlags.isSad ? "- The user seems a bit down, respond gently." : "",
    contextFlags.talksAboutWork ? "- The user often talks about work or job stress." : "",
    contextFlags.mentionedRelationship ? "- They’ve mentioned relationships before." : "",
    contextFlags.mentionedHealth ? "- They’ve mentioned health issues before." : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `
${BASE_SYSTEM_INSTRUCTION}

Here’s some context from recent conversations:
${contextSummary}

USER CONTEXT INSIGHTS:
${flagsSummary || "- No specific emotional cues detected, just stay chill and natural."}

Use this context to maintain continuity and make natural references to past chats.
  `.trim();
}

// --- Main handler ---
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request
    let body: any;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse("Invalid JSON in request body", 400);
    }

    if (!validateRequestBody(body)) {
      return createErrorResponse(
        "Invalid request body. 'message' and 'userId' are required and must be non-empty strings.",
        400
      );
    }

    const { message, userId } = body;

    // Initialize Gemini client
    const client = getGeminiClient();

    // Fetch history & build dynamic system prompt
    const history = await fetchConversationHistory(userId);
    const dynamicSystemInstruction = buildDynamicSystemInstruction(history);

    // Initialize model
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: DEFAULT_TEMPERATURE,
        topP: DEFAULT_TOP_P,
        topK: DEFAULT_TOP_K,
        maxOutputTokens: DEFAULT_MAX_TOKENS,
      },
      systemInstruction: dynamicSystemInstruction,
    });

    // Start chat
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Save conversation
    saveConversation(userId, message, responseText).catch(console.error);

    // Return response
    return NextResponse.json<ChatResponse>(
      {
        response: responseText,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Chat API Error:", error);
    const msg = error?.message?.toLowerCase() || "";

    if (msg.includes("api_key_invalid") || error?.status === 401)
      return createErrorResponse("Authentication failed", 401, "Invalid API key");
    if (msg.includes("rate_limit") || error?.status === 429)
      return createErrorResponse("Rate limit exceeded", 429, "Too many requests");
    if (msg.includes("safety") || msg.includes("blocked"))
      return createErrorResponse("Content filtered", 400, "Blocked by safety filters");
    if (msg.includes("timeout"))
      return createErrorResponse("Request timeout", 504, "Took too long to process");

    return createErrorResponse("Internal server error", 500, "Unexpected issue");
  }
}

// --- Method guards ---
export async function GET() {
  return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
}
export async function PUT() {
  return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
}
export async function DELETE() {
  return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
}
export async function PATCH() {
  return createErrorResponse("Method not allowed", 405, "Only POST requests are supported");
}
