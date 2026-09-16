import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Minimize2, Sparkles, Bot, User, ArrowRight, RefreshCw, Compass } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { api } from "../services/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  category?: string;
  quickLinks?: string[];
  timestamp: Date;
}

const suggestedPrompts = [
  "Which NPK ratio is best for maize top dressing?",
  "How much water do tomatoes need in flowering stage?",
  "What is the best fungicide for early blight?",
  "Show me live wholesale maize prices in Tanzania",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Jambo! I am ChimaAI, your official 24/7 Smart Agronomy Assistant.\n\nAsk me any question about crop diseases, fertilizer application, irrigation schedules, or market prices!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputValue("");
    setIsTyping(true);

    try {
      const res = await api.askAI(textToSend);
      setIsTyping(false);

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: res.answer,
        category: res.category,
        quickLinks: res.quickLinks,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble connecting to the agronomy server. Please check your connection and try again.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-indigo-300/40 glow-emerald group"
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
            </span>
          </div>
          <span className="font-bold text-sm hidden sm:inline pr-1">Ask ChimaAI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden h-[580px] animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl backdrop-blur-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  ChimaAI Agronomy Assistant
                  <Badge className="bg-indigo-500/20 text-indigo-300 text-[10px] border-none px-1.5 py-0.2">v2.4 Pro</Badge>
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block animate-pulse"></span> Tanzania Crop Advisory Active
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8 rounded-xl" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/70 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                  }`}
                >
                  {msg.category && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-md inline-block mb-2">
                      {msg.category}
                    </span>
                  )}

                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  <span className="text-[10px] opacity-60 block text-right mt-1.5 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
                    You
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold pl-10">
                <Bot className="w-4 h-4 animate-bounce text-indigo-600" />
                <span>ChimaAI is checking Tanzania agronomy guidelines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto custom-scrollbar">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-200 transition-colors shrink-0 font-medium"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <Input
              placeholder="Ask about crop diseases, fertilizer ratios..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 h-11 border-slate-200 text-xs sm:text-sm rounded-xl focus-visible:ring-indigo-600"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 h-11 w-11 p-0 rounded-xl shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}