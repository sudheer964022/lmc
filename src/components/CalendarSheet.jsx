import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarSheet = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(new Date(selectedDate));
    }
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month names list
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days of the week
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const day = new Date(y, m, 1).getDay();
    // Adjust to Monday-start: 0 (Mon) to 6 (Sun)
    return day === 0 ? 6 : day - 1;
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysInPreviousMonth = getDaysInMonth(year, month - 1);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar days array
  const calendarCells = [];

  // Previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPreviousMonth - i,
      monthOffset: -1,
      dateString: new Date(year, month - 1, daysInPreviousMonth - i).toISOString().split('T')[0]
    });
  }

  // Current month's days
  const todayStr = new Date().toISOString().split('T')[0];
  const selectedStr = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const date = new Date(year, month, i);
    // Fix timezone issues when generating dateString
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    const dateStr = localDate.toISOString().split('T')[0];

    calendarCells.push({
      day: i,
      monthOffset: 0,
      dateString: dateStr,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedStr
    });
  }

  // Next month's leading days to fill up the grid (6 rows * 7 columns = 42 cells)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      monthOffset: 1,
      dateString: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex flex-col justify-end transition-opacity duration-300">
      {/* Tap outside to close */}
      <div className="flex-1" onClick={onClose}></div>

      {/* Sheet Content */}
      <div className="bg-white rounded-t-[28px] shadow-[0_-10px_24px_rgba(0,0,0,0.12)] flex flex-col max-h-[85%] animate-slide-up pb-5 px-5 relative">
        {/* Clickable Drag Handle / Close indicator */}
        <button 
          onClick={onClose}
          className="w-full py-2 flex justify-center items-center shrink-0 focus:outline-none group active:scale-95 transition-transform"
        >
          <div className="w-10 h-1 bg-slate-200 group-hover:bg-slate-300 rounded-full transition-colors"></div>
        </button>

        {/* Month Selector Header */}
        <div className="flex items-center justify-between py-1 shrink-0">
          <button 
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-90 transition-transform"
          >
            <ChevronLeft size={16} />
          </button>
          
          <h2 className="text-sm font-black text-slate-900 tracking-tight">
            {monthNames[month]} {year}
          </h2>

          <button 
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-90 transition-transform"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Week Days Headers */}
        <div className="grid grid-cols-7 gap-y-1.5 mt-2.5 text-center shrink-0">
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-semibold text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 mt-2 text-center">
          {calendarCells.map((cell, idx) => {
            const isCurrentMonth = cell.monthOffset === 0;
            const isFuture = cell.dateString > todayStr;
            
            let btnClass = "w-9 h-9 mx-auto flex flex-col items-center justify-center rounded-lg transition-all relative ";

            if (!isCurrentMonth) {
              btnClass += "text-slate-350 pointer-events-none opacity-25";
            } else if (isFuture) {
              btnClass += "text-slate-300 pointer-events-none opacity-20 cursor-not-allowed";
            } else if (cell.isSelected) {
              btnClass += "bg-blue-600 text-white shadow-sm shadow-blue-600/20";
            } else if (cell.isToday) {
              btnClass += "bg-blue-50 text-blue-600 border border-blue-150";
            } else {
              btnClass += "text-slate-700 hover:bg-slate-50 active:scale-90";
            }

            return (
              <button
                key={idx}
                disabled={!isCurrentMonth || isFuture}
                onClick={() => {
                  onSelectDate(cell.dateString);
                }}
                className={btnClass}
              >
                <span className="text-xs font-bold leading-none">{cell.day}</span>
                {cell.isToday && (
                  <span className={`text-[6px] font-black tracking-wider uppercase mt-0.5 leading-none ${cell.isSelected ? 'text-white/80' : 'text-blue-500'}`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Done Button */}
        <div className="mt-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarSheet;
