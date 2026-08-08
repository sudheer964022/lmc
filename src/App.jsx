import React, { useState, useEffect } from 'react';
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
import SettingsScreen from './screens/SettingsScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import HelpScreen from './screens/HelpScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        return <ProfileScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'routes':
        return <RoutesScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'scan':
        return <ScanScreen setCurrentScreen={setCurrentScreen} />;
      case 'tasks':
        return <TasksScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'settings':
        return <SettingsScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'attendance':
        return <AttendanceScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'notifications':
        return <NotificationsScreen setCurrentScreen={setCurrentScreen} />;
      case 'privacy':
        return <PrivacyScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      case 'help':
        return <HelpScreen setCurrentScreen={setCurrentScreen} setIsSidebarOpen={setIsSidebarOpen} />;
      default:
        return <LoginScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  const showBottomNav = !['splash', 'login', 'register', 'forgot'].includes(currentScreen);

  return (
    <MobileWrapper>
      {!isOnline && (
        <div className="bg-red-500 text-white text-xs font-semibold pt-5 sm:pt-6 pb-1.5 px-4 text-center z-50 flex items-center justify-center gap-2 shadow-sm animate-fade-in-down sticky top-0">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          No Internet Connection
        </div>
      )}
      {renderScreen()}
      {showBottomNav && <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setCurrentScreen={setCurrentScreen} currentScreen={currentScreen} />
    </MobileWrapper>
  );
}

export default App;
