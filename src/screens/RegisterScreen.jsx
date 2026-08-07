import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, KeyRound } from 'lucide-react';

const RegisterScreen = ({ setCurrentScreen }) => {
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedEmpId, setGeneratedEmpId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Registration Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleOtpChange = (value, idx) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Auto-focus next field
    if (value && idx < 5) {
      document.getElementById(`reg-otp-${idx + 1}`).focus();
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Phone Number must be exactly 10 digits!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    window.demoRegisterOtp = generatedOtp;
    window.dispatchEvent(new Event('demo-otp-updated'));
    setIsVerifyingOtp(true);
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join('');
    const expectedOtp = window.demoRegisterOtp || '123456';
    if (enteredOtp !== expectedOtp) {
      alert(`Invalid Verification OTP! Demo code: ${expectedOtp}`);
      return;
    }
    // Auto generate LMC0225 so it maps to the default demo user!
    const randomId = 'LMC0225';
    setGeneratedEmpId(randomId);
    setIsRegistered(true);
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex justify-center items-center z-10 sticky top-0 bg-slate-50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {isRegistered ? 'Account Ready' : isVerifyingOtp ? 'Verify Phone Number' : 'Registration'}
        </h1>
      </div>

      <div className="flex justify-center pt-2 pb-4">
        <img src="https://vsoft.avmlabs.com/CDN/images/Vsoft_Logo.png" alt="AVMLabs Logo" className="h-16 object-contain" />
      </div>

      {/* Form or OTP view or Success view */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
        {isRegistered ? (
          <div className="animate-fade-in-up flex flex-col items-center pt-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5 text-emerald-600 shadow-sm animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Registration Complete!</h2>
            <p className="text-slate-500 mb-6 text-xs px-2 leading-relaxed">
              Your LMC account has been verified. We have automatically generated your Employee ID below. Please save it for signing in.
            </p>

            <div className="bg-blue-50 border border-blue-150 px-6 py-4 rounded-lg mb-8 flex flex-col items-center gap-1 shadow-sm">
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Your Employee ID</span>
              <span className="text-2xl font-black text-blue-700 tracking-wider">{generatedEmpId}</span>
            </div>

            <button 
              onClick={() => setCurrentScreen('login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              Proceed to Login
            </button>
          </div>
        ) : !isVerifyingOtp ? (
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-2">
            
            {/* Employee Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@lab.com"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val) && val.length <= 10) {
                      setPhone(val);
                    }
                  }}
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            
            <div className="mt-5 mb-2">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          </form>
        ) : (
          <div className="animate-fade-in-up flex flex-col pt-2">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600 mx-auto">
              <KeyRound size={22} />
            </div>
            <h2 className="text-base font-bold text-slate-800 text-center mb-1">Verify Registration</h2>
            <p className="text-slate-500 mb-5 text-xs text-center leading-normal">
              We've sent a 6-digit OTP to verify your registered phone number.
            </p>

            <div className="flex gap-2 justify-between mb-6">
              {otp.map((digit, idx) => (
                <input 
                  key={idx}
                  id={`reg-otp-${idx}`}
                  type="text" 
                  maxLength={1} 
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-11 text-center text-base font-bold bg-white border border-slate-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm transition-all"
                />
              ))}
            </div>

            <button 
              onClick={handleVerifyOtp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
            >
              Verify & Complete Register
            </button>
            
            <div className="text-center mt-4">
              <button 
                onClick={() => setIsVerifyingOtp(false)}
                className="text-xs text-slate-500 font-semibold hover:text-slate-700 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={12} /> Back to Form
              </button>
            </div>
          </div>
        )}

        {!isRegistered && (
          <div className="mt-auto pt-4 pb-2 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button onClick={() => setCurrentScreen('login')} className="text-blue-600 font-semibold hover:underline">
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterScreen;
