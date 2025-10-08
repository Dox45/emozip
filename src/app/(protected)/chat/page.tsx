// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { LogIn, LogOut } from "lucide-react";
// import { Send, Heart, Shield, AlertTriangle, User, Bot, Menu, X, MessageCircle, Settings, Info } from 'lucide-react';
// import { supabase } from '@/lib/supabase';
// import AboutView from '@/components/AboutView'
// import MetricsView from '@/components/MetricsView'
// import CrisiModal from '@/components/CrisiModal'

// function ChatView({
//   messages,
//   messagesEndRef,
//   isLoading,
//   inputMessage,
//   setInputMessage,
//   handleSendMessage,
// }) {
//   return (
//     <div className="flex flex-col h-full">

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`flex items-start max-w-xs sm:max-w-md ${
//                 message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
//               }`}
//             >
//               <div
//                 className={`flex-shrink-0 ${
//                   message.type === 'user' ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'
//                 }`}
//               >
//                 {message.type === 'user' ? (
//                   <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full flex items-center justify-center">
//                     <User className="text-white" />
//                   </div>
//                 ) : (
//                   <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                     <Bot className="text-white" />
//                   </div>
//                 )}
//               </div>
//               <div
//                 className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg ${
//                   message.type === 'user'
//                     ? 'bg-blue-500 text-white'
//                     : message.isCrisis
//                     ? 'bg-red-100 text-red-800 border border-red-300'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <p className="text-xs sm:text-sm">{message.content}</p>
//                 <p className="text-xs mt-0.5 sm:mt-1 opacity-70">
//                   {message.timestamp.toLocaleTimeString()}
//                 </p>
//                 {message.type === 'bot' && message.emotionalScore && (
//                   <div className="mt-1 sm:mt-2">
//                     <div className="text-xs opacity-70">
//                       ERS: {(message.emotionalScore * 100).toFixed(0)}%
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-1 mt-0.5 sm:mt-1">
//                       <div
//                         className="bg-blue-500 h-1 rounded-full"
//                         style={{ width: `${message.emotionalScore * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="bg-gray-100 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
//               <div className="flex space-x-1">
//                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.1s' }}
//                 ></div>
//                 <div
//                   className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: '0.2s' }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//      <div className="border-t p-2 sm:p-3 bg-white">
//   <div className="flex items-center bg-black rounded-full shadow-sm px-2 sm:px-3 py-1.5 sm:py-2 space-x-2 max-w-2xl mx-auto">
//     <input
//       type="text"
//       value={inputMessage}
//       onChange={(e) => setInputMessage(e.target.value)}
//       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//       placeholder="Share your feelings..."
//       className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-400"
//       disabled={isLoading}
//     />
//     <button
//       onClick={handleSendMessage}
//       disabled={isLoading || !inputMessage.trim()}
//       className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition disabled:opacity-50"
//     >
//       <Send className="w-4 h-4" />
//     </button>
//   </div>

//   <div className="flex items-center justify-center mt-2 text-xs text-gray-400">
//     <Shield className="w-4 h-4 mr-1" />
//     <span>Your conversations are private & secure</span>
//   </div>
// </div>

//     </div>
//   );
// }



// export default function EmotionalSupportApp() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       content:
//         "Hello! I'm here to provide emotional support and a listening ear. I'm designed to help with feelings of loneliness, stress, and anxiety. How are you feeling today?",
//       timestamp: new Date(),
//       emotionalScore: 0.7,
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentView, setCurrentView] = useState('chat');
//   const [userId, setUserId] = useState(null);
//   const [showCrisisModal, setShowCrisisModal] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const messagesEndRef = useRef(null);
//   const sessionStartTime = useRef(new Date());

//   // Crisis keywords that trigger safety protocols
//   const crisisKeywords = [
//     'suicide',
//     'kill myself',
//     'end it all',
//     'not worth living',
//     'want to die',
//     'harm myself',
//     'better off dead',
//     'no point in living',
//     'end my life',
//   ];

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     async function initApp() {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         setUserId(user.id);
//         await loadHistory(user.id);
//       }
//     }
//     initApp();
//   }, []);

//   async function loadHistory(userId) {
//     try {
//       const res = await fetch(`/api/history?userId=${userId}`);
//       const history = await res.json();

//       // Interleave user and bot messages properly for correct chronological display
//       const interleavedHistory = history.flatMap((h) => [
//         {
//           id: `user-${h.id}`,
//           type: 'user',
//           content: h.message,
//           timestamp: new Date(h.created_at),
//         },
//         {
//           id: `bot-${h.id}`,
//           type: 'bot',
//           content: h.response,
//           timestamp: new Date(h.created_at), // Same timestamp; ordering by id ensures user first
//         },
//       ]);

//       // Preserve initial bot message if no history
//       setMessages(interleavedHistory.length > 0 ? interleavedHistory : messages);
//     } catch (error) {
//       console.error('Error loading history:', error);
//     }
//   }

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Check for crisis indicators
//   const checkForCrisis = (message) => {
//     const lowerMessage = message.toLowerCase();
//     return crisisKeywords.some((keyword) => lowerMessage.includes(keyword));
//   };

//   // Calculate emotional response score
//   const calculateEmotionalScore = (response) => {
//     // Simple scoring based on positive/negative indicators
//     const positiveWords = [
//       'better',
//       'good',
//       'happy',
//       'hope',
//       'support',
//       'help',
//       'understand',
//       'care',
//     ];
//     const negativeWords = [
//       'worse',
//       'bad',
//       'sad',
//       'hopeless',
//       'alone',
//       'scared',
//       'anxious',
//       'depressed',
//     ];

//     const words = response.toLowerCase().split(' ');
//     let score = 0.5; // neutral baseline

//     positiveWords.forEach((word) => {
//       if (words.includes(word)) score += 0.1;
//     });

//     negativeWords.forEach((word) => {
//       if (words.includes(word)) score -= 0.1;
//     });

//     return Math.max(0, Math.min(1, score));
//   };

//   // Fetch historical metrics for bot personalization
//   async function getHistoricalMetrics(userId) {
//     if (!userId) return 0;
//     const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
//     const { data } = await supabase
//       .from('conversations')
//       .select('emotional_score')
//       .eq('user_id', userId)
//       .gte('created_at', oneWeekAgo)
//       .filter('emotional_score', 'gt', 0);

//     if (data && data.length > 0) {
//       const avg = data.reduce((sum, row) => sum + row.emotional_score, 0) / data.length;
//       return avg;
//     }
//     return 0.5; // Neutral default
//   }

//   // Generate AI response using Gemini API
//   const generateAIResponse = async (userMessage) => {
//     try {
//       // Check if user input suggests severe distress first
//       const isCrisis = checkForCrisis(userMessage);

//       if (isCrisis) {
//         return {
//           content:
//             "I'm very concerned about what you've shared. These feelings are serious, and I want to make sure you get the help you deserve. Please consider reaching out to a crisis helpline or mental health professional immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. Would you like me to provide more resources?",
//           isCrisis: true,
//           emotionalScore: 0.2,
//         };
//       }

//       // Fetch historical avg for personalization
//       const historicalAvg = await getHistoricalMetrics(userId);
//       const historicalPercent = (historicalAvg * 100).toFixed(0);

//       // Create system prompt for emotional support, including performance tracking
//       const systemPrompt = `You are an AI emotional support assistant. Your role is to provide empathetic, supportive, and compassionate responses to users experiencing emotional difficulties like loneliness, stress, and anxiety.

// Key guidelines:
// - Be empathetic, understanding, and validating
// - Provide emotional support and encouragement
// - Ask thoughtful follow-up questions when appropriate
// - Suggest healthy coping strategies
// - Always remind users that you're not a replacement for professional therapy
// - Keep responses concise but meaningful (2-4 sentences)
// - Use warm, caring language
// - Focus on the user's emotional wellbeing
// - Personalize based on performance: User's recent average Emotional Response Score (ERS) is ${historicalPercent}%. If high, acknowledge progress (e.g., "You've been showing great resilience lately"). If low, offer extra encouragement (e.g., "It's okay to have tough days—we can work through this together").

// Respond to this user message with empathy and support, reference the past messages above: "${userMessage}"`;

//       // Call Gemini API
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           message: systemPrompt,
//           userId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed: ${response.status}`);
//       }

//       const data = await response.json();
//       const aiResponse = data.response;

//       return {
//         content: aiResponse,
//         isCrisis: false,
//         emotionalScore: calculateEmotionalScore(aiResponse),
//       };
//     } catch (error) {
//       console.error('Error calling Gemini API:', error);
//       // Fallback response in case of API failure
//       return {
//         content:
//           "I'm sorry, I'm having trouble connecting right now. Please know that your feelings are valid and you're not alone. If you're in crisis, please reach out to a mental health professional or crisis hotline immediately.",
//         isCrisis: false,
//         emotionalScore: 0.5,
//       };
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputMessage,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     // Check for crisis indicators
//     if (checkForCrisis(inputMessage)) {
//       setShowCrisisModal(true);
//     }

//     try {
//       const aiResponse = await generateAIResponse(inputMessage);

//       const botMessage = {
//         id: Date.now() + 1,
//         type: 'bot',
//         content: aiResponse.content,
//         timestamp: new Date(),
//         emotionalScore: aiResponse.emotionalScore,
//         isCrisis: aiResponse.isCrisis,
//       };

//       setMessages((prev) => [...prev, botMessage]);

//       // Save to Supabase (both user + bot messages in one row, including emotional_score)
//       if (userId) {
//         await fetch('/api/conversation', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             userId,
//             message: userMessage.content,
//             response: botMessage.content,
//             emotionalScore: botMessage.emotionalScore,
//           }),
//         });
//       }
//     } catch (error) {
//       console.error('Error generating response:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'bot',
//         content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
//         timestamp: new Date(),
//         emotionalScore: 0.3,
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }

//     setIsLoading(false);
//   };

//   const handleCrisisClose = () => {
//     setShowCrisisModal(false);
//   };

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* Header with Sidebar Toggle on Mobile */}
//       <div className="bg-black text-white p-3 sm:p-4 flex items-center justify-between">
//         <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
//           <Heart className="mr-2" />
//           Emotional Support AI
//         </h1>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="sm:hidden text-white p-1 rounded"
//         >
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Sidebar - Collapsible on Mobile */}
//         <div
//           className={`${
//             isSidebarOpen ? 'block' : 'hidden'
//           } sm:block w-full sm:w-64 bg-white border-r border-gray-200 transition-all duration-300`}
//         >
//           <div className="p-3 sm:p-4">
//             <h1 className="text-lg sm:text-xl font-bold text-gray-800">Support Chat</h1>
//           </div>
         
//           <nav className="space-y-1 p-2 sm:p-3">
// 			  {!userId ? (
// 			    // Not logged in → show Login button
// 			    <button
// 			      onClick={() => {
// 			        window.location.href = "/login"; // redirect to /login route
// 			        setIsSidebarOpen(false);
// 			      }}
// 			      className="w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left text-gray-600 hover:bg-gray-100"
// 			    >
// 			      <LogIn className="w-4 h-4 mr-2" />
// 			      <span className="text-sm sm:text-base">Login</span>
// 			    </button>
// 			  ) : (
// 			    // Logged in → show full nav
// 			    <>
// 			      <button
// 			        onClick={() => {
// 			          setCurrentView("chat");
// 			          setIsSidebarOpen(false);
// 			        }}
// 			        className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left ${
// 			          currentView === "chat"
// 			            ? "bg-blue-100 text-blue-700"
// 			            : "text-gray-600 hover:bg-gray-100"
// 			        }`}
// 			      >
// 			        <MessageCircle className="mr-1 sm:mr-2" />
// 			        <span className="text-sm sm:text-base">Chat</span>
// 			      </button>

// 			      <button
// 			        onClick={() => {
// 			          setCurrentView("metrics");
// 			          setIsSidebarOpen(false);
// 			        }}
// 			        className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left ${
// 			          currentView === "metrics"
// 			            ? "bg-blue-100 text-blue-700"
// 			            : "text-gray-600 hover:bg-gray-100"
// 			        }`}
// 			      >
// 			        <Settings className="w-3.5 h-3.5 sm:w-4 h-4 mr-2" />
// 			        <span className="text-sm sm:text-base">Metrics</span>
// 			      </button>

// 			      <button
// 			        onClick={() => {
// 			          setCurrentView("about");
// 			          setIsSidebarOpen(false);
// 			        }}
// 			        className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left ${
// 			          currentView === "about"
// 			            ? "bg-blue-100 text-blue-700"
// 			            : "text-gray-600 hover:bg-gray-100"
// 			        }`}
// 			      >
// 			        <Info className="w-3.5 h-3.5 sm:w-4 h-4 mr-2" />
// 			        <span className="text-sm sm:text-base">About</span>
// 			      </button>

// 			      {/* Logout button */}
// 			      <button
// 			        onClick={async () => {
// 			          await supabase.auth.signOut();
// 			          setUserId(null);
// 			          setCurrentView("chat");
// 			          setIsSidebarOpen(false);
// 			        }}
// 			        className="w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left text-red-600 hover:bg-red-50"
// 			      >
// 			        <LogOut className="w-4 h-4 mr-2" />
// 			        <span className="text-sm sm:text-base">Logout</span>
// 			      </button>
// 			    </>
// 			  )}
// 			</nav>


//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {currentView === 'chat' && (
//             <ChatView
//               messages={messages}
//               messagesEndRef={messagesEndRef}
//               isLoading={isLoading}
//               inputMessage={inputMessage}
//               setInputMessage={setInputMessage}
//               handleSendMessage={handleSendMessage}
//             />
//           )}
//           {currentView === 'metrics' && <MetricsView userId={userId} />}
//           {currentView === 'about' && <AboutView />}
//         </div>
//       </div>

//       {/* Crisis Modal */}
//       {showCrisisModal && <CrisisModal onClose={handleCrisisClose} />}
//     </div>
//   );
// }



'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LogIn, LogOut, Send, Heart, Shield, User, Bot, Menu, X, MessageCircle, Settings, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AboutView from '@/components/AboutView';
import MetricsView from '@/components/MetricsView';
import CrisisModal from '@/components/CrisisModal';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Message {
  id: string | number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  emotionalScore?: number;
  isCrisis?: boolean;
}

interface ChatViewProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
}

interface ConversationHistoryItem {
  id: string;
  message: string;
  response: string;
  created_at: string;
  emotional_score?: number;
}

interface AIResponseData {
  content: string;
  isCrisis: boolean;
  emotionalScore: number;
}

type ViewType = 'chat' | 'metrics' | 'about';

// ============================================================================
// Constants
// ============================================================================

const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end it all',
  'not worth living',
  'want to die',
  'harm myself',
  'better off dead',
  'no point in living',
  'end my life',
] as const;

const POSITIVE_WORDS = [
  'better',
  'good',
  'happy',
  'hope',
  'support',
  'help',
  'understand',
  'care',
] as const;

const NEGATIVE_WORDS = [
  'worse',
  'bad',
  'sad',
  'hopeless',
  'alone',
  'scared',
  'anxious',
  'depressed',
] as const;

const INITIAL_BOT_MESSAGE: Message = {
  id: 'initial-bot-message',
  type: 'bot',
  content:
    "Hello there, let's talk",
  timestamp: new Date(),
  emotionalScore: 0.7,
};

const CRISIS_RESPONSE_MESSAGE =
  "I'm very concerned about what you've shared. These feelings are serious, and I want to make sure you get the help you deserve. Please consider reaching out to a crisis helpline or mental health professional immediately. In the US, you can call 988 for the Suicide & Crisis Lifeline. Would you like me to provide more resources?";

const ERROR_FALLBACK_MESSAGE =
  "Just hold on a bit, let me fix something.";

const API_ERROR_MESSAGE =
  "Having network issues, I don't know if it's from my end.";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a message contains crisis indicators
 */
function checkForCrisis(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Calculate emotional response score based on content
 */
function calculateEmotionalScore(response: string): number {
  const words = response.toLowerCase().split(/\s+/);
  let score = 0.5; // Neutral baseline

  POSITIVE_WORDS.forEach((word) => {
    if (words.includes(word)) score += 0.1;
  });

  NEGATIVE_WORDS.forEach((word) => {
    if (words.includes(word)) score -= 0.1;
  });

  return Math.max(0, Math.min(1, score));
}

/**
 * Fetch historical emotional metrics for personalization
 */
async function getHistoricalMetrics(userId: string | null): Promise<number> {
  if (!userId) return 0.5;

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('conversations')
      .select('emotional_score')
      .eq('user_id', userId)
      .gte('created_at', oneWeekAgo)
      .not('emotional_score', 'is', null)
      .gt('emotional_score', 0);

    if (error) {
      console.error('Error fetching historical metrics:', error);
      return 0.5;
    }

    if (data && data.length > 0) {
      const avg = data.reduce((sum, row) => sum + (row.emotional_score || 0), 0) / data.length;
      return avg;
    }

    return 0.5;
  } catch (error) {
    console.error('Error in getHistoricalMetrics:', error);
    return 0.5;
  }
}

/**
 * Generate AI response using the chat API
 */
async function generateAIResponse(
  userMessage: string,
  userId: string | null
): Promise<AIResponseData> {
  // Check for crisis indicators first
  const isCrisis = checkForCrisis(userMessage);

  if (isCrisis) {
    return {
      content: CRISIS_RESPONSE_MESSAGE,
      isCrisis: true,
      emotionalScore: 0.2,
    };
  }

  try {
    // Call the chat API with just the user message
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        userId: userId || 'anonymous',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API request failed:', response.status, errorData);
      
      // Use fallback message if provided
      if (errorData.fallback) {
        return {
          content: errorData.fallback,
          isCrisis: false,
          emotionalScore: 0.5,
        };
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.response;

    return {
      content: aiResponse,
      isCrisis: false,
      emotionalScore: calculateEmotionalScore(aiResponse),
    };
  } catch (error) {
    console.error('Error calling chat API:', error);
    return {
      content: API_ERROR_MESSAGE,
      isCrisis: false,
      emotionalScore: 0.5,
    };
  }
}

/**
 * Load conversation history from the database
 */
async function loadConversationHistory(userId: string): Promise<Message[]> {
  try {
    const response = await fetch(`/api/history?userId=${encodeURIComponent(userId)}`);
    
    if (!response.ok) {
      console.error('Failed to load history:', response.status);
      return [];
    }

    const history: ConversationHistoryItem[] = await response.json();

    if (!Array.isArray(history) || history.length === 0) {
      return [];
    }

    // Interleave user and bot messages for chronological display
    return history.flatMap((item) => [
      {
        id: `user-${item.id}`,
        type: 'user' as const,
        content: item.message,
        timestamp: new Date(item.created_at),
      },
      {
        id: `bot-${item.id}`,
        type: 'bot' as const,
        content: item.response,
        timestamp: new Date(item.created_at),
        emotionalScore: item.emotional_score,
      },
    ]);
  } catch (error) {
    console.error('Error loading conversation history:', error);
    return [];
  }
}

/**
 * Save conversation to the database
 */
async function saveConversation(
  userId: string,
  message: string,
  response: string,
  emotionalScore: number
): Promise<void> {
  try {
    const saveResponse = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message,
        response,
        emotionalScore,
      }),
    });

    if (!saveResponse.ok) {
      console.error('Failed to save conversation:', saveResponse.status);
    }
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

// ============================================================================
// Chat View Component
// ============================================================================

function ChatView({
  messages,
  messagesEndRef,
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}: ChatViewProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-xs sm:max-w-md ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  message.type === 'user' ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'
                }`}
              >
                {message.type === 'user' ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
              <div
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isCrisis
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p className="text-xs mt-0.5 sm:mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.type === 'bot' && message.emotionalScore !== undefined && (
                  <div className="mt-1 sm:mt-2">
                    {/*<div className="text-xs opacity-70">
                      ERS: {(message.emotionalScore * 100).toFixed(0)}%
                    </div>*/}
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-0.5 sm:mt-1">
                      <div
                        className=""
                        
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-2 sm:px-4 py-1 sm:py-2">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-2 sm:p-3 bg-white">
        <div className="flex items-center bg-gray-900 rounded-full shadow-sm px-2 sm:px-3 py-1.5 sm:py-2 space-x-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your feelings..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-400"
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center mt-2 text-xs text-gray-400">
          <Shield className="w-4 h-4 mr-1" />
          <span>Your conversations are private & secure</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main App Component
// ============================================================================

export default function EmotionalSupportApp() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [userId, setUserId] = useState<string | null>(null);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Initialize app and load user data
  useEffect(() => {
    async function initApp() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        if (user) {
          setUserId(user.id);
          const history = await loadConversationHistory(user.id);
          if (history.length > 0) {
            setMessages(history);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    }
    initApp();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle sending message
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const trimmedMessage = inputMessage.trim();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for crisis indicators
    const isCrisisDetected = checkForCrisis(trimmedMessage);
    if (isCrisisDetected) {
      setShowCrisisModal(true);
    }

    try {
      const aiResponse = await generateAIResponse(trimmedMessage, userId);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        emotionalScore: aiResponse.emotionalScore,
        isCrisis: aiResponse.isCrisis,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save to database if user is logged in
      if (userId) {
        await saveConversation(
          userId,
          userMessage.content,
          botMessage.content,
          botMessage.emotionalScore || 0.5
        );
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        type: 'bot',
        content: ERROR_FALLBACK_MESSAGE,
        timestamp: new Date(),
        emotionalScore: 0.3,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, userId]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUserId(null);
      setMessages([INITIAL_BOT_MESSAGE]);
      setCurrentView('chat');
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  // Handle view change
  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  }, []);

  // Handle crisis modal close
  const handleCrisisClose = useCallback(() => {
    setShowCrisisModal(false);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-black text-white p-3 sm:p-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
          <Heart className="mr-2" />
          Emotional Support AI
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sm:hidden text-white p-1 rounded hover:bg-gray-800 transition"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } sm:block w-full sm:w-64 bg-white border-r border-gray-200 transition-all duration-300`}
        >
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Support Chat</h2>
          </div>

          <nav className="space-y-1 p-2 sm:p-3" aria-label="Main navigation">
            {!userId ? (
              <button
                onClick={() => {
                  window.location.href = '/login';
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left text-gray-600 hover:bg-gray-100 transition"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Login</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleViewChange('chat')}
                  className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left transition ${
                    currentView === 'chat'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Chat</span>
                </button>

                <button
                  onClick={() => handleViewChange('metrics')}
                  className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left transition ${
                    currentView === 'metrics'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Metrics</span>
                </button>

                <button
                  onClick={() => handleViewChange('about')}
                  className={`w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left transition ${
                    currentView === 'about'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Info className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">About</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Logout</span>
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {currentView === 'chat' && (
            <ChatView
              messages={messages}
              messagesEndRef={messagesEndRef}
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
            />
          )}
          {currentView === 'metrics' && <MetricsView userId={userId} />}
          {currentView === 'about' && <AboutView />}
        </main>
      </div>

      {/* Crisis Modal */}
      {showCrisisModal && <CrisisModal onClose={handleCrisisClose} />}
    </div>
  );
}