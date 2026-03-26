"use client";

import { useEffect, useState } from "react";

export function InteractiveEnvironment() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {/* Global Mouse Tracking Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.05), transparent 40%)`
        }}
      />
      
      {/* Global Panning Substrate Grid */}
      <div className="fixed inset-0 -z-50 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[length:50px_50px] animate-grid-pan" />
    </>
  );
}
