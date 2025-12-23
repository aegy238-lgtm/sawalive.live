
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import TypewriterEffect from './components/TypewriterEffect';
import FeatureGrid from './components/FeatureGrid';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { SAWA_CONTENT, REWARD_DATA } from './constants';
import { SawaContentState } from './types';

// Firebase Configuration from user
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
  mainContent: SAWA_CONTENT,
  stats: REWARD_DATA,
  appIcon: null,
  appLink: null,
  whatsappNumber: "393921700020"
};

const App: React.FC = () => {
  const [content, setContent] = useState<SawaContentState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0); 
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentRef = doc(db, "settings", CONTENT_DOC_ID);

    const fetchContent = async () => {
      try {
        const docSnap = await getDoc(contentRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({
            ...INITIAL_STATE,
            ...data
          } as SawaContentState);
        } else {
          await setDoc(contentRef, INITIAL_STATE);
        }
      } catch (e) {
        console.error("Firestore loading error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const newData = docSnap.data() as SawaContentState;
        setContent(prev => {
          if (prev.mainContent !== newData.mainContent) {
            setTypingComplete(false);
            setContentKey(k => k + 1);
          }
          return { ...INITIAL_STATE, ...newData };
        });
      }
    });

    return () => unsubscribe();
  }, []);

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
      const contentRef = doc(db, "settings", CONTENT_DOC_ID);
      const cleanContent = {
        mainContent: newContent.mainContent || INITIAL_STATE.mainContent,
        stats: newContent.stats || INITIAL_STATE.stats,
        appIcon: newContent.appIcon || null,
        appLink: newContent.appLink || null,
        whatsappNumber: newContent.whatsappNumber || null
      };
      await setDoc(contentRef, cleanContent);
      setIsAdminPanelOpen(false);
    } catch (e) {
      console.error("Failed to save to Firestore", e);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleReset = async () => {
    if (window.confirm("هل أنت متأكد من رغبتك في استعادة الإعدادات الافتراضية؟")) {
      try {
        const contentRef = doc(db, "settings", CONTENT_DOC_ID);
        await setDoc(contentRef, INITIAL_STATE);
        setIsAdminPanelOpen(false);
      } catch (e) {
        alert("فشل في إعادة تعيين البيانات");
      }
    }
  };

  const currentAppLink = content.appLink || '#';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-bold animate-pulse text-center text-sm">جاري الاتصال بـ SAWA Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#0a0f1e] selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-[-10%] left-[-20%] w-[80%] md:w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[0%] right-[-20%] w-[80%] md:w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[60px] md:blur-[120px] pointer-events-none" />

      <main 
        ref={mainRef}
        className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-20 flex flex-col items-center gap-8 md:gap-16"
      >
        <header className="text-center space-y-6 md:space-y-10 pt-4 flex flex-col items-center w-full">
          <div className="flex flex-col items-center gap-5">
            <a 
              href={currentAppLink}
              target={content.appLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="relative group transition-all duration-500 hover:scale-110 active:scale-95"
            >
              <div className="absolute inset-0 bg-cyan-500/20 rounded-[1.5rem] md:rounded-[2rem] blur-xl group-hover:bg-cyan-500/40 transition-all duration-500" />
              <div className="relative w-20 h-20 md:w-32 md:h-32 glass rounded-[1.5rem] md:rounded-[2rem] border border-white/20 p-1 overflow-hidden shadow-2xl flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                {content.appIcon ? (
                  <img src={content.appIcon} alt="App Logo" className="w-full h-full object-cover rounded-[1.3rem] md:rounded-[1.8rem]" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-cyan-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 opacity-50 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                     </svg>
                     <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-40">SAWA</span>
                  </div>
                )}
              </div>
              <span className="absolute -top-1 -right-1 flex h-5 w-5 md:h-6 md:w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 md:h-6 md:w-6 bg-cyan-500 border-2 md:border-4 border-[#0a0f1e] flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                </span>
              </span>
            </a>

            <a 
              href={currentAppLink}
              target={content.appLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold text-xs md:text-base hover:text-cyan-300 transition-colors flex items-center gap-2 group underline-offset-4 hover:underline"
            >
              <span>تحميل التطبيق الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
              </svg>
            </a>
          </div>

          <div className="space-y-1 md:space-y-3">
            <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 tracking-tighter drop-shadow-xl">
              SAWA LIVE
            </h1>
            <p className="text-cyan-400/80 font-bold tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-sm uppercase">
              القيمة الحقيقية في عالم البث
            </p>
          </div>
        </header>

        <div className="w-full glass rounded-3xl md:rounded-[3rem] p-6 md:p-14 shadow-2xl border border-white/10 transition-all duration-700 min-h-[350px] md:min-h-[450px]">
          <TypewriterEffect 
            key={contentKey}
            text={content.mainContent} 
            onComplete={() => setTypingComplete(true)} 
          />
        </div>

        <div className={`w-full transition-all duration-1000 transform ${typingComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <FeatureGrid stats={content.stats} />
        </div>

        <footer className="text-slate-500 text-[9px] md:text-xs py-12 opacity-60 text-center w-full border-t border-white/5 mt-10 flex flex-col items-center gap-6">
           <div className="max-w-[250px] md:max-w-none leading-relaxed">
            &copy; {new Date().getFullYear()} SAWA LIVE. جميع الحقوق محفوظة.
            <br className="md:hidden" />
            <span className="hidden md:inline mx-3 text-slate-700">|</span>
            نظام محدث بالسحابة الذكية
           </div>
           
           <button 
            onClick={() => {
              if (isAuthenticated) setIsAdminPanelOpen(true);
              else setIsAdminLoginOpen(true);
            }}
            className="p-3.5 hover:bg-white/5 rounded-full transition-all hover:rotate-90 group active:scale-90"
            title="لوحة التحكم"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
           </button>
        </footer>
      </main>

      {showContact && <WhatsAppButton phoneNumber={content.whatsappNumber || INITIAL_STATE.whatsappNumber!} />}

      {isAdminLoginOpen && (
        <AdminLogin 
          onLogin={handleAdminAuth} 
          onClose={() => setIsAdminLoginOpen(false)} 
        />
      )}

      {isAdminPanelOpen && (
        <AdminPanel 
          content={content} 
          onSave={handleSave} 
          onClose={() => setIsAdminPanelOpen(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
