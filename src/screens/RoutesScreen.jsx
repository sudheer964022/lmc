import React, { useState } from 'react';
import { Navigation, MapPin, ChevronLeft, Menu, CornerUpRight, Play, X, ArrowUpRight, Bike } from 'lucide-react';
import { emergencyPickups, newSamples } from '../data/mockData';
import ClientDetails from '../components/ClientDetails';

const RoutesScreen = ({ setCurrentScreen, setIsSidebarOpen }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showNearbyClients, setShowNearbyClients] = useState(false);
  const [navState, setNavState] = useState('idle'); // 'idle', 'directions', 'navigating'

  // Combine, filter, and sort by distance to get "Nearby Clients"
  const nearbyClients = [...emergencyPickups, ...newSamples]
    .filter(client => client.distance !== undefined)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Take top 5 closest

  if (selectedClient) {
    return (
      <ClientDetails 
        client={selectedClient} 
        onClose={() => setSelectedClient(null)} 
        setCurrentScreen={setCurrentScreen}
      />
    );
  }

  // Advanced Algorithm: Traffic-adjusted ETA calculation based on real distance
  const calculateRouteDetails = (distanceStr) => {
    if (!distanceStr) return { mins: 12, arrival: '10:45 AM' };
    const dist = parseFloat(distanceStr);
    const speedKmh = 18; // Simulated real-time city traffic speed
    const mins = Math.max(1, Math.ceil((dist / speedKmh) * 60));
    
    // Calculate arrival time dynamically
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + mins);
    const arrival = arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return { mins, arrival };
  };

  const routeDetails = calculateRouteDetails(selectedLocation?.distance);

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Top Map View Area */}
      <div className="flex-1 bg-slate-200 relative overflow-hidden flex flex-col" style={{ perspective: '1000px' }}>
        <div className={`absolute inset-0 scale-[1.20] origin-center -mt-6 transition-transform duration-1000 ${navState === 'navigating' ? 'animate-map-tilt' : ''}`}>
          <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.20%2C13.04%2C80.25%2C13.08&amp;layer=mapnik"
            className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" 
            style={{ border: 0 }}
            title="Routes Map"
          ></iframe>
        </div>
        
        {/* Interactive overlay to close popups */}
        {navState === 'idle' && (
          <div 
            className="absolute inset-0 bg-slate-500/10 pointer-events-auto"
            onClick={() => {
              setShowNearbyClients(false);
              setSelectedLocation(null);
            }}
          ></div>
        )}
        
        {/* Header over Map */}
        {navState !== 'navigating' && (
          <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between pointer-events-none transition-opacity">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button 
                onClick={() => {
                  if (navState === 'directions') {
                    setNavState('idle');
                  } else {
                    setIsSidebarOpen(true);
                  }
                }} 
                className="p-2 -ml-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white rounded-full shadow-sm transition-colors"
              >
                {navState === 'directions' ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
              {navState === 'idle' && (
                <button 
                  onClick={() => setCurrentScreen('home')} 
                  className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white rounded-full shadow-sm transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Navigation Header */}
        <div className={`absolute top-0 left-0 right-0 z-40 bg-emerald-600 text-white shadow-lg transition-transform duration-500 ${navState === 'navigating' ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="pt-12 pb-6 px-6 flex items-start gap-4">
            <div className="mt-1">
              <ArrowUpRight size={36} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold">300 m</div>
              <div className="text-emerald-100 font-medium text-lg mt-1">Turn right onto Greams Road</div>
            </div>
          </div>
        </div>

        {/* GPS Route lines */}
        {navState === 'idle' ? (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="routeGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Primary animated route */}
            <path d="M 50% 50% C 40% 44%, 30% 38%, 25% 35%"
              stroke="url(#routeGradMain)" strokeWidth="4" strokeLinecap="round" fill="none"
              strokeDasharray="8 5" className="animate-route-dash" />
            {/* Secondary faint route */}
            <path d="M 50% 50% C 60% 55%, 70% 58%, 75% 60%"
              stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="5 4" fill="none" opacity="0.5" />
          </svg>
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="routeGradNav" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path d="M 50% 50% C 60% 45%, 70% 55%, 75% 60%"
              stroke="url(#routeGradNav)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 50% 50% C 60% 45%, 70% 55%, 75% 60%"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
              strokeDasharray="10 10" className="animate-route-dash" opacity="0.7" />
          </svg>
        )}

        {/* Current Location Marker — Bike */}
        <div 
          onClick={(e) => { e.stopPropagation(); setShowNearbyClients(true); }}
          className={`absolute top-1/2 left-1/2 flex flex-col items-center z-20 cursor-pointer pointer-events-auto ${navState === 'navigating' ? 'animate-drive' : 'transform -translate-x-1/2 -translate-y-1/2'}`}
        >
          <div
            className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center border-[2.5px] border-white active:scale-95 transition-transform"
            style={{
              boxShadow: '0 0 0 4px rgba(37,99,235,0.25), 0 4px 16px rgba(37,99,235,0.5)',
              animation: navState === 'navigating' ? 'bike-bob 1.4s ease-in-out infinite' : 'glow-pulse 2.5s ease-in-out infinite',
            }}
          >
            <Bike size={20} className="text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
          </div>
        </div>

        {/* Client Markers */}
        {navState === 'idle' && nearbyClients.slice(0, 3).map((client, index) => {
          const positions = [
            'top-[35%] left-[25%]',
            'top-[60%] left-[75%]',
            'top-[35%] left-[80%]',
          ];
          return (
            <div 
              key={client.id} 
              onClick={() => setSelectedLocation(client)}
              className={`absolute ${positions[index]} transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto cursor-pointer z-10 transition-transform active:scale-95`}
            >
              <div className="drop-shadow-md mb-0.5">
                <MapPin 
                  size={24} 
                  fill={index === 0 ? "#10b981" : "#ef4444"} 
                  color="white" 
                  strokeWidth={1.5} 
                />
              </div>
              <div className="bg-white px-2 py-0.5 rounded shadow text-[9px] font-bold text-slate-700 whitespace-nowrap border border-slate-100">
                {client.clientName}
              </div>
            </div>
          );
        })}

        {/* Selected Destination Marker (Only shown in directions/navigating) */}
        {(navState === 'directions' || navState === 'navigating') && selectedLocation && (
          <div className="absolute top-[60%] left-[75%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="mb-0 animate-bounce drop-shadow-xl z-10">
              <MapPin 
                size={40} 
                fill="#ef4444" 
                color="white" 
                strokeWidth={1.5} 
              />
            </div>
            <div className="relative bg-white px-3 py-1.5 rounded-lg shadow-lg text-sm font-bold text-slate-800 whitespace-nowrap border border-slate-200 mt-0.5">
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45"></div>
              {selectedLocation.clientName}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet - Nearby Clients */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col transition-transform duration-300 ${(showNearbyClients && navState === 'idle') ? 'translate-y-0' : 'translate-y-full'}`}>
        <div 
          className="flex justify-center pt-3 pb-1 cursor-pointer"
          onClick={() => setShowNearbyClients(false)}
        >
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Nearby Clients</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {nearbyClients.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide flex flex-col gap-3">
          {nearbyClients.map(client => (
            <div 
              key={`${client.id}-${client.clientName}`} 
              onClick={() => setSelectedLocation(client)}
              className="border border-slate-100 bg-white shadow-sm p-4 rounded-2xl flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Bike size={17} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm truncate">{client.clientName}</h3>
                <div className="flex items-center gap-1 mt-0.5 text-xs font-semibold text-slate-500">
                  <MapPin size={11} className="text-slate-400 shrink-0" />
                  <span className="truncate">{client.location}</span>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap border border-emerald-100 shrink-0">
                {client.distance} km
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Location Bottom Sheet (Google Maps Style - Light Theme) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${selectedLocation && navState === 'idle' ? 'translate-y-0' : 'translate-y-full'}`}>
        <div 
          className="flex justify-center pt-3 pb-2 cursor-pointer"
          onClick={() => setSelectedLocation(null)}
        >
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
        
        {selectedLocation && (
          <div className="px-5 pb-8 pt-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">{selectedLocation.clientName}</h2>
                <p className="text-sm text-slate-500 font-medium">{selectedLocation.distance} km • {selectedLocation.location}</p>
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              <button 
                onClick={() => setNavState('directions')}
                className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap active:scale-95 transition-transform flex-1"
              >
                <CornerUpRight size={18} />
                Directions
              </button>
              
              <button 
                onClick={() => setNavState('navigating')}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap active:scale-95 transition-transform shadow-md shadow-blue-600/30 flex-1"
              >
                <Play size={18} fill="currentColor" />
                Start
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Directions Route Preview Bottom Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${navState === 'directions' ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-3xl font-bold text-emerald-600">{routeDetails.mins} min</div>
              <div className="text-slate-500 font-medium">{selectedLocation?.distance} km • Fastest route</div>
            </div>
            <button 
              onClick={() => setNavState('navigating')}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold text-lg whitespace-nowrap active:scale-95 transition-transform shadow-lg shadow-emerald-600/30"
            >
              <Play size={20} fill="currentColor" />
              Start
            </button>
          </div>
        </div>
      </div>

      {/* Live Navigation Bottom Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white text-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-40 flex flex-col transition-transform duration-300 ${navState === 'navigating' ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-800">{routeDetails.mins} min</div>
            <div className="text-slate-500 font-medium">{routeDetails.arrival} • {selectedLocation?.distance} km</div>
          </div>
          <button 
            onClick={() => setNavState('idle')}
            className="flex items-center justify-center bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap active:scale-95 transition-transform"
          >
            <X size={16} />
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoutesScreen;
