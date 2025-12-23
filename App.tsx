
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import TypewriterEffect from './components/TypewriterEffect';
import FeatureGrid from './components/FeatureGrid';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import LanguageSwitcher from './components/LanguageSwitcher';
import { SAWA_CONTENT_LOCALIZED, REWARD_DATA } from './constants';
import { SawaContentState, Language } from './types';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC91w91PBraHgYHy5OA2doojLohWqCOkTI",
  authDomain: "sawalive-live.firebaseapp.com",
  projectId: "sawalive-live",
  storageBucket: "sawalive-live.firebasestorage.app",
  messagingSenderId: "641366578876",
  appId: "1:641366578876:web:7eb960674fce01a75022b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const CONTENT_DOC_ID = 'main_content';

const INITIAL_STATE: SawaContentState = {
  mainContent: SAWA_CONTENT_LOCALIZED.ar,
  stats: REWARD_DATA,
  appIcon: null,
  appLink: null,
  whatsappNumber: "8613147065068"
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [content, setContent] = useState<SawaContentState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0); 

  useEffect(() => {
    // Sync HTML attributes with current language
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const contentRef = doc(db, "settings", CONTENT_DOC_ID);
    const fetchContent = async () => {
      try {
        const docSnap = await getDoc(contentRef);
        if (docSnap.exists()) {
          setContent({ ...INITIAL_STATE, ...docSnap.data() } as SawaContentState);
        } else {
          await setDoc(contentRef, INITIAL_STATE);
        }
      } catch (e) {
        console.error("Firestore connection error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
    return onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const newData = docSnap.data() as SawaContentState;
        setContent(prev => {
          return { ...INITIAL_STATE, ...newData };
        });
      }
    });
  }, []);

  const displayContent = lang === 'ar' ? content.mainContent : (SAWA_CONTENT_LOCALIZED[lang] || content.mainContent);

  useEffect(() => {
    setTypingComplete(false);
    setContentKey(prev => prev + 1);
  }, [lang]);

  useEffect(() => {
    if (typingComplete) {
      const timer = setTimeout(() => setShowContact(true), 800);
      return () => clearTimeout(timer);
    }
  }, [typingComplete]);

  const handleAdminAuth = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setIsAdminLoginOpen(false);
      setIsAdminPanelOpen(true);
    }
  };

  const handleSave = async (newContent: SawaContentState) => {
    try {
      await setDoc(doc(db, "settings", CONTENT_DOC_ID), newContent);
      setIsAdminPanelOpen(false);
    } catch (e) { alert("حدث خطأ أثناء الحفظ"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`min-h-screen relative bg-[#0a0f1e] selection:bg-cyan-500 selection:text-white overflow-x-hidden ${lang === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-20 flex flex-col items-center gap-8">
        <header className="text-center space-y-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            <a href={content.appLink || '#'} target={content.appLink ? "_blank" : "_self"} className="relative group">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-[2rem] blur-2xl group-hover:bg-cyan-500/50 transition-all animate-pulse" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 glass rounded-[2rem] border border-white/20 p-1 overflow-hidden shadow-2xl flex items-center justify-center">
                {content.appIcon ? <img src={content.appIcon} alt="Logo" className="w-full h-full object-cover rounded-[1.8rem]" /> : <div className="text-cyan-400 text-3xl font-black">S</div>}
              </div>
            </a>
          </div>
          <h1 className="text-4xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">SAWA LIVE</h1>
        </header>

        <div className="w-full glass rounded-2xl p-5 md:p-12 border border-white/10 min-h-[300px]">
          <TypewriterEffect key={contentKey} text={displayContent} onComplete={() => setTypingComplete(true)} />
        </div>

        <div className={`w-full transition-all duration-1000 ${typingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <FeatureGrid stats={content.stats} lang={lang} />
        </div>

        <footer className="text-slate-500 text-[10px] py-10 text-center w-full mt-8 border-t border-white/5">
           <div>&copy; {new Date().getFullYear()} SAWA LIVE.</div>
           <button onClick={() => isAuthenticated ? setIsAdminPanelOpen(true) : setIsAdminLoginOpen(true)} className="mt-4 p-2 opacity-30 hover:opacity-100 transition-opacity">⚙️</button>
        </footer>
      </main>

      {showContact && (
        <WhatsAppButton phoneNumber={content.whatsappNumber || INITIAL_STATE.whatsappNumber!} lang={lang} />
      )}

      {isAdminLoginOpen && <AdminLogin onLogin={handleAdminAuth} onClose={() => setIsAdminLoginOpen(false)} />}
      {isAdminPanelOpen && <AdminPanel content={content} onSave={handleSave} onClose={() => setIsAdminPanelOpen(false)} onReset={() => {}} />}
    </div>
  );
};

export default App;
