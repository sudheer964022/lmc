import React from 'react';
import { ArrowLeft, MessageSquare, ShieldAlert, FlaskConical, Bell, Calendar, Clock } from 'lucide-react';

const NotificationDetails = ({ notification, onClose }) => {
  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'client': return <MessageSquare size={24} className="text-blue-500" />;
      case 'management': return <ShieldAlert size={24} className="text-purple-500" />;
      case 'lab': return <FlaskConical size={24} className="text-emerald-500" />;
      default: return <Bell size={24} className="text-slate-500" />;
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

  const getTypeLabel = (type) => {
    switch (type) {
      case 'client': return 'Client Message';
      case 'management': return 'Management Update';
      case 'lab': return 'Lab Alert';
      default: return 'Notification';
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col h-full overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Message Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Notification Icon & Title Area */}
        <div className="flex flex-col items-center text-center gap-3 mt-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getBgColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
          <div>
            <div className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-2">
              {getTypeLabel(notification.type)}
            </div>
            <h2 className="text-xl font-black text-slate-800 leading-tight">
              {notification.title}
            </h2>
            {notification.clientName && (
              <div className="text-sm font-semibold text-blue-600 mt-1">
                {notification.clientName}
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 mt-2">
          
          {/* Metadata */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock size={16} />
              <span className="text-sm font-medium">{notification.time}</span>
            </div>
            {notification.unread && (
               <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                 UNREAD
               </div>
            )}
          </div>

          {/* Full Message Body */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {notification.message}
            </p>
          </div>

        </div>

      </div>
      
      {/* Bottom Action Area (Optional padding for bottom nav if needed) */}
      <div className="pb-8"></div>
    </div>
  );
};

export default NotificationDetails;
