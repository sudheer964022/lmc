import React from 'react';
import { ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const RegisterScreen = ({ setCurrentScreen }) => {
  return (
    <div className="h-full w-full bg-slate-50 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex justify-center items-center z-10 sticky top-0 bg-slate-50">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Registration</h1>
      </div>

      <div className="flex justify-center pt-2 pb-4">
        <img src="https://vsoft.avmlabs.com/CDN/images/Vsoft_Logo.png" alt="AVMLabs Logo" className="h-10 object-contain" />
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-6">
        <div className="flex flex-col gap-2">
          
          <InputField icon={User} label="Employee Name" placeholder="e.g. John Doe" />
          <InputField icon={IdCardIcon} label="Employee ID" placeholder="e.g. LMC-1001" />
          <InputField icon={Mail} label="Email Address" type="email" placeholder="john@lab.com" />
          <InputField icon={Phone} label="Phone Number" type="tel" placeholder="+91 934 567 8900" />
          <InputField icon={Lock} label="Password" type="password" placeholder="Create a password" />
          <InputField icon={Lock} label="Confirm Password" type="password" placeholder="Confirm your password" />
          
        </div>

        <div className="mt-6 mb-4">
          <button 
            onClick={() => setCurrentScreen('login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            Register
          </button>
        </div>

        <div className="mt-auto pt-2 pb-4 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button onClick={() => setCurrentScreen('login')} className="text-blue-600 font-semibold hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ icon: Icon, label, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-700 ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Icon size={16} />
      </div>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
      />
    </div>
  </div>
);

export default RegisterScreen;
