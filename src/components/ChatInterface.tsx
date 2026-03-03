import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, RefreshCw, Sparkles } from 'lucide-react';
import { GoogleGenAI, Chat, Content } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { SYSTEM_INSTRUCTION } from '../config/friendTest';

interface ChatInterfaceProps {
  onComplete: (success: boolean) => void;
}

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

// Priority list: Lite (Verified Working) -> Stable
const MODEL_FALLBACKS = [
  "gemini-flash-lite-latest",     // Verified working & high limits
  "gemini-flash-latest",          // Stable fallback
];

const ERROR_MESSAGES = [
  "Maaf, server tengah busy sangat ni (Rate Limit). Cuba refresh kejap lagi ya! 😅",
  "Aduh line slow pulak kat kampung ni... Server busy. Cuba taip semula ya. 📶"
];

export default function ChatInterface({ onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [completionStatus, setCompletionStatus] = useState<'pending' | 'success' | 'failure'>('pending');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);
  const aiClientRef = useRef<GoogleGenAI | null>(null);

  // Helper to get or create User ID
  const getUserId = () => {
    try {
      let userId = localStorage.getItem('chat_user_id');
      if (!userId) {
        // Robust UUID generation for Safari/older browsers
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          userId = crypto.randomUUID();
        } else {
          // Fallback implementation
          userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }
        localStorage.setItem('chat_user_id', userId);
      }
      return userId;
    } catch (error) {
      console.warn('LocalStorage access failed:', error);
      // Return a temporary ID if storage fails (will not persist across reloads)
      return 'temp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Save chat logs whenever messages update
  useEffect(() => {
    if (messages.length === 0) return;

    const saveChat = async () => {
      try {
        await fetch('/api.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: getUserId(),
            messages: messages,
          }),
        });
      } catch (error) {
        console.error('Failed to save chat log:', error);
      }
    };

    const timeoutId = setTimeout(saveChat, 1000); // Debounce save
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize AI Client once
  useEffect(() => {
    if (!aiClientRef.current) {
      aiClientRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  const createChatSession = (modelIndex: number, history: Content[] = []) => {
    if (!aiClientRef.current) return null;
    
    const modelName = MODEL_FALLBACKS[modelIndex % MODEL_FALLBACKS.length];
    console.log(`Initializing chat with model: ${modelName}`);
    
    return aiClientRef.current.chats.create({
      model: modelName,
      history: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      },
    });
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initChat = async () => {
      setIsTyping(true);
      
      // 1. Try to load existing chat history first
      try {
        const userId = getUserId();
        const response = await fetch(`/api.php?user_id=${userId}`);
        const data = await response.json();
        
        if (data.success && data.messages && data.messages.length > 0) {
          const loadedMessages = data.messages as Message[];
          setMessages(loadedMessages);
          
          // Check if user already claimed
          const lastBotMessage = loadedMessages.filter(m => m.sender === 'bot').pop();
          const hasClaimed = loadedMessages.some(m => m.text.includes("Duit raya approved"));
          
          // Initialize chat session with history
          const history = getHistoryFromMessages(loadedMessages);
          // We need to create a session even if we don't send a message immediately
          // Try to create session with first model
          const chat = createChatSession(0, history);
          if (chat) {
            setChatSession(chat);
            setCurrentModelIndex(0);
          }

          if (hasClaimed) {
             // User returned after claiming
             setIsTyping(false);
             addBotMessage("Eh, awak datang balik? Duit raya dah dapat kan? Nak borak kosong boleh la. 😂");
             // Ensure completionStatus is pending so they can chat
             setCompletionStatus('pending');
             return;
          }
          
          // If history exists but not claimed, just resume
          setIsTyping(false);
          return;
        }
      } catch (error) {
        console.error("Failed to load history:", error);
        // Fallback to fresh start
      }

      // 2. If no history, start fresh
      // Just set the session with the first preferred model (no API call yet)
      const chat = createChatSession(0);
      if (chat) {
        setChatSession(chat);
        setCurrentModelIndex(0);
      }
      
      setIsTyping(false);
      addBotMessage("Assalamualaikum! Selamat Hari Raya Aidilfitri! 🌙✨\n\nNi mesti datang nak pau duit raya Adam kan? Sabar dulu, Pak Cik bukan senang-senang nak bagi duit kat orang luar ni. Kena tapis dulu! Cuba bagi satu pantun atau ucapan raya yang paling kreatif. Jangan copy-paste google, Pak Cik tau tau! Kalau power, on the spot Pak Cik transfer duit raya! 🧧😉");     };

    initChat();
  }, []);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'bot',
      text
    }]);
  };

  const getHistoryFromMessages = (msgs: Message[]): Content[] => {
    return msgs
      .filter(m => !ERROR_MESSAGES.includes(m.text)) // Filter out error messages from history
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Optimistically add user message
    const newMessages = [...messages, {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userText
    }];
    setMessages(newMessages);

    setIsTyping(true);

    // Try sending with current session, fallback if needed
    let success = false;
    let activeSession = chatSession;
    let attemptIndex = currentModelIndex;

    // We try the current model, then iterate through others if it fails
    // We limit retries to the number of available models to avoid infinite loops
    for (let i = 0; i < MODEL_FALLBACKS.length; i++) {
      try {
        if (i > 0) await wait(1500); // Wait before retrying

        // If we don't have a session or we're retrying (i > 0), create a new one
        if (!activeSession || i > 0) {
          const history = getHistoryFromMessages(newMessages.slice(0, -1)); 
          activeSession = createChatSession(attemptIndex, history);
        }

        if (!activeSession) throw new Error("Failed to create session");

        const result = await activeSession.sendMessage({ message: userText });
        const responseText = result.text || "Pak Cik tak dengar... cakap kuat sikit?";
        
        setIsTyping(false);
        addBotMessage(responseText);
        
        // Update state with the working session/model
        setChatSession(activeSession);
        setCurrentModelIndex(attemptIndex);
        success = true;

        // Check for ending conditions
        if (responseText.includes("Duit raya approved")) {
          handleSuccess();
        } else if (responseText.includes("Duit raya ditangguhkan")) {
          handleFail();
        }
        
        break; // Exit retry loop on success

      } catch (error) {
        console.warn(`Model ${MODEL_FALLBACKS[attemptIndex]} failed:`, error);
        // Move to next model for next attempt
        attemptIndex = (attemptIndex + 1) % MODEL_FALLBACKS.length;
        activeSession = null; // Force recreation on next loop
      }
    }

    if (!success) {
      setIsTyping(false);
      addBotMessage(ERROR_MESSAGES[1]);
      // Restore input so user can try again easily
      setInputValue(userText);
    }
  };

  const handleSuccess = () => {
    setCompletionStatus('success');
  };

  const handleFail = () => {
    setCompletionStatus('failure');
  };

  const handleContinue = () => {
    if (completionStatus === 'success') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#FBBF24', '#34D399']
      });
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && completionStatus === 'pending') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    window.location.reload(); 
  };

  return (
    <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[650px] border border-white/50 relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center gap-3 shadow-lg z-10">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-emerald-200 shadow-inner relative">
          <Bot className="w-7 h-7 text-emerald-600" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Pak Cik Raya AI 🤖</h3>
          <p className="text-emerald-100 text-xs font-medium opacity-90">
            Checking eligibility...
          </p>
        </div>
        <button 
          onClick={resetChat}
          className="ml-auto text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          title="Restart Chat"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none shadow-emerald-200'
                  : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-none border border-white/60 shadow-gray-200'
              }`}
            >
              <div className="markdown-body">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="whitespace-pre-wrap mb-1 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-bl-none border border-white/60 shadow-sm flex gap-1.5 items-center h-12 w-16 justify-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        


        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Action Button */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-white/50">
        {completionStatus === 'pending' ? (
          <div className="flex gap-2 items-center bg-white rounded-full px-4 py-2 shadow-inner border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Taip jawapan anda..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-2"
              disabled={isTyping}
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className={`p-3 rounded-xl text-center text-sm font-medium ${
              completionStatus === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                : 'bg-red-50 text-red-800 border border-red-100'
            }`}>
              {completionStatus === 'success' 
                ? "🎉 Tahniah! anda berjaya!" 
                : "😅 Alamak... cuba lagi tahun depan ya!"}
            </div>
            <button
              onClick={handleContinue}
              className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${
                completionStatus === 'success' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-200' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-200'
              }`}
            >
              {completionStatus === 'success' ? (
                <>Claim Duit Raya Sekarang! <Sparkles className="w-5 h-5" /></>
              ) : (
                <>Tengok Result <RefreshCw className="w-5 h-5" /></>
              )}
            </button>
          </motion.div>
        )}
        
        {completionStatus === 'pending' && (
          <p className="text-center text-[10px] text-gray-400 mt-2">
            Jawab jujur tau!
          </p>
        )}
      </div>
    </div>
  );
}
