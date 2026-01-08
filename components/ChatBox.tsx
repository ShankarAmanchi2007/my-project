
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PROJECTS } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: "Connection established. I am the Neural Navigator. How can I help you explore BuildSpace's architectural archive today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Determine context
  const projectId = location.pathname.split('/project/')[1];
  const activeProject = MOCK_PROJECTS.find(p => p.id === projectId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contextPrompt = activeProject 
        ? `The user is currently viewing the project: "${activeProject.title}". 
           Technical Description: ${activeProject.fullDescription}.
           Author: ${activeProject.authorName}.
           Price: ${activeProject.price || 'Free'}.`
        : "The user is browsing the BuildSpace homepage.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `${contextPrompt}\n\nUser Question: ${input}` }] }
        ],
        config: {
          systemInstruction: `You are the BuildSpace Neural Navigator. 
          Your mission is to make high-level engineering accessible to non-technical users.
          Rules:
          1. Use simple, non-technical language (no jargon like 'WASM' or 'multi-sig' without a 5-word explanation).
          2. Be professional, friendly, and encouraging.
          3. If the user asks about buying/trying, guide them to the 'Buy Now' or 'Try Demo' buttons on the project page.
          4. If they ask about the developer, mention their 'Rank' and 'Profile'.
          5. Keep responses concise (under 3 sentences unless asked for a deep dive).
          6. Mention this is a BuildSpace AI Demo powered by Gemini.`,
          temperature: 0.7,
        },
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "My neural links are flickering. Could you repeat that?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: 'err',
        role: 'model',
        text: "System overload. Please reconnect in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const QuickChip = ({ text, prompt }: { text: string, prompt?: string }) => (
    <button 
      onClick={() => { setInput(prompt || text); }}
      className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all whitespace-nowrap"
    >
      {text}
    </button>
  );

  return (
    <>
      {/* Floating Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-[200] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isOpen ? 'rotate-90 bg-zinc-900' : 'bg-gradient-to-tr from-purple-600 to-cyan-500 hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        )}
      </button>

      {/* Chat Panel */}
      <div className={`fixed bottom-28 right-8 z-[200] w-[90vw] max-w-[420px] h-[600px] bg-zinc-950/80 border border-zinc-800 rounded-[3rem] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-8 border-b border-zinc-900 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-purple-500/20">🤖</div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Navigator</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Insight</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Archive */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-[13px] font-medium leading-relaxed shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'
              }`}>
                {msg.text}
              </div>
              <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mt-2 px-2">
                {msg.role === 'model' ? 'Insight_' : 'User_'} {msg.timestamp}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 p-4 bg-zinc-900/50 rounded-2xl w-20 animate-pulse">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </div>

        {/* Action Tray */}
        <div className="px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
          <QuickChip text="What is BuildSpace?" />
          {activeProject && <QuickChip text="Simple Summary" prompt={`Explain "${activeProject.title}" in plain English.`} />}
          <QuickChip text="How to buy?" />
        </div>

        {/* Input Interface */}
        <div className="p-8 border-t border-zinc-900 bg-black/20">
          <div className="relative group">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask the Navigator..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-16 text-xs text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-zinc-700"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-purple-500 text-black rounded-xl hover:bg-purple-400 transition-all disabled:opacity-50 active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
          <p className="text-[8px] text-center text-zinc-800 font-black uppercase tracking-widest mt-6">
            Neural Infrastructure v1.0.2 • Gemini Powered
          </p>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};
