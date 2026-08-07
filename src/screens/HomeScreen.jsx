import React, { useState } from 'react';
import {
  Menu, Bell, MapPin, CheckCircle2, Clock, AlertTriangle, Package,
  Activity, TrendingUp, ShieldAlert, FileText, ChevronRight, ArrowLeft, Search, SlidersHorizontal,
  Bike, X, Navigation, FlaskConical
} from 'lucide-react';
import { emergencyPickups, newSamples } from '../data/mockData';
import FilterSheet from '../components/FilterSheet';
import ClientDetails from '../components/ClientDetails';
import CalendarSheet from '../components/CalendarSheet';

// ── Separate deliveries from sample tasks ───────────────────────────────────
const allItems        = [...emergencyPickups, ...newSamples];
const deliveryItems   = allItems.filter(i => i.taskType === 'delivery');
const collectionItems = allItems.filter(i => i.taskType !== 'delivery');
const urgentPickups   = collectionItems.filter(i => i.badge === 'High' || i.badge === 'Urgent');

const HomeScreen = ({ setIsSidebarOpen, setCurrentScreen }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeListView, setActiveListView] = useState(null); // SECTION: 'deliveries' | 'newSamples' | 'emergency'
  const [listTab, setListTab] = useState('all');              // TAB within section
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to a section and optionally pre-select a tab
  const navigate = (section, tab = 'all') => {
    setActiveListView(section);
    setListTab(tab);
  };
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [activeFilter, setActiveFilter] = useState('date');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNotif, setShowNotif] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendarSheet, setShowCalendarSheet] = useState(false);

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
        client={ selectedClient }
        onClose={ () => setSelectedClient(null) }
        setCurrentScreen={ setCurrentScreen }
      />
    );
  }

  let listData = [];
  let listTitle = '';

  if (activeListView) {
    // 1. Determine the BASE dataset from the section
    let baseData = [];
    let listTitle = '';
    const isDeliveryContext = activeListView === 'deliveries';

    switch (activeListView) {
      case 'emergency':
        baseData  = urgentPickups;
        listTitle = 'Emergency Pickups';
        break;
      case 'newSamples':
        baseData  = collectionItems;
        listTitle = 'Sample Collections';
        break;
      case 'deliveries':
        baseData  = deliveryItems;
        listTitle = 'Material Deliveries';
        break;
      default:
        baseData  = allItems;
        listTitle = 'All Tasks';
        break;
    }

    // 2. Apply tab filter within that section
    let listData = baseData;
    switch (listTab) {
      case 'pending':
        listData = isDeliveryContext
          ? baseData                                                          // all deliveries are pending
          : baseData.filter(i => i.badge !== '' && i.badge !== 'New');
        break;
      case 'high':
        listData = isDeliveryContext
          ? baseData                                                          // deliveries shown as-is under 'High'
          : baseData.filter(i => i.badge === 'High' || i.badge === 'Urgent');
        break;
      case 'done':
        listData = baseData.slice(Math.ceil(baseData.length / 2));           // mock: last half = done
        break;
      default: // 'all'
        listData = baseData;
        break;
    }

    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col overflow-hidden">
        {/* Header with back button */ }
        <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={ () => setActiveListView(null) }
              className="p-1 -ml-1 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={ 20 } />
            </button>
            <h1 className="text-lg font-bold text-slate-800">{ listTitle }</h1>
          </div>

          {/* Tabs — filter WITHIN the current section */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            { [
              { id: 'all',     label: 'All'     },
              { id: 'pending', label: 'Pending'  },
              { id: 'high',    label: 'High'     },
              { id: 'done',    label: 'Done'     }
            ].map(tab => (
              <button
                key={ tab.id }
                onClick={ () => setListTab(tab.id) }
                className={ `flex-1 py-1.5 text-[10px] sm:text-xs font-extrabold rounded-lg transition-colors ${
                  listTab === tab.id
                    ? isDeliveryContext
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }` }
              >
                { tab.label }
              </button>
            )) }
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-slate-100 rounded-xl px-3 flex items-center gap-2 h-8">
              <Search size={ 16 } className="text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="bg-transparent border-none outline-none w-full text-xs font-medium text-slate-700 placeholder:text-slate-400"
                value={ searchQuery }
                onChange={ (e) => setSearchQuery(e.target.value) }
              />
            </div>
            <button
              onClick={ () => setShowFilterSheet(true) }
              className="bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors active:scale-95 h-8 w-8 flex items-center justify-center shrink-0"
            >
              <SlidersHorizontal size={ 16 } />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white flex flex-col">
          { getFilteredAndSortedData(listData).map((item) => (
            <div key={ item.id + item.clientName } onClick={ () => setSelectedClient(item) } className="px-3 py-2.5 border-b border-slate-100 flex items-start gap-3 active:bg-slate-50 transition-colors cursor-pointer">
              <div className={ `w-8 h-8 rounded-full ${item.colorClass} flex items-center justify-center font-bold text-sm shrink-0` }>
                { item.initials }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{ item.clientName }</h3>
                  <span className={ `text-[10px] font-semibold whitespace-nowrap ml-2 ${item.badge === 'New' || !item.badge ? 'text-slate-400' : 'text-red-500'}` }>{ item.time }</span>
                </div>
                <p className="text-xs text-slate-600 truncate mb-1">{ item.description }</p>
                { item.samples && item.samples.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    { item.samples.map((s, idx) => (
                      <span key={ idx } className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${item.taskType === 'delivery' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-100 text-slate-600'}`}>
                        { s }
                      </span>
                    )) }
                  </div>
                ) }
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                    <MapPin size={ 10 } />
                    <span className="truncate">{ item.location }</span>
                  </div>
                  { (item.badge || activeListView === 'completed') && (
                    <div className={ `${activeListView === 'completed' ? 'bg-emerald-500' : item.badge === 'New' ? 'bg-indigo-500' : item.badge === 'Delivery' ? 'bg-purple-500' : 'bg-red-500'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full` }>
                      { activeListView === 'completed' && item.taskType === 'delivery' ? 'Delivered' : activeListView === 'completed' ? 'Collected' : item.badge }
                    </div>
                  ) }
                </div>
              </div>
            </div>
          )) }
        </div>
        <FilterSheet
          isOpen={ showFilterSheet }
          onClose={ () => setShowFilterSheet(false) }
          onApply={ (filter) => {
            setActiveFilter(filter);
            if (filter === 'date') {
              setShowCalendarSheet(true);
            }
          } }
          initialFilter={ activeFilter }
        />
        <CalendarSheet
          isOpen={ showCalendarSheet }
          onClose={ () => setShowCalendarSheet(false) }
          selectedDate={ selectedDate }
          onSelectDate={ (date) => {
            setSelectedDate(date);
          } }
        />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top App Bar */ }
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={ () => setIsSidebarOpen(true) }
              className="p-2 -ml-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Menu size={ 20 } />
            </button>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">{ getGreeting() },</span>
              <span className="text-lg font-black text-slate-800 leading-tight tracking-tight">Sudheer</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={ 20 } />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                2
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="bg-blue-100 p-1 rounded-full text-blue-700">
              <MapPin size={ 14 } />
            </div>
            <span className="text-xs font-medium">Coimbatore</span>
          </div>

          <button
            onClick={ () => setIsOnline(!isOnline) }
            className={ `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }` }
          >
            <span className={ `w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}` }></span>
            { isOnline ? 'ONLINE' : 'OFFLINE' }
          </button>
        </div>
      </div>



      {/* Main Content */ }
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-4 pb-24 flex flex-col gap-6">

        {/* Priority Alerts - 3 separate cards */}
        <div className="flex flex-col gap-3">

          {/* Emergency Pickups */}
          <div onClick={ () => navigate('emergency', 'all') } className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/4325/4325930.png" alt="Emergency" className="w-[28px] h-[28px] object-contain drop-shadow-sm shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-red-900 leading-tight">Emergency Pickup</span>
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    { urgentPickups.length }
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-red-700">Action Required Immediately</span>
              </div>
            </div>
            <ChevronRight size={ 18 } className="text-red-400" />
          </div>

          {/* Sample Collections */}
          <div onClick={ () => navigate('newSamples', 'all') } className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-[28px] h-[28px] bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <FlaskConical size={ 16 } className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-blue-700 leading-tight">Sample Collections</span>
                  <span className="bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    { collectionItems.length }
                  </span>
                </div>
                <span className="text-[11px] font-medium text-blue-600">Lab pickups assigned today</span>
              </div>
            </div>
            <ChevronRight size={ 18 } className="text-blue-400" />
          </div>

          {/* Material Deliveries - NEW separate card */}
          <div onClick={ () => navigate('deliveries', 'all') } className="bg-purple-50 border border-purple-100 p-3 rounded-2xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-purple-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-[28px] h-[28px] bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Package size={ 16 } className="text-purple-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-purple-800 leading-tight">Material Deliveries</span>
                  <span className="bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    { deliveryItems.length }
                  </span>
                </div>
                <span className="text-[11px] font-medium text-purple-700">Containers &amp; supplies to drop</span>
              </div>
            </div>
            <ChevronRight size={ 18 } className="text-purple-400" />
          </div>

        </div>

        {/* Today's Summary */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Today's Summary</h2>

          {/* ── Sample Pickups Section ── */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <FlaskConical size={ 13 } className="text-white" />
              </div>
              <span className="text-[12px] font-black text-blue-800 uppercase tracking-wide">Sample Pickups</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={ () => navigate('newSamples', 'all') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-blue-100"
              >
                <span className="text-xl font-black text-blue-700">{ collectionItems.length }</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Total</span>
              </div>
              <div
                onClick={ () => navigate('newSamples', 'pending') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-blue-100"
              >
                <span className="text-xl font-black text-amber-600">{ collectionItems.slice(0, 5).length }</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Pending</span>
              </div>
              <div
                onClick={ () => navigate('emergency', 'all') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-blue-100"
              >
                <span className="text-xl font-black text-red-600">{ urgentPickups.length }</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Urgent</span>
              </div>
            </div>
          </div>

          {/* ── Material Deliveries Section ── */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <Package size={ 13 } className="text-white" />
              </div>
              <span className="text-[12px] font-black text-purple-800 uppercase tracking-wide">Material Deliveries</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div
                onClick={ () => navigate('deliveries', 'all') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-purple-100"
              >
                <span className="text-xl font-black text-purple-700">{ deliveryItems.length }</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Total</span>
              </div>
              <div
                onClick={ () => navigate('deliveries', 'pending') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-purple-100"
              >
                <span className="text-xl font-black text-amber-600">{ deliveryItems.slice(0, 3).length }</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Pending</span>
              </div>
              <div
                onClick={ () => navigate('deliveries', 'done') }
                className="bg-white rounded-xl p-2.5 flex flex-col items-center cursor-pointer active:scale-95 transition-transform shadow-sm border border-purple-100"
              >
                <span className="text-xl font-black text-emerald-600">2</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Performance</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Collection Rate */ }
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

            {/* Completion Rate */ }
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
