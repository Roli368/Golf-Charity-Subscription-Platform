"use client";

import { useEffect, useState } from "react";

export function CountUp({ 
  end, 
  prefix = "", 
  suffix = "", 
  decimals = 0, 
  duration = 2500 
}: { 
  end: number, 
  prefix?: string, 
  suffix?: string, 
  decimals?: number, 
  duration?: number 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(easeProgress * end);
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);
    
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span>{prefix}{formatter.format(count)}{suffix}</span>;
}
