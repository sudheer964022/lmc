import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, ShieldAlert, FlaskConical, Bell } from 'lucide-react';
import NotificationDetails from '../components/NotificationDetails';

const mockNotifications = [
  {
    id: 1,
    type: 'client',
    title: 'New Client Message',
    clientName: 'Apollo Hospitals',
    message: 'Apollo Hospitals updated collection time to 2:00 PM',
    time: '10 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'management',
    title: 'Route Update',
    message: 'Please avoid Route 45 due to heavy traffic.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    type: 'lab',
    title: 'Lab Alert',
    message: 'Urgent: Sample processing delayed at Main Lab',
    time: '2 hours ago',
    unread: false,
  },
  {
    id: 4,
    type: 'client',
    title: 'Client Feedback',
    clientName: 'Dr. Smith',
    message: 'Dr. Smith left a positive feedback for yesterday\'s pickup.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 5,
    type: 'lab',
    title: 'New Equipment',
    message: 'New centrifuge machine available in Lab B.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 6,
    type: 'client',
    title: 'Pickup Cancelled',
    clientName: 'City Clinic',
    message: 'City Clinic has cancelled their scheduled pickup for today.',
    time: '2 days ago',
    unread: false,
  },
  {
    id: 7,
    type: 'management',
    title: 'Policy Update',
    message: 'Please review the new sample handling guidelines updated in the portal.',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 8,
    type: 'lab',
    title: 'Maintenance',
    message: 'Lab A will be closed for maintenance tomorrow from 2 AM to 5 AM.',
    time: '4 days ago',
    unread: false,
  },
  {
    id: 9,
    type: 'client',
    title: 'Special Request',
    clientName: 'Dr. Ramesh',
    message: 'Dr. Ramesh requested dry ice for the next collection.',
    time: '1 week ago',
    unread: false,
  },
  {
    id: 10,
    type: 'management',
    title: 'Weekly Meeting',
    message: 'Reminder: Mandatory all-hands meeting at 9:00 AM this Friday.',
    time: '1 week ago',
    unread: false,
  }
];

const NotificationsScreen = ({ setCurrentScreen }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleNotificationClick = (notif) => {
    if (notif.unread) {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    }
    // Update the selected notification with the read status
    setSelectedNotification({ ...notif, unread: false });
  };

  if (selectedNotification) {
    return (
      <NotificationDetails 
        notification={selectedNotification} 
        onClose={() => setSelectedNotification(null)} 
      />
    );
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'client', label: 'Client Messages' },
    { id: 'management', label: 'Management' },
    { id: 'lab', label: 'Lab Notifications' },
  ];

  const filteredNotifications = notifications.filter(notif => 
    activeTab === 'all' ? true : notif.type === activeTab
  );

  const getIcon = (type) => {
    switch (type) {
      case 'client': return <MessageSquare size={14} className="text-blue-500" />;
      case 'management': return <ShieldAlert size={14} className="text-purple-500" />;
      case 'lab': return <FlaskConical size={14} className="text-emerald-500" />;
      default: return <Bell size={14} className="text-slate-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'client': return 'bg-blue-100';
      case 'management': return 'bg-purple-100';
      case 'lab': return 'bg-emerald-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Notifications</h1>
        </div>

        {/* Tabs - Scrollable horizontally */}
        <div className="overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1e3a8a] text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleNotificationClick(notif)}
              className={`bg-white p-3 rounded-2xl border ${notif.unread ? 'border-blue-200 shadow-sm' : 'border-slate-100'} flex gap-3 cursor-pointer transition-colors hover:bg-slate-50`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className={`text-[13px] font-bold truncate flex items-center gap-1 ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    <span className="truncate">{notif.clientName || notif.title}</span>
                  </h3>
                  <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap ml-2 mt-0.5">
                    {notif.time}
                  </span>
                </div>
                <p className={`text-[11px] leading-snug line-clamp-1 ${notif.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                  {notif.message}
                </p>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Bell size={32} className="text-slate-300" />
            <p className="text-sm font-medium">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
