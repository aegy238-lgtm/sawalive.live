
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage } from '../types';

interface Props {
  context: string;
}

const GeminiChat: React.FC<Props> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'أهلاً بك في SAWA! كيف يمكنني مساعدتك في فهم نظام الأرباح المحدث اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Fix: Use the API key exclusively from process.env.API_KEY as per the rules.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      // Fix: Adhere to the GenerateContentParameters structure and use systemInstruction in the config.
      const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `أنت مساعد ذكي لتطبيق SAWA LIVE. استخدم المعلومات التالية للإجابة على المستخدم بالعربية وبشكل مختصر وودود. السياق المحدث: ${context}`,
          temperature: 0.8,
        }
      });

      // Fix: Access response.text directly as a property, not a method.
      const reply = response.text || 'عذراً، لم أستطع فهم طلبك بناءً على البيانات المتوفرة. هل يمكنك إعادة الصياغة؟';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ تقني بسيط. يرجى المحاولة مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 md:bottom-8 left-4 md:left-8 z-[100] flex flex-col items-start">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-[400px] h-[70vh] md:h-[550px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-4 md:p-5 bg-gradient-to-r from-cyan-600/80 to-blue-700/80 backdrop-blur-md flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e293b]" />
              </div>
              <div>
                <h4 className="font-bold text-sm md:text-base">دعم SAWA المباشر</h4>
                <p className="text-[10px] text-cyan-200/70">متصل الآن لمساعدتك</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black/10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-right-2'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] md:text-sm shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-500"
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-cyan-500/20 hover:scale-105 transition-all active:scale-95 group relative border border-white/20"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-[#0a0f1e]"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
