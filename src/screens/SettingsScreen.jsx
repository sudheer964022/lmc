import React, { useState } from 'react';
import { 
  ArrowLeft, Bell, KeyRound, Shield, Eye, Moon, 
  Trash2, HelpCircle, Check, Smartphone, Volume2, Database
} from 'lucide-react';

const SettingsScreen = ({ setCurrentScreen }) => {
  // Toggle states
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // Success states for mock actions
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col animate-fade-in-up overflow-hidden">
      {/* Top App Bar */}
      <div className="bg-white px-5 pt-10 pb-3 border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <button 
          onClick={() => setCurrentScreen('profile')} 
          className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black text-slate-900 tracking-tight">Settings</h1>
        <div className="w-8 h-8"></div> {/* Balancer */}
      </div>

      {/* Settings Options List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20 flex flex-col gap-4 scrollbar-hide">
        
        {/* Section: Security */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Security & Access</h3>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            
            <SettingRow 
              icon={<KeyRound size={16} className="text-blue-600" />} 
              title="Passkey Sign-In" 
              description="Sign in securely using fingerprints or FaceID"
              checked={passkeyEnabled}
              onChange={setPasskeyEnabled}
            />

          </div>
        </div>

        {/* Section: Notifications */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Notifications</h3>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            
            <SettingRow 
              icon={<Bell size={16} className="text-amber-500" />} 
              title="Allow Push Notifications" 
              description="Alerts for new assigned pickup requests"
              checked={pushNotifs}
              onChange={setPushNotifs}
            />
            
            <SettingRow 
              icon={<Volume2 size={16} className="text-rose-500" />} 
              title="Emergency Alarm Sound" 
              description="Loud ringtone for high-priority tasks"
              checked={soundAlerts}
              onChange={setSoundAlerts}
            />

          </div>
        </div>

        {/* Section: Preferences */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-widest">System Preferences</h3>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            
            <SettingRow 
              icon={<Database size={16} className="text-emerald-600" />} 
              title="Offline Caching Mode" 
              description="Save sample details locally if signal is lost"
              checked={offlineMode}
              onChange={setOfflineMode}
            />

          </div>
        </div>

        {/* Section: Diagnostics & Storage */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[9px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Storage & Cache</h3>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col gap-2.5">
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Local Cache Storage</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Logs and route data (14.2 MB)</p>
              </div>
              <button 
                onClick={handleClearCache}
                className={`py-1.5 px-2.5 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all ${
                  cacheCleared 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 active:scale-95'
                }`}
              >
                {cacheCleared ? (
                  <>
                    <Check size={11} strokeWidth={2.5} />
                    <span>Cleared</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={11} />
                    <span>Clear Cache</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Switch row helper
const SettingRow = ({ icon, title, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-2.5 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-2.5 mr-4">
      <div className="bg-slate-50 p-1.5 rounded-lg shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-black text-slate-800 truncate leading-snug">{title}</span>
        <span className="text-[9px] text-slate-400 font-bold leading-normal mt-0.5">{description}</span>
      </div>
    </div>
    
    {/* Custom iOS switch toggle */}
    <button 
      onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 ease-out focus:outline-none shrink-0 ${
        checked ? 'bg-blue-600' : 'bg-slate-200'
      }`}
    >
      <div 
        className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-250 ease-out transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

export default SettingsScreen;
