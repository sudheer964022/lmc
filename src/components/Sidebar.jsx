import React from 'react';
import { X, LogOut } from 'lucide-react';
import { 
  SidebarProfileIcon, SidebarAttendanceIcon, SidebarPrivacyIcon, 
  SidebarHelpIcon, SidebarSettingsIcon 
} from './SidebarIcons';
const Sidebar = ({ isOpen, setIsOpen, setCurrentScreen, currentScreen }) => {
  // Mock user data in JSON format
  const userData = {
    name: "Sudheer Reddy",
    empId: "LMC-0225",
    initials: "SR",
    status: 1 // 1 for Active, 0 for Inactive
  };

  return (
    <>
      {/* Overlay */ }
      <div
        className={ `absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}` }
        onClick={ () => setIsOpen(false) }
      />

      {/* Sidebar Panel */ }
      <div className={ `absolute top-0 left-0 h-full w-full bg-white z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}` }>

        {/* Header */ }
        <div className="p-5 bg-blue-50 flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                { userData.initials }
              </div>
              {/* Status Dot */ }
              <div className={ `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-blue-50 ${userData.status === 1 ? 'bg-green-500' : 'bg-red-500'}` }></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-base">{ userData.name }</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">{ userData.empId }</span>
                {/* Status Badge */ }
                <span className={ `text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${userData.status === 1
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                  }` }>
                  { userData.status === 1 ? 'Active' : 'Inactive' }
                </span>
              </div>
            </div>
          </div>
          <button onClick={ () => setIsOpen(false) } className="p-0.5 text-slate-400 hover:bg-slate-200 rounded-full">
            <X size={ 18 } />
          </button>
        </div>

        {/* Menu Items */ }
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">LMC Portal</div>
          
          <MenuButton icon={SidebarProfileIcon} label="My Profile" isActive={currentScreen === 'profile'} onClick={() => { setCurrentScreen('profile'); setIsOpen(false); }} />
          <MenuButton icon={SidebarAttendanceIcon} label="Attendance" isActive={currentScreen === 'attendance'} onClick={() => { setCurrentScreen('attendance'); setIsOpen(false); }} />
          <MenuButton icon={SidebarPrivacyIcon} label="Privacy Policy" isActive={currentScreen === 'privacy'} onClick={() => { setCurrentScreen('privacy'); setIsOpen(false); }} />
          <MenuButton icon={SidebarHelpIcon} label="Help & Support" isActive={currentScreen === 'help'} onClick={() => { setCurrentScreen('help'); setIsOpen(false); }} />
          <MenuButton icon={SidebarSettingsIcon} label="Settings" isActive={currentScreen === 'settings'} onClick={() => { setCurrentScreen('settings'); setIsOpen(false); }} />
        </div>

        {/* Footer */ }
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={ () => { setCurrentScreen('login'); setIsOpen(false); } }
            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={ 18 } />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const MenuButton = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={ onClick }
    className={ `w-full flex items-center gap-3 px-5 py-2.5 transition-colors ${isActive
        ? 'text-blue-600 bg-blue-50/50'
        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
      }` }
  >
    <Icon size={ 18 } isActive={ isActive } className={ isActive ? 'text-blue-600' : '' } />
    <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{ label }</span>
  </button>
);

export default Sidebar;
