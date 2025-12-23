
import React, { useState, useRef } from 'react';
import { SawaContentState } from '../types';

interface Props {
  content: SawaContentState;
  onSave: (newContent: SawaContentState) => void;
  onClose: () => void;
  onReset: () => void;
}

const AdminPanel: React.FC<Props> = ({ content, onSave, onClose, onReset }) => {
  const [localContent, setLocalContent] = useState<SawaContentState>(content);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStatChange = (key: keyof typeof content.stats, value: string | number) => {
    setLocalContent(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: value }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for localStorage safety
        alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 1 ميجابايت");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalContent(prev => ({ ...prev, appIcon: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-white/20 shadow-2xl flex flex-col text-right" dir="rtl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0f1e]/80 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-cyan-400">لوحة التحكم بالمحتوى</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Editor */}
        <div className="p-6 space-y-8">
          {/* App Icon Upload Section */}
          <section className="space-y-4">
            <label className="block text-sm font-semibold text-slate-300">أيقونة التطبيق:</label>
            <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-dashed border-cyan-500/30 flex items-center justify-center overflow-hidden relative group">
                {localContent.appIcon ? (
                  <img src={localContent.appIcon} alt="Icon Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl opacity-30">🖼️</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-bold transition-all"
                >
                  رفع صورة جديدة
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <p className="text-[10px] text-slate-500">يفضل صورة مربعة (PNG/JPG) وحجم أقل من 1MB</p>
              </div>
              {localContent.appIcon && (
                <button 
                  onClick={() => setLocalContent(prev => ({ ...prev, appIcon: null }))}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  حذف
                </button>
              )}
            </div>
          </section>

          {/* App Link Section */}
          <section className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">رابط التطبيق (Google Play / App Store / Web):</label>
            <input 
              type="url"
              value={localContent.appLink || ''}
              onChange={(e) => setLocalContent(prev => ({ ...prev, appLink: e.target.value || null }))}
              placeholder="https://example.com/app"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-left dir-ltr"
            />
          </section>

          {/* WhatsApp Number Section */}
          <section className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">رقم الواتساب للتواصل:</label>
            <div className="flex items-center gap-2">
               <input 
                type="text"
                value={localContent.whatsappNumber || ''}
                onChange={(e) => setLocalContent(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g,'') || null }))}
                placeholder="393921700020"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-left dir-ltr"
              />
              <span className="text-xl">📱</span>
            </div>
            <p className="text-[10px] text-slate-500">أدخل الرقم مع رمز الدولة وبدون علامة + (مثال: 201234567890)</p>
          </section>

          <section className="space-y-4">
            <label className="block text-sm font-semibold text-slate-300">النص الرئيسي (دعم أسطر لا نهائية):</label>
            <textarea 
              value={localContent.mainContent}
              onChange={(e) => setLocalContent(prev => ({ ...prev, mainContent: e.target.value }))}
              className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all leading-relaxed text-right"
              placeholder="أدخل النص هنا..."
            />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">ماسات المضيف ($1 =)</label>
              <input 
                type="number"
                value={localContent.stats.diamondsPerDollarHost}
                onChange={(e) => handleStatChange('diamondsPerDollarHost', parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">ماسات الوكيل ($1 =)</label>
              <input 
                type="number"
                value={localContent.stats.diamondsPerDollarAgent}
                onChange={(e) => handleStatChange('diamondsPerDollarAgent', parseInt(e.target.value) || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">أعلى نسبة ربح مضيف</label>
              <input 
                type="text"
                value={localContent.stats.maxHostProfit}
                onChange={(e) => handleStatChange('maxHostProfit', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">نسبة ربح الوكيل القصوى</label>
              <input 
                type="text"
                value={localContent.stats.agentTopProfit}
                onChange={(e) => handleStatChange('agentTopProfit', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex flex-wrap gap-3 sticky bottom-0 bg-[#0a0f1e]/80 backdrop-blur-md">
          <button 
            onClick={() => onSave(localContent)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-600/20"
          >
            حفظ التغييرات
          </button>
          <button 
            onClick={onReset}
            className="px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 rounded-xl transition-all border border-red-500/20"
          >
            إعادة تعيين الافتراضي
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
