
import React, { useState } from 'react';

interface Props {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const AdminLogin: React.FC<Props> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_EMAIL = "admin@sawalive.com";
  const ADMIN_PASS = "SawaAdmin2025";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      onLogin(true);
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="glass w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden p-6 md:p-10 text-right" dir="rtl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-black text-cyan-400">دخول الإدارة</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full transition-colors active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 mr-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-base md:text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all dir-ltr text-left"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-300 mr-1">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-4 text-base md:text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all dir-ltr text-left"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-bold animate-pulse pr-2">⚠️ {error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl transition-all active:scale-[0.97] shadow-lg shadow-cyan-600/20 mt-4"
          >
            تأكيد الدخول
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-500 mt-10 opacity-50">
          محمي بواسطة SAWA LIVE Cloud Security
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
