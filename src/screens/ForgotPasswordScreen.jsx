import React, { useState } from 'react';
import { ArrowLeft, User, KeyRound, Lock } from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const ForgotPasswordScreen = ({ setCurrentScreen }) => {
  const [step, setStep] = useState(1); // 1: EmpID, 2: OTP, 3: New Password

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-3 z-10 sticky top-0 shadow-sm">
        <button onClick={() => setCurrentScreen('login')} className="p-1 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Reset Password</h1>
      </div>

      <div className="flex-1 px-5 py-6 flex flex-col">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <KeyRound size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Forgot Password?</h2>
            <p className="text-slate-500 mb-5 text-sm">
              Enter your Employee ID below and we will send an OTP to your registered phone number to reset your password.
            </p>

            <InputField icon={IdCardIcon} label="Employee ID" placeholder="LMC-0225" />

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] mt-6"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Enter OTP</h2>
            <p className="text-slate-500 mb-5 text-sm">
              We've sent a 6-digit OTP to your registered phone number.
            </p>

            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input 
                  key={i} 
                  type="text" 
                  maxLength={1} 
                  className="w-10 h-12 text-center text-lg font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              ))}
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              Verify OTP
            </button>
            <p className="text-center mt-4 text-xs text-slate-500">
              Didn't receive it? <button className="text-blue-600 font-semibold">Resend OTP</button>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Create New Password</h2>
            <p className="text-slate-500 mb-5 text-sm">
              Please enter your new password below.
            </p>

            <div className="flex flex-col gap-3">
              <InputField icon={Lock} label="New Password" type="password" placeholder="Enter new password" />
              <InputField icon={Lock} label="Confirm Password" type="password" placeholder="Confirm new password" />
            </div>

            <button 
              onClick={() => setCurrentScreen('login')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] mt-6"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, label, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-700 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={16} />
      </div>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  </div>
);

export default ForgotPasswordScreen;
