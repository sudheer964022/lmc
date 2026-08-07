import React, { useState } from 'react';
import { ArrowLeft, User, KeyRound, Lock, Phone } from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const ForgotPasswordScreen = ({ setCurrentScreen }) => {
  const [step, setStep] = useState(1); // 1: Target Identification, 2: OTP, 3: New Password
  const [resetMode, setResetMode] = useState('empid'); // 'empid' or 'phone'
  const [empId, setEmpId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (value, idx) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Auto-focus next field
    if (value && idx < 5) {
      document.getElementById(`forgot-otp-${idx + 1}`).focus();
    }
  };

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
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6195/6195696.png" 
              alt="Reset Password Icon" 
              className="w-16 h-16 object-contain mb-4" 
            />
            <h2 className="text-xl font-bold text-slate-800 mb-1">Forgot Password?</h2>
            <p className="text-slate-500 mb-4 text-xs leading-normal">
              Select verification method to receive a one-time password (OTP) code.
            </p>

            {/* Reset Mode Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4 border border-slate-200/50">
              <button
                type="button"
                onClick={() => setResetMode('empid')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  resetMode === 'empid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <IdCardIcon size={13} />
                Employee ID
              </button>
              <button
                type="button"
                onClick={() => setResetMode('phone')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  resetMode === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Phone size={13} />
                Phone Number
              </button>
            </div>

            {resetMode === 'empid' ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Employee ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IdCardIcon size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={empId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 10) setEmpId(val);
                    }}
                    maxLength={10}
                    placeholder="LMC0225" 
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val) && val.length <= 10) {
                        setPhoneNumber(val);
                      }
                    }}
                    maxLength={10}
                    placeholder="Enter 10-digit number" 
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                if (resetMode === 'empid' && !empId.trim()) {
                  alert('Please enter a valid Employee ID');
                  return;
                }
                if (resetMode === 'phone' && phoneNumber.length !== 10) {
                  alert('Phone Number must be exactly 10 digits!');
                  return;
                }
                const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                window.demoForgotOtp = generatedOtp;
                window.dispatchEvent(new Event('demo-otp-updated'));
                setStep(2);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-1.5"
            >
              <KeyRound size={16} />
              Send OTP Code
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Enter OTP</h2>
            <p className="text-slate-500 mb-5 text-sm leading-normal">
              We've sent a 6-digit OTP code to verify your request.
            </p>

            <div className="flex gap-2 justify-between mb-6">
              {otp.map((digit, idx) => (
                <input 
                  key={idx} 
                  id={`forgot-otp-${idx}`}
                  type="text" 
                  maxLength={1} 
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-11 text-center text-base font-bold bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm transition-all"
                />
              ))}
            </div>

            <button 
              onClick={() => {
                const enteredOtp = otp.join('');
                const expectedOtp = window.demoForgotOtp || '123456';
                if (enteredOtp === expectedOtp) {
                  setStep(3);
                } else {
                  alert(`Invalid OTP! Demo code: ${expectedOtp}`);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              Verify OTP Code
            </button>
            <p className="text-center mt-4 text-xs text-slate-500">
              Didn't receive it? <button className="text-blue-600 font-semibold" onClick={() => setOtp(['', '', '', '', '', ''])}>Resend OTP</button>
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
        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  </div>
);

export default ForgotPasswordScreen;
