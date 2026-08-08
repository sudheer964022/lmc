import React from 'react';

export const SidebarProfileIcon = ({ size, isActive }) => (
  <img 
    src='https://cdn-icons-png.flaticon.com/512/236/236831.png'
    alt="Profile"
    style={{ width: size, height: size, objectFit: 'contain', opacity: isActive ? 1 : 0.7 }}
  />
);

export const SidebarAttendanceIcon = ({ size, isActive }) => (
  <img 
    src='https://cdn-icons-png.flaticon.com/512/3125/3125856.png'
    alt="Attendance"
    style={{ width: size, height: size, objectFit: 'contain', opacity: isActive ? 1 : 0.7 }}
  />
);

export const SidebarPrivacyIcon = ({ size, isActive }) => (
  <img 
    src='https://cdn-icons-png.flaticon.com/512/11815/11815984.png'
    alt="Privacy Policy"
    style={{ width: size, height: size, objectFit: 'contain', opacity: isActive ? 1 : 0.7 }}
  />
);

export const SidebarHelpIcon = ({ size, isActive }) => (
  <img 
    src='https://cdn-icons-png.flaticon.com/512/10439/10439810.png'
    alt="Help & Support"
    style={{ width: size, height: size, objectFit: 'contain', opacity: isActive ? 1 : 0.7 }}
  />
);

export const SidebarSettingsIcon = ({ size, isActive }) => (
  <img 
    src='https://cdn-icons-png.flaticon.com/512/2698/2698011.png'
    alt="Settings"
    style={{ width: size, height: size, objectFit: 'contain', opacity: isActive ? 1 : 0.7 }}
  />
);

export const SidebarDeliveryIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png'
      : 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png'} 
    alt="Delivery Workflow"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);
