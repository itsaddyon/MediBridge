import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare, Loader2, MapPin, Stethoscope, Phone, Sparkles, Activity } from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "<p>Hello! I'm <b>MediBridge</b>. 🏥<br/>Tell me what's wrong, and I'll find help immediately.</p>" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  // 🌍 AUTO-LOCATION (Updated with User-Agent)
const getUserLocation = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve("Unknown Location"); return; }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // 🚨 ADD HEADERS HERE to stop the 403 Forbidden error
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'MediBridge-App/1.0' } }
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || "Local Area";
          resolve(`${city}, ${data.address.state || ""}`);
        } catch (e) { resolve(`Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`); }
      },
      () => resolve("Unknown Location")
    );
  });
};

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage = { role: "user" as const, text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let locationToSend = userLocation;
    if (!locationToSend) {
      locationToSend = await getUserLocation();
      setUserLocation(locationToSend);
    }

    try {
      // 1. Define the Backend URL (Uses Vercel URL if available, otherwise Localhost)
      // Note: If you are using Create React App instead of Vite, use process.env.REACT_APP_BACKEND_URL
      const BACKEND_URL = import.meta.env.DEV
  ? "http://10.121.56.154:4000"   // your laptop IP
  : import.meta.env.VITE_BACKEND_URL;


      // 2. Use the variable in the fetch call
      const response = await fetch(`${BACKEND_URL}/api/gemini`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userId: "guest-landing-page",
          userLocation: locationToSend 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const botMessage = {
  role: "model" as const,
  text: data.response,
};
setMessages((prev) => [...prev, botMessage]);


    } catch (error: any) {
  console.error("Chatbot error:", error);
  setMessages((prev) => [
    ...prev,
    {
      role: "model",
      text: `⚠️ ${error?.message || "Unknown error"}`
    }
  ]);
}
 finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage(input);
  };

  const handleSymptomClick = () => {
    setInput("I am feeling ");
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  // Dark Mode Quick Action
  const QuickAction = ({ icon: Icon, text, onClick }: { icon: any, text: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-full shadow-lg hover:bg-cyan-900/30 hover:border-cyan-500/50 text-xs font-medium text-cyan-400 transition-all whitespace-nowrap group"
    >
      <Icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
      {text}
    </button>
  );

  return (
    <>
      {/* 🌑 DARK MODE TABLE CSS */}
      <style>{`
        .medical-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; font-size: 11px; border: 1px solid #334155; border-radius: 8px; overflow: hidden; background: #1e293b; }
        .medical-table th { text-align: left; background: #0f172a; padding: 8px; color: #cbd5e1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #334155; }
        .medical-table td { padding: 8px; border-top: 1px solid #334155; vertical-align: middle; color: #e2e8f0; }
        .medical-table tr:hover td { background-color: #334155; }
        .map-link { 
            background-color: #0e7490; color: #ecfeff; 
            padding: 4px 8px; border-radius: 4px; 
            text-decoration: none; font-weight: bold; 
            display: inline-block; transition: background 0.2s;
            box-shadow: 0 0 10px rgba(6,182,212,0.3);
        }
        .map-link:hover { background-color: #06b6d4; }
      `}</style>

      {/* 🚀 NEON LAUNCHER */}
      <button
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] z-50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isOpen 
            ? "bg-rose-600 rotate-90 shadow-[0_0_20px_rgba(225,29,72,0.6)]" 
            : "bg-black border border-cyan-500 animate-pulse-slow"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Activity className="h-6 w-6 text-cyan-400" />}
      </button>

      {isOpen && (
        // 📱 RESPONSIVE CONTAINER: 90vw width on mobile, Fixed on Desktop. Shorter height.
        <div className="fixed bottom-20 right-4 w-[90vw] sm:w-[380px] h-[70vh] sm:h-[600px] flex flex-col z-50 overflow-hidden font-sans border border-slate-700/50 shadow-2xl rounded-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 backdrop-blur-2xl bg-slate-950/90">
          
          {/* 🌌 DARK HEADER */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between relative overflow-hidden">
            {/* Animated Glow Behind Header */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center gap-3 z-10">
                <div className="bg-cyan-950/50 p-2 rounded-lg border border-cyan-800/30">
                    <Bot className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-md tracking-wide">MediBridge</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">AI Active</span>
                    </div>
                </div>
            </div>
            <Sparkles className="h-4 w-4 text-slate-600 opacity-50" />
          </div>

          {/* 💬 CHAT AREA */}
          <div className="flex-1 p-4 overflow-y-auto scroll-smooth custom-scrollbar" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                      m.role === "user" ? "bg-cyan-600 border-cyan-400" : "bg-slate-800 border-slate-700"
                  }`}>
                    {m.role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-cyan-400" />}
                  </div>

                  <div 
                    className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-md leading-relaxed ${
                      m.role === "user" 
                        ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-none border border-cyan-500/30" 
                        : "bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200 rounded-bl-none"
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-2xl rounded-bl-none flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />
                        <span className="text-xs text-slate-400">Processing...</span>
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* ⚡ QUICK ACTIONS */}
          <div className="px-4 py-3 bg-slate-900/50 backdrop-blur-md flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/50">
             <QuickAction icon={MapPin} text="Find Hospitals" onClick={() => sendMessage("Find hospitals near me")} />
             <QuickAction icon={Stethoscope} text="Check Symptoms" onClick={handleSymptomClick} />
             <QuickAction icon={Phone} text="Emergency" onClick={() => sendMessage("Emergency contact numbers")} />
          </div>

          {/* ⌨️ INPUT AREA */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="relative flex items-center group">
                <input
                    ref={inputRef}
                    className="w-full bg-slate-900 border border-slate-700 rounded-full pl-5 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Type health query..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button 
                    className="absolute right-2 p-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:shadow-none transform active:scale-95"
                    onClick={() => sendMessage(input)} 
                    disabled={isLoading || !input.trim()}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}