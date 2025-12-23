
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import TypewriterEffect from './components/TypewriterEffect';
import FeatureGrid from './components/FeatureGrid';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
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

// Initialize Firebase
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
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0); 
  const mainRef = useRef<HTMLDivElement>(null);

  // Sync with Firestore on mount
  useEffect(() => {
    const contentRef = doc(db, "settings", CONTENT_DOC_ID);

    // Initial fetch from Cloud
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
          // Default initialization on first run
          await setDoc(contentRef, INITIAL_STATE);
        }
      } catch (e) {
        console.error("Firestore loading error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Listen for live updates (Real-time synchronization)
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

  const handleSave = async (newContent: SawaContentState) => {
    try {
      const contentRef = doc(db, "settings", CONTENT_DOC_ID);
      // Data scrubbing to prevent 'undefined' errors in Firestore
      const cleanContent = {
        mainContent: newContent.mainContent || INITIAL_STATE.mainContent,
        stats: newContent.stats || INITIAL_STATE.stats,
        appIcon: newContent.appIcon || null,
        appLink: newContent.appLink || null,
        whatsappNumber: newContent.whatsappNumber || null
      };
      await setDoc(contentRef, cleanContent);
      setIsAdminOpen(false);
    } catch (e) {
      console.error("Failed to save to Firestore", e);
      alert("حدث خطأ أثناء الحفظ في السحابة");
    }
  };

  const handleReset = async () => {
    if (window.confirm("هل أنت متأكد من رغبتك في استعادة الإعدادات الافتراضية؟")) {
      try {
        const contentRef = doc(db, "settings", CONTENT_DOC_ID);
        await setDoc(contentRef, INITIAL_STATE);
        setIsAdminOpen(false);
      } catch (e) {
        alert("فشل في إعادة تعيين البيانات");
      }
    }
  };

  const currentAppLink = content.appLink || '#';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-bold animate-pulse">جاري الاتصال بـ SAWA Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#0a0f1e] selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      <div className="fixed top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[5%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <main 
        ref={mainRef}
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-20 flex flex-col items-center gap-8 md:gap-14"
      >
        <header className="text-center space-y-6 md:space-y-8 pt-4 md:pt-0 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            <a 
              href={currentAppLink}
              target={content.appLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="relative group transition-all duration-500 hover:scale-110 active:scale-95"
            >
              <div className="absolute inset-0 bg-cyan-500/30 rounded-[2rem] blur-2xl group-hover:bg-cyan-500/50 transition-all duration-500 animate-pulse" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 glass rounded-[2rem] border border-white/20 p-1 overflow-hidden shadow-2xl flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                {content.appIcon ? (
                  <img src={content.appIcon} alt="App Logo" className="w-full h-full object-cover rounded-[1.8rem]" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-cyan-400">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                     </svg>
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">App Logo</span>
                  </div>
                )}
              </div>
              <span className="absolute -top-2 -right-2 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-cyan-500 border-4 border-[#0a0f1e] flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                   </svg>
                </span>
              </span>
            </a>

            <a 
              href={currentAppLink}
              target={content.appLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold text-sm md:text-base hover:text-cyan-300 transition-colors flex items-center gap-2 group underline-offset-4 hover:underline"
            >
              <span>انتقل إلى التطبيق الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
              </svg>
            </a>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-4xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 tracking-tighter drop-shadow-lg">
              SAWA LIVE
            </h1>
            <p className="text-cyan-400/80 font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase">
              القيمة الحقيقية في عالم البث
            </p>
          </div>
        </header>

        <div className="w-full glass rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 shadow-2xl border border-white/10 transition-all duration-700 min-h-[300px]">
          <TypewriterEffect 
            key={contentKey}
            text={content.mainContent} 
            onComplete={() => setTypingComplete(true)} 
          />
        </div>

        <div className={`w-full transition-all duration-1000 transform ${typingComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <FeatureGrid stats={content.stats} />
        </div>

        <footer className="text-slate-500 text-[10px] md:text-xs py-10 opacity-60 text-center w-full border-t border-white/5 mt-8 flex flex-col items-center gap-4">
           <div>
            &copy; {new Date().getFullYear()} SAWA LIVE. جميع الحقوق محفوظة.
            <br className="md:hidden" />
            <span className="hidden md:inline mx-2">|</span>
            متصل بـ Cloud Firestore
           </div>
           
           <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-3 hover:bg-white/5 rounded-full transition-all hover:rotate-90 group"
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

      {isAdminOpen && (
        <AdminPanel 
          content={content} 
          onSave={handleSave} 
          onClose={() => setIsAdminOpen(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
