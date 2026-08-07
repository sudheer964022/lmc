import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import CalendarSheet from '../components/CalendarSheet';

const AttendanceScreen = ({ setCurrentScreen }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Helper to determine status and generate unique visits based on selected date
  const getDayStatus = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayOfMonth = date.getDate();

    // Weekends (0 = Sunday, 6 = Saturday) as weekly off
    if (day === 0) {
      return { active: false, reason: 'Weekly Off (Sunday)', visits: [] };
    }
    if (day === 6) {
      return { active: false, reason: 'Weekly Off (Saturday)', visits: [] };
    }

    // Dynamic pool of Coimbatore client visit templates
    const allTemplates = [
      { time: '08:30 AM', client: 'Ganga Hospital', location: 'RS Puram, Coimbatore', samples: ['Blood', 'Troponin'], status: 'Collected' },
      { time: '09:15 AM', client: 'Kovai Medical Center (KMCH)', location: 'Peelamedu, Coimbatore', samples: ['Nasal Swab', 'Throat Swab'], status: 'Collected' },
      { time: '10:42 AM', client: 'PSG Hospitals', location: 'Gandhipuram, Coimbatore', samples: ['Blood', 'Plasma', 'Serum'], status: 'Collected' },
      { time: '11:30 AM', client: 'Sri Ramakrishna Hospital', location: 'Race Course, Coimbatore', samples: ['Blood Serum'], status: 'Collected' },
      { time: '01:15 PM', client: 'KG Hospital', location: 'Singanallur, Coimbatore', samples: ['Blood', 'Urine', 'CSF'], status: 'Collected' },
      { time: '02:45 PM', client: 'Aravind Eye Hospital', location: 'Saibaba Colony, Coimbatore', samples: ['Stat: Dengue serology'], status: 'Collected' },
      { time: '04:00 PM', client: 'Masonic Hospital', location: 'Race Course, Coimbatore', samples: ['Syringes', 'Reagents'], status: 'Delivered', taskType: 'delivery' },
      { time: '05:30 PM', client: 'G.K.N.M. Hospital', location: 'Ramanathapuram, Coimbatore', samples: ['Cross-match blood'], status: 'Collected' }
    ];

    // Select a unique subset of visits based on the day of the month
    let selectedVisits = [];
    if (dayOfMonth % 3 === 0) {
      selectedVisits = [allTemplates[0], allTemplates[2], allTemplates[6]];
    } else if (dayOfMonth % 3 === 1) {
      selectedVisits = [allTemplates[1], allTemplates[3], allTemplates[6]];
    } else {
      selectedVisits = [allTemplates[2], allTemplates[4], allTemplates[6]];
    }

    // Older dates (older than today) should mark all visits as "Delivered"
    const todayStr = new Date().toISOString().split('T')[0];
    const isPast = dateStr < todayStr;
    if (isPast) {
      selectedVisits = selectedVisits.map(v => ({ ...v, status: 'Delivered' }));
    }

    return {
      active: true,
      reason: 'Duty Active (On-Field)',
      visits: selectedVisits
    };
  };

  const statusInfo = getDayStatus(selectedDate);
  const formattedDateString = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col animate-fade-in-up overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentScreen('home')} 
            className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Attendance Log</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 pb-20 flex flex-col gap-3.5">
        
        {/* Date Selector Banner */}
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Viewing Attendance for</span>
            <span className="text-[12px] font-black text-slate-700 mt-0.5">{formattedDateString}</span>
          </div>
          
          <button 
            onClick={() => setShowCalendar(true)}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-sm"
          >
            <Calendar size={16} />
          </button>
        </div>

        {/* Attendance Status Badge */}
        <div className={`p-3 rounded-2xl border flex items-center gap-2.5 shadow-sm ${
          statusInfo.active 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-slate-100 border-slate-200 text-slate-750'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${statusInfo.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider">
              {statusInfo.active ? 'Active on Duty' : 'Inactive / Off-Duty'}
            </span>
            <span className="text-[9px] opacity-75 font-semibold mt-0.5">
              {statusInfo.active ? 'Logged In • Tracking Active' : statusInfo.reason}
            </span>
          </div>
        </div>

        {/* Places Visited & Client Samples Log */}
        {statusInfo.active ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Visits, Samples & Deliveries</h3>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg text-[8px] font-bold">
                {statusInfo.visits.length} Tasks
              </span>
            </div>

            <div className="space-y-2.5 relative before:absolute before:top-2 before:bottom-2 before:left-[43px] before:w-[1.5px] before:bg-slate-200">
              {statusInfo.visits.map((visit, index) => (
                <div key={index} className="flex items-start relative z-10">
                  {/* Time label on the left */}
                  <div className="w-9 text-[9px] font-black text-blue-755 text-right pr-1.5 mt-2 shrink-0">
                    {visit.time.replace(' AM', '').replace(' PM', '')}
                    <span className="text-[6.5px] block font-bold text-slate-400 leading-none">
                      {visit.time.includes('AM') ? 'AM' : 'PM'}
                    </span>
                  </div>

                  {/* Small Timeline Bullet Dot */}
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shrink-0 shadow-sm z-20 mt-2 mx-0.5">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                  </div>

                  {/* Visit Card */}
                  <div className="flex-1 bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm space-y-1.5 ml-2">
                    <div className="flex justify-between items-start gap-1.5">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-800 text-[11px] truncate leading-snug">{visit.client}</h4>
                      </div>
                      <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                        visit.status === 'Delivered' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[8px] font-semibold text-slate-400">
                      <MapPin size={9} className="shrink-0" />
                      <span className="truncate">{visit.location}</span>
                    </div>

                    <div className="h-px bg-slate-50" />

                    <div>
                      <p className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{visit.taskType === 'delivery' ? 'Materials' : 'Samples'}</p>
                      <div className="flex flex-wrap gap-1">
                        {visit.samples.map((s, idx) => (
                          <span key={idx} className={`px-1 py-0.5 rounded text-[7px] font-extrabold border ${visit.taskType === 'delivery' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-100 text-slate-600 border-slate-200/40'}`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 py-6 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
              <Clock size={16} />
            </div>
            <h4 className="font-extrabold text-slate-800 text-xs">No Active Duty Found</h4>
            <p className="text-slate-400 text-[9px] mt-1 max-w-[190px] leading-relaxed font-medium">
              No collection logs were recorded on this day. Select a weekday to view sample collection reports.
            </p>
          </div>
        )}

      </div>

      {/* Embedded Date Picker Modal */}
      <CalendarSheet 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
        selectedDate={selectedDate} 
        onSelectDate={(date) => {
          setSelectedDate(date);
          setShowCalendar(false);
        }} 
      />
    </div>
  );
};

export default AttendanceScreen;
