import React from 'react';

export const SidebarProfileIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/1144/1144811.png'
      : 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'} 
    alt="Profile"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const SidebarAttendanceIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/3125/3125932.png'
      : 'https://cdn-icons-png.flaticon.com/512/3125/3125797.png'} 
    alt="Attendance"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const SidebarPrivacyIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/12121/12121642.png'
      : 'https://cdn-icons-png.flaticon.com/512/12121/12121640.png'} 
    alt="Privacy Policy"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const SidebarHelpIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/471/471715.png'
      : 'https://cdn-icons-png.flaticon.com/512/471/471664.png'} 
    alt="Help & Support"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);

export const SidebarSettingsIcon = ({ size, isActive }) => (
  <img 
    src={isActive 
      ? 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png'
      : 'https://cdn-icons-png.flaticon.com/512/3524/3524636.png'} 
    alt="Settings"
    style={{ width: size, height: size, objectFit: 'contain' }}
  />
);
