import React from 'react';
import { 
  SidebarAttendanceIcon, SidebarPrivacyIcon, SidebarHelpIcon, SidebarSettingsIcon 
} from '../components/SidebarIcons';
import { 
  User, Mail, Phone, Settings, ShieldCheck, HelpCircle, 
  LogOut, ChevronRight, Edit3, ArrowLeft, ClipboardList
} from 'lucide-react';
import IdCardIcon from '../components/IdCardIcon';

const ProfileScreen = ({ setCurrentScreen }) => {
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setCurrentScreen('home')} 
            className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Profile</h1>
          <button className="p-2 -mr-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <Edit3 size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#e2ebf6] overflow-hidden shadow-sm">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                alt="User Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white translate-x-1/4 translate-y-1/4"></div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Sudheer Reddy</h2>
          <p className="text-[11px] font-medium text-blue-600 mb-2 leading-tight">Collection Executive</p>
          
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 text-[10px] font-semibold">
            <IdCardIcon size={12} />
            <span>LMC-1001</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 pb-24 flex flex-col gap-6">
        
        {/* Contact Info */}
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 p-3 border-b border-slate-50">
            <div className="bg-slate-50 p-2 rounded-xl text-slate-500">
              <Mail size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400">Email Address</span>
              <span className="text-xs font-bold text-slate-700">lmc1@avmlabs.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <div className="bg-slate-50 p-2 rounded-xl text-slate-500">
              <Phone size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400">Phone Number</span>
              <span className="text-xs font-bold text-slate-700">+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Preferences Menu */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-500 ml-2 uppercase tracking-wider mb-1">Preferences</h3>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <MenuRow icon={SidebarAttendanceIcon} label="Attendance" onClick={() => setCurrentScreen('attendance')} />
            <MenuRow icon={SidebarPrivacyIcon} label="Privacy Policy" onClick={() => setCurrentScreen('privacy')} />
            <MenuRow icon={SidebarHelpIcon} label="Help & Support" onClick={() => setCurrentScreen('help')} />
            <MenuRow icon={SidebarSettingsIcon} label="Settings" onClick={() => setCurrentScreen('settings')} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2">
          <button 
            onClick={() => setCurrentScreen('login')}
            className="w-full bg-white border border-red-100 hover:bg-red-50 text-red-600 font-bold py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <LogOut size={18} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
        
      </div>
    </div>
  );
};

const MenuRow = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors w-full text-left">
    <div className="flex items-center gap-3 text-slate-700">
      <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
        <Icon size={18} />
      </div>
      <span className="text-[13px] font-bold">{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-400" />
  </button>
);

export default ProfileScreen;
