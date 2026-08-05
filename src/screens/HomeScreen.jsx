import React, { useState } from 'react';
import { 
  Menu, Bell, MapPin, CheckCircle2, Clock, AlertTriangle, 
  Activity, TrendingUp, ShieldAlert, FileText, ChevronRight, ArrowLeft, Search, SlidersHorizontal,
  Bike, X, Navigation
} from 'lucide-react';
import { emergencyPickups, newSamples } from '../data/mockData';
import FilterSheet from '../components/FilterSheet';
import ClientDetails from '../components/ClientDetails';

const HomeScreen = ({ setIsSidebarOpen, setCurrentScreen }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeListView, setActiveListView] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [activeFilter, setActiveFilter] = useState('date');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNotif, setShowNotif] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFilteredAndSortedData = (data) => {
    let filtered = data.filter(item => item.clientName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (activeFilter === 'distance') {
      return filtered.sort((a, b) => a.distance - b.distance);
    }
    return filtered; // Defaults to date/time as in mockData
  };

  if (selectedClient) {
    return (
      <ClientDetails 
        client={selectedClient} 
        onClose={() => setSelectedClient(null)} 
        setCurrentScreen={setCurrentScreen}
      />
    );
  }

  let listData = [];
  let listTitle = '';
  
  if (activeListView) {
    switch (activeListView) {
      case 'emergency':
        listData = emergencyPickups;
        listTitle = 'Emergency Pickups';
        break;
      case 'newSamples':
        listData = newSamples;
        listTitle = 'New Samples Assigned';
        break;
      case 'all':
        listData = [...emergencyPickups, ...newSamples];
        listTitle = 'All Tasks';
        break;
      case 'pending':
        listData = [...emergencyPickups, ...newSamples].slice(0, 5); // Mock pending data
        listTitle = 'Pending Tasks';
        break;
      case 'completed':
        listData = [...emergencyPickups, ...newSamples].slice(5, 12); // Mock completed data
        listTitle = 'Completed Tasks';
        break;
      case 'highPriority':
        listData = [...emergencyPickups, ...newSamples].filter(p => p.badge === 'High' || p.badge === 'Urgent');
        listTitle = 'High Priority Tasks';
        break;
      default:
        break;
    }

    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-hidden">
        {/* Header with back button */}
        <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveListView(null)} 
              className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800">{listTitle}</h1>
          </div>
          
          {/* Tabs: All / Pending / Completed */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {['all', 'pending', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveListView(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${
                  activeListView === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-2">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="bg-transparent border-none outline-none w-full text-xs font-medium text-slate-700 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilterSheet(true)}
              className="bg-slate-800 text-white p-2.5 rounded-xl hover:bg-slate-700 transition-colors active:scale-95"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white flex flex-col">
          {getFilteredAndSortedData(listData).map((item) => (
            <div key={item.id + item.clientName} onClick={() => setSelectedClient(item)} className="px-3 py-2.5 border-b border-slate-100 flex items-start gap-3 active:bg-slate-50 transition-colors cursor-pointer">
              <div className={`w-8 h-8 rounded-full ${item.colorClass} flex items-center justify-center font-bold text-sm shrink-0`}>
                {item.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{item.clientName}</h3>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ml-2 ${item.badge === 'New' || !item.badge ? 'text-slate-400' : 'text-red-500'}`}>{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 truncate mb-1">{item.description}</p>
                {item.samples && item.samples.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {item.samples.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <MapPin size={10} />
                    <span className="truncate">{item.location}</span>
                  </div>
                  {item.badge && (
                    <div className={`${item.badge === 'New' ? 'bg-indigo-500' : 'bg-red-500'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>
                      {item.badge}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <FilterSheet 
          isOpen={showFilterSheet} 
          onClose={() => setShowFilterSheet(false)} 
          onApply={(filter) => setActiveFilter(filter)}
          initialFilter={activeFilter}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top App Bar */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 -ml-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">{getGreeting()},</span>
              <span className="text-lg font-black text-slate-800 leading-tight tracking-tight">Sudheer</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                2
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="bg-blue-100 p-1 rounded-full text-blue-700">
              <MapPin size={14} />
            </div>
            <span className="text-xs font-medium">Coimbatore</span>
          </div>
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm ${
              isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>
      </div>

      

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-4 pb-24 flex flex-col gap-6">
        
        {/* Priority Alerts */}
        <div className="flex flex-col gap-3">
          <div onClick={() => setActiveListView('emergency')} className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 text-white p-2 rounded-xl shadow-md shadow-red-500/20">
                <ShieldAlert size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-red-900 leading-tight">Emergency Pickup</span>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {emergencyPickups.length}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-red-700">Action Required Immediately</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-red-400" />
          </div>

          <div onClick={() => setActiveListView('newSamples')} className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-600/20">
                <FileText size={20} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-blue-600 leading-tight">New Sample Assigned</span>
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {newSamples.length}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-blue-700">Added 5 mins ago</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-blue-400" />
          </div>
        </div>

        {/* Today's Summary Cards */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Today's Summary</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div onClick={() => setActiveListView('all')} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                  <Activity size={18} />
                </div>
                <span className="text-xl font-black text-slate-800">{emergencyPickups.length + newSamples.length}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Tasks</span>
            </div>

            <div onClick={() => setActiveListView('pending')} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
                  <Clock size={18} />
                </div>
                <span className="text-xl font-black text-slate-800">5</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</span>
            </div>

            <div onClick={() => setActiveListView('completed')} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-xl font-black text-slate-800">7</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed</span>
            </div>

            <div onClick={() => setActiveListView('highPriority')} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1 cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
                  <AlertTriangle size={18} />
                </div>
                <span className="text-xl font-black text-slate-800">{[...emergencyPickups, ...newSamples].filter(p => p.badge === 'High' || p.badge === 'Urgent').length}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">High Priority</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Performance</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Collection Rate */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-14 h-14 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600 drop-shadow-sm transition-all duration-1000 ease-out"
                    strokeDasharray="95, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-700">95%</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 leading-tight">Collection Rate</span>
            </div>

            {/* Completion Rate */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-14 h-14 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 drop-shadow-sm transition-all duration-1000 ease-out"
                    strokeDasharray="80, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-700">80%</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-600 leading-tight">Completion Rate</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default HomeScreen;
