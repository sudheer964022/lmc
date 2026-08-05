import React, { useState } from 'react';
import { Menu, Calendar, MapPin, Search } from 'lucide-react';
import { emergencyPickups, newSamples } from '../data/mockData';

const TasksScreen = ({ setIsSidebarOpen, setCurrentScreen }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine mock data
  const allTasks = [...emergencyPickups, ...newSamples];
  
  // Filter by tab
  let filteredTasks = allTasks;
  switch (activeTab) {
    case 'pending':
      filteredTasks = allTasks.slice(0, Math.floor(allTasks.length / 2));
      break;
    case 'completed':
      filteredTasks = allTasks.slice(Math.floor(allTasks.length / 2));
      break;
    case 'high':
      filteredTasks = allTasks.filter(t => t.badge === 'High' || t.badge === 'Urgent');
      break;
    default:
      break;
  }

  // Filter by search
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(t => t.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top App Bar */}
      <div className="bg-blue-600 text-white px-4 py-4 flex justify-between items-center z-10 shadow-sm sticky top-0">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 -ml-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-bold text-lg">Tasks</h1>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      {/* Date Filter & Search Row */}
      <div className="bg-white px-4 py-3 shadow-sm z-10">
        <div className="flex gap-2 items-center mb-3">
          <div className="flex-1 bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="bg-transparent border-none outline-none w-full text-xs font-medium text-slate-700 placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="bg-blue-50 text-blue-700 p-2.5 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-1.5">
              <Calendar size={16} />
            </button>
          </div>
        </div>

        {/* Date Display */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-800">
            {selectedDate === new Date().toISOString().split('T')[0] ? 'Today, ' : ''}
            {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filteredTasks.length} Tasks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 pb-3 shadow-sm z-10">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'high', label: 'High Priority' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors truncate px-1 ${
                activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50 flex flex-col p-4 gap-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2 relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer shrink-0">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full ${item.colorClass || 'bg-slate-100'} flex items-center justify-center font-bold text-sm shrink-0`}>
                    {item.initials || 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{item.clientName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
                {item.badge && (
                  <div className={`${item.badge === 'New' ? 'bg-indigo-500' : 'bg-red-500'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0`}>
                    {item.badge}
                  </div>
                )}
              </div>
              
              {/* Samples */}
              {item.samples && item.samples.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1 ml-13">
                  {item.samples.map((s, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="h-px bg-slate-50 mt-1" />
              
              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin size={10} />
                  <span className="truncate max-w-[120px]">{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{item.time || '10:00 AM'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 pb-10">
            <Calendar size={32} className="opacity-50" />
            <p className="text-sm font-medium">No tasks found for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksScreen;
