
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `أنت مساعد ذكي لتطبيق SAWA LIVE. استخدم المعلومات التالية للإجابة على المستخدم بالعربية وبشكل مختصر وودود. السياق المحدث: ${context}`,
          temperature: 0.8,
        }
      });

      const reply = response.text || 'عذراً، لم أستطع فهم طلبك بناءً على البيانات المتوفرة.';
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ تقني بسيط.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      {isOpen && (
        <div className="mb-4 w-80 h-[450px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
          <div className="p-4 bg-cyan-600 flex justify-between items-center">
            <span className="font-bold">دعم SAWA المباشر</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-xl text-xs ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-white/10'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none" 
              placeholder="اكتب هنا..."
            />
            <button onClick={handleSendMessage} className="text-cyan-400">إرسال</button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-xl"
      >
        🤖
      </button>
    </div>
  );
};

export default GeminiChat;
