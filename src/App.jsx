import React, { useState } from 'react';
import MobileWrapper from './components/MobileWrapper';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RoutesScreen from './screens/RoutesScreen';
import ScanScreen from './screens/ScanScreen';
import TasksScreen from './screens/TasksScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen setCurrentScreen={setCurrentScreen} />;
      case 'register':
        return <RegisterScreen setCurrentScreen={setCurrentScreen} />;
      case 'forgot':
        return <ForgotPasswordScreen setCurrentScreen={setCurrentScreen} />;
      case 'home':
        return <HomeScreen setIsSidebarOpen={setIsSidebarOpen} setCurrentScreen={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen setCurrentScreen={setCurrentScreen} />;
      case 'routes':
        return <RoutesScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'scan':
        return <ScanScreen setCurrentScreen={setCurrentScreen} />;
      case 'tasks':
        return <TasksScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'attendance':
      case 'privacy':
      case 'help':
      case 'settings':
        return (
          <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 animate-fade-in-up">
            {/* Top App Bar */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center z-10 shadow-md sticky top-0">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 -ml-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="font-bold text-lg capitalize">{currentScreen}</h1>
              <div className="w-10 h-10"></div> {/* Placeholder for layout balance */}
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-slate-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h2 className="text-xl text-slate-700 font-bold mb-2 capitalize">{currentScreen} Screen</h2>
              <p className="text-slate-500">This module will be built in Phase 2.</p>
            </div>
          </div>
        );
      default:
        return <LoginScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  const showBottomNav = !['splash', 'login', 'register', 'forgot'].includes(currentScreen);

  return (
    <MobileWrapper>
      {renderScreen()}
      {showBottomNav && <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setCurrentScreen={setCurrentScreen} currentScreen={currentScreen} />
    </MobileWrapper>
  );
}

export default App;
