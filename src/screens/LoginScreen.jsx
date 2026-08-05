import React, { useState } from 'react';
import { Fingerprint, Eye, EyeOff, Activity, Lock, User } from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const LoginScreen = ({ setCurrentScreen }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-8 pb-2">
        <img src="https://vsoft.avmlabs.com/CDN/images/Vsoft_Logo.png" alt="AVMLabs Logo" className="h-16 mb-2 object-contain" />
        <h1 className="text-xl font-bold text-blue-600">LMC Portal</h1>
        <p className="text-blue-700 text-xs font-medium">Welcome back</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-5 pt-4 pb-4 flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 mb-3">Sign In</h2>
        
        <div className="flex flex-col gap-3">
          {/* Employee ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 ml-1">Employee ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <IdCardIcon size={16} />
              </div>
              <input 
                type="text" 
                placeholder="LMC-0225" 
                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-xs text-slate-600 font-medium">Remember me</span>
            </label>
            <button onClick={() => setCurrentScreen('forgot')} className="text-xs text-blue-600 font-semibold hover:text-blue-700">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-col gap-2.5">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            Login
          </button>
          
          <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <Fingerprint size={16} className="text-blue-600" />
            <span>Sign in with Passkey</span>
          </button>


        </div>

        <div className="mt-auto pt-4 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => setCurrentScreen('register')} className="text-blue-600 font-semibold hover:underline">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
