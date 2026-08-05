import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full w-full bg-blue-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-slate-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000" />
      
      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        <img src="https://vsoft.avmlabs.com/CDN/images/Vsoft_Logo.png" alt="Vsoft Logo" className="h-16 mb-4 object-contain bg-white shadow-xl" />
        
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">LMC</h1>
        <p className="text-blue-100 text-base font-medium tracking-wide uppercase">Last Mile Connect</p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center z-10">
        <div className="w-6 h-6 border-4 border-blue-400 border-t-white rounded-full animate-spin mb-3" />
        <p className="text-blue-200 text-xs font-medium">v 1.0.0</p>
      </div>
    </div>
  );
};

export default SplashScreen;
