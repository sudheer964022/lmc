import React from 'react';

const CustomHomeIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png' 
      : 'https://cdn-icons-png.flaticon.com/512/1946/1946488.png'} 
    alt="Home"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const CustomRoutesIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/2923/2923404.png' 
      : 'https://cdn-icons-png.flaticon.com/512/2923/2923416.png'} 
    alt="Routes"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const CustomScanIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/11414/11414226.png'
      : 'https://cdn-icons-png.flaticon.com/512/11414/11414280.png'} 
    alt="Scan"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const CustomTasksIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/4294/4294728.png'
      : 'https://cdn-icons-png.flaticon.com/512/2957/2957016.png'} 
    alt="Tasks"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const CustomProfileIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/1144/1144811.png'
      : 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'} 
    alt="Profile"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

const BottomNav = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    { id: 'home', icon: CustomHomeIcon, label: 'Home' },
    { id: 'routes', icon: CustomRoutesIcon, label: 'Routes' },
    { id: 'scan', icon: CustomScanIcon, label: 'Scan' },
    { id: 'tasks', icon: CustomTasksIcon, label: 'History' },
    { id: 'profile', icon: CustomProfileIcon, label: 'Profile' },
  ];

  return (
    <div className="bg-white border-t border-slate-100 px-6 py-3 pb-6 sm:pb-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`px-5 py-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-100' : ''}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} isActive={isActive} />
            </div>
            <span className={`text-[10px] transition-all duration-300 ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
