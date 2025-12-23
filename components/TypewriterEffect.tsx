
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterEffect: React.FC<Props> = ({ text, speed = 20, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        
        // Auto-scroll logic: Only scroll if the user is already near the bottom
        // This allows them to "go up" to read previous lines without the page jumping back down constantly.
        const scrollThreshold = 150; // pixels from bottom
        const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - scrollThreshold);
        
        if (isNearBottom && currentIndex % 8 === 0) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div ref={containerRef} className="relative leading-[1.8] md:leading-[2] text-base md:text-xl whitespace-pre-wrap font-medium text-slate-100">
      {displayText}
      <span className="inline-block w-1.5 md:w-3 h-4 md:h-6 bg-cyan-400 ml-1 cursor align-middle shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
    </div>
  );
};

export default TypewriterEffect;
