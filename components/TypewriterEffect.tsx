
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterEffect: React.FC<Props> = ({ text, speed = 15, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
        
        const scrollThreshold = 100;
        const isNearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - scrollThreshold);
        
        if (isNearBottom && currentIndex % 10 === 0) {
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
    <div ref={containerRef} className="relative leading-[1.7] md:leading-[2] text-[15px] md:text-xl whitespace-pre-wrap font-medium text-slate-100">
      {displayText}
      <span className="inline-block w-1 md:w-2.5 h-3.5 md:h-6 bg-cyan-400 ml-1 cursor align-middle shadow-[0_0_10px_rgba(34,211,238,0.9)]"></span>
    </div>
  );
};

export default TypewriterEffect;
