import React, { useState } from 'react';
import { Fingerprint, Eye, EyeOff, Lock, Phone, KeyRound, AlertCircle, X } from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const LoginScreen = ({ setCurrentScreen }) => {
  const [loginMode, setLoginMode] = useState('empid'); // 'empid' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleOtpChange = (value, idx) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Auto-focus next field
    if (value && idx < 5) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
  };

  const handleSendOtp = () => {
    if (phoneNumber.trim() === '9346335295') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      window.demoLoginOtp = generatedOtp;
      window.dispatchEvent(new Event('demo-otp-updated'));
      setError('');
      setOtpSent(true);
    } else {
      setError('');
      window.dispatchEvent(new Event('open-demo-panel'));
    }
  };

  const handleLogin = () => {
    if (loginMode === 'empid') {
      if (empId.trim() === 'LMC0225' && password === '12345') {
        setError('');
        setCurrentScreen('home');
      } else {
        setError('');
        window.dispatchEvent(new Event('open-demo-panel'));
      }
    } else {
      const enteredOtp = otp.join('');
      const expectedOtp = window.demoLoginOtp || '777777';
      if (enteredOtp === expectedOtp) {
        setError('');
        setCurrentScreen('home');
      } else {
        setError('');
        window.dispatchEvent(new Event('open-demo-panel'));
      }
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-8 pb-2">
        <img src="https://vsoft.avmlabs.com/CDN/images/Vsoft_Logo.png" alt="AVMLabs Logo" className="h-16 mb-2 object-contain" />
        <h1 className="text-xl font-bold text-blue-600">LMC Portal</h1>
        <p className="text-blue-700 text-xs font-medium font-sans">Welcome back</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-5 pt-3 pb-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Sign In</h2>
        </div>

        {/* Login Mode Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-4 border border-slate-200/50">
          <button
            onClick={() => { setLoginMode('empid'); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'empid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IdCardIcon size={14} />
            Employee ID
          </button>
          <button
            onClick={() => { setLoginMode('phone'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone size={14} />
            Phone Number
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-start gap-2 text-red-700 text-[11px] font-bold animate-pulse">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          {loginMode === 'empid' ? (
            <>
              {/* Employee ID */}
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
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

              {/* Password */}
              <div className="flex flex-col gap-1.5 animate-fade-in-up">
                <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password" 
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
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

              <div className="flex items-center justify-between mt-0.5 animate-fade-in-up">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                  <span className="text-xs text-slate-600 font-medium">Remember me</span>
                </label>
                <button onClick={() => setCurrentScreen('forgot')} className="text-xs text-blue-600 font-semibold hover:text-blue-700">
                  Forgot Password?
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 animate-fade-in-up">
              {/* Phone Number Input */}
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
                    disabled={otpSent}
                    placeholder="Enter 10-digit number" 
                    className={`w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm ${otpSent ? 'bg-slate-100 opacity-80 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="flex flex-col gap-1.5 animate-fade-in-up mt-1">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-slate-700">Enter OTP Code</label>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      OTP Sent Successfully
                    </span>
                  </div>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, idx) => (
                      <input 
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text" 
                        maxLength={1} 
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className="w-10 h-11 text-center text-base font-bold bg-white border border-slate-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm transition-all"
                      />
                    ))}
                  </div>
                  <div className="text-center mt-1">
                    <button 
                      onClick={() => { setOtp(['', '', '', '', '', '']); setOtpSent(true); }}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Resend OTP Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          {loginMode === 'empid' ? (
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
            >
              Login
            </button>
          ) : !otpSent ? (
            <button 
              onClick={handleSendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <KeyRound size={16} />
              Send OTP
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
            >
              Verify OTP & Login
            </button>
          )}
          
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
